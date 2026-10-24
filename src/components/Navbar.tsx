'use client';

// =====================================================================================
// HONEY CHAIN — Responsive Navigation & Judge Persona Switcher
// Smart India Hackathon 2026 (SIH26021) — Team RUDRASCRIPT
// =====================================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useHoney } from '@/context/HoneyContext';
import { UserRole } from '@/types';
import {
  Hexagon,
  ShieldCheck,
  LayoutDashboard,
  Boxes,
  Microscope,
  RotateCcw,
  Menu,
  X,
  Factory,
  Radio,
  BarChart3,
  ShieldAlert,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, switchRole, resetDemoData, state } = useHoney();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const activeAlertsCount = state.alerts.filter((a) => !a.isResolved).length;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/verify', label: 'Verify Honey', highlight: true },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/hives', label: 'Hives' },
    { href: '/harvests', label: 'Harvests' },
    { href: '/batches', label: 'Batches' },
    { href: '/lab', label: 'Quality Lab' },
    { href: '/processing', label: 'Processing' },
    { href: '/iot', label: 'IoT Feeds' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/admin', label: 'Admin' },
  ];

  const roles: { role: UserRole; label: string; icon: string }[] = [
    { role: 'beekeeper', label: 'Beekeeper (Rajesh)', icon: '🐝' },
    { role: 'laboratory', label: 'Quality Lab (Dr. Verma)', icon: '🔬' },
    { role: 'processor', label: 'Processor (Vikram)', icon: '⚙️' },
    { role: 'admin', label: 'Admin (Devendra)', icon: '🛡️' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
      {/* Top Hackathon Demo Bar */}
      <div className="bg-[#6B3F20] text-amber-50 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="bg-[#F4A623] text-[#6B3F20] font-bold px-1.5 py-0.5 rounded text-[10px] tracking-wider uppercase">
            SIH 2026 Prototype
          </span>
          <span className="hidden sm:inline text-amber-200">
            Team RUDRASCRIPT — Smart India Hackathon #SIH26021
          </span>
        </div>

        {/* Quick Role Switcher for Judges */}
        <div className="flex items-center space-x-2">
          <span className="text-amber-200 hidden md:inline text-[11px]">Judge Quick-Role:</span>
          <div className="flex items-center space-x-1">
            {roles.map((r) => (
              <button
                key={r.role}
                onClick={() => switchRole(r.role)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  currentUser.role === r.role
                    ? 'bg-[#F4A623] text-[#452410] font-bold shadow-sm'
                    : 'bg-amber-900/50 hover:bg-amber-800 text-amber-100'
                }`}
                title={`Switch persona to ${r.label}`}
              >
                <span className="mr-1">{r.icon}</span>
                <span className="hidden lg:inline">{r.role.toUpperCase()}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              if (confirm('Reset prototype demo state to initial dataset?')) {
                resetDemoData();
              }
            }}
            className="flex items-center space-x-1 bg-amber-950/60 hover:bg-amber-900 text-amber-300 text-[11px] px-2 py-0.5 rounded border border-amber-700/50 ml-2"
            title="Reset to seeded hackathon data"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-[#F4A623] flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Hexagon className="w-6 h-6 text-[#6B3F20] fill-[#6B3F20]/15 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-[#6B3F20]">
                  HONEY<span className="text-[#F4A623]">CHAIN</span>
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-1.5 py-0.2 rounded-full border border-emerald-300">
                  TrustLedger
                </span>
              </div>
              <p className="text-[10px] text-gray-500 font-medium tracking-wide">
                Hive to Home Traceability
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                    link.highlight
                      ? 'bg-amber-500/10 text-[#6B3F20] border border-amber-300/80 hover:bg-amber-500/20'
                      : isActive
                      ? 'bg-amber-100/70 text-[#6B3F20] font-bold'
                      : 'text-gray-600 hover:text-[#6B3F20] hover:bg-amber-50/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User Persona & Mobile Toggle */}
          <div className="flex items-center space-x-3">
            {/* Active User Indicator */}
            <div className="hidden sm:flex items-center space-x-2 pl-2 border-l border-amber-200">
              <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-sm font-bold text-[#6B3F20]">
                {currentUser.role === 'beekeeper' && '🐝'}
                {currentUser.role === 'laboratory' && '🔬'}
                {currentUser.role === 'processor' && '⚙️'}
                {currentUser.role === 'admin' && '🛡️'}
              </div>
              <div className="text-left text-xs">
                <div className="font-bold text-gray-800 truncate max-w-[120px]">
                  {currentUser.fullName}
                </div>
                <div className="text-[10px] text-amber-700 font-medium capitalize">
                  {currentUser.role}
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-1 shadow-lg">
          <div className="p-2 mb-2 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500">Active Persona:</span>
              <div className="font-bold text-sm text-[#6B3F20]">{currentUser.fullName} ({currentUser.role})</div>
            </div>
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                pathname === link.href
                  ? 'bg-amber-100 text-[#6B3F20] font-bold'
                  : 'text-gray-700 hover:bg-amber-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
