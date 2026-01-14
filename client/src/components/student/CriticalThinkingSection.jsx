/**
 * Critical Thinking Methodology Section
 * Explains So Fluent's approach to cultural context, power/privilege in language, and critical thinking
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Brain, Globe, Lightbulb, Target, BookOpen, Users, ArrowRight } from 'lucide-react';

const CriticalThinkingSection = () => {
  const { t } = useTranslation();

  const principles = [
    {
      icon: <Brain className="w-12 h-12" />,
      title: t('criticalThinking.question.title', 'Questionar Suposições'),
      description: t('criticalThinking.question.description', 'Desafiamos mitos linguísticos e modismos. Não aceitamos "é assim porque sempre foi assim". Questionamos o porquê e para quem algo é relevante.'),
      color: '#E91E63'
    },
    {
      icon: <Globe className="w-12 h-12" />,
      title: t('criticalThinking.context.title', 'Contextualizar Práticas Culturais'),
      description: t('criticalThinking.context.description', 'Explicamos o contexto histórico e cultural por trás das práticas de língua inglesa. Entendemos de onde vêm as regras e para quem foram criadas.'),
      color: '#00BCD4'
    },
    {
      icon: <Target className="w-12 h-12" />,
      title: t('criticalThinking.power.title', 'Refletir sobre Poder e Privilégio'),
      description: t('criticalThinking.power.description', 'Reconhecemos que a língua carrega poder e privilégio. Discutimos como o inglês pode ser usado para inclusão ou exclusão, e como você pode decidir conscientemente como quer usar o inglês.'),
      color: '#D4AF37'
    },
    {
      icon: <BookOpen className="w-12 h-12" />,
      title: t('criticalThinking.sources.title', 'Comparar Fontes'),
      description: t('criticalThinking.sources.description', 'Incentivamos você a comparar diferentes fontes, questionar autoridades linguísticas e formar suas próprias opiniões baseadas em evidências.'),
      color: '#E91E63'
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: t('criticalThinking.identity.title', 'Manter Sua Identidade'),
      description: t('criticalThinking.identity.description', 'Acreditamos que aprender inglês não significa perder sua identidade brasileira. Você pode ser fluente em inglês e ainda ser completamente você mesmo.'),
      color: '#00BCD4'
    },
    {
      icon: <Lightbulb className="w-12 h-12" />,
      title: t('criticalThinking.conscious.title', 'Decisão Consciente'),
      description: t('criticalThinking.conscious.description', 'Você decide conscientemente como quer usar o inglês na sua vida e no trabalho. Não impomos padrões - você escolhe o que funciona para você.'),
      color: '#D4AF37'
    }
  ];

  return (
    <section className="relative py-32 bg-gradient-to-b from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] border-y border-white/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(233, 30, 99, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(233, 30, 99, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-[#E91E63]/10 border border-[#E91E63]/30 rounded-full mb-8 backdrop-blur-sm"
          >
            <Brain className="w-5 h-5 text-[#E91E63]" />
            <span className="text-sm font-bold text-[#E91E63] uppercase tracking-wider">{t('criticalThinking.badge', 'Metodologia')}</span>
          </motion.div>
          
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight tracking-tight" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
            {t('criticalThinking.title', 'PENSAMENTO CRÍTICO')}
            <span className="block bg-gradient-to-r from-[#E91E63] via-[#D4AF37] to-[#E91E63] bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient mt-4">
              {t('criticalThinking.titleHighlight', 'NA APRENDIZAGEM')}
            </span>
          </h2>
          
          <p className="text-2xl md:text-3xl text-gray-400 max-w-4xl mx-auto leading-relaxed font-light">
            {t('criticalThinking.subtitle', 'Não apenas ensinamos inglês - ensinamos você a pensar criticamente sobre a língua, cultura e poder.')}
          </p>
        </motion.div>

        {/* Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {principles.map((principle, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-[#1A1A1A] border border-white/10 rounded-3xl p-10 shadow-2xl hover:shadow-[#E91E63]/20 transition-all duration-300 group"
            >
              {/* Icon */}
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-[#E91E63]/20 to-[#E91E63]/10 border-2 border-[#E91E63]/30 group-hover:border-[#E91E63]/50 transition-colors"
              >
                <div style={{ color: principle.color }}>
                  {principle.icon}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-black text-white mb-4 group-hover:text-[#E91E63] transition-colors" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
                {principle.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 leading-relaxed text-lg font-light">
                {principle.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Why It Matters Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#E91E63]/10 to-[#D4AF37]/10 border border-white/10 rounded-3xl p-12 mb-12"
        >
          <h3 className="text-3xl md:text-4xl font-black text-white mb-6 text-center" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
            {t('criticalThinking.whyMatters.title', 'Por Que Isso Importa?')}
          </h3>
          <p className="text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto text-center">
            {t('criticalThinking.whyMatters.description', 'Aprender inglês sem pensamento crítico pode levar à perda de identidade cultural e à aceitação passiva de normas que não servem aos seus interesses. Com pensamento crítico, você aprende inglês mantendo sua identidade brasileira, questionando o que não faz sentido e decidindo conscientemente como quer usar a língua para seus próprios objetivos.')}
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            {t('criticalThinking.cta', 'Junte-se a uma comunidade que valoriza pensamento crítico, identidade cultural e aprendizado consciente.')}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CriticalThinkingSection;
