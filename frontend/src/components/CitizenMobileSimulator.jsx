import React, { useState } from 'react';
import { Smartphone, AlertTriangle, Volume2, Send, CheckCircle2, ShieldAlert, MapPin, BellRing } from 'lucide-react';

export default function CitizenMobileSimulator({ onReportIncident, threatLevel }) {
  const [activeTab, setActiveTab] = useState('alerts');
  const [selectedLang, setSelectedLang] = useState('Hindi');
  const [incidentType, setIncidentType] = useState('Stampede Hazard');
  const [sector, setSector] = useState('Sector 3');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const playAudioAnnouncement = () => {
    setIsPlayingAudio(true);
    let text = "";
    let langCode = "hi-IN";

    if (selectedLang === 'Hindi') {
      text = "कुंभ मेला सेक्टर A: कृपया द्वार B की तरफ बढ़ें। द्वार C पर भारी भीड़ है।";
      langCode = "hi-IN";
    } else if (selectedLang === 'Bengali') {
      text = "অনুগ্রহ করে গেট বি এর দিকে যান। গেট সি এ ভিড় আছে।";
      langCode = "bn-IN";
    } else {
      text = "Attention Sector A: Heavy congestion at Gate C. Please move towards Gate B.";
      langCode = "en-US";
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.onend = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 2500);
    }
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    onReportIncident({
      title: incidentType,
      sector: sector,
      details: details || 'Citizen reported high crowd congestion.'
    });

    setIsSubmitted(true);
    setDetails('');
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="clay-card-puffy p-5 flex flex-col items-center justify-center relative">
      <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-[#A8D8EA]" />
          <h2 className="text-sm font-extrabold text-white font-heading">Citizen Mobile App</h2>
        </div>
        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#A8D8EA]/20 text-[#A8D8EA] border border-[#A8D8EA]/40">
          MERN Connected
        </span>
      </div>

      <div className="phone-chassis w-full max-w-[290px] h-[490px] flex flex-col bg-[#0D1B2A] border-4 border-slate-800 rounded-[32px] shadow-2xl relative overflow-hidden">
        <div className="phone-notch" />

        <div className="flex border-b border-slate-900 bg-[#1B263B]">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex-1 py-2 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'alerts' ? 'text-[#A8D8EA] border-b-2 border-[#A8D8EA] bg-[#0D1B2A]' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>Alerts</span>
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`flex-1 py-2 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'report' ? 'text-[#FF8B94] border-b-2 border-[#FF8B94] bg-[#0D1B2A]' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Report</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
          {activeTab === 'alerts' ? (
            <>
              <div className="p-3 rounded-2xl bg-[#1B263B] border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-200">Announcements</span>

                  <div className="flex items-center gap-1">
                    {['English', 'Hindi', 'Bengali'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLang(lang)}
                        className={`px-1.5 py-0.5 rounded-lg text-[9px] font-bold ${
                          selectedLang === lang ? 'bg-[#70A6FF] text-[#0D1B2A]' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-[#0D1B2A] border border-slate-800 text-xs text-slate-200 font-sans">
                  {selectedLang === 'Hindi' && 'कुंभ मेला सेक्टर A: कृपया द्वार B की तरफ बढ़ें। द्वार C पर भारी भीड़ है।'}
                  {selectedLang === 'Bengali' && 'অনুগ্রহ করে গেট বি এর দিকে যান। গেট সি এ ভিড় আছে।'}
                  {selectedLang === 'English' && 'Attention Sector A: Heavy congestion at Gate C. Please move towards Gate B.'}
                </div>

                <button
                  onClick={playAudioAnnouncement}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isPlayingAudio ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-[#0D1B2A] text-[#A8D8EA] border border-[#A8D8EA]/40'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isPlayingAudio ? 'Playing...' : 'Listen Audio Alert'}</span>
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <div className={`p-3 rounded-2xl border text-xs flex flex-col gap-1 ${threatLevel >= 75 ? 'bg-red-950/60 border-[#FF8B94] text-red-200' : 'bg-amber-950/40 border-amber-500/50 text-amber-200'}`}>
                  <div className="flex items-center justify-between font-extrabold">
                    <span className="flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-[#FF8B94]" /> Gate C Congestion
                    </span>
                    <span className="text-[10px] font-mono">{threatLevel}% RISK</span>
                  </div>
                  <p className="text-[11px] opacity-90">
                    High crowd density at Gate C exit.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#1B263B] border border-slate-800 text-xs flex flex-col gap-1 text-slate-300">
                  <div className="flex items-center justify-between font-extrabold text-[#AEDCC0]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> Recommended Route
                    </span>
                    <span className="text-[10px] font-mono">GATE B</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Gate B exit has normal flow velocity.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmitReport} className="flex flex-col gap-2">
              {isSubmitted && (
                <div className="p-2 rounded-xl bg-[#AEDCC0]/20 border border-[#AEDCC0] text-[#AEDCC0] text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#AEDCC0]" />
                  <span>Report Submitted! Sent to MERN Backend.</span>
                </div>
              )}

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">INCIDENT TYPE</label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="w-full bg-[#0D1B2A] border border-slate-800 text-slate-200 text-xs p-2 rounded-xl focus:outline-none"
                >
                  <option value="Stampede Hazard">Stampede Hazard</option>
                  <option value="Gate Bottleneck Jam">Gate Bottleneck Jam</option>
                  <option value="Medical Emergency">Medical Emergency</option>
                  <option value="Fire Hazard">Fire Hazard</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">SECTOR LOCATION</label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full bg-[#0D1B2A] border border-slate-800 text-slate-200 text-xs p-2 rounded-xl focus:outline-none"
                >
                  <option value="Sector 1">Sector 1 (North Plaza)</option>
                  <option value="Sector 2">Sector 2 (Central Corridor)</option>
                  <option value="Sector 3">Sector 3 (Gate C South)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">DETAILS</label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe situation..."
                  rows={2}
                  className="w-full bg-[#0D1B2A] border border-slate-800 text-slate-200 text-xs p-2 rounded-xl focus:outline-none placeholder-slate-600 resize-none font-sans"
                />
              </div>

              <button type="submit" className="clay-btn-coral w-full py-2 text-xs font-bold justify-center mt-1">
                <Send className="w-3.5 h-3.5" />
                <span>Submit Incident</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
