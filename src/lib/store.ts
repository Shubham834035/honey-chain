// =====================================================================================
// HONEY CHAIN — Central Data Store & Demonstration State Repository
// Smart India Hackathon 2026 (SIH26021) — Team RUDRASCRIPT
// =====================================================================================

import {
  UserProfile,
  Farm,
  Hive,
  HiveInspection,
  Harvest,
  HoneyBatch,
  QualityTest,
  ProcessingEvent,
  PackagingRecord,
  TraceabilityEvent,
  BlockchainRecord,
  SensorReading,
  Alert,
  UserRole,
} from '@/types';
import { computeBatchCanonicalHash, computeQualityReportHash, computeProcessingHash, computeSha256 } from './crypto';

export interface HoneyChainState {
  currentUser: UserProfile;
  users: UserProfile[];
  farms: Farm[];
  hives: Hive[];
  inspections: HiveInspection[];
  harvests: Harvest[];
  batches: HoneyBatch[];
  qualityTests: QualityTest[];
  processingEvents: ProcessingEvent[];
  packagingRecords: PackagingRecord[];
  traceabilityEvents: TraceabilityEvent[];
  blockchainRecords: BlockchainRecord[];
  sensorReadings: SensorReading[];
  alerts: Alert[];
}

// Fictional realistic demonstration profiles
export const DEMO_USERS: UserProfile[] = [
  {
    id: 'demo-beekeeper-1',
    fullName: 'Rajesh Sharma',
    email: 'rajesh.sharma@himalayanapiaries.in',
    phone: '+91 98160 44211',
    role: 'beekeeper',
    organizationName: 'Himalayan Pure Apiaries',
    licenseNumber: 'BK-HP-2023-0891',
    walletAddress: '0x3D72B8B9A098f98E4B0f6E92b1a82E82E372f88C',
    isVerified: true,
  },
  {
    id: 'demo-beekeeper-2',
    fullName: 'Anita Roy',
    email: 'anita.roy@sundarbansorganic.org',
    phone: '+91 94331 88920',
    role: 'beekeeper',
    organizationName: 'Sundarbans Delta Beekeepers Cooperative',
    licenseNumber: 'BK-WB-2022-0412',
    walletAddress: '0x81B2B3Ff45812e9b049281a82e987f82b7C31d6A',
    isVerified: true,
  },
  {
    id: 'demo-lab-1',
    fullName: 'Dr. Sunita Verma',
    email: 'sunita.verma@nhrtl.gov.in',
    phone: '+91 20 2569 8812',
    role: 'laboratory',
    organizationName: 'National Honey Testing & Quality Certification Laboratory (NABL / FSSAI Accredited)',
    licenseNumber: 'LAB-NABL-FSSAI-0092',
    walletAddress: '0x99A82B81F28B0291e7A91283921B89887e2A8321',
    isVerified: true,
  },
  {
    id: 'demo-processor-1',
    fullName: 'Vikram Patel',
    email: 'vikram.patel@apexagrofoods.com',
    phone: '+91 79 2654 9901',
    role: 'processor',
    organizationName: 'Apex Cold-Extracted Processing & Packaging Ltd.',
    licenseNumber: 'PROC-FSSAI-2024-551',
    walletAddress: '0x71289Acb41829fba71892081a98B82F109a82312',
    isVerified: true,
  },
  {
    id: 'demo-admin-1',
    fullName: 'Devendra Rao',
    email: 'devendra.rao@honeychain.gov.in',
    phone: '+91 11 2338 4400',
    role: 'admin',
    organizationName: 'National Honey Board & Traceability Authority',
    licenseNumber: 'ADM-SIH-2026-001',
    walletAddress: '0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B',
    isVerified: true,
  },
];

export const DEMO_FARMS: Farm[] = [
  {
    id: 'farm-hp-1',
    beekeeperId: 'demo-beekeeper-1',
    name: 'Parvati Valley Wild Flora Apiary',
    state: 'Himachal Pradesh',
    district: 'Kullu',
    generalLocation: 'Kullu Valley (Elevation ~1,850m)',
    elevationMeters: 1850,
    dominantFlora: ['Wild Himalayan Mustard', 'Wild White Clover', 'Plectranthus'],
    establishedDate: '2019-04-12',
  },
  {
    id: 'farm-wb-1',
    beekeeperId: 'demo-beekeeper-2',
    name: 'Sundarbans Biosphere Mangrove Apiary',
    state: 'West Bengal',
    district: 'South 24 Parganas',
    generalLocation: 'Canning Coastal Reserve',
    elevationMeters: 6,
    dominantFlora: ['Sundari (Heritiera fomes)', 'Khalsi (Aegiceras corniculatum)', 'Gewa'],
    establishedDate: '2021-02-18',
  },
];

