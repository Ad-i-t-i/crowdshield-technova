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
    } else if (selectedLang === 'Marathi') {
      text = "कुंभमेळा सेक्टर A: कृपया गेट B कडे जा. गेट C वर प्रचंड गर्दी आहे.";
      langCode = "mr-IN";
    } else if (selectedLang === 'Odia') {
      text = "କୁମ୍ଭମେଳା ସେକ୍ଟର A: ଦୟାକରି ଗେଟ୍ B ଆଡକୁ ଯାଆନ୍ତୁ। ଗେଟ୍ C ରେ ଅତ୍ୟଧିକ ଭିଡ଼ ଅଛି।";
      langCode = "or-IN";
    } else if (selectedLang === 'Telugu') {
      text = "కుంభమేళా సెక్టార్ A: దయచేసి గేట్ B వైపు వెళ్ళండి. గేట్ C వద్ద భారీ రద్దీ ఉంది.";
      langCode = "te-IN";
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
      {/* Header */}
      <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-extrabold text-white font-heading">Citizen Mobile App</h2>
        </div>
        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/40">
          Connected
        </span>
      </div>

      {/* Smartphone Frame */}
      <div className="phone-chassis w-full max-w-[290px] h-[490px] flex flex-col bg-[#070a14] border-4 border-slate-800 rounded-[32px] shadow-2xl relative overflow-hidden">
        <div className="phone-notch" />

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-900 bg-[#0c101c]">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex-1 py-2 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'alerts' ? 'text-blue-400 border-b-2 border-blue-400 bg-[#070a14]' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>Alerts</span>
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`flex-1 py-2 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'report' ? 'text-red-400 border-b-2 border-red-400 bg-[#070a14]' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Report</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
          {activeTab === 'alerts' ? (
            <>
              {/* Multilingual Announcement */}
              <div className="p-3 rounded-2xl bg-[#0c101c] border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-200">Announcements</span>

                  <div className="flex items-center gap-1 flex-wrap">
                    {['English', 'Hindi', 'Bengali', 'Marathi', 'Odia', 'Telugu'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLang(lang)}
                        className={`px-1.5 py-0.5 rounded-lg text-[9px] font-bold ${
                          selectedLang === lang ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-[#070a14] border border-slate-800 text-xs text-slate-200 font-sans">
                  {selectedLang === 'Hindi' && 'कुंभ मेला सेक्टर A: कृपया द्वार B की तरफ बढ़ें। द्वार C पर भारी भीड़ है।'}
                  {selectedLang === 'Bengali' && 'অনুগ্রহ করে গেট বি এর দিকে যান। গেট সি এ ভিড় আছে।'}
                  {selectedLang === 'Marathi' && 'कुंभमेळा सेक्टर A: कृपया गेट B कडे जा. गेट C वर प्रचंड गर्दी आहे.'}
                  {selectedLang === 'Odia' && 'କୁମ୍ଭମେଳା ସେକ୍ଟର A: ଦୟାକରି ଗେଟ୍ B ଆଡକୁ ଯାଆନ୍ତୁ। ଗେଟ୍ C ରେ ଅତ୍ୟଧିକ ଭିଡ଼ ଅଛି।'}
                  {selectedLang === 'Telugu' && 'కుంభమేళా సెక్టార్ A: దయచేసి గేట్ B వైపు వెళ్ళండి. గేట్ C వద్ద భారీ రద్దీ ఉంది.'}
                  {selectedLang === 'English' && 'Attention Sector A: Heavy congestion at Gate C. Please move towards Gate B.'}
                </div>

                <button
                  onClick={playAudioAnnouncement}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isPlayingAudio ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-blue-900 text-blue-200 border border-blue-700'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isPlayingAudio ? 'Playing...' : 'Listen Audio Alert'}</span>
                </button>
              </div>

              {/* Congestion Cards */}
              <div className="flex flex-col gap-2">
                <div className={`p-3 rounded-2xl border text-xs flex flex-col gap-1 ${threatLevel >= 75 ? 'bg-red-950/60 border-red-500/60 text-red-200' : 'bg-amber-950/40 border-amber-500/50 text-amber-200'}`}>
                  <div className="flex items-center justify-between font-extrabold">
                    <span className="flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> Gate C Congestion
                    </span>
                    <span className="text-[10px] font-mono">{threatLevel}% RISK</span>
                  </div>
                  <p className="text-[11px] opacity-90">
                    High crowd density at Gate C exit.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#0c101c] border border-slate-800 text-xs flex flex-col gap-1 text-slate-300">
                  <div className="flex items-center justify-between font-extrabold text-blue-400">
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
            /* Report Form */
            <form onSubmit={handleSubmitReport} className="flex flex-col gap-2">
              {isSubmitted && (
                <div className="p-2 rounded-xl bg-blue-950 border border-blue-500 text-blue-200 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Report Submitted! Marker added to map.</span>
                </div>
              )}

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">INCIDENT TYPE</label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="w-full bg-[#070a14] border border-slate-800 text-slate-200 text-xs p-2 rounded-xl focus:outline-none"
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
                  className="w-full bg-[#070a14] border border-slate-800 text-slate-200 text-xs p-2 rounded-xl focus:outline-none"
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
                  className="w-full bg-[#070a14] border border-slate-800 text-slate-200 text-xs p-2 rounded-xl focus:outline-none placeholder-slate-600 resize-none font-sans"
                />
              </div>

              <button type="submit" className="clay-btn-danger w-full py-2 text-xs font-bold justify-center mt-1 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                <span>Submit Report</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
