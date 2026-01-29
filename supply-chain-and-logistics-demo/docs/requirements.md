# Application Requirements: Supply Chain Demo

This document outlines the detailed requirements for the Supply Chain Demo application.

## 1. Functional Requirements

### 1.1. Dashboard
- **FR-1.1:** The application must display a main dashboard as the entry point after login.
- **FR-1.2:** The dashboard must show key performance indicators (KPIs) including:
    - Total Active Shipments
    - On-Time Delivery Percentage
    - Number of Shipments Requiring Action
    - Number of Delayed Shipments
- **FR-1.3:** The dashboard must feature an "Attention Required" section listing shipments that are delayed or require action.
- **FR-1.4:** The dashboard must include analytical charts for "Delay Hotspots" (mapped to new workflow milestones) and "Top Trade Lanes".
- **FR-1.5:** The dashboard must display a "Farm Overview" section with KPIs for Total, Approved, and Pending farms. These KPIs must be clickable, leading to a pre-filtered list.

### 1.2. Operational Initialization & Farm Management
- **FR-2.1:** Users must be able to create a new shipment via a comprehensive "Operational Initialization" form.
- **FR-2.2:** The shipment creation form must capture key details such as customer, commodity type, and estimated dates.
- **FR-2.3:** The form must allow for entering Master Air Waybill (MAWB) and House Air Waybill (HAWB) numbers.
- **FR-2.4:** The system must feature a complete Farm ("Finca") Management module.
- **FR-2.5:** Users must be able to register a new farm through a dedicated form, capturing name, contact, and address information.
- **FR-2.6:** The farm registration form must dynamically generate a list of required compliance documents based on the farm's country.
- **FR-2.7:** A dedicated "Farms" view must list all registered farms, with search and filtering capabilities (by name, country, status).
- **FR-2.8:** The farm detail view must show all farm information and the status of its required documents.
- **FR-2.9:** Users with a 'Manager' role must be able to approve or reject pending farm registrations.
- **FR-2.10:** Managers must be able to manually mark a farm's missing documents as 'Uploaded' to facilitate the approval process.
- **FR-2.11:** The "New Shipment" form must restrict the selection of origin farms to only those with an 'Approved' status.

### 1.3. Shipment Management & Tracking
- **FR-3.1:** Users must be able to view a list of all shipments, searchable by ID, MAWB/HAWB, customer, origin, and destination.
- **FR-3.2:** The shipment list must be filterable by status (e.g., Pending, In Transit, Delayed).
- **FR-3.3:** Users must be able to select a shipment to view its detailed lifecycle.
- **FR-3.4:** Users with a 'Manager' role must be able to cancel an active shipment.

### 1.4. Shipment Detail View & Workflow
- **FR-4.1:** The detail view must display all core information: ID, MAWB/HAWB, customer, origin farm, destination, EDD, and status.
- **FR-4.2:** The view must feature a milestone tracker that accurately reflects the key stages: Booking Confirmed, Cargo Received at Origin, Departed from Origin, Customs Clearance, and Final Delivery.
- **FR-4.3:** The system must support the concept of multi-leg transits and send corresponding alerts (e.g., "Departure Alert 1st Leg", "Arrival Alert Destination"). (Simulated via milestone details).
- **FR-4.4:** Users must be able to manually update the status of milestones to reflect real-world events.
- **FR-4.5:** The view must include tabs for managing documents and stakeholder collaboration (chat).

### 1.5. AI-Powered Features
- **FR-5.1:** When creating a new order, the system must use the Gemini API to suggest required documents based on origin and destination.
- **FR-5.2:** A "Risk Analysis" tab must use the Gemini API to provide a risk assessment based on the shipment's current state.
- **FR-5.3:** The collaboration chat must have a feature to summarize the conversation using the Gemini API.
- **FR-5.4:** The detail view must display an AI-generated summary of the shipment's overall status.

### 1.6. External System Integration
- **FR-6.1:** The application must be designed to conceptually integrate with an external ERP system like CargoWise (CW).
- **FR-6.2:** Status updates originating from CargoWise should trigger automatic updates to the corresponding shipment milestones within the application. (Simulated).
- **FR-6.3:** Manual actions within the application should, in a production environment, trigger updates back to CargoWise.

### 1.7. User Experience
- **FR-7.1:** The entire application must be responsive and functional on desktop, tablet, and mobile devices.
- **FR-7.2:** The application must support language switching between English, Latin American Spanish, and Brazilian Portuguese.

### 1.8. User Authentication & Roles
- **FR-8.1:** The application must be protected by a secure login page.
- **FR-8.2:** The UI must display the name of the logged-in user and provide a logout function.
- **FR-8.3:** The application must enforce a separation of duties between 'Manager' and 'Specialist' roles, restricting certain actions (e.g., cancelling shipments, approving farms) to Managers.

## 2. Non-Functional Requirements
- **NFR-1 (Performance):** The application should load quickly and the UI should be responsive to user input.
- **NFR-2 (Usability):** The interface must be intuitive and follow modern UX/UI design principles.
- **NFR-3 (Security):** User passwords must be securely handled. The Gemini API key must not be exposed on the client-side.
- **NFR-4 (Maintainability):** The code must be well-structured and use a consistent style.