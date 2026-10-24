'use client';

// =====================================================================================
// HONEY CHAIN — Reactive Context Provider & State Hook
// Smart India Hackathon 2026 (SIH26021) — Team RUDRASCRIPT
// =====================================================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  HoneyChainState,
  honeyStore,
  DEMO_USERS,
} from '@/lib/store';
import { UserProfile, UserRole, Hive, Harvest, HoneyBatch, QualityTest } from '@/types';

interface HoneyContextType {
  state: HoneyChainState;
  currentUser: UserProfile;
  switchRole: (role: UserRole) => void;
  resetDemoData: () => void;
  addHive: (hiveData: Omit<Hive, 'id'>) => Hive;
  addHarvest: (harvestData: Omit<Harvest, 'id' | 'harvestId' | 'isBatched'>) => Harvest;
  createBatch: (harvestId: string, variety: string, quantityKg: number) => Promise<HoneyBatch>;
  submitQualityTest: (batchId: string, testData: any) => Promise<QualityTest>;
  recordProcessingAndPackaging: (batchId: string, processData: any) => Promise<void>;
  flagBatch: (batchId: string, reason: string) => void;
  refreshState: () => void;
}

const HoneyContext = createContext<HoneyContextType | undefined>(undefined);

export function HoneyProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<HoneyChainState>(honeyStore.getState());

  const refreshState = () => {
    setState({ ...honeyStore.getState() });
  };

  useEffect(() => {
    // Sync with localStorage on client mount
    refreshState();
  }, []);

  const switchRole = (role: UserRole) => {
    honeyStore.switchRole(role);
    refreshState();
  };

  const resetDemoData = () => {
    honeyStore.resetToDefault();
    refreshState();
  };

  const addHive = (hiveData: Omit<Hive, 'id'>) => {
    const res = honeyStore.addHive(hiveData);
    refreshState();
    return res;
  };

  const addHarvest = (harvestData: Omit<Harvest, 'id' | 'harvestId' | 'isBatched'>) => {
    const res = honeyStore.addHarvest(harvestData);
    refreshState();
    return res;
  };

  const createBatch = async (harvestId: string, variety: string, quantityKg: number) => {
    const res = await honeyStore.createBatchFromHarvest(harvestId, variety, quantityKg);
    refreshState();
    return res;
  };

  const submitQualityTest = async (batchId: string, testData: any) => {
    const res = await honeyStore.submitQualityTest(batchId, testData);
    refreshState();
    return res;
  };

  const recordProcessingAndPackaging = async (batchId: string, processData: any) => {
    await honeyStore.recordProcessingAndPackaging(batchId, processData);
    refreshState();
  };

  const flagBatch = (batchId: string, reason: string) => {
    honeyStore.flagBatch(batchId, reason, state.currentUser.fullName, state.currentUser.role);
    refreshState();
  };

  return (
    <HoneyContext.Provider
      value={{
        state,
        currentUser: state.currentUser,
        switchRole,
        resetDemoData,
        addHive,
        addHarvest,
        createBatch,
        submitQualityTest,
        recordProcessingAndPackaging,
        flagBatch,
        refreshState,
      }}
    >
      {children}
    </HoneyContext.Provider>
  );
}

export function useHoney() {
  const context = useContext(HoneyContext);
  if (!context) {
    throw new Error('useHoney must be used within a HoneyProvider');
  }
  return context;
}
