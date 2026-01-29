# Data Models & Schema Architecture

## Implementation on Google Cloud
This data model is designed for a scalable implementation on Google Cloud.
*   **Transactional Data (`opportunities`, `transfers`):** Best suited for a managed relational database like **AlloyDB for PostgreSQL** for high-throughput reads/writes from the application layer.
*   **Analytical Data (`stores`, `products`, `inventory_snapshot`, `sales_transactions`):** Data from disparate sources will be ingested and stored in **BigQuery**, which serves as the central data warehouse for large-scale analytics and ML feature engineering.
*   **Vector Embeddings (`demographic_vector`):** The vector will be generated using Vertex AI Embeddings and stored in BigQuery. For low-latency similarity search at scale, this vector can be indexed in **Vertex AI Vector Search**.

---

To power the autonomous agent, the database must support geospatial queries, vector similarity search, and high-volume transaction logs.

## A. Entity Relationship Diagram (ERD)

### 1. Core Entities

**`stores`**
*   `store_id` (PK): VARCHAR. Unique Identifier (e.g., "104").
*   `name`: VARCHAR. Display name.
*   `location_lat_long`: GEOMETRY(POINT). For geospatial mapping.
*   `cluster_id`: VARCHAR. Pre-computed heuristic group (e.g., "Urban-Midwest-B").
*   `demographic_vector`: VECTOR(384). Embedding representing income, age, density, ethnicity, lifestyle segments. Used for cosine similarity.
*   `active`: BOOLEAN.

**`products`**
*   `sku_id` (PK): VARCHAR.
*   `name`: VARCHAR.
*   `category_id`: VARCHAR.
*   `taxonomy_path`: VARCHAR (e.g., "Spirits > Vodka > Flavored").
*   `wholesale_cost`: DECIMAL.
*   `base_retail_price`: DECIMAL.
*   `dimensions`: JSON (Height, Width, Depth for Planogram logic).

### 2. Inventory & Sales

**`inventory_snapshot`** (Daily Snapshot)
*   `snapshot_date`: DATE (PK Composite).
*   `store_id`: FK (PK Composite).
*   `sku_id`: FK (PK Composite).
*   `qty_on_hand`: INTEGER.
*   `days_of_supply`: INTEGER (Computed).

**`sales_transactions`**
*   `transaction_id`: UUID (PK).
*   `store_id`: FK.
*   `sku_id`: FK.
*   `timestamp`: TIMESTAMP.
*   `qty_sold`: INTEGER.
*   `unit_price`: DECIMAL (Actual price sold at).
*   `promo_id`: VARCHAR (Nullable).

### 3. Pricing Intelligence

**`competitor_pricing`**
*   `id`: UUID (PK).
*   `sku_id`: FK.
*   `zip_code`: VARCHAR.
*   `competitor_name`: VARCHAR (e.g., "Total Wine").
*   `observed_price`: DECIMAL.
*   `observed_date`: DATE.

### 4. The "Agent" Layer

**`opportunities`** (The Feed)
*   `opportunity_id`: UUID (PK).
*   `created_at`: TIMESTAMP.
*   `type`: ENUM ('ASSORTMENT_SWAP', 'PRICE_OPTIMIZATION', 'INVENTORY_REBALANCE').
*   `status`: ENUM ('NEW', 'VIEWED', 'APPROVED', 'REJECTED', 'PROCESSED').
*   `target_store_id`: FK.
*   `secondary_store_id`: FK (Nullable, for Lookalike or Source store).
*   `primary_sku_id`: FK.
*   `secondary_sku_id`: FK (Nullable, for Add Candidate).
*   `projected_lift_monthly`: DECIMAL.
*   `confidence_score`: FLOAT (0-1).
*   `match_reasons`: JSONB (Array of strings explaining the AI logic).
*   `ai_insight_text`: TEXT (LLM generated summary).

**`transfers`** (Logistics)
*   `transfer_id`: UUID (PK).
*   `opportunity_id`: FK.
*   `source_store_id`: FK.
*   `target_store_id`: FK.
*   `sku_id`: FK.
*   `qty`: INTEGER.
*   `status`: ENUM ('CREATED', 'IN_TRANSIT', 'RECEIVED').
*   `created_at`: TIMESTAMP.

---

## B. Vector Strategy (The "Brain")

The `demographic_vector` in the `stores` table is the core of the "Lookalike" logic.

**Vector Construction:**
1.  **Census Data:** Median Income, Population Density, Median Age, Household Size.
2.  **Commercial Data:** Competitor density within 5 miles, Traffic counts.
3.  **Performance DNA:** Percentage of sales by category (e.g., Store A is 40% Beer, Store B is 10% Beer).

**Usage:**
*   When analyzing Store A, we run a KNN (K-Nearest Neighbors) search using Cosine Similarity.
*   `SELECT * FROM stores ORDER BY demographic_vector <=> (SELECT demographic_vector FROM stores WHERE id = 'StoreA') LIMIT 5;`
*   This finds the "Digital Twins" mathematically, rather than relying on rigid geographical districts.

---

## C. Future Scaling Considerations

To support the roadmap items (real-time IoT, autonomous negotiation), the data architecture will need to evolve:

**1. Time-Series Optimization (InfluxDB / TimescaleDB)**
*   Currently, `sales_transactions` is relational. As we ingest **IoT Camera** feeds and real-time **Sensor Data** (foot traffic per aisle), we will migrate high-velocity streams to a dedicated Time-Series Database (TSDB).

**2. Graph Database (Neo4j)**
*   To model complex **Vendor-Product-Ingredient** relationships for the "Autonomous Procurement" phase.
*   *Example:* Identifying that "Glass Bottle Shortage" affects 50 different SKUs across 12 Vendors. A graph traversal is more efficient than recursive SQL joins for supply chain impact analysis.