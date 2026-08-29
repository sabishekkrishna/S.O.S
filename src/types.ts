export type ViewMode = 'film' | 'investigation' | 'script' | 'vault';

export interface ScriptScene {
  id: string;
  actTitle: string;
  actSubtitle: string;
  reelNumber?: string;
  numericReel?: number;
  timeStartSeconds: number;
  timeEndSeconds: number;
  timeDisplay: string;
  textCard: string;
  visualDescription: string;
  speaker: 'NARRATOR' | 'THORNE' | 'RADIO' | 'TEXT_ONLY';
  dialogueText: string;
  subtitle?: string;
  archivalNotes?: string;
  audioSetting?: string;
}

export interface ClueItem {
  id: string;
  reelName: string;
  title: string;
  description: string;
  rawEvidence: string;
  toolType: 'rhythm' | 'reverse_audio' | 'map_pins' | 'caesar_cipher' | 'subliminal_grid' | 'reel_order';
}

export interface VaultState {
  isUnlocked: boolean;
  enteredCode: string;
  unlockedAt?: Date;
  attemptCount: number;
}
