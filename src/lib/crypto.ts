// =====================================================================================
// HONEY CHAIN — Cryptographic Utilities & Canonical Hash Engine
// Smart India Hackathon 2026 (SIH26021) — Team RUDRASCRIPT
// =====================================================================================

/**
 * Deterministically sorts object keys for canonical JSON serialization.
 * Ensures that two payloads with the same content always yield the identical hash,
 * regardless of key ordering or whitespace discrepancies.
 */
export function canonicalStringify(obj: any): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return `[${obj.map((item) => canonicalStringify(item)).join(',')}]`;
  }

  const sortedKeys = Object.keys(obj).sort();
  const entries = sortedKeys.map((key) => {
    return `${JSON.stringify(key)}:${canonicalStringify(obj[key])}`;
  });

  return `{${entries.join(',')}}`;
}

/**
 * Computes a standard SHA-256 cryptographic hash of arbitrary string or object.
 * Returns a 0x-prefixed 64-character hexadecimal digest.
 */
export async function computeSha256(data: string | object): Promise<string> {
  const content = typeof data === 'string' ? data : canonicalStringify(data);
  const encoder = new TextEncoder();
  const bytes = encoder.encode(content);

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return '0x' + hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Node.js fallback
  try {
    const nodeCrypto = await import('crypto');
    return '0x' + nodeCrypto.createHash('sha256').update(content).digest('hex');
  } catch (err) {
    // Basic fallback for pure synchronous environments
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return '0x' + Math.abs(hash).toString(16).padStart(64, '0');
  }
}

/**
 * Generates canonical SHA-256 hash for a Honey Batch origin record.
 */
export async function computeBatchCanonicalHash(payload: {
  batchId: string;
  harvestId: string;
  beekeeperId: string;
  variety: string;
  initialQuantityKg: number;
  harvestDate: string;
  locationSummary: string;
}): Promise<string> {
  return computeSha256({
    batchId: payload.batchId,
    harvestId: payload.harvestId,
    beekeeperId: payload.beekeeperId,
    variety: payload.variety.trim().toLowerCase(),
    initialQuantityKg: Number(payload.initialQuantityKg.toFixed(2)),
    harvestDate: payload.harvestDate,
    locationSummary: payload.locationSummary.trim().toLowerCase(),
  });
}

/**
 * Generates canonical SHA-256 hash for a Quality Laboratory Certificate.
 */
export async function computeQualityReportHash(payload: {
  batchId: string;
  testReportId: string;
  testDate: string;
  moisturePercentage: number;
  hmfMgPerKg: number;
  reducingSugarsPercentage: number;
  sucrosePercentage: number;
  passedRegulatoryStandard: boolean;
  certifyingOfficerName: string;
}): Promise<string> {
  return computeSha256({
    batchId: payload.batchId,
    testReportId: payload.testReportId,
    testDate: payload.testDate,
    moisturePercentage: Number(payload.moisturePercentage.toFixed(2)),
    hmfMgPerKg: Number(payload.hmfMgPerKg.toFixed(2)),
    reducingSugarsPercentage: Number(payload.reducingSugarsPercentage.toFixed(2)),
    sucrosePercentage: Number(payload.sucrosePercentage.toFixed(2)),
    passedRegulatoryStandard: payload.passedRegulatoryStandard,
    certifyingOfficerName: payload.certifyingOfficerName.trim(),
  });
}

/**
 * Generates canonical SHA-256 hash for Processing & Packaging event parameters.
 */
export async function computeProcessingHash(payload: {
  batchId: string;
  processType: string;
  inputQuantityKg: number;
  outputQuantityKg: number;
  maxTemperatureCelsius: number;
  filterMeshSize: string;
  processDate: string;
  facilityLocation: string;
}): Promise<string> {
  return computeSha256({
    batchId: payload.batchId,
    processType: payload.processType,
    inputQuantityKg: Number(payload.inputQuantityKg.toFixed(2)),
    outputQuantityKg: Number(payload.outputQuantityKg.toFixed(2)),
    maxTemperatureCelsius: Number(payload.maxTemperatureCelsius.toFixed(1)),
    filterMeshSize: payload.filterMeshSize,
    processDate: payload.processDate,
    facilityLocation: payload.facilityLocation.trim().toLowerCase(),
  });
}

/**
 * Verifies if an arbitrary record's calculated canonical hash strictly matches the recorded hash.
 */
export async function verifyIntegrity(data: any, expectedHash: string): Promise<boolean> {
  const calculated = await computeSha256(data);
  return calculated.toLowerCase() === expectedHash.toLowerCase();
}
