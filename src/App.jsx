import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LeftSidebarMetrics from './components/LeftSidebarMetrics';
import CenterZoneMap from './components/CenterZoneMap';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import AIRecommendationsPanel from './components/AIRecommendationsPanel';
import RightAlertPanel from './components/RightAlertPanel';
import BottomMetricsRow from './components/BottomMetricsRow';
import PrivacyShieldCCTV from './components/PrivacyShieldCCTV';
import MultilingualCommandBar from './components/MultilingualCommandBar';
import CitizenMobileSimulator from './components/CitizenMobileSimulator';
import { fetchTelemetry, fetchZones, postAction, submitIncident } from './utils/api';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard'); // 'dashboard' | 'analytics' | 'mitigation' | 'surveillance' | 'citizen'
  const [activeVenue, setActiveVenue] = useState('Kumbh Mela Sector A');
  const [simpleView, setSimpleView] = useState(true);
  const [threatLevel, setThreatLevel] = useState(28);
  const [headcount, setHeadcount] = useState(48250);

  // Simulation controls
  const [gateCBlocked, setGateCBlocked] = useState(false);
  const [vipSurge, setVipSurge] = useState(false);
  const [securityWall, setSecurityWall] = useState(false);
  const [gateBRerouted, setGateBRerouted] = useState(false);
  const [emergencyExit2Open, setEmergencyExit2Open] = useState(false);
  const [focusedSector, setFocusedSector] = useState(null);

  // Incident markers
  const [incidentMarkers, setIncidentMarkers] = useState([
    { id: 1, x: 400, y: 320, title: 'Gate C Bottleneck', sector: 'Sector 3', timestamp: '16:14' }
  ]);

  // Live telemetry polling from backend with local fallback
  useEffect(() => {
    const updateMetrics = async () => {
      const simulationState = { gateCBlocked, vipSurge, gateBRerouted, emergencyExit2Open };
      const telemetry = await fetchTelemetry(simulationState);
      if (telemetry) {
        setThreatLevel(telemetry.threatLevel);
        setHeadcount(telemetry.headcount);
      }
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 3000);
    return () => clearInterval(interval);
  }, [gateCBlocked, vipSurge, gateBRerouted, emergencyExit2Open]);

  const handleResetSimulation = () => {
    setGateCBlocked(false);
    setVipSurge(false);
    setSecurityWall(false);
    setGateBRerouted(false);
    setEmergencyExit2Open(false);
    setFocusedSector(null);
    setIncidentMarkers([]);
    setThreatLevel(28);
    postAction('gateBRerouted', false);
    postAction('emergencyExit2Open', false);
    postAction('securityWall', false);
  };

  const handleReportIncident = async (report) => {
    const newInc = {
      id: Date.now(),
      x: 300 + Math.random() * 200,
      y: 200 + Math.random() * 150,
      title: report.title,
      sector: report.sector,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setIncidentMarkers((prev) => [...prev, newInc]);
    setThreatLevel((prev) => Math.min(95, prev + 15));
    await submitIncident({ title: report.title, sector: report.sector, details: 'Reported via citizen portal' });
  };

  const handleCanvasClickAddIncident = (x, y) => {
    const newInc = {
      id: Date.now(),
      x,
      y,
      title: 'Manual Flag',
      sector: 'Sector 2',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setIncidentMarkers((prev) => [...prev, newInc]);
  };

  const handleExecuteRecommendation = async (recType) => {
    if (recType === 'REROUTE_GATE_B') {
      setGateBRerouted(true);
      await postAction('gateBRerouted', true);
    } else if (recType === 'OPEN_EXIT_2') {
      setEmergencyExit2Open(true);
      await postAction('emergencyExit2Open', true);
    } else if (recType === 'DEPLOY_SECURITY') {
      setSecurityWall(true);
      await postAction('securityWall', true);
    }
  };

  const handleTriggerPAAnnouncement = (lang, text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 
        lang === 'Hindi' ? 'hi-IN' : 
        lang === 'Bengali' ? 'bn-IN' : 
        lang === 'Marathi' ? 'mr-IN' : 
        lang === 'Odia' ? 'or-IN' : 
        lang === 'Telugu' ? 'te-IN' : 
        'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };



  const currentDensity = (threatLevel / 18).toFixed(1);

  return (
    <div className="min-h-screen bg-[#0D1B2A] text-slate-100 p-4 lg:p-6 flex flex-col gap-5 font-sans">
      {/* GLOBAL HEADER & PAGE NAVIGATION TABS */}
      <Header
        threatLevel={threatLevel}
        onResetSimulation={handleResetSimulation}
        headcount={headcount}
        activeVenue={activeVenue}
        setActiveVenue={setActiveVenue}
        activePage={activePage}
        setActivePage={setActivePage}
        simpleView={simpleView}
        setSimpleView={setSimpleView}
      />

      {/* PAGE 1: COMMAND CENTER (3-Zone Dashboard Layout) */}
      {activePage === 'dashboard' && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Sidebar (Stats) - Only visible when NOT in simple view */}
            {!simpleView && (
              <div className="lg:col-span-3">
                <LeftSidebarMetrics
                  threatLevel={threatLevel}
                  density={currentDensity}
                  flowRateIn={480}
                  flowRateOut={340}
                  hotspotCount={gateCBlocked ? 3 : 1}
                  emergencyUnits={12}
                />
              </div>
            )}

            {/* Center Zone Map */}
            <div className={simpleView ? 'lg:col-span-9' : 'lg:col-span-6'}>
              {simpleView && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="clay-card-puffy p-3 flex flex-col justify-center items-center bg-[#1B263B]">
                    <span className="text-[10px] text-slate-400 font-mono">CROWD DENSITY</span>
                    <span className="text-base font-black text-[#AEDCC0] font-heading">{currentDensity} ppl/m²</span>
                  </div>
                  <div className="clay-card-puffy p-3 flex flex-col justify-center items-center bg-[#1B263B]">
                    <span className="text-[10px] text-slate-400 font-mono">ACTIVE HOTSPOTS</span>
                    <span className="text-base font-black text-[#FF8B94] font-heading">{gateCBlocked ? 3 : 1}</span>
                  </div>
                  <div className="clay-card-puffy p-3 flex flex-col justify-center items-center bg-[#1B263B]">
                    <span className="text-[10px] text-slate-400 font-mono">FLOW RATE (IN / OUT)</span>
                    <span className="text-base font-black text-[#A8D8EA] font-heading">480 / 340</span>
                  </div>
                </div>
              )}
              <CenterZoneMap
                gateCBlocked={gateCBlocked}
                setGateCBlocked={setGateCBlocked}
                vipSurge={vipSurge}
                setVipSurge={setVipSurge}
                securityWall={securityWall}
                setSecurityWall={setSecurityWall}
                gateBRerouted={gateBRerouted}
                setGateBRerouted={setGateBRerouted}
                emergencyExit2Open={emergencyExit2Open}
                setEmergencyExit2Open={setEmergencyExit2Open}
                focusedSector={focusedSector}
                setFocusedSector={setFocusedSector}
                incidentMarkers={incidentMarkers}
                onCanvasClickAddIncident={handleCanvasClickAddIncident}
              />
            </div>

            {/* Right Alerts Feed */}
            <div className="lg:col-span-3">
              <RightAlertPanel
                setGateBRerouted={setGateBRerouted}
                setSecurityWall={setSecurityWall}
                setFocusedSector={setFocusedSector}
                setGateCBlocked={setGateCBlocked}
              />
            </div>
          </div>

          {/* Bottom Metrics Row - Only visible when NOT in simple view */}
          {!simpleView && <BottomMetricsRow threatLevel={threatLevel} />}
        </div>
      )}

      {/* PAGE 2: AI ANALYTICS & RISK FORECASTING */}
      {activePage === 'analytics' && (
        <div className="flex flex-col gap-5">
          <AnalyticsDashboard
            threatLevel={threatLevel}
            setThreatLevel={setThreatLevel}
            gateCBlocked={gateCBlocked}
            vipSurge={vipSurge}
            gateBRerouted={gateBRerouted}
            emergencyExit2Open={emergencyExit2Open}
            onExecuteRecommendation={handleExecuteRecommendation}
          />
          <BottomMetricsRow threatLevel={threatLevel} />
        </div>
      )}

      {/* PAGE 3: AI MITIGATION DIRECTIVES */}
      {activePage === 'mitigation' && (
        <div className="flex flex-col gap-5 max-w-4xl mx-auto w-full">
          <AIRecommendationsPanel
            gateBRerouted={gateBRerouted}
            setGateBRerouted={setGateBRerouted}
            emergencyExit2Open={emergencyExit2Open}
            setEmergencyExit2Open={setEmergencyExit2Open}
            securityWall={securityWall}
            setSecurityWall={setSecurityWall}
            onTriggerAnnouncement={handleTriggerPAAnnouncement}
          />
        </div>
      )}

      {/* PAGE 4: PRIVACY SHIELD CCTV & MULTILINGUAL COMMAND */}
      {activePage === 'surveillance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-6xl mx-auto w-full">
          <PrivacyShieldCCTV />
          <MultilingualCommandBar
            setFocusedSector={setFocusedSector}
            setSecurityWall={setSecurityWall}
            setGateBRerouted={setGateBRerouted}
            setGateCBlocked={setGateCBlocked}
          />
        </div>
      )}

      {/* PAGE 5: CITIZEN SAFETY MOBILE PORTAL */}
      {activePage === 'citizen' && (
        <div className="flex justify-center items-center py-6">
          <CitizenMobileSimulator
            onReportIncident={handleReportIncident}
            threatLevel={threatLevel}
          />
        </div>
      )}

      {/* FOOTER */}
      <footer className="text-center py-3 border-t border-slate-800/60 text-xs text-slate-500 font-mono tracking-widest">
        CROWDSHIELD NEXUS v1.0 • KUMBH MELA SAFETY COMMAND • CLAYMORPHISM UI •{' '}
        <span className="text-[#A8D8EA]">LIVE</span>
      </footer>
    </div>
  );
}
