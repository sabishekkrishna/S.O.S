/**
 * 1932 Thorne Estate Web Audio Synthesizer Engine
 * Generates realistic vintage audio:
 * - Mechanical 16mm film projector clicks
 * - Wooden desk tapping (Morse code ··· for S)
 * - 1930s AM radio static & valve tube hum
 * - Reverse speech simulation & actual forward/backward audio playback
 * - Heavy mechanical vault tumbler clicks & latch release
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private projectorOsc: OscillatorNode | null = null;
  private projectorGain: GainNode | null = null;
  private projectorInterval: number | null = null;
  private radioNoiseNode: AudioNode | null = null;
  private radioGain: GainNode | null = null;
  private isMuted: boolean = false;

  private initCtx(): AudioContext {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopProjectorAudio();
      this.stopRadioStatic();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // --- Projector Clicking Sound (Mechanical 1932 motor + shutter) ---
  public startProjectorAudio() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      this.stopProjectorAudio();

      this.projectorInterval = window.setInterval(() => {
        if (this.isMuted || !this.ctx) return;
        this.playSingleProjectorClick(ctx);
      }, 100); // 10 fps shutter click cadence
    } catch {
      // AudioContext might be blocked until user gesture
    }
  }

  private playSingleProjectorClick(ctx: AudioContext) {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, t);
    filter.Q.setValueAtTime(3.0, t);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.03);

    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.04);
  }

  public stopProjectorAudio() {
    if (this.projectorInterval) {
      clearInterval(this.projectorInterval);
      this.projectorInterval = null;
    }
    if (this.projectorOsc) {
      try {
        this.projectorOsc.stop();
      } catch {}
      this.projectorOsc = null;
    }
  }

  // --- Elias Thorne's Desk Tapping (Morse Code ··· = S) ---
  public playDeskTapPattern(onTap?: (index: number) => void) {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    const tapTimes = [0, 0.28, 0.56]; // 3 short taps

    tapTimes.forEach((delay, idx) => {
      setTimeout(() => {
        if (this.isMuted) return;
        this.playSingleDeskTap(ctx);
        if (onTap) onTap(idx);
      }, delay * 1000);
    });
  }

  public playSingleDeskTap(ctx?: AudioContext) {
    const context = ctx || this.initCtx();
    const t = context.currentTime;

    // Dual body resonance for realistic wooden mahogany desk knock
    const osc1 = context.createOscillator();
    const osc2 = context.createOscillator();
    const gain1 = context.createGain();
    const gain2 = context.createGain();
    const filter = context.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, t);

    // Initial sharp transient knuckle strike
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(320, t);
    osc1.frequency.exponentialRampToValueAtTime(90, t + 0.07);

    gain1.gain.setValueAtTime(0.35, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    // Wood body hollow thud
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(160, t);
    osc2.frequency.exponentialRampToValueAtTime(70, t + 0.12);

    gain2.gain.setValueAtTime(0.25, t);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain1);
    filter.connect(gain2);
    gain1.connect(context.destination);
    gain2.connect(context.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.08);
    osc2.stop(t + 0.13);
  }

  // --- 1930s Valve Radio Static & Tube Glow Hum ---
  public startRadioStatic() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      this.stopRadioStatic();

      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(1400, ctx.currentTime);
      bandpass.Q.setValueAtTime(1.8, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.06, ctx.currentTime);

      whiteNoise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
      this.radioNoiseNode = whiteNoise;
      this.radioGain = gain;
    } catch {}
  }

  public stopRadioStatic() {
    if (this.radioNoiseNode) {
      try {
        (this.radioNoiseNode as AudioBufferSourceNode).stop();
      } catch {}
      this.radioNoiseNode = null;
    }
  }

  // --- Reversed Audio Radio Synthesis ("The letter you want is Oscar") ---
  public playRadioClueAudio(reverse: boolean = false, onEnded?: () => void) {
    if (this.isMuted) {
      if (onEnded) onEnded();
      return;
    }

    const textToSpeak = "The letter you want is Oscar.";

    // If browser supports SpeechSynthesis, synthesize utterance and speech audio
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.85;
      utterance.pitch = 0.9;
      
      // If we want reverse audio simulation via Web Audio synthetic backwards phoneme envelope:
      if (reverse) {
        this.playSyntheticBackwardsChirp(onEnded);
      } else {
        utterance.onend = () => {
          if (onEnded) onEnded();
        };
        window.speechSynthesis.speak(utterance);
      }
    } else {
      this.playSyntheticBackwardsChirp(onEnded);
    }
  }

  private playSyntheticBackwardsChirp(onEnded?: () => void) {
    const ctx = this.initCtx();
    const duration = 2.4;
    const sampleRate = ctx.sampleRate;
    const frameCount = sampleRate * duration;
    const audioBuffer = ctx.createBuffer(1, frameCount, sampleRate);
    const data = audioBuffer.getChannelData(0);

    // Formant backwards wave synthesis with reverse envelopes
    for (let i = 0; i < frameCount; i++) {
      const t = i / sampleRate;
      const reverseT = duration - t;
      // Synthesize reversed voice-like harmonic peaks
      const f1 = 280 + Math.sin(reverseT * 6.5) * 80;
      const f2 = 720 + Math.cos(reverseT * 4.2) * 180;
      const f3 = 1800 + Math.sin(reverseT * 9.1) * 350;

      const voice = (
        Math.sin(2 * Math.PI * f1 * t) * 0.4 +
        Math.sin(2 * Math.PI * f2 * t) * 0.3 +
        Math.sin(2 * Math.PI * f3 * t) * 0.2
      );

      // Backwards swelling amplitude envelope (crescendo ramps that cut sharply)
      const swell = (Math.sin(reverseT * 8) + 1) * 0.5;
      const noise = (Math.random() * 2 - 1) * 0.15;
      data[i] = (voice * swell + noise) * 0.25;
    }

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, ctx.currentTime);
    filter.Q.setValueAtTime(1.5, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.onended = () => {
      if (onEnded) onEnded();
    };

    source.start();
  }

  // --- Mechanical Vault Tumbler Dial Click ---
  public playVaultTumblerClick() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1200, t);

    osc.type = 'square';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.02);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.03);
  }

  // --- Vault Unlock Clunk & Sliding Heavy Steel Bolt ---
  public playVaultUnlockSequence() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    const t = ctx.currentTime;

    // Heavy locking bolt thud
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(90, t);
    osc1.frequency.exponentialRampToValueAtTime(30, t + 0.6);

    gain1.gain.setValueAtTime(0.4, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.75);

    // Resonant brass gears settling
    setTimeout(() => {
      if (this.isMuted) return;
      const t2 = ctx.currentTime;
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(440, t2);
      osc2.frequency.exponentialRampToValueAtTime(220, t2 + 0.5);

      gain2.gain.setValueAtTime(0.2, t2);
      gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.6);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(t2);
      osc2.stop(t2 + 0.65);
    }, 250);
  }
}

export const audioEngine = new AudioEngine();
