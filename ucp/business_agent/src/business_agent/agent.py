# Copyright 2026 UCP Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""UCP."""

import logging
logger = logging.getLogger("business_agent.agent")

from typing import Any
from a2a.types import TaskState
from a2a.utils import get_message_text
from google.adk.agents import Agent
from google.adk.agents.callback_context import CallbackContext
from google.adk.tools.base_tool import BaseTool
from google.adk.tools.tool_context import ToolContext
from google.genai import types
from ucp_sdk.models.schemas.shopping.types.buyer import Buyer
from ucp_sdk.models.schemas.shopping.types.postal_address import PostalAddress
from .a2a_extensions import UcpExtension
from .constants import (
    ADK_EXTENSIONS_STATE_KEY,
    ADK_LATEST_TOOL_RESULT,
    ADK_PAYMENT_STATE,
    ADK_UCP_METADATA_STATE,
    ADK_USER_CHECKOUT_ID,
    UCP_CHECKOUT_KEY,
    UCP_PAYMENT_DATA_KEY,
    UCP_RISK_SIGNALS_KEY,
    ADK_SELECTED_STORE_ID,
    ADK_USER_CHECKOUT_IDS,
)
from .payment_processor import MockPaymentProcessor
from .store import RetailStore
from .discovery import (
    REQUIRED_CHECKOUT_CAPABILITY,
    choose_default_store_id,
    get_stores,
    require_checkout_or_explain,
)

stores = get_stores()

DEFAULT_STORE_ID = choose_default_store_id(stores).selected_store_id

mpp = MockPaymentProcessor()

#new
def _get_current_store_id(tool_context: ToolContext) -> str:
    return tool_context.state.get(ADK_SELECTED_STORE_ID, DEFAULT_STORE_ID)

def _get_store(tool_context: ToolContext) -> RetailStore:
    store_id = _get_current_store_id(tool_context)
    return stores.get(store_id, stores[DEFAULT_STORE_ID])

def _require_checkout_capability(tool_context: ToolContext) -> dict | None:
    store_id = _get_current_store_id(tool_context)

    decision = require_checkout_or_explain(stores, store_id)
    if decision is None:
        return None
    
    if decision is not None:
        logger.info(
            "checkout_blocked store_id=%s recommended=%s reason=%r",
            store_id,
            decision.selected_store_id if decision.selected_store_id != store_id else None,
            decision.explanation,
        )

    # Don't auto-switch here (better for your demo: show that the store is "invisible" to agents).
    # If you WANT auto-switching, uncomment the next line:
    # tool_context.state[ADK_SELECTED_STORE_ID] = decision.selected_store_id

    return {
        "message": "Cannot complete checkout with the selected merchant.",
        "status": "error",
        "explanation": decision.explanation,
        "recommended_store": (
            decision.selected_store_id
            if decision.selected_store_id != store_id
            else None
        ),
    }

def _create_error_response(message: str) -> dict:
  return {"message": message, "status": "error"}

def list_stores(tool_context: ToolContext) -> dict:
    """List available stores and whether they support agent checkout (UCP)."""
    items = []
    for sid, s in stores.items():
        items.append(
            {
                "id": sid,
                "supports_ucp_checkout": s.supports(REQUIRED_CHECKOUT_CAPABILITY),
            }
        )

    default_decision = choose_default_store_id(stores)

    return {
        "stores": items,
        "recommended_default_store": default_decision.selected_store_id,
        "explanation": default_decision.explanation,
        "status": "success",
    }

