import type { Shipment, Party, Milestone, ShipmentCost, MilestoneName, Farm } from './types';

// New mock data for Farms
export const INITIAL_FARMS: Farm[] = [
    {
        id: 'FARM-COL-001',
        name: 'Flores de la Sabana',
        originCountry: 'Colombia',
        contact: { name: 'Juan Valdez', email: 'juan.v@fincasabana.co' },
        address: { line1: 'Vereda El Rosal Km 5', municipality: 'Funza' },
        status: 'Approved',
        registrationDocs: {
            'RUT COMPLETO': { required: true, uploaded: true },
            'CAMARA DE COMERCIO': { required: true, uploaded: true },
            'CEDULA REPRESENTANTE LEGAL': { required: true, uploaded: true },
            'CERTIFICACION OEA / BASC': { required: false, uploaded: true },
        }
    },
    {
        id: 'FARM-ECU-001',
        name: 'Rosas del Ecuador',
        originCountry: 'Ecuador',
        contact: { name: 'Isabella Rossi', email: 'isabella.r@rosasecuador.ec' },
        address: { line1: 'Panamericana Sur Km 20', municipality: 'Cayambe', postalCode: '170202' },
        status: 'Approved',
        registrationDocs: {
            'RUC COMPLETO': { required: true, uploaded: true },
            'Codigo Postal': { required: true, uploaded: true },
        }
    },
    {
        id: 'FARM-COL-002',
        name: 'Claveles de Rionegro',
        originCountry: 'Colombia',
        contact: { name: 'Sofia Vergara', email: 'sofia.v@clavelesrio.co' },
        address: { line1: 'Vereda Guayabito', municipality: 'Rionegro' },
        status: 'Pending Review',
        registrationDocs: {
            'RUT COMPLETO': { required: true, uploaded: true },
            'CAMARA DE COMERCIO': { required: true, uploaded: true },
            'CEDULA REPRESENTANTE LEGAL': { required: true, uploaded: false },
            'ESTADOS FINANCIEROS': { required: true, uploaded: false },
            'CERTIFICACION BANCARIA': { required: true, uploaded: true },
        }
    },
    {
        id: 'FARM-ECU-002',
        name: 'Andes Growers',
        originCountry: 'Ecuador',
        contact: { name: 'Mateo Carrera', email: 'mateo.c@andesgrowers.ec' },
        address: { line1: 'Av. de las Américas', municipality: 'Quito', postalCode: '170124' },
        status: 'Rejected',
        registrationDocs: {
            'RUC COMPLETO': { required: true, uploaded: false },
            'Codigo Postal': { required: true, uploaded: true },
        }
    },
    {
        id: 'FARM-CR-001',
        name: 'Pura Vida Plants',
        originCountry: 'Costa Rica',
        contact: { name: 'Carlos Rojas', email: 'c.rojas@puravidaplants.cr' },
        address: { line1: 'Calle de las Flores 123', municipality: 'Alajuela' },
        status: 'Approved',
        registrationDocs: {
            'Cedula Juridica': { required: true, uploaded: true },
            'Numero de Telefono': { required: true, uploaded: true },
            'Direccion': { required: true, uploaded: true },
        }
    },
    {
        id: 'FARM-HN-001',
        name: 'Finca Honduras Verde',
        originCountry: 'Honduras',
        contact: { name: 'Elena Diaz', email: 'elena.d@hondurasverde.hn' },
        address: { line1: 'Carretera a Comayagua', municipality: 'La Paz' },
        status: 'Pending Review',
        registrationDocs: {
            'Numero de Telefono': { required: true, uploaded: true },
            'Correo electronico': { required: true, uploaded: true },
            'Nombre contacto': { required: true, uploaded: false },
        }
    }
];

const PARTIES_SET_1: Party[] = [
  { name: 'Juan Valdez', role: 'Farmer' },
  { name: 'Carlos Rodriguez', role: 'Driver' },
  { name: 'Maria Garcia', role: 'Agent' },
  { name: 'Bloom & Petal', role: 'Customer' },
];

