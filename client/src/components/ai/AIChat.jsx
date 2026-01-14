/**
 * AI Chat Component
 * Conversation partner powered by OpenRouter
 * 24/7 English practice with AI
 */

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import BrandButton from '../common/BrandButton';
import { motion, AnimatePresence } from 'framer-motion';
import soundEffects from '../../utils/soundEffects';

const AIChat = ({ studentLevel = 'intermediate' }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: t('ai.chat.welcome', 'Hello! I\'m your AI conversation partner. Let\'s practice English together! How are you today?')
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: input.trim()
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);
    setConversationHistory(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Play send sound
    soundEffects.play('click');

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: conversationHistory,
          studentLevel: studentLevel
        })
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage = {
          role: 'assistant',
          content: data.content
        };
        setMessages(prev => [...prev, aiMessage]);
        setConversationHistory(prev => [...prev, aiMessage]);
        soundEffects.play('notification');
      } else {
        throw new Error(data.message || 'Failed to get AI response');
      }
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: t('ai.chat.error', 'Sorry, I encountered an error. Please try again.')
      };
      setMessages(prev => [...prev, errorMessage]);
      soundEffects.play('error');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="ai-chat-container h-full flex flex-col bg-gradient-to-br from-sofluent-dark to-sofluent-black rounded-lg border border-white/10">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sofluent-cherry to-sofluent-gold flex items-center justify-center">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">
            {t('ai.chat.title', 'AI Conversation Partner')}
          </h3>
          <p className="text-sm text-gray-400">
            {t('ai.chat.subtitle', 'Practice English 24/7')}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-sofluent-cherry to-sofluent-gold text-white'
                    : 'bg-white/5 text-gray-100 border border-white/10'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.role === 'assistant' && (
                    <Bot className="w-5 h-5 text-sofluent-cherry flex-shrink-0 mt-0.5" />
                  )}
                  {message.role === 'user' && (
                    <User className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <Loader2 className="w-5 h-5 animate-spin text-sofluent-cherry" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('ai.chat.placeholder', 'Type your message...')}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-sofluent-cherry focus:outline-none"
            disabled={loading}
          />
          <BrandButton
            variant="primary"
            onClick={sendMessage}
            disabled={!input.trim() || loading}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </BrandButton>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          {t('ai.chat.hint', 'Press Enter to send, Shift+Enter for new line')}
        </p>
      </div>
    </div>
  );
};

export default AIChat;
