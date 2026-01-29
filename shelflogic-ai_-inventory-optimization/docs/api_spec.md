# Backend API Specification (v1)

## Base URL
`https://api.shelflogic.ai/v1`

## Authentication
Standard Bearer Token (JWT) required in header: `Authorization: Bearer <token>`

---

## 1. Dashboard & Opportunities

**`GET /opportunities`**
*   *Purpose:* Fetch the feed of recommendations for the dashboard.
*   *Query Params:*
    *   `store_id` (Optional): Filter by specific store.
    *   `type` (Optional): `ASSORTMENT_SWAP`, `PRICE_OPTIMIZATION`, `INVENTORY_REBALANCE`.
    *   `min_lift` (Optional): Minimum projected revenue impact.
    *   `search` (Optional): Fuzzy match on Store Name or Product Name.
*   *Response:* Array of Opportunity Objects (see Data Models).

**`GET /opportunities/{id}`**
*   *Purpose:* Get detailed analysis data for a specific card.
*   *Response:* Includes full JSON for charts, map coordinates, and AI insight text.

---

## 2. Assortment Intelligence

**`GET /stores/{store_id}/lookalikes`**
*   *Purpose:* Returns the top N statistically similar stores.
*   *Response:*
    ```json
    {
      "target": { "id": "104", "vector_cluster": "A" },
      "matches": [
        { "id": "202", "similarity_score": 0.94, "name": "Davenport" },
        { "id": "305", "similarity_score": 0.89, "name": "Ames" }
      ]
    }
    ```

**`POST /actions/swap`**
*   *Purpose:* Execute an assortment swap (Planogram update).
*   *Payload:*
    ```json
    {
      "opportunity_id": "uuid",
      "target_store_id": "104",
      "delist_sku": "CS-998",
      "add_sku": "AL-400"
    }
    ```
*   *Effect:* Marks opportunity as APPROVED. Triggers external PIM API.

---

## 3. Price Optimization

**`GET /analysis/elasticity/{sku_id}/{store_id}`**
*   *Purpose:* Returns data to render the Price Curve chart.
*   *Response:*
    ```json
    {
      "current_price": 29.99,
      "elasticity_coefficient": -1.4,
      "is_elastic": true,
      "competitor_avg_price": 31.50,
      "scenarios": [
        { "price": 28.99, "projected_volume": 110, "projected_revenue": 3188 },
        { "price": 30.99, "projected_volume": 85, "projected_revenue": 2634 }
      ]
    }
    ```

**`POST /actions/price-update`**
*   *Purpose:* Push a new price to the Electronic Shelf Label (ESL) system.
*   *Payload:* `{"sku_id": "VD-101", "new_price": 28.99, "store_id": "104"}`

---

## 4. Inventory & Logistics

**`GET /analysis/stock-transfer/candidates`**
*   *Purpose:* Find potential source stores for a product stockout.
*   *Query Params:* `target_store_id`, `sku_id`, `required_qty`.
*   *Response:*
    ```json
    [
      {
        "source_store_id": "202",
        "distance_miles": 15.4,
        "qty_available": 124,
        "days_supply_remaining_after_transfer": 38
      }
    ]
    ```

**`POST /actions/transfer`**
*   *Purpose:* Create an internal transfer order.
*   *Payload:*
    ```json
    {
      "source_store_id": "202",
      "target_store_id": "104",
      "sku_id": "CB-555",
      "qty": 48
    }
    ```
*   *Effect:* Generates row in `transfers` table. Sends manifest to Warehouse Management System (WMS).

---

## 5. Future Endpoints (v2 Roadmap)

**`GET /vendors/negotiations`** (Phase 3)
*   *Purpose:* Retrieve active autonomous negotiations initiated by the agent with suppliers.

**`POST /integrations/camera/webhook`** (Phase 2)
*   *Purpose:* Ingest real-time images from shelf-edge cameras for "Planogram Compliance" verification.

**`GET /simulation/supply-chain`** (Phase 4)
*   *Purpose:* Run "What-If" Monte Carlo simulations on the full graph network to predict downstream effects of a massive assortment reset.
