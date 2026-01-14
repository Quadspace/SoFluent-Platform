/**
 * Voice Command Floating Button
 * Floating button for quick voice command access
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VoiceCommandPanel from './VoiceCommandPanel';
import VoiceCommandButton from './VoiceCommandButton';
import { Mic } from 'lucide-react';
import './VoiceCommandFloatingButton.css';

/**
 * Voice Command Floating Button
 * 
 * @param {Object} props
 * @param {string} props.position - Button position ('bottom-right', 'bottom-left', 'top-right', 'top-left')
 * @param {string} props.context - Command context
 */
const VoiceCommandFloatingButton = ({ 
  position = 'bottom-right',
  context = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };
  
  return (
    <>
      <motion.div
        className={`voice-command-floating ${positionClasses[position]}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="voice-command-floating-button"
          title="Voice Commands (Ctrl+V)"
        >
          <Mic className="w-6 h-6" />
        </button>
      </motion.div>
      
      <VoiceCommandPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        context={context}
      />
    </>
  );
};

export default VoiceCommandFloatingButton;
