// =====================================================================================
// HONEY CHAIN — Root Layout
// Smart India Hackathon 2026 (SIH26021) — Team RUDRASCRIPT
// =====================================================================================

import type { Metadata } from 'next';
import './globals.css';
import { HoneyProvider } from '@/context/HoneyContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'HONEY CHAIN — Blockchain Honey Traceability & Smart Beekeeping',
  description:
    'From Hive to Home. Every Drop Has a Story. Tamper-evident blockchain traceability, smart IoT beehive monitoring, and QR-based consumer verification for Smart India Hackathon 2026 (SIH26021).',
  keywords: [
    'honey traceability',
    'blockchain honey',
    'smart beekeeping',
    'sih 2026',
    'honey chain',
    'fssai honey purity',
    'iot beehive monitoring',
  ],
 
verification: {
google :"7eptMjGjCJnYqYoZtUlFcUsjLWjLV0Wq5Sw79UljQo0"  
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#1F2937] antialiased">
        <HoneyProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </HoneyProvider>
      </body>
    </html>
  );
}
