import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Radio, 
  MapPin, 
  Key, 
  Film, 
  Compass, 
  FileText, 
  Lock, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Eye
} from 'lucide-react';
import { FULL_SCRIPT_SCENES } from '../data/scriptData';
import { ScriptScene } from '../types';
import { audioEngine } from '../utils/audioSynthesizer';

interface FilmProjectorViewProps {
  onOpenWorkbench: (toolType?: string) => void;
  onOpenVault: () => void;
}

export const FilmProjectorView: React.FC<FilmProjectorViewProps> = ({
  onOpenWorkbench,
  onOpenVault
}) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [isFilmGrainEnabled, setIsFilmGrainEnabled] = useState<boolean>(true);
  const [selectedMapPin, setSelectedMapPin] = useState<number | null>(null);

  const totalDuration = 570; // 9:30 total (570 seconds)
  const timerRef = useRef<number | null>(null);

  // Active scene calculation
  const currentScene: ScriptScene = useMemo(() => {
    const scene = FULL_SCRIPT_SCENES.find(
      (s) => currentTime >= s.timeStartSeconds && currentTime < s.timeEndSeconds
    );
    return scene || FULL_SCRIPT_SCENES[FULL_SCRIPT_SCENES.length - 1];
  }, [currentTime]);

  // Flash frame trigger in Act 1 (at 71.5-73.5 seconds / 1:12)
  const isSubliminalFlashFrame = useMemo(() => {
    return currentTime >= 71.5 && currentTime <= 73.5;
  }, [currentTime]);

  // Playback timer loop
  useEffect(() => {
    if (isPlaying) {
      audioEngine.startProjectorAudio();
      if (currentScene.id === 'act-2-frag-2') {
        audioEngine.startRadioStatic();
      } else {
        audioEngine.stopRadioStatic();
      }

      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return Math.min(prev + 0.25 * playbackSpeed, totalDuration);
        });
      }, 250);
    } else {
      audioEngine.stopProjectorAudio();
      audioEngine.stopRadioStatic();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      audioEngine.stopProjectorAudio();
      audioEngine.stopRadioStatic();
    };
  }, [isPlaying, playbackSpeed, currentScene.id]);

  // Handle specific timed audio events (desk tapping cadence in Act 2 Frag 1)
  useEffect(() => {
    if (currentScene.id === 'act-2-frag-1' && isPlaying) {
      const secInScene = currentTime - currentScene.timeStartSeconds;
      if ((secInScene >= 14 && secInScene <= 15) || (secInScene >= 39 && secInScene <= 40)) {
        audioEngine.playDeskTapPattern();
      }
    }
  }, [currentTime, currentScene, isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (seconds: number) => {
    setCurrentTime(Math.max(0, Math.min(seconds, totalDuration)));
  };

  const handleStepFrame = (forward: boolean) => {
    setIsPlaying(false);
    setCurrentTime((prev) => {
      const step = forward ? 1 : -1;
      return Math.max(0, Math.min(prev + step, totalDuration));
    });
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    audioEngine.setMuted(nextMute);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div id="projector-cinema-view" className="w-full flex flex-col gap-6">
      {/* Top Banner with Cinema Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#3a2d1f] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#c4a484] font-mono text-[10px] uppercase tracking-[0.25em]">
            <Film className="w-3.5 h-3.5 text-[#c4a484] animate-pulse" />
            <span>Thorne Archive Projector — 16mm Restored Reel</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light font-serif tracking-widest text-[#f5e6d3] uppercase mt-1">
            {currentScene.actTitle} {currentScene.reelNumber && `• ${currentScene.reelNumber}`}
          </h2>
          <p className="text-xs text-[#8a7a6a] font-serif italic tracking-wide">
            {currentScene.actSubtitle}
          </p>
        </div>

        {/* Quick Act Jump Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#140e08] p-1.5 rounded-lg border border-[#3a2d1f]">
          {FULL_SCRIPT_SCENES.map((scene, idx) => {
            const isActive = currentScene.id === scene.id;
            return (
              <button
                key={scene.id}
                id={`jump-scene-${scene.id}`}
                onClick={() => {
                  handleSeek(scene.timeStartSeconds);
                }}
                className={`px-3 py-1 text-xs font-mono rounded transition-all flex items-center gap-1 cursor-pointer ${
                  isActive
                    ? 'border-2 border-[#c4a484] bg-[#1c140c] text-[#f5e6d3] shadow-[0_0_15px_rgba(196,164,132,0.1)]'
                    : 'text-[#7a6a58] hover:text-[#f5e6d3] hover:bg-[#1a120b]'
                }`}
                title={`${scene.actTitle} (${scene.timeDisplay})`}
              >
                <span className="font-semibold">{scene.reelNumber || `ACT ${idx + 1}`}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Projector Screen Frame */}
      <div className="relative w-full aspect-video md:aspect-[16/9] bg-black rounded-lg overflow-hidden shadow-2xl border-2 border-[#3a2d1f] ring-1 ring-[#c4a484]/20 flex flex-col justify-center items-center select-none group">
        {/* Vintage Film Overlay FX (Grain, Vignette, Sepia Tint, Scratches) */}
        {isFilmGrainEnabled && (
          <div className="absolute inset-0 pointer-events-none z-30 opacity-40 mix-blend-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-black/90">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(196,164,132,0.04)_50%,transparent_100%)] animate-pulse" />
            <div className="absolute top-0 bottom-0 left-1/3 w-[1px] bg-[#c4a484]/20 opacity-30 animate-ping" />
          </div>
        )}

        {/* Top-Right Reel Stamp */}
        <div className="absolute top-4 right-4 z-40 bg-[#0a0502]/80 backdrop-blur-md px-3 py-1.5 rounded border border-[#3a2d1f] text-[10px] font-mono text-[#c4a484] flex items-center gap-2 tracking-widest uppercase">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c4a484] animate-ping" />
          <span>ESTATE REEL 1932 #{currentScene.numericReel || 'PROLOGUE'}</span>
        </div>

        {/* Scene Visual Renderers */}
        <div className="relative w-full h-full flex items-center justify-center p-6 md:p-12 overflow-hidden bg-[#0a0502]">
          {/* ACT 1: THE HOOK */}
          {currentScene.id === 'act-1-hook' && (
            <div className="w-full h-full flex flex-col items-center justify-center text-center max-w-2xl animate-fade-in">
              {isSubliminalFlashFrame ? (
                /* FLASH FRAME: 5x5 Matrix on Torn Parchment */
                <div className="relative p-6 bg-[#ebdcc2] text-neutral-950 rounded shadow-2xl border-2 border-[#3a2d1f] transform rotate-[-1deg] max-w-md w-full animate-fade-in">
                  <div className="border border-neutral-800/60 p-3 bg-[#f8eedc]">
                    <div className="text-[10px] font-mono font-bold tracking-widest text-center border-b border-neutral-700 pb-1 mb-2 text-neutral-900">
                      THORNE ESTATE CARTOGRAPHIC MATRIX
                    </div>
                    <div className="grid grid-cols-5 gap-1.5 text-center font-mono text-xs font-bold">
                      {['A','B','C','D','E','F','G','H','I','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'].map((letter, i) => (
                        <div key={i} className="border border-neutral-600/40 p-1.5 bg-[#fdf8ee] text-neutral-900 shadow-sm">
                          {letter}
                        </div>
                      ))}
                    </div>
                    <p className="text-[9px] font-serif italic text-neutral-700 text-center mt-2">
                      Recovered manuscript fragment — September 1932
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenWorkbench('subliminal_grid')}
                    className="mt-3 w-full bg-[#140e08] hover:bg-[#1c140c] text-[#c4a484] hover:text-[#f5e6d3] text-xs font-mono py-1.5 rounded flex items-center justify-center gap-1.5 cursor-pointer border border-[#3a2d1f]"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#c4a484]" />
                    <span>Examine Matrix in Evidence Desk</span>
                  </button>
                </div>
              ) : (
                /* Regular Act 1 Title Card */
                <div className="space-y-6 text-[#f5e6d3] font-serif">
                  <div className="border-y border-[#3a2d1f] py-4 px-8 tracking-widest text-xs md:text-sm font-mono text-[#c4a484] uppercase">
                    RECOVERED FOOTAGE — DAMAGED REEL<br />
                    Property of the Thorne Estate, 1932<br />
                    Restored for viewing, 1932
                  </div>
                  <div className="w-16 h-16 mx-auto rounded-full border border-[#3a2d1f] p-1 flex items-center justify-center bg-[#140e08]">
                    <Compass className="w-8 h-8 text-[#c4a484] animate-spin-slow" />
                  </div>
                  <p className="text-base md:text-lg italic text-[#d1d1d1] max-w-xl mx-auto leading-relaxed">
                    {currentScene.dialogueText}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ACT 2 FRAGMENT 1: REEL IX — THE STUDY */}
          {currentScene.id === 'act-2-frag-1' && (
            <div className="w-full h-full flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl animate-fade-in">
              {/* Elias Thorne Writing Desk Visual */}
              <div className="flex-1 bg-[#140e08] p-6 rounded-lg border border-[#3a2d1f] relative shadow-inner">
                <div className="flex items-center justify-between pb-3 border-b border-[#3a2d1f] mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#7a6a58]">
                    ARCHIVAL FOOTAGE: REEL IX STUDY
                  </span>
                  <span className="text-[10px] bg-[#1c140c] px-2 py-0.5 rounded text-[#c4a484] font-mono border border-[#3a2d1f]">
                    OPTICAL AUDIO TRACK
                  </span>
                </div>

                {/* Desk Scene Graphic */}
                <div className="relative h-44 bg-[#0a0502] rounded border border-[#3a2d1f] p-4 flex flex-col justify-between overflow-hidden">
                  {/* Bookshelf Background */}
                  <div className="flex gap-1 justify-center opacity-30 border-b border-[#3a2d1f] pb-2">
                    {['Atlas', 'Survey', 'Tides', 'Flora', 'Stars', 'Chronicles', 'Heights', 'Rivers'].map((title, i) => (
                      <div key={i} className="w-7 h-16 bg-[#1c140c] border border-[#3a2d1f] rounded-t flex items-end justify-center pb-1 text-[8px] font-mono text-[#c4a484]/60 -rotate-1">
                        {title[0]}
                      </div>
                    ))}
                  </div>

                  {/* Desk & Subject */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#1c140c] border border-[#3a2d1f] flex items-center justify-center font-serif text-base text-[#c4a484]">
                        ET
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#f5e6d3]">Elias Thorne</div>
                        <div className="text-[10px] text-[#8a7a6a] font-mono">Writing at mahogany desk</div>
                      </div>
                    </div>

                    <button
                      onClick={() => audioEngine.playDeskTapPattern()}
                      className="px-3 py-2 bg-[#1c140c] hover:bg-[#2a1d12] text-[#f5e6d3] rounded border border-[#3a2d1f] hover:border-[#c4a484] text-xs font-mono flex items-center gap-1.5 shadow cursor-pointer transition-all active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#c4a484]" />
                      <span>Re-listen to Audio Track</span>
                    </button>
                  </div>
                </div>

                <div className="mt-3 text-xs text-[#a39483] font-serif italic">
                  "Even my hands are trying to tell you something..."
                </div>
              </div>

              {/* Archival Note Card */}
              <div className="w-full md:w-64 bg-[#140e08] p-4 rounded border border-[#3a2d1f] flex flex-col gap-3">
                <div className="text-[10px] font-mono text-[#7a6a58] uppercase tracking-[0.2em] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#c4a484]" />
                  <span>Archival Footage Log</span>
                </div>
                <div className="bg-[#0a0502] p-3 rounded border border-[#3a2d1f] font-serif text-xs text-[#a39483] leading-relaxed">
                  Elias Thorne addresses the camera directly. Pay close attention to subtle physical cadences and spoken remarks.
                </div>
                <button
                  onClick={() => onOpenWorkbench('morse')}
                  className="w-full py-2 bg-[#1c140c] hover:bg-[#2a1d12] text-[#c4a484] hover:text-[#f5e6d3] border border-[#3a2d1f] hover:border-[#c4a484] rounded text-xs font-mono flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Acoustic Evidence Desk</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ACT 2 FRAGMENT 2: REEL VII — THE RADIO */}
          {currentScene.id === 'act-2-frag-2' && (
            <div className="w-full h-full flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl animate-fade-in">
              {/* 1932 Valve Radio Graphic */}
              <div className="flex-1 bg-[#140e08] p-6 rounded-lg border border-[#3a2d1f] relative">
                <div className="flex items-center justify-between pb-3 border-b border-[#3a2d1f] mb-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#c4a484] tracking-widest uppercase">
                    <Radio className="w-4 h-4 animate-pulse text-[#c4a484]" />
                    <span>VALVE RADIO RECEIVER — 1932</span>
                  </div>
                  <span className="text-[10px] bg-[#1c140c] text-[#c4a484] px-2 py-0.5 rounded font-mono border border-[#3a2d1f]">
                    FREQUENCY BROADCAST
                  </span>
                </div>

                {/* Glowing Valve Tubes & Waveform */}
                <div className="bg-[#0a0502] rounded-lg p-4 border border-[#3a2d1f] flex flex-col items-center gap-4">
                  <div className="flex gap-4">
                    {[1, 2, 3].map((tube) => (
                      <div key={tube} className="w-8 h-14 bg-[#1c140c] rounded-t-full border border-[#3a2d1f] flex items-center justify-center shadow-[0_0_15px_rgba(196,164,132,0.15)]">
                        <div className="w-1 h-6 bg-[#c4a484] rounded-full animate-pulse" />
                      </div>
                    ))}
                  </div>

                  {/* Audio Frequency Simulation */}
                  <div className="w-full flex items-center justify-center gap-1 h-8">
                    {[20, 55, 30, 80, 45, 95, 35, 70, 40, 85, 25, 60, 90, 45, 30].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-[#c4a484]/70 rounded-full transition-all duration-150"
                        style={{ height: `${isPlaying ? Math.random() * h + 10 : 8}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Subtitle corner */}
                <div className="mt-3 text-right text-[11px] font-mono text-[#a39483] italic">
                  "...some things must be turned back the way they came..."
                </div>
              </div>

              {/* Audio Controls */}
              <div className="w-full md:w-64 bg-[#140e08] p-4 rounded border border-[#3a2d1f] flex flex-col gap-3">
                <div className="text-[10px] font-mono text-[#7a6a58] uppercase tracking-[0.2em]">
                  Broadcast Signal
                </div>
                <p className="text-xs text-[#a39483] font-serif leading-relaxed">
                  A broadcast transmission was captured on the optical audio track of Reel VII.
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => audioEngine.playRadioClueAudio(true)}
                    className="w-full py-2 bg-[#1c140c] hover:bg-[#2a1d12] text-[#f5e6d3] rounded text-xs font-mono cursor-pointer border border-[#3a2d1f]"
                  >
                    🔊 Play Standard Track
                  </button>
                  <button
                    onClick={() => onOpenWorkbench('reverse_audio')}
                    className="w-full py-2 bg-[#1c140c] hover:bg-[#2a1d12] text-[#c4a484] hover:text-[#f5e6d3] rounded text-xs font-mono font-bold flex items-center justify-center gap-1 cursor-pointer border border-[#c4a484] shadow-[0_0_12px_rgba(196,164,132,0.15)]"
                  >
                    <span>Examine in Audio Lab</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ACT 2 FRAGMENT 3: REEL III — THE MAP ROOM */}
          {currentScene.id === 'act-2-frag-3' && (
            <div className="w-full h-full flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl animate-fade-in">
              {/* Hand-drawn Map with Pins */}
              <div className="flex-1 bg-[#140e08] p-4 rounded-lg border border-[#3a2d1f] relative overflow-hidden flex flex-col">
                <div className="flex items-center justify-between pb-2 border-b border-[#3a2d1f] mb-2">
                  <div className="text-xs font-mono text-[#c4a484] flex items-center gap-1 tracking-widest uppercase">
                    <MapPin className="w-3.5 h-3.5 text-[#c4a484]" />
                    <span>1932 SURVEY MAP — REEL III</span>
                  </div>
                  <div className="text-[10px] font-mono text-[#7a6a58] bg-[#0a0502] px-2 py-0.5 rounded border border-[#3a2d1f]">
                    THORNE VALLEY SURVEY
                  </div>
                </div>

                {/* Map Canvas Visual */}
                <div className="relative w-full h-48 bg-[#d6c4a5] rounded border-2 border-[#3a2d1f] overflow-hidden shadow-inner select-none">
                  {/* Topographic Lines SVG */}
                  <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 10 50 Q 80 20 150 70 T 300 40 T 450 90" fill="none" stroke="#6b5b45" strokeWidth="1" />
                    <path d="M 20 90 Q 120 110 220 80 T 380 120" fill="none" stroke="#6b5b45" strokeWidth="1" />
                    <path d="M 0 140 Q 140 160 280 130 T 500 150" fill="none" stroke="#6b5b45" strokeWidth="1" />
                    <path
                      d="M 50 40 C 120 20, 160 60, 130 95 C 100 130, 200 150, 260 130 C 310 110, 360 70, 410 85 C 440 95, 430 140, 460 150"
                      fill="none"
                      stroke="#8b3a2b"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                    />
                  </svg>

                  {/* Red Pins */}
                  {[
                    { id: 1, x: '10%', y: '26%' },
                    { id: 2, x: '28%', y: '16%' },
                    { id: 3, x: '27%', y: '62%' },
                    { id: 4, x: '54%', y: '84%' },
                    { id: 5, x: '65%', y: '46%' },
                    { id: 6, x: '86%', y: '54%' },
                    { id: 7, x: '94%', y: '90%' }
                  ].map((pin) => (
                    <button
                      key={pin.id}
                      onClick={() => setSelectedMapPin(pin.id)}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none"
                      style={{ left: pin.x, top: pin.y }}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[9px] font-bold transition-transform group-hover:scale-125 ${
                        selectedMapPin === pin.id ? 'bg-[#c4a484] text-black ring-2 ring-white' : 'bg-[#8b3a2b] text-white'
                      }`}>
                        {pin.id}
                      </div>
                    </button>
                  ))}

                  {/* Faded Corner Postmark */}
                  <div className="absolute bottom-1 right-1 bg-[#c8b493] px-2 py-1 border border-neutral-700/50 rounded text-right">
                    <span className="text-[8px] font-mono text-neutral-700 block tracking-widest">POSTMARK</span>
                    <span className="font-serif font-bold text-lg text-neutral-900 leading-none">3</span>
                  </div>
                </div>

                <div className="mt-2 text-xs text-[#a39483] font-serif italic">
                  "Count what holds the string, and you'll have the first key. The corner remembers what the shift should be."
                </div>
              </div>

              {/* Map Notes */}
              <div className="w-full md:w-64 bg-[#140e08] p-4 rounded border border-[#3a2d1f] flex flex-col gap-3">
                <div className="text-[10px] font-mono text-[#7a6a58] uppercase tracking-[0.2em]">
                  Survey Document
                </div>
                <div className="space-y-2 text-xs text-[#d1d1d1] font-serif">
                  <div className="bg-[#0a0502] p-2.5 rounded border border-[#3a2d1f]">
                    <span className="text-[#a39483] text-xs">
                      Wall map of the Thorne estate featuring marked station points linked by surveyor twine and a stamped corner mark.
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onOpenWorkbench('map_pins')}
                  className="w-full py-2 bg-[#1c140c] hover:bg-[#2a1d12] text-[#c4a484] hover:text-[#f5e6d3] border border-[#3a2d1f] hover:border-[#c4a484] rounded text-xs font-mono flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Open Survey Workbench</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ACT 2 FRAGMENT 4: REEL I — THE LETTER */}
          {currentScene.id === 'act-2-frag-4' && (
            <div className="w-full h-full flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl animate-fade-in">
              {/* Burned Edge Manuscript */}
              <div className="flex-1 bg-[#140e08] p-6 rounded-lg border border-[#3a2d1f] flex flex-col items-center justify-center">
                <div className="relative bg-[#ebdcc2] text-neutral-950 p-6 md:p-8 rounded shadow-2xl border-4 border-[#8c6b45] max-w-lg w-full transform -rotate-1 overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-black/80 via-[#3a2d1f]/60 to-transparent rounded-bl-full" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-black/90 via-[#3a2d1f]/70 to-transparent rounded-tr-full" />

                  <div className="text-[10px] font-mono tracking-widest text-neutral-600 border-b border-neutral-400 pb-1 mb-4 uppercase">
                    Recovered Manuscript — Thorne Estate 1932
                  </div>

                  <div className="font-mono font-bold text-xl md:text-2xl tracking-[0.2em] text-neutral-900 text-center py-4 bg-[#f8eedc] border border-neutral-400/80 rounded my-2">
                    WKH YDXOW RSHQV WR VHYHQ
                  </div>

                  <p className="text-xs font-serif italic text-neutral-700 text-center mt-3">
                    "I never trusted plain words with plain meaning. Shift them the way the map told you, and read again."
                  </p>
                </div>
              </div>

              {/* Cipher Link Station */}
              <div className="w-full md:w-64 bg-[#140e08] p-4 rounded border border-[#3a2d1f] flex flex-col gap-3">
                <div className="text-[10px] font-mono text-[#7a6a58] uppercase tracking-[0.2em] flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#c4a484]" />
                  <span>Cipher Manuscript</span>
                </div>
                <div className="bg-[#0a0502] p-3 rounded border border-[#3a2d1f] font-mono text-xs">
                  <div className="text-[#7a6a58] text-[10px]">INSCRIBED TEXT:</div>
                  <div className="text-[#c4a484] font-bold mt-1 tracking-wider">
                    WKH YDXOW RSHQV WR VHYHQ
                  </div>
                </div>
                <button
                  onClick={() => onOpenWorkbench('caesar_cipher')}
                  className="w-full py-2.5 bg-[#1c140c] hover:bg-[#2a1d12] text-[#f5e6d3] rounded text-xs font-mono font-bold flex items-center justify-center gap-1 cursor-pointer border border-[#c4a484] shadow-[0_0_12px_rgba(196,164,132,0.15)] transition-colors"
                >
                  <span>Open Rotational Cipher Wheel</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ACT 3: THE CONVERGENCE */}
          {currentScene.id === 'act-3-convergence' && (
            <div className="w-full h-full flex flex-col items-center justify-center text-center max-w-2xl space-y-6 animate-fade-in">
              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#c4a484] border border-[#3a2d1f] px-4 py-1 rounded bg-[#140e08]">
                ACT 3 — THE CONVERGENCE
              </div>

              {/* 4 Reels Montage Cards (IX, VII, III, I) */}
              <div className="grid grid-cols-4 gap-3 w-full max-w-lg">
                {[
                  { reel: 'REEL IX', num: 'IX' },
                  { reel: 'REEL VII', num: 'VII' },
                  { reel: 'REEL III', num: 'III' },
                  { reel: 'REEL I', num: 'I' }
                ].map((item) => (
                  <div key={item.reel} className="bg-[#140e08] border border-[#3a2d1f] hover:border-[#c4a484] p-3 rounded text-center shadow-lg transition-all">
                    <div className="text-xs md:text-sm font-serif text-[#f5e6d3]">{item.reel}</div>
                    <div className="text-xl font-mono text-[#c4a484] font-bold mt-1">{item.num}</div>
                  </div>
                ))}
              </div>

              <div className="text-sm md:text-base font-serif italic text-[#d1d1d1] leading-relaxed max-w-lg">
                "{currentScene.dialogueText}"
              </div>
            </div>
          )}

          {/* ACT 4: CLOSING CARD */}
          {currentScene.id === 'act-4-closing' && (
            <div className="w-full h-full flex flex-col items-center justify-center text-center max-w-xl space-y-6 animate-fade-in bg-[#0a0502] p-8 rounded-lg border border-[#3a2d1f]">
              <div className="w-14 h-14 rounded-full border border-[#c4a484]/60 flex items-center justify-center text-[#c4a484] bg-[#140e08]">
                <Lock className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-2xl md:text-3xl font-serif text-[#f5e6d3] tracking-widest uppercase">
                "Speak the vault's true name."
              </h3>
              <p className="text-xs text-[#8a7a6a] font-serif max-w-md leading-relaxed italic">
                The screen has faded to black. The mechanical locking tumblers of the Thorne Estate await your final declaration.
              </p>
              <button
                id="enter-vault-button"
                onClick={onOpenVault}
                className="px-6 py-3 bg-[#1c140c] hover:bg-[#2a1d12] text-[#f5e6d3] font-mono uppercase tracking-widest text-xs font-bold rounded shadow-xl border-2 border-[#c4a484] flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(196,164,132,0.2)]"
              >
                <Key className="w-4 h-4 text-[#c4a484]" />
                <span>Open The Thorne Vault Terminal</span>
              </button>
            </div>
          )}
        </div>

        {/* Subtitle Bar Overlay */}
        {showSubtitles && (currentScene.dialogueText || currentScene.subtitle) && (
          <div className="absolute bottom-16 left-6 right-6 z-40 bg-[#0a0502]/90 backdrop-blur-sm px-4 py-2.5 rounded border border-[#3a2d1f] text-center">
            <span className="text-xs md:text-sm font-serif text-[#f5e6d3]">
              {currentScene.speaker !== 'TEXT_ONLY' && (
                <strong className="text-[#c4a484] mr-2 font-mono text-xs uppercase">{currentScene.speaker}:</strong>
              )}
              {currentScene.subtitle || currentScene.dialogueText}
            </span>
          </div>
        )}

        {/* Bottom Playback Scrubber & Media Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-[#0a0502]/95 border-t border-[#3a2d1f] px-4 py-2.5 z-40 flex flex-col gap-2">
          {/* Progress Timeline Slider */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-[#c4a484] w-12 text-right">
              {formatTime(currentTime)}
            </span>
            <div className="relative flex-1 group/slider">
              <input
                type="range"
                min={0}
                max={totalDuration}
                step={0.5}
                value={currentTime}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#1c140c] rounded appearance-none cursor-pointer accent-[#c4a484] hover:bg-[#2a1d12] focus:outline-none"
              />
              {/* Scene timestamp markers */}
              <div className="absolute inset-0 pointer-events-none flex justify-between px-1">
                {FULL_SCRIPT_SCENES.map((sc) => (
                  <div
                    key={sc.id}
                    className="w-1 h-1.5 bg-[#c4a484]/40"
                    style={{ left: `${(sc.timeStartSeconds / totalDuration) * 100}%` }}
                    title={sc.actTitle}
                  />
                ))}
              </div>
            </div>
            <span className="text-[11px] font-mono text-[#7a6a58] w-12">
              {formatTime(totalDuration)}
            </span>
          </div>

          {/* Control Buttons Strip */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                id="btn-play-toggle"
                onClick={togglePlay}
                className="p-1.5 bg-[#1c140c] hover:bg-[#2a1d12] text-[#f5e6d3] rounded border border-[#3a2d1f] hover:border-[#c4a484] cursor-pointer transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4 text-[#c4a484]" /> : <Play className="w-4 h-4 text-[#c4a484]" />}
              </button>

              <button
                onClick={() => handleStepFrame(false)}
                className="p-1.5 bg-[#140e08] hover:bg-[#1c140c] text-[#8a7a6a] hover:text-[#f5e6d3] border border-[#3a2d1f] rounded text-xs font-mono cursor-pointer transition-colors"
                title="Step Back 1 Sec"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleStepFrame(true)}
                className="p-1.5 bg-[#140e08] hover:bg-[#1c140c] text-[#8a7a6a] hover:text-[#f5e6d3] border border-[#3a2d1f] rounded text-xs font-mono cursor-pointer transition-colors"
                title="Step Forward 1 Sec"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleSeek(0)}
                className="p-1.5 bg-[#140e08] hover:bg-[#1c140c] text-[#8a7a6a] hover:text-[#f5e6d3] border border-[#3a2d1f] rounded cursor-pointer transition-colors"
                title="Rewind to Start"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Speed toggle */}
              <button
                onClick={() => setPlaybackSpeed((s) => (s === 1 ? 2 : s === 2 ? 4 : 1))}
                className="px-2 py-1 bg-[#140e08] hover:bg-[#1c140c] text-[#c4a484] border border-[#3a2d1f] font-mono text-xs rounded cursor-pointer"
                title="Playback Speed"
              >
                {playbackSpeed}x
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Grain toggle */}
              <button
                onClick={() => setIsFilmGrainEnabled(!isFilmGrainEnabled)}
                className={`text-xs font-mono px-2.5 py-1 rounded cursor-pointer border ${
                  isFilmGrainEnabled ? 'bg-[#1c140c] text-[#c4a484] border-[#c4a484]/50' : 'bg-[#140e08] text-[#5a4d3f] border-[#3a2d1f]'
                }`}
                title="Toggle 1932 Film Grain"
              >
                1932 Grain
              </button>

              {/* Subtitles toggle */}
              <button
                onClick={() => setShowSubtitles(!showSubtitles)}
                className={`text-xs font-mono px-2.5 py-1 rounded cursor-pointer border ${
                  showSubtitles ? 'bg-[#1c140c] text-[#f5e6d3] border-[#c4a484]/50' : 'bg-[#140e08] text-[#5a4d3f] border-[#3a2d1f]'
                }`}
              >
                Subtitles
              </button>

              {/* Mute button */}
              <button
                onClick={toggleMute}
                className="p-1.5 bg-[#140e08] hover:bg-[#1c140c] text-[#8a7a6a] border border-[#3a2d1f] rounded cursor-pointer"
                title={isMuted ? 'Unmute Projector Audio' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#c4a484]" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
