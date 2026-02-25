from __future__ import annotations

from dataclasses import dataclass
from typing import Mapping

from .store import RetailStore

import logging
logger = logging.getLogger("business_agent.discovery")

# Capability name we use as the baseline for "agent can checkout here"
REQUIRED_CHECKOUT_CAPABILITY = "dev.ucp.shopping.checkout"


@dataclass(frozen=True)
class StoreDecision:
    selected_store_id: str
    explanation: str
    rejected_store_id: str | None = None


def build_store_registry() -> dict[str, RetailStore]:
    """
    Central registry of merchants/stores for the demo.

    - tierra_de_cafe: human-friendly site + better prices, but NOT agent-checkout capable
    - cafe_con_alma: UCP-checkout capable, so agents can buy here
    """
    return {
        "tierra_de_cafe": RetailStore(
            products_filename="tierra_de_cafe_products.json",
            capabilities=set(),  # intentionally not UCP-checkout capable
        ),
        "cafe_con_alma": RetailStore(
            products_filename="cafe_con_alma_products.json",
            capabilities={REQUIRED_CHECKOUT_CAPABILITY},
        ),
    }


# Create the registry once (in-memory demo)
STORES: dict[str, RetailStore] = build_store_registry()
logger.info("store_registry_initialized stores=%s", list(STORES.keys()))


def get_stores() -> dict[str, RetailStore]:
    """Return the store registry."""
    return STORES


def choose_default_store_id(stores: Mapping[str, RetailStore]) -> StoreDecision:
    """Choose default store (first store that supports checkout)."""
    for sid, s in stores.items():
        if s.supports(REQUIRED_CHECKOUT_CAPABILITY):
            logger.info(
                "default_store_selected store_id=%s reason=%s",
                sid,
                "supports_ucp_checkout",
            )
            return StoreDecision(
                selected_store_id=sid,
                explanation=(
                    f"Defaulting to '{sid}' because it exposes UCP checkout capabilities, "
                    "so I can complete purchases automatically."
                ),
            )

    # Fallback if none are compliant
    fallback = next(iter(stores.keys()))

    logger.info(
        "default_store_selected store_id=%s reason=%s",
        fallback,
        "no_store_supports_ucp_checkout",
    )

    return StoreDecision(
        selected_store_id=fallback,
        explanation=(
            f"Defaulting to '{fallback}' because no store exposes UCP checkout capabilities."
        ),
    )


def require_checkout_or_explain(
    stores: Mapping[str, RetailStore],
    current_store_id: str,
) -> StoreDecision | None:
    """
    If the current store cannot do checkout, return a decision with explanation
    and a recommended compliant alternative (if any). Otherwise return None.
    """
    current = stores.get(current_store_id)
    if current and current.supports(REQUIRED_CHECKOUT_CAPABILITY):
        return None

    # Find a compliant alternative
    for sid, s in stores.items():
        if s.supports(REQUIRED_CHECKOUT_CAPABILITY):
            logger.info(
                "store_rejected_for_checkout rejected=%s recommended=%s missing=%s",
                current_store_id,
                sid,
                REQUIRED_CHECKOUT_CAPABILITY,
            )
            return StoreDecision(
                selected_store_id=sid,
                rejected_store_id=current_store_id,
                explanation=(
                    f"I cannot complete checkout with '{current_store_id}' because it does not expose "
                    "UCP checkout capabilities (agents cannot reliably discover shipping/payment or "
                    "finish checkout). "
                    f"I will use '{sid}' instead so I can complete the purchase automatically."
                ),
            )

    # No alternative exists
    logger.info(
        "store_rejected_for_checkout rejected=%s recommended=%s missing=%s",
        current_store_id,
        None,
        REQUIRED_CHECKOUT_CAPABILITY,
    )
    return StoreDecision(
        selected_store_id=current_store_id,
        rejected_store_id=current_store_id,
        explanation=(
            f"I cannot complete checkout because '{current_store_id}' does not support UCP checkout, "
            "and no alternative store is UCP-compliant."
        ),
    )