'use client';

// =====================================================================================
// HONEY CHAIN — Honey Batch Detailed Ledger View (/batches/[id])
// Smart India Hackathon 2026 (SIH26021) — Team RUDRASCRIPT
// =====================================================================================

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useHoney } from '@/context/HoneyContext';
import { generateBatchQrCodeDataUrl } from '@/lib/qr';
import {
  Layers,
  ArrowLeft,
  QrCode,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Microscope,
  Factory,
  Package,
  Calendar,
  MapPin,
  ExternalLink,
  Lock,
} from 'lucide-react';

export default function BatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { state } = useHoney();

  const batchKey = params.id as string;
  const batch = state.batches.find((b) => b.batchId === batchKey || b.id === batchKey);

  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (batch) {
      generateBatchQrCodeDataUrl(batch.batchId).then((data) => {
        setQrDataUrl(data);
      });
    }
  }, [batch]);

  if (!batch) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-600 mx-auto" />
        <h2 className="text-2xl font-black text-[#6B3F20]">Batch Record Not Found</h2>
        <p className="text-xs text-gray-600">
          No registered honey batch matched identifier <code className="font-bold">{batchKey}</code>.
        </p>
        <Link
          href="/batches"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#D97706] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Batches Directory</span>
        </Link>
      </div>
    );
  }

  const qualityTest = state.qualityTests.find((t) => t.batchId === batch.id);
  const processingEvent = state.processingEvents.find((p) => p.batchId === batch.id);
  const packagingRecord = state.packagingRecords.find((p) => p.batchId === batch.id);
  const timelineEvents = state.traceabilityEvents
    .filter((e) => e.batchId === batch.id)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/batches"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-600 hover:text-[#6B3F20]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Batches Directory</span>
        </Link>

        <Link
          href={`/verify?id=${batch.batchId}`}
          className="inline-flex items-center space-x-1.5 bg-[#F4A623] hover:bg-amber-500 text-[#452410] text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm"
        >
          <QrCode className="w-4 h-4" />
          <span>Open Public Consumer View</span>
        </Link>
      </div>

      {/* Main Batch Header Card */}
      <div className="cream-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xl sm:text-2xl font-black text-[#6B3F20]">
                {batch.batchId}
              </span>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  batch.status === 'QualityVerified'
                    ? 'bg-emerald-100 text-emerald-800'
                    : batch.status === 'ReadyForDistribution'
                    ? 'bg-blue-100 text-blue-800'
                    : batch.status === 'QualityTestingPending'
                    ? 'bg-amber-100 text-amber-800'
                    : batch.status === 'RecalledOrFlagged'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {batch.status.toUpperCase()}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">{batch.variety}</h1>
            <p className="text-xs text-gray-600 flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>{batch.locationSummary}</span>
              </span>
              <span>•</span>
              <span>Produced by <strong>{batch.beekeeperName}</strong></span>
            </p>
          </div>

          {/* Quick Actions (Print / Download QR) */}
          <div className="flex items-center space-x-2">
            {qrDataUrl && (
              <a
                href={qrDataUrl}
                download={`${batch.batchId}-QR.png`}
                className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl shadow-sm transition-all"
                title="Download QR code PNG"
              >
                <Download className="w-3.5 h-3.5 text-amber-700" />
                <span>Download QR</span>
              </a>
            )}
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-gray-600" />
              <span>Print Batch Card</span>
            </button>
          </div>
        </div>

        {/* Two-Column Grid: Details & QR Certificate */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-amber-100">
          {/* Details Column */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-extrabold text-sm text-[#6B3F20] uppercase tracking-wider">
              Batch Metadata & Provenance
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-white rounded-xl border border-amber-100">
                <span className="text-gray-500 block text-[10px] uppercase">Extraction Date</span>
                <span className="font-bold text-gray-800 font-mono">
                  {batch.createdAt.split('T')[0]}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-amber-100">
                <span className="text-gray-500 block text-[10px] uppercase">Total Quantity</span>
                <span className="font-extrabold text-[#6B3F20]">
                  {batch.initialQuantityKg} kg
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-amber-100">
                <span className="text-gray-500 block text-[10px] uppercase">Packaging Units</span>
                <span className="font-bold text-gray-800">
                  {packagingRecord ? `${packagingRecord.totalUnitsPackaged} Jars` : 'Bulk / Storage'}
                </span>
              </div>
            </div>

            {/* Canonical Blockchain Record Box */}
            <div className="p-4 bg-gray-900 text-amber-300 rounded-2xl space-y-2 font-mono text-[11px]">
              <div className="flex items-center justify-between text-gray-400 font-sans text-xs">
                <span className="flex items-center space-x-1.5 font-bold text-white">
                  <Lock className="w-3.5 h-3.5 text-[#F4A623]" />
                  <span>BLOCKCHAIN IMMUTABILITY PROOF</span>
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">
                  Block #{batch.blockNumber}
                </span>
              </div>

              <div className="space-y-1 pt-1">
                <div className="text-gray-400 text-[10px]">CANONICAL STATE HASH:</div>
                <div className="break-all text-amber-200">{batch.canonicalHash}</div>

                <div className="text-gray-400 text-[10px] pt-1">TRANSACTION HASH:</div>
                <div className="break-all text-amber-400">{batch.onChainTxHash}</div>

                <div className="text-gray-400 text-[10px] pt-1">VERIFICATION NETWORK:</div>
                <div className="text-gray-300 font-sans">
                  Simulated Ethereum L2 (HoneyChain Testnet) • Mode: Simulated Demo
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Presentation Box */}
          <div className="bg-white rounded-2xl p-6 border border-amber-200 flex flex-col items-center justify-center text-center space-y-4">
            <h4 className="text-xs font-bold text-[#6B3F20] uppercase tracking-wider">
              Consumer Verification QR
            </h4>

            {qrDataUrl ? (
              <div className="p-3 bg-white rounded-2xl border border-amber-200 shadow-sm">
                <img
                  src={qrDataUrl}
                  alt={`QR code for ${batch.batchId}`}
                  className="w-44 h-44 mx-auto"
                />
              </div>
            ) : (
              <div className="w-44 h-44 bg-gray-100 rounded-2xl animate-pulse" />
            )}

            <div className="text-[11px] text-gray-500 font-mono">
              Resolves directly to public verification URL
            </div>
          </div>
        </div>
      </div>

      {/* Traceability Events Timeline */}
      <div className="cream-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="font-extrabold text-base text-[#6B3F20]">
            Complete Traceability Timeline
          </h3>
          <p className="text-xs text-gray-500">
            Append-only chronological history recorded by authorized supply chain participants
          </p>
        </div>

        <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-amber-200">
          {timelineEvents.map((event) => (
            <div key={event.id} className="relative flex items-start space-x-4 text-xs">
              <div className="w-7 h-7 rounded-full bg-[#6B3F20] text-amber-300 flex items-center justify-center font-bold text-xs shrink-0 z-10 shadow-sm">
                {event.actorRole === 'beekeeper' && '🐝'}
                {event.actorRole === 'laboratory' && '🔬'}
                {event.actorRole === 'processor' && '⚙️'}
                {event.actorRole === 'admin' && '🛡️'}
              </div>

              <div className="flex-1 bg-white p-4 rounded-2xl border border-amber-100 shadow-sm space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="font-bold text-sm text-[#6B3F20]">{event.eventTitle}</h4>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>

                <p className="text-gray-700 leading-relaxed">{event.eventDescription}</p>

                <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between text-[10px] text-gray-500 gap-2">
                  <span>
                    Actor: <strong className="text-gray-700">{event.actorName}</strong> ({event.actorRole})
                  </span>
                  <span className="font-mono text-gray-400">
                    Hash: {event.eventHash.substring(0, 14)}...
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
