'use client';

// =====================================================================================
// HONEY CHAIN — Regulatory & Administrative Oversight (/admin)
// Smart India Hackathon 2026 (SIH26021) — Team RUDRASCRIPT
// =====================================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useHoney } from '@/context/HoneyContext';
import {
  ShieldAlert,
  Users,
  Layers,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  Lock,
  Search,
  FileText,
  Activity,
} from 'lucide-react';

export default function AdminPage() {
  const { state, currentUser, switchRole, resetDemoData, flagBatch } = useHoney();

  const [activeTab, setActiveTab] = useState<'batches' | 'users' | 'audit'>('batches');
  const [flagModalBatchId, setFlagModalBatchId] = useState<string | null>(null);
  const [flagReason, setFlagReason] = useState('');

  const flaggedBatches = state.batches.filter((b) => b.status === 'RecalledOrFlagged');

  const handleExecuteFlag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagModalBatchId || !flagReason) return;

    flagBatch(flagModalBatchId, flagReason);
    setFlagModalBatchId(null);
    setFlagReason('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Role Switcher if not currently in Admin Persona */}
      {currentUser.role !== 'admin' && (
        <div className="bg-amber-100 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#F4A623] shrink-0" />
            <span className="text-[#6B3F20]">
              You are currently viewing as <strong>{currentUser.fullName} ({currentUser.role})</strong>. For regulatory command tools, switch to the Admin persona.
            </span>
          </div>
          <button
            onClick={() => switchRole('admin')}
            className="px-3 py-1.5 bg-[#6B3F20] hover:bg-[#452410] text-white font-bold rounded-xl transition-all shrink-0"
          >
            Switch to Devendra Rao (Admin)
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs text-red-800 font-bold bg-red-100 px-2.5 py-0.5 rounded-full mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            <span>National Traceability Authority</span>
          </div>
          <h1 className="text-3xl font-black text-[#6B3F20]">Platform Administration & Oversight</h1>
          <p className="text-xs text-gray-600">
            Monitor stakeholder registrations, manage flagged recall directives, and inspect blockchain event audits.
          </p>
        </div>

        {/* Reset Demo Button */}
        <button
          onClick={() => {
            if (confirm('Reset prototype demo state to initial dataset?')) {
              resetDemoData();
            }
          }}
          className="inline-flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <RotateCcw className="w-4 h-4 text-red-600" />
          <span>Reset Demo Environment</span>
        </button>
      </div>

      {/* System Health Status Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cream-card p-5 rounded-2xl space-y-1">
          <span className="text-xs text-gray-500">Total Registered Users</span>
          <div className="text-3xl font-black text-[#6B3F20]">{state.users.length}</div>
          <span className="text-[11px] text-emerald-700 font-medium">All KYC Verified</span>
        </div>

        <div className="cream-card p-5 rounded-2xl space-y-1">
          <span className="text-xs text-gray-500">Tracked Batches</span>
          <div className="text-3xl font-black text-[#6B3F20]">{state.batches.length}</div>
          <span className="text-[11px] text-gray-600">Active in Supply Chain</span>
        </div>

        <div className="cream-card p-5 rounded-2xl space-y-1">
          <span className="text-xs text-gray-500">Flagged / Recalled</span>
          <div className="text-3xl font-black text-red-600">{flaggedBatches.length}</div>
          <span className="text-[11px] text-red-700 font-medium">Distribution Locked</span>
        </div>

        <div className="cream-card p-5 rounded-2xl space-y-1">
          <span className="text-xs text-gray-500">Blockchain Sync</span>
          <div className="text-3xl font-black text-emerald-700">100%</div>
          <span className="text-[11px] text-gray-500">Simulated L2 Proofs</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-amber-200 pb-2">
        <button
          onClick={() => setActiveTab('batches')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'batches'
              ? 'bg-[#6B3F20] text-white shadow-sm'
              : 'text-gray-600 hover:bg-amber-100/60'
          }`}
        >
          Batch Oversight & Flagging
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users'
              ? 'bg-[#6B3F20] text-white shadow-sm'
              : 'text-gray-600 hover:bg-amber-100/60'
          }`}
        >
          Stakeholder Directory ({state.users.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'audit'
              ? 'bg-[#6B3F20] text-white shadow-sm'
              : 'text-gray-600 hover:bg-amber-100/60'
          }`}
        >
          Traceability Ledger Audit ({state.traceabilityEvents.length})
        </button>
      </div>

      {/* Tab 1: Batch Oversight & Recalls */}
      {activeTab === 'batches' && (
        <div className="cream-card rounded-2xl overflow-hidden border border-amber-200">
          <div className="p-4 bg-amber-50/50 border-b border-amber-200 flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B3F20]">Batch Registry Oversight</span>
            <span className="text-xs text-gray-500">Authorized administrative recall interface</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-amber-50/70 text-[#6B3F20] uppercase font-bold text-[10px] tracking-wider border-b border-amber-200">
                <tr>
                  <th className="py-3.5 px-4">Batch ID</th>
                  <th className="py-3.5 px-4">Variety</th>
                  <th className="py-3.5 px-4">Producer</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Flag / Recall Details</th>
                  <th className="py-3.5 px-4 text-right">Administrative Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {state.batches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#6B3F20]">{batch.batchId}</td>
                    <td className="py-3.5 px-4 text-gray-800">{batch.variety}</td>
                    <td className="py-3.5 px-4 text-gray-600">{batch.beekeeperName}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          batch.status === 'RecalledOrFlagged'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {batch.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 max-w-xs truncate">
                      {batch.flagReason || <span className="text-gray-300 italic">None</span>}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {batch.status === 'RecalledOrFlagged' ? (
                        <span className="text-red-700 font-bold text-[11px]">Recalled</span>
                      ) : (
                        <button
                          onClick={() => setFlagModalBatchId(batch.id)}
                          className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-[11px] font-bold rounded-lg transition-colors"
                        >
                          Flag / Recall
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Stakeholder Directory */}
      {activeTab === 'users' && (
        <div className="cream-card rounded-2xl overflow-hidden border border-amber-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-amber-50/70 text-[#6B3F20] uppercase font-bold text-[10px] tracking-wider border-b border-amber-200">
                <tr>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Organization</th>
                  <th className="py-3.5 px-4">License / Reg. ID</th>
                  <th className="py-3.5 px-4">Wallet Address</th>
                  <th className="py-3.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {state.users.map((u) => (
                  <tr key={u.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900">{u.fullName}</td>
                    <td className="py-3.5 px-4">
                      <span className="capitalize font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-700">{u.organizationName || '--'}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-gray-600">{u.licenseNumber || '--'}</td>
                    <td className="py-3.5 px-4 font-mono text-[10px] text-gray-400">
                      {u.walletAddress ? `${u.walletAddress.substring(0, 10)}...` : '--'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-emerald-700 font-bold text-[11px] flex items-center justify-end space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Traceability Ledger Audit */}
      {activeTab === 'audit' && (
        <div className="cream-card rounded-2xl overflow-hidden border border-amber-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-amber-50/70 text-[#6B3F20] uppercase font-bold text-[10px] tracking-wider border-b border-amber-200">
                <tr>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Event Type</th>
                  <th className="py-3.5 px-4">Event Title</th>
                  <th className="py-3.5 px-4">Actor</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4 text-right">Cryptographic Event Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {state.traceabilityEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[10px] text-gray-500">
                      {new Date(evt.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">
                        {evt.eventType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-800">{evt.eventTitle}</td>
                    <td className="py-3.5 px-4 text-gray-600">{evt.actorName} ({evt.actorRole})</td>
                    <td className="py-3.5 px-4 text-gray-500">{evt.locationSummary}</td>
                    <td className="py-3.5 px-4 font-mono text-[10px] text-gray-400 text-right">
                      {evt.eventHash ? `${evt.eventHash.substring(0, 16)}...` : '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Administrative Flag / Recall Modal */}
      {flagModalBatchId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-red-300">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-extrabold text-base">Issue Regulatory Batch Recall</h3>
            </div>

            <p className="text-xs text-gray-600">
              Issuing a recall will immediately freeze the batch status to <strong>RecalledOrFlagged</strong>, update the public verification portal to display a safety breach warning, and append an immutable event to the blockchain ledger.
            </p>

            <form onSubmit={handleExecuteFlag} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Regulatory Recall Mandate & Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  placeholder="e.g. Audit detected moisture standard violation (23.4%) or suspect pollen adulteration."
                  className="w-full p-2.5 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFlagModalBatchId(null)}
                  className="px-3 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Confirm Recall Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
