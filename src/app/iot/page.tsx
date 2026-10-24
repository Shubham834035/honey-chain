'use client';

// =====================================================================================
// HONEY CHAIN — Smart Hive IoT Telemetry & Anomaly Detection (/iot)
// Smart India Hackathon 2026 (SIH26021) — Team RUDRASCRIPT
// =====================================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useHoney } from '@/context/HoneyContext';
import {
  Activity,
  Radio,
  Thermometer,
  Droplets,
  Scale,
  Bell,
  AlertTriangle,
  Battery,
  Wifi,
  Sparkles,
  Info,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function IotMonitoringPage() {
  const { state } = useHoney();

  const [selectedHiveId, setSelectedHiveId] = useState<string>('hive-hp-001');

  const selectedHive = state.hives.find((h) => h.id === selectedHiveId) || state.hives[0];

  // Realistic 24-hour hourly telemetry dataset (Clearly labelled Simulated Demo Data)
  const simulatedHistory = [
    { time: '00:00', temp: 34.2, humidity: 62, weight: 42.5, acoustics: 175 },
    { time: '04:00', temp: 34.0, humidity: 64, weight: 42.5, acoustics: 170 },
    { time: '08:00', temp: 34.6, humidity: 60, weight: 42.6, acoustics: 185 },
    { time: '12:00', temp: 35.4, humidity: 55, weight: 42.8, acoustics: 210 },
    { time: '16:00', temp: 35.1, humidity: 57, weight: 43.1, acoustics: 195 },
    { time: '20:00', temp: 34.8, humidity: 59, weight: 42.7, acoustics: 182 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Simulation Transparency Banner */}
      <div className="bg-amber-100/80 border border-amber-300 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2.5">
          <Info className="w-5 h-5 text-amber-700 shrink-0" />
          <p className="text-[#6B3F20] leading-relaxed">
            <strong className="text-gray-900">Prototype Notice — Simulated Telemetry:</strong> All sensor data streams on this screen are generated for SIH evaluation. Real ESP32/LoRaWAN field telemetry connects via the REST/MQTT gateway documented below.
          </p>
        </div>
        <span className="bg-amber-200 text-[#6B3F20] font-mono text-[10px] font-bold px-2 py-1 rounded shrink-0">
          DEMO DATA / SIMULATION
        </span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs text-blue-800 font-bold bg-blue-100 px-2.5 py-0.5 rounded-full mb-1">
            <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>Smart Beekeeping Telemetry</span>
          </div>
          <h1 className="text-3xl font-black text-[#6B3F20]">IoT Hive Monitoring</h1>
          <p className="text-xs text-gray-600">
            Real-time colony brood temperature, relative humidity, load-cell scale weight, and acoustic swarming frequency.
          </p>
        </div>

        {/* Hive Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-gray-600">Select Hive:</span>
          <select
            value={selectedHiveId}
            onChange={(e) => setSelectedHiveId(e.target.value)}
            className="text-xs font-mono font-bold border border-amber-200 rounded-xl px-3 py-2 bg-white text-[#6B3F20] focus:ring-2 focus:ring-[#F4A623]"
          >
            {state.hives.map((h) => (
              <option key={h.id} value={h.id}>
                {h.hiveId} ({h.farmName.split(' ')[0]}) — {h.status.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Telemetry Gauges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Internal Brood Temperature */}
        <div className="cream-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Brood Temperature</span>
            <Thermometer className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-[#6B3F20]">
            {selectedHive.currentTempC || 34.8}°C
          </div>
          <div className="text-[11px] text-emerald-700 flex items-center space-x-1 font-medium">
            <CheckCircle2 className="w-3 h-3" />
            <span>Optimal brood range (34.5 - 35.5°C)</span>
          </div>
        </div>

        {/* Relative Humidity */}
        <div className="cream-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Relative Humidity</span>
            <Droplets className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-[#6B3F20]">
            {selectedHive.currentHumidity || 58}%
          </div>
          <div className="text-[11px] text-gray-600">
            Field target: 50 - 65% RH
          </div>
        </div>

        {/* Hive Load Weight */}
        <div className="cream-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Hive Weight (Scale)</span>
            <Scale className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-[#6B3F20]">
            {selectedHive.currentWeightKg || 42.6} <span className="text-sm font-semibold text-gray-500">kg</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">
            +0.4 kg nectar intake (24h)
          </div>
        </div>

        {/* Acoustic Colony Hum */}
        <div className="cream-card p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Acoustic Frequency</span>
            <Activity className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-[#6B3F20]">
            185.0 <span className="text-sm font-semibold text-gray-500">Hz</span>
          </div>
          <div className="text-[11px] text-gray-600">
            Calm colony hum (&lt; 250 Hz)
          </div>
        </div>
      </div>

      {/* Historical Telemetry Chart */}
      <div className="cream-card p-6 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-base text-[#6B3F20]">
              24-Hour Telemetry Telemetry Trends — {selectedHive.hiveId}
            </h3>
            <p className="text-xs text-gray-500">
              Simulated time-series for temperature, humidity, and colony weight
            </p>
          </div>
          <span className="text-[10px] bg-amber-100 text-[#6B3F20] font-bold px-2 py-1 rounded">
            Hourly Ingestion Window
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={simulatedHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} domain={[30, 40]} unit="°C" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} domain={[40, 80]} unit="%" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-md text-xs space-y-1">
                        <p className="font-bold text-[#6B3F20]">{data.time}</p>
                        <p className="text-amber-700">Temperature: {data.temp}°C</p>
                        <p className="text-blue-600">Humidity: {data.humidity}%</p>
                        <p className="text-purple-600">Weight: {data.weight} kg</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="temp"
                name="Brood Temp (°C)"
                stroke="#F4A623"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="humidity"
                name="Humidity (%)"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Anomaly Alerts & Hardware Connectivity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Anomaly Alerts */}
        <div className="cream-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-[#6B3F20]">Active Telemetry Alerts</h3>
            <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
              {state.alerts.filter((a) => !a.isResolved).length} Active
            </span>
          </div>

          <div className="space-y-3">
            {state.alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3.5 rounded-2xl bg-white border border-amber-100 flex items-start space-x-3 text-xs"
              >
                <AlertTriangle
                  className={`w-5 h-5 shrink-0 mt-0.5 ${
                    alert.severity === 'critical' ? 'text-red-600' : 'text-amber-600'
                  }`}
                />
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900">{alert.title}</span>
                    <span className="font-mono text-[10px] text-gray-400">{alert.hiveCode || alert.batchId}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hardware Interface Specification for Real ESP32 / LoRaWAN */}
        <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="font-extrabold text-sm text-[#6B3F20]">
              Hardware Integration Interface (Real Device API)
            </h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
              Ready for ESP32
            </span>
          </div>

          <p className="text-gray-600 leading-relaxed">
            Real solar-powered ESP32 microcontroller nodes push sensor packets via HTTP POST or MQTT to our ingest endpoint:
          </p>

          <pre className="bg-gray-900 text-amber-300 p-3.5 rounded-xl text-[10px] font-mono overflow-x-auto leading-relaxed">
{`POST /api/iot/telemetry
Content-Type: application/json
X-Device-Token: hg_secret_98f21

{
  "deviceId": "IOT-HIVE-HP01",
  "hiveId": "HIV-HP-001",
  "tempC": 34.8,
  "humidity": 58.2,
  "weightKg": 42.6,
  "acousticHz": 185.0,
  "batteryPct": 94
}`}
          </pre>

          <div className="text-[11px] text-gray-500 italic">
            Automated alerts trigger when temperature exceeds 36.5°C or acoustic frequency exceeds 450 Hz (indicating impending swarm departure).
          </div>
        </div>
      </div>
    </div>
  );
}
