/**
 * Conversation Partner Page
 * Feature 5: AI Conversation Partner™
 */

import React, { useState, useEffect, useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../context/AppContext';
import { useUserSafe } from '../../hooks/useClerkSafe.jsx';
import { MessageCircle, Send, Mic, Volume2, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StandardPage from '../../utils/pageConsistency';
import BrandText from '../../components/common/BrandText';

const Conversation = () => {
  const { t } = useTranslation();
  const { backendUrl, getToken } = useContext(AppContext);
  const { user } = useUserSafe();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    startNewConversation();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startNewConversation = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${backendUrl}/api/conversation/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic: 'General conversation',
          level: user?.englishLevel || 'intermediate'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setConversation(data.conversation);
          setMessages(data.conversation.messages || []);
        }
      }
    } catch (error) {
      // Handle error silently, use empty conversation
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !conversation) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const token = await getToken();
      const response = await fetch(`${backendUrl}/api/conversation/${conversation._id}/message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: input
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.message) {
          setMessages(prev => [...prev, data.message]);
        }
      }
    } catch (error) {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  return (
    <StandardPage
      seoTitle="AI Conversation Partner - So Fluent"
      seoDescription="Practice English 24/7 with AI conversation partner"
      background="bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]"
      showNavbar={false}
      showFooter={false}
    >
      <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-8 h-8 text-[#E91E63]" />
            <div>
              <h1 className="text-xl font-bold text-white">
                {t('conversation.title', 'AI Conversation Partner')}
              </h1>
              <p className="text-sm text-gray-400">
                {t('conversation.subtitle', 'Practice English 24/7 with AI')}
              </p>
            </div>
          </div>
          <button
            onClick={startNewConversation}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-semibold hover:bg-white/10 transition-all"
          >
            {t('conversation.newChat', 'New Chat')}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white'
                      : 'bg-white/5 text-white border border-white/10'
                  }`}
                >
                  <p>{message.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#E91E63] rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-[#E91E63] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-[#E91E63] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all">
            <Mic className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={t('conversation.typeMessage', 'Type your message in English...')}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#E91E63]"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="p-3 bg-gradient-to-r from-[#E91E63] to-[#C2185B] rounded-xl text-white hover:shadow-lg hover:shadow-[#E91E63]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
      </div>
    </StandardPage>
  );
};

export default Conversation;
