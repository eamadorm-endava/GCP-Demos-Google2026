# Product Roadmap: Supply Chain Command Center

This document outlines the strategic roadmap for evolving the application from its current v1.0 Demo state into a v2.0 Enterprise Platform. It is designed to support the upgrade path for onboarding major target accounts like JB Hunt, PLS, and Chamberlain Group.

---

## v1.1: Operational Foundations (Immediate Term)
**Focus:** Stabilizing the core "Farm-to-Port" workflow and ensuring robust compliance features.

*   **Enhanced Farm Management:**
    *   Add "Edit" capabilities to existing farm records.
    *   Implement audit logs for document approvals (who approved what and when).
*   **Mobile Responsiveness:**
    *   Optimize the "Shipment Detail" and "Document Upload" views for warehouse staff using tablets/mobile.
*   **Localization Polish:**
    *   Complete QA on Spanish (LATAM) and Portuguese (BR) translations for all new compliance fields.

---

## v1.5: The "Integrator" Update (Next Quarter)
**Focus:** Connectivity and Automation for Logistics Giants (Targeting: JB Hunt, Marten, PLS).

### Epic: EDI & API Interoperability
*   **EDI 214 Integration:** Implement a parsing engine to ingest standard EDI status messages (Pickup, Departure, Arrival) to automate milestone updates without manual clicks.
*   **TMS Webhooks:** Build outbound webhooks to push status changes back to client Transportation Management Systems (McLeod, TMW).

### Epic: Document Intelligence
*   **Automated Rate Confirmations:** Auto-generate PDF Rate Cons based on shipment cost data.
*   **OCR Verification:** Use AI to scan uploaded "Warehouse Receipts" and auto-verify piece counts against the Booking data.

---

## v2.0: The Enterprise Edition (6 Months)
**Focus:** Multi-tenancy and Industrial Precision (Targeting: Chamberlain Group, CAPP USA, PLS).

### Epic: Multi-Tenancy Architecture ("The Broker View")
*   **Organization Hierarchy:** Update data models to support `Organization` > `Sub-Account` structures.
*   **Control Tower View:** Create a Super-Admin dashboard for 3PLs (like PLS) to view all shipments across all their clients, while restricting individual clients to their own data.

### Epic: SKU & Serial Number Visibility
*   **Line Item Tracking:** Expand the shipment model to track individual Line Items (SKUs, Serial Numbers, Part IDs).
*   **Production Risk Analysis:** Introduce `RequiredByDate` fields and update Risk AI to flag shipments where `EDD > RequiredByDate` (Critical for manufacturing lines).

### Epic: Engineering Compliance
*   **Technical Document Enforcement:** Add a configuration to require specific technical documents (Calibration Certs, Schematics) before a shipment can be marked "Delivered".

---

## v2.5: The "Brand & Velocity" Update (9 Months)
**Focus:** High-velocity intake and consumer experience (Targeting: Mac.Bid, RealTruck, Revzilla).

### Epic: Brand Experience (White-Labeling)
*   **Dynamic Theming:** Implement a theming engine that adjusts logos, colors, and fonts based on the logged-in customer's brand identity.
*   **Consumer Tracking Page:** Launch a simplified, unauthenticated public tracking URL designed for end-consumers (mobile-first, map-centric).

### Epic: High-Velocity Intake
*   **Barcode/QR Scanning:** Add a camera integration to the mobile app to instantly pull up shipment details by scanning a label.
*   **Bulk Operations:** Build a CSV Importer to allow creating or updating 500+ shipments/returns in a single action (Crucial for Reverse Logistics).

---

## v3.0: The Predictive Future (12+ Months)
**Focus:** Pre-emptive management using advanced AI and ESG tracking.

### Epic: Predictive Logistics
*   **Delay Prediction Models:** Train Vertex AI models on historical lane data + real-time weather to predict delays before departure.
*   **Dynamic Route Optimization:** AI-driven suggestions for alternative routes or carriers based on cost/time/carbon trade-offs.

### Epic: Sustainability (ESG)
*   **Carbon Calculator:** Automated CO2e calculation per shipment based on weight, distance, and mode.
*   **Green Reporting:** Sustainability dashboards for corporate ESG reporting.