def select_store(tool_context: ToolContext, store_id: str) -> dict:
    """Select which store (merchant) this session is shopping from."""
    if store_id == "auto":
        store_id = DEFAULT_STORE_ID

    if store_id not in stores:
        return {
            "message": f"Unknown store '{store_id}'. Available: {', '.join(stores.keys())}",
            "status": "error",
        }

    tool_context.state[ADK_SELECTED_STORE_ID] = store_id

    supports_checkout = stores[store_id].supports(REQUIRED_CHECKOUT_CAPABILITY)
    note = "" if supports_checkout else " (search-only; checkout not supported)"

    logger.info(
        "select_store store_id=%s supports_ucp_checkout=%s",
        store_id,
        supports_checkout,
    )

    return {
        "message": f"Switched store to '{store_id}'{note}",
        "status": "success",
        "explanation": (
            f"Switched to '{store_id}'. "
            + (
                "This merchant supports UCP checkout, so I can complete purchases automatically."
                if supports_checkout
                else "This merchant does NOT expose UCP checkout capabilities, so agents cannot reliably complete checkout here."
            )
        ),
    }

def search_shopping_catalog(tool_context: ToolContext, query: str) -> dict:
    """Search the product catalog for products that match the given query.

    Args:
        tool_context: The tool context for the current request.
        query: Query for performing product search.

    Returns:
        dict: Returns the response from the tool with success or error status.

    """
    logger.info(
        "search store_id=%s query=%r",
        _get_current_store_id(tool_context),
        query,
    )

    try:
        product_results = _get_store(tool_context).search_products(query)
        return {"a2a.product_results": product_results.model_dump(mode="json")}
    except Exception:
        logging.exception("There was an error searching the product catalog.")
        return _create_error_response(
            "Sorry, there was an error searching the product catalog, "
            "please try again later."
        )


def add_to_checkout(
    tool_context: ToolContext, product_id: str, quantity: int = 1
) -> dict:
    """Add a product to the checkout session.

    Args:
        tool_context: The tool context for the current request.
        product_id: Product ID or SKU.
        quantity: Quantity; defaults to 1 if not specified.

    Returns:
        dict: Returns the response from the tool with success or error status.

    """
    cap_err = _require_checkout_capability(tool_context)
    if cap_err:
        return cap_err
    store_id = _get_current_store_id(tool_context)
    mapping = tool_context.state.get(ADK_USER_CHECKOUT_IDS, {})
    if not isinstance(mapping, dict):
        mapping = {}

    
    checkout_id = mapping.get(store_id)

    ucp_metadata = tool_context.state.get(ADK_UCP_METADATA_STATE)

    if not ucp_metadata:
        return _create_error_response(
            "There was an error creating UCP metadata"
        )

    try:
        checkout = _get_store(tool_context).add_to_checkout(
            ucp_metadata, product_id, quantity, checkout_id
        )
        if not checkout_id:
            mapping[store_id] = checkout.id
            tool_context.state[ADK_USER_CHECKOUT_IDS] = mapping

        return {
            UCP_CHECKOUT_KEY: checkout.model_dump(mode="json"),
            "status": "success",
        }
    except ValueError:
        logging.exception(
            "There was an error adding item to checkout, please retry later."
        )
        return _create_error_response(
            "There was an error adding item to checkout, please retry later."
        )


def remove_from_checkout(tool_context: ToolContext, product_id: str) -> dict:
    """Remove a product from the checkout session.

    Args:
        tool_context: The tool context for the current request.
        product_id: Product ID or SKU.

    Returns:
        dict: Returns the response from the tool with success or error status.

    """
    cap_err = _require_checkout_capability(tool_context)
    if cap_err:
        return cap_err
    
    checkout_id = _get_current_checkout_id(tool_context)

    if not checkout_id:
        return _create_error_response("A Checkout has not yet been created.")

    try:
        return {
            UCP_CHECKOUT_KEY: (
                _get_store(tool_context).remove_from_checkout(checkout_id, product_id).model_dump(
                    mode="json"
                )
            ),
            "status": "success",
        }
    except ValueError:
        logging.exception(
            "There was an error removing item from checkout, "
            "please retry later."
        )
        return _create_error_response(
            "There was an error removing item from checkout, "
            "please retry later."
        )


