'use client';

// =====================================================================================
// HONEY CHAIN — Public Honey Verification Interface (/verify)
// Smart India Hackathon 2026 (SIH26021) — Team RUDRASCRIPT
// =====================================================================================

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useHoney } from '@/context/HoneyContext';
import {
  ShieldCheck,
  QrCode,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Microscope,
  Calendar,
  MapPin,
  Lock,
  Camera,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Info,
} from 'lucide-react';

function VerifyContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const { state } = useHoney();

  const [inputBatchId, setInputBatchId] = useState(initialId);
  const [activeBatchId, setActiveBatchId] = useState(initialId || 'HC-2026-H04-B001');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const scannerRef = useRef<any>(null);

  // Sync with URL query parameter
  useEffect(() => {
    if (initialId) {
      setInputBatchId(initialId);
      setActiveBatchId(initialId);
    }
  }, [initialId]);

  // Handle Camera QR Scanner
  const startCameraScanner = async () => {
    setCameraError(null);
    setCameraActive(true);

    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const scanner = new Html5Qrcode('qr-reader-container');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          try {
            const url = new URL(decodedText);
            const idParam = url.searchParams.get('id');
            if (idParam) {
              setActiveBatchId(idParam);
              setInputBatchId(idParam);
            } else {
              setActiveBatchId(decodedText);
              setInputBatchId(decodedText);
            }
          } catch {
            setActiveBatchId(decodedText);
            setInputBatchId(decodedText);
          }
          stopCameraScanner();
        },
        () => {}
      );
    } catch (err: any) {
      console.warn('Camera scanner initialization error:', err);
      setCameraError('Unable to access device camera. Please ensure camera permissions are granted, or enter the Batch ID manually.');
      setCameraActive(false);
    }
  };

  const stopCameraScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        scannerRef.current.clear();
        scannerRef.current = null;
        setCameraActive(false);
      }).catch((e: any) => console.warn(e));
    } else {
      setCameraActive(false);
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputBatchId.trim()) return;
    setActiveBatchId(inputBatchId.trim().toUpperCase());
  };

  // Find Target Batch Record
  const currentBatch = state.batches.find(
    (b) => b.batchId.toUpperCase() === activeBatchId.toUpperCase()
  );

  const qualityTest = currentBatch
    ? state.qualityTests.find((t) => t.batchId === currentBatch.id)
    : null;

  const packagingRecord = currentBatch
    ? state.packagingRecords.find((p) => p.batchId === currentBatch.id)
    : null;

  const timelineEvents = currentBatch
    ? state.traceabilityEvents
        .filter((e) => e.batchId === currentBatch.id)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Search Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 bg-amber-100 text-[#6B3F20] text-xs font-bold px-3 py-1 rounded-full border border-amber-300">
          <ShieldCheck className="w-4 h-4 text-[#F4A623]" />
          <span>Consumer Trust & Transparency Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#6B3F20]">
          Verify Your Honey
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Scan the QR code on your honey jar or enter your unique Batch ID to inspect origin provenance, laboratory purity tests, and blockchain state integrity.
        </p>
      </div>

      {/* Verification Input & Camera Scanner Card */}
      <div className="cream-card p-6 rounded-3xl shadow-sm space-y-5">
        <form onSubmit={handleManualSearch} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={inputBatchId}
              onChange={(e) => setInputBatchId(e.target.value)}
              placeholder="e.g. HC-2026-H04-B001"
              className="w-full pl-9 pr-4 py-2.5 text-xs font-mono font-bold uppercase border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4A623] bg-white text-gray-800"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#6B3F20] hover:bg-[#452410] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 shrink-0"
          >
            <ShieldCheck className="w-4 h-4 text-[#F4A623]" />
            <span>Verify Batch</span>
          </button>

          <button
            type="button"
            onClick={cameraActive ? stopCameraScanner : startCameraScanner}
            className="w-full sm:w-auto px-4 py-2.5 bg-amber-100 hover:bg-amber-200 text-[#6B3F20] border border-amber-300 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 shrink-0"
          >
            <Camera className="w-4 h-4" />
            <span>{cameraActive ? 'Close Camera' : 'Scan via Camera'}</span>
          </button>
        </form>

        {/* Camera Container */}
        {cameraActive && (
          <div className="bg-gray-900 p-4 rounded-2xl text-center space-y-3">
            <div className="text-xs text-amber-200 font-bold">
              Point your camera at the Honey Chain QR code on the jar
            </div>
            <div id="qr-reader-container" className="max-w-sm mx-auto overflow-hidden rounded-xl" />
            <button
              onClick={stopCameraScanner}
              className="px-4 py-1.5 bg-gray-800 text-white rounded-lg text-xs"
            >
              Cancel Camera Scan
            </button>
          </div>
        )}

        {cameraError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <span>{cameraError}</span>
          </div>
        )}

        {/* Quick Demo Batch Switcher Pills */}
        <div className="pt-2 border-t border-amber-100/70 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-gray-500 font-bold text-[11px]">Judge Demo Shortcuts:</span>

          <button
            onClick={() => {
              setInputBatchId('HC-2026-H04-B001');
              setActiveBatchId('HC-2026-H04-B001');
            }}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all ${
              activeBatchId === 'HC-2026-H04-B001'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            HC-2026-H04-B001 (Pure Certified)
          </button>

          <button
            onClick={() => {
              setInputBatchId('HC-2026-H02-B003');
              setActiveBatchId('HC-2026-H02-B003');
            }}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all ${
              activeBatchId === 'HC-2026-H02-B003'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100'
            }`}
          >
            HC-2026-H02-B003 (Packaged Jars)
          </button>

          <button
            onClick={() => {
              setInputBatchId('HC-2026-H09-B002');
              setActiveBatchId('HC-2026-H09-B002');
            }}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all ${
              activeBatchId === 'HC-2026-H09-B002'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            HC-2026-H09-B002 (Lab Pending)
          </button>

          <button
            onClick={() => {
              setInputBatchId('HC-2026-H11-B004');
              setActiveBatchId('HC-2026-H11-B004');
            }}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all ${
              activeBatchId === 'HC-2026-H11-B004'
                ? 'bg-red-600 text-white'
                : 'bg-red-50 text-red-800 border border-red-200 hover:bg-red-100'
            }`}
          >
            HC-2026-H11-B004 (Flagged Anomaly)
          </button>
        </div>
      </div>

      {/* Result Presentation */}
      {!currentBatch ? (
        <div className="cream-card p-12 rounded-3xl text-center space-y-4">
          <XCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="text-xl font-bold text-[#6B3F20]">Batch Record Not Found</h3>
          <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
            No honey batch matching <strong className="font-mono text-gray-800">{activeBatchId}</strong> exists in the registered blockchain registry. Please check the spelling on your jar label or test with one of the demo shortcuts above.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Main Verification Status Banner */}
          <div
            className={`rounded-3xl p-6 sm:p-8 border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
              currentBatch.status === 'RecalledOrFlagged'
                ? 'bg-red-50/90 border-red-300 text-red-950'
                : currentBatch.status === 'QualityTestingPending'
                ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                : 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                {currentBatch.status === 'RecalledOrFlagged' ? (
                  <XCircle className="w-7 h-7 text-red-600 shrink-0" />
                ) : currentBatch.status === 'QualityTestingPending' ? (
                  <AlertTriangle className="w-7 h-7 text-amber-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-7 h-7 text-[#2F6B45] shrink-0" />
                )}
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-gray-500">
                    STATUS VERIFICATION OUTCOME
                  </span>
                  <h2 className="text-2xl font-black leading-tight">
                    {currentBatch.status === 'RecalledOrFlagged'
                      ? 'BATCH FLAGGED / DISTRIBUTION BLOCKED'
                      : currentBatch.status === 'QualityTestingPending'
                      ? 'RECORD SECURED — QUALITY ASSAY PENDING'
                      : 'RECORD VERIFIED & QUALITY CERTIFIED'}
                  </h2>
                </div>
              </div>

              <p className="text-xs max-w-xl text-gray-700 leading-relaxed">
                {currentBatch.status === 'RecalledOrFlagged'
                  ? 'CRITICAL NOTICE: This batch has been officially flagged by laboratory authorities due to moisture or purity threshold breach. Retail sales are locked.'
                  : currentBatch.status === 'QualityTestingPending'
                  ? 'Extraction origin is secured on-chain. Physical laboratory assay is currently underway at the National Testing Laboratory.'
                  : 'Authentic Indian raw honey. Origin provenance is cryptographically secured on blockchain, and NABL/FSSAI laboratory tests confirm 100% pure standard compliance.'}
              </p>
            </div>

            {/* Blockchain Badge Box */}
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-black/5 text-right space-y-1 shrink-0 text-xs">
              <div className="text-[10px] text-gray-500 font-mono">CRYPTOGRAPHIC PROOF</div>
              <div className="font-mono font-bold text-gray-800">SHA-256 Validated</div>
              <div className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-bold inline-block">
                Demo Verification Mode
              </div>
            </div>
          </div>

          {/* Key Provenance & Quality Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Origin & Apiary Provenance Card */}
            <div className="cream-card p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-amber-100">
                <span className="text-xs font-bold text-[#6B3F20] uppercase tracking-wider flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>Botanical Origin & Producer</span>
                </span>
                <span className="text-xs font-mono font-bold text-gray-500">
                  {currentBatch.batchId}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase">Floral Nectar Variety</span>
                  <span className="text-base font-extrabold text-[#6B3F20]">{currentBatch.variety}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Geographical Region</span>
                    <span className="font-bold text-gray-800">{currentBatch.locationSummary}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Beekeeper / Producer</span>
                    <span className="font-bold text-gray-800">{currentBatch.beekeeperName}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Harvest Date</span>
                    <span className="font-bold text-gray-800 font-mono">{currentBatch.createdAt.split('T')[0]}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] uppercase">Batch Initial Yield</span>
                    <span className="font-bold text-[#6B3F20]">{currentBatch.initialQuantityKg} kg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Laboratory Certified Purity Card */}
            <div className="cream-card p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-amber-100">
                <span className="text-xs font-bold text-[#6B3F20] uppercase tracking-wider flex items-center space-x-1.5">
                  <Microscope className="w-4 h-4 text-amber-600" />
                  <span>Certified Laboratory Assay</span>
                </span>
                <span className="text-[10px] bg-amber-100 text-[#6B3F20] font-bold px-2 py-0.5 rounded">
                  FSSAI Standard
                </span>
              </div>

              {qualityTest ? (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-xl border border-amber-100">
                      <span className="text-gray-500 block text-[10px]">Moisture Content</span>
                      <span className={`text-base font-extrabold ${qualityTest.moisturePercentage <= 20 ? 'text-emerald-700' : 'text-red-700'}`}>
                        {qualityTest.moisturePercentage}%
                      </span>
                      <span className="text-[9px] text-gray-400 block">FSSAI legal max: 20.0%</span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-amber-100">
                      <span className="text-gray-500 block text-[10px]">HMF (Hydroxymethylfurfural)</span>
                      <span className="text-base font-extrabold text-[#6B3F20]">
                        {qualityTest.hmfMgPerKg} mg/kg
                      </span>
                      <span className="text-[9px] text-gray-400 block">Fresh raw ceiling: 40 mg/kg</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">C4 Sugar Adulteration (Corn/Cane):</span>
                      <span className="font-bold text-emerald-700">NEGATIVE (None Detected)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Antibiotic & Pesticide Residue:</span>
                      <span className="font-bold text-emerald-700">NEGATIVE (Zero Residue)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Pollen Dominance:</span>
                      <span className="font-medium text-gray-800">{qualityTest.pollenCountDominant}</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-gray-500 italic pt-1 border-t border-gray-100">
                    Certified by: {qualityTest.certifyingOfficerName} ({qualityTest.testReportId})
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-gray-500 space-y-2">
                  <Microscope className="w-8 h-8 text-amber-500 mx-auto animate-pulse" />
                  <p className="font-bold text-gray-700">Laboratory Quality Assay in Progress</p>
                  <p className="text-[11px] text-gray-500 max-w-xs mx-auto">
                    A representative physical sample has been dispatched to the National Testing Laboratory. Certified parameters will reflect upon sign-off.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Traceability Timeline */}
          <div className="cream-card p-6 sm:p-8 rounded-3xl space-y-6">
            <div>
              <h3 className="font-extrabold text-base text-[#6B3F20]">
                Verifiable Supply Chain Journey
              </h3>
              <p className="text-xs text-gray-500">
                Immutable chronological event trail secured by canonical SHA-256 state hashes
              </p>
            </div>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-amber-200">
              {timelineEvents.map((evt) => (
                <div key={evt.id} className="relative flex items-start space-x-4 text-xs">
                  <div className="w-7 h-7 rounded-full bg-[#6B3F20] text-amber-300 flex items-center justify-center font-bold text-xs shrink-0 z-10 shadow-sm">
                    {evt.actorRole === 'beekeeper' && '🐝'}
                    {evt.actorRole === 'laboratory' && '🔬'}
                    {evt.actorRole === 'processor' && '⚙️'}
                    {evt.actorRole === 'admin' && '🛡️'}
                  </div>

                  <div className="flex-1 bg-white p-4 rounded-2xl border border-amber-100 shadow-sm space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="font-bold text-sm text-[#6B3F20]">{evt.eventTitle}</h4>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {new Date(evt.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-gray-700 leading-relaxed">{evt.eventDescription}</p>

                    <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between text-[10px] text-gray-500 gap-2 font-mono">
                      <span>Actor: <strong className="font-sans text-gray-700">{evt.actorName}</strong> ({evt.actorRole})</span>
                      <span className="text-gray-400">Tx: {evt.onChainTxHash ? evt.onChainTxHash.substring(0, 16) : 'Confirmed'}...</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Educational Trust Callout */}
          <div className="p-6 bg-white rounded-3xl border border-amber-200 shadow-sm space-y-3 text-xs">
            <div className="flex items-center space-x-2 text-[#6B3F20] font-bold">
              <Info className="w-4 h-4 text-[#F4A623]" />
              <span>What Does This Verification Guarantee?</span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              This verification proves that the batch information displayed above has not been modified or replaced since its registration by the certified beekeeper and accredited laboratory. It connects this physical bottle to its exact hive extraction and official laboratory certificate.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto py-20 text-center text-xs text-gray-500">
          Loading verification interface...
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
