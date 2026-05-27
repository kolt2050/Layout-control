"use strict";

(() => {
  class WarningAudio {
    constructor() {
      this.context = null;
      this.lastPlayedAt = 0;
    }

    async unlock() {
      try {
        const AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext;
        if (!AudioContextClass) {
          return false;
        }

        this.context = this.context || new AudioContextClass({ latencyHint: "interactive" });
        if (this.context.state === "suspended") {
          await this.context.resume();
        }
        return this.context.state === "running";
      } catch (error) {
        console.debug("Layout Guard could not initialize audio.", error);
        return false;
      }
    }

    async beep(volume, cooldownMs) {
      const now = Date.now();
      if (now - this.lastPlayedAt < cooldownMs) {
        return false;
      }

      try {
        if (!await this.unlock()) {
          return false;
        }

        const start = this.context.currentTime;
        const amplitude = Math.min(1, Math.max(0, Number(volume) / 100)) * 0.36;

        this.playVocalWarning(start, amplitude);

        this.lastPlayedAt = now;
        return true;
      } catch (error) {
        console.debug("Layout Guard could not play its warning beep.", error);
        return false;
      }
    }

    playVocalWarning(start, amplitude) {
      const end = start + 0.24;
      const voiceGain = this.context.createGain();
      const filter = this.context.createBiquadFilter();
      const vibrato = this.context.createOscillator();
      const vibratoGain = this.context.createGain();
      const partials = [
        { frequency: 185, level: 0.56 },
        { frequency: 555, level: 0.28 },
        { frequency: 925, level: 0.18 }
      ];

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(730, start);
      filter.Q.setValueAtTime(0.85, start);
      voiceGain.gain.setValueAtTime(0.0001, start);
      voiceGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, amplitude), start + 0.025);
      voiceGain.gain.setValueAtTime(Math.max(0.0001, amplitude * 0.92), start + 0.15);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, end);
      filter.connect(voiceGain).connect(this.context.destination);

      vibrato.type = "sine";
      vibrato.frequency.setValueAtTime(6.1, start);
      vibratoGain.gain.setValueAtTime(3.5, start);
      vibrato.connect(vibratoGain);
      vibrato.start(start);
      vibrato.stop(end);

      for (const partial of partials) {
        const oscillator = this.context.createOscillator();
        const partialGain = this.context.createGain();

        oscillator.type = "sawtooth";
        oscillator.frequency.setValueAtTime(partial.frequency, start);
        oscillator.frequency.linearRampToValueAtTime(partial.frequency * 0.96, end);
        partialGain.gain.setValueAtTime(partial.level, start);
        vibratoGain.connect(oscillator.detune);
        oscillator.connect(partialGain).connect(filter);
        oscillator.start(start);
        oscillator.stop(end + 0.01);
        oscillator.addEventListener("ended", () => {
          oscillator.disconnect();
          partialGain.disconnect();
        }, { once: true });
      }

      vibrato.addEventListener("ended", () => {
        vibrato.disconnect();
        vibratoGain.disconnect();
        filter.disconnect();
        voiceGain.disconnect();
      }, { once: true });
    }
  }

  globalThis.LayoutGuard = globalThis.LayoutGuard || {};
  globalThis.LayoutGuard.WarningAudio = WarningAudio;
})();
