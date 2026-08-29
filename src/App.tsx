/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Film, 
  Search, 
  FileText, 
  Lock, 
  Compass, 
  Volume2, 
  VolumeX, 
  HelpCircle,
  Clock,
  Key
} from 'lucide-react';
import { ViewMode } from './types';
import { FilmProjectorView } from './components/FilmProjectorView';
import { InvestigationDesk } from './components/InvestigationDesk';
import { FullScriptAnnotatedView } from './components/FullScriptAnnotatedView';
import { VaultTerminal } from './components/VaultTerminal';
import { audioEngine } from './utils/audioSynthesizer';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('film');
  const [selectedTool, setSelectedTool] = useState<string>('caesar_cipher');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [showBriefingModal, setShowBriefingModal] = useState<boolean>(false);

  const handleOpenWorkbenchWithTool = (toolType?: string) => {
    if (toolType) setSelectedTool(toolType);
    setCurrentView('investigation');
  };

  const handleJumpToFilmTime = (seconds: number) => {
    setCurrentView('film');
  };

  const toggleMasterAudio = () => {
    const next = !isAudioMuted;
    setIsAudioMuted(next);
    audioEngine.setMuted(next);
  };

  return (
    <div className="min-h-screen bg-[#0a0502] text-[#d1d1d1] flex flex-col font-serif selection:bg-[#3a2d1f] selection:text-[#f5e6d3] border-4 border-[#1a120b] box-border">
      {/* Top Vintage Archival Header */}
      <header className="sticky top-0 z-50 bg-[#0a0502]/95 backdrop-blur-md border-b border-[#3a2d1f] px-4 lg:px-8 py-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setCurrentView('film')}>
            <div className="w-10 h-10 rounded bg-[#140e08] border border-[#3a2d1f] flex items-center justify-center text-[#c4a484] shadow-[0_0_10px_rgba(196,164,132,0.1)]">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#7a6a58] block mb-0.5 font-sans">
                Digital Restoration Archive
              </span>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg sm:text-xl text-[#c4a484] font-light tracking-widest uppercase">
                  The Thorne Estate • 1932 Archive
                </h1>
                <span className="text-[9px] font-mono text-[#c4a484] bg-[#1c140c] px-2 py-0.5 rounded border border-[#3a2d1f] tracking-widest">
                  RESTORED
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-2 bg-[#140e08] p-1.5 rounded-lg border border-[#3a2d1f]">
            <button
              id="nav-film-view"
              onClick={() => setCurrentView('film')}
              className={`px-3.5 py-1.5 rounded text-xs uppercase tracking-widest font-serif transition-all flex items-center gap-2 cursor-pointer ${
                currentView === 'film'
                  ? 'border-2 border-[#c4a484] bg-[#1c140c] text-[#f5e6d3] shadow-[0_0_15px_rgba(196,164,132,0.1)]'
                  : 'text-[#8a7a6a] hover:text-[#f5e6d3] hover:bg-[#1a120b]'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-[#c4a484]" />
              <span>Cinema Reel</span>
            </button>

            <button
              id="nav-investigation-view"
              onClick={() => setCurrentView('investigation')}
              className={`px-3.5 py-1.5 rounded text-xs uppercase tracking-widest font-serif transition-all flex items-center gap-2 cursor-pointer ${
                currentView === 'investigation'
                  ? 'border-2 border-[#c4a484] bg-[#1c140c] text-[#f5e6d3] shadow-[0_0_15px_rgba(196,164,132,0.1)]'
                  : 'text-[#8a7a6a] hover:text-[#f5e6d3] hover:bg-[#1a120b]'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-[#c4a484]" />
              <span>Evidence Desk</span>
            </button>

            <button
              id="nav-script-view"
              onClick={() => setCurrentView('script')}
              className={`px-3.5 py-1.5 rounded text-xs uppercase tracking-widest font-serif transition-all flex items-center gap-2 cursor-pointer ${
                currentView === 'script'
                  ? 'border-2 border-[#c4a484] bg-[#1c140c] text-[#f5e6d3] shadow-[0_0_15px_rgba(196,164,132,0.1)]'
                  : 'text-[#8a7a6a] hover:text-[#f5e6d3] hover:bg-[#1a120b]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#c4a484]" />
              <span>Transcripts</span>
            </button>

            <button
              id="nav-vault-view"
              onClick={() => setCurrentView('vault')}
              className={`px-3.5 py-1.5 rounded text-xs uppercase tracking-widest font-serif font-bold transition-all flex items-center gap-2 cursor-pointer ${
                currentView === 'vault'
                  ? 'border-2 border-[#c4a484] bg-[#2a1d12] text-[#f5e6d3] shadow-[0_0_20px_rgba(196,164,132,0.25)]'
                  : 'text-[#c4a484] hover:text-[#f5e6d3] hover:bg-[#1a120b]'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-[#c4a484]" />
              <span>The Vault</span>
            </button>
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMasterAudio}
              className={`p-2 rounded border text-xs cursor-pointer transition-colors ${
                isAudioMuted 
                  ? 'bg-[#1a120b] border-red-900/60 text-red-400' 
                  : 'bg-[#140e08] border-[#3a2d1f] text-[#c4a484] hover:bg-[#1c140c] hover:border-[#c4a484]'
              }`}
              title={isAudioMuted ? 'Unmute Audio Synthesizer' : 'Mute Master Audio'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowBriefingModal(true)}
              className="p-2 rounded bg-[#140e08] hover:bg-[#1c140c] border border-[#3a2d1f] hover:border-[#c4a484] text-[#c4a484] text-xs flex items-center gap-1 cursor-pointer transition-colors"
              title="Case Dossier Briefing"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-start">
        {currentView === 'film' && (
          <FilmProjectorView
            onOpenWorkbench={handleOpenWorkbenchWithTool}
            onOpenVault={() => setCurrentView('vault')}
          />
        )}

        {currentView === 'investigation' && (
          <InvestigationDesk
            initialTool={selectedTool}
            onJumpToVault={() => setCurrentView('vault')}
          />
        )}

        {currentView === 'script' && (
          <FullScriptAnnotatedView
            onJumpToFilmTime={handleJumpToFilmTime}
            onOpenWorkbench={handleOpenWorkbenchWithTool}
          />
        )}

        {currentView === 'vault' && (
          <VaultTerminal
            onBackToCinema={() => setCurrentView('film')}
            onOpenInvestigation={() => setCurrentView('investigation')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#3a2d1f] bg-[#0a0502] px-6 py-4 text-center text-xs font-serif text-[#7a6a58]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="tracking-wide">The Thorne Estate Archive • Recovered 1932 Film Reel & Subterranean Vault</span>
          <span className="font-mono text-[10px] text-[#c4a484] tracking-widest">
            PROPERTY OF THE ESTATE ARCHIVE • SEALED SEPTEMBER 1932
          </span>
        </div>
      </footer>

      {/* Case Briefing Dossier Modal - Zero Hints, Pure Atmosphere */}
      {showBriefingModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#140e08] text-[#d1d1d1] p-6 md:p-8 rounded-lg max-w-lg w-full border-2 border-[#3a2d1f] shadow-[0_0_30px_rgba(0,0,0,0.8)] space-y-4 font-serif relative">
            <div className="flex items-center justify-between border-b border-[#3a2d1f] pb-3">
              <div>
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#7a6a58] block font-sans">
                  Archival Investigation Dossier
                </span>
                <h3 className="text-base text-[#c4a484] font-light tracking-widest uppercase flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#c4a484]" />
                  <span>The Thorne Estate (1932)</span>
                </h3>
              </div>
              <button
                onClick={() => setShowBriefingModal(false)}
                className="text-[#7a6a58] hover:text-[#f5e6d3] font-mono text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs leading-relaxed text-[#a39483] italic">
              "In the autumn of 1932, cartographer Elias Thorne vanished without a trace. He left behind a 9:30 film reel split across four numbered fragments and a heavy steel vault that has never been opened."
            </p>

            <div className="bg-[#1c140c] p-4 rounded border border-[#3a2d1f] text-xs space-y-2.5 text-[#d1d1d1]">
              <div className="text-[10px] font-mono uppercase text-[#c4a484] tracking-wider font-bold">
                Instructions for Participants:
              </div>
              <ul className="space-y-1.5 list-disc list-inside text-[#a39483] text-xs">
                <li><strong className="text-[#f5e6d3]">Cinema Reel:</strong> Watch the restored footage carefully. Observe visual details, listen to sound recordings, and scrutinize every frame.</li>
                <li><strong className="text-[#f5e6d3]">Evidence Desk:</strong> Inspect recovered artifacts, test cryptographic theories, analyze audio waveforms, and examine survey maps.</li>
                <li><strong className="text-[#f5e6d3]">Transcripts:</strong> Review verbatim dialogue logs and scene records preserved from the estate.</li>
                <li><strong className="text-[#f5e6d3]">The Vault:</strong> Deduce the true key required to engage the mechanical locking tumblers and unseal the chamber.</li>
              </ul>
            </div>

            <p className="text-xs italic text-[#7a6a58] text-center border-t border-[#3a2d1f] pt-3">
              "Everything you need is already in front of you. Watch closely. Listen closer."
            </p>

            <button
              onClick={() => setShowBriefingModal(false)}
              className="w-full py-2.5 bg-[#1c140c] hover:bg-[#2a1d12] border border-[#c4a484]/50 hover:border-[#c4a484] text-[#c4a484] hover:text-[#f5e6d3] text-xs font-mono uppercase tracking-widest rounded cursor-pointer transition-all"
            >
              Enter Investigation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
