import React, { useState } from 'react';
import { Mic, Terminal, Volume2, Globe2 } from 'lucide-react';

export default function MultilingualCommandBar({ 
  setFocusedSector, 
  setSecurityWall, 
  setGateBRerouted, 
  setGateCBlocked 
}) {
  const [commandInput, setCommandInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [lastLog, setLastLog] = useState('Voice & text command system active.');
  const [language, setLanguage] = useState('English');

  const speakAudioResponse = (text, langCode = 'en-US') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      window.speechSynthesis.speak(utterance);
    }
  };

  const processCommand = (cmdText) => {
    if (!cmdText.trim()) return;
    const cmd = cmdText.toLowerCase();
    let responseMsg = '';

    if (cmd.includes('focus sector 2') || cmd.includes('sector 2')) {
      setFocusedSector('Sector 2');
      responseMsg = 'Sector 2 focused on Digital Twin map.';
      speakAudioResponse('Focusing Sector 2', 'en-US');
    } else if (cmd.includes('alert zone a in hindi') || cmd.includes('hindi')) {
      responseMsg = 'Hindi Alert: कृपया ध्यान दें, सेक्टर ए में भीड़ नियंत्रण जारी है।';
      speakAudioResponse('कृपया ध्यान दें, सेक्टर ए में भीड़ नियंत्रण जारी है।', 'hi-IN');
    } else if (cmd.includes('deploy security') || cmd.includes('security')) {
      setSecurityWall(true);
      responseMsg = 'Security team deployed.';
      speakAudioResponse('Deploying security team', 'en-US');
    } else if (cmd.includes('open gate b') || cmd.includes('reroute')) {
      setGateBRerouted(true);
      responseMsg = 'Crowd flow rerouted to Gate B.';
      speakAudioResponse('Rerouting crowd flow to Gate B', 'en-US');
    } else if (cmd.includes('clear gate c') || cmd.includes('unblock')) {
      setGateCBlocked(false);
      responseMsg = 'Gate C blockage cleared.';
      speakAudioResponse('Gate C blockage cleared', 'en-US');
    } else {
      responseMsg = `Command executed: "${cmdText}"`;
      speakAudioResponse(cmdText, 'en-US');
    }

    setLastLog(responseMsg);
    setCommandInput('');
  };

  const handleToggleVoiceInput = () => {
    setIsListening(true);
    setLastLog('Listening to voice command...');

    const mockCommands = [
      "Focus Sector 2",
      "Alert Zone A in Hindi",
      "Deploy security",
      "Open Gate B"
    ];
    const randomCmd = mockCommands[Math.floor(Math.random() * mockCommands.length)];

    setTimeout(() => {
      setIsListening(false);
      setCommandInput(randomCmd);
      processCommand(randomCmd);
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    processCommand(commandInput);
  };

  return (
    <div className="clay-card-puffy p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#A8D8EA]" />
          <h2 className="text-sm font-extrabold text-white font-heading">
            Multilingual Command Bar
          </h2>
        </div>

        <div className="flex items-center gap-1 bg-[#0D1B2A] p-1 rounded-2xl border border-slate-800 text-xs">
          <Globe2 className="w-3.5 h-3.5 text-slate-400 ml-1" />
          {['English', 'Hindi', 'Bengali'].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-2.5 py-0.5 rounded-xl text-[11px] font-bold transition-all ${
                language === lang ? 'bg-[#70A6FF] text-[#0D1B2A]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggleVoiceInput}
          className={isListening ? 'clay-btn-coral' : 'clay-btn-blue'}
          title="Click to speak command"
        >
          <Mic className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          placeholder='Try "Focus Sector 2", "Alert Zone A in Hindi", "Deploy security"...'
          className="flex-1 bg-[#0D1B2A] border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#A8D8EA] font-mono shadow-inner"
        />

        <button type="submit" className="clay-btn-blue">
          Send
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        <span className="text-[11px] text-slate-500 font-mono">Suggested:</span>
        {['Focus Sector 2', 'Alert Zone A in Hindi', 'Deploy security', 'Open Gate B'].map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => processCommand(chip)}
            className="px-3 py-1 rounded-xl bg-[#0D1B2A] hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-mono transition-all"
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="p-2.5 rounded-2xl bg-[#0D1B2A] border border-slate-800 text-xs font-mono text-[#A8D8EA] flex items-center gap-2 shadow-inner">
        <Volume2 className="w-4 h-4 text-[#A8D8EA] shrink-0" />
        <span className="truncate">{lastLog}</span>
      </div>
    </div>
  );
}