def update_checkout(
    tool_context: ToolContext, product_id: str, quantity: int
) -> dict:
    """Update the quantity of a product in the checkout session.

    Args:
        tool_context: The tool context for the current request.
        product_id: Product ID or SKU.
        quantity: New quantity for the product.

    Returns:
        dict: Returns the response from the tool with success or error status.

    """
    cap_err = _require_checkout_capability(tool_context)
    if cap_err:
        return cap_err
    
    checkout_id = _get_current_checkout_id(tool_context)
    if not checkout_id:
        return _create_error_response("A Checkout has not yet been created.")

    try:
        return {
            UCP_CHECKOUT_KEY: (
                _get_store(tool_context).update_checkout(
                    checkout_id, product_id, quantity
                ).model_dump(mode="json")
            ),
            "status": "success",
        }
    except ValueError:
        logging.exception(
            "There was an error updating item in the cart, please retry later."
        )
        return _create_error_response(
            "There was an error updating item in the cart, please retry later."
        )


def get_checkout(tool_context: ToolContext) -> dict:
    """Retrieve a Checkout Session.

    Args:
        tool_context: The tool context for the current request.

    Returns:
        dict: Returns the response from the tool with success or error status.

    """
    cap_err = _require_checkout_capability(tool_context)
    if cap_err:
        return cap_err

    checkout_id = _get_current_checkout_id(tool_context)

    if not checkout_id:
        return _create_error_response("A Checkout has not yet been created.")

    checkout = _get_store(tool_context).get_checkout(checkout_id)
    if checkout is None:
        return _create_error_response("Checkout not found with the given ID.")

    return {
        UCP_CHECKOUT_KEY: checkout.model_dump(mode="json"),
        "status": "success",
    }


def update_customer_details(
    tool_context: ToolContext,
    first_name: str,
    last_name: str,
    street_address: str,
    address_locality: str,
    address_region: str,
    postal_code: str,
    address_country: str | None,
    extended_address: str | None = None,
    email: str | None = None,
) -> dict:
    """Add delivery address to the checkout.

    Args:
        tool_context: The tool context for the current request.
        first_name: First name of the recipient.
        last_name: Last name of the recipient.
        street_address: The street address. For example, 1600 Amphitheatre Pkwy.
        address_locality: The locality in which the street address is.
        address_region: The region in which the locality is.
        postal_code: The postal code. For example, 94043.
        address_country: The country.
        extended_address: The extended address of the postal address.
        email: The email address of the recipient.

    Returns:
        dict: Returns the response from the tool with success or error status.

    """

    cap_err = _require_checkout_capability(tool_context)
    if cap_err:
        return cap_err
    
    checkout_id = _get_current_checkout_id(tool_context)

    if not checkout_id:
        return _create_error_response("A Checkout has not yet been created.")

    if not address_country:
        address_country = "US"

    address = PostalAddress(
        street_address=street_address,
        extended_address=extended_address,
        address_locality=address_locality,
        address_region=address_region,
        address_country=address_country,
        postal_code=postal_code,
        first_name=first_name,
        last_name=last_name,
    )

    checkout = _get_store(tool_context).add_delivery_address(checkout_id, address)

    if email:
        checkout.buyer = Buyer(email=email)

    # invoke start payment tool once the user details are added
    return start_payment(tool_context)


