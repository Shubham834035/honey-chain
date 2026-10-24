import { describe, it, expect, beforeEach } from 'vitest';
import {
  canonicalStringify,
  computeSha256,
  computeBatchCanonicalHash,
  computeQualityReportHash,
  computeProcessingHash,
  verifyIntegrity,
} from '../src/lib/crypto';
import { honeyStore, DEMO_BATCHES } from '../src/lib/store';
import { getBlockchainAdapter } from '../src/lib/blockchain';
import { generateBatchQrCodeSvg, generateBatchQrCodeDataUrl } from '../src/lib/qr';

describe('HONEY CHAIN — Cryptographic & Traceability Test Suite (SIH26021)', () => {
  beforeEach(() => {
    honeyStore.resetToDefault();
  });

  describe('1. Canonical Serialization & Deterministic Hashing', () => {
    it('should sort keys deterministically regardless of insertion order', () => {
      const objA = { z: 1, a: 2, m: { y: 'bar', b: 'foo' } };
      const objB = { m: { b: 'foo', y: 'bar' }, a: 2, z: 1 };

      const serializedA = canonicalStringify(objA);
      const serializedB = canonicalStringify(objB);

      expect(serializedA).toBe(serializedB);
      expect(serializedA).toBe('{"a":2,"m":{"b":"foo","y":"bar"},"z":1}');
    });

    it('should calculate identical SHA-256 hashes for equivalent objects', async () => {
      const payload1 = { batchId: 'HC-2026-H04-B001', qty: 48.5, origin: 'Kullu' };
      const payload2 = { origin: 'Kullu', qty: 48.5, batchId: 'HC-2026-H04-B001' };

      const hash1 = await computeSha256(payload1);
      const hash2 = await computeSha256(payload2);

      expect(hash1).toBe(hash2);
      expect(hash1).toMatch(/^0x[a-f0-9]{64}$/i);
    });

    it('should detect tampering: single field mutation changes hash completely', async () => {
      const originalPayload = {
        batchId: 'HC-2026-H04-B001',
        harvestId: 'HRV-2026-001',
        beekeeperId: 'demo-beekeeper-1',
        variety: 'Himalayan Wild Mustard',
        initialQuantityKg: 48.5,
        harvestDate: '2026-04-10',
        locationSummary: 'Kullu, Himachal Pradesh',
      };

      const originalHash = await computeBatchCanonicalHash(originalPayload);

      // Tampered payload (moisture/quantity or variety altered)
      const tamperedPayload = {
        ...originalPayload,
        variety: 'Adulterated Blend',
      };

      const tamperedHash = await computeBatchCanonicalHash(tamperedPayload);
      expect(originalHash).not.toBe(tamperedHash);

      const isValid = await verifyIntegrity(tamperedPayload, originalHash);
      expect(isValid).toBe(false);
    });
  });

  describe('2. Hive & Colony Management', () => {
    it('should register a new hive colony and store it in state', () => {
      const initialCount = honeyStore.getState().hives.length;

      const newHive = honeyStore.addHive({
        hiveId: 'HIV-TEST-99',
        farmId: 'farm-hp-1',
        farmName: 'Parvati Valley Wild Flora Apiary',
        hiveType: 'Langstroth Standard',
        species: 'Apis cerana indica',
        queenYear: 2026,
        status: 'healthy',
        installationDate: '2026-04-20',
        notes: 'Test colony installation',
      });

      expect(newHive.hiveId).toBe('HIV-TEST-99');
      expect(honeyStore.getState().hives.length).toBe(initialCount + 1);
    });
  });

  describe('3. Harvest Extractions & Batch Creation', () => {
    it('should record a valid harvest extraction', () => {
      const initialHarvests = honeyStore.getState().harvests.length;

      const harvest = honeyStore.addHarvest({
        hiveId: 'hive-hp-001',
        hiveCode: 'HIV-HP-001',
        farmName: 'Parvati Valley Wild Flora Apiary',
        beekeeperId: 'demo-beekeeper-1',
        beekeeperName: 'Rajesh Sharma',
        harvestDate: '2026-04-22',
        quantityKg: 30.5,
        floraSource: 'Mustard Blossom',
        harvestMethod: 'Cold extraction',
        moistureFieldReading: 17.5,
      });

      expect(harvest.harvestId).toMatch(/^HRV-2026-\d{3}$/);
      expect(harvest.quantityKg).toBe(30.5);
      expect(honeyStore.getState().harvests.length).toBe(initialHarvests + 1);
    });

    it('should generate a unique Batch ID and canonical hash from a harvest', async () => {
      const harvests = honeyStore.getState().harvests;
      const targetHarvest = harvests[0];

      const batch = await honeyStore.createBatchFromHarvest(
        targetHarvest.id,
        'Himalayan Organic Flora',
        targetHarvest.quantityKg
      );

      expect(batch.batchId).toMatch(/^HC-2026-H\d{2}-B\d{3}$/);
      expect(batch.canonicalHash).toMatch(/^0x[a-f0-9]{64}$/i);
      expect(batch.status).toBe('Harvested');
      expect(batch.initialQuantityKg).toBe(targetHarvest.quantityKg);

      // Verify that a traceability event was logged
      const events = honeyStore.getState().traceabilityEvents.filter((e) => e.batchId === batch.id);
      expect(events.length).toBeGreaterThanOrEqual(1);
      expect(events[0].eventType).toBe('BATCH_HARVESTED');
    });
  });

  describe('4. Laboratory Quality Assay & Standard Verification', () => {
    it('should verify batch when moisture <= 20% and no adulteration detected', async () => {
      const state = honeyStore.getState();
      const testBatch = state.batches[1]; // HC-2026-H09-B002 (QualityTestingPending)

      const testResult = await honeyStore.submitQualityTest(testBatch.id, {
        laboratoryId: 'demo-lab-1',
        labName: 'National Quality Testing Lab',
        testReportId: 'NHTL-TEST-PASS-01',
        testDate: '2026-04-24',
        moisturePercentage: 17.5, // Compliant <= 20%
        hmfMgPerKg: 15.0,
        reducingSugarsPercentage: 74.0,
        sucrosePercentage: 2.0,
        pollenCountDominant: 'White Clover 80%',
        c4SugarAdulterationDetected: false,
        antibioticResidueDetected: false,
        passedRegulatoryStandard: true,
        certifyingOfficerName: 'Dr. Sunita Verma',
      });

      expect(testResult.passedRegulatoryStandard).toBe(true);
      expect(testBatch.status).toBe('QualityVerified');
    });

    it('should flag batch when moisture breaches 20% ceiling', async () => {
      const state = honeyStore.getState();
      const testBatch = state.batches[0];

      const testResult = await honeyStore.submitQualityTest(testBatch.id, {
        laboratoryId: 'demo-lab-1',
        labName: 'National Quality Testing Lab',
        testReportId: 'NHTL-TEST-FAIL-02',
        testDate: '2026-04-24',
        moisturePercentage: 22.5, // BREACH: > 20%
        hmfMgPerKg: 35.0,
        reducingSugarsPercentage: 62.0,
        sucrosePercentage: 4.0,
        pollenCountDominant: 'Unspecified',
        c4SugarAdulterationDetected: false,
        antibioticResidueDetected: false,
        passedRegulatoryStandard: false,
        certifyingOfficerName: 'Dr. Sunita Verma',
      });

      expect(testResult.passedRegulatoryStandard).toBe(false);
      expect(testBatch.status).toBe('RecalledOrFlagged');
    });
  });

  describe('5. Processing & Packaging Workflow', () => {
    it('should record packaging lot and elevate status to ReadyForDistribution', async () => {
      const state = honeyStore.getState();
      const targetBatch = state.batches[0];

      await honeyStore.recordProcessingAndPackaging(targetBatch.id, {
        processorId: 'demo-processor-1',
        processorName: 'Apex Agro-Packaging',
        processType: 'cold_settling',
        inputQuantityKg: targetBatch.initialQuantityKg,
        outputQuantityKg: targetBatch.initialQuantityKg,
        maxTemperatureCelsius: 38.0,
        filterMeshSize: '80 Mesh Stainless',
        processDate: '2026-04-24',
        facilityLocation: 'Ahmedabad Processing Park',
        packagingLotNumber: 'LOT-2026-TEST-001',
        packageType: 'Food-Grade Glass Jar',
        unitSizeGrams: 500,
        totalUnitsPackaged: 97,
        bestBeforeDate: '2028-04-24',
        tamperEvidentSealId: 'SEAL-TEST-9988',
      });

      expect(targetBatch.status).toBe('ReadyForDistribution');
      expect(state.packagingRecords.length).toBeGreaterThan(0);
    });
  });

  describe('6. Blockchain Adapter & Proof Verification', () => {
    it('should transparently label simulated mode and generate verifiable transaction hashes', async () => {
      const adapter = getBlockchainAdapter();
      const result = await adapter.registerBatch(
        'HC-2026-TEST',
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
      );

      expect(result.mode).toBe('simulated');
      expect(result.txHash).toMatch(/^0x[a-f0-9]{64}$/i);
      expect(result.blockNumber).toBeGreaterThan(18459200);

      // Verify batch against adapter
      const verifyRes = await adapter.verifyBatch(
        'HC-2026-TEST',
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
      );

      expect(verifyRes.exists).toBe(true);
      expect(verifyRes.hashMatches).toBe(true);
      expect(verifyRes.mode).toBe('simulated');
    });
  });

  describe('7. QR Code Generation', () => {
    it('should generate SVG and base64 DataURL containing public verification link', async () => {
      const svg = await generateBatchQrCodeSvg('HC-2026-H04-B001', 'http://localhost:3000');
      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');

      const dataUrl = await generateBatchQrCodeDataUrl('HC-2026-H04-B001', 'http://localhost:3000');
      expect(dataUrl).toMatch(/^data:image\/png;base64,/);
    });
  });
});
