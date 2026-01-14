/**
 * Voice Command Panel Component
 * Full-featured voice command interface
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, Volume2, Command } from 'lucide-react';
import VoiceCommandButton from './VoiceCommandButton';
import useVoiceCommands from '../../hooks/useVoiceCommands';
import voiceCommands from '../../utils/voiceCommands';
import { 
  createNavigationHandlers, 
  createCourseHandlers, 
  createStudentHandlers,
  createCohortHandlers,
  createGeneralHandlers,
  registerDefaultCommands
} from '../../utils/voiceCommandHandlers';
import { useNavigate } from 'react-router-dom';
import './VoiceCommandPanel.css';

/**
 * Voice Command Panel
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Panel open state
 * @param {Function} props.onClose - Close callback
 * @param {string} props.context - Command context
 */
const VoiceCommandPanel = ({ isOpen, onClose, context = null }) => {
  const navigate = useNavigate();
  const { isListening, transcript, error, isSupported, start, stop } = useVoiceCommands({
    context
  });
  
  const [availableCommands, setAvailableCommands] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  
  useEffect(() => {
    if (isOpen && isSupported) {
      // Register default commands
      const navigationHandlers = createNavigationHandlers(navigate);
      const courseHandlers = createCourseHandlers((action, data) => {
        handleCommand(action, data);
      });
      const studentHandlers = createStudentHandlers((action, data) => {
        handleCommand(action, data);
      });
      const cohortHandlers = createCohortHandlers((action, data) => {
        handleCommand(action, data);
      });
      const generalHandlers = createGeneralHandlers((action, data) => {
        handleCommand(action, data);
      });
      
      const allHandlers = [
        ...navigationHandlers,
        ...courseHandlers,
        ...studentHandlers,
        ...cohortHandlers,
        ...generalHandlers
      ];
      
      const unregister = registerDefaultCommands(voiceCommands, allHandlers);
      
      // Get available commands
      const commands = voiceCommands.getCommands(context);
      setAvailableCommands(commands);
      
      return () => {
        unregister();
      };
    }
  }, [isOpen, context, navigate]);
  
  const handleCommand = (action, data) => {
    setCommandHistory(prev => [
      { action, data, timestamp: Date.now() },
      ...prev.slice(0, 9)
    ]);
    
    // Handle specific actions
    switch (action) {
      case 'showHelp':
        // Already showing help
        break;
      case 'stop':
        stop();
        break;
      default:
        // Command executed - action handled
        break;
    }
  };
  
  const handleTranscript = (transcript, confidence) => {
    // Commands are automatically processed by handlers
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="voice-command-panel-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="voice-command-panel"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="voice-command-header">
              <div className="flex items-center gap-3">
                <Command className="w-6 h-6 text-[#E91E63]" />
                <h2 className="text-xl font-bold text-white">Voice Commands</h2>
              </div>
              <button
                onClick={onClose}
                className="voice-command-close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Voice Button */}
            <div className="voice-command-button-container">
              <VoiceCommandButton
                onCommand={handleTranscript}
                context={context}
                size="lg"
                variant="primary"
              />
              
              {transcript && (
                <motion.div
                  className="voice-command-transcript-display"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Volume2 className="w-5 h-5" />
                  <p className="text-lg">{transcript}</p>
                </motion.div>
              )}
            </div>
            
            {/* Available Commands */}
            <div className="voice-command-list">
              <h3 className="voice-command-list-title">Available Commands</h3>
              <div className="voice-command-categories">
                {['navigation', 'courses', 'students', 'cohorts', 'general'].map(category => {
                  const categoryCommands = availableCommands.filter(cmd => cmd.category === category);
                  if (categoryCommands.length === 0) return null;
                  
                  return (
                    <div key={category} className="voice-command-category">
                      <h4 className="voice-command-category-title">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </h4>
                      <div className="voice-command-items">
                        {categoryCommands.map((cmd, idx) => (
                          <div key={idx} className="voice-command-item">
                            <span className="voice-command-pattern">
                              {cmd.pattern.toString().replace(/[\/\^$]/g, '')}
                            </span>
                            {cmd.description && (
                              <span className="voice-command-description">
                                {cmd.description}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Command History */}
            {commandHistory.length > 0 && (
              <div className="voice-command-history">
                <h3 className="voice-command-list-title">Recent Commands</h3>
                <div className="voice-command-history-items">
                  {commandHistory.map((item, idx) => (
                    <div key={idx} className="voice-command-history-item">
                      <span className="voice-command-action">{item.action}</span>
                      <span className="voice-command-time">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Error Display */}
            {error && (
              <motion.div
                className="voice-command-error-display"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceCommandPanel;
