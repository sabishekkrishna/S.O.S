import React, { useState } from 'react';
import { 
  FileText, 
  Play, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Radio, 
  MapPin, 
  Key, 
  Eye, 
  Sparkles,
  Bookmark,
  Edit3
} from 'lucide-react';
import { FULL_SCRIPT_SCENES } from '../data/scriptData';
import { ScriptScene } from '../types';

interface FullScriptAnnotatedViewProps {
  onJumpToFilmTime: (seconds: number) => void;
  onOpenWorkbench: (toolType?: string) => void;
}

export const FullScriptAnnotatedView: React.FC<FullScriptAnnotatedViewProps> = ({
  onJumpToFilmTime,
  onOpenWorkbench
}) => {
  const [selectedSceneId, setSelectedSceneId] = useState<string>(FULL_SCRIPT_SCENES[0].id);
  const [sceneNotes, setSceneNotes] = useState<{ [id: string]: string }>({});

  const activeScene = FULL_SCRIPT_SCENES.find((s) => s.id === selectedSceneId) || FULL_SCRIPT_SCENES[0];

  const handleNoteChange = (sceneId: string, text: string) => {
    setSceneNotes((prev) => ({
      ...prev,
      [sceneId]: text
    }));
  };

  return (
    <div id="archival-transcripts-view" className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#3a2d1f] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#c4a484] font-mono text-[10px] uppercase tracking-[0.25em]">
            <FileText className="w-3.5 h-3.5 text-[#c4a484]" />
            <span>Estate Preservation Society • Archival Records</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light font-serif tracking-widest text-[#f5e6d3] uppercase mt-1">
            Archival Transcripts & Scene Logs
          </h2>
          <p className="text-xs text-[#8a7a6a] font-serif italic tracking-wide">
            Verbatim dialogue transcripts, scene settings, recovered audio logs, and visual camera direction from the 1932 restoration.
          </p>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scene Selector List */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          <span className="text-[10px] font-mono text-[#7a6a58] uppercase tracking-wider mb-1">
            Archival Scene Index (9:30 Total)
          </span>
          <div className="space-y-2">
            {FULL_SCRIPT_SCENES.map((scene, idx) => {
              const isSelected = selectedSceneId === scene.id;
              return (
                <div
                  key={scene.id}
                  onClick={() => setSelectedSceneId(scene.id)}
                  className={`p-3.5 rounded border transition-all cursor-pointer flex flex-col gap-1.5 ${
                    isSelected
                      ? 'border-2 border-[#c4a484] bg-[#1c140c] text-[#f5e6d3] shadow-[0_0_15px_rgba(196,164,132,0.1)]'
                      : 'bg-[#140e08] border-[#3a2d1f] text-[#8a7a6a] hover:bg-[#1a120b] hover:text-[#f5e6d3]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#c4a484]">
                      {scene.reelNumber || `ACT ${idx + 1}`}
                    </span>
                    <span className="text-[10px] font-mono bg-[#0a0502] px-2 py-0.5 rounded border border-[#3a2d1f] text-[#7a6a58]">
                      {scene.timeDisplay}
                    </span>
                  </div>
                  <div className="text-xs font-serif font-bold text-[#f5e6d3]">
                    {scene.actTitle}
                  </div>
                  <div className="text-[11px] font-serif text-[#8a7a6a] line-clamp-1 italic">
                    {scene.actSubtitle}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Scene Transcript & Investigator Log */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-[#140e08] rounded-lg border border-[#3a2d1f] p-6 shadow-xl space-y-6">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#3a2d1f] pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#c4a484] uppercase tracking-widest block">
                  {activeScene.timeDisplay} • {activeScene.reelNumber || 'REEL INTRO'}
                </span>
                <h3 className="text-xl font-serif text-[#f5e6d3] uppercase mt-1">
                  {activeScene.actTitle}
                </h3>
                <p className="text-xs text-[#8a7a6a] font-serif italic">
                  {activeScene.actSubtitle}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onJumpToFilmTime(activeScene.timeStartSeconds)}
                  className="px-3 py-1.5 bg-[#1c140c] hover:bg-[#2a1d12] text-[#f5e6d3] text-xs font-mono rounded border border-[#3a2d1f] hover:border-[#c4a484] flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Play className="w-3.5 h-3.5 text-[#c4a484]" />
                  <span>Jump to Film ({activeScene.timeDisplay.split('–')[0]})</span>
                </button>
              </div>
            </div>

            {/* On-Screen Text Card */}
            {activeScene.textCard && (
              <div className="bg-[#0a0502] p-4 rounded border border-[#3a2d1f] space-y-1.5">
                <div className="text-[10px] font-mono text-[#7a6a58] uppercase tracking-widest">
                  Exact On-Screen Text Card:
                </div>
                <div className="font-mono text-xs text-[#c4a484] whitespace-pre-line leading-relaxed">
                  {activeScene.textCard}
                </div>
              </div>
            )}

            {/* Visual Camera Log */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono text-[#7a6a58] uppercase tracking-widest">
                Camera & Visual Setting Log:
              </div>
              <div className="bg-[#0a0502] p-4 rounded border border-[#3a2d1f] text-xs font-serif text-[#d1d1d1] whitespace-pre-line leading-relaxed">
                {activeScene.visualDescription}
              </div>
            </div>

            {/* Verbatim Dialogue */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono text-[#7a6a58] uppercase tracking-widest">
                Verbatim Audio Track & Spoken Monologue:
              </div>
              <div className="bg-[#1c140c] p-4 rounded border border-[#3a2d1f] font-serif text-sm text-[#f5e6d3] leading-relaxed italic">
                {activeScene.dialogueText}
              </div>
            </div>

            {/* Archival Notes */}
            {activeScene.archivalNotes && (
              <div className="bg-[#0a0502] p-3 rounded border border-[#3a2d1f] flex items-center justify-between text-xs font-serif text-[#8a7a6a]">
                <span>Log Reference: {activeScene.archivalNotes}</span>
              </div>
            )}

            {/* Investigator's Scene Log Notes */}
            <div className="border-t border-[#3a2d1f] pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#c4a484] uppercase tracking-widest flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-[#c4a484]" />
                  <span>Investigator's Scene Annotation ({activeScene.reelNumber || activeScene.actTitle})</span>
                </span>
                <span className="text-[10px] font-mono text-[#7a6a58]">Scene Notes</span>
              </div>
              <textarea
                value={sceneNotes[activeScene.id] || ''}
                onChange={(e) => handleNoteChange(activeScene.id, e.target.value)}
                placeholder="Note key observations, visual anomalies, timestamps, and acoustic details from this scene..."
                className="w-full h-24 bg-[#0a0502] text-[#f5e6d3] p-3 rounded border border-[#3a2d1f] font-mono text-xs focus:outline-none focus:border-[#c4a484] resize-none placeholder:text-[#5a4d3f]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