export const DEMO_HIVES: Hive[] = [
  {
    id: 'hive-hp-001',
    hiveId: 'HIV-HP-001',
    farmId: 'farm-hp-1',
    farmName: 'Parvati Valley Wild Flora Apiary',
    hiveType: 'Langstroth Standard',
    species: 'Apis cerana indica',
    queenYear: 2024,
    status: 'healthy',
    installationDate: '2023-03-15',
    notes: 'Strong, productive native Indian honey bee colony. Good resistance to Varroa.',
    sensorDeviceId: 'IOT-HIVE-HP01',
    currentWeightKg: 42.6,
    currentTempC: 34.8,
    currentHumidity: 58,
  },
  {
    id: 'hive-hp-002',
    hiveId: 'HIV-HP-002',
    farmId: 'farm-hp-1',
    farmName: 'Parvati Valley Wild Flora Apiary',
    hiveType: 'Langstroth Standard',
    species: 'Apis cerana indica',
    queenYear: 2025,
    status: 'active',
    installationDate: '2024-05-10',
    notes: 'Young colony installed spring 2024. Foraging actively on wild clover.',
    sensorDeviceId: 'IOT-HIVE-HP02',
    currentWeightKg: 38.2,
    currentTempC: 35.1,
    currentHumidity: 61,
  },
  {
    id: 'hive-wb-101',
    hiveId: 'HIV-WB-101',
    farmId: 'farm-wb-1',
    farmName: 'Sundarbans Biosphere Mangrove Apiary',
    hiveType: 'Langstroth Standard',
    species: 'Apis mellifera',
    queenYear: 2024,
    status: 'healthy',
    installationDate: '2022-11-20',
    notes: 'Produces dark aromatic mangrove nectar with natural mineral richness.',
    sensorDeviceId: 'IOT-HIVE-WB01',
    currentWeightKg: 46.1,
    currentTempC: 35.6,
    currentHumidity: 74,
  },
  {
    id: 'hive-wb-102',
    hiveId: 'HIV-WB-102',
    farmId: 'farm-wb-1',
    farmName: 'Sundarbans Biosphere Mangrove Apiary',
    hiveType: 'Langstroth Standard',
    species: 'Apis mellifera',
    queenYear: 2023,
    status: 'attention_required',
    installationDate: '2022-11-20',
    notes: 'High humidity detected. Weight drop observed over last 48 hours.',
    sensorDeviceId: 'IOT-HIVE-WB02',
    currentWeightKg: 33.4,
    currentTempC: 37.8,
    currentHumidity: 88,
  },
];

export const DEMO_HARVESTS: Harvest[] = [
  {
    id: 'hrv-001',
    harvestId: 'HRV-2026-001',
    hiveId: 'hive-hp-001',
    hiveCode: 'HIV-HP-001',
    farmName: 'Parvati Valley Wild Flora Apiary',
    beekeeperId: 'demo-beekeeper-1',
    beekeeperName: 'Rajesh Sharma',
    harvestDate: '2026-04-10',
    quantityKg: 48.5,
    floraSource: 'Himalayan Wild Mustard & Plectranthus',
    harvestMethod: 'Manual Uncapping & Cold Centrifugal Extraction',
    moistureFieldReading: 17.5,
    notes: 'Fully sealed honeycombs (>90% sealed). Golden amber color, floral aroma.',
    isBatched: true,
    batchId: 'HC-2026-H04-B001',
  },
  {
    id: 'hrv-002',
    harvestId: 'HRV-2026-002',
    hiveId: 'hive-hp-002',
    hiveCode: 'HIV-HP-002',
    farmName: 'Parvati Valley Wild Flora Apiary',
    beekeeperId: 'demo-beekeeper-1',
    beekeeperName: 'Rajesh Sharma',
    harvestDate: '2026-04-18',
    quantityKg: 35.0,
    floraSource: 'Wild Himalayan White Clover',
    harvestMethod: 'Centrifugal Extraction',
    moistureFieldReading: 18.2,
    notes: 'Light golden honey with delicate aroma. Awaiting certified laboratory assay.',
    isBatched: true,
    batchId: 'HC-2026-H09-B002',
  },
  {
    id: 'hrv-003',
    harvestId: 'HRV-2026-003',
    hiveId: 'hive-wb-101',
    hiveCode: 'HIV-WB-101',
    farmName: 'Sundarbans Biosphere Mangrove Apiary',
    beekeeperId: 'demo-beekeeper-2',
    beekeeperName: 'Anita Roy',
    harvestDate: '2026-03-24',
    quantityKg: 62.0,
    floraSource: 'Sundarbans Khalsi & Mangrove Blossom',
    harvestMethod: 'Cold Extraction',
    moistureFieldReading: 18.8,
    notes: 'Distinctive dark amber mangrove blossom honey. Fully verified and packaged.',
    isBatched: true,
    batchId: 'HC-2026-H02-B003',
  },
  {
    id: 'hrv-004',
    harvestId: 'HRV-2026-004',
    hiveId: 'hive-wb-102',
    hiveCode: 'HIV-WB-102',
    farmName: 'Sundarbans Biosphere Mangrove Apiary',
    beekeeperId: 'demo-beekeeper-2',
    beekeeperName: 'Anita Roy',
    harvestDate: '2026-04-02',
    quantityKg: 28.0,
    floraSource: 'Late Season Sundarbans Multifloral',
    harvestMethod: 'Centrifugal Extraction',
    moistureFieldReading: 22.8,
    notes: 'High ambient humidity during harvest caused elevated moisture. Flagged by lab.',
    isBatched: true,
    batchId: 'HC-2026-H11-B004',
  },
];

