/**
 * Voice Command Button Component
 * Premium voice command UI with visual feedback
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import useVoiceCommands from '../../hooks/useVoiceCommands';
import soundEffects from '../../utils/soundEffects';
import './VoiceCommandButton.css';

/**
 * Voice Command Button
 * 
 * @param {Object} props
 * @param {Function} props.onCommand - Callback when command is recognized
 * @param {Function} props.onError - Callback for errors
 * @param {string} props.context - Command context
 * @param {boolean} props.showTranscript - Show transcript text
 * @param {string} props.size - Button size ('sm', 'md', 'lg')
 * @param {string} props.variant - Button variant ('primary', 'secondary', 'ghost')
 */
const VoiceCommandButton = ({
  onCommand,
  onError,
  context = null,
  showTranscript = true,
  size = 'md',
  variant = 'primary'
}) => {
  const { isListening, transcript, error, isSupported, toggle, getCommands } = useVoiceCommands({
    onCommand,
    onError,
    context
  });
  
  const [pulse, setPulse] = useState(false);
  const [availableCommands, setAvailableCommands] = useState([]);
  
  useEffect(() => {
    if (isListening) {
      setPulse(true);
      soundEffects.hover();
    } else {
      setPulse(false);
    }
  }, [isListening]);
  
  useEffect(() => {
    const commands = getCommands();
    setAvailableCommands(commands);
  }, [getCommands]);
  
  if (!isSupported) {
    return (
      <div className="voice-command-unsupported">
        <p className="text-sm text-gray-500">
          Voice commands not supported in this browser
        </p>
      </div>
    );
  }
  
  const handleClick = async () => {
    const success = await toggle();
    if (success && !isListening) {
      soundEffects.click();
    }
  };
  
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white',
    secondary: 'bg-white/10 text-white border border-white/20',
    ghost: 'bg-transparent text-white hover:bg-white/10'
  };
  
  return (
    <div className="voice-command-container">
      <motion.button
        className={`voice-command-button ${sizeClasses[size]} ${variantClasses[variant]}`}
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isListening ? {
          scale: [1, 1.1, 1],
        } : {}}
        transition={{
          duration: 1,
          repeat: isListening ? Infinity : 0,
          ease: 'easeInOut'
        }}
        title={isListening ? 'Stop listening' : 'Start voice command'}
      >
        <AnimatePresence mode="wait">
          {isListening ? (
            <motion.div
              key="listening"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Mic className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <MicOff className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Pulse effect when listening */}
        {isListening && (
          <motion.div
            className="voice-command-pulse"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeOut'
            }}
          />
        )}
      </motion.button>
      
      {/* Transcript display */}
      {showTranscript && transcript && (
        <motion.div
          className="voice-command-transcript"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Volume2 className="w-4 h-4" />
          <span>{transcript}</span>
        </motion.div>
      )}
      
      {/* Error display */}
      {error && (
        <motion.div
          className="voice-command-error"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {error}
        </motion.div>
      )}
      
      {/* Available commands hint */}
      {availableCommands.length > 0 && isListening && (
        <motion.div
          className="voice-command-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-xs text-gray-400 mb-2">Available commands:</p>
          <div className="flex flex-wrap gap-2">
            {availableCommands.slice(0, 5).map((cmd, idx) => (
              <span key={idx} className="text-xs bg-white/10 px-2 py-1 rounded">
                {cmd.description || cmd.pattern.toString()}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default VoiceCommandButton;