const PARTIES_SET_2: Party[] = [
  { name: 'Isabella Rossi', role: 'Farmer' },
  { name: 'Marco Conti', role: 'Driver' },
  { name: 'Sofia Loren', role: 'Agent' },
  { name: 'The Flower Shop', role: 'Customer' },
];

const PARTIES_SET_3: Party[] = [
  { name: 'Lars van der Berg', role: 'Farmer' },
  { name: 'Sven de Vries', role: 'Driver' },
  { name: 'Anke Schmidt', role: 'Agent' },
  { name: 'Floral Designs Inc.', role: 'Customer' },
];

const PARTIES_SET_4: Party[] = [
  { name: 'Jomo Kenyatta', role: 'Farmer' },
  { name: 'Asha Odhiambo', role: 'Driver' },
  { name: 'Barack Onyango', role: 'Agent' },
  { name: 'Global Flowers Corp', role: 'Customer' },
];

const PARTIES_SET_5: Party[] = [
    { name: 'Liya Kebede', role: 'Farmer' },
    { name: 'Abel Tesfaye', role: 'Driver' },
    { name: 'Hana Girma', role: 'Agent' },
    { name: 'Fresh Blooms Co.', role: 'Customer' },
];

const generateCost = (): ShipmentCost => {
    const freight = Math.floor(Math.random() * 1500) + 500;
    const insurance = Math.floor(Math.random() * 200) + 50;
    const customs = Math.floor(Math.random() * 400) + 100;
    const total = freight + insurance + customs;
    return { freight, insurance, customs, total };
}

export const MILESTONE_KEYS: MilestoneName[] = [
    'bookingConfirmed',
    'cargoReceivedOrigin',
    'departedFromOrigin',
    'customsClearanceDest',
    'finalDelivery'
];

