# Supply Chain Demo: Customer Walkthrough Script

**Presenter Persona:** A solutions consultant from the development team.

**Audience:** Key stakeholders from the client's logistics and management teams (e.g., HPL Apollo Ops).

**Goal:** To showcase the application as a central "Command Center" that provides comprehensive visibility and directly maps to their defined operational workflow, highlighting the value of integrated AI features.

---

### 1. Introduction & Secure Login

**(Screen: Login Page)**

"Good morning, everyone. Thank you for joining. Today, we're going to walk you through the HPL Apollo Supply Chain Command Center, a platform we've designed to bring unparalleled visibility and intelligence to your logistics operations.

"Security and access control are paramount, so every user journey begins at our secure login screen. The platform is built to support different roles, like managers who need a high-level overview and specialists who handle the day-to-day operations. For this first part of the demo, I'll log in as **Alex Johnson**, a manager."

*(Action: Log in with username `manager` and password `password123`)*

---

### 2. The Command Center: Connecting the Workflow to the Platform

**(Screen: Main Dashboard)**

"After logging in, Alex is greeted by the Command Center. Before we dive into the specifics, I want to frame how this platform directly maps to the detailed workflow you've designed in your PDF.

"We've translated that complex, multi-stage process into this streamlined, interactive interface. Think of this as the digital twin of your operational swim lanes. The four major processes from your document are represented like this:
*   **Stages 1 and 2, 'Inicialización Operativa' and 'Booking',** are handled by our 'New Shipment' form and our new 'Farm Management' module. It's where all the initial data and supplier compliance is handled to kick things off.
*   **Stage 3, 'Recepción' at Origin,** is directly represented by the 'Cargo Received at Origin' milestone in our tracker.
*   And **Stage 4, 'Transito',** is visualized through the subsequent milestones: 'Departed from Origin', 'Customs Clearance', and 'Final Delivery'.

"It’s important to note that we've intentionally abstracted some of the very granular, physical, or internal steps. For example, an action like 'Cargar tarifas a CW' or a driver arriving at the warehouse is represented by the *result*—a status update on a milestone. This keeps the interface clean and focused on high-level tracking and exception management.

"Now, let's look at the dashboard itself. Alex's view is tailored for a manager, providing a 30,000-foot overview of the entire supply chain.

"We have our primary KPIs for shipments: **Active Shipments, On-Time Delivery, Requires Action, and Delayed Shipments.** The last two are crucial calls to action. With a single click, a manager can drill down to a filtered list of exactly those shipments that need immediate attention.

"Below that, we've integrated a new **Farm Overview**. This gives Alex immediate insight into the supplier network: the total number of registered farms, how many are approved and ready for business, and how many are pending review. Just like the shipment KPIs, these are clickable for quick drill-downs.

"The dashboard also includes deeper analytics like **Top Trade Lanes** for negotiating with carriers, and **Delay Hotspots**, which analyzes which stage of your workflow is causing the most delays, helping you pinpoint and resolve systemic bottlenecks."

---

### 3. Farm Management: Ensuring Compliance from the Start

**(Screen: Dashboard, then navigate to Farms view)**

"A key part of the 'Inicialización Operativa' is ensuring your suppliers, or 'Fincas', are fully compliant. Let's drill into our pending farms directly from the dashboard."

*(Action: Click the 'Pending Farms' KPI card. The view will navigate to the Farm List, pre-filtered to 'Pending Review'.)*

**(Screen: Farm Management view)**

"We're now in the dedicated Farm Management module. You can see the list is already filtered to show us only the farms pending review. We also have powerful search and additional filtering options to easily manage a large supplier network.

"Let's look at 'Finca Honduras Verde' to see why it's pending."

*(Action: Click on 'Finca Honduras Verde' in the list.)*

"In the detail view, we see all the contact and address information. More importantly, under 'Required Documents', the system displays a **country-specific compliance checklist**. Because this farm is in Honduras, it has a different set of requirements than a farm in Colombia. We can immediately see one document is still marked as 'Missing'.

"Let's say the farm has just emailed this document. As a manager, Alex can now update the system."

*(Action: Click the 'Mark as Uploaded' button next to the missing document. The status changes to 'Uploaded'.)*

"Now that all required documents are accounted for, Alex can approve the farm's registration."

