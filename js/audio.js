// Web Audio API Synthesizer for 8-bit Retro Sounds and Chiptune Music
class SoundManager {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.musicPlaying = false;
        this.bgmTimer = null;
        this.bgmStep = 0;
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
        this.tempo = 145; // BPM
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();

            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.8;
            this.masterGain.connect(this.ctx.destination);

            this.sfxGain = this.ctx.createGain();
            this.sfxGain.gain.value = 0.5;
            this.sfxGain.connect(this.masterGain);

            this.musicGain = this.ctx.createGain();
            this.musicGain.gain.value = 0.28;
            this.musicGain.connect(this.masterGain);
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.masterGain) {
            this.masterGain.gain.value = this.muted ? 0 : 0.8;
        }
        return this.muted;
    }

    // --- Sound Effects ---

    playJump(isBig = false) {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = isBig ? 'triangle' : 'square';
        const startFreq = isBig ? 130 : 160;
        const endFreq = isBig ? 380 : 520;

        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.16);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.18);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.18);
    }

    playCoin() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';

        // B5 to E6 chime
        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.setValueAtTime(0.35, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.38);
    }

    playStomp() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;

        // Punchy low square sweep + subtle noise
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';

        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.12);

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.13);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.13);
    }

    playBump() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';

        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(60, now + 0.09);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.09);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.09);
    }

    playBreak() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;

        // Noise buffer for brick shatter
        const bufferSize = this.ctx.sampleRate * 0.15;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.linearRampToValueAtTime(200, now + 0.15);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.15);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        noise.start(now);
        noise.stop(now + 0.15);
    }

    playPowerupAppear() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const notes = [330, 392, 659, 523, 587, 784];
        const step = 0.05;

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, now + idx * step);

            gain.gain.setValueAtTime(0.25, now + idx * step);
            gain.gain.linearRampToValueAtTime(0, now + (idx + 1) * step);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(now + idx * step);
            osc.stop(now + (idx + 1) * step);
        });
    }

    playPowerup() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        // Rising energetic arpeggio
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        const step = 0.045;

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * step);

            gain.gain.setValueAtTime(0.3, now + idx * step);
            gain.gain.linearRampToValueAtTime(0, now + (idx + 1) * step);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(now + idx * step);
            osc.stop(now + (idx + 1) * step);
        });
    }

    playPipe() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.25);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.25);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.25);
    }

    playFireball() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.1);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.1);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    playKick() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.14);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.14);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.14);
    }

    playDeath() {
        if (this.muted) return;
        this.stopMusic();
        this.init();
        const now = this.ctx.currentTime;
        // Classic Mario death melody: B4, F5, F5, F5, E5, D5, C5
        const notes = [
            { f: 493.88, d: 0.15 },
            { f: 698.46, d: 0.15 },
            { f: 0, d: 0.05 },
            { f: 698.46, d: 0.15 },
            { f: 698.46, d: 0.15 },
            { f: 659.25, d: 0.15 },
            { f: 587.33, d: 0.15 },
            { f: 523.25, d: 0.35 }
        ];

        let t = now;
        notes.forEach(n => {
            if (n.f > 0) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(n.f, t);

                gain.gain.setValueAtTime(0.3, t);
                gain.gain.linearRampToValueAtTime(0, t + n.d);

                osc.connect(gain);
                gain.connect(this.sfxGain);

                osc.start(t);
                osc.stop(t + n.d);
            }
            t += n.d;
        });
    }

    playStageClear() {
        if (this.muted) return;
        this.stopMusic();
        this.init();
        const now = this.ctx.currentTime;
        // Classic victory fanfare: G3, C4, E4, G4, C5, E5, G5, E5, Ab3, C4, Eb4, Ab4, C5, Eb5, Ab5...
        const notes = [
            { f: 392, d: 0.1 },
            { f: 523.25, d: 0.1 },
            { f: 659.25, d: 0.1 },
            { f: 783.99, d: 0.1 },
            { f: 1046.5, d: 0.1 },
            { f: 1318.5, d: 0.25 },
            { f: 0, d: 0.05 },
            { f: 1318.5, d: 0.15 },
            { f: 1567.98, d: 0.45 }
        ];

        let t = now;
        notes.forEach(n => {
            if (n.f > 0) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(n.f, t);

                gain.gain.setValueAtTime(0.35, t);
                gain.gain.linearRampToValueAtTime(0, t + n.d);

                osc.connect(gain);
                gain.connect(this.sfxGain);

                osc.start(t);
                osc.stop(t + n.d);
            }
            t += n.d;
        });
    }

    // --- Chiptune Background Music ---

    startMusic() {
        if (this.musicPlaying) return;
        this.init();
        this.musicPlaying = true;
        this.bgmStep = 0;
        this.scheduleNextBgmNotes();
    }

    stopMusic() {
        this.musicPlaying = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    }

    scheduleNextBgmNotes() {
        if (!this.musicPlaying) return;

        // 8-bit Overworld Theme Melody + Bass Pattern (Classic Mario Rhythm & Notes)
        // Melody notes with duration in sixteenth notes:
        const melody = [
            // Bar 1-2 (Famous Intro)
            { f: 659.25, d: 1 }, { f: 659.25, d: 1 }, { f: 0, d: 1 }, { f: 659.25, d: 1 },
            { f: 0, d: 1 }, { f: 523.25, d: 1 }, { f: 659.25, d: 2 },
            { f: 783.99, d: 2 }, { f: 0, d: 2 }, { f: 392.00, d: 2 }, { f: 0, d: 2 },

            // Bar 3-4 (Main Theme A)
            { f: 523.25, d: 2 }, { f: 0, d: 1 }, { f: 392.00, d: 2 }, { f: 0, d: 1 }, { f: 329.63, d: 2 },
            { f: 0, d: 1 }, { f: 440.00, d: 1.5 }, { f: 493.88, d: 1.5 }, { f: 466.16, d: 1 }, { f: 440.00, d: 2 },

            // Bar 5-6
            { f: 392.00, d: 1.33 }, { f: 659.25, d: 1.33 }, { f: 783.99, d: 1.33 },
            { f: 880.00, d: 1.5 }, { f: 698.46, d: 1 }, { f: 783.99, d: 1.5 },
            { f: 659.25, d: 2 }, { f: 523.25, d: 1 }, { f: 587.33, d: 1 }, { f: 493.88, d: 2 },

            // Bar 7-8
            { f: 523.25, d: 2 }, { f: 0, d: 1 }, { f: 392.00, d: 2 }, { f: 0, d: 1 }, { f: 329.63, d: 2 },
            { f: 0, d: 1 }, { f: 440.00, d: 1.5 }, { f: 493.88, d: 1.5 }, { f: 466.16, d: 1 }, { f: 440.00, d: 2 },

            // Bar 9-10
            { f: 392.00, d: 1.33 }, { f: 659.25, d: 1.33 }, { f: 783.99, d: 1.33 },
            { f: 880.00, d: 1.5 }, { f: 698.46, d: 1 }, { f: 783.99, d: 1.5 },
            { f: 659.25, d: 2 }, { f: 523.25, d: 1 }, { f: 587.33, d: 1 }, { f: 493.88, d: 2 },

            // Bridge Bar 11-12
            { f: 0, d: 1 }, { f: 783.99, d: 1 }, { f: 739.99, d: 1 }, { f: 698.46, d: 1 },
            { f: 622.25, d: 1.5 }, { f: 659.25, d: 1.5 }, { f: 0, d: 1 }, { f: 415.30, d: 1 }, { f: 440.00, d: 1 }, { f: 523.25, d: 1 },
            { f: 0, d: 1 }, { f: 440.00, d: 1 }, { f: 523.25, d: 1 }, { f: 587.33, d: 2 },

            // Bridge Bar 13-14
            { f: 0, d: 1 }, { f: 783.99, d: 1 }, { f: 739.99, d: 1 }, { f: 698.46, d: 1 },
            { f: 622.25, d: 1.5 }, { f: 659.25, d: 1.5 }, { f: 0, d: 1 }, { f: 1046.50, d: 1.5 }, { f: 1046.50, d: 1 }, { f: 1046.50, d: 2 },
            { f: 0, d: 2 }
        ];

        const sixteenthSec = (60 / this.tempo) / 4;
        const note = melody[this.bgmStep % melody.length];
        const durationSec = note.d * sixteenthSec;

        if (note.f > 0 && !this.muted) {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(note.f, now);

            // Short percussive decay for chiptune staccato feeling
            const playDur = Math.max(0.04, durationSec * 0.85);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.setValueAtTime(0.18, now + playDur * 0.7);
            gain.gain.linearRampToValueAtTime(0.001, now + playDur);

            osc.connect(gain);
            gain.connect(this.musicGain);

            osc.start(now);
            osc.stop(now + playDur);

            // Accompanying Bass note (Triangle wave on root/fifths)
            const bassFreq = (note.f / 2 > 110) ? note.f / 2 : note.f;
            const bassOsc = this.ctx.createOscillator();
            const bassGain = this.ctx.createGain();
            bassOsc.type = 'triangle';
            bassOsc.frequency.setValueAtTime(bassFreq / 2, now);

            bassGain.gain.setValueAtTime(0.25, now);
            bassGain.gain.linearRampToValueAtTime(0.001, now + playDur);

            bassOsc.connect(bassGain);
            bassGain.connect(this.musicGain);

            bassOsc.start(now);
            bassOsc.stop(now + playDur);
        }

        this.bgmStep++;
        this.bgmTimer = setTimeout(() => {
            this.scheduleNextBgmNotes();
        }, durationSec * 1000);
    }
}

// Global Sound Instance
window.sound = new SoundManager();
