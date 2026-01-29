# Application Features: Supply Chain Demo

This document provides a summary of the key features implemented in the Supply Chain Demo application, structured around the core operational workflow.

## 1. Security & Role-Based Access

-   **Secure Login Page:** The application is protected by a login screen, ensuring only authenticated users can access data.
-   **Role-Based Views & Permissions:** The UI and available actions adapt based on the user's role.
    -   **Managers** have a strategic view with full financial KPIs and permissions to perform high-impact actions like approving farms and cancelling shipments.
    -   **Specialists** have a focused, operational view designed to execute daily tasks without access to sensitive financial data or critical actions.
-   **Session Management:** The UI is personalized with the logged-in user's name and provides a secure logout function.

## 2. Phase I: Origin Operations & Transit

This phase covers the entire process from planning to reception at the destination, as detailed in the provided workflow.

### 2.1. Farm ("Finca") Management
-   **Centralized Farm Hub:** A dedicated module to view, search, and filter all supplier farms by name, country, or registration status.
-   **Detailed Registration Form:** An intuitive modal form allows for the registration of new farms, capturing contact info and location details.
-   **Compliance-Driven Workflow:** The system enforces a compliance-first workflow.
    -   New farms are added with a `Pending Review` status.
    -   Required documents are dynamically generated based on the farm's country.
    -   Managers can review the farm's details and interactively mark documents as "Uploaded".
    -   Only managers can `Approve` or `Reject` a farm's registration.
-   **Integrated Shipment Creation:** The "New Shipment" form only allows users to select from `Approved` farms, ensuring operational readiness and preventing shipments from non-compliant suppliers.

### 2.2. Operational Initialization & Booking
-   **Comprehensive Order Creation:** A detailed form allows users to initialize a new shipment, capturing customer data, commodity type, and key dates.
-   **Air Waybill Management:** Dedicated fields for Master Air Waybill (MAWB) and House Air Waybill (HAWB) numbers, central to air freight tracking.

### 2.3. Cargo Reception at Origin
-   **Guided Instructions:** The system generates and sends delivery instructions to farms to ensure cargo arrives correctly at the airline or warehouse.
-   **Document Hub:** A centralized location for all shipment-related documents. The system validates against a checklist of required documents (e.g., commercial invoice, phytosanitary certificates, DAE).
-   **Warehouse Receipt Confirmation:** The workflow includes steps for uploading, verifying (conceptually via OCR), and confirming warehouse receipts to finalize cargo reception.

### 2.4. Transit & Automated Alerting
-   **Detailed Milestone Tracking:** The shipment lifecycle is tracked through key milestones: Booking Confirmed, Cargo Received, Departed Origin, Customs Clearance, and Delivered.
-   **Interactive Journey Map:** A visual map tracks the shipment's progress through its key milestones.
-   **Multi-Leg Transit Logic:** The system architecture supports tracking complex, multi-leg journeys (e.g., with "reforwarding" through the US).
-   **Automated Notifications:** The application simulates sending critical email alerts to stakeholders at each key step: Pre-Alerts, Document Packages, Departure Alerts, and Arrival Alerts.

## 3. Command Center & Analytics

-   **Role-Specific Dashboards:** The main dashboard provides a tailored, real-time overview of the supply chain.
-   **Key Performance Indicators (KPIs):** At-a-glance metrics for Active Shipments, On-Time Delivery %, Shipments Requiring Action, Delayed Shipments, and a full Farm Overview.
-   **Drill-Down Capabilities:** Users can click on KPI cards to navigate directly to a pre-filtered list of relevant shipments or farms.
-   **Financial Overview (Manager Only):** Managers have access to financial widgets showing Total Landed Cost and Average Cost Per Shipment.

## 4. AI-Powered Intelligence (Google Gemini)

-   **AI Risk Analysis:** A dedicated tab provides a proactive analysis of potential shipment risks based on its current status, route, and milestones.
-   **AI Chat Summary:** A one-click feature to summarize long conversations, highlighting key decisions and action items.
-   **AI Document Suggestions:** When creating a new order, the system intelligently suggests the required customs and shipping documents based on the trade lane.
-   **AI Shipment Summary:** The detail view features an AI-generated summary for a quick, natural-language overview of the shipment's status.

## 5. System & UX

-   **CargoWise Integration Context:** The application is designed with the concept of integrating with an ERP like CargoWise. Many status updates can be triggered automatically from the external system, while others are handled manually within this UI, creating a unified view.
-   **Multi-Language Support:** The entire application interface can be switched between English, Latin American Spanish, and Brazilian Portuguese.
-   **Fully Responsive Design:** The layout and components adapt gracefully to any screen size, providing a seamless experience on desktop, tablet, and mobile.