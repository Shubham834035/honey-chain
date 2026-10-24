'use client';

// =====================================================================================
// HONEY CHAIN — Production & Traceability Analytics Hub (/analytics)
// Smart India Hackathon 2026 (SIH26021) — Team RUDRASCRIPT
// =====================================================================================

import React from 'react';
import Link from 'next/link';
import { useHoney } from '@/context/HoneyContext';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Layers,
  Award,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function AnalyticsPage() {
  const { state } = useHoney();

  // 1. Production by Variety
  const varietyTotals: Record<string, number> = {};
  state.harvests.forEach((h) => {
    const key = h.floraSource.split(' ')[0] + ' Honey';
    varietyTotals[key] = (varietyTotals[key] || 0) + h.quantityKg;
  });
  const varietyChartData = Object.keys(varietyTotals).map((v) => ({
    name: v,
    yieldKg: varietyTotals[v],
  }));

  // 2. Batch Status Breakdown
  const statusCounts: Record<string, number> = {
    Certified: 0,
    Packaged: 0,
    Pending: 0,
    Flagged: 0,
  };
  state.batches.forEach((b) => {
    if (b.status === 'QualityVerified') statusCounts.Certified += 1;
    else if (b.status === 'ReadyForDistribution' || b.status === 'Packaged') statusCounts.Packaged += 1;
    else if (b.status === 'QualityTestingPending' || b.status === 'Harvested') statusCounts.Pending += 1;
    else if (b.status === 'RecalledOrFlagged') statusCounts.Flagged += 1;
  });

  const pieData = [
    { name: 'Quality Certified', value: statusCounts.Certified, color: '#10B981' },
    { name: 'Packaged / Ready', value: statusCounts.Packaged, color: '#3B82F6' },
    { name: 'Testing In Progress', value: statusCounts.Pending, color: '#F59E0B' },
    { name: 'Flagged / Recalled', value: statusCounts.Flagged, color: '#EF4444' },
  ].filter((d) => d.value > 0);

  // 3. Extraction Yield by Hive
  const hiveYields = state.hives.map((hive) => {
    const harvests = state.harvests.filter((h) => h.hiveCode === hive.hiveId);
    const totalKg = harvests.reduce((sum, h) => sum + h.quantityKg, 0);
    return {
      hive: hive.hiveId,
      yield: totalKg,
      farm: hive.farmName.split(' ')[0],
    };
  });

  const totalKg = state.harvests.reduce((sum, h) => sum + h.quantityKg, 0);
  const totalTests = state.qualityTests.length;
  const passedTests = state.qualityTests.filter((t) => t.passedRegulatoryStandard).length;
  const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(0) : '100';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs text-amber-700 font-bold bg-amber-100 px-2.5 py-0.5 rounded-full mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Supply Chain Intelligence</span>
          </div>
          <h1 className="text-3xl font-black text-[#6B3F20]">Analytics & Production Insights</h1>
          <p className="text-xs text-gray-600">
            Real-time analytics computed directly from apiary harvests, laboratory testing assays, and blockchain milestones.
          </p>
        </div>

        <div className="bg-white px-3 py-1.5 rounded-xl border border-amber-200 text-xs text-gray-600">
          <span className="text-[10px] text-gray-400 block uppercase">Telemetry Basis:</span>
          <span className="font-bold text-[#6B3F20]">Verified Production Records</span>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cream-card p-5 rounded-2xl space-y-1">
          <span className="text-xs text-gray-500">Cumulative Production</span>
          <div className="text-3xl font-black text-[#6B3F20]">{totalKg.toFixed(1)} kg</div>
          <span className="text-[11px] text-emerald-700 font-medium">100% Traceable</span>
        </div>

        <div className="cream-card p-5 rounded-2xl space-y-1">
          <span className="text-xs text-gray-500">Laboratory Pass Rate</span>
          <div className="text-3xl font-black text-[#6B3F20]">{passRate}%</div>
          <span className="text-[11px] text-gray-600">{passedTests} of {totalTests} passed standards</span>
        </div>

        <div className="cream-card p-5 rounded-2xl space-y-1">
          <span className="text-xs text-gray-500">Traceability Events</span>
          <div className="text-3xl font-black text-[#6B3F20]">{state.traceabilityEvents.length}</div>
          <span className="text-[11px] text-blue-700 font-medium">Hashed & Committed</span>
        </div>

        <div className="cream-card p-5 rounded-2xl space-y-1">
          <span className="text-xs text-gray-500">Active Supply Nodes</span>
          <div className="text-3xl font-black text-[#6B3F20]">{state.users.length}</div>
          <span className="text-[11px] text-gray-600">Producers, Labs, Packers</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Variety Yield Bar Chart */}
        <div className="cream-card p-6 rounded-3xl space-y-4">
          <h3 className="font-extrabold text-base text-[#6B3F20]">
            Honey Yield by Floral Source (kg)
          </h3>
          <p className="text-xs text-gray-500">
            Total kilograms harvested across distinct botanical sources
          </p>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={varietyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="kg" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-sm text-xs">
                          <p className="font-bold text-[#6B3F20]">{payload[0].payload.name}</p>
                          <p className="text-amber-700 font-bold">{payload[0].value} kg</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="yieldKg" fill="#F4A623" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Batch Status Distribution Pie Chart */}
        <div className="cream-card p-6 rounded-3xl space-y-4">
          <h3 className="font-extrabold text-base text-[#6B3F20]">
            Batch Lifecycle Distribution
          </h3>
          <p className="text-xs text-gray-500">
            Current verification status of all registered batches
          </p>

          <div className="h-64 w-full pt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-2.5 rounded-xl border border-gray-200 shadow-sm text-xs">
                          <p className="font-bold" style={{ color: data.color }}>
                            {data.name}
                          </p>
                          <p className="text-gray-600">{data.value} Batches</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Yield by Hive Table */}
      <div className="cream-card p-6 rounded-3xl space-y-4">
        <h3 className="font-extrabold text-base text-[#6B3F20]">
          Hive Colony Productivity Overview
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {hiveYields.map((hy) => (
            <div key={hy.hive} className="p-4 bg-white rounded-2xl border border-amber-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-[#6B3F20]">{hy.hive}</span>
                <span className="text-[10px] text-gray-400">{hy.farm}</span>
              </div>
              <div className="text-2xl font-black text-[#6B3F20]">{hy.yield.toFixed(1)} kg</div>
              <div className="text-[11px] text-gray-500">Total extracted yield</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
