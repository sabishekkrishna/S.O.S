import { ScriptScene } from '../types';

export const FULL_SCRIPT_SCENES: ScriptScene[] = [
  {
    id: 'act-1-hook',
    actTitle: 'ACT 1 — THE HOOK',
    actSubtitle: 'Restored Footage',
    timeStartSeconds: 0,
    timeEndSeconds: 90,
    timeDisplay: '0:00–1:30',
    textCard: 'RECOVERED FOOTAGE — DAMAGED REEL\nProperty of the Thorne Estate, 1932\nRestored for viewing, 1932',
    visualDescription:
      'SCREEN: Black. A film-projector clicking sound. Sepia grain fades in.\n\nVISUAL: Restored archival reel begins. At 1:12, a single-frame flash of a hand-drawn 5×5 symbol grid on a torn page is visible on the reel emulsion.',
    speaker: 'NARRATOR',
    dialogueText:
      '"In the autumn of 1932, cartographer Elias Thorne vanished without a trace. He left behind only this — his final reel, and a vault no one has ever opened. He believed the vault should only open for someone patient enough to truly look. Everything you need is already in front of you. Watch closely. Listen closer."',
    archivalNotes: 'Audio track contains mechanical projector motor hum and narration recorded on 16mm optical sound strip.'
  },
  {
    id: 'act-2-frag-1',
    actTitle: 'ACT 2, FRAGMENT 1',
    actSubtitle: '"REEL IX: THE STUDY"',
    reelNumber: 'REEL IX',
    numericReel: 9,
    timeStartSeconds: 90,
    timeEndSeconds: 180,
    timeDisplay: '1:30–3:00',
    textCard: 'REEL IX',
    visualDescription:
      'Elias Thorne sits at a writing desk, quill in hand, a bookshelf visible behind him. He speaks directly to camera. While speaking, his other hand taps the mahogany surface with a deliberate cadence.',
    speaker: 'THORNE',
    dialogueText:
      '"They think I mapped mountains and rivers. I mapped something else — a promise. If you\'ve come this far, you already understand: nothing here is wasted motion. Even my hands are trying to tell you something."',
    archivalNotes: 'Acoustic microphone capture from Thorne Estate study. Distinct percussive desk knocks recorded on audio track.'
  },
  {
    id: 'act-2-frag-2',
    actTitle: 'ACT 2, FRAGMENT 2',
    actSubtitle: '"REEL VII: THE RADIO"',
    reelNumber: 'REEL VII',
    numericReel: 7,
    timeStartSeconds: 180,
    timeEndSeconds: 270,
    timeDisplay: '3:00–4:30',
    textCard: 'REEL VII',
    visualDescription:
      'An old valve radio receiver on a table, dial glowing in the dim room. Radio static plays over an obscured, backwards-sounding broadcast transmission.',
    subtitle: '...some things must be turned back the way they came...',
    speaker: 'RADIO',
    dialogueText:
      'Vocal broadcast transmission masked beneath warm tube static.',
    archivalNotes: '1932 shortwave valve radio signal recording. Audio signal modulated across reverse magnetic frequency.'
  },
  {
    id: 'act-2-frag-3',
    actTitle: 'ACT 2, FRAGMENT 3',
    actSubtitle: '"REEL III: THE MAP ROOM"',
    reelNumber: 'REEL III',
    numericReel: 3,
    timeStartSeconds: 270,
    timeEndSeconds: 375,
    timeDisplay: '4:30–6:15',
    textCard: 'REEL III',
    visualDescription:
      'A large wall survey map covered in pins connected by red string. Camera slowly pans across the entire map surface. In the corner of the survey map, a small handwritten postmark number is visible.',
    speaker: 'THORNE',
    dialogueText:
      '"A vault is only a door. Count what holds the string, and you\'ll have the first key. The corner remembers what the shift should be."',
    archivalNotes: 'Survey map of Thorne Valley. Fixed nodes linked by surveyor string, stamped with archival postmark.'
  },
  {
    id: 'act-2-frag-4',
    actTitle: 'ACT 2, FRAGMENT 4',
    actSubtitle: '"REEL I: THE LETTER"',
    reelNumber: 'REEL I',
    numericReel: 1,
    timeStartSeconds: 375,
    timeEndSeconds: 480,
    timeDisplay: '6:15–8:00',
    textCard: 'REEL I',
    visualDescription:
      'Close-up of a hand-written letter with burned edges. The legible text inscribed on the parchment is written in Elias Thorne\'s distinct hand.',
    speaker: 'THORNE',
    dialogueText:
      '"I never trusted plain words with plain meaning. Shift them the way the map told you, and read again."',
    subtitle: 'WKH YDXOW RSHQV WR VHYHQ',
    archivalNotes: 'Original recovered manuscript fragment. Inscribed cipher text preserved intact.'
  },
  {
    id: 'act-3-convergence',
    actTitle: 'ACT 3 — THE CONVERGENCE',
    actSubtitle: 'Montage of the Four Reels',
    timeStartSeconds: 480,
    timeEndSeconds: 540,
    timeDisplay: '8:00–9:00',
    textCard: 'You have four reels. Only the order is missing. Look again at how they were numbered.',
    visualDescription:
      'A quick montage displays the four recovered title cards in sequence: REEL IX, REEL VII, REEL III, REEL I.',
    speaker: 'NARRATOR',
    dialogueText:
      '"I did not save these in the order I filmed them. I saved them in the order that matters. Highest to lowest, Elias Thorne always finished what he started backward."',
    archivalNotes: 'Montage sequence aligning the four archival reel designations.'
  },
  {
    id: 'act-4-closing',
    actTitle: 'ACT 4 — CLOSING CARD',
    actSubtitle: 'The Password Prompt',
    timeStartSeconds: 540,
    timeEndSeconds: 570,
    timeDisplay: '9:00–9:30',
    textCard: 'Speak the vault\'s true name.',
    visualDescription:
      'The screen fades to black as the locking tumblers click, awaiting the vault\'s true name.',
    speaker: 'TEXT_ONLY',
    dialogueText: 'Speak the vault\'s true name.',
    archivalNotes: 'Mechanical locking tumblers engaged. Subterranean vault terminal awaits entry.'
  }
];

export const ESTEEMED_DOCUMENTS = {
  vaultName: 'SEVEN',
  alternateAccepted: ['SEVEN', '7', 'THE VAULT OPENS TO SEVEN'],
  eliasJournal: `September 18, 1932 — The Estate Vault

To whichever voyager had the patience to listen when others only watched:

If you are reading this within the steel chamber, you have understood my life's doctrine. Geography is not the measurement of stone and soil; it is the tracing of human commitments across silence. 

The seven pins on the study wall were never points of departure — they were the seven watchtowers along the Northern Ridge where our telegraph lines stood in 1917. The radio dial was tuned to the old frequency we used before the blackout.

Keep what you find here safe from the creditors and collectors. The original boundary deeds to the Thorne Valley are filed in drawer IV. They belong to the township now.

— Elias Thorne, Cartographer`,
  mapDescription: 'Original 1932 Hand-drafted Survey of Thorne Valley, bearing the 7 watchtower coordinates and Elias Thorne\'s wax seal.'
};
