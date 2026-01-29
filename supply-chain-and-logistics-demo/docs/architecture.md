# Solution Architecture: Supply Chain Demo on Google Cloud

This document outlines a scalable, serverless, end-to-end architecture on Google Cloud to support a production-grade version of the Supply Chain Demo application.

## 1. Architectural Principles

- **Serverless First:** Utilize managed, serverless services to minimize operational overhead and scale automatically with demand.
- **Decoupled Components:** Separate the frontend, backend, and data layers to allow for independent development, scaling, and maintenance.
- **Security by Design:** Integrate security at every layer, from user authentication to secure API key management.
- **CI/CD Automation:** Automate the build, test, and deployment process to ensure reliability and speed.

## 2. High-Level Architecture Diagram

```
[User's Browser] <--> [Cloud CDN] <--> [Cloud Storage (Static Site)]
       |
       | (Login/Auth)
       V
[Firebase Authentication / Identity Platform]
       |
       | (API Calls with Auth Token)
       V
[API Gateway] <--> [Cloud Functions (Backend API)] <--> [Gemini API]
       |                                   |
       |                                   V
       +----------------------------> [Firestore (Database)]
       |
       +----------------------------> [Secret Manager (API Keys)]
```

## 3. Component Breakdown

### 3.1. Frontend Hosting

-   **Cloud Storage:** A static website bucket in Cloud Storage will host the production build of the React application (`dist` folder). This is a cost-effective and highly durable solution for static assets.
-   **Cloud CDN:** Placed in front of the Cloud Storage bucket, Cloud CDN caches the application's static assets (HTML, JS, CSS) at Google's edge locations worldwide. This ensures low-latency delivery and improved performance for global users.

### 3.2. Authentication

-   **Firebase Authentication** or **Cloud Identity Platform:** A managed identity provider service will handle all user authentication. It will manage user accounts, credentials, and the issuance of JWT (JSON Web Tokens) upon successful login. The frontend client will securely store this token.

### 3.3. Backend API Layer

-   **Cloud Functions:** The entire backend logic will be implemented as a set of serverless functions. These functions will handle requests for creating, reading, updating, and deleting shipment data, and interacting with other services.
-   **API Gateway:** This acts as the single entry point for all client requests. It will be configured to require a valid JWT from Firebase Authentication for all protected endpoints. It provides essential features like rate limiting, monitoring, and routing requests to the appropriate Cloud Functions.

### 3.4. Data Storage

-   **Firestore:** A serverless NoSQL document database is the ideal choice for storing shipment data, user profiles, and chat messages. Its flexible data model aligns well with the application's needs, and its real-time capabilities can be leveraged to push updates to clients automatically.
-   **Cloud Storage (for Documents):** A separate Cloud Storage bucket will be used for storing user-uploaded documents (e.g., invoices, certificates). Cloud Functions will generate signed URLs to allow clients to upload and download these files securely.

### 3.5. AI & External Services Integration

-   **Gemini API:** Instead of being called directly from the client, all calls to the Gemini API will be proxied through a dedicated Cloud Function. This is a critical security measure. The backend function retrieves the API key from Secret Manager, makes the request to the Gemini API, and then returns the response to the client. This prevents the API key from ever being exposed in the browser.
-   **Secret Manager:** All sensitive credentials, especially the Google Gemini API key, will be stored securely in Secret Manager. The Cloud Functions will have IAM permissions to access these secrets at runtime, eliminating the need to hardcode keys in the application code.

## 4. CI/CD Pipeline

-   **Cloud Build:** A `cloudbuild.yaml` file in the source repository will define the continuous integration and deployment pipeline.
-   **Trigger:** The pipeline will be triggered on every push to the `main` branch.
-   **Steps:**
    1.  Install dependencies.
    2.  Run linting and unit tests.
    3.  Build the production version of the React application.
    4.  Deploy the static assets from the `dist` folder to the Cloud Storage hosting bucket.
    5.  Deploy the backend Cloud Functions.

This serverless architecture provides a robust, secure, and scalable foundation for the Supply Chain Demo, allowing it to grow from a demo into a full-fledged production application with minimal operational effort.
