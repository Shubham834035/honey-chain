# HONEY CHAIN 🍯⛓️
### Blockchain-Based Honey Traceability & Smart Beekeeping Platform
**Smart India Hackathon 2026 — Problem Statement SIH26021**  
**Team: RUDRASCRIPT**

---

## 🌟 Executive Overview & Project Vision

India is one of the world's leading producers of natural honey, yet the industry faces immense challenges: widespread synthetic sugar syrup adulteration (C4 corn/cane syrups, inverted sugar), predatory middleman discounting of rural beekeepers, and lack of transparent consumer verification.

**HONEY CHAIN** solves this by establishing a tamper-evident digital supply chain linking:
1. **Beekeepers (Apiaries)** ➔ Register colonies, track hive health, and record physical extractions.
2. **Quality Testing Laboratories** ➔ Submit certified chemical purity assays enforcing **FSSAI Honey Regulations (2020)**.
3. **Processors & Bottlers** ➔ Record cold-extraction temperature controls (&le; 40°C), microfiltration, packaging lots, and tamper-evident seals.
4. **Blockchain Integrity Engine** ➔ Canonical SHA-256 state hashing and EVM smart contracts (`HoneyTraceability.sol`) preventing retroactive modification of records.
5. **Consumers** ➔ Instant zero-app QR code verification displaying botanical floral origins, lab purity reports, and immutable journey timelines.
6. **Smart Beekeeping (IoT)** ➔ Colony telemetry foundation monitoring internal brood temperature, humidity, scale weight, and acoustic swarming frequency.

> **CRITICAL SCIENTIFIC INTEGRITY MANDATE:**  
> HONEY CHAIN explicitly distinguishes between what blockchain proves vs. what laboratory testing proves. Blockchain cryptographically guarantees *chronological immutability* (that recorded history has not been altered). *Physical purity* is independently validated by accredited NABL/FSSAI laboratory assays whose report hashes are secured on-chain.

---

## 🚀 Live Hackathon Judge Demonstration Walkthrough (10 Steps)

The prototype includes **1-Click Hackathon Persona Buttons** in the navigation header so SIH judges can test the full supply chain without typing credentials:

| Step | Action | Page | What to Observe |
|:---|:---|:---|:---|
| **1** | **Explore Public Portal** | `/` | Responsive landing page, architecture overview, FAQ, and educational transparency card. |
| **2** | **Verify Certified Batch** | `/verify` | Click `HC-2026-H04-B001 (Pure Certified)`. See **RECORD VERIFIED & QUALITY CERTIFIED** badge, FSSAI compliance (17.8% moisture, C4 negative, Himalayan Wild Mustard). |
| **3** | **Inspect Flagged Batch** | `/verify` | Click `HC-2026-H11-B004 (Flagged Anomaly)`. See **BATCH FLAGGED / DISTRIBUTION BLOCKED** alert due to moisture breach (23.4% > 20% limit). |
| **4** | **Test Camera QR Scanner** | `/verify` | Click **Scan via Camera** to activate device camera with automatic QR detection. |
| **5** | **Beekeeper Dashboard** | `/dashboard` | Click `🐝 BEEKEEPER` in top bar. Inspect calculated metrics (total production kg, healthy hives, extraction yields chart). |
| **6** | **Register a Colony Hive** | `/hives` | Click **Register New Hive**. Select native Indian bee (*Apis cerana indica*) or *Apis mellifera*. |
| **7** | **Log a Honey Harvest** | `/harvests` | Click **Record New Extraction**. Enter quantity (e.g. 45.0 kg), floral source, and moisture reading. |
| **8** | **Mint Honey Batch & QR** | `/batches` | Click **Create Batch**. Observe unique Batch ID generation (`HC-2026-Hxx-Bxxx`), canonical SHA-256 hash, and downloadable QR code. |
| **9** | **Execute Quality Lab Assay** | `/lab` | Switch to `🔬 QUALITY LAB (Dr. Sunita Verma)`. Select pending batch from queue, enter FSSAI parameters (Moisture %, HMF, Pollen), and sign certificate. |
| **10**| **Process & Bottle Jars** | `/processing`| Switch to `⚙️ PROCESSOR (Vikram Patel)`. Assign lot number, tamper seal ID, 500g glass jar specifications, and elevate status to `ReadyForDistribution`. |

