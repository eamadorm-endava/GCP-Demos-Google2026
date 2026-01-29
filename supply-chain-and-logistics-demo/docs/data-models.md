# Data Models: Supply Chain Demo

This document details the data structures used throughout the Supply Chain Demo application. These models define the shape of the data for shipments, milestones, documents, and other related entities.

---

### 1. Shipment

The central entity in the application. It represents a single order from origin to destination.

-   **`id`** (string): A unique identifier for the shipment (e.g., `SHP-FLW8473`).
-   **`mawb`** (string): The Master Air Waybill number.
-   **`hawb`** (string): The House Air Waybill number.
-   **`customer`** (string): The name of the customer company.
-   **`farmId`** (string): A foreign key linking to the `id` of the origin `Farm`.
-   **`origin`** (Location): An object containing the origin location details.
-   **`destination`** (Location): An object containing the destination location details.
-   **`status`** (ShipmentStatus): The overall current status of the shipment.
-   **`estimatedDeliveryDate`** (string): The estimated date of arrival in `YYYY-MM-DD` format.
-   **`commodity`** (string): The type of product being shipped (e.g., "Fresh Cut Flowers").
-   **`milestones`** (Milestone[]): An array of milestone objects representing the shipment's journey.
-   **`documents`** (Document[]): An array of document objects attached to the shipment.
-   **`communication`** (Message[]): An array of chat messages.
-   **`attachedParties`** (Party[]): An array of stakeholders involved.
-   **`trackingUrl`** (string): A unique, shareable URL for tracking the shipment.
-   **`cost`** (ShipmentCost): An object containing the breakdown of shipment costs.

**Example `Shipment` Object:**
```json
{
  "id": "SHP-FLW8473",
  "mawb": "123-45678901",
  "hawb": "HPL-BOGMIA-001",
  "customer": "Bloom & Petal",
  "farmId": "FARM-COL-001",
  "origin": { "country": "Colombia", "city": "Bogotá", "lat": 4.71, "lng": -74.07 },
  "destination": { "country": "USA", "city": "Miami, FL", "lat": 25.76, "lng": -80.19 },
  "status": "In Transit",
  "commodity": "Fresh Cut Flowers",
  "estimatedDeliveryDate": "2023-10-08",
  "milestones": [ /* ... Milestone objects ... */ ],
  /* ... etc ... */
}
```

---

### 2. Milestone

Represents a specific step or stage in the shipment's journey, aligned with the new workflow.

-   **`name`** (MilestoneName): The name of the milestone (e.g., `bookingConfirmed`, `departedFromOrigin`).
-   **`status`** (MilestoneStatus): The status of this specific milestone.
-   **`date`** (string | null): The completion date in `YYYY-MM-DD` format, or `null` if not completed.
-   **`documents`** (Document[]): Any documents specifically associated with this milestone.
-   **`details`** (string, optional): Additional information, such as the reason for a delay or flight numbers for transit legs.

**Example `Milestone` Object:**
```json
{
  "name": "departedFromOrigin",
  "status": "Completed",
  "date": "2023-10-06",
  "documents": [],
  "details": "Flight AA123 departed from BOG."
}
```

---

### 3. Farm ("Finca")

Represents a supplier, typically a farm, which is the starting point of the cargo. Based on the registration forms in the provided CSV.

-   **`id`** (string): A unique identifier for the farm.
-   **`name`** (string): The legal name of the farm.
-   **`originCountry`** (string): The country where the farm is located (e.g., 'Colombia', 'Ecuador').
-   **`contact`** (object): Contact person's details.
    -   `name` (string)
    -   `email` (string)
-   **`address`** (object): The physical address of the farm.
    - `line1` (string)
    - `municipality` (string)
    - `postalCode` (string, optional)
-   **`status`** (FarmStatus): The current registration status of the farm.
-   **`registrationDocs`** (object): A key-value map where keys are document names and values are objects indicating their status.
    - `[docName]` (string): The name of the required document.
        - `required` (boolean): Whether the document is mandatory for this country.
        - `uploaded` (boolean): Whether the document has been provided and marked as uploaded.

**Example `Farm` Object:**
```json
{
  "id": "FARM-COL-002",
  "name": "Claveles de Rionegro",
  "originCountry": "Colombia",
  "contact": { "name": "Sofia Vergara", "email": "sofia.v@clavelesrio.co" },
  "address": { "line1": "Vereda Guayabito", "municipality": "Rionegro" },
  "status": "Pending Review",
  "registrationDocs": {
    "RUT COMPLETO": { "required": true, "uploaded": true },
    "CAMARA DE COMERCIO": { "required": true, "uploaded": true },
    "CEDULA REPRESENTANTE LEGAL": { "required": true, "uploaded": false }
  }
}
```

---

### 4. Enumerated Types

-   **`ShipmentStatus`**: Represents the overall status of a shipment.
    -   Possible values: `'Pending'`, `'In Transit'`, `'Delivered'`, `'Delayed'`, `'Requires Action'`, `'Cancelled'`.

-   **`MilestoneStatus`**: Represents the status of an individual milestone.
    -   Possible values: `'Pending'`, `'In Progress'`, `'Completed'`, `'Delayed'`, `'Requires Action'`, `'Cancelled'`.

-   **`MilestoneName`**: Represents the unique key for each milestone in the defined workflow.
    -   Possible values: `'bookingConfirmed'`, `'cargoReceivedOrigin'`, `'departedFromOrigin'`, `'customsClearanceDest'`, `'finalDelivery'`.

-   **`FarmStatus`**: Represents the registration status of a farm.
    - Possible values: `'Approved'`, `'Pending Review'`, `'Rejected'`.