export const DEMO_BATCHES: HoneyBatch[] = [
  {
    id: 'batch-001',
    batchId: 'HC-2026-H04-B001',
    harvestId: 'hrv-001',
    beekeeperId: 'demo-beekeeper-1',
    beekeeperName: 'Rajesh Sharma',
    farmName: 'Parvati Valley Wild Flora Apiary',
    locationSummary: 'Kullu, Himachal Pradesh',
    variety: 'Himalayan Wild Mustard & Plectranthus',
    initialQuantityKg: 48.5,
    remainingQuantityKg: 48.5,
    status: 'QualityVerified',
    canonicalHash: '0x7e8c3b1a9f5d4e2a6b8c0e1f3a5b7c9d2e4f6a8b0c2d4e6f8a1b3c5d7e9f1a3b',
    onChainTxHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    blockNumber: 18459210,
    qrCodeUrl: '/verify?id=HC-2026-H04-B001',
    createdAt: '2026-04-10T11:30:00Z',
    updatedAt: '2026-04-14T16:45:00Z',
  },
  {
    id: 'batch-002',
    batchId: 'HC-2026-H09-B002',
    harvestId: 'hrv-002',
    beekeeperId: 'demo-beekeeper-1',
    beekeeperName: 'Rajesh Sharma',
    farmName: 'Parvati Valley Wild Flora Apiary',
    locationSummary: 'Kullu, Himachal Pradesh',
    variety: 'Wild Himalayan White Clover',
    initialQuantityKg: 35.0,
    remainingQuantityKg: 35.0,
    status: 'QualityTestingPending',
    canonicalHash: '0x3f5a7c9b1d2e4f6a8b0c2d4e6f8a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d2e4f6a',
    onChainTxHash: '0x4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c',
    blockNumber: 18459228,
    qrCodeUrl: '/verify?id=HC-2026-H09-B002',
    createdAt: '2026-04-18T09:15:00Z',
    updatedAt: '2026-04-18T10:00:00Z',
  },
  {
    id: 'batch-003',
    batchId: 'HC-2026-H02-B003',
    harvestId: 'hrv-003',
    beekeeperId: 'demo-beekeeper-2',
    beekeeperName: 'Anita Roy',
    farmName: 'Sundarbans Biosphere Mangrove Apiary',
    locationSummary: 'South 24 Parganas, West Bengal',
    variety: 'Sundarbans Khalsi & Mangrove Blossom',
    initialQuantityKg: 62.0,
    remainingQuantityKg: 0.0, // Fully packaged into 124 units of 500g
    status: 'ReadyForDistribution',
    canonicalHash: '0x1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
    onChainTxHash: '0x2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e',
    blockNumber: 18459190,
    qrCodeUrl: '/verify?id=HC-2026-H02-B003',
    createdAt: '2026-03-24T14:20:00Z',
    updatedAt: '2026-04-05T17:10:00Z',
  },
  {
    id: 'batch-004',
    batchId: 'HC-2026-H11-B004',
    harvestId: 'hrv-004',
    beekeeperId: 'demo-beekeeper-2',
    beekeeperName: 'Anita Roy',
    farmName: 'Sundarbans Biosphere Mangrove Apiary',
    locationSummary: 'South 24 Parganas, West Bengal',
    variety: 'Late Season Sundarbans Multifloral',
    initialQuantityKg: 28.0,
    remainingQuantityKg: 28.0,
    status: 'RecalledOrFlagged',
    canonicalHash: '0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c',
    onChainTxHash: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
    blockNumber: 18459205,
    qrCodeUrl: '/verify?id=HC-2026-H11-B004',
    createdAt: '2026-04-02T11:00:00Z',
    updatedAt: '2026-04-08T15:30:00Z',
    flagReason: 'FAILED QUALITY THRESHOLD: Moisture measured at 23.4% exceeds FSSAI legal ceiling of 20.0%. Fermentation hazard.',
  },
];

export const DEMO_QUALITY_TESTS: QualityTest[] = [
  {
    id: 'test-001',
    batchId: 'batch-001',
    laboratoryId: 'demo-lab-1',
    labName: 'National Honey Testing & Quality Certification Laboratory (NABL / FSSAI)',
    testReportId: 'NHTL-PUN-2026-7842',
    testDate: '2026-04-14',
    moisturePercentage: 17.8, // Limit: <= 20%
    hmfMgPerKg: 14.2, // Limit: <= 40 mg/kg for fresh raw honey
    reducingSugarsPercentage: 74.6, // Limit: >= 65%
    sucrosePercentage: 1.8, // Limit: <= 5%
    pollenCountDominant: 'Brassica campestris (Wild Mustard) 68%, Plectranthus 22%',
    c4SugarAdulterationDetected: false,
    antibioticResidueDetected: false,
    passedRegulatoryStandard: true,
    certifyingOfficerName: 'Dr. Sunita Verma, Senior Food Analyst',
    labReportHash: '0x5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e',
    labNotes: 'Excellent quality raw honey. Low HMF indicates unheated fresh condition. Negative for inverted syrups & C4 plant sugars.',
    createdAt: '2026-04-14T16:30:00Z',
  },
  {
    id: 'test-004',
    batchId: 'batch-004',
    laboratoryId: 'demo-lab-1',
    labName: 'National Honey Testing & Quality Certification Laboratory (NABL / FSSAI)',
    testReportId: 'NHTL-PUN-2026-7811',
    testDate: '2026-04-08',
    moisturePercentage: 23.4, // FAIL: Exceeds 20% ceiling
    hmfMgPerKg: 18.5,
    reducingSugarsPercentage: 66.2,
    sucrosePercentage: 3.1,
    pollenCountDominant: 'Aegiceras corniculatum 54%, Heritiera fomes 32%',
    c4SugarAdulterationDetected: false,
    antibioticResidueDetected: false,
    passedRegulatoryStandard: false, // FAILED
    certifyingOfficerName: 'Dr. Sunita Verma, Senior Food Analyst',
    labReportHash: '0x4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f',
    labNotes: 'CRITICAL ANOMALY: Moisture content of 23.4% exceeds statutory FSSAI ceiling of 20%. High yeast count and spontaneous fermentation risk. Batch rejected for direct consumer bottling.',
    createdAt: '2026-04-08T15:20:00Z',
  },
];

