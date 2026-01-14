/**
 * useVoiceCommands Hook
 * React hook for voice command functionality
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import voiceCommands from '../utils/voiceCommands';
import soundEffects from '../utils/soundEffects';

/**
 * useVoiceCommands Hook
 * 
 * @param {Object} options
 * @param {Function} options.onCommand - Callback when command is recognized
 * @param {Function} options.onError - Callback for errors
 * @param {string} options.context - Command context filter
 * @param {boolean} options.autoStart - Auto-start listening
 */
const useVoiceCommands = ({
  onCommand = null,
  onError = null,
  context = null,
  autoStart = false
} = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const onCommandRef = useRef(onCommand);
  const onErrorRef = useRef(onError);
  
  // Update refs when callbacks change
  useEffect(() => {
    onCommandRef.current = onCommand;
    onErrorRef.current = onError;
  }, [onCommand, onError]);
  
  // Check support
  useEffect(() => {
    setIsSupported(voiceCommands.isSupported());
  }, []);
  
  // Set up result handler
  useEffect(() => {
    const handleResult = (result) => {
      if (result.type === 'start') {
        setIsListening(true);
        setError(null);
      } else if (result.type === 'end') {
        setIsListening(false);
      } else if (result.type === 'result') {
        setTranscript(result.transcript);
        
        // Check if command was processed
        if (onCommandRef.current) {
          onCommandRef.current(result.transcript, result.confidence);
        }
      }
    };
    
    const handleError = (error) => {
      setError(error.message);
      setIsListening(false);
      
      if (onErrorRef.current) {
        onErrorRef.current(error);
      }
    };
    
    voiceCommands.onResult(handleResult);
    voiceCommands.onError(handleError);
    
    return () => {
      voiceCommands.onResult(null);
      voiceCommands.onError(null);
    };
  }, []);
  
  // Auto-start if enabled
  useEffect(() => {
    if (autoStart && isSupported && !isListening) {
      voiceCommands.start();
    }
  }, [autoStart, isSupported, isListening]);
  
  // Start listening
  const start = useCallback(async () => {
    if (!isSupported) {
      const hasPermission = await voiceCommands.requestPermission();
      if (!hasPermission) {
        setError('Microphone permission required');
        return false;
      }
    }
    
    return voiceCommands.start();
  }, [isSupported]);
  
  // Stop listening
  const stop = useCallback(() => {
    return voiceCommands.stop();
  }, []);
  
  // Toggle listening
  const toggle = useCallback(async () => {
    if (isListening) {
      return stop();
    } else {
      return await start();
    }
  }, [isListening, start, stop]);
  
  // Register command
  const registerCommand = useCallback((pattern, handler, options = {}) => {
    if (context && !options.context) {
      options.context = context;
    }
    
    return voiceCommands.registerCommand(pattern, handler, options);
  }, [context]);
  
  // Get available commands
  const getCommands = useCallback(() => {
    return voiceCommands.getCommands(context);
  }, [context]);
  
  return {
    isListening,
    transcript,
    error,
    isSupported,
    start,
    stop,
    toggle,
    registerCommand,
    getCommands
  };
};

export default useVoiceCommands;
