import React from 'react';
import { ShoppingCart, Stethoscope, Landmark, Factory, Globe, ShieldCheck, Layers, FileText, ShieldAlert, Truck, ClipboardCheck } from 'lucide-react';
import { VerticalType, VerticalConfig } from './types';

export const IDLE_TIMEOUT = 900_000; // 15 minutes

export const VERTICALS: VerticalConfig[] = [
  {
    id: 'agentic-governance',
    title: 'Agentic Vendor Governance',
    icon: 'shield-check',
    color: 'bg-indigo-600',
    // CHANGED: Replaced the direct public Cloud Run URL with a local proxy route. 
    // This ensures the iframe calls our own Node.js server first, which will then 
    // inject the Service Account authorization token before forwarding the request to the secure demo.
    externalUrl: '/demos/agentic-governance/',
    imageUrl: '/assets/agentic-governance.jpg',
    pitch: {
      problem: 'Enterprises struggle with costly manual vendor governance, drowning in PDF invoices and self-reported performance metrics that hide true risks and inefficiencies.',
      solution: 'An AI-driven governance layer powered by Gemini that autonomously audits invoices against rate cards, transcribes meetings into action items, and generates strategic QBR reports — replacing manual oversight with agentic automation.',
      talkingPoints: [
        'Multimodal invoice auditing — drag-and-drop a PDF and the Auditor Agent parses line items and flags rate card violations instantly.',
        'Agentic Scribe — live meeting recording with AI transcription and automatic action item extraction.',
        'One-click QBR generation with AI-structured slide decks and recommended chart types.',
        'Head-to-head vendor comparison across 6 vendor types with real-time Agent Intelligence alerts.',
        'Rate Comparison Matrix and Smart Spend Forecaster for proactive cost optimization.'
      ]
    }
  },
  {
    id: 'shelflogic-autonomous-merchandising',
    title: 'ShelfLogic AI',
    icon: 'layers',
    color: 'bg-emerald-600',
    externalUrl: '/demos/shelflogic-inventory/',
    imageUrl: '/assets/shelflogic.jpg',
    pitch: {
      problem: 'Retail merchandising decisions are often slow, manual, and disconnected from real-time shopper demand, resulting in costly dead stock and missed revenue.',
      solution: 'An autonomous store assortment agent that optimizes retail shelf inventory by identifying dead stock and prescribing high-potential replacements.',
      talkingPoints: [
        'Shelf Vision — AI-powered visual analysis of store shelves to detect out-of-stocks and planogram compliance.',
        'Lookalike Store Analysis — Intelligent matching to prescribe high-potential replacement products.',
        'ML Simulation Lab — Test and validate assortment strategies with agentic simulations before execution.'
      ]
    }
  },
  {
    id: 'contract-intelligence',
    title: 'Supply Lens - Contract Intelligence',
    icon: 'file-text',
    color: 'bg-sky-600',
    externalUrl: '/demos/contract-intelligence/',
    imageUrl: '/assets/contract-intelligence.jpg',
    pitch: {
      problem: 'Critical supply chain risks, lead-time obligations, and regulatory compliance issues remain hidden deep within unstructured supplier agreements and complex manufacturing contracts.',
      solution: 'A specialized knowledge management platform that transforms supplier agreements into actionable intelligence using Generative AI.',
      talkingPoints: [
        'AI-Powered Smart Filters — Query and filter contracts using natural language instead of rigid tags.',
        'Proactive Portfolio Insights — Generative AI continuously monitors critical path risks, lead-time obligations, and regulatory compliance.',
        'Automated obligation tracking and executive summarization for rapid decision making.'
      ]
    }
  },
  {
    id: 'sentinel-ai',
    title: 'Sentinel AI',
    icon: 'shield-alert',
    color: 'bg-red-700',
    externalUrl: '/demos/sentinel-ai/',
    imageUrl: '/assets/sentinel-ai.jpg',
    pitch: {
      problem: 'Traditional assurance relies on point-in-time manual audits, leaving organizations exposed to fast-moving enterprise risks and complex regulatory vulnerabilities.',
      solution: 'A sophisticated dashboard demonstrating autonomous AI agents that systematically verify organizational risk controls with real-time simulation and reporting.',
      talkingPoints: [
        'Real-time Autonomous Audit Simulation — Deploy agents that continuously stream back detailed execution logs.',
        'Interactive Agent Control — Monitor planning and execution phases, with the ability to halt active sessions anytime.',
        'Systematic risk verification across dynamic organizational controls with enriched audit reporting.'
      ]
    }
  },
  {
    id: 'supply-chain-logistics',
    title: 'Supply Chain and Shipping Logistics',
    icon: 'truck',
    color: 'bg-orange-500',
    externalUrl: '/demos/supply-chain/',
    imageUrl: '/assets/supply-chain.jpg',
    pitch: {
      problem: 'Global logistics suffer from poor visibility and disconnected stakeholders, leading to costly transit delays, compliance failures, and manual documentation bottlenecks.',
      solution: 'AI-enhanced logistics platform for seamless shipment management, milestone tracking, and documentation handling.',
      talkingPoints: [
        'End-to-End Shipment Visibility — Real-time tracking of fulfillment milestones from origin to destination.',
        'Agentic Documentation — AI automatically suggests required compliance and shipping documents based on shipment origin.',
        'Stakeholder Collaboration — Unified platform connecting farmers, drivers, agents, and customers.'
      ]
    }
  },
  {
    id: 'cloud-compliance',
    title: 'Guardian AI Compliance',
    icon: 'clipboard-check',
    color: 'bg-teal-600',
    externalUrl: '/demos/cloud-compliance/',
    imageUrl: '/assets/cloud-compliance.jpg',
    pitch: {
      problem: 'Navigating complex regulatory compliance frameworks is traditionally manual, reactive, highly prone to human error, and expensive to audit continuously.',
      solution: 'Agentic suite for continuous monitoring, audit generation, and regulatory alignment.',
      talkingPoints: [
        'Real-time risk scoring across multiple frameworks (Banking, Privacy).',
        'Immutable, zero-cost supervisory audit trails generated by agents.',
        'Interactive compliance expert chat and workflow simulation.'
      ]
    }
  },
  {
    id: 'contractinel-ai',
    title: 'Contract Intelligence',
    icon: 'clipboard-check',
    color: 'bg-teal-600',
    externalUrl: '/demos/contractintel/',
    imageUrl: '/assets/contractintel.jpg',
    pitch: {
      problem: 'Banking and FSI organizations lack real-time visibility into complex contractual risks and regulatory compliance exposure, resulting in agonizingly slow legal reviews and hidden financial liabilities.',
      solution: 'AI-powered contract analysis platform delivering real-time risk intelligence, automated reviews, and compliance insights.',
      talkingPoints: [
        'Real-time detection of high-risk clauses and compliance gaps.',
        'Average contract review time reduced to under 10 minutes.',
        'Automated risk scoring across jurisdictions and contract categories.'
      ]
    }
  },
  {
    id: 'buildintel',
    title: 'BuildIntel',
    icon: 'factory',
    color: 'bg-slate-700',
    externalUrl: '/demos/buildintel-construction/',
    imageUrl: '/assets/buildintel.jpg',
    pitch: {
      problem: 'Large-scale construction portfolios lack real-time oversight, risking costly delays across project schedules, dispersed workforce management, and unseen budget variances.',
      solution: 'AI-driven construction intelligence platform for data center delivery optimization using Gemini Enterprise.',
      talkingPoints: [
        'Unified portfolio tracking across projects, schedules, risks, and documents.',
        'Agentic Intelligence Hub with adjustable risk confidence thresholds for autonomous alerting.',
        'Continuous AI oversight to prevent delays and cost overruns in data center delivery.'
      ]
    }
  },
  {
    id: 'ucp-commerce',
    title: 'UCP Commerce Agent',
    icon: 'shopping-cart',
    color: 'bg-purple-600',
    externalUrl: '/demos/ucp/',
    imageUrl: '/assets/ucp.jpg',
    pitch: {
      problem: 'Global commerce platforms lack interoperability, severely limiting cross-merchant integration and preventing autonomous AI shopping assistants from executing seamless multi-vendor transactions.',
      solution: 'Universal Commerce Protocol (UCP) provides an open standard for AI agents to discover, negotiate, and execute commerce transactions autonomously.',
      talkingPoints: [
        'Standardized UCP data types for checkout, fulfillment, and payment operations.',
        'Agent-to-Agent (A2A) discovery and dynamic capability negotiation.',
        'Seamless integration with any UCP-compatible merchant or platform.'
      ]
    }
  }
];

