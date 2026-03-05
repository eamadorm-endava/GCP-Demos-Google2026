# BuildIntel API Specifications

**Base URL:** `https://api.buildintel.com/v1`

## 1. Projects
### `GET /projects`
Retrieves a list of all active projects in the portfolio.
*   **Response:** `200 OK`
    ```json
    [
      { "id": "1", "name": "Titan Hyperscale", "location": "Ashburn", "riskLevel": "High" }
    ]
    ```

### `GET /projects/{projectId}/dashboard`
Retrieves aggregated data for the main dashboard view.
*   **Response:** `200 OK`
    *   Returns `ProjectData` object (KPIs, Financials, Recent Alerts).

## 2. Risk Agents
### `GET /projects/{projectId}/agents`
List all active agents for a project.

### `POST /projects/{projectId}/agents`
Deploy a new risk agent.
*   **Body:**
    ```json
    {
      "name": "Concrete Monitor",
      "type": "Quality Control",
      "prompt": "Alert if concrete cure time exceeds 48h in daily logs."
    }
    ```

### `GET /projects/{projectId}/alerts`
Get generated alerts.
*   **Query Params:** `minConfidence`, `severity`, `status`.

## 3. Intelligence (Gemini)
### `POST /intelligence/generate-summary`
Generates the executive dashboard summary.
*   **Body:** `{ "projectId": "1", "context": "..." }`
*   **Response:**
    ```json
    {
      "summary": "Project is facing structural delays...",
      "highlights": ["Steel erection 5 days late", "Budget ok"]
    }
    ```

### `POST /intelligence/chat`
Conversational interface endpoint.
*   **Body:**
    ```json
    {
      "message": "What is the impact of RFI-1042?",
      "history": [...]
    }
    ```
*   **Response:**
    ```json
    {
      "text": "RFI-1042 blocks the 'Steel Erection' task...",
      "actions": ["Escalate to Structural Engineer"]
    }
    ```

### `POST /intelligence/predict-impact`
Specific endpoint for RFI/Schedule impact analysis.
*   **Body:**
    ```json
    {
      "rfiId": "RFI-1042",
      "currentSchedule": [...]
    }
    ```
*   **Response:**
    ```json
    {
      "predictedDelay": 12,
      "affectedTaskIds": ["T202", "T301"],
      "explanation": "Based on historical data..."
    }
    ```

## 4. Documents
### `POST /documents/search`
Semantic search across project files.
*   **Body:** `{ "query": "Find clause regarding weather delays" }`
*   **Response:** List of document snippets with relevance scores.
