# Machine Learning Strategy & Technical Architecture

This document serves as the engineering blueprint for the "ShelfLogic AI" decision engine. It details the specific algorithms, data transformations, and Python libraries required to implement the Assortment, Pricing, and Inventory modules using the **Iowa Liquor Sales** open dataset.

---

## 1. Technology Stack & Libraries

We utilize a robust Python ecosystem for the ML pipeline.

| Stage | Library | Purpose |
| :--- | :--- | :--- |
| **Data Processing** | `pandas`, `numpy` | Data cleaning, pivoting, and vectorization of the Iowa dataset. |
| **Feature Engineering** | `scikit-learn` | Scaling (`MinMaxScaler`), Encoding (`OneHotEncoder`), and Dimensionality Reduction (`PCA`). |
| **Clustering (Module A)** | `scikit-learn` | `NearestNeighbors` (KNN) for finding store lookalikes. |
| **Pricing (Module B)** | `statsmodels` | `OLS` (Ordinary Least Squares) for interpreting price elasticity coefficients with statistical significance (P-values). |
| **Forecasting (Module C)** | `lightgbm` | Gradient Boosting Framework for high-accuracy time-series forecasting. |
| **Hyperparameter Tuning** | `optuna` | Bayesian optimization for finding optimal LightGBM parameters. |
| **Geospatial** | `geopy` | Calculating Haversine distances for inventory transfers. |
| **Validation** | `scikit-learn` | `TimeSeriesSplit` for preventing look-ahead bias in validation. |

---

## 2. Data Source: Iowa Liquor Sales

