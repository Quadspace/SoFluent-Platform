/**
 * Values Section Component
 * Highlights So Fluent's core values including Representativeness, Critical Thinking, and Belonging
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Heart, Users, Target, Lightbulb, Award, Globe, Brain } from 'lucide-react';

const ValuesSection = () => {
  const { t } = useTranslation();

  const values = [
    {
      icon: <Heart className="w-12 h-12" />,
      title: t('values.empathy.title', 'Empatia'),
      description: t('values.empathy.description', 'Cada jornada de aprendizado é única, por isso tratamos nossos alunos com compreensão e respeito.'),
      color: '#E91E63'
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: t('values.representativeness.title', 'Representatividade'),
      description: t('values.representativeness.description', 'Como uma escola liderada por uma mulher negra, a So Fluent valoriza a diversidade e busca refletir isso em suas práticas e materiais.'),
      color: '#D4AF37',
      featured: true
    },
    {
      icon: <Target className="w-12 h-12" />,
      title: t('values.accountability.title', 'Accountability'),
      description: t('values.accountability.description', 'Compromisso com resultados concretos e responsabilidade em entregar serviços de alta qualidade.'),
      color: '#E91E63'
    },
    {
      icon: <Lightbulb className="w-12 h-12" />,
      title: t('values.innovation.title', 'Inovação'),
      description: t('values.innovation.description', 'Integramos ciência, tecnologia e tendências modernas de forma crítica no ensino para criar experiências transformadoras.'),
      color: '#00BCD4'
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: t('values.excellence.title', 'Excelência'),
      description: t('values.excellence.description', 'Priorizamos a qualidade em tudo que fazemos, desde a curadoria e criação de materiais até o atendimento ao estudante.'),
      color: '#D4AF37'
    },
    {
      icon: <Globe className="w-12 h-12" />,
      title: t('values.belonging.title', 'Pertencimento'),
      description: t('values.belonging.description', 'Acreditamos na aprendizagem de inglês que vem da auto reflexão de quem se é no mundo.'),
      color: '#E91E63'
    },
    {
      icon: <Brain className="w-12 h-12" />,
      title: t('values.criticalThinking.title', 'Pensamento Crítico'),
      description: t('values.criticalThinking.description', 'Questionar suposições, modismos e mitos linguísticos; contextualizar práticas culturais; refletir sobre poder/privilégio na língua.'),
      color: '#00BCD4',
      featured: true
    }
  ];

  return (
    <section className="relative py-32 bg-gradient-to-b from-white via-[#FFF5F9] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-[#1A1A1A] mb-8 leading-tight tracking-tight" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
            {t('values.title', 'NOSSOS VALORES')}
          </h2>
          <p className="text-2xl md:text-3xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
            {t('values.subtitle', 'Os princípios que guiam cada aspecto do nosso ensino e da nossa comunidade.')}
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className={`bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${
                value.featured
                  ? 'border-[#D4AF37] ring-4 ring-[#D4AF37]/20 scale-105'
                  : 'border-gray-100'
              }`}
            >
              {/* Icon */}
              <div 
                className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${
                  value.featured ? 'bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/10' : 'bg-gradient-to-br from-gray-50 to-white'
                }`}
                style={value.featured ? {} : { backgroundColor: `${value.color}15` }}
              >
                <div style={{ color: value.color }}>
                  {value.icon}
                </div>
              </div>

              {/* Featured Badge */}
              {value.featured && (
                <div className="mb-4">
                  <span className="inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-[#D4AF37] to-[#B8941A] text-white text-xs font-bold rounded-full uppercase tracking-wider">
                    {t('values.featured', '⭐ Destaque')}
                  </span>
                </div>
              )}

              {/* Title */}
              <h3 className="text-2xl font-black text-[#1A1A1A] mb-4" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
                {value.title}
              </h3>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed text-lg font-light">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t('values.cta', 'Esses valores não são apenas palavras—eles são a base de tudo que fazemos. Junte-se a uma comunidade que valoriza diversidade, pensamento crítico e pertencimento.')}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ValuesSection;
