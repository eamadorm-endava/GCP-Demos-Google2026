# Backend API Documentation: Supply Chain Demo

This document provides a detailed specification for the backend REST API required to power the Supply Chain Demo application.

## Base URL
`/api/v1`

## Authentication
All endpoints, except for `/auth/login`, require a valid `Authorization: Bearer <JWT_TOKEN>` header. The token would be obtained from the login endpoint.

---

## 1. Authentication Endpoints

### `POST /auth/login`
Authenticates a user and returns a JWT.

**Request Body:**
```json
{
  "username": "manager",
  "password": "password123"
}
```
- `username` (string, required)
- `password` (string, required)

**Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-1",
    "name": "Alex Johnson",
    "role": "Manager"
  }
}
```

**Error Responses:**
- `400 Bad Request`: If username or password are not provided.
- `401 Unauthorized`: If credentials are invalid.

### `POST /auth/logout`
Logs the user out. (In a real implementation, this would invalidate the token on the server side if using a denylist).

**Request Body:** (empty)

**Success Response (204 No Content)**

**Error Responses:**
- `401 Unauthorized`: If no valid token is provided.

---

## 2. Shipment Endpoints

### `GET /shipments`
Retrieves a list of shipments, with optional filtering and searching.

**Query Parameters:**
- `status` (string, optional): Filter by shipment status (e.g., `Delayed`, `In Transit`).
- `q` (string, optional): Search query for ID, customer, origin, or destination.

**Success Response (200 OK):**
Returns an array of `Shipment` objects.
```json
[
  {
    "id": "SHP-FLW8473",
    "customer": "Bloom & Petal",
    "origin": { "city": "Bogotá", ... },
    "destination": { "city": "Miami, FL", ... },
    "status": "In Transit",
    "estimatedDeliveryDate": "2023-10-08"
  },
  ...
]
```

**Error Responses:**
- `401 Unauthorized`: If the user is not authenticated.

### `POST /shipments`
Creates a new shipment.

**Request Body:**
```json
{
  "customer": "New Bloom Inc.",
  "farmId": "FARM-COL-001",
  "origin": { "country": "Colombia", "city": "Bogotá" },
  "destination": { "country": "USA", "city": "Miami" },
  "estimatedDeliveryDate": "2024-08-15",
  "documents": ["Commercial Invoice.pdf", "Phytosanitary Certificate.pdf"]
}
```

**Success Response (201 Created):**
Returns the full `Shipment` object as created on the server.
```json
{
  "id": "SHP-XYZ1234",
  /* ... all other shipment properties ... */
}
```

**Error Responses:**
- `400 Bad Request`: If required fields are missing or invalid.
- `401 Unauthorized`: If the user is not authenticated.

### `GET /shipments/{id}`
Retrieves the full details for a single shipment.

**Path Parameters:**
- `id` (string, required): The ID of the shipment.

**Success Response (200 OK):**
Returns the full `Shipment` object.

**Error Responses:**
- `401 Unauthorized`.
- `404 Not Found`: If the shipment does not exist.

### `POST /shipments/{id}/cancel`
Cancels a shipment. (Requires Manager role).

**Request Body:** (empty)

**Success Response (200 OK):**
Returns the updated `Shipment` object with the 'Cancelled' status.

**Error Responses:**
- `401 Unauthorized`.
- `403 Forbidden`: If user is not a Manager.
- `404 Not Found`.
- `409 Conflict`: If the shipment is already delivered and cannot be cancelled.

---

## 3. Milestone & Workflow Endpoints

### `PATCH /shipments/{id}/milestones/{milestoneName}`
Updates the status of a specific milestone.

**Path Parameters:**
- `id` (string, required): The ID of the shipment.
- `milestoneName` (string, required): The unique name of the milestone (e.g., `customsClearanceDest`).

**Request Body:**
```json
{
  "status": "Delayed",
  "details": "Flight cancelled due to bad weather."
}
```
- `status` (MilestoneStatus, required)
- `details` (string, optional)

**Success Response (200 OK):**
Returns the updated `Shipment` object.

**Error Responses:**
- `400 Bad Request`: Invalid status or request body.
- `401 Unauthorized`.
- `404 Not Found`: Shipment or milestone not found.

### `POST /shipments/{id}/realtime-update`
Simulates a real-time update by advancing the shipment to its next logical milestone.

**Request Body:** (empty)

**Success Response (200 OK):**
Returns the updated `Shipment` object.

**Error Responses:**
- `401 Unauthorized`.
- `404 Not Found`.
- `409 Conflict`: If the shipment is already delivered or cancelled.

---

## 4. Farm Endpoints

### `GET /farms`
Retrieves a list of farms, with optional filtering and searching.

**Query Parameters:**
- `status` (string, optional): Filter by farm registration status (e.g., `Approved`, `Pending Review`).
- `q` (string, optional): Search query for farm name or country.

**Success Response (200 OK):**
Returns an array of `Farm` objects.

### `POST /farms`
Registers a new farm. The new farm will have a status of `Pending Review`.

**Request Body:**
```json
{
  "name": "Andes Growers",
  "originCountry": "Ecuador",
  "contact": { "name": "Mateo Carrera", "email": "mateo.c@andesgrowers.ec" },
  "address": { "line1": "Av. de las Américas", "municipality": "Quito", "postalCode": "170124" }
}
```

**Success Response (201 Created):**
Returns the full `Farm` object as created on the server.

### `GET /farms/{id}`
Retrieves the full details for a single farm.

**Path Parameters:**
- `id` (string, required): The ID of the farm.

**Success Response (200 OK):** Returns the full `Farm` object.

### `PATCH /farms/{id}/status`
Approves or rejects a farm registration. (Requires Manager role).

**Request Body:**
```json
{
  "status": "Approved"
}
```
- `status` (string, required): Must be either `Approved` or `Rejected`.

**Success Response (200 OK):** Returns the updated `Farm` object.

**Error Responses:**
- `403 Forbidden`: If user is not a Manager.

### `PATCH /farms/{id}/documents/{docName}`
Marks a specific registration document as uploaded. (Requires Manager role).

**Path Parameters:**
- `id` (string, required): The ID of the farm.
- `docName` (string, required): The URL-encoded name of the document.

**Request Body:**
```json
{
  "uploaded": true
}
```
- `uploaded` (boolean, required)

**Success Response (200 OK):** Returns the updated `Farm` object.

---

## 5. Document & Communication Endpoints

### `POST /shipments/{id}/messages`
Adds a new message to a shipment's communication log.

**Path Parameters:**
- `id` (string, required): The ID of the shipment.

**Request Body:**
```json
{
  "text": "The container has arrived at the port."
}
```
- `text` (string, required)

**Success Response (201 Created):**
Returns the newly created `Message` object.

**Error Responses:**
- `400 Bad Request`: If `text` is missing.
- `401 Unauthorized`.
- `404 Not Found`.

### `POST /shipments/{id}/documents`
Initiates a document upload. (A common pattern is to first get a signed URL, then upload the file directly to Cloud Storage).

**Request Body:**
```json
{
  "fileName": "revised-invoice.pdf",
  "fileType": "application/pdf"
}
```

**Success Response (200 OK):**
Returns a signed URL for the client to upload the file to.
```json
{
  "uploadUrl": "https://storage.googleapis.com/...",
  "document": {
    "id": "doc-xyz789",
    "name": "revised-invoice.pdf",
    "url": "https://storage.googleapis.com/...",
    "uploadedAt": "2023-10-22"
  }
}
```
After the client uploads the file, it can confirm the upload with another API call, or the backend can use a storage trigger to finalize the process.

---

## 6. AI Service Endpoints (Backend Proxies)

### `POST /ai/suggest-documents`
Gets suggested documents for a new shipment.

**Request Body:**
```json
{
  "originCountry": "Colombia",
  "destinationCountry": "USA",
  "language": "en"
}
```

**Success Response (200 OK):**
```json
{
  "documents": [
    "Commercial Invoice",
    "Air Waybill (AWB)",
    "Phytosanitary Certificate",
    "Certificate of Origin"
  ]
}
```
**Error Responses:**
- `400 Bad Request`.
- `401 Unauthorized`.
- `502 Bad Gateway`: If the Gemini API fails.

### `GET /shipments/{id}/risk-analysis`
Performs a risk analysis on a specific shipment.

**Success Response (200 OK):**
```json
{
  "riskLevel": "Medium",
  "analysisPoints": [
    "The shipment is currently delayed at a key transit point.",
    "A customs milestone is approaching, which often carries a risk of document-related holds."
  ]
}
```
**Error Responses:**
- `401 Unauthorized`.
- `404 Not Found`.
- `502 Bad Gateway`: If the Gemini API fails.

### `GET /shipments/{id}/summary`
Generates an AI-powered summary for a shipment.

**Success Response (200 OK):**
```json
{
  "summary": "The shipment is currently in transit and has passed customs, but it experienced a weather-related delay earlier.",
  "highlights": [
    "Currently In Transit",
    "Cleared customs",
    "Previously delayed by 24 hours"
  ]
}
```
**Error Responses:**
- `401 Unauthorized`.
- `404 Not Found`.
- `502 Bad Gateway`: If the Gemini API fails.

### `POST /shipments/{id}/summarize-chat`
Summarizes the collaboration chat for a shipment.

**Request Body:** (empty)

**Success Response (200 OK):**
```json
{
  "summary": "- **Action Item:** Customer needs to provide revised invoice.\n- **Decision:** Re-booked on the next flight due to weather cancellation."
}
```
**Error Responses:**
- `401 Unauthorized`.
- `404 Not Found`.
- `502 Bad Gateway`: If the Gemini API fails.