/**
 * So Fluent Talks - Free Community Page
 * Free conversation sessions in 3 levels
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MessageCircle, Users, Calendar, CheckCircle, ArrowRight, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useClerkSafe } from '../../hooks/useClerkSafe.jsx';
import StandardPage from '../../utils/pageConsistency';
import BrandText from '../../components/common/BrandText';

const SoFluentTalks = () => {
  const { t } = useTranslation();
  const { openSignIn } = useClerkSafe();

  const levels = [
    {
      level: t('soFluentTalks.level1', 'Nível 1'),
      name: t('soFluentTalks.beginner', 'Iniciante'),
      description: t('soFluentTalks.level1Desc', 'Para quem está começando. Ambiente seguro e acolhedor para praticar o básico.'),
      schedule: t('soFluentTalks.level1Schedule', 'Segundas e Quartas, 19h BRT')
    },
    {
      level: t('soFluentTalks.level2', 'Nível 2'),
      name: t('soFluentTalks.intermediate', 'Intermediário'),
      description: t('soFluentTalks.level2Desc', 'Para quem já tem uma base. Desenvolva fluência e confiança em conversação.'),
      schedule: t('soFluentTalks.level2Schedule', 'Terças e Quintas, 19h BRT')
    },
    {
      level: t('soFluentTalks.level3', 'Nível 3'),
      name: t('soFluentTalks.advanced', 'Avançado'),
      description: t('soFluentTalks.level3Desc', 'Para quem quer refinar. Discussões profundas e desafios bilíngues.'),
      schedule: t('soFluentTalks.level3Schedule', 'Sextas, 19h BRT')
    }
  ];

  return (
    <StandardPage
      seoTitle="So Fluent Talks - Free Community Sessions"
      seoDescription="Join free conversation sessions in 3 levels"
      background="bg-gradient-to-b from-white via-[#FFF5F9] to-white"
    >
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            {/* Free Badge */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8941A] text-white rounded-full mb-8 shadow-lg"
            >
              <Gift className="w-5 h-5" />
              <span className="font-bold text-lg">{t('soFluentTalks.free', '100% GRATUITO')}</span>
            </motion.div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-[#1A1A1A] mb-6 leading-tight tracking-tight" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
              {t('soFluentTalks.title', 'So Fluent Talks')}
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed font-light">
              {t('soFluentTalks.subtitle', 'Comunidade Gratuita de Conversação. Sessões ao vivo em 3 níveis para expandir fluência, vocabulário e confiança.')}
            </p>
            <button
              onClick={() => openSignIn()}
              className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white font-bold text-xl rounded-xl shadow-lg hover:shadow-2xl hover:shadow-[#E91E63]/50 transition-all transform hover:scale-105"
            >
              {t('soFluentTalks.joinFree', 'Juntar-se Grátis')}
              <ArrowRight className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Levels Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center text-[#1A1A1A] mb-16" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
            {t('soFluentTalks.levelsTitle', 'Escolha Seu Nível')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {levels.map((level, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#E91E63]/20 to-[#E91E63]/10 rounded-2xl flex items-center justify-center border-2 border-[#E91E63]/30">
                    <MessageCircle className="w-8 h-8 text-[#E91E63]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#E91E63] uppercase tracking-wider">{level.level}</div>
                    <h3 className="text-2xl font-black text-[#1A1A1A]" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
                      {level.name}
                    </h3>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  {level.description}
                </p>
                
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold">{level.schedule}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-[#FFF5F9] to-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center text-[#1A1A1A] mb-16" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
            {t('soFluentTalks.featuresTitle', 'O Que Você Ganha')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              t('soFluentTalks.feature1', 'Sessões de conversação ao vivo em grupos pequenos'),
              t('soFluentTalks.feature2', 'Ambiente seguro e acolhedor para praticar'),
              t('soFluentTalks.feature3', 'Desafios de hábitos bilíngues'),
              t('soFluentTalks.feature4', 'Expansão de vocabulário e fluência'),
              t('soFluentTalks.feature5', 'Feedback imediato dos instrutores'),
              t('soFluentTalks.feature6', 'Comunidade de aprendizes ambiciosos')
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-md"
              >
                <CheckCircle className="w-6 h-6 text-[#E91E63] flex-shrink-0 mt-1" />
                <span className="text-gray-700 text-lg leading-relaxed">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-[#E91E63] to-[#C2185B] rounded-3xl p-12 shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
            {t('soFluentTalks.finalCta', 'Pronto para Praticar?')}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {t('soFluentTalks.finalCtaDesc', 'Junte-se à nossa comunidade gratuita e comece a praticar hoje mesmo!')}
          </p>
          <button
            onClick={() => openSignIn()}
            className="inline-flex items-center gap-3 px-12 py-6 bg-white text-[#E91E63] font-bold text-xl rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
          >
            {t('soFluentTalks.joinNow', 'Juntar-se Agora - Grátis')}
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>
    </StandardPage>
  );
};

export default SoFluentTalks;