export const DEMO_PROCESSING_EVENTS: ProcessingEvent[] = [
  {
    id: 'proc-001',
    batchId: 'batch-003',
    processorId: 'demo-processor-1',
    processorName: 'Apex Cold-Extracted Processing & Packaging Ltd.',
    processType: 'cold_settling',
    inputQuantityKg: 62.0,
    outputQuantityKg: 62.0,
    maxTemperatureCelsius: 38.0, // Retains raw enzymes
    filterMeshSize: '80 Mesh Stainless Steel Screen',
    processDate: '2026-04-03',
    facilityLocation: 'Ahmedabad Processing Park, Gujarat',
    parametersHash: '0x3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c',
    notes: 'Gentle coarse straining to remove comb beeswax fragments without removing beneficial bee pollen granules.',
  },
];

export const DEMO_PACKAGING_RECORDS: PackagingRecord[] = [
  {
    id: 'pack-001',
    batchId: 'batch-003',
    packagerId: 'demo-processor-1',
    packagerName: 'Apex Cold-Extracted Processing & Packaging Ltd.',
    packagingLotNumber: 'LOT-2026-APX-091',
    packageType: 'Food-Grade Glass Jar',
    unitSizeGrams: 500,
    totalUnitsPackaged: 124,
    packagingDate: '2026-04-05',
    bestBeforeDate: '2028-04-05',
    tamperEvidentSealId: 'SEAL-APX-984210',
  },
];

export const DEMO_TRACEABILITY_EVENTS: TraceabilityEvent[] = [
  // Events for batch 001 (QualityVerified)
  {
    id: 'evt-001-1',
    batchId: 'batch-001',
    eventType: 'BATCH_HARVESTED',
    eventTitle: 'Harvest Extraction Recorded',
    eventDescription: 'Extracted 48.5 kg raw honey from hive HIV-HP-001. Dominant flora: Wild Himalayan Mustard.',
    actorName: 'Rajesh Sharma',
    actorRole: 'beekeeper',
    eventHash: '0x7e8c3b1a9f5d4e2a6b8c0e1f3a5b7c9d2e4f6a8b0c2d4e6f8a1b3c5d7e9f1a3b',
    onChainTxHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    blockNumber: 18459210,
    locationSummary: 'Kullu, Himachal Pradesh',
    timestamp: '2026-04-10T11:30:00Z',
  },
  {
    id: 'evt-001-2',
    batchId: 'batch-001',
    eventType: 'LAB_SAMPLE_RECEIVED',
    eventTitle: 'Laboratory Sample Ingested',
    eventDescription: 'Sample of 250g logged into National Honey Quality Testing Laboratory for complete purity analysis.',
    actorName: 'Dr. Sunita Verma',
    actorRole: 'laboratory',
    eventHash: '0x6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e',
    onChainTxHash: '0x8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e',
    blockNumber: 18459218,
    locationSummary: 'Pune, Maharashtra',
    timestamp: '2026-04-12T10:15:00Z',
  },
  {
    id: 'evt-001-3',
    batchId: 'batch-001',
    eventType: 'LAB_TEST_PASSED',
    eventTitle: 'Laboratory Quality Verified (NABL/FSSAI)',
    eventDescription: 'Comprehensive test passed. Moisture 17.8% (<=20%), HMF 14.2 mg/kg (fresh raw), C4 sugar adulteration negative.',
    actorName: 'Dr. Sunita Verma',
    actorRole: 'laboratory',
    eventHash: '0x5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e',
    onChainTxHash: '0x7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d',
    blockNumber: 18459224,
    locationSummary: 'Pune, Maharashtra',
    timestamp: '2026-04-14T16:45:00Z',
  },

  // Events for batch 002 (QualityTestingPending)
  {
    id: 'evt-002-1',
    batchId: 'batch-002',
    eventType: 'BATCH_HARVESTED',
    eventTitle: 'Harvest Extraction Recorded',
    eventDescription: 'Extracted 35.0 kg raw clover honey from hive HIV-HP-002.',
    actorName: 'Rajesh Sharma',
    actorRole: 'beekeeper',
    eventHash: '0x3f5a7c9b1d2e4f6a8b0c2d4e6f8a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d2e4f6a',
    onChainTxHash: '0x4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c',
    blockNumber: 18459228,
    locationSummary: 'Kullu, Himachal Pradesh',
    timestamp: '2026-04-18T09:15:00Z',
  },

  // Events for batch 003 (Packaged / ReadyForDistribution)
  {
    id: 'evt-003-1',
    batchId: 'batch-003',
    eventType: 'BATCH_HARVESTED',
    eventTitle: 'Harvest Extraction Recorded',
    eventDescription: 'Extracted 62.0 kg raw mangrove blossom honey from hive HIV-WB-101.',
    actorName: 'Anita Roy',
    actorRole: 'beekeeper',
    eventHash: '0x1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
    onChainTxHash: '0x2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e',
    blockNumber: 18459190,
    locationSummary: 'South 24 Parganas, West Bengal',
    timestamp: '2026-03-24T14:20:00Z',
  },
  {
    id: 'evt-003-2',
    batchId: 'batch-003',
    eventType: 'LAB_TEST_PASSED',
    eventTitle: 'Laboratory Quality Certified',
    eventDescription: 'Full standard compliance confirmed. Moisture 18.2%, Zero synthetic syrups detected.',
    actorName: 'Dr. Sunita Verma',
    actorRole: 'laboratory',
    eventHash: '0x2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b',
    onChainTxHash: '0x3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c',
    blockNumber: 18459195,
    locationSummary: 'Pune, Maharashtra',
    timestamp: '2026-03-29T11:00:00Z',
  },
  {
    id: 'evt-003-3',
    batchId: 'batch-003',
    eventType: 'PROCESSING_COMPLETED',
    eventTitle: 'Cold Settling & Straining Completed',
    eventDescription: 'Microfiltration through 80 mesh stainless screen under strictly controlled temperature (38°C max).',
    actorName: 'Vikram Patel',
    actorRole: 'processor',
    eventHash: '0x3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c',
    onChainTxHash: '0x4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d',
    blockNumber: 18459199,
    locationSummary: 'Ahmedabad, Gujarat',
    timestamp: '2026-04-03T15:30:00Z',
  },
  {
    id: 'evt-003-4',
    batchId: 'batch-003',
    eventType: 'PACKAGED',
    eventTitle: 'Hermetically Sealed & QR Affixed',
    eventDescription: 'Bottled into 124 food-grade glass jars (500g each). Lot LOT-2026-APX-091 with tamper-evident seal SEAL-APX-984210.',
    actorName: 'Vikram Patel',
    actorRole: 'processor',
    eventHash: '0x5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e',
    onChainTxHash: '0x6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f',
    blockNumber: 18459203,
    locationSummary: 'Ahmedabad, Gujarat',
    timestamp: '2026-04-05T17:10:00Z',
  },

  // Events for batch 004 (Flagged)
  {
    id: 'evt-004-1',
    batchId: 'batch-004',
    eventType: 'BATCH_HARVESTED',
    eventTitle: 'Harvest Extraction Recorded',
    eventDescription: 'Extracted 28.0 kg raw multifloral honey from hive HIV-WB-102.',
    actorName: 'Anita Roy',
    actorRole: 'beekeeper',
    eventHash: '0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c',
    onChainTxHash: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
    blockNumber: 18459205,
    locationSummary: 'South 24 Parganas, West Bengal',
    timestamp: '2026-04-02T11:00:00Z',
  },
  {
    id: 'evt-004-2',
    batchId: 'batch-004',
    eventType: 'BATCH_FLAGGED_OR_RECALLED',
    eventTitle: 'Batch Flagged: High Moisture Anomaly',
    eventDescription: 'Laboratory test recorded moisture of 23.4% exceeding the maximum legal threshold of 20.0%. Batch flagged to protect consumer safety.',
    actorName: 'Dr. Sunita Verma',
    actorRole: 'laboratory',
    eventHash: '0x4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f',
    onChainTxHash: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e',
    blockNumber: 18459214,
    locationSummary: 'Pune, Maharashtra',
    timestamp: '2026-04-08T15:30:00Z',
  },
];

