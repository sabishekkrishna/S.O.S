import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  Key, 
  Compass, 
  Film, 
  Search, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Award,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { ESTEEMED_DOCUMENTS } from '../data/scriptData';
import { audioEngine } from '../utils/audioSynthesizer';

interface VaultTerminalProps {
  onBackToCinema: () => void;
  onOpenInvestigation: () => void;
}

export const VaultTerminal: React.FC<VaultTerminalProps> = ({
  onBackToCinema,
  onOpenInvestigation
}) => {
  const [enteredCode, setEnteredCode] = useState<string>('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<number>(0);
  const [isEngaging, setIsEngaging] = useState<boolean>(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanInput = enteredCode.trim().toUpperCase();
    if (!cleanInput) return;

    setIsEngaging(true);
    audioEngine.playVaultTumblerClick();

    setTimeout(() => {
      setIsEngaging(false);
      const isCorrect = ESTEEMED_DOCUMENTS.alternateAccepted.includes(cleanInput);

      if (isCorrect) {
        audioEngine.playVaultUnlockSequence();
        setIsUnlocked(true);
        setErrorMessage(null);
      } else {
        setAttempts((prev) => prev + 1);
        setErrorMessage('The locking tumblers fail to engage. That is not the vault\'s true name.');
      }
    }, 600);
  };

  const handleResetVault = () => {
    setIsUnlocked(false);
    setEnteredCode('');
    setErrorMessage(null);
  };

  return (
    <div id="vault-terminal-view" className="w-full flex flex-col items-center justify-center gap-8 py-4">
      {/* Top Breadcrumb */}
      <div className="w-full max-w-2xl flex items-center justify-between border-b border-[#3a2d1f] pb-3 text-xs font-mono text-[#8a7a6a]">
        <div className="flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-[#c4a484]" />
          <span>Subterranean Vault Terminal • Thorne Estate 1932</span>
        </div>
        <span>SECTOR IV — HEAVY REINFORCED STEEL</span>
      </div>

      {/* Main Steel Vault Door Unit */}
      <div className="w-full max-w-2xl bg-[#140e08] rounded-xl border-4 border-[#3a2d1f] p-6 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col items-center gap-6 relative overflow-hidden">
        {/* Subtle Decorative Rivets */}
        <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-[#1c140c] border border-[#3a2d1f]" />
        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-[#1c140c] border border-[#3a2d1f]" />
        <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-[#1c140c] border border-[#3a2d1f]" />
        <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-[#1c140c] border border-[#3a2d1f]" />

        {/* Central Circular Lock Dial Graphic */}
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full border-8 border-[#3a2d1f] bg-[#0a0502] flex items-center justify-center shadow-[0_0_30px_rgba(196,164,132,0.15)] select-none">
          {/* Dial Markers */}
          <div className="absolute inset-2 rounded-full border border-dashed border-[#c4a484]/30 pointer-events-none" />
          
          {/* Central Hub */}
          <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[#c4a484] bg-[#1c140c] flex flex-col items-center justify-center transition-all duration-700 shadow-inner ${
            isUnlocked ? 'scale-110 bg-[#2a1d12] border-amber-400' : isEngaging ? 'rotate-90' : ''
          }`}>
            {isUnlocked ? (
              <Unlock className="w-10 h-10 text-[#c4a484] animate-bounce" />
            ) : (
              <Lock className="w-10 h-10 text-[#c4a484]" />
            )}
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#c4a484] mt-1 font-bold">
              {isUnlocked ? 'UNSEALED' : 'LOCKED'}
            </span>
          </div>

          {/* Mechanical Needle */}
          <div className="absolute top-2 w-3 h-3 bg-[#c4a484] transform rotate-45 border border-white" />
        </div>

        {/* Vault State Content */}
        {!isUnlocked ? (
          /* LOCKED TERMINAL INTERFACE */
          <div className="w-full space-y-6 text-center">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif text-[#f5e6d3] uppercase tracking-widest">
                "Speak the vault's true name."
              </h2>
              <p className="text-xs text-[#8a7a6a] font-serif italic mt-1">
                Enter the deduced keyword to release the internal deadbolts.
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
              <div className="relative">
                <input
                  id="vault-code-input"
                  type="text"
                  value={enteredCode}
                  onChange={(e) => {
                    setEnteredCode(e.target.value.toUpperCase());
                    setErrorMessage(null);
                  }}
                  placeholder="ENTER VAULT KEYWORD..."
                  disabled={isEngaging}
                  className="w-full py-3.5 px-4 bg-[#0a0502] text-center font-mono text-lg font-bold tracking-[0.25em] text-[#c4a484] rounded border-2 border-[#3a2d1f] focus:outline-none focus:border-[#c4a484] placeholder:text-[#5a4d3f] transition-all"
                  autoFocus
                />
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 bg-red-950/40 border border-red-800/60 rounded text-red-300 text-xs font-serif flex items-center justify-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onOpenInvestigation}
                  className="flex-1 py-3 bg-[#140e08] hover:bg-[#1c140c] text-[#8a7a6a] hover:text-[#f5e6d3] text-xs font-mono rounded border border-[#3a2d1f] cursor-pointer transition-colors"
                >
                  Return to Evidence Desk
                </button>
                <button
                  type="submit"
                  disabled={isEngaging || !enteredCode.trim()}
                  className="flex-1 py-3 bg-[#1c140c] hover:bg-[#2a1d12] text-[#f5e6d3] text-xs font-mono font-bold tracking-wider rounded border-2 border-[#c4a484] shadow-[0_0_15px_rgba(196,164,132,0.2)] disabled:opacity-50 cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Key className="w-4 h-4 text-[#c4a484]" />
                  <span>Engage Tumblers</span>
                </button>
              </div>

              {attempts > 0 && (
                <div className="text-[10px] font-mono text-[#7a6a58]">
                  Failed lock attempts recorded: {attempts}
                </div>
              )}
            </form>
          </div>
        ) : (
          /* UNLOCKED CHAMBER REVELATION */
          <div className="w-full space-y-6 animate-fade-in text-center">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-[#1c140c] px-4 py-1.5 rounded-full border border-[#c4a484] text-xs font-mono text-[#c4a484]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CHAMBER SUCCESSFULLY UNSEALED</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#f5e6d3] uppercase tracking-widest">
                The Estate Vault Has Opened
              </h2>
              <p className="text-xs text-[#8a7a6a] font-serif italic">
                The heavy locking bolts have retracted. The unsealed documents of Elias Thorne lie before you.
              </p>
            </div>

            {/* Recovered Journal & Deed Parchment */}
            <div className="bg-[#ebdcc2] text-neutral-950 p-6 sm:p-8 rounded-lg shadow-2xl border-4 border-[#8c6b45] text-left space-y-4 font-serif relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-neutral-700/60 pb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-800">
                  Estate Vault Archive — Box 01
                </span>
                <span className="text-[10px] font-mono text-neutral-700">
                  September 18, 1932
                </span>
              </div>

              <div className="text-xs leading-relaxed text-neutral-900 whitespace-pre-line italic">
                {ESTEEMED_DOCUMENTS.eliasJournal}
              </div>

              <div className="border-t border-neutral-700/60 pt-3 flex items-center justify-between text-[11px] font-mono text-neutral-800 font-bold">
                <span>SEAL: VERIFIED</span>
                <span>STATUS: ARCHIVE COMPLETE</span>
              </div>
            </div>

            {/* Restart/Reset Buttons */}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={handleResetVault}
                className="px-4 py-2 bg-[#140e08] hover:bg-[#1c140c] text-[#8a7a6a] hover:text-[#f5e6d3] text-xs font-mono rounded border border-[#3a2d1f] flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Vault Mechanism</span>
              </button>
              <button
                onClick={onBackToCinema}
                className="px-5 py-2 bg-[#1c140c] hover:bg-[#2a1d12] text-[#f5e6d3] text-xs font-mono font-bold rounded border border-[#c4a484] flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Film className="w-3.5 h-3.5 text-[#c4a484]" />
                <span>Return to Cinema Reel</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
