'use client';

// =====================================================================================
// HONEY CHAIN — Public Landing Page (Hive to Home)
// Smart India Hackathon 2026 (SIH26021) — Team RUDRASCRIPT
// =====================================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Hexagon,
  ShieldCheck,
  QrCode,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Microscope,
  Leaf,
  Activity,
  Award,
  ChevronDown,
  Lock,
  Layers,
  MapPin,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const steps = [
    {
      num: '01',
      title: 'Register Apiary & Hive',
      desc: 'Beekeepers register farm locations, colony species, and install optional smart telemetry sensors.',
      icon: '🐝',
    },
    {
      num: '02',
      title: 'Record Raw Harvest',
      desc: 'Extraction details, floral nectar source, and harvest quantities generate a unique cryptographic Batch ID.',
      icon: '🍯',
    },
    {
      num: '03',
      title: 'Independent Lab Assay',
      desc: 'Accredited NABL/FSSAI laboratories test moisture, HMF, and pollen authenticity directly into the ledger.',
      icon: '🔬',
    },
    {
      num: '04',
      title: 'Blockchain State Immutability',
      desc: 'Canonical record hashes and state transitions are committed to a tamper-evident blockchain ledger.',
      icon: '⛓️',
    },
    {
      num: '05',
      title: 'Scan QR & Verify',
      desc: 'Consumers scan the on-jar QR code to view the verifiable journey, floral profile, and purity certificate.',
      icon: '📱',
    },
  ];

  const features = [
    {
      title: 'Blockchain-Backed Traceability',
      desc: 'Canonical SHA-256 state hashing and EVM smart contracts secure every batch milestone against retroactive falsification.',
      icon: ShieldCheck,
      color: 'bg-amber-100 text-[#6B3F20]',
    },
    {
      title: 'Consumer QR Verification',
      desc: 'Dynamic QR codes on retail jars instantly connect consumers to the batch verification timeline without installing any mobile application.',
      icon: QrCode,
      color: 'bg-emerald-100 text-emerald-800',
    },
    {
      title: 'Smart Hive Telemetry (IoT)',
      desc: 'Architectural foundation for continuous temperature, humidity, hive weight, and acoustic swarm frequency monitoring.',
      icon: Activity,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      title: 'FSSAI Regulatory Compliance',
      desc: 'Built-in laboratory test validation enforcing strict statutory standards: Moisture <=20%, HMF <=40 mg/kg, and zero C4 synthetic sugars.',
      icon: Award,
      color: 'bg-purple-100 text-purple-800',
    },
    {
      title: 'Farmer Empowerment',
      desc: 'Eliminates predatory middleman discounting by giving artisanal beekeepers verifiable proof of geographical floral origin.',
      icon: Leaf,
      color: 'bg-orange-100 text-orange-800',
    },
    {
      title: 'Automated Anomaly Flags',
      desc: 'Instant distribution lockout if moisture thresholds or adulteration assays fail, protecting consumer safety and brand integrity.',
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-800',
    },
  ];

  const faqs = [
    {
      q: 'How does HONEY CHAIN prevent sugar syrup and C4 sugar adulteration?',
      a: 'Unlike decorative labeling, HONEY CHAIN ties every batch to an authorized laboratory test report hash. If an accredited laboratory detects inverted sugar, rice/corn C4 syrups, or moisture >20%, the smart contract automatically locks the batch status to "Recalled or Flagged", preventing legitimate distribution.',
    },
    {
      q: 'What is the role of blockchain in this platform?',
      a: 'Blockchain provides a permanent, tamper-evident historical audit trail. Once a harvest or test result is registered with its canonical hash, no entity—including apiaries, processors, or platform administrators—can silently rewrite the dates, origin, or test metrics after the fact.',
    },
    {
      q: 'Does blockchain verification alone prove honey is pure?',
      a: 'No, and we are completely transparent about this distinction. Blockchain proves integrity of records (that recorded history has not been altered). Chemical purity is validated by certified laboratory tests (moisture %, HMF, diastase, and pollen analysis) whose hashes are secured by the blockchain.',
    },
    {
      q: 'Can a rural beekeeper use this without complex crypto wallets?',
      a: 'Yes! The platform is designed with mobile-first rural accessibility in mind. Beekeepers interact through simple, accessible forms in plain language with intuitive visual indicators, while cryptographic hashing and blockchain transactions execute seamlessly in the background.',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF9ED] via-[#FFFDF9] to-[#FAF9F5] pt-16 pb-24 border-b border-amber-100">
        <div className="absolute inset-0 bg-[radial-gradient(#F4A623_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 bg-amber-100/80 border border-amber-300 text-[#6B3F20] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#F4A623]" />
              <span>Smart India Hackathon 2026 — Prototype SIH26021</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#6B3F20] tracking-tight leading-[1.15]">
              From Hive to Home.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4A623] to-[#D97706]">
                Every Drop Has a Story.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-normal">
              A transparent, tamper-evident honey traceability and smart beekeeping platform.
              Securing authentic Indian honey through cryptographic blockchain records, laboratory purity assays, and QR consumer verification.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/verify"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-[#F4A623] to-[#D97706] text-[#452410] font-extrabold px-8 py-3.5 rounded-xl shadow-honey hover:shadow-lg hover:scale-105 transition-all text-sm tracking-wide"
              >
                <QrCode className="w-5 h-5 text-[#452410]" />
                <span>Verify a Honey Batch</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white text-[#6B3F20] font-bold px-7 py-3.5 rounded-xl border border-amber-200 shadow-sm hover:bg-amber-50/70 transition-all text-sm"
              >
                <span>Launch Beekeeper Dashboard</span>
              </Link>
            </div>

            {/* Live Verification Demo Badges */}
            <div className="pt-6 border-t border-amber-100/70 mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-600">
              <span className="font-semibold text-[#6B3F20]">Quick Demo Verification:</span>
              <Link
                href="/verify?id=HC-2026-H04-B001"
                className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-md hover:bg-emerald-100 font-mono transition-colors flex items-center space-x-1"
              >
                <span>HC-2026-H04-B001</span>
                <span className="text-[10px] bg-emerald-200 px-1 rounded">Certified Pure</span>
              </Link>
              <Link
                href="/verify?id=HC-2026-H11-B004"
                className="bg-red-50 text-red-800 border border-red-300 px-2.5 py-1 rounded-md hover:bg-red-100 font-mono transition-colors flex items-center space-x-1"
              >
                <span>HC-2026-H11-B004</span>
                <span className="text-[10px] bg-red-200 px-1 rounded">Flagged Anomaly</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-[#F4A623]">
            End-To-End Architecture
          </h2>
          <h3 className="text-3xl font-extrabold text-[#6B3F20]">
            How HONEY CHAIN Secures the Journey
          </h3>
          <p className="text-sm text-gray-600">
            A continuous cryptographic pipeline connecting apiary producers, certified laboratories, processors, and end consumers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((s, idx) => (
            <div
              key={s.num}
              className="relative cream-card rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-xs font-extrabold text-amber-500 font-mono bg-amber-50 px-2 py-0.5 rounded">
                    {s.num}
                  </span>
                </div>
                <h4 className="font-bold text-base text-[#6B3F20] leading-snug group-hover:text-[#D97706] transition-colors">
                  {s.title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Platform Features */}
      <section className="bg-white py-16 border-y border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-[#F4A623]">
              Technological Capabilities
            </h2>
            <h3 className="text-3xl font-extrabold text-[#6B3F20]">
              Built for Transparency, Safety, and Trust
            </h3>
            <p className="text-sm text-gray-600">
              Designed according to FSSAI honey regulations and modern cryptographic standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="p-6 rounded-2xl border border-gray-100 bg-[#FFFDF9] hover:shadow-card transition-all space-y-4"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${f.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg text-[#6B3F20]">{f.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust & Transparency Education Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#FFF9ED] via-white to-amber-50/50 rounded-3xl p-8 sm:p-12 border border-amber-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-amber-200/60 text-[#6B3F20] text-xs font-bold px-3 py-1 rounded-full">
                <Lock className="w-3.5 h-3.5 text-[#F4A623]" />
                <span>Academic & Scientific Integrity</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#6B3F20] leading-tight">
                What Blockchain Proves vs. What Laboratory Testing Proves
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Many modern traceability systems mislead consumers by claiming that putting a record on a blockchain proves honey is pure. At HONEY CHAIN, we enforce scientific rigor:
              </p>

              <div className="space-y-3 text-xs">
                <div className="flex items-start space-x-3 p-3 bg-white rounded-xl border border-amber-100">
                  <CheckCircle2 className="w-4 h-4 text-[#2F6B45] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 block font-bold">What Blockchain Actually Proves:</strong>
                    <span className="text-gray-600">
                      Immutability and chronological integrity. It proves that the harvest timestamp, batch origin, and lab test data have not been altered or replaced since registration.
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-white rounded-xl border border-amber-100">
                  <CheckCircle2 className="w-4 h-4 text-[#2F6B45] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 block font-bold">What Laboratory Assays Prove:</strong>
                    <span className="text-gray-600">
                      Chemical and biological purity. Moisture percentage, HMF levels, absence of C4 sugar adulterants, and microscopic pollen flower identification.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Architecture Comparison Box */}
            <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm space-y-4 text-xs font-mono">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="font-bold text-gray-700">CANONICAL VERIFICATION PAYLOAD</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-sans font-bold">SHA-256 Validated</span>
              </div>
              <pre className="text-[11px] bg-gray-900 text-amber-300 p-4 rounded-xl overflow-x-auto leading-relaxed">
{`{
  "batchId": "HC-2026-H04-B001",
  "origin": "Kullu, Himachal Pradesh",
  "species": "Apis cerana indica",
  "harvestDate": "2026-04-10",
  "labReportHash": "0x5d4e3f2a1b0c9d8...",
  "moisturePct": 17.8, // Limit <= 20%
  "c4SugarAdulteration": false,
  "onChainState": "COMMITTED_IMMUTABLE"
}`}
              </pre>
              <div className="text-[11px] text-gray-500 font-sans italic">
                A single byte altered in origin or lab metrics produces a completely different hash digest, triggering an immediate integrity check failure.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholder Benefits Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-[#F4A623]">
            Supply Chain Ecosystem
          </h2>
          <h3 className="text-3xl font-extrabold text-[#6B3F20]">
            Value for Every Stakeholder
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="cream-card rounded-2xl p-6 space-y-3">
            <span className="text-3xl">🐝</span>
            <h4 className="font-bold text-base text-[#6B3F20]">For Beekeepers</h4>
            <ul className="text-xs text-gray-600 space-y-2">
              <li>• Fair price realization through unadulterated origin proof</li>
              <li>• Digital apiary and hive health records</li>
              <li>• Simple smartphone interface for remote farms</li>
            </ul>
          </div>

          <div className="cream-card rounded-2xl p-6 space-y-3">
            <span className="text-3xl">🔬</span>
            <h4 className="font-bold text-base text-[#6B3F20]">For Quality Labs</h4>
            <ul className="text-xs text-gray-600 space-y-2">
              <li>• Cryptographic signing of test certificates</li>
              <li>• FSSAI-compliant standardized parameter checklists</li>
              <li>• Direct public auditability of test reports</li>
            </ul>
          </div>

          <div className="cream-card rounded-2xl p-6 space-y-3">
            <span className="text-3xl">⚙️</span>
            <h4 className="font-bold text-base text-[#6B3F20]">For Processors</h4>
            <ul className="text-xs text-gray-600 space-y-2">
              <li>• Transparent lot assignment and packaging logs</li>
              <li>• Temperature-controlled cold processing verification</li>
              <li>• Immediate tamper-evident seal tracking</li>
            </ul>
          </div>

          <div className="cream-card rounded-2xl p-6 space-y-3">
            <span className="text-3xl">🛒</span>
            <h4 className="font-bold text-base text-[#6B3F20]">For Consumers</h4>
            <ul className="text-xs text-gray-600 space-y-2">
              <li>• Instant zero-app camera QR scan verification</li>
              <li>• Genuine flower nectar and regional identification</li>
              <li>• Complete confidence against synthetic sugar blends</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-[#F4A623]">FAQ</h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#6B3F20]">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={faq.q}
                className="cream-card rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left p-5 flex items-center justify-between font-bold text-sm text-[#6B3F20] hover:text-[#D97706]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-amber-600 transition-transform ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-gray-700 leading-relaxed border-t border-amber-100/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="brown-gradient rounded-3xl p-10 text-center text-amber-50 space-y-6 shadow-xl">
          <h3 className="text-3xl sm:text-4xl font-black text-white">
            Experience the Complete Verification Journey
          </h3>
          <p className="text-sm max-w-xl mx-auto text-amber-200/90 leading-relaxed">
            Test the live hackathon prototype: explore beekeeper harvests, submit lab purity tests, view immutable blockchain hashes, and verify honey jars in real time.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/verify"
              className="bg-[#F4A623] hover:bg-amber-400 text-[#452410] font-extrabold px-8 py-3.5 rounded-xl shadow-lg text-sm transition-all"
            >
              Scan & Verify Now
            </Link>
            <Link
              href="/dashboard"
              className="bg-amber-900/60 hover:bg-amber-900 text-white font-bold px-7 py-3.5 rounded-xl border border-amber-700/60 text-sm transition-all"
            >
              Open Beekeeper Hub
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