async def complete_checkout(tool_context: ToolContext) -> dict:
    """Process the payment data to complete checkout.

    Args:
        tool_context: The tool context for the current request.

    Returns:
        dict: Returns the response from the tool with success or error status.

    """

    cap_err = _require_checkout_capability(tool_context)
    if cap_err:
        return cap_err
    
    checkout_id = _get_current_checkout_id(tool_context)

    if not checkout_id:
        return _create_error_response("A Checkout has not yet been created.")

    checkout = _get_store(tool_context).get_checkout(checkout_id)

    if checkout is None:
        return _create_error_response(
            "Checkout not found for the current session."
        )

    payment_data: dict[str, Any] = tool_context.state.get(ADK_PAYMENT_STATE)

    if payment_data is None:
        return {
            "message": (
                "Payment Data is missing. Click 'Confirm Purchase' "
                "to complete the purchase."
            ),
            "status": "requires_more_info",
        }

    try:
        task = mpp.process_payment(
            payment_data[UCP_PAYMENT_DATA_KEY],
            payment_data[UCP_RISK_SIGNALS_KEY],
        )

        if task is None:
            return _create_error_response(
                "Failed to receive a valid response from MPP"
            )

        if task.status is not None and task.status.state == TaskState.completed:
            payment_instrument = payment_data.get(UCP_PAYMENT_DATA_KEY)
            checkout.payment.selected_instrument_id = (
                payment_instrument.root.id
            )
            checkout.payment.instruments = [payment_instrument]

            response = _get_store(tool_context).place_order(checkout_id)
            store_id = _get_current_store_id(tool_context)
            mapping = tool_context.state.get(ADK_USER_CHECKOUT_IDS, {})
            if isinstance(mapping, dict):
                mapping[store_id] = None
                tool_context.state[ADK_USER_CHECKOUT_IDS] = mapping

            return {
                UCP_CHECKOUT_KEY: response.model_dump(mode="json"),
                "status": "success",
            }
        else:
            return _create_error_response(
                get_message_text(task.status.message)  # type: ignore
            )
    except Exception:
        logging.exception("There was an error completing the checkout.")
        return _create_error_response(
            "Sorry, there was an error completing the checkout, "
            "please try again."
        )


def start_payment(tool_context: ToolContext) -> dict:
    """Ask for required information to proceed with the payment.

    Args:
        tool_context: The tool context for the current request.

    Returns:
        dict: checkout object

    """
    cap_err = _require_checkout_capability(tool_context)
    if cap_err:
        return cap_err
    
    checkout_id = _get_current_checkout_id(tool_context)

    if not checkout_id:
        return _create_error_response("A Checkout has not yet been created.")

    result = _get_store(tool_context).start_payment(checkout_id)
    if isinstance(result, str):
        return {"message": result, "status": "requires_more_info"}
    else:
        tool_context.actions.skip_summarization = True
        return {
            UCP_CHECKOUT_KEY: result.model_dump(mode="json"),
            "status": "success",
        }


def _get_current_checkout_id(tool_context: ToolContext) -> str | None:
    """Return the current checkout ID from the tool context state.

    Args:
        tool_context: The tool context for the current request.

    Returns:
        str | None: The checkout ID if present, else None.

    """
    #return tool_context.state.get(ADK_USER_CHECKOUT_ID)
    store_id = _get_current_store_id(tool_context)
    mapping = tool_context.state.get(ADK_USER_CHECKOUT_IDS, {})
    if isinstance(mapping, dict):
        return mapping.get(store_id)
    return None


def after_tool_modifier(
    tool: BaseTool,
    args: dict[str, Any],
    tool_context: ToolContext,
    tool_response: dict,
) -> dict | None:
    """Modify the tool response before returning to the agent.

    Args:
        tool: The tool that was executed.
        args: The arguments passed to the tool.
        tool_context: The tool context for the current request.
        tool_response: The response returned by the tool.

    Returns:
        dict | None: The modified tool response, or None.

    """
    extensions = tool_context.state.get(ADK_EXTENSIONS_STATE_KEY, [])
    # add typed data responses to the state
    ucp_response_keys = [UCP_CHECKOUT_KEY, "a2a.product_results"]

    should_capture = any(key in tool_response for key in ucp_response_keys)
    should_capture = should_capture or ("explanation" in tool_response)
    if UcpExtension.URI in extensions and should_capture:
        tool_context.state[ADK_LATEST_TOOL_RESULT] = tool_response

    if UcpExtension.URI in extensions and any(
        key in tool_response for key in ucp_response_keys
    ):
        tool_context.state[ADK_LATEST_TOOL_RESULT] = tool_response

    return None