*(Action: Click the 'Approve' button. The farm's status badge changes to 'Approved'.)*

"This entire workflow ensures that you only work with fully vetted partners. But how do new farms get into the system? Let's quickly look at the registration process."

*(Action: Click the 'Register Farm' button in the header.)*

**(Screen: New Farm Form modal)**

"Any user can initiate a registration by filling out this form. When they select a country, the system automatically determines which documents will be required for compliance. Once submitted, the farm is added to the system with a 'Pending Review' status, ready for a manager to action. This closes the loop on the onboarding process."

*(Action: Close the modal.)*

---

### 4. Creating a New Shipment with AI Assistance

**(Screen: Main view, then New Order Form)**

"Now that our farm is approved, let's see how this integrates into creating a new shipment. This process directly corresponds to the rest of **Stages 1 and 2 of your workflow.**"

*(Action: Click the 'New Shipment' button in the header.)*

"This form is the digital entry point for all the critical data. Instead of a free-text field for the supplier, we now have a dropdown for 'Origin Farm' that **only lists approved farms**. This is a key control point."

*(Action: Select an approved farm from the dropdown. Note that the Origin Country and City auto-populate.)*

"Notice how selecting the farm automatically populates the origin details, saving time and reducing errors. The most innovative feature is right here, in the yellow box.

"As we define the route—say, to the **USA**—our **AI-Powered Document Suggestion** tool analyzes the compliance requirements for that specific trade lane and provides a checklist of necessary documents. This is a proactive step to prevent customs issues. It ensures compliance from the very beginning."

*(Action: Fill out the rest of the form, select some suggested documents, and click 'Create Shipment'.)*

"And there it is. Our new shipment is created and immediately appears in the system, ready to begin its journey."

---

### 5. Shipment Deep Dive & AI Collaboration

**(Screen: Shipment Detail view for shipment SHP-FLW7777)**

"Now we're in the detailed view for a shipment that requires action. This is where your specialists will spend most of their time. The first thing you see is our **AI-Powered Summary**. Instead of digging through logs, Gemini provides a clear, natural-language summary of the shipment's current situation: a customs issue has occurred.

"Let's look at the **Workflow** tab. The **Milestone Tracker** is the heart of the operational workflow, directly mapping to **Stage 3, 'Recepción', and Stage 4, 'Transito'.** Here, your team can manually update statuses to reflect real-world events or an automated update can be triggered by an integrated system like CargoWise.

*(Action: Navigate to the 'Collaboration' tab.)*

"The **Collaboration** tab is a central hub for all communication. If this chat log were 50 messages long, we could simply click **'Summarize Conversation'**. Gemini reads the entire history and provides a concise summary, highlighting action items and key decisions. This saves an incredible amount of time.

*(Action: Navigate to the 'Risk Analysis' tab.)*

"Finally, the **Risk Analysis** tab uses Gemini to perform a real-time assessment of the shipment. It confirms the risk is 'High' and points out the exact problem—the document mismatch—providing clear, actionable intelligence."

---

### 6. Future Vision: The Proactive Supply Chain

**(Screen: Any)**

"What we've shown you is a powerful command center for today's operations. But we're also building the foundation for the proactive supply chain of tomorrow. I want to quickly share our vision for the next evolution of this platform.

"First, imagine **Proactive Delay Prediction**. By analyzing historical data and real-time events like weather, the system could alert you to a 75% chance of a customs delay *before the shipment even departs*, allowing you to re-route and avoid the issue entirely.

"Second, a **Conversational AI Assistant**. Instead of clicking filters, you could simply type, 'Show me all delayed flower shipments for Bloom & Petal,' and the system would instantly respond.

"Third, **Automated Document Anomaly Detection**. The system could 'read' an uploaded invoice and packing list, automatically cross-reference the piece counts, and flag a mismatch before it ever becomes a customs problem.

"And finally, **ESG and Carbon Footprint Tracking**. We can integrate CO2 emission calculations for every shipment, providing you with valuable data for sustainability reports.

"This is the direction we're heading: a platform that isn't just for monitoring, but for predicting, advising, and automating."

---

### 7. Conclusion & Q&A

"To quickly recap, the Command Center provides:
1.  **A single source of truth** that digitally mirrors your operational workflow, including a full farm compliance and onboarding module.
2.  **Detailed, real-time tracking** of every shipment's lifecycle.
3.  **Integrated AI tools** that provide summaries, analyze risks, and ensure compliance.
4.  **A clear vision** for evolving into a predictive and automated platform.

"Thank you for your time. I'd now be happy to answer any questions you may have."