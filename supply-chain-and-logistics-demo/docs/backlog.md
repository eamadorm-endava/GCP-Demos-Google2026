# Project Backlog: Supply Chain Demo

This document outlines the epics, features, and user stories that define the scope of the Supply Chain Demo application, based on the detailed Phase I workflow.

---

## Epic 1: Operational Initialization & Farm Onboarding

> As an Ops user, I need to set up new shipments and manage suppliers ("Fincas") to begin the logistics process.

### Feature 1.1: Comprehensive Shipment Creation
-   **Story:** As an Ops Specialist, I want to fill out a detailed "Operational Initialization" form to create a new shipment, capturing customer, commodity information, MAWB, and HAWB.
-   **Story:** As an Ops Specialist, I want the "New Shipment" form to only allow me to select from a list of 'Approved' Farms to ensure compliance.
-   **Story:** As a user creating a shipment, I want the system to suggest the necessary customs documents based on the origin and destination to prevent compliance issues.

### Feature 1.2: Farm ("Finca") Management
-   **Story:** As an administrator, I want a dedicated form to register a new Farm, providing its name, contact details, and location.
-   **Story:** As an administrator, I want to view all registered farms in a list that I can search by name/country and filter by registration status.
-   **Story:** As a compliance officer, I want to select a farm to view its details, including a checklist of required legal and financial documents based on its country of origin (e.g., RUT for Colombia, RUC for Ecuador).
-   **Story:** As a manager reviewing a 'Pending' farm, I want to be able to mark missing documents as 'Uploaded' to track compliance progress.
-   **Story:** As a manager, I want to be able to 'Approve' or 'Reject' a farm's registration after reviewing its documentation.

---

## Epic 2: Booking & Cargo Reception at Origin

> As an Ops user, I need to manage the booking process and confirm the reception of cargo from the farm at the origin warehouse/airline.

### Feature 2.1: Booking Management
-   **Story:** As an Ops Specialist, I want to update a shipment's status to 'Booking Confirmed' once the airline space is secured.
-   **Story:** As an Ops Specialist, I want the system to automatically generate and send "Cargo Reception Instructions" to the linked Farm once a booking is confirmed.

### Feature 2.2: Cargo & Document Reception
-   **Story:** As a warehouse operator, I want to log the arrival of cargo from a farm, confirming piece count, weight, and temperature, and noting any discrepancies.
-   **Story:** As a warehouse operator, I want to upload a "Warehouse Receipt" document, which updates the milestone status.
-   **Story:** As a compliance officer, I want to verify that all required documents (e.g., Commercial Invoice, Phyto) have been uploaded by the farm before the cargo departs.

---

## Epic 3: Multi-Leg Transit & Automated Alerting

> As a stakeholder, I need to track the shipment's journey in real-time and receive timely alerts about its status.

### Feature 3.1: Transit Visibility
-   **Story:** As a user, I want to see the shipment's status change to 'Departed from Origin' once it's on its flight.
-   **Story:** As a user tracking a shipment with a connection, I want to see updates for each leg of the journey (e.g., "Arrived at Transit Hub," "Departed from Transit Hub").
-   **Story:** As a user, I want to see the shipment's status change to 'Arrived at Destination' once it lands.

### Feature 3.2: Automated Stakeholder Alerts
-   **Story:** As a customer, I want to receive an automated "Departure Alert" email when my shipment leaves its origin.
-   **Story:** As a customs broker, I want to receive an automated "Documents" email with all necessary paperwork as soon as the cargo is confirmed at origin.
-   **Story:** As a consignee, I want to receive an "Arrival Alert" when the shipment has landed at the destination airport.
-   **Story:** As a customer, I want to be notified immediately of any changes, such as delays or flight cancellations, with an "Update Alert".

---

## Epic 4: Command Center & Analytics

> As a manager, I need a high-level overview of all operations to make informed decisions.

### Feature 4.1: Central Dashboard
-   **Story:** As a manager, I want a dashboard with KPIs like On-Time Delivery % and Total Active Shipments to monitor overall performance.
-   **Story:** As a manager, I want the dashboard to highlight shipments that are 'Delayed' or 'Require Action' so I can prioritize my attention.
-   **Story:** As an analyst, I want to see a "Delay Hotspots" chart to identify which milestone in the new workflow is causing the most issues.
-   **Story:** As a manager, I want to see a "Farm Overview" section on the dashboard with KPIs for total, approved, and pending farms.
-   **Story:** As a manager, I want to be able to click on a farm KPI to drill down into a pre-filtered list of those farms.