export const DEMO_SENSOR_READINGS: SensorReading[] = [
  // 24-hour hourly readings for hive HIV-HP-001 (Healthy)
  {
    id: 'sr-01',
    deviceId: 'IOT-HIVE-HP01',
    hiveId: 'hive-hp-001',
    hiveCode: 'HIV-HP-001',
    temperatureCelsius: 34.6,
    humidityPercentage: 58,
    weightKg: 42.6,
    acousticFrequencyHz: 185.0, // Healthy colony hum (normal: 150-250 Hz)
    batteryPercentage: 94,
    isSimulated: true,
    recordedAt: '2026-04-24T18:00:00Z',
  },
  {
    id: 'sr-02',
    deviceId: 'IOT-HIVE-HP01',
    hiveId: 'hive-hp-001',
    hiveCode: 'HIV-HP-001',
    temperatureCelsius: 34.9,
    humidityPercentage: 57,
    weightKg: 42.7,
    acousticFrequencyHz: 190.0,
    batteryPercentage: 94,
    isSimulated: true,
    recordedAt: '2026-04-24T19:00:00Z',
  },
  {
    id: 'sr-03',
    deviceId: 'IOT-HIVE-HP01',
    hiveId: 'hive-hp-001',
    hiveCode: 'HIV-HP-001',
    temperatureCelsius: 35.1,
    humidityPercentage: 56,
    weightKg: 42.8,
    acousticFrequencyHz: 192.0,
    batteryPercentage: 93,
    isSimulated: true,
    recordedAt: '2026-04-24T20:00:00Z',
  },
  {
    id: 'sr-04',
    deviceId: 'IOT-HIVE-HP01',
    hiveId: 'hive-hp-001',
    hiveCode: 'HIV-HP-001',
    temperatureCelsius: 34.8,
    humidityPercentage: 59,
    weightKg: 42.6,
    acousticFrequencyHz: 184.0,
    batteryPercentage: 93,
    isSimulated: true,
    recordedAt: '2026-04-24T21:00:00Z',
  },
  // Readings for hive HIV-WB-102 (Attention Required - high moisture & temp spike)
  {
    id: 'sr-11',
    deviceId: 'IOT-HIVE-WB02',
    hiveId: 'hive-wb-102',
    hiveCode: 'HIV-WB-102',
    temperatureCelsius: 37.8,
    humidityPercentage: 88,
    weightKg: 33.4,
    acousticFrequencyHz: 460.0, // High acoustic frequency >450 Hz indicates swarming preparation
    batteryPercentage: 88,
    isSimulated: true,
    recordedAt: '2026-04-24T21:00:00Z',
  },
];

