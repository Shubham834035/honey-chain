'use client';

// =====================================================================================
// HONEY CHAIN — Batch Ledger Management (/batches)
// Smart India Hackathon 2026 (SIH26021) — Team RUDRASCRIPT
// =====================================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useHoney } from '@/context/HoneyContext';
import {
  Layers,
  Search,
  Filter,
  QrCode,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function BatchesPage() {
  const { state } = useHoney();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredBatches = state.batches.filter((b) => {
    const matchesSearch =
      b.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.beekeeperName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.locationSummary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs text-amber-700 font-bold bg-amber-100 px-2.5 py-0.5 rounded-full mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Cryptographic State Ledger</span>
          </div>
          <h1 className="text-3xl font-black text-[#6B3F20]">Honey Batches</h1>
          <p className="text-xs text-gray-600">
            Lifecycle traceability records secured with canonical SHA-256 hashes and verifiable QR endpoints.
          </p>
        </div>

        <Link
          href="/harvests"
          className="inline-flex items-center space-x-2 bg-[#6B3F20] hover:bg-[#452410] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <span>Create Batch from Harvest</span>
          <ArrowRight className="w-4 h-4 text-[#F4A623]" />
        </Link>
      </div>

      {/* Filters */}
      <div className="cream-card p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Batch ID, Variety, Producer, or Region..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4A623] bg-white"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-amber-700 shrink-0" />
          <span className="text-xs text-gray-500">Lifecycle Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-gray-200 rounded-xl px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F4A623]"
          >
            <option value="all">All Batches ({state.batches.length})</option>
            <option value="Harvested">Harvested</option>
            <option value="QualityTestingPending">Testing Pending</option>
            <option value="QualityVerified">Quality Verified</option>
            <option value="Processing">Processing</option>
            <option value="Packaged">Packaged</option>
            <option value="ReadyForDistribution">Ready for Distribution</option>
            <option value="RecalledOrFlagged">Recalled / Flagged</option>
          </select>
        </div>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBatches.map((batch) => {
          const qualityTest = state.qualityTests.find((t) => t.batchId === batch.id);
          const packagingRecord = state.packagingRecords.find((p) => p.batchId === batch.id);

          return (
            <div
              key={batch.id}
              className="cream-card rounded-3xl p-6 space-y-5 hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header row */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-base font-extrabold text-[#6B3F20]">
                      {batch.batchId}
                    </span>
                    <h3 className="font-bold text-sm text-gray-900 mt-0.5 leading-snug">
                      {batch.variety}
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                      batch.status === 'QualityVerified'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : batch.status === 'ReadyForDistribution'
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : batch.status === 'QualityTestingPending'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : batch.status === 'RecalledOrFlagged'
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {batch.status}
                  </span>
                </div>

                {/* Batch Information Grid */}
                <div className="bg-white rounded-2xl p-4 border border-amber-100 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Producer:</span>
                    <span className="font-bold text-gray-800">{batch.beekeeperName}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Origin:</span>
                    <span className="font-medium text-gray-700">{batch.locationSummary}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Batch Quantity:</span>
                    <span className="font-extrabold text-[#6B3F20]">
                      {batch.initialQuantityKg} kg
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Packaging:</span>
                    <span className="font-medium text-gray-800">
                      {packagingRecord
                        ? `${packagingRecord.totalUnitsPackaged} x ${packagingRecord.unitSizeGrams}g`
                        : 'Bulk / Pre-packaging'}
                    </span>
                  </div>
                  {qualityTest && (
                    <div className="flex justify-between text-gray-500 pt-1 border-t border-gray-100">
                      <span>Lab Moisture:</span>
                      <span
                        className={`font-bold ${
                          qualityTest.moisturePercentage <= 20
                            ? 'text-emerald-700'
                            : 'text-red-700'
                        }`}
                      >
                        {qualityTest.moisturePercentage}% ({qualityTest.passedRegulatoryStandard ? 'Passed' : 'Failed'})
                      </span>
                    </div>
                  )}
                </div>

                {/* Canonical Hash Display */}
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-[10px] font-mono space-y-1">
                  <div className="text-gray-400 flex items-center justify-between">
                    <span>CANONICAL STATE HASH</span>
                    <span className="text-[9px] text-emerald-700 font-bold">SHA-256</span>
                  </div>
                  <div className="text-gray-700 truncate" title={batch.canonicalHash}>
                    {batch.canonicalHash}
                  </div>
                </div>

                {batch.flagReason && (
                  <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-800 text-xs flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                    <span className="text-[11px] leading-tight font-medium">
                      {batch.flagReason}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-amber-100 flex items-center justify-between">
                <Link
                  href={`/batches/${batch.batchId}`}
                  className="text-xs font-bold text-[#6B3F20] hover:text-[#D97706] transition-colors"
                >
                  Inspect Batch Details
                </Link>

                <Link
                  href={`/verify?id=${batch.batchId}`}
                  className="inline-flex items-center space-x-1.5 bg-[#F4A623] hover:bg-amber-500 text-[#452410] text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Public Verify</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
