'use client';

// =====================================================================================
// HONEY CHAIN — Processing & Packaging Portal (/processing)
// Smart India Hackathon 2026 (SIH26021) — Team RUDRASCRIPT
// =====================================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useHoney } from '@/context/HoneyContext';
import {
  Factory,
  Package,
  Layers,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter,
  X,
} from 'lucide-react';

export default function ProcessingPage() {
  const { state, currentUser, switchRole, recordProcessingAndPackaging } = useHoney();

  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [processType, setProcessType] = useState<'cold_settling' | 'gentle_microfiltration' | 'raw_unheated'>('cold_settling');
  const [maxTemperatureCelsius, setMaxTemperatureCelsius] = useState('38.0');
  const [filterMeshSize, setFilterMeshSize] = useState('80 Mesh Stainless Screen (Pollen Retaining)');
  const [facilityLocation, setFacilityLocation] = useState('Ahmedabad Agro-Processing Park, Gujarat');
  const [packageType, setPackageType] = useState<'Food-Grade Glass Jar' | 'Recyclable Squeeze Bottle' | 'Tin Canister'>('Food-Grade Glass Jar');
  const [unitSizeGrams, setUnitSizeGrams] = useState(500);
  const [lotNumber, setLotNumber] = useState(`LOT-2026-APX-${Math.floor(100 + Math.random() * 900)}`);
  const [bestBeforeDate, setBestBeforeDate] = useState('2028-04-15');
  const [tamperEvidentSealId, setTamperEvidentSealId] = useState(`SEAL-APX-${Math.floor(100000 + Math.random() * 900000)}`);
  const [notes, setNotes] = useState('');

  // Target batch
  const targetBatch = state.batches.find((b) => b.id === selectedBatchId || b.batchId === selectedBatchId);

  // Eligible batches for processing (QualityVerified or Processing)
  const eligibleBatches = state.batches.filter(
    (b) => b.status === 'QualityVerified' || b.status === 'Processing'
  );

  const completedProcessing = state.processingEvents;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBatch) return;

    setSubmitting(true);
    setSuccess(false);

    const inputQty = targetBatch.remainingQuantityKg || targetBatch.initialQuantityKg;
    const units = Math.floor((inputQty * 1000) / unitSizeGrams);

    try {
      await recordProcessingAndPackaging(targetBatch.id, {
        processorId: currentUser.id,
        processorName: currentUser.organizationName || 'Apex Cold-Extracted Processing & Packaging Ltd.',
        processType,
        inputQuantityKg: inputQty,
        outputQuantityKg: inputQty,
        maxTemperatureCelsius: parseFloat(maxTemperatureCelsius) || 38.0,
        filterMeshSize,
        processDate: new Date().toISOString().split('T')[0],
        facilityLocation,
        packagingLotNumber: lotNumber,
        packageType,
        unitSizeGrams,
        totalUnitsPackaged: units,
        bestBeforeDate,
        tamperEvidentSealId,
        notes: notes || 'Cold-extracted under controlled parameters to preserve raw enzymes, diastase activity, and beneficial bee pollen.',
      });

      setSuccess(true);
      setTimeout(() => {
        setSelectedBatchId(null);
        setSuccess(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      alert('Error recording processing & packaging');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Role Switcher if not currently in Processor Persona */}
      {currentUser.role !== 'processor' && (
        <div className="bg-amber-100 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#F4A623] shrink-0" />
            <span className="text-[#6B3F20]">
              You are currently viewing as <strong>{currentUser.fullName} ({currentUser.role})</strong>. To execute authorized packaging operations, switch to the Processor persona.
            </span>
          </div>
          <button
            onClick={() => switchRole('processor')}
            className="px-3 py-1.5 bg-[#6B3F20] hover:bg-[#452410] text-white font-bold rounded-xl transition-all shrink-0"
          >
            Switch to Vikram Patel (Processor)
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs text-blue-800 font-bold bg-blue-100 px-2.5 py-0.5 rounded-full mb-1">
            <Factory className="w-3.5 h-3.5" />
            <span>Bottling & Packaging Hub</span>
          </div>
          <h1 className="text-3xl font-black text-[#6B3F20]">Processing & Packaging</h1>
          <p className="text-xs text-gray-600">
            Log temperature-controlled straining, generate packaging lot codes, and link tamper-evident seals.
          </p>
        </div>
      </div>

      {/* Grid: Eligible Batches & Packaging Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Batches Eligible for Bottling */}
        <div className="lg:col-span-1 cream-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-[#6B3F20]">Eligible Batches</h3>
            <span className="text-[11px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
              {eligibleBatches.length} Verified
            </span>
          </div>

          <p className="text-xs text-gray-500">
            Only batches that have fully passed laboratory testing can be processed and bottled.
          </p>

          <div className="space-y-3">
            {eligibleBatches.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">
                No verified batches awaiting bottling. Test a batch in the Quality Lab first.
              </div>
            ) : (
              eligibleBatches.map((batch) => (
                <div
                  key={batch.id}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedBatchId === batch.id
                      ? 'border-[#F4A623] bg-amber-50 shadow-sm'
                      : 'border-amber-100 bg-white hover:border-amber-300'
                  }`}
                  onClick={() => setSelectedBatchId(batch.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-[#6B3F20]">
                      {batch.batchId}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      {batch.status}
                    </span>
                  </div>

                  <div className="font-bold text-xs text-gray-800 mt-1">{batch.variety}</div>
                  <div className="text-[11px] text-gray-500">
                    {batch.initialQuantityKg} kg available for bottling
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                    <span className="text-gray-400 font-mono">From {batch.beekeeperName}</span>
                    <span className="text-[#D97706] font-bold flex items-center space-x-1">
                      <span>Package Lot</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Packaging Form */}
        <div className="lg:col-span-2 cream-card p-6 sm:p-8 rounded-3xl space-y-6">
          {!targetBatch ? (
            <div className="py-20 text-center space-y-3">
              <Package className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="text-lg font-bold text-[#6B3F20]">Select an Eligible Batch</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Select a lab-verified batch from the list to record cold extraction straining, jar units, and tamper seals.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-amber-100">
                <div>
                  <div className="text-xs font-mono font-bold text-blue-700">
                    PACKAGING BATCH: {targetBatch.batchId}
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mt-0.5">
                    {targetBatch.variety}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Input Bulk: {targetBatch.remainingQuantityKg || targetBatch.initialQuantityKg} kg from {targetBatch.locationSummary}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedBatchId(null)}
                  className="text-gray-400 hover:text-gray-600 text-xs"
                >
                  Clear Selection
                </button>
              </div>

              {success && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="block font-bold">Packaging & Sealed Lot Recorded!</strong>
                    <span>Batch status elevated to ReadyForDistribution. Consumer verification QR activated.</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Processing Parameters */}
                <div className="p-4 bg-white rounded-2xl border border-amber-100 space-y-3">
                  <span className="font-extrabold text-[#6B3F20] uppercase tracking-wider block text-[11px]">
                    1. Processing & Filtration Parameters
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-600 mb-1">Process Method</label>
                      <select
                        value={processType}
                        onChange={(e: any) => setProcessType(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-xl bg-white"
                      >
                        <option value="cold_settling">Cold Settling & Coarse Straining (&lt; 40°C)</option>
                        <option value="gentle_microfiltration">Gentle Microfiltration</option>
                        <option value="raw_unheated">Raw Completely Unheated</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-600 mb-1">
                        Max Controlled Temperature (°C) — <span className="text-gray-400">Must be &le; 40°C</span>
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={maxTemperatureCelsius}
                        onChange={(e) => setMaxTemperatureCelsius(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-600 mb-1">Filter Mesh Specification</label>
                    <input
                      type="text"
                      value={filterMeshSize}
                      onChange={(e) => setFilterMeshSize(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-xl"
                    />
                  </div>
                </div>

                {/* Packaging & Lot Identifiers */}
                <div className="p-4 bg-white rounded-2xl border border-amber-100 space-y-3">
                  <span className="font-extrabold text-[#6B3F20] uppercase tracking-wider block text-[11px]">
                    2. Retail Packaging & Tamper Seal
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-gray-600 mb-1">Container Type</label>
                      <select
                        value={packageType}
                        onChange={(e: any) => setPackageType(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-xl bg-white"
                      >
                        <option value="Food-Grade Glass Jar">Food-Grade Glass Jar</option>
                        <option value="Recyclable Squeeze Bottle">Recyclable Squeeze Bottle</option>
                        <option value="Tin Canister">Tin Canister</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-600 mb-1">Unit Weight</label>
                      <select
                        value={unitSizeGrams}
                        onChange={(e) => setUnitSizeGrams(Number(e.target.value))}
                        className="w-full p-2 border border-gray-200 rounded-xl bg-white"
                      >
                        <option value={250}>250 grams</option>
                        <option value={500}>500 grams</option>
                        <option value={1000}>1,000 grams (1 kg)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-600 mb-1">Packaging Lot Number</label>
                      <input
                        type="text"
                        required
                        value={lotNumber}
                        onChange={(e) => setLotNumber(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-xl font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-gray-600 mb-1">Tamper-Evident Seal ID</label>
                      <input
                        type="text"
                        required
                        value={tamperEvidentSealId}
                        onChange={(e) => setTamperEvidentSealId(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-xl font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-600 mb-1">Best Before Date</label>
                      <input
                        type="date"
                        value={bestBeforeDate}
                        onChange={(e) => setBestBeforeDate(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-[#6B3F20] hover:bg-[#452410] text-white font-bold rounded-xl shadow-sm transition-all flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Package className="w-4 h-4 text-[#F4A623]" />
                    <span>{submitting ? 'Recording On-Chain...' : 'Complete Packaging & Bottling'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
