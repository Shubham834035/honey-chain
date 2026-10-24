// =====================================================================================
// HONEY CHAIN — TypeScript Type Definitions
// Smart India Hackathon 2026 (SIH26021) — Team RUDRASCRIPT
// =====================================================================================

export type UserRole = 'beekeeper' | 'laboratory' | 'processor' | 'admin' | 'consumer';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  organizationName?: string;
  licenseNumber?: string;
  walletAddress?: string;
  isVerified: boolean;
  avatarUrl?: string;
}

export interface Farm {
  id: string;
  beekeeperId: string;
  name: string;
  state: string;
  district: string;
  generalLocation: string; // Coarse location for public transparency & privacy protection
  elevationMeters?: number;
  dominantFlora: string[];
  establishedDate: string;
}

export type HiveStatus = 'healthy' | 'active' | 'attention_required' | 'dormant' | 'quarantined';

export interface Hive {
  id: string;
  hiveId: string; // e.g. "HIV-KA-001"
  farmId: string;
  farmName: string;
  hiveType: string;
  species: string; // e.g., "Apis cerana indica" or "Apis mellifera"
  queenYear: number;
  status: HiveStatus;
  installationDate: string;
  notes?: string;
  sensorDeviceId?: string;
  currentWeightKg?: number;
  currentTempC?: number;
  currentHumidity?: number;
}

export interface HiveInspection {
  id: string;
  hiveId: string;
  inspectionDate: string;
  queenSpotted: boolean;
  broodPattern: 'solid' | 'spotty' | 'poor';
  temperament: 'calm' | 'defensive' | 'aggressive';
  pestDetected: string[];
  honeyStoresEstimateKg: number;
  actionTaken?: string;
}

export interface Harvest {
  id: string;
  harvestId: string; // e.g. "HRV-2026-001"
  hiveId: string;
  hiveCode: string;
  farmName: string;
  beekeeperId: string;
  beekeeperName: string;
  harvestDate: string;
  quantityKg: number;
  floraSource: string; // e.g. "Himalayan Mustard", "Wild Forest Multifloral", "Eucalyptus"
  harvestMethod: string;
  moistureFieldReading?: number;
  notes?: string;
  isBatched: boolean;
  batchId?: string;
}

export type BatchStatus =
  | 'Harvested'
  | 'QualityTestingPending'
  | 'QualityVerified'
  | 'Processing'
  | 'Packaged'
  | 'ReadyForDistribution'
  | 'RecalledOrFlagged';

export interface HoneyBatch {
  id: string;
  batchId: string; // e.g. "HC-2026-H04-B001"
  harvestId: string;
  beekeeperId: string;
  beekeeperName: string;
  farmName: string;
  locationSummary: string; // District, State
  variety: string;
  initialQuantityKg: number;
  remainingQuantityKg: number;
  status: BatchStatus;
  canonicalHash: string; // SHA-256 hash of immutable canonical record
  onChainTxHash: string;
  blockNumber: number;
  qrCodeSvg?: string;
  qrCodeUrl: string;
  createdAt: string;
  updatedAt: string;
  flagReason?: string;
}

export interface QualityTest {
  id: string;
  batchId: string;
  laboratoryId: string;
  labName: string;
  testReportId: string;
  testDate: string;
  moisturePercentage: number; // Regulatory standard <= 20%
  hmfMgPerKg: number; // Hydroxymethylfurfural <= 40 mg/kg fresh, <= 80 mg/kg tropical
  reducingSugarsPercentage: number; // >= 65%
  sucrosePercentage: number; // <= 5%
  pollenCountDominant: string;
  c4SugarAdulterationDetected: boolean;
  antibioticResidueDetected: boolean;
  passedRegulatoryStandard: boolean;
  certifyingOfficerName: string;
  labReportHash: string;
  reportDocumentUrl?: string;
  labNotes?: string;
  createdAt: string;
}

export interface ProcessingEvent {
  id: string;
  batchId: string;
  processorId: string;
  processorName: string;
  processType: 'gentle_microfiltration' | 'cold_settling' | 'raw_unheated' | 'moisture_conditioning';
  inputQuantityKg: number;
  outputQuantityKg: number;
  maxTemperatureCelsius: number; // Must be <= 40°C for raw designation
  filterMeshSize: string;
  processDate: string;
  facilityLocation: string;
  parametersHash: string;
  notes?: string;
}

export interface PackagingRecord {
  id: string;
  batchId: string;
  packagerId: string;
  packagerName: string;
  packagingLotNumber: string;
  packageType: 'Food-Grade Glass Jar' | 'Recyclable Squeeze Bottle' | 'Tin Canister';
  unitSizeGrams: number;
  totalUnitsPackaged: number;
  packagingDate: string;
  bestBeforeDate: string;
  tamperEvidentSealId: string;
}

export interface TraceabilityEvent {
  id: string;
  batchId: string;
  eventType:
    | 'BATCH_HARVESTED'
    | 'LAB_SAMPLE_RECEIVED'
    | 'LAB_TEST_PASSED'
    | 'LAB_TEST_FAILED'
    | 'PROCESSING_STARTED'
    | 'PROCESSING_COMPLETED'
    | 'PACKAGED'
    | 'READY_FOR_DISTRIBUTION'
    | 'BATCH_FLAGGED_OR_RECALLED';
  eventTitle: string;
  eventDescription: string;
  actorName: string;
  actorRole: UserRole;
  eventHash: string;
  previousEventHash?: string;
  onChainTxHash?: string;
  blockNumber?: number;
  locationSummary: string;
  timestamp: string;
}

export interface BlockchainRecord {
  id: string;
  batchId: string;
  networkName: string;
  contractAddress: string;
  transactionHash: string;
  blockNumber: number;
  canonicalStateHash: string;
  verificationMode: 'simulated' | 'live_on_chain';
  gasUsed: number;
  recordedAt: string;
}

export interface SensorReading {
  id: string;
  deviceId: string;
  hiveId: string;
  hiveCode: string;
  temperatureCelsius: number;
  humidityPercentage: number;
  weightKg: number;
  acousticFrequencyHz: number;
  batteryPercentage: number;
  isSimulated: boolean;
  recordedAt: string;
}

export interface Alert {
  id: string;
  hiveId?: string;
  hiveCode?: string;
  batchId?: string;
  severity: 'info' | 'warning' | 'critical';
  alertType: 'temperature_spike' | 'swarm_risk' | 'weight_drop' | 'tamper_flag' | 'lab_failed';
  title: string;
  message: string;
  isResolved: boolean;
  createdAt: string;
}
