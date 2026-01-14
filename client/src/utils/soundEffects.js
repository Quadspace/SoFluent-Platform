/**
 * Sound Effects Library
 * Premium audio feedback for interactions
 * Based on SOFLUENT_PREMIUM_INTERACTIVE_UX.md spec
 */

class SoundEffects {
  constructor() {
    this.audioContext = null;
    this.sounds = new Map();
    this.enabled = true;
    this.volume = 0.5;
    
    // Initialize audio context
    this.init();
  }
  
  init() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('AudioContext not supported:', error);
      this.enabled = false;
    }
  }
  
  /**
   * Enable/disable sound effects
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    // Save preference to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('soundEffectsEnabled', enabled.toString());
    }
  }
  
  /**
   * Set volume (0-1)
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (typeof window !== 'undefined') {
      localStorage.setItem('soundEffectsVolume', this.volume.toString());
    }
  }
  
  /**
   * Play a beep sound
   */
  beep(frequency = 800, duration = 200, type = 'sine') {
    if (!this.enabled || !this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration / 1000);
  }
  
  /**
   * Play success sound
   */
  success() {
    // Play ascending chord
    this.beep(523, 100, 'sine'); // C
    setTimeout(() => this.beep(659, 100, 'sine'), 100); // E
    setTimeout(() => this.beep(784, 200, 'sine'), 200); // G
  }
  
  /**
   * Play error sound
   */
  error() {
    // Play descending tone
    this.beep(400, 150, 'sawtooth');
    setTimeout(() => this.beep(300, 200, 'sawtooth'), 150);
  }
  
  /**
   * Play click sound
   */
  click() {
    this.beep(800, 50, 'square');
  }
  
  /**
   * Play hover sound
   */
  hover() {
    this.beep(600, 30, 'sine');
  }
  
  /**
   * Play swipe sound
   */
  swipe() {
    this.beep(500, 100, 'sine');
  }
  
  /**
   * Play drop sound (for drag and drop)
   */
  drop() {
    this.beep(300, 150, 'sine');
    setTimeout(() => this.beep(400, 100, 'sine'), 100);
  }
  
  /**
   * Play achievement unlock sound
   */
  achievement() {
    // Play triumphant chord
    this.beep(523, 100, 'sine'); // C
    setTimeout(() => this.beep(659, 100, 'sine'), 100); // E
    setTimeout(() => this.beep(784, 100, 'sine'), 200); // G
    setTimeout(() => this.beep(1047, 300, 'sine'), 300); // C (high)
  }
  
  /**
   * Play notification sound
   */
  notification() {
    this.beep(800, 200, 'sine');
    setTimeout(() => this.beep(1000, 200, 'sine'), 200);
  }
  
  /**
   * Play page transition sound
   */
  pageTransition() {
    this.beep(600, 150, 'sine');
  }
  
  /**
   * Load sound from URL
   */
  async loadSound(name, url) {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.sounds.set(name, audioBuffer);
    } catch (error) {
      console.warn(`Failed to load sound ${name}:`, error);
    }
  }
  
  /**
   * Play loaded sound
   */
  playSound(name, volume = 1) {
    if (!this.enabled || !this.audioContext) return;
    
    const audioBuffer = this.sounds.get(name);
    if (!audioBuffer) {
      console.warn(`Sound ${name} not found`);
      return;
    }
    
    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = audioBuffer;
    gainNode.gain.value = this.volume * volume;
    
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    source.start(0);
  }
  
  /**
   * Load user preferences
   */
  loadPreferences() {
    if (typeof window === 'undefined') return;
    
    const enabled = localStorage.getItem('soundEffectsEnabled');
    const volume = localStorage.getItem('soundEffectsVolume');
    
    if (enabled !== null) {
      this.setEnabled(enabled === 'true');
    }
    if (volume !== null) {
      this.setVolume(parseFloat(volume));
    }
  }
}

// Create singleton instance
const soundEffects = new SoundEffects();

// Load preferences on initialization
if (typeof window !== 'undefined') {
  soundEffects.loadPreferences();
}

export default soundEffects;
