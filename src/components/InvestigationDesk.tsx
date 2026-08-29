import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Radio, 
  MapPin, 
  FileText, 
  Volume2, 
  RotateCcw, 
  Eye, 
  Sparkles, 
  Layers, 
  Compass, 
  ArrowRight,
  ShieldCheck,
  Edit3,
  CheckSquare,
  Square
} from 'lucide-react';
import { audioEngine } from '../utils/audioSynthesizer';

interface InvestigationDeskProps {
  initialTool?: string;
  onJumpToVault: () => void;
}

export const InvestigationDesk: React.FC<InvestigationDeskProps> = ({
  initialTool = 'caesar_cipher',
  onJumpToVault
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTool);

  // Caesar Cipher State
  const [caesarShift, setCaesarShift] = useState<number>(0);
  const [customCipherInput, setCustomCipherInput] = useState<string>('WKH YDXOW RSHQV WR VHYHQ');

  // Decode helper
  const decodeCaesar = (str: string, shift: number) => {
    return str
      .split('')
      .map((char) => {
        if (char === ' ') return ' ';
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
          // shift backward by shift
          const shifted = ((code - 65 - shift + 260) % 26) + 65;
          return String.fromCharCode(shifted);
        }
        if (code >= 97 && code <= 122) {
          const shifted = ((code - 97 - shift + 260) % 26) + 97;
          return String.fromCharCode(shifted);
        }
        return char;
      })
      .join('');
  };

  const decodedResult = decodeCaesar(customCipherInput, caesarShift);

  // Reverse Audio State
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioDirection, setAudioDirection] = useState<'reverse' | 'forward' | null>(null);
  const [audioNotes, setAudioNotes] = useState<string>('');

  // Acoustic Rhythm State
  const [userTapIntervals, setUserTapIntervals] = useState<number[]>([]);
  const [lastTapTime, setLastTapTime] = useState<number | null>(null);
  const [rhythmPlaying, setRhythmPlaying] = useState<boolean>(false);

  // Map Pins State
  const [markedPins, setMarkedPins] = useState<number[]>([]);
  const [isMagnifierActive, setIsMagnifierActive] = useState<boolean>(false);

  // Reel Hierarchy State
  const [reelOrder, setReelOrder] = useState<string[]>(['REEL I', 'REEL III', 'REEL VII', 'REEL IX']);

  // Global Field Notes
  const [fieldNotes, setFieldNotes] = useState<string>(() => {
    return localStorage.getItem('thorne_investigator_notes') || '';
  });

  useEffect(() => {
    localStorage.setItem('thorne_investigator_notes', fieldNotes);
  }, [fieldNotes]);

  const handleUserTap = () => {
    const now = performance.now();
    audioEngine.playSingleDeskTap();
    if (lastTapTime !== null) {
      const interval = Math.round(now - lastTapTime);
      setUserTapIntervals((prev) => [...prev.slice(-9), interval]);
    }
    setLastTapTime(now);
  };

  const toolsList = [
    { id: 'caesar_cipher', label: 'Reel I: Rotational Cipher', icon: Key, badge: 'Manuscript' },
    { id: 'reverse_audio', label: 'Reel VII: Audio Lab', icon: Radio, badge: 'Broadcast' },
    { id: 'rhythm', label: 'Reel IX: Acoustic Cadence', icon: Volume2, badge: 'Study Recording' },
    { id: 'map_pins', label: 'Reel III: Cartography Desk', icon: MapPin, badge: 'Survey Map' },
    { id: 'subliminal_grid', label: 'Act 1: 5×5 Matrix', icon: Eye, badge: 'Archive Frame' },
    { id: 'reel_order', label: 'Act 3: Reel Sequence', icon: Layers, badge: 'Convergence' }
  ];

  return (
    <div id="investigation-workbench" className="w-full flex flex-col gap-6">
      {/* Workbench Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#3a2d1f] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#c4a484] font-mono text-[10px] uppercase tracking-[0.25em]">
            <Compass className="w-3.5 h-3.5 text-[#c4a484]" />
            <span>Thorne Estate Archival Investigation Desk</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light font-serif tracking-widest text-[#f5e6d3] uppercase mt-1">
            Archival Evidence Deconstruction
          </h2>
          <p className="text-xs text-[#8a7a6a] font-serif italic tracking-wide">
            Analyze recovered reel artifacts, test cipher shifts, examine audio waveforms, and record field deductions.
          </p>
        </div>

        <button
          onClick={onJumpToVault}
          className="px-4 py-2 bg-[#1c140c] hover:bg-[#2a1d12] text-[#f5e6d3] font-mono text-xs font-bold rounded border border-[#c4a484] shadow flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
        >
          <ShieldCheck className="w-4 h-4 text-[#c4a484]" />
          <span>Proceed to Vault Terminal</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tool Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {toolsList.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTab === tool.id;
          return (
            <button
              key={tool.id}
              id={`tool-tab-${tool.id}`}
              onClick={() => setActiveTab(tool.id)}
              className={`p-3 rounded border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-2 border-[#c4a484] bg-[#1c140c] text-[#f5e6d3] shadow-[0_0_15px_rgba(196,164,132,0.1)]'
                  : 'bg-[#140e08] border-[#3a2d1f] text-[#8a7a6a] hover:bg-[#1c140c] hover:text-[#f5e6d3]'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#c4a484]' : 'text-[#7a6a58]'}`} />
                <span className="text-[9px] font-mono bg-[#0a0502] px-1.5 py-0.5 rounded border border-[#3a2d1f] text-[#c4a484]">
                  {tool.badge}
                </span>
              </div>
              <span className="text-xs font-semibold leading-tight font-serif">
                {tool.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Tool Interactive Workspace */}
      <div className="bg-[#140e08] rounded-lg border border-[#3a2d1f] p-6 shadow-xl relative overflow-hidden">
        {/* TOOL 1: ROTATIONAL CIPHER WHEEL (REEL I) */}
        {activeTab === 'caesar_cipher' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#3a2d1f] pb-3">
              <div>
                <h3 className="text-lg font-serif text-[#f5e6d3] flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#c4a484]" />
                  <span>Rotational Cipher Disc — Reel I Manuscript</span>
                </h3>
                <p className="text-xs text-[#8a7a6a] font-serif">
                  "Shift them the way the map told you, and read again."
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#8a7a6a]">Current Shift:</span>
                <span className="text-sm font-mono font-bold bg-[#0a0502] px-3 py-1 rounded border border-[#3a2d1f] text-[#c4a484]">
                  -{caesarShift}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Dual Ring Visual Rotator */}
              <div className="flex flex-col items-center justify-center p-6 bg-[#0a0502] rounded-lg border border-[#3a2d1f] relative">
                <div className="relative w-64 h-64 rounded-full border-4 border-[#3a2d1f] bg-[#140e08] flex items-center justify-center shadow-[0_0_25px_rgba(196,164,132,0.1)]">
                  <div className="absolute inset-2 rounded-full border border-dashed border-[#c4a484]/30 pointer-events-none" />
                  
                  {/* Inner Ring with rotation */}
                  <div 
                    className="w-44 h-44 rounded-full border-2 border-[#c4a484]/70 bg-[#1c140c] flex items-center justify-center transition-transform duration-300"
                    style={{ transform: `rotate(${caesarShift * 13.84}deg)` }}
                  >
                    <div className="text-center font-mono">
                      <div className="text-[10px] text-[#c4a484] tracking-widest">DISC OFFSET</div>
                      <div className="text-xl font-bold text-[#f5e6d3]">-{caesarShift}</div>
                    </div>
                  </div>

                  <div className="absolute top-1 w-3 h-3 bg-[#c4a484] transform rotate-45 border border-white" />
                </div>

                {/* Shift Slider */}
                <div className="w-full mt-6 flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-mono text-[#7a6a58]">
                    <span>0 (Raw)</span>
                    <span>Shift Position</span>
                    <span>25</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    value={caesarShift}
                    onChange={(e) => {
                      setCaesarShift(parseInt(e.target.value));
                      audioEngine.playVaultTumblerClick();
                    }}
                    className="w-full h-1.5 bg-[#1c140c] rounded appearance-none cursor-pointer accent-[#c4a484]"
                  />
                  <div className="flex gap-2 justify-center mt-3">
                    <button
                      onClick={() => {
                        setCaesarShift((s) => Math.max(0, s - 1));
                        audioEngine.playVaultTumblerClick();
                      }}
                      className="px-3 py-1 bg-[#1c140c] hover:bg-[#2a1d12] text-[#f5e6d3] text-xs font-mono rounded cursor-pointer border border-[#3a2d1f]"
                    >
                      -1 Step
                    </button>
                    <button
                      onClick={() => {
                        setCaesarShift(0);
                        audioEngine.playVaultTumblerClick();
                      }}
                      className="px-3 py-1 bg-[#140e08] hover:bg-[#1c140c] text-[#8a7a6a] text-xs font-mono rounded cursor-pointer border border-[#3a2d1f]"
                    >
                      Reset (0)
                    </button>
                    <button
                      onClick={() => {
                        setCaesarShift((s) => Math.min(25, s + 1));
                        audioEngine.playVaultTumblerClick();
                      }}
                      className="px-3 py-1 bg-[#1c140c] hover:bg-[#2a1d12] text-[#f5e6d3] text-xs font-mono rounded cursor-pointer border border-[#3a2d1f]"
                    >
                      +1 Step
                    </button>
                  </div>
                </div>
              </div>

              {/* Translation Pad */}
              <div className="flex flex-col gap-4">
                <div className="bg-[#0a0502] p-4 rounded-lg border border-[#3a2d1f] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-[#7a6a58] tracking-wider">
                      Input Ciphertext (from Reel I)
                    </span>
                    <button
                      onClick={() => setCustomCipherInput('WKH YDXOW RSHQV WR VHYHQ')}
                      className="text-[10px] font-mono text-[#c4a484] hover:underline"
                    >
                      Reset Text
                    </button>
                  </div>
                  <input
                    type="text"
                    value={customCipherInput}
                    onChange={(e) => setCustomCipherInput(e.target.value.toUpperCase())}
                    className="w-full font-mono text-lg font-bold tracking-widest text-[#c4a484] bg-[#140e08] p-3 rounded border border-[#3a2d1f] focus:outline-none focus:border-[#c4a484]"
                  />
                </div>

                <div className="bg-[#0a0502] p-4 rounded-lg border border-[#3a2d1f] space-y-2">
                  <span className="text-[10px] font-mono uppercase text-[#7a6a58] tracking-wider">
                    Decoded Output (Offset: -{caesarShift})
                  </span>
                  <div className="font-mono text-xl font-bold tracking-widest p-4 rounded border bg-[#1c140c] border-[#3a2d1f] text-[#f5e6d3] min-h-[60px] flex items-center">
                    {decodedResult}
                  </div>
                </div>

                <div className="bg-[#0a0502] p-3 rounded border border-[#3a2d1f] text-xs font-serif text-[#a39483]">
                  Rotate the disc until the letters align into intelligible English.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TOOL 2: AUDIO INVERSION LAB (REEL VII) */}
        {activeTab === 'reverse_audio' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="border-b border-[#3a2d1f] pb-3">
              <h3 className="text-lg font-serif text-[#f5e6d3] flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#c4a484]" />
                <span>Reel VII: Valve Audio Frequency & Inversion Lab</span>
              </h3>
              <p className="text-xs text-[#8a7a6a] font-serif">
                "...some things must be turned back the way they came..."
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tape Deck Controls */}
              <div className="bg-[#0a0502] p-6 rounded-lg border border-[#3a2d1f] flex flex-col items-center justify-between gap-6">
                {/* Twin Reel Spools */}
                <div className="flex items-center justify-center gap-8 w-full">
                  <div className={`w-20 h-20 rounded-full border-2 border-[#3a2d1f] bg-[#140e08] flex items-center justify-center ${isPlayingAudio ? 'animate-spin' : ''}`}>
                    <div className="w-6 h-6 rounded-full bg-[#1c140c] border border-[#c4a484]" />
                  </div>
                  <div className="h-0.5 w-16 bg-[#3a2d1f]" />
                  <div className={`w-20 h-20 rounded-full border-2 border-[#3a2d1f] bg-[#140e08] flex items-center justify-center ${isPlayingAudio ? 'animate-spin' : ''}`}>
                    <div className="w-6 h-6 rounded-full bg-[#1c140c] border border-[#c4a484]" />
                  </div>
                </div>

                {/* Animated Frequency Bars */}
                <div className="w-full h-16 bg-[#140e08] rounded p-2 border border-[#3a2d1f] flex items-center justify-center gap-1.5">
                  {[25, 45, 65, 85, 30, 95, 75, 40, 60, 90, 80, 50, 70, 35, 85, 45, 60, 30].map((h, idx) => (
                    <div
                      key={idx}
                      className={`w-2 rounded-full transition-all duration-150 ${
                        isPlayingAudio ? 'bg-[#c4a484]' : 'bg-[#3a2d1f]'
                      }`}
                      style={{ height: `${isPlayingAudio ? Math.max(15, (h * Math.random()) + 10) : 10}%` }}
                    />
                  ))}
                </div>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => {
                      setIsPlayingAudio(true);
                      setAudioDirection('reverse');
                      audioEngine.playRadioClueAudio(true, () => {
                        setIsPlayingAudio(false);
                      });
                    }}
                    className="flex-1 py-2.5 bg-[#140e08] hover:bg-[#1c140c] text-[#d1d1d1] text-xs font-mono rounded border border-[#3a2d1f] cursor-pointer"
                  >
                    🔊 Play Standard Broadcast
                  </button>
                  <button
                    onClick={() => {
                      setIsPlayingAudio(true);
                      setAudioDirection('forward');
                      audioEngine.playRadioClueAudio(false, () => {
                        setIsPlayingAudio(false);
                      });
                    }}
                    className="flex-1 py-2.5 bg-[#1c140c] hover:bg-[#2a1d12] text-[#f5e6d3] text-xs font-mono font-bold rounded border-2 border-[#c4a484] cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(196,164,132,0.15)]"
                  >
                    <RotateCcw className="w-4 h-4 text-[#c4a484]" />
                    <span>Invert Tape Signal (Reverse)</span>
                  </button>
                </div>
              </div>

              {/* Investigator's Audio Transcription Notes */}
              <div className="flex flex-col gap-3 justify-center">
                <div className="text-[10px] font-mono text-[#7a6a58] uppercase tracking-wider flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-[#c4a484]" />
                  <span>Investigator's Audio Transcription Log</span>
                </div>
                <textarea
                  value={audioNotes}
                  onChange={(e) => setAudioNotes(e.target.value)}
                  placeholder="Record your audio transcription notes and deductions here..."
                  className="w-full h-36 bg-[#0a0502] text-[#f5e6d3] p-3 rounded border border-[#3a2d1f] font-mono text-xs focus:outline-none focus:border-[#c4a484] resize-none placeholder:text-[#5a4d3f]"
                />
                <div className="text-xs text-[#8a7a6a] font-serif italic">
                  Listen closely to both directions and write down phonemes or words you distinguish.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TOOL 3: ACOUSTIC CADENCE & RHYTHM (REEL IX) */}
        {activeTab === 'rhythm' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="border-b border-[#3a2d1f] pb-3">
              <h3 className="text-lg font-serif text-[#f5e6d3] flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#c4a484]" />
                <span>Reel IX: Acoustic Cadence & Rhythm Desk</span>
              </h3>
              <p className="text-xs text-[#8a7a6a] font-serif">
                "Nothing here is wasted motion. Even my hands are trying to tell you something."
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0a0502] p-6 rounded-lg border border-[#3a2d1f] flex flex-col items-center justify-between gap-6">
                <div className="text-center">
                  <div className="text-[10px] font-mono text-[#7a6a58] uppercase tracking-widest mb-2">
                    Elias Thorne Study Recording
                  </div>
                  <button
                    disabled={rhythmPlaying}
                    onClick={() => {
                      setRhythmPlaying(true);
                      audioEngine.playDeskTapPattern(() => {});
                      setTimeout(() => setRhythmPlaying(false), 1200);
                    }}
                    className="px-6 py-3 bg-[#1c140c] hover:bg-[#2a1d12] text-[#f5e6d3] font-mono text-xs font-bold rounded border border-[#c4a484] cursor-pointer flex items-center justify-center gap-2 shadow"
                  >
                    <Sparkles className="w-4 h-4 text-[#c4a484]" />
                    <span>Play Recorded Desk Cadence</span>
                  </button>
                </div>

                <div className="w-full border-t border-[#3a2d1f] pt-4 flex flex-col items-center gap-3">
                  <div className="text-[10px] font-mono text-[#7a6a58] uppercase tracking-wider">
                    Interactive Tap Pad (Tap to Analyze Interval)
                  </div>
                  <button
                    onClick={handleUserTap}
                    className="w-full py-4 bg-[#140e08] hover:bg-[#1c140c] active:scale-95 text-[#c4a484] font-mono text-xs uppercase tracking-widest rounded border-2 border-[#3a2d1f] hover:border-[#c4a484] cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    <span>Tap Space / Click Here</span>
                  </button>
                </div>
              </div>

              {/* Tap Intervals & Observations */}
              <div className="bg-[#0a0502] p-4 rounded-lg border border-[#3a2d1f] flex flex-col justify-between gap-4">
                <div>
                  <div className="text-[10px] font-mono text-[#7a6a58] uppercase tracking-wider mb-2">
                    Recorded Tap Intervals (ms)
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
                    {userTapIntervals.length > 0 ? (
                      userTapIntervals.map((interval, i) => (
                        <span key={i} className="px-2 py-1 bg-[#140e08] rounded border border-[#3a2d1f] font-mono text-xs text-[#c4a484]">
                          {interval}ms
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-[#5a4d3f] font-mono">No taps recorded yet.</span>
                    )}
                  </div>
                </div>

                <div className="text-xs font-serif text-[#a39483] border-t border-[#3a2d1f] pt-3 leading-relaxed">
                  Analyze the number of taps and their rhythm. How might a structured signaling system represent this pattern?
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TOOL 4: MAP & PINS (REEL III) */}
        {activeTab === 'map_pins' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="border-b border-[#3a2d1f] pb-3">
              <h3 className="text-lg font-serif text-[#f5e6d3] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#c4a484]" />
                <span>Reel III: 1932 Cartographer Wall Map & Coordinates</span>
              </h3>
              <p className="text-xs text-[#8a7a6a] font-serif">
                "Count what holds the string, and you'll have the first key. The corner remembers what the shift should be."
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2 bg-[#d8c4a2] p-6 rounded border-2 border-[#3a2d1f] relative shadow-inner select-none">
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M 60 50 C 140 25, 200 70, 160 120 C 120 170, 240 190, 320 160 C 390 130, 460 80, 520 100 C 560 120, 540 180, 580 190"
                    fill="none"
                    stroke="#8b3a2b"
                    strokeWidth="3"
                    strokeDasharray="5 3"
                  />
                </svg>

                {/* 7 Pins */}
                <div className="relative h-64 w-full">
                  {[
                    { id: 1, x: '10%', y: '18%', label: 'Station 1' },
                    { id: 2, x: '28%', y: '12%', label: 'Station 2' },
                    { id: 3, x: '26%', y: '50%', label: 'Station 3' },
                    { id: 4, x: '52%', y: '68%', label: 'Station 4' },
                    { id: 5, x: '66%', y: '36%', label: 'Station 5' },
                    { id: 6, x: '85%', y: '44%', label: 'Station 6' },
                    { id: 7, x: '92%', y: '75%', label: 'Station 7' }
                  ].map((p) => {
                    const isMarked = markedPins.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          if (isMarked) {
                            setMarkedPins(markedPins.filter((id) => id !== p.id));
                          } else {
                            setMarkedPins([...markedPins, p.id]);
                          }
                        }}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none"
                        style={{ left: p.x, top: p.y }}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono border-2 border-white shadow-lg transition-transform group-hover:scale-125 ${
                          isMarked ? 'bg-[#8b3a2b] text-white ring-2 ring-amber-300' : 'bg-neutral-700 text-neutral-300'
                        }`}>
                          {p.id}
                        </div>
                      </button>
                    );
                  })}

                  {/* Corner Postmark */}
                  <div
                    onClick={() => setIsMagnifierActive(!isMagnifierActive)}
                    className="absolute bottom-2 right-2 bg-[#c5b08c] px-3 py-1.5 border-2 border-neutral-700/60 rounded cursor-pointer hover:bg-[#e0caa6] transition-colors text-right"
                  >
                    <span className="text-[9px] font-mono text-neutral-700 block font-bold">CORNER STAMP</span>
                    <span className="text-2xl font-serif font-black text-neutral-900 leading-none">3</span>
                  </div>
                </div>
              </div>

              {/* Pin Inspection & Counter */}
              <div className="flex flex-col gap-4">
                <div className="bg-[#0a0502] p-4 rounded-lg border border-[#3a2d1f]">
                  <div className="text-[10px] font-mono text-[#7a6a58] uppercase mb-2">
                    Survey Pin Checklist
                  </div>
                  <div className="space-y-1.5 text-xs font-serif text-[#d1d1d1]">
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                      const isMarked = markedPins.includes(num);
                      return (
                        <div
                          key={num}
                          onClick={() => {
                            if (isMarked) setMarkedPins(markedPins.filter((id) => id !== num));
                            else setMarkedPins([...markedPins, num]);
                          }}
                          className="flex items-center gap-2 cursor-pointer hover:text-[#c4a484] transition-colors"
                        >
                          {isMarked ? (
                            <CheckSquare className="w-3.5 h-3.5 text-[#c4a484]" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-[#5a4d3f]" />
                          )}
                          <span>Survey Station #{num}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#3a2d1f] text-xs font-mono text-[#c4a484]">
                    Marked Stations: {markedPins.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TOOL 5: 5x5 MATRIX (ACT 1) */}
        {activeTab === 'subliminal_grid' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="border-b border-[#3a2d1f] pb-3">
              <h3 className="text-lg font-serif text-[#f5e6d3] flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#c4a484]" />
                <span>Act 1: Recovered 5×5 Cartographic Matrix</span>
              </h3>
              <p className="text-xs text-[#8a7a6a] font-serif">
                Recovered single-frame archival manuscript from 1932.
              </p>
            </div>

            <div className="max-w-xl mx-auto bg-[#ebdcc2] text-neutral-950 p-6 rounded shadow-2xl border-4 border-[#8c6b45] transform -rotate-1">
              <div className="text-xs font-mono font-bold tracking-widest text-center border-b border-neutral-600 pb-2 mb-3">
                THORNE ESTATE 5×5 GRID MATRIX
              </div>
              <div className="grid grid-cols-5 gap-2 text-center font-mono font-bold text-sm">
                {['A','B','C','D','E','F','G','H','I','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'].map((letter, i) => (
                  <div key={i} className="p-3 bg-[#fdf8ee] border border-neutral-700/60 rounded shadow-sm hover:bg-[#c4a484] transition-colors">
                    {letter}
                  </div>
                ))}
              </div>
              <p className="text-xs font-serif italic text-neutral-700 text-center mt-4">
                Preserved in the estate archives, September 1932.
              </p>
            </div>
          </div>
        )}

        {/* TOOL 6: REEL ORDER (ACT 3) */}
        {activeTab === 'reel_order' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="border-b border-[#3a2d1f] pb-3">
              <h3 className="text-lg font-serif text-[#f5e6d3] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#c4a484]" />
                <span>Act 3: Reel Convergence Workbench</span>
              </h3>
              <p className="text-xs text-[#8a7a6a] font-serif">
                "I did not save these in the order I filmed them. I saved them in the order that matters. Highest to lowest, Elias Thorne always finished what he started backward."
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {reelOrder.map((reel, idx) => (
                <div key={reel} className="bg-[#0a0502] p-5 rounded-lg border border-[#3a2d1f] text-center space-y-2">
                  <div className="text-[10px] font-mono text-[#7a6a58] uppercase">Slot #{idx + 1}</div>
                  <div className="text-2xl font-serif text-[#f5e6d3]">{reel}</div>
                  <div className="flex gap-2 justify-center pt-2">
                    {idx > 0 && (
                      <button
                        onClick={() => {
                          const next = [...reelOrder];
                          const tmp = next[idx - 1];
                          next[idx - 1] = next[idx];
                          next[idx] = tmp;
                          setReelOrder(next);
                        }}
                        className="px-2 py-1 bg-[#140e08] hover:bg-[#1c140c] text-xs font-mono text-[#8a7a6a] rounded border border-[#3a2d1f]"
                      >
                        ← Move
                      </button>
                    )}
                    {idx < reelOrder.length - 1 && (
                      <button
                        onClick={() => {
                          const next = [...reelOrder];
                          const tmp = next[idx + 1];
                          next[idx + 1] = next[idx];
                          next[idx] = tmp;
                          setReelOrder(next);
                        }}
                        className="px-2 py-1 bg-[#140e08] hover:bg-[#1c140c] text-xs font-mono text-[#8a7a6a] rounded border border-[#3a2d1f]"
                      >
                        Move →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Global Investigator Field Notes (Persisted) */}
      <div className="bg-[#140e08] p-6 rounded-lg border border-[#3a2d1f]">
        <div className="flex items-center justify-between border-b border-[#3a2d1f] pb-3 mb-3">
          <div className="flex items-center gap-2 font-mono text-xs text-[#c4a484] uppercase tracking-wider font-bold">
            <FileText className="w-4 h-4 text-[#c4a484]" />
            <span>Investigator's Master Case Scratchpad</span>
          </div>
          <span className="text-[10px] font-mono text-[#7a6a58]">Auto-saved locally</span>
        </div>
        <textarea
          value={fieldNotes}
          onChange={(e) => setFieldNotes(e.target.value)}
          placeholder="Compile your deductions, candidate vault keywords, cipher tests, and reel alignments here..."
          className="w-full h-24 bg-[#0a0502] text-[#f5e6d3] p-3 rounded border border-[#3a2d1f] font-mono text-xs focus:outline-none focus:border-[#c4a484] resize-none placeholder:text-[#5a4d3f]"
        />
      </div>
    </div>
  );
};