export const DEMO_ALERTS: Alert[] = [
  {
    id: 'alt-001',
    hiveId: 'hive-wb-102',
    hiveCode: 'HIV-WB-102',
    severity: 'critical',
    alertType: 'swarm_risk',
    title: 'Acoustic Swarm Anomaly Detected',
    message: 'High frequency colony acoustic buzz (>460 Hz) along with internal temperature rise (37.8°C) indicates potential queen swarming preparation.',
    isResolved: false,
    createdAt: '2026-04-24T19:30:00Z',
  },
  {
    id: 'alt-002',
    batchId: 'HC-2026-H11-B004',
    severity: 'warning',
    alertType: 'lab_failed',
    title: 'Batch Recalled: Moisture Standard Breach',
    message: 'Laboratory assay registered 23.4% moisture (legal ceiling 20.0%). Distribution has been locked.',
    isResolved: false,
    createdAt: '2026-04-08T15:30:00Z',
  },
];

const LOCAL_STORAGE_KEY = 'honeychain_state_v1';

class StoreManager {
  private state: HoneyChainState;

  constructor() {
    this.state = this.getInitialState();
  }

  private getInitialState(): HoneyChainState {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (err) {
        console.warn('Could not read from localStorage, using in-memory state');
      }
    }

    return {
      currentUser: DEMO_USERS[0], // Defaults to Beekeeper (Rajesh Sharma)
      users: [...DEMO_USERS],
      farms: [...DEMO_FARMS],
      hives: [...DEMO_HIVES],
      inspections: [],
      harvests: [...DEMO_HARVESTS],
      batches: [...DEMO_BATCHES],
      qualityTests: [...DEMO_QUALITY_TESTS],
      processingEvents: [...DEMO_PROCESSING_EVENTS],
      packagingRecords: [...DEMO_PACKAGING_RECORDS],
      traceabilityEvents: [...DEMO_TRACEABILITY_EVENTS],
      blockchainRecords: [],
      sensorReadings: [...DEMO_SENSOR_READINGS],
      alerts: [...DEMO_ALERTS],
    };
  }

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.state));
      } catch (err) {
        console.warn('Failed to persist to localStorage');
      }
    }
  }

  getState(): HoneyChainState {
    return this.state;
  }

  resetToDefault() {
    this.state = {
      currentUser: DEMO_USERS[0],
      users: [...DEMO_USERS],
      farms: [...DEMO_FARMS],
      hives: [...DEMO_HIVES],
      inspections: [],
      harvests: [...DEMO_HARVESTS],
      batches: [...DEMO_BATCHES],
      qualityTests: [...DEMO_QUALITY_TESTS],
      processingEvents: [...DEMO_PROCESSING_EVENTS],
      packagingRecords: [...DEMO_PACKAGING_RECORDS],
      traceabilityEvents: [...DEMO_TRACEABILITY_EVENTS],
      blockchainRecords: [],
      sensorReadings: [...DEMO_SENSOR_READINGS],
      alerts: [...DEMO_ALERTS],
    };
    this.persist();
  }

  setCurrentUser(user: UserProfile) {
    this.state.currentUser = user;
    this.persist();
  }

  switchRole(role: UserRole) {
    const matchingUser = this.state.users.find((u) => u.role === role);
    if (matchingUser) {
      this.state.currentUser = matchingUser;
      this.persist();
    }
  }

  // --- HIVE MANAGEMENT ---
  addHive(hiveData: Omit<Hive, 'id'>): Hive {
    const id = `hive-${Date.now()}`;
    const newHive: Hive = {
      id,
      ...hiveData,
    };
    this.state.hives.unshift(newHive);
    this.persist();
    return newHive;
  }

  // --- HARVEST MANAGEMENT ---
  addHarvest(harvestData: Omit<Harvest, 'id' | 'harvestId' | 'isBatched'>): Harvest {
    const id = `hrv-${Date.now()}`;
    const harvestCount = this.state.harvests.length + 1;
    const harvestId = `HRV-2026-${String(harvestCount).padStart(3, '0')}`;

    const newHarvest: Harvest = {
      id,
      harvestId,
      ...harvestData,
      isBatched: false,
    };
    this.state.harvests.unshift(newHarvest);
    this.persist();
    return newHarvest;
  }

  // --- BATCH MANAGEMENT ---
  async createBatchFromHarvest(
    harvestId: string,
    variety: string,
    quantityKg: number
  ): Promise<HoneyBatch> {
    const harvest = this.state.harvests.find((h) => h.id === harvestId);
    if (!harvest) throw new Error('Harvest not found');

    const batchIndex = this.state.batches.length + 1;
    const batchId = `HC-2026-H${String(harvestIndexFromCode(harvest.harvestId)).padStart(2, '0')}-B${String(batchIndex).padStart(3, '0')}`;
    const farm = this.state.farms.find((f) => f.name === harvest.farmName) || this.state.farms[0];
    const locationSummary = `${farm.district}, ${farm.state}`;

    // Compute canonical SHA-256 hash
    const canonicalHash = await computeBatchCanonicalHash({
      batchId,
      harvestId: harvest.harvestId,
      beekeeperId: harvest.beekeeperId,
      variety,
      initialQuantityKg: quantityKg,
      harvestDate: harvest.harvestDate,
      locationSummary,
    });

    const blockNumber = 18459240 + batchIndex;
    const txHash = await computeSha256(`${batchId}-${canonicalHash}-${Date.now()}`);

    const id = `batch-${Date.now()}`;
    const newBatch: HoneyBatch = {
      id,
      batchId,
      harvestId: harvest.id,
      beekeeperId: harvest.beekeeperId,
      beekeeperName: harvest.beekeeperName,
      farmName: harvest.farmName,
      locationSummary,
      variety,
      initialQuantityKg: quantityKg,
      remainingQuantityKg: quantityKg,
      status: 'Harvested',
      canonicalHash,
      onChainTxHash: txHash,
      blockNumber,
      qrCodeUrl: `/verify?id=${batchId}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    harvest.isBatched = true;
    harvest.batchId = batchId;

    this.state.batches.unshift(newBatch);

    // Record initial Traceability Event
    const eventId = `evt-${Date.now()}`;
    const eventHash = await computeSha256(`${eventId}-${batchId}-${canonicalHash}`);
    this.state.traceabilityEvents.unshift({
      id: eventId,
      batchId: newBatch.id,
      eventType: 'BATCH_HARVESTED',
      eventTitle: 'Batch Registered & Harvest Associated',
      eventDescription: `Initialized Honey Batch ${batchId} for ${quantityKg.toFixed(1)} kg of ${variety}. Immutable canonical hash generated and recorded.`,
      actorName: harvest.beekeeperName,
      actorRole: 'beekeeper',
      eventHash,
      onChainTxHash: txHash,
      blockNumber,
      locationSummary,
      timestamp: new Date().toISOString(),
    });

    this.persist();
    return newBatch;
  }

  // --- QUALITY TEST (LABORATORY) ---
  async submitQualityTest(
    batchIdOrKey: string,
    testData: {
      laboratoryId: string;
      labName: string;
      testReportId: string;
      testDate: string;
      moisturePercentage: number;
      hmfMgPerKg: number;
      reducingSugarsPercentage: number;
      sucrosePercentage: number;
      pollenCountDominant: string;
      c4SugarAdulterationDetected: boolean;
      antibioticResidueDetected: boolean;
      passedRegulatoryStandard: boolean;
      certifyingOfficerName: string;
      labNotes?: string;
    }
  ): Promise<QualityTest> {
    const batch = this.state.batches.find((b) => b.id === batchIdOrKey || b.batchId === batchIdOrKey);
    if (!batch) throw new Error('Target batch not found');

    const labReportHash = await computeQualityReportHash({
      batchId: batch.batchId,
      testReportId: testData.testReportId,
      testDate: testData.testDate,
      moisturePercentage: testData.moisturePercentage,
      hmfMgPerKg: testData.hmfMgPerKg,
      reducingSugarsPercentage: testData.reducingSugarsPercentage,
      sucrosePercentage: testData.sucrosePercentage,
      passedRegulatoryStandard: testData.passedRegulatoryStandard,
      certifyingOfficerName: testData.certifyingOfficerName,
    });

    const testId = `test-${Date.now()}`;
    const newTest: QualityTest = {
      id: testId,
      batchId: batch.id,
      ...testData,
      labReportHash,
      createdAt: new Date().toISOString(),
    };

    this.state.qualityTests.unshift(newTest);

    // Update batch status
    if (testData.passedRegulatoryStandard) {
      batch.status = 'QualityVerified';
    } else {
      batch.status = 'RecalledOrFlagged';
      batch.flagReason = `FAILED REGULATORY STANDARD: Moisture (${testData.moisturePercentage}%) or Quality parameters breached FSSAI statutory limits. ${testData.labNotes || ''}`;
    }
    batch.updatedAt = new Date().toISOString();

    // Append Traceability Event
    const eventId = `evt-${Date.now()}`;
    const txHash = await computeSha256(`${eventId}-${labReportHash}`);
    this.state.traceabilityEvents.unshift({
      id: eventId,
      batchId: batch.id,
      eventType: testData.passedRegulatoryStandard ? 'LAB_TEST_PASSED' : 'LAB_TEST_FAILED',
      eventTitle: testData.passedRegulatoryStandard ? 'Laboratory Quality Verified (NABL/FSSAI)' : 'Laboratory Quality Test FAILED',
      eventDescription: testData.passedRegulatoryStandard
        ? `Quality test report ${testData.testReportId} verified compliance. Moisture: ${testData.moisturePercentage}%, HMF: ${testData.hmfMgPerKg} mg/kg. Purity authenticated.`
        : `Batch breached standards. Moisture: ${testData.moisturePercentage}% (max allowed: 20%). Flagged for safety.`,
      actorName: testData.certifyingOfficerName,
      actorRole: 'laboratory',
      eventHash: labReportHash,
      onChainTxHash: txHash,
      locationSummary: 'Authorized Quality Laboratory',
      timestamp: new Date().toISOString(),
    });

    this.persist();
    return newTest;
  }

  // --- PROCESSING & PACKAGING ---
  async recordProcessingAndPackaging(
    batchIdOrKey: string,
    processData: {
      processorId: string;
      processorName: string;
      processType: 'gentle_microfiltration' | 'cold_settling' | 'raw_unheated' | 'moisture_conditioning';
      inputQuantityKg: number;
      outputQuantityKg: number;
      maxTemperatureCelsius: number;
      filterMeshSize: string;
      processDate: string;
      facilityLocation: string;
      packagingLotNumber: string;
      packageType: 'Food-Grade Glass Jar' | 'Recyclable Squeeze Bottle' | 'Tin Canister';
      unitSizeGrams: number;
      totalUnitsPackaged: number;
      bestBeforeDate: string;
      tamperEvidentSealId: string;
      notes?: string;
    }
  ) {
    const batch = this.state.batches.find((b) => b.id === batchIdOrKey || b.batchId === batchIdOrKey);
    if (!batch) throw new Error('Target batch not found');

    const parametersHash = await computeProcessingHash({
      batchId: batch.batchId,
      processType: processData.processType,
      inputQuantityKg: processData.inputQuantityKg,
      outputQuantityKg: processData.outputQuantityKg,
      maxTemperatureCelsius: processData.maxTemperatureCelsius,
      filterMeshSize: processData.filterMeshSize,
      processDate: processData.processDate,
      facilityLocation: processData.facilityLocation,
    });

    // Create Processing Event
    const procId = `proc-${Date.now()}`;
    const newProc: ProcessingEvent = {
      id: procId,
      batchId: batch.id,
      processorId: processData.processorId,
      processorName: processData.processorName,
      processType: processData.processType,
      inputQuantityKg: processData.inputQuantityKg,
      outputQuantityKg: processData.outputQuantityKg,
      maxTemperatureCelsius: processData.maxTemperatureCelsius,
      filterMeshSize: processData.filterMeshSize,
      processDate: processData.processDate,
      facilityLocation: processData.facilityLocation,
      parametersHash,
      notes: processData.notes,
    };
    this.state.processingEvents.unshift(newProc);

    // Create Packaging Record
    const packId = `pack-${Date.now()}`;
    const newPack: PackagingRecord = {
      id: packId,
      batchId: batch.id,
      packagerId: processData.processorId,
      packagerName: processData.processorName,
      packagingLotNumber: processData.packagingLotNumber,
      packageType: processData.packageType,
      unitSizeGrams: processData.unitSizeGrams,
      totalUnitsPackaged: processData.totalUnitsPackaged,
      packagingDate: processData.processDate,
      bestBeforeDate: processData.bestBeforeDate,
      tamperEvidentSealId: processData.tamperEvidentSealId,
    };
    this.state.packagingRecords.unshift(newPack);

    // Update batch status
    batch.status = 'ReadyForDistribution';
    batch.remainingQuantityKg = 0; // Completely bottled into units
    batch.updatedAt = new Date().toISOString();

    // Append Traceability Events
    const txHash = await computeSha256(`${packId}-${parametersHash}`);
    this.state.traceabilityEvents.unshift({
      id: `evt-proc-${Date.now()}`,
      batchId: batch.id,
      eventType: 'PROCESSING_COMPLETED',
      eventTitle: 'Cold Processing & Settling Completed',
      eventDescription: `Gentle extraction processed ${processData.inputQuantityKg}kg at ${processData.maxTemperatureCelsius}°C using ${processData.filterMeshSize}.`,
      actorName: processData.processorName,
      actorRole: 'processor',
      eventHash: parametersHash,
      onChainTxHash: txHash,
      locationSummary: processData.facilityLocation,
      timestamp: new Date().toISOString(),
    });

    this.state.traceabilityEvents.unshift({
      id: `evt-pack-${Date.now()}`,
      batchId: batch.id,
      eventType: 'PACKAGED',
      eventTitle: 'Packaging Completed & Sealed with Tamper Seal',
      eventDescription: `Bottled into ${processData.totalUnitsPackaged} units (${processData.unitSizeGrams}g ${processData.packageType}) under lot ${processData.packagingLotNumber}. Seal ID: ${processData.tamperEvidentSealId}. Ready for consumer distribution.`,
      actorName: processData.processorName,
      actorRole: 'processor',
      eventHash: await computeSha256(`${processData.packagingLotNumber}-${processData.tamperEvidentSealId}`),
      onChainTxHash: txHash,
      locationSummary: processData.facilityLocation,
      timestamp: new Date().toISOString(),
    });

    this.persist();
  }

  // --- RECALL OR FLAG BATCH ---
  flagBatch(batchIdOrKey: string, reason: string, actorName: string, actorRole: UserRole) {
    const batch = this.state.batches.find((b) => b.id === batchIdOrKey || b.batchId === batchIdOrKey);
    if (!batch) throw new Error('Target batch not found');

    batch.status = 'RecalledOrFlagged';
    batch.flagReason = reason;
    batch.updatedAt = new Date().toISOString();

    this.state.traceabilityEvents.unshift({
      id: `evt-flag-${Date.now()}`,
      batchId: batch.id,
      eventType: 'BATCH_FLAGGED_OR_RECALLED',
      eventTitle: 'Batch Flagged by Authority',
      eventDescription: reason,
      actorName,
      actorRole,
      eventHash: '0x' + Math.random().toString(16).substring(2).padEnd(64, '0'),
      locationSummary: 'Regulatory Authority Command',
      timestamp: new Date().toISOString(),
    });

    this.state.alerts.unshift({
      id: `alt-${Date.now()}`,
      batchId: batch.batchId,
      severity: 'critical',
      alertType: 'tamper_flag',
      title: `Batch Flagged: ${batch.batchId}`,
      message: reason,
      isResolved: false,
      createdAt: new Date().toISOString(),
    });

    this.persist();
  }
}

function harvestIndexFromCode(code: string): number {
  const parts = code.split('-');
  const num = parseInt(parts[parts.length - 1], 10);
  return isNaN(num) ? 1 : num;
}

export const honeyStore = new StoreManager();
