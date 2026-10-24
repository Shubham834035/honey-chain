// =====================================================================================
// HONEY CHAIN — Global Accessible Footer
// Smart India Hackathon 2026 (SIH26021) — Team RUDRASCRIPT
// =====================================================================================

import React from 'react';
import Link from 'next/link';
import { Hexagon, ShieldCheck, Heart, ExternalLink, Award, FileText } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#452410] text-amber-100 border-t border-amber-900 mt-20">
      {/* Transparency & Disclaimer Banner */}
      <div className="bg-[#361a0a] py-4 px-4 sm:px-6 lg:px-8 border-b border-amber-950/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2 text-amber-300">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="leading-relaxed">
              <strong className="text-white">Transparency Mandate:</strong> Blockchain verification cryptographically proves that recorded history has remained unaltered since registration. Original authenticity requires certified laboratory assays.
            </p>
          </div>
          <div className="flex items-center space-x-3 shrink-0 text-amber-400">
            <span className="bg-amber-900/80 px-2.5 py-1 rounded border border-amber-700/40">FSSAI Honey Reg. 2020</span>
            <span className="bg-amber-900/80 px-2.5 py-1 rounded border border-amber-700/40">NABL ISO/IEC 17025</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#F4A623] flex items-center justify-center">
                <Hexagon className="w-5 h-5 text-[#6B3F20] fill-[#6B3F20]/20" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                HONEY<span className="text-[#F4A623]">CHAIN</span>
              </span>
            </div>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              Empowering Indian beekeepers with cryptographic traceability, smart hive telemetry, and consumer verification from hive to home.
            </p>
            <div className="pt-2 text-[11px] text-amber-300/70">
              Smart India Hackathon 2026 — Problem Statement <strong className="text-amber-200">SIH26021</strong><br />
              Developed by <strong className="text-amber-200">Team RUDRASCRIPT</strong>
            </div>
          </div>

          {/* Verification & Consumer */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-3">Consumer & Public</h4>
            <ul className="space-y-2 text-xs text-amber-100/80">
              <li>
                <Link href="/verify" className="hover:text-white transition-colors flex items-center space-x-1">
                  <span>Verify Batch via QR / Code</span>
                </Link>
              </li>
              <li>
                <Link href="/verify?id=HC-2026-H04-B001" className="hover:text-white transition-colors">
                  Sample Batch: Wild Mustard
                </Link>
              </li>
              <li>
                <Link href="/verify?id=HC-2026-H02-B003" className="hover:text-white transition-colors">
                  Sample Batch: Sundarbans Khalsi
                </Link>
              </li>
              <li>
                <Link href="/verify?id=HC-2026-H11-B004" className="hover:text-white transition-colors text-red-300">
                  Sample Flagged Batch (Recall Demo)
                </Link>
              </li>
            </ul>
          </div>

          {/* Producer & Laboratory */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-3">Supply Chain Nodes</h4>
            <ul className="space-y-2 text-xs text-amber-100/80">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Beekeeper Dashboard
                </Link>
              </li>
              <li>
                <Link href="/hives" className="hover:text-white transition-colors">
                  Hive & Colony Management
                </Link>
              </li>
              <li>
                <Link href="/harvests" className="hover:text-white transition-colors">
                  Harvest Recording
                </Link>
              </li>
              <li>
                <Link href="/batches" className="hover:text-white transition-colors">
                  Batch Lifecycle & QR Generator
                </Link>
              </li>
              <li>
                <Link href="/lab" className="hover:text-white transition-colors">
                  Quality Laboratory Portal
                </Link>
              </li>
              <li>
                <Link href="/processing" className="hover:text-white transition-colors">
                  Processing & Bottling
                </Link>
              </li>
            </ul>
          </div>

          {/* Innovation & Standards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-3">Smart Beekeeping & Trust</h4>
            <ul className="space-y-2 text-xs text-amber-100/80">
              <li>
                <Link href="/iot" className="hover:text-white transition-colors flex items-center space-x-1">
                  <span>IoT Sensor Monitoring</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1 py-0.5 rounded">Telemetry</span>
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-white transition-colors">
                  Production & Quality Analytics
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Admin Audit & Oversight
                </Link>
              </li>
              <li>
                <span className="text-amber-300/70 block pt-1">
                  Cryptographic Standard: Canonical SHA-256 + EVM Proofs
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-amber-900/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-amber-200/60">
          <p>© 2026 HONEY CHAIN. Smart India Hackathon Prototype. Team RUDRASCRIPT.</p>
          <p className="mt-2 sm:mt-0">Built for rural accessibility, purity enforcement, and transparent traceability.</p>
        </div>
      </div>
    </footer>
  );
}
