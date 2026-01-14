/**
 * My English Journey Page
 * General English course from Beginner to Advanced
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, ArrowRight, Users, Clock, Award, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import StandardPage from '../../utils/pageConsistency';
import BrandText from '../../components/common/BrandText';

const MyEnglishJourney = () => {
  const { t } = useTranslation();

  const levels = [
    {
      level: t('myEnglishJourney.beginner', 'Iniciante'),
      description: t('myEnglishJourney.beginnerDesc', 'Do zero ao básico. Construa uma base sólida em inglês.'),
      features: [
        t('myEnglishJourney.beginnerFeature1', 'Alfabeto e pronúncia'),
        t('myEnglishJourney.beginnerFeature2', 'Vocabulário essencial'),
        t('myEnglishJourney.beginnerFeature3', 'Frases básicas'),
        t('myEnglishJourney.beginnerFeature4', 'Gramática fundamental')
      ]
    },
    {
      level: t('myEnglishJourney.intermediate', 'Intermediário'),
      description: t('myEnglishJourney.intermediateDesc', 'De básico a intermediário. Desenvolva confiança e fluência.'),
      features: [
        t('myEnglishJourney.intermediateFeature1', 'Conversação prática'),
        t('myEnglishJourney.intermediateFeature2', 'Vocabulário avançado'),
        t('myEnglishJourney.intermediateFeature3', 'Gramática complexa'),
        t('myEnglishJourney.intermediateFeature4', 'Expressões idiomáticas')
      ]
    },
    {
      level: t('myEnglishJourney.advanced', 'Avançado'),
      description: t('myEnglishJourney.advancedDesc', 'De intermediário a avançado. Alcance fluência profissional.'),
      features: [
        t('myEnglishJourney.advancedFeature1', 'Fluência profissional'),
        t('myEnglishJourney.advancedFeature2', 'Inglês para negócios'),
        t('myEnglishJourney.advancedFeature3', 'Preparação para entrevistas'),
        t('myEnglishJourney.advancedFeature4', 'Comunicação avançada')
      ]
    }
  ];

  return (
    <StandardPage
      seoTitle="My English Journey - So Fluent"
      seoDescription="Complete English course from Beginner to Advanced"
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
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-[#1A1A1A] mb-6 leading-tight tracking-tight" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
              {t('myEnglishJourney.title', 'My English Journey')}
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed font-light">
              {t('myEnglishJourney.subtitle', 'Inglês Geral do Zero ao Avançado. Um curso estruturado para conduzir você do iniciante ao fluente.')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/course-list"
                className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white font-bold text-xl rounded-xl shadow-lg hover:shadow-2xl hover:shadow-[#E91E63]/50 transition-all transform hover:scale-105"
              >
                {t('myEnglishJourney.cta', 'Começar Minha Jornada')}
                <ArrowRight className="w-6 h-6" />
              </Link>
              <button className="inline-flex items-center gap-3 px-12 py-6 bg-white border-2 border-gray-200 text-gray-800 font-bold text-xl rounded-xl hover:border-[#E91E63] hover:text-[#E91E63] transition-all">
                <Play className="w-6 h-6" />
                {t('myEnglishJourney.preview', 'Ver Demonstração')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Levels Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center text-[#1A1A1A] mb-16" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
            {t('myEnglishJourney.levelsTitle', 'Sua Jornada de Aprendizado')}
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
                    <BookOpen className="w-8 h-8 text-[#E91E63]" />
                  </div>
                  <h3 className="text-2xl font-black text-[#1A1A1A]" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
                    {level.level}
                  </h3>
                </div>
                
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  {level.description}
                </p>
                
                <ul className="space-y-3">
                  {level.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-[#E91E63] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-[#FFF5F9] to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-12 h-12" />,
                title: t('myEnglishJourney.feature1Title', 'Aprendizado Estruturado'),
                description: t('myEnglishJourney.feature1Desc', 'Currículo cuidadosamente planejado do zero ao avançado.')
              },
              {
                icon: <Clock className="w-12 h-12" />,
                title: t('myEnglishJourney.feature2Title', 'Estude no Seu Ritmo'),
                description: t('myEnglishJourney.feature2Desc', 'Acesso 24/7 para estudar quando e onde quiser.')
              },
              {
                icon: <Award className="w-12 h-12" />,
                title: t('myEnglishJourney.feature3Title', 'Certificado de Conclusão'),
                description: t('myEnglishJourney.feature3Desc', 'Receba um certificado ao completar cada nível.')
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#E91E63]/20 to-[#E91E63]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-[#E91E63]/30">
                  <div className="text-[#E91E63]">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-[#E91E63] to-[#C2185B] rounded-3xl p-12 shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
            {t('myEnglishJourney.finalCta', 'Pronto para Começar Sua Jornada?')}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {t('myEnglishJourney.finalCtaDesc', 'Junte-se a centenas de brasileiros transformando suas carreiras através do inglês.')}
          </p>
          <Link
            to="/course-list"
            className="inline-flex items-center gap-3 px-12 py-6 bg-white text-[#E91E63] font-bold text-xl rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
          >
            {t('myEnglishJourney.startNow', 'Começar Agora')}
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </StandardPage>
  );
};

export default MyEnglishJourney;
