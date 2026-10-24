-- =====================================================================================
-- HONEY CHAIN — DATABASE MIGRATION SCRIPT
-- Smart India Hackathon 2026 (SIH26021) — Team RUDRASCRIPT
-- =====================================================================================

-- 1. PROFILES (Users and Role Management)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL CHECK (role IN ('beekeeper', 'laboratory', 'processor', 'admin', 'consumer')),
    organization_name VARCHAR(255),
    license_number VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    wallet_address VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FARMS
CREATE TABLE IF NOT EXISTS farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beekeeper_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    general_location VARCHAR(255) NOT NULL, -- Coarse location for public verification privacy
    precise_coordinates VARCHAR(100),       -- Private coordinate field (accessible only by owner/admin)
    elevation_meters INT,
    dominant_flora TEXT[] DEFAULT '{}',
    established_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. HIVES
CREATE TABLE IF NOT EXISTS hives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hive_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., HIV-KA-001
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    hive_type VARCHAR(100) DEFAULT 'Langstroth',
    species VARCHAR(100) DEFAULT 'Apis cerana indica', -- Indian Honey Bee or Apis mellifera
    queen_year INT,
    status VARCHAR(50) DEFAULT 'healthy' CHECK (status IN ('healthy', 'active', 'attention_required', 'dormant', 'quarantined')),
    installation_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. HIVE INSPECTIONS
CREATE TABLE IF NOT EXISTS hive_inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hive_id UUID NOT NULL REFERENCES hives(id) ON DELETE CASCADE,
    inspector_id UUID NOT NULL REFERENCES profiles(id),
    inspection_date DATE NOT NULL,
    queen_spotted BOOLEAN DEFAULT TRUE,
    brood_pattern VARCHAR(50) DEFAULT 'solid', -- solid, spotty, poor
    temperament VARCHAR(50) DEFAULT 'calm',
    pest_detected TEXT[] DEFAULT '{}', -- varroa_mite, wax_moth, none
    honey_stores_estimate_kg NUMERIC(6,2) DEFAULT 0.0,
    action_taken TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. HARVESTS
CREATE TABLE IF NOT EXISTS harvests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    harvest_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., HRV-2026-001
    hive_id UUID NOT NULL REFERENCES hives(id) ON DELETE RESTRICT,
    beekeeper_id UUID NOT NULL REFERENCES profiles(id),
    harvest_date DATE NOT NULL,
    quantity_kg NUMERIC(8,2) NOT NULL CHECK (quantity_kg > 0),
    flora_source VARCHAR(150) NOT NULL, -- e.g., Mustard, Eucalyptus, Multifloral, Sidr, Lychee
    harvest_method VARCHAR(100) DEFAULT 'centrifugal_extraction',
    moisture_field_reading NUMERIC(4,1),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. HONEY BATCHES
CREATE TABLE IF NOT EXISTS honey_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., HC-2026-H04-B001
    harvest_id UUID NOT NULL REFERENCES harvests(id) ON DELETE RESTRICT,
    beekeeper_id UUID NOT NULL REFERENCES profiles(id),
    variety VARCHAR(150) NOT NULL,
    initial_quantity_kg NUMERIC(8,2) NOT NULL,
    remaining_quantity_kg NUMERIC(8,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Harvested' CHECK (status IN (
        'Harvested',
        'QualityTestingPending',
        'QualityVerified',
        'Processing',
        'Packaged',
        'ReadyForDistribution',
        'RecalledOrFlagged'
    )),
    canonical_hash VARCHAR(66) NOT NULL, -- 0x... 32-byte hex string
    on_chain_tx_hash VARCHAR(100),
    block_number BIGINT,
    qr_code_svg TEXT,
    public_verification_slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. QUALITY TESTS (Laboratory Verification)
CREATE TABLE IF NOT EXISTS quality_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES honey_batches(id) ON DELETE CASCADE,
    laboratory_id UUID NOT NULL REFERENCES profiles(id),
    test_report_id VARCHAR(100) UNIQUE NOT NULL,
    test_date DATE NOT NULL,
    moisture_percentage NUMERIC(4,2) NOT NULL, -- FSSAI max 20%
    hmf_mg_per_kg NUMERIC(6,2) NOT NULL,       -- FSSAI max 80 mg/kg (fresh < 40)
    reducing_sugars_percentage NUMERIC(5,2),   -- FSSAI min 65%
    sucrose_percentage NUMERIC(5,2),           -- FSSAI max 5%
    pollen_count_dominant VARCHAR(150),
    c4_sugar_adulteration_detected BOOLEAN DEFAULT FALSE,
    antibiotic_residue_detected BOOLEAN DEFAULT FALSE,
    passed_regulatory_standard BOOLEAN NOT NULL,
    certifying_officer_name VARCHAR(255) NOT NULL,
    lab_report_hash VARCHAR(66) NOT NULL,
    report_document_url TEXT,
    lab_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PROCESSING EVENTS