The model ingests the [Iowa Liquor Sales Dataset](https://data.iowa.gov/Sales-Distribution/Iowa-Liquor-Sales/m3tr-qhgy/about_data).

**Raw Column Mapping:**
*   **Identity:** `Store Number`, `Item Number`
*   **Temporal:** `Date`
*   **Geospatial:** `Store Location` (Point), `County`, `Zip Code`
*   **Categorical:** `Category Name`, `Vendor Name`
*   **Numerical:** `Bottles Sold`, `Sale (Dollars)`, `State Bottle Retail`, `Volume Sold (Liters)`

---

## 3. Module A: Assortment Optimization (The "Lookalike" Engine)

**Goal:** Identify "Digital Twin" stores to prescribe assortment gaps.

### 3.1 Intuition & Logic
**Concept:** "You are the average of your 5 closest friends."
If Store A and Store B have 95% similar customer demographics and sales patterns, but Store B sells huge volumes of "Apple Liqueur" and Store A doesn't carry it, Store A has an **Assortment Gap**.

**Pseudo-Algorithm:**
```python
# 1. Vectorize Stores
for store in all_stores:
    vector = [
        median_income, 
        urbanicity_score, 
        pct_sales_vodka, 
        pct_sales_rum, 
        avg_basket_size
    ]
    store_vectors.append(vector)

# 2. Find Twins
target_store = store_vectors[104]
neighbors = KNN.search(target_store, k=5) # Find 5 most similar stores

# 3. Gap Analysis
for neighbor in neighbors:
    high_velocity_items = neighbor.get_top_selling_items(top_n=50)
    for item in high_velocity_items:
        if item NOT IN target_store.current_assortment:
            potential_revenue = predict_revenue(target_store, item)
            opportunities.append(item)
```

### 3.2 Input Data Model (The Store Vector)
A single row represents one store's "DNA".

| Feature Name | Type | Source / Engineering Logic |
| :--- | :--- | :--- |
| `store_id` | Index | `Store Number` |
| `lat`, `long` | Float | Parsed from `Store Location`. |
| `urbanicity_proxy` | Float | `Total Bottles Sold` / `Count of Unique Days Open` (Proxy for traffic). |
| `avg_ticket_size` | Float | `Sum(Sale Dollars)` / `Count(Transactions)`. |
| `cat_{category}_mix` | Float | Pivot: % of total revenue coming from "Vodka", "Rum", "Schnapps". (Normalized 0-1). |
| `price_tier_high` | Float | % of sales from items with `State Bottle Retail` > $30. |
| `price_tier_low` | Float | % of sales from items with `State Bottle Retail` < $10. |

### 3.3 Feature Engineering Pipeline
1.  **Pivot & Aggregation:** Group raw transactions by `Store Number` and `Category Name`. Pivot categories to columns. Fill NaNs with 0.
2.  **Normalization:** Apply `MinMaxScaler` to all numerical columns to ensure high-volume stores don't overpower the vector simply due to scale. We care about *mix*, not magnitude.
3.  **Dimensionality Reduction:** Apply **PCA (Principal Component Analysis)** to reduce the ~60 category columns down to ~10 principal components that explain 95% of variance.

### 3.4 Algorithm: K-Nearest Neighbors (KNN)
*   **Library:** `sklearn.neighbors.NearestNeighbors`
*   **Metric:** Cosine Similarity (measures angle between vectors, ignoring magnitude).
*   **Logic:** `knn.fit(store_vectors)`. Query with Target Store vector to find nearest $k=3$ neighbors.

### 3.5 Output Data Model
```json
{
  "target_store_id": "2633",
  "lookalike_store_id": "2512",
  "similarity_score": 0.94,
  "gap_opportunities": [
     { "sku_id": "11788", "name": "Black Velvet", "lookalike_velocity": 45, "projected_lift": 650.00 }
  ]
}
```

---

## 4. Module B: Price Optimization (Elasticity)

**Goal:** Determine optimal price points by modeling Price Elasticity of Demand (PED).

### 4.1 Intuition & Logic
**Concept:** "The Revenue Hill."
Most products follow a Demand Curve: as Price ($P$) goes up, Quantity ($Q$) goes down.
*   **Elastic Goods (Luxury/Non-Essential):** Small price hike = Huge volume drop. (Revenue falls).
*   **Inelastic Goods (Essentials):** Price hike = Small volume drop. (Revenue rises).

**Pseudo-Algorithm:**
```python
# 1. Calculate Elasticity (Beta)
# Log-Log Regression: ln(Quantity) = Beta * ln(Price) + C
model = OLS(y=log_quantity, x=log_price)
elasticity = model.coef_

# 2. Optimization Loop
current_price = 20.00
scenarios = []
for p in range(15, 30):
    projected_q = current_q * ((p / current_price) ^ elasticity)
    projected_revenue = p * projected_q
    scenarios.append(projected_revenue)

# 3. Decision
optimal_price = max(scenarios, key=lambda x: x.revenue).price
```

### 4.2 Input Data Model (Time Series)
A single row represents one product's sales performance for a specific week.

| Feature Name | Type | Source / Engineering Logic |
| :--- | :--- | :--- |
| `item_number` | Index | `Item Number` |
| `week_start_date` | Date | `Date` resampled to 'W-MON'. |
| `avg_unit_price` | Float | Mean `State Bottle Retail` for that week. |
| `total_units_sold` | Int | Sum `Bottles Sold`. |
| `competitor_price` | Float | Avg `State Bottle Retail` for same SKU in same `County` (excluding self). |

### 4.3 Feature Engineering Pipeline (Log-Log)
1.  **Filter:** Isolate data for a single SKU.
2.  **Transformation:**
    *   `log_quantity` = `np.log(total_units_sold)`
    *   `log_price` = `np.log(avg_unit_price)`
    *   *Why?* In a log-log model ($\ln(Q) = \beta \ln(P) + C$), the coefficient $\beta$ is directly interpreted as Elasticity.

### 4.4 Algorithm: OLS Regression
*   **Library:** `statsmodels.api.OLS`
*   **Formula:** `log_quantity ~ log_price + seasonality_features`
*   **Interpretation:**
    *   If coefficient ($\beta$) < -1: **Elastic**. Demand is sensitive. **Action:** Markdown.
    *   If coefficient ($\beta$) > -1: **Inelastic**. Demand is stable. **Action:** Markup.

### 4.5 Output Data Model
```json
{
  "sku_id": "38176",
  "elasticity_coef": -1.8,
  "is_elastic": true,
  "r_squared": 0.76,
  "recommendation": "MARKDOWN",
  "optimal_price": 24.99,
  "projected_revenue_impact": 12.5
}
```

---

## 5. Module C: Inventory Rebalance (Forecasting)

**Goal:** Predict stockouts 14 days in advance to trigger transfers.

### 5.1 Intuition & Logic
**Concept:** "The Burndown Chart."
We forecast the daily sales rate (velocity) to draw a "Burndown Line" from current stock level to zero.
If the line hits zero *before* the next scheduled truck delivery (Lead Time), we have a **Stockout Risk**.

**Pseudo-Algorithm:**
```python
# 1. Forecast Demand
forecast_14d = LightGBM.predict(features=[day_of_week, seasonality, price])

# 2. Simulate Inventory
current_stock = 100
days_until_truck = 5
for day, demand in enumerate(forecast_14d):
    current_stock -= demand
    if current_stock <= safety_stock_threshold:
        risk_date = today + day
        if risk_date < (today + days_until_truck):
            trigger_transfer_alert()
            break
```

### 5.2 Input Data Model (Training Set)
A single row represents a daily observation for a Store-SKU combination.

| Feature Name | Type | Source / Engineering Logic |
| :--- | :--- | :--- |
| `store_sku_id` | ID | Concatenation of Store and Item IDs. |
| `date` | Date | `Date`. |
| `target_sales` | Int | `Bottles Sold` (Target Variable). |
| `lag_7d` | Int | Sales exactly 7 days ago. |
| `roll_mean_14d` | Float | Moving average of sales over last 14 days. |
| `day_of_week` | Int | 0=Mon, 6=Sun. |
| `is_holiday` | Bool | Flag for New Year, July 4th, etc. |
| `price_change_flag`| Bool | 1 if price changed from previous day. |

### 5.3 Feature Engineering Pipeline
1.  **Time Series Split:** Train on past 12 months, Validate on subsequent 1 month.
2.  **Lag Generation:** Create features representing past behavior (autocorrelation).
3.  **Cyclical Encoding:** Encode `month` and `day_of_week` using Sine/Cosine transforms to preserve cyclical nature (Dec is close to Jan).

### 5.4 Algorithm: LightGBM Regressor
*   **Library:** `lightgbm.LGBMRegressor`
*   **Objective:** `poisson` or `tweedie` (since sales data is non-negative and often zero-inflated).
*   **Validation:** Cross-validate using `TimeSeriesSplit` (never shuffle time series data).

### 5.5 Output Data Model
```json
{
  "store_id": "2633",
  "sku_id": "11788",
  "forecast_next_14d": [5, 4, 6, 8, 12, 10, 4, ...],
  "cumulative_demand": 85,
  "current_stock": 40,
  "stockout_risk_date": "2023-10-15",
  "transfer_recommendation": {
     "source_store": "2512",
     "qty_to_transfer": 48
  }
}
```

---

## 6. Execution Strategy: Batch vs. Online

| Module | Training (Batch) | Inference (Online) |
| :--- | :--- | :--- |
| **A: Assortment** | **Monthly.** Re-calculate store vectors and PCA clusters as demographics/trends shift slowly. | **Real-time.** When user views "Analysis", perform Vector Dot Product to find nearest neighbor instantly. |
| **B: Pricing** | **Weekly.** Re-run OLS regressions to update Elasticity coefficients based on new sales data. | **Real-time.** Calculate revenue projections ($P \times Q$) dynamically as user adjusts the price slider. |
| **C: Inventory** | **Weekly.** Re-train LightGBM models to capture latest seasonality trends. | **Hourly.** Compare Live Stock (from POS) vs. Cached Forecast. If $Stock < Forecast_{7d}$, trigger alert. |

---

## 7. Operationalization on Google Cloud

The ML strategies outlined above will be developed in AI Studio and operationalized on Vertex AI for a scalable, production-grade MLOps lifecycle.

*   **Development:** AI Studio will be used for initial data exploration, model prototyping, and leveraging generative AI for code assistance and insight generation.
*   **Orchestration:** The entire end-to-end process—from data preprocessing in BigQuery to feature engineering and model training—will be defined and automated as a **Vertex AI Pipeline**. This ensures reproducibility and simplifies retraining.
*   **Training:** Model training will be executed as serverless Custom Jobs on **Vertex AI Training**, allowing the system to scale resources on demand without managing infrastructure.
*   **Model Management:** All trained models will be versioned and stored in the **Vertex AI Model Registry**. This provides a central repository for tracking model lineage, performance metrics, and managing deployments.
*   **Inference:**
    *   **Batch Inference:** For daily or weekly opportunity generation, models will be called via **Vertex AI Batch Prediction** jobs, which is cost-effective for large-scale, non-real-time predictions.
    *   **Online Inference:** For real-time features, such as the ML Simulation Lab, models will be deployed to **Vertex AI Endpoints** for low-latency predictions.