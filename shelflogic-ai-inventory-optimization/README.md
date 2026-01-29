# ShelfLogic AI 🛒🧠

**The Autonomous Store Assortment Agent**

ShelfLogic AI is a next-generation retail intelligence platform that moves beyond passive dashboards. Instead of just reporting sales data, it acts as an autonomous agent that identifies "Dead Stock," recommends specific assortment swaps based on lookalike store analysis, optimizes pricing for elasticity, and balances inventory across the network to prevent stockouts.

---

## 🚀 Key Features

### 1. Assortment Optimization (The "Swap")
*   **Problem:** Valuable shelf space is occupied by low-velocity items.
*   **Solution:** Uses Vector Similarity Search (Cosine Similarity) to find "Digital Twin" stores with similar demographics. It identifies products selling well in the twin store that are missing from the target store.
*   **Action:** One-click Planogram updates to delist dead stock and introduce high-potential items.

### 2. Price Optimization (The "Margin")
*   **Problem:** Leaving money on the table with under-priced inelastic goods, or losing volume on over-priced elastic goods.
*   **Solution:** Models Price Elasticity of Demand (PED) using historical sales data.
*   **Action:** Suggests precise price adjustments to maximize the area under the Revenue Curve.

### 3. Inventory Rebalance (The "Transfer")
*   **Problem:** High-demand stores run out of stock while low-demand stores hold surplus inventory.
*   **Solution:** Real-time "Burndown" forecasting detects imminent stockouts. It locates the nearest surplus store.
*   **Action:** Autonomous inter-store stock transfer orders to balance network inventory without purchasing new stock.

### 4. Role-Based "Command Center"
*   **HQ View:** Network-wide topology map, aggregate financials, and ML Strategy Lab.
*   **Store View:** Focused task list for local managers (e.g., "Execute Swap", "Accept Transfer").

### 5. ML Strategy Lab
*   A "Glass Box" view into the AI's decision-making process, visualizing PCA Clustering, Demand Curves, and Forecasting logic.

---

## 🛠️ Technical Stack

*   **Frontend:** React 18, TypeScript, Tailwind CSS
*   **Visualization:** Recharts (Complex interactive charts)
*   **AI/LLM:** Google Gemini API (Natural language reasoning for insights)
*   **Icons:** Lucide React (Custom SVG implementation)
*   **Architecture:** Component-based, responsive design with mocked backend services for demonstration.

---

## 📂 Project Structure

```
shelflogic-ai/
├── components/         # UI Components
│   ├── AnalysisView.tsx    # Drill-down analysis for opportunities
│   ├── MLSimulationView.tsx # Visualization of algorithms
│   ├── StoreMap.tsx        # Geospatial topology map
│   └── ...
├── docs/               # Technical Documentation
│   ├── requirements.md     # PRD & User Stories
│   ├── data_models.md      # Database Schema & ERD
│   ├── api_spec.md         # REST API Specification
│   └── ml_strategy.md      # Algorithm & Python Library Specs
├── services/           # External Service Integrations
│   └── geminiService.ts    # Google Gemini API wrapper
├── constants.ts        # Mock Data (Stores, Products, Opportunities)
├── types.ts            # TypeScript Interfaces
├── App.tsx             # Main Application Logic & Routing
└── index.tsx           # Entry Point
```

## 🔮 Future Roadmap

*   **Phase 2:** Integration with IoT Shelf Cameras for real-time planogram compliance.
*   **Phase 3:** Autonomous Vendor Negotiation bots using Generative AI.
*   **Phase 4:** Digital Twin simulation of entire supply chain for "What-If" scenario planning.

---

## ⚡ Getting Started

1.  **Clone the repository.**
2.  **Install dependencies:** `npm install`
3.  **Environment Setup:**
    *   Create a `.env` file.
    *   Add `API_KEY=your_google_gemini_api_key`.
4.  **Run Development Server:** `npm start`
5.  **Explore:**
    *   Login as **HQ** to see the strategy layer.
    *   Login as **Store Manager** to see the execution layer.

---

## 📄 License

Proprietary Demo. All Rights Reserved.
