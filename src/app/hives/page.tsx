'use client';

// =====================================================================================
// HONEY CHAIN — Hive & Colony Management (/hives)
// Smart India Hackathon 2026 (SIH26021) — Team RUDRASCRIPT
// =====================================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useHoney } from '@/context/HoneyContext';
import { Hive, HiveStatus } from '@/types';
import {
  Boxes,
  Plus,
  Search,
  Filter,
  Activity,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  X,
} from 'lucide-react';

export default function HivesPage() {
  const { state, addHive, currentUser } = useHoney();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [hiveId, setHiveId] = useState('');
  const [farmName, setFarmName] = useState(state.farms[0]?.name || 'Himalayan Apiary');
  const [species, setSpecies] = useState('Apis cerana indica');
  const [hiveType, setHiveType] = useState('Langstroth Standard');
  const [queenYear, setQueenYear] = useState(new Date().getFullYear());
  const [status, setStatus] = useState<HiveStatus>('healthy');
  const [installationDate, setInstallationDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const filteredHives = state.hives.filter((h) => {
    const matchesSearch =
      h.hiveId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.farmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.species.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || h.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateHive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hiveId) return;

    addHive({
      hiveId: hiveId.toUpperCase(),
      farmId: state.farms[0]?.id || 'farm-1',
      farmName,
      hiveType,
      species,
      queenYear: Number(queenYear),
      status,
      installationDate,
      notes,
      currentWeightKg: 36.5,
      currentTempC: 34.8,
      currentHumidity: 60,
    });

    setIsModalOpen(false);
    setHiveId('');
    setNotes('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs text-amber-700 font-bold bg-amber-100 px-2.5 py-0.5 rounded-full mb-1">
            <Boxes className="w-3.5 h-3.5" />
            <span>Colony Infrastructure</span>
          </div>
          <h1 className="text-3xl font-black text-[#6B3F20]">Registered Hives & Colonies</h1>
          <p className="text-xs text-gray-600">
            Monitor bee colonies, queen lineage, telemetry sensors, and extraction readiness.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-2 bg-[#6B3F20] hover:bg-[#452410] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-[#F4A623]" />
          <span>Register New Hive</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="cream-card p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Hive ID, Farm, or Species..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4A623] bg-white"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-amber-700 shrink-0" />
          <span className="text-xs text-gray-500">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs border border-gray-200 rounded-xl px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F4A623]"
          >
            <option value="all">All Statuses ({state.hives.length})</option>
            <option value="healthy">Healthy</option>
            <option value="active">Active</option>
            <option value="attention_required">Attention Required</option>
          </select>
        </div>
      </div>

      {/* Hive Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHives.map((hive) => {
          const associatedHarvests = state.harvests.filter((h) => h.hiveCode === hive.hiveId);
          return (
            <div
              key={hive.id}
              className="cream-card rounded-2xl p-6 space-y-4 hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-base font-extrabold text-[#6B3F20]">
                      {hive.hiveId}
                    </span>
                    <div className="text-xs font-semibold text-gray-700 mt-0.5">
                      {hive.farmName}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      hive.status === 'healthy'
                        ? 'bg-emerald-100 text-emerald-800'
                        : hive.status === 'active'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {hive.status.toUpperCase()}
                  </span>
                </div>

                <div className="bg-white rounded-xl p-3 border border-amber-100/80 space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Species:</span>
                    <span className="font-medium italic text-gray-800">{hive.species}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Box Design:</span>
                    <span className="font-medium text-gray-800">{hive.hiveType}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Queen Lineage:</span>
                    <span className="font-medium text-gray-800">{hive.queenYear} Queen</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Installed:</span>
                    <span className="font-medium text-gray-800">{hive.installationDate}</span>
                  </div>
                </div>

                {hive.notes && (
                  <p className="text-xs text-gray-600 italic bg-amber-50/40 p-2.5 rounded-lg border border-amber-100/50">
                    "{hive.notes}"
                  </p>
                )}
              </div>

              {/* Bottom Metrics & Actions */}
              <div className="pt-3 border-t border-amber-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3 text-gray-600">
                  <span className="font-bold text-[#6B3F20]">
                    {hive.currentWeightKg || '--'} kg
                  </span>
                  <span className="text-gray-400">|</span>
                  <span>{associatedHarvests.length} Extractions</span>
                </div>

                <Link
                  href="/harvests"
                  className="font-bold text-[#D97706] hover:underline flex items-center space-x-1"
                >
                  <span>Harvest</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Register Hive Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-amber-200">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-[#6B3F20]">Register New Hive</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHive} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Hive Identifier (Code) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={hiveId}
                  onChange={(e) => setHiveId(e.target.value)}
                  placeholder="e.g. HIV-HP-003 or HIV-KA-012"
                  className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F4A623]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Apiary Farm</label>
                <select
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F4A623] bg-white"
                >
                  {state.farms.map((f) => (
                    <option key={f.id} value={f.name}>
                      {f.name} ({f.district}, {f.state})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Bee Species</label>
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F4A623] bg-white"
                  >
                    <option value="Apis cerana indica">Apis cerana indica (Indian)</option>
                    <option value="Apis mellifera">Apis mellifera (European)</option>
                    <option value="Tetragonula iridipennis">Stingless Dammer Bee</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Queen Lineage Year</label>
                  <input
                    type="number"
                    value={queenYear}
                    onChange={(e) => setQueenYear(Number(e.target.value))}
                    className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F4A623]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Colony Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as HiveStatus)}
                    className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F4A623] bg-white"
                  >
                    <option value="healthy">Healthy</option>
                    <option value="active">Active</option>
                    <option value="attention_required">Attention Required</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Installation Date</label>
                  <input
                    type="date"
                    value={installationDate}
                    onChange={(e) => setInstallationDate(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F4A623]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Colony Field Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. High nectar flow from mustard blossom. Foraging actively."
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
                  Save & Register Hive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
