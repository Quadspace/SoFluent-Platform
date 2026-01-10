import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { ArrowRight, Play, TrendingUp, Users, Award } from 'lucide-react';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(233, 30, 99, 0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Animated Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#E91E63] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00BCD4] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#E91E63]/20 border border-[#E91E63]/30 rounded-full mb-8"
            >
              <TrendingUp className="w-4 h-4 text-[#E91E63]" />
              <span className="text-sm font-semibold text-white">20-40% Mais Eficaz que Métodos Tradicionais</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="block">Be Yourself</span>
              <span className="block bg-gradient-to-r from-[#E91E63] to-[#00BCD4] bg-clip-text text-transparent">
                in English.
              </span>
              <span className="block mt-2">Prosper Globally.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
              {t('hero.subtitleDesktop', 'Da base à fluência profissional, preparamos brasileiros para viver, trabalhar e prosperar em cenários globais– com confiança, identidade e resultados reais.')}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#E91E63]/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#E91E63]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">327+</div>
                  <div className="text-sm text-gray-400">Estudantes Ativos</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#00BCD4]/20 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-[#00BCD4]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">4.8</div>
                  <div className="text-sm text-gray-400">Avaliação Média</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/course-list"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-[#E91E63]/50 transition-all transform hover:scale-105"
              >
                Começar Agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all">
                <Play className="w-5 h-5" />
                Ver Demonstração
              </button>
            </div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Image/Video Placeholder */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#E91E63]/20 to-[#00BCD4]/20 p-1">
                <div className="bg-[#1A1A1A] rounded-xl p-8">
                  <div className="aspect-video bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800')] bg-cover bg-center opacity-30"></div>
                    <div className="relative z-10 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all">
                      <Play className="w-10 h-10 text-white ml-1" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#E91E63] to-[#C2185B] rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#1A1A1A]">Progresso Semanal</div>
                    <div className="text-2xl font-bold text-[#E91E63]">+23%</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00BCD4] to-[#0097A7] rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#1A1A1A]">Novos Membros</div>
                    <div className="text-2xl font-bold text-[#00BCD4]">12</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Hero
