import React, { useState } from 'react';
import { Mic, Send, Terminal, Volume2, Globe2 } from 'lucide-react';
import { postAction } from '../utils/api';


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

  const alertTranslations = {
    zone_a: {
      en: "Attention Sector A: Crowd control is active. Please follow safety directives.",
      hi: "कृपया ध्यान दें, सेक्टर ए में भीड़ नियंत्रण जारी है। कृपया सुरक्षा निर्देशों का पालन करें।",
      bn: "দয়া করে মনোযোগ দিন, সেক্টর এ-তে ভিড় নিয়ন্ত্রণ সক্রিয় রয়েছে।",
      mr: "कृपया लक्ष द्या, सेक्टर ए मध्ये गर्दी नियंत्रण सुरू आहे. कृपया सुरक्षा नियमांचे पालन करा.",
      or: "ଦୟାକରି ଧ୍ୟାନ ଦିଅନ୍ତୁ, ସେକ୍ଟର ଏ ରେ ଭିଡ଼ ନିୟନ୍ତ୍ରଣ ଜାରି ରହିଛି। ସୁରକ୍ଷା ନିର୍ଦ୍ଦେଶାବଳୀ ପାଳନ କରନ୍ତୁ।",
      te: "దయచేసి గమనించండి, సెక్టార్ ఏ లో రద్దీ నియంత్రణ కొనసాగుతోంది. దయచేసి భద్రతా సూచనలను పాటించండి."
    },
    reroute: {
      en: "Attention: Crowd flow is being rerouted to Gate B. Please proceed calmly.",
      hi: "कृपया ध्यान दें: भीड़ को गेट बी की तरफ डायवर्ट किया जा रहा है। कृपया शांति से आगे बढ़ें।",
      bn: "অনুগ্রহ করে গেট বি এর দিকে যান। গেট সি এ ভিড় আছে।",
      mr: "कृपया लक्ष द्या: गर्दी गेट बी कडे वळवली जात आहे. कृपया शांततेत पुढे जा.",
      or: "ଦୟାକରି ଧ୍ୟାନ ଦିଅନ୍ତୁ: ଭିଡ଼ ଗେଟ୍ B ଆଡକୁ ପରିବର୍ତ୍ତନ କରାଯାଉଛି। ଦୟାକରି ଶାନ୍ତିପୂର୍ଣ୍ଣ ଭାବରେ ଯାଆନ୍ତୁ।",
      te: "దయచేసి గమనించండి: రద్దీ గేట్ బి వైపు మళ్లించబడుతోంది. దయచేసి ప్రశాంతంగా వెళ్ళండి."
    },
    general: {
      en: "Security notice: Please stay alert and maintain orderly queue movement.",
      hi: "सुरक्षा सूचना: कृपया सतर्क रहें और कतार में बने रहें।",
      bn: "সুরক্ষা বিজ্ঞপ্তি: দয়া করে সতর্ক থাকুন এবং শৃঙ্খলা বজায় রাখুন।",
      mr: "सुरक्षा सूचना: कृपया सतर्क रहा आणि रांगेत शिस्त पाळा.",
      or: "ସୁରକ୍ଷା ସୂଚନା: ଦୟาକରି ସତର୍କ ରୁହନ୍ତୁ ଏବଂ ଶୃଙ୍ଖଳା ରକ୍ଷା କରନ୍ତୁ।",
      te: "భద్రతా నోటీసు: దయచేసి అప్రమత్తంగా ఉండండి మరియు క్రమశిక్షణ పాటించండి."
    }
  };

  const speakAudioResponse = (text, langCode = 'en-US') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      window.speechSynthesis.speak(utterance);
    }
  };

  const broadcastInAllLanguages = (key) => {
    const messages = alertTranslations[key] || alertTranslations.general;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const langs = [
        { text: messages.en, code: 'en-US' },
        { text: messages.hi, code: 'hi-IN' },
        { text: messages.bn, code: 'bn-IN' },
        { text: messages.mr, code: 'mr-IN' },
        { text: messages.or, code: 'or-IN' },
        { text: messages.te, code: 'te-IN' }
      ];
      langs.forEach((item) => {
        const utterance = new SpeechSynthesisUtterance(item.text);
        utterance.lang = item.code;
        window.speechSynthesis.speak(utterance);
      });
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
    } else if (cmd.includes('alert') || cmd.includes('warn') || cmd.includes('announce')) {
      let key = 'general';
      if (cmd.includes('zone a') || cmd.includes('sector a')) {
        key = 'zone_a';
        responseMsg = 'Broadcasting Sector A Alert in English, Hindi, Bengali, Marathi, Odia, and Telugu...';
      } else if (cmd.includes('reroute') || cmd.includes('gate b')) {
        key = 'reroute';
        responseMsg = 'Broadcasting Rerouting Command in English, Hindi, Bengali, Marathi, Odia, and Telugu...';
      } else {
        responseMsg = 'Broadcasting Global Alert in English, Hindi, Bengali, Marathi, Odia, and Telugu...';
      }
      broadcastInAllLanguages(key);
    } else if (cmd.includes('deploy security') || cmd.includes('security')) {
      setSecurityWall(true);
      postAction('securityWall', true);
      responseMsg = 'Security team deployed.';
      speakAudioResponse('Deploying security team', 'en-US');
    } else if (cmd.includes('open gate b') || cmd.includes('reroute')) {
      setGateBRerouted(true);
      postAction('gateBRerouted', true);
      responseMsg = 'Crowd flow rerouted to Gate B.';
      speakAudioResponse('Rerouting crowd flow to Gate B', 'en-US');
    } else if (cmd.includes('clear gate c') || cmd.includes('unblock')) {
      setGateCBlocked(false);
      postAction('gateCBlocked', false);
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
      "Alert in Marathi",
      "Alert in Odia",
      "Alert in Telugu",
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
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-extrabold text-white font-heading">
            Multilingual Command Bar
          </h2>
        </div>

        <div className="flex items-center gap-1 bg-[#0c101c] p-1 rounded-2xl border border-slate-800 text-xs flex-wrap">
          <Globe2 className="w-3.5 h-3.5 text-slate-400 ml-1" />
          {['English', 'Hindi', 'Bengali', 'Marathi', 'Odia', 'Telugu'].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-2.5 py-0.5 rounded-xl text-[11px] font-bold transition-all ${
                language === lang ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggleVoiceInput}
          className={isListening ? 'clay-btn-coral text-xs py-2 px-3' : 'clay-btn-blue text-xs py-2 px-3'}
          title="Click to speak command"
        >
          <Mic className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          placeholder='Try "Focus Sector 2", "Alert Zone A in Hindi", "Alert in Marathi", "Alert in Odia", "Alert in Telugu"...'
          className="flex-1 bg-[#070a14] border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono shadow-inner"
        />

        <button type="submit" className="clay-btn-primary text-xs py-2 px-4">
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>

      {/* Suggested Chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        <span className="text-[11px] text-slate-500 font-mono">Suggested:</span>
        {['Focus Sector 2', 'Alert in Marathi', 'Alert in Odia', 'Alert in Telugu', 'Deploy security'].map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => processCommand(chip)}
            className="px-3 py-1 rounded-xl bg-[#0c101c] hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-mono transition-all"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Log */}
      <div className="p-2.5 rounded-2xl bg-[#070a14] border border-slate-800 text-xs font-mono text-blue-400 flex items-center gap-2 shadow-inner">
        <Volume2 className="w-4 h-4 text-blue-400 shrink-0" />
        <span className="truncate">{lastLog}</span>
      </div>
    </div>
  );
}
