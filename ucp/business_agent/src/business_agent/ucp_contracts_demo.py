"""
UCP contracts playground.

Run:
  uv run python -m business_agent.ucp_contracts_demo
"""

from __future__ import annotations

import json
import os
from pathlib import Path
from uuid import uuid4

from pydantic import ValidationError
from ucp_sdk.models.schemas.shopping.checkout_resp import CheckoutResponse
from ucp_sdk.models.schemas.shopping.payment_resp import PaymentResponse
from ucp_sdk.models.schemas.shopping.types.item_resp import ItemResponse
from ucp_sdk.models.schemas.shopping.types.line_item_resp import LineItemResponse
from ucp_sdk.models.schemas.shopping.types.total_resp import TotalResponse
from ucp_sdk.models.schemas.ucp import ResponseCheckout as UcpMetadata


BASE_URL = os.getenv("API_BASE_URL", "http://localhost:10999")
if BASE_URL.endswith("/"):
    BASE_URL = BASE_URL[:-1]


def load_ucp_metadata_from_repo() -> tuple[UcpMetadata, dict]:
    """Load and validate the 'ucp' section; return payment config separately."""
    base_path = Path(__file__).parent
    ucp_path = base_path / "data" / "ucp.json"
    with ucp_path.open(encoding="utf-8") as f:
        raw = json.load(f)

    ucp_metadata = UcpMetadata.model_validate(raw["ucp"])
    payment_cfg = raw.get("payment", {})
    return ucp_metadata, payment_cfg


def build_valid_checkout() -> CheckoutResponse:
    ucp_metadata, payment_cfg = load_ucp_metadata_from_repo()

    line_item = LineItemResponse(
        id=uuid4().hex,
        item=ItemResponse(
            id="COFFEE-001",
            title="Premium Arabica Coffee Beans",
            price=1299,  # cents
            image_url=f"{BASE_URL}/images/coffee_beans.jpg",
        ),
        quantity=2,
        totals=[
            TotalResponse(type="subtotal", display_text="Subtotal", amount=2598),
            TotalResponse(type="total", display_text="Total", amount=2598),
        ],
    )

    checkout = CheckoutResponse(
        id=str(uuid4()),
        ucp=ucp_metadata,
        currency="USD",
        status="incomplete",
        line_items=[line_item],
        totals=[
            TotalResponse(type="subtotal", display_text="Subtotal", amount=2598),
            TotalResponse(type="total", display_text="Total", amount=2598),
        ],
        links=[],
        payment=PaymentResponse(handlers=payment_cfg.get("handlers", [])),
    )

    return checkout


def demo_validation_errors() -> None:
    # Invalid URL (image_url must be a valid URL)
    bad_line_item = {
        "id": uuid4().hex,
        "item": {
            "id": "COFFEE-002",
            "title": "Ground Dark Roast Coffee",
            "price": 949,
            "image_url": "not-a-url", 
        },
        "quantity": 1,
        "totals": [],
    }

    try:
        LineItemResponse.model_validate(bad_line_item)
    except ValidationError as e:
        print("\n--- ValidationError: invalid image_url ---")
        print(e)

    # Wrong type for price (should be int cents)
    bad_line_item2 = {
        "id": uuid4().hex,
        "item": {
            "id": "COFFEE-003",
            "title": "Decaf Medium Roast Coffee",
            "price": "9.49",  # wrong type
            "image_url": f"{BASE_URL}/images/decaf_coffee.jpg",
        },
        "quantity": 1,
        "totals": [],
    }

    try:
        LineItemResponse.model_validate(bad_line_item2)
    except ValidationError as e:
        print("\n--- ValidationError: price wrong type ---")
        print(e)


def main() -> None:
    ucp_metadata, payment_cfg = load_ucp_metadata_from_repo()

    print("--- Validated UCP metadata (raw['ucp']) ---")
    print(ucp_metadata.model_dump(mode="json"))

    print("\n--- Payment handlers (raw['payment']['handlers']) ---")
    print(payment_cfg.get("handlers", []))

    checkout = build_valid_checkout()
    print("\n--- Valid checkout dump ---")
    print(checkout.model_dump(mode="json"))

    demo_validation_errors()


if __name__ == "__main__":
    main()