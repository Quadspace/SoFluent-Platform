/**
 * Voice Commands System
 * Premium voice recognition and command handling
 * Based on SOFLUENT_PREMIUM_INTERACTIVE_UX.md spec
 */

class VoiceCommands {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.commands = new Map();
    this.onResultCallback = null;
    this.onErrorCallback = null;
    this.language = 'en-US';
    this.continuous = false;
    this.interimResults = false;
    
    this.init();
  }
  
  /**
   * Initialize speech recognition
   */
  init() {
    if (typeof window === 'undefined') return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser');
      return;
    }
    
    this.recognition = new SpeechRecognition();
    this.recognition.lang = this.language;
    this.recognition.continuous = this.continuous;
    this.recognition.interimResults = this.interimResults;
    
    // Event handlers
    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onResultCallback) {
        this.onResultCallback({ type: 'start', message: 'Listening...' });
      }
    };
    
    this.recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join(' ')
        .toLowerCase()
        .trim();
      
      const confidence = event.results[event.results.length - 1][0].confidence;
      
      if (this.onResultCallback) {
        this.onResultCallback({
          type: 'result',
          transcript,
          confidence,
          results: event.results
        });
      }
      
      // Process command
      this.processCommand(transcript, confidence);
    };
    
    this.recognition.onerror = (event) => {
      this.isListening = false;
      
      let errorMessage = 'Speech recognition error';
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected';
          break;
        case 'aborted':
          errorMessage = 'Speech recognition aborted';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone found';
          break;
        case 'network':
          errorMessage = 'Network error';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission denied';
          break;
        default:
          errorMessage = `Error: ${event.error}`;
      }
      
      if (this.onErrorCallback) {
        this.onErrorCallback({ type: 'error', message: errorMessage, error: event.error });
      }
    };
    
    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onResultCallback) {
        this.onResultCallback({ type: 'end', message: 'Stopped listening' });
      }
    };
  }
  
  /**
   * Register a voice command
   * @param {string|RegExp} pattern - Command pattern or regex
   * @param {Function} handler - Command handler function
   * @param {Object} options - Command options (priority, context, description)
   */
  registerCommand(pattern, handler, options = {}) {
    const command = {
      pattern: typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern,
      handler,
      priority: options.priority || 0,
      context: options.context || 'global',
      description: options.description || '',
      category: options.category || 'general'
    };
    
    this.commands.set(pattern.toString(), command);
    
    // Sort by priority
    const commandsArray = Array.from(this.commands.values());
    commandsArray.sort((a, b) => b.priority - a.priority);
    
    return () => {
      this.commands.delete(pattern.toString());
    };
  }
  
  /**
   * Process a voice command
   */
  processCommand(transcript, confidence) {
    const commandsArray = Array.from(this.commands.values());
    
    for (const command of commandsArray) {
      const match = transcript.match(command.pattern);
      
      if (match) {
        // Extract parameters from match groups
        const params = match.slice(1);
        
        try {
          command.handler(transcript, params, confidence);
          
          // Play success sound
          if (typeof window !== 'undefined' && window.soundEffects) {
            window.soundEffects.click();
          }
          
          return true;
        } catch (error) {
          console.error('Error executing command:', error);
          if (this.onErrorCallback) {
            this.onErrorCallback({ type: 'error', message: 'Command execution failed', error });
          }
        }
      }
    }
    
    return false;
  }
  
  /**
   * Start listening
   */
  start() {
    if (!this.recognition) {
      if (this.onErrorCallback) {
        this.onErrorCallback({ type: 'error', message: 'Speech recognition not available' });
      }
      return false;
    }
    
    if (this.isListening) {
      return false;
    }
    
    try {
      this.recognition.start();
      return true;
    } catch (error) {
      if (this.onErrorCallback) {
        this.onErrorCallback({ type: 'error', message: 'Failed to start recognition', error });
      }
      return false;
    }
  }
  
  /**
   * Stop listening
   */
  stop() {
    if (!this.recognition || !this.isListening) {
      return false;
    }
    
    try {
      this.recognition.stop();
      return true;
    } catch (error) {
      console.error('Error stopping recognition:', error);
      return false;
    }
  }
  
  /**
   * Toggle listening
   */
  toggle() {
    if (this.isListening) {
      return this.stop();
    } else {
      return this.start();
    }
  }
  
  /**
   * Set language
   */
  setLanguage(language) {
    this.language = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }
  
  /**
   * Set callbacks
   */
  onResult(callback) {
    this.onResultCallback = callback;
  }
  
  onError(callback) {
    this.onErrorCallback = callback;
  }
  
  /**
   * Get available commands
   */
  getCommands(context = null) {
    const commands = Array.from(this.commands.values());
    
    if (context) {
      return commands.filter(cmd => cmd.context === context || cmd.context === 'global');
    }
    
    return commands;
  }
  
  /**
   * Check if speech recognition is supported
   */
  isSupported() {
    if (typeof window === 'undefined') return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }
  
  /**
   * Request microphone permission
   */
  async requestPermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  }
}

// Create singleton instance
const voiceCommands = new VoiceCommands();

export default voiceCommands;