*Note: Use the **Reset Demo** button in the header at any time to restore the initial evaluation dataset.*

---

## 🛠️ Technology Stack Architecture

- **Frontend & Fullstack Runtime**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons.
- **Data Visualizations**: Recharts (Harvest yields, Hive telemetry time-series, Variety distribution).
- **Validation & Forms**: React Hook Form, Zod.
- **QR Engine**: `qrcode` (SVG generation, High-res PNG export), `html5-qrcode` (Device camera scanning).
- **Cryptography & Canonical Hashing**: Deterministic JSON key serialization + SHA-256 cryptographic digests.
- **Smart Contracts & Blockchain**:
  - Solidity 0.8.20 (`contracts/HoneyTraceability.sol`)
  - Hardhat test & development environment
  - Modular Blockchain Service: `SimulatedBlockchainAdapter` (transparently labelled demo mode) & `EthersBlockchainAdapter` (live testnet RPC).
- **Database Architecture**:
  - Complete PostgreSQL schema migration with 15 relational tables and Row Level Security (`supabase/migrations/2026021_init_honey_chain.sql`).
  - Resilient reactive client store (`src/lib/store.ts`) for zero-friction hackathon evaluation without external API blocking.

---

## 📋 Color Palette & Brand Tokens

| Token | Hex Code | Purpose |
|:---|:---|:---|
| **Honey Amber** | `#F4A623` | Primary brand accent, interactive CTAs, high-visibility badges |
| **Deep Honey Brown** | `#6B3F20` | Primary brand headers, logo mark, luxury agricultural tone |
| **Warm Cream** | `#FFF9ED` | Soft card surfaces, section backgrounds |
| **Forest Green** | `#2F6B45` | Purity verification seals, ecological trust, passed standards |
| **Charcoal** | `#1F2937` | High-contrast accessible typography |

---

## 📂 Project Structure

```
honey-chain/
├── contracts/
│   └── HoneyTraceability.sol        # Solidity smart contract for batch lifecycle
├── supabase/
│   └── migrations/
│       └── 2026021_init_honey_chain.sql # PostgreSQL schema (15 entities, RLS, indexes)
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Public Landing Page (Hive to Home)
│   │   ├── layout.tsx               # Root Layout with reactive HoneyProvider
│   │   ├── globals.css              # Custom Honey theme styling
│   │   ├── login/page.tsx           # Authentication with 1-click Judge Persona Switcher
│   │   ├── register/page.tsx        # Stakeholder Registration (Role-based)
│   │   ├── dashboard/page.tsx       # Beekeeper Operations Hub & Calculated KPIs
│   │   ├── hives/page.tsx           # Hive & Colony Lineage Management
│   │   ├── harvests/page.tsx        # Raw Extraction Ledger & Batch Minting
│   │   ├── batches/page.tsx         # Batch Registry & Status Filter
│   │   ├── batches/[id]/page.tsx    # Detailed Ledger, Timeline & QR Print/Download
│   │   ├── verify/page.tsx          # Consumer Verification & Camera QR Scanner
│   │   ├── lab/page.tsx             # Quality Testing Portal (FSSAI 2020 Standards)
│   │   ├── processing/page.tsx      # Cold Processing, Bottling & Tamper Seals
│   │   ├── iot/page.tsx             # Smart Hive IoT Telemetry & Anomaly Alerts
│   │   ├── analytics/page.tsx       # Production Analytics & Variety Breakdown
│   │   └── admin/page.tsx           # Regulatory Authority Oversight & Batch Recalls
│   ├── components/
│   │   ├── Navbar.tsx               # Global Navbar with Judge Demo Bar
│   │   └── Footer.tsx               # Accessible Footer with Regulatory Citations
│   ├── context/
│   │   └── HoneyContext.tsx         # React Context for State & Role Switching
│   ├── lib/
│   │   ├── crypto.ts                # Canonical JSON Serializer & SHA-256 Engine
│   │   ├── blockchain.ts            # Dual-Mode Blockchain Adapter Service
│   │   ├── qr.ts                    # QR Code SVG & DataURL Generator
│   │   └── store.ts                 # Seeded Demonstration Dataset & Store
│   └── types/
│       └── index.ts                 # Full TypeScript Type Definitions
├── tests/
│   └── honey-chain.test.ts          # Automated Unit & Integration Tests (11 passed)
├── test/
│   └── HoneyTraceability.test.js    # Hardhat Smart Contract Test Suite
├── hardhat.config.js                # Hardhat Configuration (Solidity 0.8.20)
├── vitest.config.ts                 # Vitest Automated Test Runner Configuration
├── tailwind.config.js               # Tailwind Theme Tokens
└── package.json
```

