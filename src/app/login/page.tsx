'use client';

// =====================================================================================
// HONEY CHAIN — Authentication Portal (/login)
// Smart India Hackathon 2026 (SIH26021) — Team RUDRASCRIPT
// =====================================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useHoney } from '@/context/HoneyContext';
import { DEMO_USERS } from '@/lib/store';
import { UserRole } from '@/types';
import {
  Hexagon,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { switchRole, currentUser } = useHoney();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      // Find matching demo user or fallback
      const foundUser = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (foundUser) {
        switchRole(foundUser.role);
        setLoading(false);
        router.push(foundUser.role === 'laboratory' ? '/lab' : foundUser.role === 'processor' ? '/processing' : foundUser.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        setLoading(false);
        setError('Invalid credentials. Please use one of the SIH Judge Demonstration Personas below for instant testing.');
      }
    }, 400);
  };

  const handleQuickLogin = (role: UserRole) => {
    switchRole(role);
    if (role === 'laboratory') router.push('/lab');
    else if (role === 'processor') router.push('/processing');
    else if (role === 'admin') router.push('/admin');
    else router.push('/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-amber-400 items-center justify-center shadow-honey mb-2">
            <Hexagon className="w-7 h-7 text-[#6B3F20] fill-[#6B3F20]/20" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#6B3F20] tracking-tight">
            Sign In to HONEY CHAIN
          </h2>
          <p className="text-xs text-gray-600">
            Secure role-based platform for Beekeepers, Testing Labs, and Processors
          </p>
        </div>

        {/* SIH Judge Quick Access Card */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#F4A623]" />
              <span className="text-xs font-bold text-[#6B3F20] uppercase tracking-wider">
                Hackathon Judge Quick-Access
              </span>
            </div>
            <span className="text-[10px] bg-amber-200 text-[#6B3F20] px-2 py-0.5 rounded-full font-bold">
              1-Click Demo
            </span>
          </div>
          <p className="text-xs text-gray-700 leading-snug">
            Select a verified persona below to immediately test role-specific workflows without manual password entry:
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => handleQuickLogin('beekeeper')}
              className="p-2.5 rounded-xl border border-amber-200 bg-white hover:bg-amber-100/60 text-left transition-all"
            >
              <div className="text-sm font-bold text-[#6B3F20] flex items-center space-x-1">
                <span>🐝</span> <span>Beekeeper</span>
              </div>
              <div className="text-[10px] text-gray-500 truncate">Rajesh Sharma (Apiary)</div>
            </button>

            <button
              onClick={() => handleQuickLogin('laboratory')}
              className="p-2.5 rounded-xl border border-amber-200 bg-white hover:bg-amber-100/60 text-left transition-all"
            >
              <div className="text-sm font-bold text-[#6B3F20] flex items-center space-x-1">
                <span>🔬</span> <span>Quality Lab</span>
              </div>
              <div className="text-[10px] text-gray-500 truncate">Dr. Sunita Verma (NABL)</div>
            </button>

            <button
              onClick={() => handleQuickLogin('processor')}
              className="p-2.5 rounded-xl border border-amber-200 bg-white hover:bg-amber-100/60 text-left transition-all"
            >
              <div className="text-sm font-bold text-[#6B3F20] flex items-center space-x-1">
                <span>⚙️</span> <span>Processor</span>
              </div>
              <div className="text-[10px] text-gray-500 truncate">Vikram Patel (Bottling)</div>
            </button>

            <button
              onClick={() => handleQuickLogin('admin')}
              className="p-2.5 rounded-xl border border-amber-200 bg-white hover:bg-amber-100/60 text-left transition-all"
            >
              <div className="text-sm font-bold text-[#6B3F20] flex items-center space-x-1">
                <span>🛡️</span> <span>Authority</span>
              </div>
              <div className="text-[10px] text-gray-500 truncate">Devendra Rao (Admin)</div>
            </button>
          </div>
        </div>

        {/* Standard Credentials Form */}
        <div className="cream-card p-6 rounded-2xl space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rajesh.sharma@himalayanapiaries.in"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4A623] bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4A623] bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#6B3F20] hover:bg-[#452410] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In With Credentials'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-gray-500 border-t border-amber-100">
            Don't have an apiary or laboratory account?{' '}
            <Link href="/register" className="font-bold text-[#D97706] hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