def modify_output_after_agent(
    callback_context: CallbackContext,
) -> types.Content | None:
    """Modify the agent's output before returning to the user.

    Args:
        callback_context: The callback context for the agent run.

    Returns:
        types.Content | None: The modified agent output, or None.

    """
    # add the UCP tool responses as agent output
    latest_result = callback_context.state.get(ADK_LATEST_TOOL_RESULT)

    if not latest_result:
        return None
    
    explanation = None
    recommended_store = None

    # latest_result is a dict produced by tools
    if isinstance(latest_result, dict):
        explanation = latest_result.get("explanation")
        recommended_store = latest_result.get("recommended_store")

    text_parts: list[types.Part] = []

    if explanation:
        # Add a clear, user-facing explanation
        msg = explanation
        if recommended_store:
            msg += f"\n\nRecommended store: '{recommended_store}'."
        text_parts.append(types.Part(text=msg))

    # Always include the structured tool response too
    text_parts.append(
        types.Part(
            function_response=types.FunctionResponse(
                response={"result": latest_result}
            )
        )
    )

    return types.Content(parts=text_parts, role="model")
    # if latest_result:
    #     return types.Content(
    #         parts=[
    #             types.Part(
    #                 function_response=types.FunctionResponse(
    #                     response={"result": latest_result}
    #                 )
    #             )
    #         ],
    #         role="model",
    #     )

    # return None


root_agent = Agent(
    name="shopper_agent",
    model="gemini-3-flash-preview",
    # description="Agent to help with shopping",
    # instruction=(
    #     "You are a helpful agent who can help user with shopping actions such"
    #     " as searching the catalog, add to checkout session, complete checkout"
    #     " and handle order placed event.Given the user ask, plan ahead and"
    #     " invoke the tools available to complete the user's ask. Always make"
    #     " sure you have completed all aspects of the user's ask. If the user"
    #     " says add to my list or remove from the list, add or remove from the"
    #     " cart, add the product or remove the product from the checkout"
    #     " session. If the user asks to add any items to the checkout session,"
    #     " search for the products and then add the matching products to"
    #     " checkout session.If the user asks to replace products,"
    #     " use remove_from_checkout and add_to_checkout tools to replace the"
    #     " products to match the user request"
    # ),
    description="Agent to help with shopping (search, cart/checkout, payment, order)",
    instruction=(
        "You are a helpful shopping agent. You can search products, manage a "
        "checkout session (add/remove/update items), collect delivery and buyer "
        "details, start payment, and complete checkout.\n\n"

        "Important: There are multiple stores. Use the select_store tool when "
        "needed. Some stores may be search-only and may not support checkout. "
        "If a user asks to buy/checkout and the current store does not support "
        "checkout, switch to a store that supports checkout (prefer the default "
        "auto selection) and continue.\n\n"

        "Tool usage rules:\n"
        "- If the user asks to add items, first search the catalog, then add the "
        "best matching product(s) to checkout.\n"
        "- If multiple products match, ask the user which one to choose unless "
        "the user clearly specified the exact product.\n"
        "- If the user asks to replace products, remove then add.\n"
        "- If the user asks to view the cart, use get_checkout.\n\n"

        "Checkout flow:\n"
        "- To proceed to payment, ensure buyer email exists and (if required) a "
        "fulfillment/delivery address is provided. Use update_customer_details "
        "to add address and buyer email, then use start_payment.\n"
        "- Only call complete_checkout after payment data is available.\n\n"

        "Always ensure you complete all aspects of the user's request."
    ),
    tools=[
        search_shopping_catalog,
        add_to_checkout,
        remove_from_checkout,
        update_checkout,
        get_checkout,
        start_payment,
        update_customer_details,
        complete_checkout,
        list_stores,
        select_store,
    ],
    after_tool_callback=after_tool_modifier,
    after_agent_callback=modify_output_after_agent,
)
