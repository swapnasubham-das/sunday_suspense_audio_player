// Web Audio API procedural ambient sound generator for late night ambiance

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeType: 'rain' | 'crickets' | 'vinyl' | 'wind' = 'rain';
  private isRunning: boolean = false;
  private nodes: (AudioNode | number)[] = []; // store nodes and interval IDs

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime, 0.05);
    }
  }

  public async start(type: 'rain' | 'crickets' | 'vinyl' | 'wind', volume: number = 0.2) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.stop();
    this.activeType = type;
    this.isRunning = true;
    this.setVolume(volume);

    switch (type) {
      case 'rain':
        this.startRain();
        break;
      case 'crickets':
        this.startCrickets();
        break;
      case 'vinyl':
        this.startVinyl();
        break;
      case 'wind':
        this.startWind();
        break;
    }
  }

  public stop() {
    this.isRunning = false;
    // Clean up all active nodes and intervals
    this.nodes.forEach(node => {
      if (typeof node === 'number') {
        clearInterval(node);
      } else {
        try {
          if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
            (node as AudioScheduledSourceNode).stop();
          }
          node.disconnect();
        } catch (e) {
          // ignore disconnect errors
        }
      }
    });
    this.nodes = [];
  }

  // --- Rain Generator (Filtered Pink Noise + Distant Thunder) ---
  private startRain() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to sound like rain on glass / street
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.masterGain);

    whiteNoise.start();
    this.nodes.push(whiteNoise, filter, rainGain);

    // Random gentle thunder rumble every 15-30s
    const thunderInterval = window.setInterval(() => {
      if (!this.isRunning || !this.ctx || !this.masterGain) return;
      try {
        const osc = this.ctx.createOscillator();
        const thunderGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(45 + Math.random() * 20, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(25, this.ctx.currentTime + 3.5);

        thunderGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        thunderGain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.8);
        thunderGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 4.0);

        osc.connect(thunderGain);
        thunderGain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 4.2);
      } catch (e) {}
    }, 22000);

    this.nodes.push(thunderInterval);
  }

  // --- Crickets & Night Breeze ---
  private startCrickets() {
    if (!this.ctx || !this.masterGain) return;

    // Pulse oscillator for high chirp
    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const chirpGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(4600, this.ctx.currentTime);

    lfo.type = 'square';
    lfo.frequency.setValueAtTime(4.5, this.ctx.currentTime); // 4.5 chirps per second

    lfoGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    chirpGain.gain.setValueAtTime(0.1, this.ctx.currentTime);

    lfo.connect(chirpGain.gain);
    osc.connect(chirpGain);
    chirpGain.connect(this.masterGain);

    osc.start();
    lfo.start();
    this.nodes.push(osc, lfo, lfoGain, chirpGain);
  }

  // --- Vintage Vinyl Crackle & Radio Static ---
  private startVinyl() {
    if (!this.ctx || !this.masterGain) return;

    // Hiss layer
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.03;
    }

    const hiss = this.ctx.createBufferSource();
    hiss.buffer = noiseBuffer;
    hiss.loop = true;

    const hissFilter = this.ctx.createBiquadFilter();
    hissFilter.type = 'bandpass';
    hissFilter.frequency.setValueAtTime(3200, this.ctx.currentTime);
    hissFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    hiss.connect(hissFilter);
    hissFilter.connect(this.masterGain);
    hiss.start();
    this.nodes.push(hiss, hissFilter);

    // Random pops and crackles
    const crackleInterval = window.setInterval(() => {
      if (!this.isRunning || !this.ctx || !this.masterGain) return;
      if (Math.random() > 0.4) {
        const pop = this.ctx.createBufferSource();
        const popBuffer = this.ctx.createBuffer(1, 256, this.ctx.sampleRate);
        const data = popBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 30);
        }
        pop.buffer = popBuffer;
        const popGain = this.ctx.createGain();
        popGain.gain.setValueAtTime(0.25 * Math.random(), this.ctx.currentTime);
        pop.connect(popGain);
        popGain.connect(this.masterGain);
        pop.start();
      }
    }, 180);

    this.nodes.push(crackleInterval);
  }

  // --- Night Wind Generator ---
  private startWind() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.2;
    }

    const wind = this.ctx.createBufferSource();
    wind.buffer = noiseBuffer;
    wind.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, this.ctx.currentTime);

    // LFO to modulate wind frequency up and down
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.15, this.ctx.currentTime); // slow swell
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(120, this.ctx.currentTime);

    lfo.connect(filter.frequency);

    wind.connect(filter);
    filter.connect(this.masterGain);

    wind.start();
    lfo.start();
    this.nodes.push(wind, filter, lfo, lfoGain);
  }
}

export const ambientSound = new AmbientSoundEngine();