---

## ⚡ Setup & Local Execution Guide

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or pnpm

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/rudrascript/honey-chain.git
cd honey-chain

# Install dependencies
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(By default, `NEXT_PUBLIC_APP_MODE=demo` is pre-configured for instant zero-dependency evaluation).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 4. Run Automated Test Suite
```bash
npm test
```
All 11 automated cryptographic, role permission, and workflow tests will execute and pass:
```
✓ tests/honey-chain.test.ts (11 tests)
Test Files  1 passed (1)
Tests       11 passed (11)
```

### 5. Production Build Validation
```bash
npm run build
```
Generates 16 optimized static and dynamic production routes.

---

## 🔬 Regulatory Compliance Standards Enforced

HONEY CHAIN's laboratory portal directly implements statutory chemical thresholds defined in the **Food Safety and Standards (Food Products Standards and Food Additives) Regulations, 2020**:

| Parameter | Regulatory Threshold | Prototype Validation |
|:---|:---|:---|
| **Moisture Content** | Maximum 20.0% | Flags and recalls batch if > 20.0% |
| **HMF** | Max 40 mg/kg (fresh raw), Max 80 mg/kg (tropical) | Enforces temperature & aging limit |
| **Reducing Sugars** | Minimum 65.0% | Assays inverted natural monosaccharides |
| **Sucrose Content** | Maximum 5.0% | Detects unripened sugar feeds |
| **C4 Sugars** | Zero Detection (Negative) | Detects commercial corn/cane syrups |
| **Antibiotics / Pesticides** | Below Maximum Residue Limits (MRL) | Ensures chemical residue compliance |

---

## 🛡️ Implemented Features vs. Simulated Features

### ✅ Fully Implemented Features:
1. Complete Next.js 14 App Router web application with 13 interconnected pages.
2. Canonical SHA-256 state hashing with deterministic object key sorting (`src/lib/crypto.ts`).
3. Complete Solidity smart contract (`contracts/HoneyTraceability.sol`) with role checks and event logs.
4. Unique Batch ID generation logic (`HC-2026-Hxx-Bxxx`).
5. Role-based workflows (Beekeeper, Quality Lab, Processor, Admin, Consumer).
6. 1-Click Judge Persona Switcher for hackathon evaluations.
7. QR code SVG generator and high-resolution PNG downloader.
8. Device camera QR code scanner with fallback input.
9. Interactive public consumer batch verification (`/verify`).
10. Lab assay checklist enforcing FSSAI 2020 moisture and HMF limits.
11. Processing & bottling lot logger with tamper-evident seal tracking.
12. Comprehensive production analytics with interactive Recharts visualizations.
13. Administrative oversight portal with emergency recall capability.
14. PostgreSQL / Supabase migration script with 15 entities and RLS policies.
15. 11 automated unit & integration tests passing with 100% success rate.

### 🔍 Transparently Labelled Simulated Features:
1. **IoT Sensor Feeds**: Hive brood temperature, humidity, scale weight, and acoustic frequency are simulated to demonstrate live telemetry charts and anomaly triggers. Real ESP32/LoRaWAN field nodes can connect via the documented REST endpoint `POST /api/iot/telemetry`.
2. **Blockchain Adapter**: Operates in simulated mode by default, generating cryptographically deterministic SHA-256 hashes, transaction receipts, and block heights. This ensures judges can evaluate the prototype offline or on low-bandwidth networks without requiring MetaMask or testnet gas faucets.

---

## 👥 Hackathon Team: RUDRASCRIPT
- **Competition**: Smart India Hackathon 2026
- **Problem Statement ID**: SIH26021
- **Domain**: Blockchain, AgriTech, Consumer Trust & Smart Beekeeping
