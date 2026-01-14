import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { ArrowRight, Play, TrendingUp, Users, Award, Sparkles, CheckCircle2, Heart, Zap, Globe, Star, Clock } from 'lucide-react';
import { brandAssets } from '../../assets/branding/brand-assets';
import { getProfessionalImage } from '../../assets/professional-images';
import { useClerkSafe } from '../../hooks/useClerkSafe.jsx';

const Hero = () => {
  const { t } = useTranslation();
  const { openSignIn } = useClerkSafe();
  const [liveCount, setLiveCount] = useState(327);
  const [recentAchievement, setRecentAchievement] = useState(0);

  // Simulate live student count animation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Rotate through recent achievements
  const achievements = [
    { text: 'Ana Silva acabou de completar seu primeiro curso!', icon: Award },
    { text: 'Carlos Mendes alcançou fluência profissional!', icon: Star },
    { text: 'Juliana Costa se juntou à comunidade!', icon: Users },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRecentAchievement(prev => (prev + 1) % achievements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-[#FFF5F9] to-white">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-[#E91E63] to-[#D4AF37] rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      {/* Beautiful Gradient Overlays */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-[#E91E63]/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-[#D4AF37]/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Background Professional Images - Subtle */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <motion.img
          src={getProfessionalImage('IMG_9441', 'large')}
          alt=""
          className="absolute top-20 right-10 w-96 h-96 object-cover rounded-full blur-2xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.img
          src={getProfessionalImage('IMG_9519', 'large')}
          alt=""
          className="absolute bottom-20 left-10 w-80 h-80 object-cover rounded-full blur-2xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        {/* Top Badge Row - Enhanced with Live Updates */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-8"
        >
          <motion.div 
            className="px-6 py-3 bg-gradient-to-r from-[#E91E63]/10 to-[#E91E63]/5 border border-[#E91E63]/20 rounded-full backdrop-blur-sm shadow-sm hover:shadow-lg transition-all cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#E91E63] animate-pulse" />
              <span className="text-sm font-bold text-[#E91E63]">20-40% Mais Eficaz</span>
            </div>
          </motion.div>
          <motion.div 
            className="px-6 py-3 bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-full backdrop-blur-sm shadow-sm hover:shadow-lg transition-all cursor-pointer relative"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-sm font-bold text-[#D4AF37]">
                <motion.span key={liveCount} initial={{ scale: 1.2 }} animate={{ scale: 1 }}>
                  {liveCount}+
                </motion.span> Estudantes
              </span>
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
          <motion.div 
            className="px-6 py-3 bg-gradient-to-r from-gray-100 to-white border border-gray-200 rounded-full backdrop-blur-sm shadow-sm hover:shadow-lg transition-all cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-bold text-gray-700">4.8/5 ⭐ Avaliação</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Live Achievement Banner */}
        <AnimatePresence mode="wait">
          <motion.div
            key={recentAchievement}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-8 px-6 py-3 bg-white/80 backdrop-blur-md border border-[#E91E63]/20 rounded-full shadow-lg max-w-md mx-auto"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
              >
                {(() => {
                  const Icon = achievements[recentAchievement].icon;
                  return <Icon className="w-5 h-5 text-[#E91E63]" />;
                })()}
            </motion.div>
            <span className="text-sm font-semibold text-gray-700">{achievements[recentAchievement].text}</span>
          </motion.div>
        </AnimatePresence>

        {/* Main Content - Centered Layout */}
        <div className="text-center mb-16">
          {/* Beautiful Headline - Using exact text from migration guide */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-7xl md:text-8xl lg:text-[110px] font-black text-[#1A1A1A] mb-8 leading-[1.05] tracking-tight"
            style={{ fontFamily: 'Actay-Regular, sans-serif' }}
          >
            <span className="block">{t('hero.title', 'Ser fluente é ser você!')}</span>
            <span className="block bg-gradient-to-r from-[#E91E63] via-[#D4AF37] to-[#E91E63] bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient mt-4">
              {t('hero.titleHighlight', 'Seja em português, ou em inglês.')}
            </span>
          </motion.h1>

          {/* Vision Statement - Enhanced with Emotion */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl md:text-2xl text-[#E91E63] mb-6 max-w-4xl mx-auto leading-relaxed font-bold flex items-center justify-center gap-3"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-6 h-6 md:w-8 md:h-8 text-[#E91E63] fill-[#E91E63]" />
            </motion.div>
            <span>{t('hero.vision', 'Comunicar-se com a mesma fluidez e confiança do português')}</span>
          </motion.p>

          {/* Elegant Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl md:text-3xl lg:text-4xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed font-light"
          >
            {t('hero.subtitleDesktop', 'Da base à fluência profissional, preparamos brasileiros para viver, trabalhar e prosperar em cenários globais– com confiança, identidade e resultados reais.')}
          </motion.p>

          {/* Diaspora & Level Focus */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-xl text-gray-600 mb-16 max-w-3xl mx-auto leading-relaxed"
          >
            {t('hero.diaspora', 'Para brasileiros no Brasil, EUA, Canadá, Portugal e além • Níveis Intermediário a Avançado (B1+)')}
          </motion.p>

          {/* Fluency Fit Academy Prominent Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mb-8"
          >
            <Link
              to="/fluency-fit"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#E91E63] via-[#D4AF37] to-[#E91E63] text-white font-black text-lg rounded-full shadow-2xl hover:shadow-[#E91E63]/50 transition-all transform hover:scale-105 border-2 border-white/20 backdrop-blur-sm"
            >
              <Sparkles className="w-6 h-6 animate-pulse" />
              <span>{t('fluencyFit.title', 'Fluency Fit Academy')}</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-bold">NEW</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Beautiful CTA Buttons - Enhanced with Urgency */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/course-list"
                className="group relative px-12 py-6 bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white font-bold text-xl rounded-2xl hover:shadow-2xl hover:shadow-[#E91E63]/40 transition-all overflow-hidden block"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#E91E63]"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundSize: '200% 200%',
                  }}
                />
                <span className="relative z-10 flex items-center gap-3">
                  <Zap className="w-6 h-6" />
                  Começar Agora - Grátis
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
              </Link>
            </motion.div>
            <motion.button 
              onClick={() => openSignIn?.()}
              className="px-12 py-6 bg-white border-2 border-gray-200 text-gray-800 font-bold text-xl rounded-2xl hover:border-[#E91E63] hover:text-[#E91E63] transition-all flex items-center gap-3 shadow-sm hover:shadow-lg group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Play className="w-6 h-6 group-hover:text-[#E91E63]" />
              </motion.div>
              Ver Demonstração
            </motion.button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-6 mb-16 text-sm text-gray-600"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>Sem compromisso</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#D4AF37]" />
              <span>Comece em minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#E91E63]" />
              <span>Disponível globalmente</span>
            </div>
          </motion.div>
        </div>

        {/* Beautiful Stats Grid with Professional Images */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {[
            { 
              icon: Users, 
              value: '327+', 
              label: 'Estudantes Ativos', 
              color: '#E91E63', 
              bg: 'from-[#E91E63]/10 to-[#E91E63]/5',
              image: getProfessionalImage('IMG_9476', 'medium')
            },
            { 
              icon: Award, 
              value: '4.8', 
              label: 'Avaliação Média', 
              color: '#D4AF37', 
              bg: 'from-[#D4AF37]/10 to-[#D4AF37]/5',
              image: getProfessionalImage('IMG_9513', 'medium')
            },
            { 
              icon: TrendingUp, 
              value: '20-40%', 
              label: 'Mais Eficaz', 
              color: '#E91E63', 
              bg: 'from-[#E91E63]/10 to-[#E91E63]/5',
              image: getProfessionalImage('IMG_9490', 'medium')
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className={`bg-gradient-to-br ${stat.bg} border border-white rounded-3xl p-10 shadow-lg hover:shadow-xl transition-all group backdrop-blur-sm relative overflow-hidden`}
            >
              {/* Background Image */}
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                <img 
                  src={stat.image} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex flex-col items-center text-center relative z-10">
                <div 
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${stat.bg} border-2 transition-transform group-hover:scale-110`}
                  style={{ borderColor: `${stat.color}30` }}
                >
                  <stat.icon className="w-10 h-10" style={{ color: stat.color }} />
                </div>
                <div className="text-5xl font-black text-[#1A1A1A] mb-3" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
                  {stat.value}
                </div>
                <div className="text-gray-600 font-bold text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature Pills - Enhanced with Hover Effects */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-12"
        >
          {['Cursos Gravados', 'Aulas ao Vivo', 'Comunidade Ativa', 'Suporte 24/7'].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-lg hover:border-[#E91E63]/30 transition-all cursor-pointer group"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
              >
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] group-hover:text-[#E91E63] transition-colors" />
              </motion.div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-[#E91E63] transition-colors">{feature}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Elegant Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-10 h-16 border-2 border-gray-300 rounded-full flex justify-center p-3"
        >
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-2 h-6 bg-gradient-to-b from-[#E91E63] to-[#D4AF37] rounded-full"
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Hero
