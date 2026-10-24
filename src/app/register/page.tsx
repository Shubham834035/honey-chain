'use client';

// =====================================================================================
// HONEY CHAIN — Registration Portal (/register)
// Smart India Hackathon 2026 (SIH26021) — Team RUDRASCRIPT
// =====================================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useHoney } from '@/context/HoneyContext';
import { UserRole, UserProfile } from '@/types';
import {
  Hexagon,
  Lock,
  Mail,
  User,
  Phone,
  Building,
  FileBadge,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { state, refreshState } = useHoney();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('beekeeper');
  const [organizationName, setOrganizationName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName || !email || !password) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (role === 'admin') {
      setError('Security Notice: Administrator accounts cannot be self-registered.');
      return;
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      fullName,
      email,
      phone,
      role,
      organizationName,
      licenseNumber,
      isVerified: true,
      walletAddress: '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    };

    state.users.push(newUser);
    state.currentUser = newUser;
    refreshState();
    setSuccess(true);

    setTimeout(() => {
      if (role === 'laboratory') router.push('/lab');
      else if (role === 'processor') router.push('/processing');
      else router.push('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-amber-400 items-center justify-center shadow-honey mb-2">
            <Hexagon className="w-7 h-7 text-[#6B3F20] fill-[#6B3F20]/20" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#6B3F20] tracking-tight">
            Register Stakeholder Account
          </h2>
          <p className="text-xs text-gray-600">
            Join the national cryptographic honey traceability ecosystem
          </p>
        </div>

        <div className="cream-card p-6 sm:p-8 rounded-2xl space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Registration successful! Directing to role workspace...</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            {/* Role Selection */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Select Your Operational Role <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'beekeeper', label: 'Beekeeper', icon: '🐝' },
                  { id: 'laboratory', label: 'Quality Lab', icon: '🔬' },
                  { id: 'processor', label: 'Processor', icon: '⚙️' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id as UserRole)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      role === r.id
                        ? 'border-[#F4A623] bg-amber-100/70 text-[#6B3F20] font-bold shadow-sm'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-lg">{r.icon}</div>
                    <div className="text-[11px] mt-1">{r.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Full Legal Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F4A623] bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh@apiary.in"
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F4A623] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Mobile Contact</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F4A623] bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Farm / Enterprise Name
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="Nilgiri Natural Apiary"
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F4A623] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  License / Registration No.
                </label>
                <div className="relative">
                  <FileBadge className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="BK-TN-2024-019"
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F4A623] bg-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure passphrase"
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F4A623] bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#6B3F20] hover:bg-[#452410] text-white font-bold rounded-xl transition-all flex items-center justify-center space-x-2 shadow-sm"
            >
              <span>Complete Registration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-gray-500 border-t border-amber-100">
            Already registered?{' '}
            <Link href="/login" className="font-bold text-[#D97706] hover:underline">
              Sign in to your portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
