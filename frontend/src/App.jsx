import React, { useState } from 'react';
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

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [activeVenue, setActiveVenue] = useState('Kumbh Mela Sector A');
  const [threatLevel, setThreatLevel] = useState(28);
  const [headcount, setHeadcount] = useState(48250);

  const [gateCBlocked, setGateCBlocked] = useState(false);
  const [vipSurge, setVipSurge] = useState(false);
  const [securityWall, setSecurityWall] = useState(false);
  const [gateBRerouted, setGateBRerouted] = useState(false);
  const [emergencyExit2Open, setEmergencyExit2Open] = useState(false);
  const [focusedSector, setFocusedSector] = useState(null);

  const [incidentMarkers, setIncidentMarkers] = useState([
    { id: 1, x: 400, y: 320, title: 'Gate C Bottleneck', sector: 'Sector 3', timestamp: '16:14' }
  ]);

  const handleResetSimulation = () => {
    setGateCBlocked(false);
    setVipSurge(false);
    setSecurityWall(false);
    setGateBRerouted(false);
    setEmergencyExit2Open(false);
    setFocusedSector(null);
    setIncidentMarkers([]);
    setThreatLevel(28);
  };

  const handleReportIncident = (report) => {
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

  const handleExecuteRecommendation = (recType) => {
    if (recType === 'REROUTE_GATE_B') setGateBRerouted(true);
    else if (recType === 'OPEN_EXIT_2') setEmergencyExit2Open(true);
    else if (recType === 'DEPLOY_SECURITY') setSecurityWall(true);
  };

  const handleTriggerPAAnnouncement = (lang, text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'Hindi' ? 'hi-IN' : lang === 'Bengali' ? 'bn-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const currentDensity = (threatLevel / 18).toFixed(1);

  return (
    <div className="min-h-screen bg-[#0D1B2A] text-slate-100 p-4 lg:p-6 flex flex-col gap-5 font-sans">
      <Header
        threatLevel={threatLevel}
        onResetSimulation={handleResetSimulation}
        headcount={headcount}
        activeVenue={activeVenue}
        setActiveVenue={setActiveVenue}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {activePage === 'dashboard' && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
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

            <div className="lg:col-span-6">
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

            <div className="lg:col-span-3">
              <RightAlertPanel
                setGateBRerouted={setGateBRerouted}
                setSecurityWall={setSecurityWall}
                setFocusedSector={setFocusedSector}
                setGateCBlocked={setGateCBlocked}
              />
            </div>
          </div>

          <BottomMetricsRow threatLevel={threatLevel} />
        </div>
      )}

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

      {activePage === 'citizen' && (
        <div className="flex justify-center items-center py-6">
          <CitizenMobileSimulator
            onReportIncident={handleReportIncident}
            threatLevel={threatLevel}
          />
        </div>
      )}

      <footer className="text-center py-3 border-t border-slate-800 text-xs text-slate-500 font-mono">
        MERN STACK ARCHITECTURE • FRONTEND / BACKEND SEPARATED
      </footer>
    </div>
  );
}
