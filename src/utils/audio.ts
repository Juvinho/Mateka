const ATTACK_SECONDS = 0.08
const RELEASE_SECONDS = 0.5

export class WaveSynth {
  private context: AudioContext | null = null
  private mainOscillator: OscillatorNode | null = null
  private harmonicOscillator: OscillatorNode | null = null
  private masterGain: GainNode | null = null
  private isRunning = false
  private harmonicEnabled = false

  private ensureContext(): AudioContext {
    if (!this.context) {
      this.context = new window.AudioContext()
    }
    return this.context
  }

  public async start(): Promise<void> {
    const ctx = this.ensureContext()
    if (ctx.state === 'suspended') {
      await ctx.resume()
    }

    if (this.isRunning) return

    this.masterGain = ctx.createGain()
    this.masterGain.gain.value = 0.0001
    this.masterGain.connect(ctx.destination)

    this.mainOscillator = ctx.createOscillator()
    this.mainOscillator.type = 'sine'
    this.mainOscillator.frequency.value = 220
    this.mainOscillator.connect(this.masterGain)
    this.mainOscillator.start()

    if (this.harmonicEnabled) {
      this.createHarmonicOscillator(440)
    }

    this.masterGain.gain.exponentialRampToValueAtTime(
      0.04,
      ctx.currentTime + ATTACK_SECONDS,
    )

    this.isRunning = true
  }

  private createHarmonicOscillator(frequency: number): void {
    if (!this.context || !this.masterGain || this.harmonicOscillator) return

    this.harmonicOscillator = this.context.createOscillator()
    this.harmonicOscillator.type = 'sine'
    this.harmonicOscillator.frequency.value = frequency
    this.harmonicOscillator.connect(this.masterGain)
    this.harmonicOscillator.start()
  }

  public setFrequency(frequency: number): void {
    if (!this.context) return

    if (this.mainOscillator) {
      this.mainOscillator.frequency.setTargetAtTime(
        frequency,
        this.context.currentTime,
        0.05,
      )
    }

    if (this.harmonicOscillator) {
      this.harmonicOscillator.frequency.setTargetAtTime(
        frequency * 2,
        this.context.currentTime,
        0.05,
      )
    }
  }

  public setAmplitude(amplitude: number): void {
    if (!this.context || !this.masterGain) return

    const targetGain = Math.max(0.0001, amplitude)
    this.masterGain.gain.exponentialRampToValueAtTime(
      targetGain,
      this.context.currentTime + 0.08,
    )
  }

  public setHarmonicEnabled(enabled: boolean, baseFrequency: number): void {
    this.harmonicEnabled = enabled

    if (!this.context || !this.isRunning) return

    if (enabled) {
      this.createHarmonicOscillator(baseFrequency * 2)
      return
    }

    if (this.harmonicOscillator) {
      this.harmonicOscillator.stop()
      this.harmonicOscillator.disconnect()
      this.harmonicOscillator = null
    }
  }

  public stop(): void {
    if (!this.context || !this.masterGain || !this.isRunning) return

    const now = this.context.currentTime
    this.masterGain.gain.exponentialRampToValueAtTime(0.001, now + RELEASE_SECONDS)

    this.mainOscillator?.stop(now + RELEASE_SECONDS + 0.02)
    this.harmonicOscillator?.stop(now + RELEASE_SECONDS + 0.02)

    this.mainOscillator?.disconnect()
    this.harmonicOscillator?.disconnect()

    this.mainOscillator = null
    this.harmonicOscillator = null
    this.isRunning = false
  }

  public async dispose(): Promise<void> {
    this.stop()

    if (this.context) {
      await this.context.close()
      this.context = null
      this.masterGain = null
    }
  }
}

export const audioIsSupported = (): boolean =>
  typeof window !== 'undefined' && typeof window.AudioContext !== 'undefined'
