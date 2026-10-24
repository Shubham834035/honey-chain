'use client';

// =====================================================================================
// HONEY CHAIN — Harvest Extraction Management (/harvests)
// Smart India Hackathon 2026 (SIH26021) — Team RUDRASCRIPT
// =====================================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useHoney } from '@/context/HoneyContext';
import {
  Scale,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Boxes,
  Sparkles,
  X,
  Droplets,
} from 'lucide-react';

export default function HarvestsPage() {
  const router = useRouter();
  const { state, addHarvest, createBatch, currentUser } = useHoney();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creatingBatchId, setCreatingBatchId] = useState<string | null>(null);

  // Harvest Form State
  const [selectedHiveId, setSelectedHiveId] = useState(state.hives[0]?.id || '');
  const [quantityKg, setQuantityKg] = useState('');
  const [floraSource, setFloraSource] = useState('Wild Himalayan Mustard');
  const [harvestMethod, setHarvestMethod] = useState('Manual Uncapping & Cold Centrifugal Extraction');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [moistureFieldReading, setMoistureFieldReading] = useState('17.6');
  const [notes, setNotes] = useState('');

  const filteredHarvests = state.harvests.filter((h) => {
    return (
      h.harvestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.floraSource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.hiveCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.farmName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleCreateHarvest = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(quantityKg);
    if (isNaN(qty) || qty <= 0) {
      alert('Please enter a valid quantity greater than 0 kg.');
      return;
    }

    const hive = state.hives.find((h) => h.id === selectedHiveId) || state.hives[0];

    addHarvest({
      hiveId: hive.id,
      hiveCode: hive.hiveId,
      farmName: hive.farmName,
      beekeeperId: currentUser.id,
      beekeeperName: currentUser.fullName,
      harvestDate,
      quantityKg: qty,
      floraSource,
      harvestMethod,
      moistureFieldReading: parseFloat(moistureFieldReading) || 18.0,
      notes,
    });

    setIsModalOpen(false);
    setQuantityKg('');
    setNotes('');
  };

  const handleInitializeBatch = async (harvestId: string, flora: string, qty: number) => {
    setCreatingBatchId(harvestId);
    try {
      const batch = await createBatch(harvestId, flora, qty);
      router.push(`/batches`);
    } catch (err) {
      console.error(err);
      alert('Error creating batch');
    } finally {
      setCreatingBatchId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs text-amber-700 font-bold bg-amber-100 px-2.5 py-0.5 rounded-full mb-1">
            <Scale className="w-3.5 h-3.5" />
            <span>Apiary Extraction Ledger</span>
          </div>
          <h1 className="text-3xl font-black text-[#6B3F20]">Raw Honey Harvests</h1>
          <p className="text-xs text-gray-600">
            Log physical honey extractions, record refractometer moisture readings, and mint traceable batches.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-2 bg-[#6B3F20] hover:bg-[#452410] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-[#F4A623]" />
          <span>Record New Extraction</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="cream-card p-4 rounded-2xl flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Harvest ID, Floral Source, or Hive Code..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4A623] bg-white"
          />
        </div>
      </div>

      {/* Harvests Table */}
      <div className="cream-card rounded-2xl overflow-hidden border border-amber-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-amber-50/70 text-[#6B3F20] uppercase font-bold text-[10px] tracking-wider border-b border-amber-200">
              <tr>
                <th className="py-3.5 px-4">Harvest ID</th>
                <th className="py-3.5 px-4">Hive Code</th>
                <th className="py-3.5 px-4">Floral Source</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Quantity (kg)</th>
                <th className="py-3.5 px-4">Field Moisture</th>
                <th className="py-3.5 px-4">Batch Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {filteredHarvests.map((harvest) => (
                <tr key={harvest.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#6B3F20]">
                    {harvest.harvestId}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gray-700">
                    <span className="bg-amber-100/60 px-2 py-0.5 rounded text-[11px] font-bold">
                      {harvest.hiveCode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-gray-800">
                    {harvest.floraSource}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 font-mono text-[11px]">
                    {harvest.harvestDate}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-[#6B3F20]">
                    {harvest.quantityKg.toFixed(1)} kg
                  </td>
                  <td className="py-3.5 px-4">
                    {harvest.moistureFieldReading ? (
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          harvest.moistureFieldReading <= 20
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {harvest.moistureFieldReading}%
                      </span>
                    ) : (
                      '--'
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {harvest.isBatched ? (
                      <span className="inline-flex items-center space-x-1 text-emerald-700 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="font-mono">{harvest.batchId}</span>
                      </span>
                    ) : (
                      <span className="text-gray-400 italic text-[11px]">Unbatched Raw</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {harvest.isBatched ? (
                      <Link
                        href={`/verify?id=${harvest.batchId}`}
                        className="text-xs font-bold text-[#D97706] hover:underline"
                      >
                        View Verification
                      </Link>
                    ) : (
                      <button
                        onClick={() =>
                          handleInitializeBatch(harvest.id, harvest.floraSource, harvest.quantityKg)
                        }
                        disabled={creatingBatchId === harvest.id}
                        className="bg-[#6B3F20] hover:bg-[#452410] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm"
                      >
                        {creatingBatchId === harvest.id ? 'Minting...' : 'Create Batch'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Harvest Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-amber-200">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-[#6B3F20]">Record New Extraction</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHarvest} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Source Hive</label>
                <select
                  value={selectedHiveId}
                  onChange={(e) => setSelectedHiveId(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F4A623] bg-white font-mono"
                >
                  {state.hives.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.hiveId} — {h.species} ({h.farmName.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Extracted Quantity (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(e.target.value)}
                    placeholder="e.g. 42.5"
                    className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F4A623]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Field Moisture (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={moistureFieldReading}
                    onChange={(e) => setMoistureFieldReading(e.target.value)}
                    placeholder="e.g. 17.8"
                    className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F4A623]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Floral Blossom Source</label>
                <select
                  value={floraSource}
                  onChange={(e) => setFloraSource(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F4A623] bg-white"
                >
                  <option value="Wild Himalayan Mustard">Wild Himalayan Mustard (Brassica)</option>
                  <option value="Wild Himalayan White Clover">Wild Himalayan White Clover</option>
                  <option value="Sundarbans Khalsi & Mangrove Blossom">Sundarbans Khalsi & Mangrove Blossom</option>
                  <option value="Kashmir Acacia (Robinia)">Kashmir Acacia (Robinia)</option>
                  <option value="Eucalyptus Monofloral">Eucalyptus Monofloral</option>
                  <option value="Multifloral Forest Blend">Multifloral Forest Blend</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Extraction Method</label>
                <input
                  type="text"
                  value={harvestMethod}
                  onChange={(e) => setHarvestMethod(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F4A623]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Extraction Date</label>
                <input
                  type="date"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F4A623]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Field Observation Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. High comb sealing, bright golden hue, floral aroma."
                  className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F4A623]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6B3F20] text-white rounded-xl font-bold hover:bg-[#452410]"
                >
                  Save Extraction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