const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export const INITIAL_SHIPMENTS: Shipment[] = [
  {
    id: 'SHP-FLW8473',
    mawb: '123-45678901',
    hawb: 'HPL-BOGMIA-001',
    customer: 'Bloom & Petal',
    farmId: 'FARM-COL-001',
    origin: { country: 'Colombia', city: 'Bogotá', lat: 4.71, lng: -74.07 },
    destination: { country: 'USA', city: 'Miami, FL', lat: 25.76, lng: -80.19 },
    status: 'In Transit',
    commodity: 'Fresh Cut Flowers',
    estimatedDeliveryDate: '2023-10-08',
    trackingUrl: 'https://track.example.com/SHP-FLW8473',
    cost: generateCost(),
    milestones: [
      { name: 'bookingConfirmed', status: 'Completed', date: '2023-10-01', documents: [] },
      { name: 'cargoReceivedOrigin', status: 'Completed', date: '2023-10-02', documents: [] },
      { name: 'departedFromOrigin', status: 'In Progress', date: null, documents: [], details: 'In transit to Miami' },
      { name: 'customsClearanceDest', status: 'Pending', date: null, documents: [] },
      { name: 'finalDelivery', status: 'Pending', date: null, documents: [] },
    ],
    documents: [],
    communication: [
        { id: 'msg1', sender: PARTIES_SET_1[0], text: 'Flowers are packed and ready for pickup.', timestamp: '2023-10-02T09:00:00Z' },
        { id: 'msg2', sender: PARTIES_SET_1[1], text: 'On my way to the farm. ETA 1 hour.', timestamp: '2023-10-02T09:05:00Z' },
    ],
    attachedParties: PARTIES_SET_1,
  },
  {
    id: 'SHP-FLW7777',
    mawb: '987-65432109',
    hawb: 'HPL-NBOFRA-002',
    customer: 'Global Flowers Corp',
    farmId: 'FARM-COL-001', // Example, not Kenya
    origin: { country: 'Kenya', city: 'Nairobi', lat: -1.29, lng: 36.82 },
    destination: { country: 'Germany', city: 'Frankfurt', lat: 50.11, lng: 8.68 },
    status: 'Requires Action',
    commodity: 'Roses',
    estimatedDeliveryDate: '2023-10-11',
    trackingUrl: 'https://track.example.com/SHP-FLW7777',
    cost: generateCost(),
    milestones: [
      { name: 'bookingConfirmed', status: 'Completed', date: '2023-10-04', documents: [] },
      { name: 'cargoReceivedOrigin', status: 'Completed', date: '2023-10-05', documents: [] },
      { name: 'departedFromOrigin', status: 'Completed', date: '2023-10-06', documents: [] },
      { name: 'customsClearanceDest', status: 'Requires Action', date: null, documents: [], details: 'Commercial Invoice does not match packing list. Please upload a revised version.' },
      { name: 'finalDelivery', status: 'Pending', date: null, documents: [] },
    ],
    documents: [
       { id: 'doc-sim-4', name: 'Commercial Invoice (Old).pdf', url: '#', uploadedAt: '2023-10-04' },
       { id: 'doc-sim-5', name: 'Packing List.pdf', url: '#', uploadedAt: '2023-10-04' },
    ],
    communication: [
        { id: 'msg10', sender: PARTIES_SET_4[2], text: 'Action required: Customs has flagged a mismatch between the invoice and packing list. The shipment is on hold.', timestamp: '2023-10-07T10:00:00Z' },
        { id: 'msg11', sender: PARTIES_SET_4[3], text: 'Understood, we are preparing the revised documents now.', timestamp: '2023-10-07T10:05:00Z' },
    ],
    attachedParties: PARTIES_SET_4,
  },
  {
    id: 'SHP-FLW1924',
    mawb: '246-81357902',
    hawb: 'HPL-UIOLAX-003',
    customer: 'The Flower Shop',
    farmId: 'FARM-ECU-001',
    origin: { country: 'Ecuador', city: 'Quito', lat: -0.18, lng: -78.46 },
    destination: { country: 'USA', city: 'Los Angeles, CA', lat: 34.05, lng: -118.24 },
    status: 'Pending',
    commodity: 'Gypsophila',
    estimatedDeliveryDate: '2023-10-10',
    trackingUrl: 'https://track.example.com/SHP-FLW1924',
    cost: generateCost(),
    milestones: [
      { name: 'bookingConfirmed', status: 'Completed', date: '2023-10-03', documents: [] },
      { name: 'cargoReceivedOrigin', status: 'Pending', date: null, documents: [] },
      { name: 'departedFromOrigin', status: 'Pending', date: null, documents: [] },
      { name: 'customsClearanceDest', status: 'Pending', date: null, documents: [] },
      { name: 'finalDelivery', status: 'Pending', date: null, documents: [] },
    ],
    documents: [
      { id: 'doc-sim-1', name: 'Commercial Invoice.pdf', url: '#', uploadedAt: '2023-10-03' },
    ],
    communication: [
      { id: 'msg3', sender: PARTIES_SET_2[3], text: 'Can we get an update on when the farmer will be ready?', timestamp: '2023-10-04T11:00:00Z' },
    ],
    attachedParties: PARTIES_SET_2,
  },
  {
    id: 'SHP-FLW3301',
    mawb: '111-22233344',
    hawb: 'HPL-AMS YYZ-004',
    customer: 'Floral Designs Inc.',
    farmId: 'FARM-CR-001', // Example
    origin: { country: 'Netherlands', city: 'Aalsmeer', lat: 52.26, lng: 4.76 },
    destination: { country: 'Canada', city: 'Toronto, ON', lat: 43.65, lng: -79.38 },
    status: 'Delivered',
    commodity: 'Tulips',
    estimatedDeliveryDate: '2023-09-29',
    trackingUrl: 'https://track.example.com/SHP-FLW3301',
    cost: generateCost(),
    milestones: MILESTONE_KEYS.map(name => ({
        name,
        status: 'Completed' as 'Completed',
        date: '2023-09-29',
        documents: []
    })),
    documents: [
        { id: 'doc1', name: 'Commercial Invoice.pdf', url: '#', uploadedAt: '2023-09-25' },
        { id: 'doc2', name: 'Phytosanitary Certificate.pdf', url: '#', uploadedAt: '2023-09-26' },
        { id: 'doc3', name: 'Proof of Delivery.pdf', url: '#', uploadedAt: '2023-09-29' },
    ],
    communication: [
        { id: 'msg4', sender: PARTIES_SET_3[1], text: 'Package is out for final delivery.', timestamp: '2023-09-29T08:30:00Z' },
        { id: 'msg5', sender: PARTIES_SET_3[3], text: 'Received! The flowers look amazing. Thank you!', timestamp: '2023-09-29T14:00:00Z' },
    ],
    attachedParties: PARTIES_SET_3,
  },
  {
    id: 'SHP-FLW5982',
    mawb: '333-55577799',
    hawb: 'HPL-MDENYC-005',
    customer: 'Bloom & Petal',
    farmId: 'FARM-COL-001',
    origin: { country: 'Colombia', city: 'Medellín', lat: 6.24, lng: -75.58 },
    destination: { country: 'USA', city: 'New York, NY', lat: 40.71, lng: -74.00 },
    status: 'Delayed',
    commodity: 'Carnations',
    estimatedDeliveryDate: '2023-10-12',
    trackingUrl: 'https://track.example.com/SHP-FLW5982',
    cost: generateCost(),
    milestones: [
      { name: 'bookingConfirmed', status: 'Completed', date: '2023-10-04', documents: [] },
      { name: 'cargoReceivedOrigin', status: 'Completed', date: '2023-10-05', documents: [] },
      { name: 'departedFromOrigin', status: 'Delayed', date: null, documents: [], details: 'Flight cancelled due to bad weather at origin airport.' },
      { name: 'customsClearanceDest', status: 'Pending', date: null, documents: [] },
      { name: 'finalDelivery', status: 'Pending', date: null, documents: [] },
    ],
    documents: [],
    communication: [
        { id: 'msg6', sender: PARTIES_SET_1[2], text: 'Flight has been cancelled due to severe weather. We are working to rebook on the next available flight. ETA is now pushed back 24 hours.', timestamp: '2023-10-06T17:00:00Z' },
        { id: 'msg7', sender: PARTIES_SET_1[3], text: 'Thanks for the update. Please keep me informed.', timestamp: '2023-10-06T17:05:00Z' },
    ],
    attachedParties: PARTIES_SET_1,
  },
  ...Array.from({ length: 20 }, (_, i) => {
    const customers = ['Global Flowers Corp', 'Petal Perfect', 'Fresh Blooms Co.', 'Sun Valley Floral'];
    const origins = [
      { country: 'Kenya', city: 'Nairobi', lat: -1.29, lng: 36.82 },
      { country: 'Ethiopia', city: 'Addis Ababa', lat: 9.03, lng: 38.74 },
      { country: 'Colombia', city: 'Bogotá', lat: 4.71, lng: -74.07 },
      { country: 'Ecuador', city: 'Quito', lat: -0.18, lng: -78.46 },
    ];
    const destinations = [
      { country: 'USA', city: 'Miami, FL', lat: 25.76, lng: -80.19 },
      { country: 'Germany', city: 'Frankfurt', lat: 50.11, lng: 8.68 },
      { country: 'USA', city: 'New York, NY', lat: 40.71, lng: -74.00 },
      { country: 'Canada', city: 'Vancouver, BC', lat: 49.28, lng: -123.12 }
    ];
    const partySets = [PARTIES_SET_1, PARTIES_SET_2, PARTIES_SET_3, PARTIES_SET_4, PARTIES_SET_5];
    const approvedFarms = INITIAL_FARMS.filter(f => f.status === 'Approved');
    
    const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const id = `SHP-GEN${(1000 + i).toString()}`;
    const statusRand = Math.random();
    let status: Shipment['status'];
    if (statusRand < 0.15) status = 'Pending';
    else if (statusRand < 0.55) status = 'In Transit';
    else if (statusRand < 0.80) status = 'Delivered';
    else if (statusRand < 0.90) status = 'Delayed';
    else status = 'Requires Action';
    
    const today = new Date();
    const orderDate = new Date(today);
    orderDate.setDate(today.getDate() - (10 + Math.floor(Math.random() * 20)));
    const estimatedDeliveryDate = addDays(orderDate, 7 + Math.floor(Math.random() * 5));

    let milestones: Milestone[] = MILESTONE_KEYS.map(name => ({ name, status: 'Pending', date: null, documents: [] }));
    milestones[0] = { ...milestones[0], status: 'Completed', date: orderDate.toISOString().split('T')[0] };

    if (status !== 'Pending') {
      milestones[1].status = 'Completed';
      milestones[1].date = addDays(orderDate, 1).toISOString().split('T')[0];
    }
    if (status === 'In Transit' || status === 'Delayed' || status === 'Requires Action' || status === 'Delivered') {
      milestones[2].status = 'Completed';
      milestones[2].date = addDays(orderDate, 2).toISOString().split('T')[0];
    }
     if (status === 'Delayed') {
       milestones[2].status = 'Delayed';
       milestones[2].date = null;
       milestones[2].details = 'Random customs inspection.';
     }
    if (status === 'Delivered') {
      milestones = MILESTONE_KEYS.map((name, idx) => ({ name, status: 'Completed', date: addDays(orderDate, idx + 1).toISOString().split('T')[0], documents: [] }));
    }

    return {
      id,
      mawb: `${Math.floor(Math.random()*900)+100}-${Math.floor(Math.random()*90000000)+10000000}`,
      hawb: `HPL-GEN${1000+i}`,
      customer: randomItem(customers),
      farmId: randomItem(approvedFarms).id,
      origin: randomItem(origins),
      destination: randomItem(destinations),
      status,
      commodity: 'Mixed Flowers',
      estimatedDeliveryDate: estimatedDeliveryDate.toISOString().split('T')[0],
      trackingUrl: `https://track.example.com/${id}`,
      cost: generateCost(),
      milestones,
      documents: [],
      communication: [],
      attachedParties: randomItem(partySets),
    } as Shipment;
  })
];

