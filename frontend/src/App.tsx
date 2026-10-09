import React, { useState, useEffect, useCallback } from 'react';
import { BackgroundGrid } from './components/common/BackgroundGrid';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { HeroBanner } from './components/common/HeroBanner';
import { KpiCards } from './components/dashboard/KpiCards';
import { ThreatActivityChart } from './components/dashboard/ThreatActivityChart';
import { ThreatDistribution } from './components/dashboard/ThreatDistribution';
import { LiveEventFeed } from './components/dashboard/LiveEventFeed';
import { ThreatAnalyzerPanel } from './components/analyzer/ThreatAnalyzerPanel';
import { PredictionResultCard } from './components/analyzer/PredictionResultCard';
import { EventHistoryTable } from './components/history/EventHistoryTable';
import { ModelInsightsView } from './components/insights/ModelInsightsView';
import { SignatureSandbox } from './components/crypto/SignatureSandbox';

import { api } from './services/api';
import {
  KpiData,
  ActivityBucket,
  ThreatDistributionData,
  SecurityEvent,
  PredictionPayload,
  PredictionResult,
  ModelInsightsData,
} from './types';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [backendOnline, setBackendOnline] = useState<boolean>(true);

  // Data states
  const [kpis, setKpis] = useState<KpiData | null>(null);
  const [activityData, setActivityData] = useState<ActivityBucket[]>([]);
  const [activeRange, setActiveRange] = useState<'1h' | '24h' | '7d' | 'all'>('24h');
  const [distributionData, setDistributionData] = useState<ThreatDistributionData | null>(null);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [totalEvents, setTotalEvents] = useState<number>(0);
  const [modelInsights, setModelInsights] = useState<ModelInsightsData | null>(null);

  // Threat Analyzer state
  const [analyzerInitialValues, setAnalyzerInitialValues] = useState<Partial<PredictionPayload> | null>(null);
  const [latestPrediction, setLatestPrediction] = useState<PredictionResult | null>(null);

  // Loading & Async states
  const [loadingKpis, setLoadingKpis] = useState<boolean>(true);
  const [loadingActivity, setLoadingActivity] = useState<boolean>(true);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(true);
  const [loadingInsights, setLoadingInsights] = useState<boolean>(true);
  const [analyzingThreat, setAnalyzingThreat] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch all core dashboard metrics
  const refreshDashboardData = useCallback(async () => {
    try {
      const [kpiRes, actRes, distRes, evtRes] = await Promise.all([
        api.getKpis(),
        api.getActivity(activeRange),
        api.getDistribution(),
        api.getEvents({ limit: 50 }),
      ]);
      setKpis(kpiRes);
      setActivityData(actRes.data);
      setDistributionData(distRes);
      setEvents(evtRes.events);
      setTotalEvents(evtRes.total);
      setBackendOnline(true);
      setErrorMessage(null);
    } catch (err) {
      console.error('Error fetching dashboard telemetry:', err);
      setBackendOnline(false);
      setErrorMessage('Backend communication offline. Ensure FastAPI is running on port 8000.');
    } finally {
      setLoadingKpis(false);
      setLoadingActivity(false);
      setLoadingEvents(false);
    }
  }, [activeRange]);

  // Range change
  const handleRangeChange = async (range: '1h' | '24h' | '7d' | 'all') => {
    setActiveRange(range);
    setLoadingActivity(true);
    try {
      const res = await api.getActivity(range);
      setActivityData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingActivity(false);
    }
  };

  // Initial data load
  useEffect(() => {
    refreshDashboardData();
  }, [refreshDashboardData]);

  // Load Model Insights if tab is opened
  useEffect(() => {
    if (currentTab === 'insights' && !modelInsights) {
      setLoadingInsights(true);
      api
        .getModelInsights()
        .then((res) => {
          setModelInsights(res);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoadingInsights(false));
    }
  }, [currentTab, modelInsights]);

  // Handle Threat Analyzer Submit
  const handleAnalyzeThreat = async (payload: PredictionPayload) => {
    setAnalyzingThreat(true);
    try {
      const res = await api.predict(payload);
      setLatestPrediction(res);
      // Refresh KPIs and events list with the newly logged event
      refreshDashboardData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Threat analysis failed');
    } finally {
      setAnalyzingThreat(false);
    }
  };

  // Inspect event from feed or table
  const handleInspectEvent = (evt: SecurityEvent) => {
    setAnalyzerInitialValues({
      failed_attempts: evt.failed_attempts,
      requests_per_minute: evt.requests_per_minute,
      unknown_device: evt.unknown_device,
      revoked_key_used: evt.revoked_key_used,
      invalid_signature: evt.invalid_signature,
      source_ip: evt.source_ip,
      key_id: evt.key_id,
    });
    setCurrentTab('analyzer');
  };

  // Trigger attack vector simulation
  const handleSimulateAttack = async () => {
    setIsSimulating(true);
    try {
      await api.simulateFeedEvents(3);
      await refreshDashboardData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Reset telemetry history
  const handleResetHistory = async () => {
    if (confirm('Reset session event store to benchmark initial seeds?')) {
      try {
        await api.resetEvents();
        await refreshDashboardData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Filter handlers for history table
  const handleSearchChange = async (search: string) => {
    setLoadingEvents(true);
    try {
      const res = await api.getEvents({ search, limit: 50 });
      setEvents(res.events);
      setTotalEvents(res.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleRiskFilterChange = async (risk: string) => {
    setLoadingEvents(true);
    try {
      const res = await api.getEvents({ risk, limit: 50 });
      setEvents(res.events);
      setTotalEvents(res.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEvents(false);
    }
  };

  const handlePredictionFilterChange = async (prediction: string) => {
    setLoadingEvents(true);
    try {
      const res = await api.getEvents({ prediction, limit: 50 });
      setEvents(res.events);
      setTotalEvents(res.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEvents(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-950 text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500/20 selection:text-neon-cyan">
      {/* Background Animated Canvas & Grid */}
      <BackgroundGrid />

      {/* Collapsible Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        backendOnline={backendOnline}
      />

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 flex-1 flex flex-col min-h-screen ${
          sidebarCollapsed ? 'pl-20' : 'pl-0 sm:pl-64'
        }`}
      >
        {/* Top Header */}
        <Header
          onSimulate={handleSimulateAttack}
          onRefresh={refreshDashboardData}
          isSimulating={isSimulating}
        />

        {/* Global Error Notice if Offline */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs font-mono text-rose-300 flex items-center justify-between">
            <span>⚠️ {errorMessage}</span>
            <button
              onClick={refreshDashboardData}
              className="px-2.5 py-1 rounded bg-rose-900/60 hover:bg-rose-800 text-white font-bold"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Dynamic Tab Body */}
        <main className="flex-1 p-5 md:p-8 space-y-7 max-w-7xl w-full mx-auto relative z-10">
          {/* TAB: OVERVIEW */}
          {currentTab === 'overview' && (
            <>
              {/* 1. Hero Section */}
              <HeroBanner
                onOpenAnalyzer={() => setCurrentTab('analyzer')}
                onOpenInsights={() => setCurrentTab('insights')}
              />

              {/* 2. KPI Cards */}
              <KpiCards kpis={kpis} loading={loadingKpis} />

              {/* 3. Large Threat Activity Chart */}
              <ThreatActivityChart
                data={activityData}
                loading={loadingActivity}
                onRangeChange={handleRangeChange}
                activeRange={activeRange}
              />

              {/* 4. Threat Distribution Breakdown */}
              <ThreatDistribution data={distributionData} loading={loadingKpis} />

              {/* 5. Live SOC Telemetry Event Feed */}
              <LiveEventFeed
                events={events}
                onInspectEvent={handleInspectEvent}
                onSimulateTick={handleSimulateAttack}
              />
            </>
          )}

          {/* TAB: THREAT ANALYZER */}
          {currentTab === 'analyzer' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7">
                  <ThreatAnalyzerPanel
                    onAnalyze={handleAnalyzeThreat}
                    loading={analyzingThreat}
                    initialValues={analyzerInitialValues}
                  />
                </div>
                <div className="lg:col-span-5">
                  <PredictionResultCard result={latestPrediction} />
                </div>
              </div>

              {/* Recent events strip for quick reference */}
              <LiveEventFeed
                events={events}
                onInspectEvent={handleInspectEvent}
                onSimulateTick={handleSimulateAttack}
              />
            </div>
          )}

          {/* TAB: TELEMETRY HISTORY */}
          {currentTab === 'history' && (
            <EventHistoryTable
              events={events}
              total={totalEvents}
              loading={loadingEvents}
              onSearchChange={handleSearchChange}
              onRiskFilterChange={handleRiskFilterChange}
              onPredictionFilterChange={handlePredictionFilterChange}
              onReset={handleResetHistory}
              onInspect={handleInspectEvent}
            />
          )}

          {/* TAB: MODEL INSIGHTS */}
          {currentTab === 'insights' && (
            <ModelInsightsView insights={modelInsights} loading={loadingInsights} />
          )}

          {/* TAB: CRYPTOGRAPHIC SIGNATURE SANDBOX */}
          {currentTab === 'crypto' && (
            <SignatureSandbox
              onSendToAnalyzer={(invalidSig) => {
                setAnalyzerInitialValues({
                  invalid_signature: invalidSig,
                  failed_attempts: invalidSig ? 3 : 0,
                  requests_per_minute: invalidSig ? 18 : 6,
                  unknown_device: invalidSig ? 1 : 0,
                  revoked_key_used: 0,
                });
                setCurrentTab('analyzer');
              }}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="mt-auto px-6 py-4 border-t border-sky-900/30 text-center text-xs font-mono text-slate-500 bg-cyber-950/60 backdrop-blur-md">
          QuantumShield SOC · Quantum-Inspired Cyber Threat Detection for Digital Signature Security · Research Prototype
        </footer>
      </div>
    </div>
  );
};

export default App;
