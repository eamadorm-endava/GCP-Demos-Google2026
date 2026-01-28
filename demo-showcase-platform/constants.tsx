
import React from 'react';
import { ShoppingCart, Stethoscope, Landmark, Factory, Globe } from 'lucide-react';
import { VerticalType, VerticalConfig } from './types';

export const IDLE_TIMEOUT = 120000; // 2 minutes

export const VERTICALS: VerticalConfig[] = [
  {
    id: 'retail',
    title: 'Smart Retail',
    icon: 'shopping-cart',
    color: 'bg-blue-600',
    pitch: {
      problem: 'Retailers struggle with siloed inventory data and unpredictable supply chains.',
      solution: 'Vertex AI + BigQuery unified data platform for real-time demand forecasting.',
      talkingPoints: [
        '30% reduction in stock-outs using predictive modeling.',
        'Real-time inventory syncing across 500+ locations.',
        'Generative AI shopping assistants for personalized CX.'
      ]
    }
  },
  {
    id: 'healthcare',
    title: 'HealthCare AI',
    icon: 'stethoscope',
    color: 'bg-green-600',
    pitch: {
      problem: 'Clinicians spend 40% of their time on manual administrative tasks.',
      solution: 'Google Cloud Healthcare API + Gemini Pro for automated medical documentation.',
      talkingPoints: [
        'Secure HIPAA-compliant data interoperability.',
        'Automated clinical summarization from patient transcripts.',
        'Predictive analytics for early chronic disease detection.'
      ]
    }
  },
  {
    id: 'fintech',
    title: 'FinTech Secure',
    icon: 'landmark',
    color: 'bg-purple-600',
    pitch: {
      problem: 'Legacy fraud detection systems miss 15% of sophisticated digital attacks.',
      solution: 'Cloud Spanner + ML Hub for sub-millisecond transaction scoring.',
      talkingPoints: [
        '99.999% uptime for global transactional processing.',
        'Graph analysis for detecting hidden money laundering rings.',
        'Seamless integration with multi-cloud payment gateways.'
      ]
    }
  },
  {
    id: 'manufacturing',
    title: 'Smart Factory',
    icon: 'factory',
    color: 'bg-orange-600',
    externalUrl: 'https://cloud.google.com/solutions/manufacturing',
    pitch: {
      problem: 'Factories lose millions due to unplanned downtime and equipment failure.',
      solution: 'Vertex AI Vision + IoT Core for predictive maintenance and quality control.',
      talkingPoints: [
        '95% accuracy in automated visual quality inspection.',
        'Predict equipment failure 48 hours in advance.',
        'Reduced energy consumption by 15% via AI optimization.'
      ]
    }
  },
  {
    id: 'genai-labs',
    title: 'GenAI Labs',
    icon: 'globe',
    color: 'bg-red-600',
    externalUrl: 'https://cloud.google.com/vertex-ai', // Example external demo
    pitch: {
      problem: 'Enterprises need a centralized environment to test and scale GenAI prototypes.',
      solution: 'Endava Enterprise GenAI Accelerator with Vertex AI Model Garden integration.',
      talkingPoints: [
        'Rapid prototyping with 100+ pre-trained models.',
        'Enterprise-grade security and data isolation.',
        'Direct integration with existing GCP datasets.'
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
