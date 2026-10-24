'use client';

// =====================================================================================
// HONEY CHAIN — Beekeeper Operational Dashboard (/dashboard)
// Smart India Hackathon 2026 (SIH26021) — Team RUDRASCRIPT
// =====================================================================================

import React from 'react';
import Link from 'next/link';
import { useHoney } from '@/context/HoneyContext';
import {
  Hexagon,
  Boxes,
  Layers,
  Scale,
  Microscope,
  AlertTriangle,
  PlusCircle,
  QrCode,
  ArrowRight,
  Activity,
  CheckCircle2,
  Calendar,
  Sparkles,
  MapPin,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function BeekeeperDashboard() {
  const { state, currentUser } = useHoney();

  // Calculated Metrics from state records
  const totalHives = state.hives.length;
  const healthyHives = state.hives.filter((h) => h.status === 'healthy' || h.status === 'active').length;
  const totalHarvests = state.harvests.length;
  const totalProductionKg = state.harvests.reduce((sum, h) => sum + h.quantityKg, 0);
  const activeBatches = state.batches.length;
  const pendingQualityTests = state.batches.filter((b) => b.status === 'QualityTestingPending').length;
  const verifiedBatches = state.batches.filter((b) => b.status === 'QualityVerified' || b.status === 'ReadyForDistribution').length;
  const flaggedBatches = state.batches.filter((b) => b.status === 'RecalledOrFlagged').length;

  // Chart data from actual harvests
  const harvestTrends = state.harvests
    .map((h) => ({
      date: h.harvestDate,
      kg: h.quantityKg,
      flora: h.floraSource,
    }))
    .reverse();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#FFF9ED] via-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-amber-100 text-[#6B3F20] text-xs font-bold px-3 py-1 rounded-full border border-amber-300">
            <span>🐝</span>
            <span>Beekeeper Operations Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#6B3F20]">
            Welcome, {currentUser.fullName}
          </h1>
          <p className="text-xs text-gray-600 max-w-xl">
            {currentUser.organizationName || 'Apiary Operations Command'}. Track live hives, register harvests, trigger canonical blockchain hashes, and coordinate certified laboratory testing.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/harvests"
            className="inline-flex items-center space-x-1.5 bg-[#6B3F20] hover:bg-[#452410] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-[#F4A623]" />
            <span>Record Harvest</span>
          </Link>
          <Link
            href="/hives"
            className="inline-flex items-center space-x-1.5 bg-white hover:bg-amber-50 text-[#6B3F20] border border-amber-300 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <span>Manage Hives</span>
          </Link>
          <Link
            href="/verify"
            className="inline-flex items-center space-x-1.5 bg-amber-100 hover:bg-amber-200 text-[#6B3F20] border border-amber-300 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <QrCode className="w-4 h-4 text-[#6B3F20]" />
            <span>Verify QR</span>
          </Link>
        </div>
      </div>

      {/* Calculated Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Production */}
        <div className="cream-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Total Production</span>
            <Scale className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#6B3F20]">
            {totalProductionKg.toFixed(1)} <span className="text-sm font-semibold text-gray-500">kg</span>
          </div>
          <div className="text-[11px] text-emerald-700 flex items-center space-x-1 font-medium">
            <CheckCircle2 className="w-3 h-3" />
            <span>Across {totalHarvests} extractions</span>
          </div>
        </div>

        {/* Registered Hives */}
        <div className="cream-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Active Colonies</span>
            <Boxes className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#6B3F20]">
            {healthyHives} <span className="text-sm font-normal text-gray-500">/ {totalHives}</span>
          </div>
          <div className="text-[11px] text-gray-600">
            {state.hives.filter((h) => h.status === 'attention_required').length > 0 ? (
              <span className="text-amber-700 font-semibold">1 colony requires inspection</span>
            ) : (
              <span className="text-emerald-700 font-medium">All colonies in stable health</span>
            )}
          </div>
        </div>

        {/* Batches in Circulation */}
        <div className="cream-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Traceable Batches</span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#6B3F20]">
            {activeBatches}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">
            {verifiedBatches} lab verified & certified
          </div>
        </div>

        {/* Quality Testing Pending */}
        <div className="cream-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Lab Queue / Flags</span>
            <Microscope className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#6B3F20] flex items-baseline space-x-2">
            <span>{pendingQualityTests}</span>
            {flaggedBatches > 0 && (
              <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                {flaggedBatches} Flagged
              </span>
            )}
          </div>
          <div className="text-[11px] text-gray-600">
            {pendingQualityTests > 0 ? 'Awaiting certified test assay' : 'All batches processed'}
          </div>
        </div>
      </div>

      {/* Production Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Production Trends Chart */}
        <div className="lg:col-span-2 cream-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-[#6B3F20]">
                Harvest Extraction Yields (kg)
              </h3>
              <p className="text-xs text-gray-500">
                Calculated directly from verified apiary extractions
              </p>
            </div>
            <span className="text-[11px] bg-amber-100 text-[#6B3F20] font-bold px-2 py-0.5 rounded">
              SIH 2026 Telemetry
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={harvestTrends}>
                <defs>
                  <linearGradient id="honeyYield" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F4A623" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#F4A623" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="kg" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-md text-xs">
                          <p className="font-bold text-[#6B3F20]">{data.flora}</p>
                          <p className="text-amber-600 font-extrabold">{data.kg} kg</p>
                          <p className="text-gray-400 text-[10px]">{data.date}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="kg"
                  stroke="#6B3F20"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#honeyYield)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Apiary Colony Health Overview */}
        <div className="cream-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-[#6B3F20]">Hive Health Status</h3>
            <Link href="/hives" className="text-xs font-bold text-[#D97706] hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {state.hives.map((hive) => (
              <div
                key={hive.id}
                className="p-3 bg-white rounded-xl border border-amber-100 flex items-center justify-between hover:border-amber-300 transition-colors"
              >
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono font-bold text-xs text-[#6B3F20]">
                      {hive.hiveId}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
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
                  <div className="text-[11px] text-gray-500 mt-0.5 truncate max-w-[160px]">
                    {hive.species} ({hive.farmName.split(' ')[0]})
                  </div>
                </div>

                <div className="text-right text-xs">
                  <div className="font-extrabold text-[#6B3F20]">
                    {hive.currentWeightKg || '--'} <span className="text-[10px] font-normal text-gray-400">kg</span>
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {hive.currentTempC ? `${hive.currentTempC}°C` : '--'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/iot"
              className="w-full py-2 bg-amber-50 hover:bg-amber-100/70 text-[#6B3F20] text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 border border-amber-200 transition-colors"
            >
              <Activity className="w-3.5 h-3.5 text-[#F4A623]" />
              <span>Inspect Live IoT Telemetry</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Active Batches Table */}
      <div className="cream-card p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-[#6B3F20]">Active Honey Batches</h3>
            <p className="text-xs text-gray-500">
              Each batch is secured with a canonical SHA-256 hash and unique QR verification code
            </p>
          </div>
          <Link
            href="/batches"
            className="text-xs font-bold text-[#6B3F20] hover:text-[#D97706] flex items-center space-x-1"
          >
            <span>Manage Batches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-amber-50/70 text-[#6B3F20] uppercase font-bold text-[10px] tracking-wider border-b border-amber-200">
              <tr>
                <th className="py-3 px-3">Batch ID</th>
                <th className="py-3 px-3">Floral Variety</th>
                <th className="py-3 px-3">Harvested Quantity</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Blockchain Ref</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {state.batches.map((batch) => (
                <tr key={batch.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-[#6B3F20]">
                    {batch.batchId}
                  </td>
                  <td className="py-3 px-3 text-gray-700">{batch.variety}</td>
                  <td className="py-3 px-3 font-bold text-[#6B3F20]">
                    {batch.initialQuantityKg} kg
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
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
                      {batch.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-gray-500">
                    {batch.onChainTxHash ? `${batch.onChainTxHash.substring(0, 10)}...` : 'Pending'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      href={`/verify?id=${batch.batchId}`}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-[#D97706] hover:underline"
                    >
                      <span>Public Verify</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