export const MOCK_DATA = {
  retail: {
    inventory: [
      { id: '1', item: 'Cloud Runner Z', stock: 45, status: 'Healthy' },
      { id: '2', item: 'Pixel Buds Pro', stock: 12, status: 'Low Stock' },
      { id: '3', item: 'Chromecast Ultra', stock: 89, status: 'Healthy' },
      { id: '4', item: 'Nest Cam IQ', stock: 5, status: 'Critical' }
    ],
    salesChart: [
      { name: 'Mon', sales: 4000 },
      { name: 'Tue', sales: 3000 },
      { name: 'Wed', sales: 5000 },
      { name: 'Thu', sales: 2780 },
      { name: 'Fri', sales: 1890 },
      { name: 'Sat', sales: 2390 },
      { name: 'Sun', sales: 3490 }
    ]
  },
  healthcare: {
    patients: [
      { id: '101', name: 'Alice Smith', age: 45, condition: 'Stable' },
      { id: '102', name: 'Bob Johnson', age: 67, condition: 'Monitoring' },
      { id: '103', name: 'Charlie Davis', age: 32, condition: 'Critical' }
    ]
  },
  fintech: {
    transactions: [
      { id: 'TX-998', amount: 1250.00, risk: 'Low', status: 'Approved' },
      { id: 'TX-999', amount: 45000.00, risk: 'High', status: 'Flagged' },
      { id: 'TX-1000', amount: 89.99, risk: 'Low', status: 'Approved' }
    ]
  }
};
