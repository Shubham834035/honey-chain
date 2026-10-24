'use client';

// =====================================================================================
// HONEY CHAIN — Quality Laboratory Testing Portal (/lab)
// Smart India Hackathon 2026 (SIH26021) — Team RUDRASCRIPT
// =====================================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useHoney } from '@/context/HoneyContext';
import {
  Microscope,
  Award,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  X,
  Droplets,
  FlaskConical,
} from 'lucide-react';

export default function LabPortalPage() {
  const { state, currentUser, switchRole, submitQualityTest } = useHoney();

  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  // Form State
  const [testReportId, setTestReportId] = useState(`NHTL-PUN-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [moisturePercentage, setMoisturePercentage] = useState('18.2');
  const [hmfMgPerKg, setHmfMgPerKg] = useState('16.4');
  const [reducingSugarsPercentage, setReducingSugarsPercentage] = useState('72.5');
  const [sucrosePercentage, setSucrosePercentage] = useState('2.1');
  const [pollenCountDominant, setPollenCountDominant] = useState('Trifolium repens (White Clover) 74%');
  const [c4SugarAdulteration, setC4SugarAdulteration] = useState(false);
  const [antibioticResidue, setAntibioticResidue] = useState(false);
  const [certifyingOfficerName, setCertifyingOfficerName] = useState(
    currentUser.fullName.includes('Sunita') ? currentUser.fullName : 'Dr. Sunita Verma, Senior Food Analyst'
  );
  const [labNotes, setLabNotes] = useState('');

  // Target batch
  const targetBatch = state.batches.find((b) => b.id === selectedBatchId || b.batchId === selectedBatchId);

  // Batches awaiting testing or eligible for test
  const pendingBatches = state.batches.filter((b) => b.status === 'QualityTestingPending' || b.status === 'Harvested');
  const completedTests = state.qualityTests;

  const handleSubmitTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBatch) return;

    setSubmitting(true);
    setTestSuccess(false);

    const moisture = parseFloat(moisturePercentage);
    const hmf = parseFloat(hmfMgPerKg);
    const reducing = parseFloat(reducingSugarsPercentage);
    const sucrose = parseFloat(sucrosePercentage);

    // FSSAI compliance check
    const passed = moisture <= 20.0 && hmf <= 80.0 && !c4SugarAdulteration && !antibioticResidue;

    try {
      await submitQualityTest(targetBatch.id, {
        laboratoryId: currentUser.id,
        labName: currentUser.organizationName || 'National Honey Testing & Quality Certification Laboratory (NABL / FSSAI)',
        testReportId,
        testDate,
        moisturePercentage: moisture,
        hmfMgPerKg: hmf,
        reducingSugarsPercentage: reducing,
        sucrosePercentage: sucrose,
        pollenCountDominant,
        c4SugarAdulterationDetected: c4SugarAdulteration,
        antibioticResidueDetected: antibioticResidue,
        passedRegulatoryStandard: passed,
        certifyingOfficerName,
        labNotes: labNotes || (passed ? 'Compliant with FSSAI Honey Regulations 2020. Standard purity confirmed.' : 'Failed quality standards.'),
      });

      setTestSuccess(true);
      setTimeout(() => {
        setSelectedBatchId(null);
        setTestSuccess(false);
        setTestReportId(`NHTL-PUN-2026-${Math.floor(1000 + Math.random() * 9000)}`);
      }, 1500);
    } catch (err) {
      console.error(err);
      alert('Error submitting laboratory test');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Role Banner if not currently Lab persona */}
      {currentUser.role !== 'laboratory' && (
        <div className="bg-amber-100 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#F4A623] shrink-0" />
            <span className="text-[#6B3F20]">
              You are currently viewing as <strong>{currentUser.fullName} ({currentUser.role})</strong>. For full authorized laboratory submission access, switch to the Lab persona.
            </span>
          </div>
          <button
            onClick={() => switchRole('laboratory')}
            className="px-3 py-1.5 bg-[#6B3F20] hover:bg-[#452410] text-white font-bold rounded-xl transition-all shrink-0"
          >
            Switch to Dr. Sunita Verma (Lab Tech)
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs text-purple-800 font-bold bg-purple-100 px-2.5 py-0.5 rounded-full mb-1">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>NABL / FSSAI Quality Portal</span>
          </div>
          <h1 className="text-3xl font-black text-[#6B3F20]">Honey Quality Laboratory</h1>
          <p className="text-xs text-gray-600">
            Submit standardized chemical assays, verify purity against FSSAI 2020 standards, and mint immutable test hashes.
          </p>
        </div>

        <div className="text-right text-xs bg-white px-4 py-2 rounded-xl border border-amber-200">
          <span className="text-gray-500 block text-[10px]">Active Testing Facility:</span>
          <span className="font-bold text-[#6B3F20]">National Honey Quality Laboratory (NABL)</span>
        </div>
      </div>

      {/* Grid: Pending Queue & Recent Certified Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Batches Awaiting Assay */}
        <div className="lg:col-span-1 cream-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-[#6B3F20]">Testing Queue</h3>
            <span className="text-[11px] bg-amber-100 text-[#6B3F20] font-bold px-2 py-0.5 rounded-full">
              {pendingBatches.length} Pending
            </span>
          </div>

          <p className="text-xs text-gray-500">
            Batches logged by beekeepers awaiting certified laboratory assay.
          </p>

          <div className="space-y-3">
            {pendingBatches.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">
                All logged batches currently tested.
              </div>
            ) : (
              pendingBatches.map((batch) => (
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
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                      {batch.status}
                    </span>
                  </div>

                  <div className="font-bold text-xs text-gray-800 mt-1">{batch.variety}</div>
                  <div className="text-[11px] text-gray-500">{batch.locationSummary} • {batch.initialQuantityKg} kg</div>

                  <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                    <span className="text-gray-400 font-mono">By {batch.beekeeperName}</span>
                    <span className="text-[#D97706] font-bold flex items-center space-x-1">
                      <span>Perform Test</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Test Entry Form or Selection Prompt */}
        <div className="lg:col-span-2 cream-card p-6 sm:p-8 rounded-3xl space-y-6">
          {!targetBatch ? (
            <div className="py-20 text-center space-y-3">
              <Microscope className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="text-lg font-bold text-[#6B3F20]">Select a Batch to Test</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Select a pending batch from the testing queue on the left to record moisture, HMF, and pollen purity parameters.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-amber-100">
                <div>
                  <div className="text-xs font-mono font-bold text-amber-700">
                    TESTING BATCH: {targetBatch.batchId}
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mt-0.5">
                    {targetBatch.variety}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Producer: {targetBatch.beekeeperName} ({targetBatch.locationSummary})
                  </p>
                </div>

                <button
                  onClick={() => setSelectedBatchId(null)}
                  className="text-gray-400 hover:text-gray-600 text-xs"
                >
                  Clear Selection
                </button>
              </div>

              {testSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="block font-bold">Laboratory Certificate Recorded!</strong>
                    <span>Test parameters cryptographically hashed and added to the batch traceability ledger.</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmitTest} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Official Test Report ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={testReportId}
                      onChange={(e) => setTestReportId(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-xl font-mono focus:ring-2 focus:ring-[#F4A623]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Assay Execution Date</label>
                    <input
                      type="date"
                      value={testDate}
                      onChange={(e) => setTestDate(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F4A623]"
                    />
                  </div>
                </div>

                {/* Key Quality Parameters Checklist */}
                <div className="p-4 bg-white rounded-2xl border border-amber-100 space-y-4">
                  <div className="text-xs font-extrabold text-[#6B3F20] uppercase tracking-wider flex items-center justify-between">
                    <span>FSSAI Honey Standards (2020) Checklist</span>
                    <span className="text-[10px] text-gray-400 font-normal">Mandatory Parameters</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] text-gray-600 mb-1">
                        Moisture (%): <span className="text-gray-400">(Max 20.0%)</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={moisturePercentage}
                        onChange={(e) => setMoisturePercentage(e.target.value)}
                        className={`w-full p-2 border rounded-xl font-bold ${
                          parseFloat(moisturePercentage) > 20 ? 'border-red-400 bg-red-50 text-red-700' : 'border-gray-200'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-600 mb-1">
                        HMF (mg/kg): <span className="text-gray-400">(Max 80)</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={hmfMgPerKg}
                        onChange={(e) => setHmfMgPerKg(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-600 mb-1">
                        Reducing Sugars (%): <span className="text-gray-400">(Min 65%)</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={reducingSugarsPercentage}
                        onChange={(e) => setReducingSugarsPercentage(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-600 mb-1">
                        Sucrose (%): <span className="text-gray-400">(Max 5.0%)</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={sucrosePercentage}
                        onChange={(e) => setSucrosePercentage(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Adulteration toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                    <label className="flex items-center space-x-2 p-2 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={c4SugarAdulteration}
                        onChange={(e) => setC4SugarAdulteration(e.target.checked)}
                        className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                      />
                      <span className="text-xs text-gray-700">
                        C4 Sugar Adulteration Detected (Corn/Cane)
                      </span>
                    </label>

                    <label className="flex items-center space-x-2 p-2 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={antibioticResidue}
                        onChange={(e) => setAntibioticResidue(e.target.checked)}
                        className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                      />
                      <span className="text-xs text-gray-700">
                        Antibiotic Residue Detected (&gt; MRL)
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Dominant Pollen Melissopalynological Identification
                  </label>
                  <input
                    type="text"
                    value={pollenCountDominant}
                    onChange={(e) => setPollenCountDominant(e.target.value)}
                    placeholder="e.g. Brassica campestris 68%, Plectranthus 22%"
                    className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F4A623]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Certifying Food Analyst / Officer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={certifyingOfficerName}
                    onChange={(e) => setCertifyingOfficerName(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F4A623]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Technical Notes / Remarks</label>
                  <textarea
                    rows={2}
                    value={labNotes}
                    onChange={(e) => setLabNotes(e.target.value)}
                    placeholder="Observations on crystallization, diastase activity, or natural enzyme vitality..."
                    className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F4A623]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-[#6B3F20] hover:bg-[#452410] text-white font-bold rounded-xl shadow-sm transition-all flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Award className="w-4 h-4 text-[#F4A623]" />
                    <span>{submitting ? 'Generating Hash & Signing...' : 'Sign & Submit Certificate'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Historical Certified Results Table */}
      <div className="cream-card p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-[#6B3F20]">Certified Test History</h3>
          <span className="text-xs text-gray-500">{completedTests.length} Reports Logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-amber-50/70 text-[#6B3F20] uppercase font-bold text-[10px] tracking-wider border-b border-amber-200">
              <tr>
                <th className="py-3 px-3">Report ID</th>
                <th className="py-3 px-3">Batch ID</th>
                <th className="py-3 px-3">Moisture %</th>
                <th className="py-3 px-3">HMF (mg/kg)</th>
                <th className="py-3 px-3">Adulteration</th>
                <th className="py-3 px-3">Outcome</th>
                <th className="py-3 px-3">Analyst</th>
                <th className="py-3 px-3 text-right">Certificate Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {completedTests.map((t) => (
                <tr key={t.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-[#6B3F20]">{t.testReportId}</td>
                  <td className="py-3 px-3 font-mono">{t.batchId}</td>
                  <td className="py-3 px-3 font-bold">{t.moisturePercentage}%</td>
                  <td className="py-3 px-3">{t.hmfMgPerKg}</td>
                  <td className="py-3 px-3">
                    {t.c4SugarAdulterationDetected ? (
                      <span className="text-red-700 font-bold">Positive</span>
                    ) : (
                      <span className="text-emerald-700 font-bold">Negative</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.passedRegulatoryStandard
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {t.passedRegulatoryStandard ? 'COMPLIANT' : 'REJECTED'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-gray-700">{t.certifyingOfficerName.split(',')[0]}</td>
                  <td className="py-3 px-3 font-mono text-[10px] text-gray-400 text-right">
                    {t.labReportHash ? `${t.labReportHash.substring(0, 10)}...` : '--'}
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