export const COUNTRIES = [
    { code: 'CO', name: 'Colombia' },
    { code: 'EC', name: 'Ecuador' },
    { code: 'CR', name: 'Costa Rica' },
    { code: 'HN', name: 'Honduras' },
    { code: 'US', name: 'USA' },
    { code: 'CA', name: 'Canada' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'KE', name: 'Kenya' },
    { code: 'ET', name: 'Ethiopia' },
    { code: 'GB', name: 'UK' },
    { code: 'DE', name: 'Germany' },
    { code: 'JP', name: 'Japan' },
    { code: 'AU', name: 'Australia' },
];

export const FARM_DOCS_BY_COUNTRY: Record<string, { [docName: string]: { required: boolean } }> = {
    'Colombia': {
        'RUT COMPLETO': { required: true },
        'CAMARA DE COMERCIO': { required: true },
        'CEDULA REPRESENTANTE LEGAL': { required: true },
        'ESTADOS FINANCIEROS': { required: true },
        'CERTIFICACION BANCARIA': { required: true },
        'CERTIFICACION OEA / BASC': { required: false },
    },
    'Ecuador': {
        'RUC COMPLETO': { required: true },
        'Codigo Postal': { required: true },
    },
    'Costa Rica': {
        'Cedula Juridica': { required: true },
        'Numero de Telefono': { required: true },
        'Direccion': { required: true },
    },
    'Honduras': {
        'Numero de Telefono': { required: true },
        'Correo electronico': { required: true },
        'Nombre contacto': { required: true },
    },
    'default': {
        'Business Registration': { required: true },
        'Tax ID': { required: true },
    }
};