CREATE TABLE IF NOT EXISTS processing_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES honey_batches(id) ON DELETE CASCADE,
    processor_id UUID NOT NULL REFERENCES profiles(id),
    process_type VARCHAR(100) NOT NULL, -- gentle_microfiltration, cold_settling, moisture_conditioning
    input_quantity_kg NUMERIC(8,2) NOT NULL,
    output_quantity_kg NUMERIC(8,2) NOT NULL,
    max_temperature_celsius NUMERIC(4,1) NOT NULL, -- Cold extraction keeps <= 40°C
    filter_mesh_size VARCHAR(50),
    process_date DATE NOT NULL,
    facility_location VARCHAR(255) NOT NULL,
    parameters_hash VARCHAR(66) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PACKAGING RECORDS
CREATE TABLE IF NOT EXISTS packaging_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES honey_batches(id) ON DELETE CASCADE,
    packager_id UUID NOT NULL REFERENCES profiles(id),
    packaging_lot_number VARCHAR(100) NOT NULL,
    package_type VARCHAR(100) DEFAULT 'Glass Jar',
    unit_size_grams INT NOT NULL, -- e.g., 250g, 500g, 1000g
    total_units_packaged INT NOT NULL,
    packaging_date DATE NOT NULL,
    best_before_date DATE NOT NULL,
    tamper_evident_seal_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TRACEABILITY EVENTS (Immutable Timeline Log)
CREATE TABLE IF NOT EXISTS traceability_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES honey_batches(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    event_title VARCHAR(255) NOT NULL,
    event_description TEXT NOT NULL,
    actor_id UUID REFERENCES profiles(id),
    actor_name VARCHAR(255) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    event_hash VARCHAR(66) NOT NULL,
    previous_event_hash VARCHAR(66),
    on_chain_tx_hash VARCHAR(100),
    location_summary VARCHAR(255),
    event_timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 11. BLOCKCHAIN RECORDS
CREATE TABLE IF NOT EXISTS blockchain_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES honey_batches(id) ON DELETE CASCADE,
    network_name VARCHAR(50) DEFAULT 'Simulated Ethereum L2' NOT NULL,
    contract_address VARCHAR(100) NOT NULL,
    transaction_hash VARCHAR(100) NOT NULL,
    block_number BIGINT NOT NULL,
    canonical_state_hash VARCHAR(66) NOT NULL,
    verification_mode VARCHAR(50) DEFAULT 'simulated' CHECK (verification_mode IN ('simulated', 'live_on_chain')),
    gas_used BIGINT,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. SENSOR DEVICES (Smart Beekeeping IoT)
CREATE TABLE IF NOT EXISTS sensor_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., IOT-HIVE-K04
    hive_id UUID NOT NULL REFERENCES hives(id) ON DELETE CASCADE,
    device_model VARCHAR(100) DEFAULT 'HoneyGuard-ESP32-V2',
    hardware_version VARCHAR(50) DEFAULT 'v2.4',
    battery_percentage INT DEFAULT 94,
    status VARCHAR(50) DEFAULT 'online' CHECK (status IN ('online', 'offline', 'low_battery', 'maintenance')),
    last_ping TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. SENSOR READINGS (Telemetry)
CREATE TABLE IF NOT EXISTS sensor_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES sensor_devices(id) ON DELETE CASCADE,
    temperature_celsius NUMERIC(5,2) NOT NULL,
    humidity_percentage NUMERIC(5,2) NOT NULL,
    weight_kg NUMERIC(6,2) NOT NULL,
    acoustic_frequency_hz NUMERIC(6,1), -- Swarm detection acoustic frequency (normal 150-250 Hz, swarm > 450 Hz)
    is_simulated BOOLEAN DEFAULT TRUE,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. ALERTS
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hive_id UUID REFERENCES hives(id) ON DELETE CASCADE,
    batch_id UUID REFERENCES honey_batches(id) ON DELETE SET NULL,
    severity VARCHAR(50) DEFAULT 'warning' CHECK (severity IN ('info', 'warning', 'critical')),
    alert_type VARCHAR(100) NOT NULL, -- e.g., 'temperature_spike', 'swarm_risk', 'moisture_anomaly', 'tamper_flag'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(50),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================================================
CREATE INDEX IF NOT EXISTS idx_honey_batches_batch_id ON honey_batches(batch_id);
CREATE INDEX IF NOT EXISTS idx_honey_batches_slug ON honey_batches(public_verification_slug);
CREATE INDEX IF NOT EXISTS idx_traceability_events_batch_id ON traceability_events(batch_id);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_device_time ON sensor_readings(device_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_quality_tests_batch_id ON quality_tests(batch_id);
CREATE INDEX IF NOT EXISTS idx_hives_farm_id ON hives(farm_id);
CREATE INDEX IF NOT EXISTS idx_harvests_hive_id ON harvests(hive_id);

-- =====================================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE hives ENABLE ROW LEVEL SECURITY;
ALTER TABLE harvests ENABLE ROW LEVEL SECURITY;
ALTER TABLE honey_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE traceability_events ENABLE ROW LEVEL SECURITY;

-- Public can read verified honey batches and public traceability events
CREATE POLICY "Public batches verification read" ON honey_batches FOR SELECT USING (true);
CREATE POLICY "Public traceability events read" ON traceability_events FOR SELECT USING (true);
CREATE POLICY "Public quality tests read" ON quality_tests FOR SELECT USING (true);
