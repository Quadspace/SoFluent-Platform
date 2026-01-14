/**
 * ESP Courses Page - English for Specific Purposes
 * Industry-specific English courses for professionals
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Briefcase, Stethoscope, GraduationCap, Code, Building2, Microscope, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import StandardPage from '../../utils/pageConsistency';
import BrandText from '../../components/common/BrandText';

const ESPCourses = () => {
  const { t } = useTranslation();

  const espCategories = [
    {
      icon: <Stethoscope className="w-12 h-12" />,
      title: t('esp.medical.title', 'Medical English'),
      description: t('esp.medical.description', 'English for healthcare professionals, doctors, nurses, and medical students.'),
      features: [
        t('esp.medical.feature1', 'Medical terminology'),
        t('esp.medical.feature2', 'Patient communication'),
        t('esp.medical.feature3', 'Clinical documentation'),
        t('esp.medical.feature4', 'Medical presentations')
      ],
      color: '#E91E63'
    },
    {
      icon: <Code className="w-12 h-12" />,
      title: t('esp.tech.title', 'Tech English'),
      description: t('esp.tech.description', 'English for software developers, engineers, and tech professionals.'),
      features: [
        t('esp.tech.feature1', 'Technical documentation'),
        t('esp.tech.feature2', 'Code reviews & discussions'),
        t('esp.tech.feature3', 'Tech presentations'),
        t('esp.tech.feature4', 'Agile & Scrum terminology')
      ],
      color: '#00BCD4'
    },
    {
      icon: <Briefcase className="w-12 h-12" />,
      title: t('esp.business.title', 'Business English'),
      description: t('esp.business.description', 'English for executives, managers, and business professionals.'),
      features: [
        t('esp.business.feature1', 'Business presentations'),
        t('esp.business.feature2', 'Negotiations & meetings'),
        t('esp.business.feature3', 'Email & correspondence'),
        t('esp.business.feature4', 'Business writing')
      ],
      color: '#D4AF37'
    },
    {
      icon: <GraduationCap className="w-12 h-12" />,
      title: t('esp.academic.title', 'Academic English'),
      description: t('esp.academic.description', 'English for students, researchers, and academics.'),
      features: [
        t('esp.academic.feature1', 'Academic writing'),
        t('esp.academic.feature2', 'Research presentations'),
        t('esp.academic.feature3', 'Thesis & dissertation'),
        t('esp.academic.feature4', 'Academic discussions')
      ],
      color: '#E91E63'
    },
    {
      icon: <Building2 className="w-12 h-12" />,
      title: t('esp.legal.title', 'Legal English'),
      description: t('esp.legal.description', 'English for lawyers, paralegals, and legal professionals.'),
      features: [
        t('esp.legal.feature1', 'Legal terminology'),
        t('esp.legal.feature2', 'Contract writing'),
        t('esp.legal.feature3', 'Courtroom English'),
        t('esp.legal.feature4', 'Legal research')
      ],
      color: '#00BCD4'
    },
    {
      icon: <Microscope className="w-12 h-12" />,
      title: t('esp.science.title', 'Scientific English'),
      description: t('esp.science.description', 'English for scientists, researchers, and lab professionals.'),
      features: [
        t('esp.science.feature1', 'Scientific writing'),
        t('esp.science.feature2', 'Research papers'),
        t('esp.science.feature3', 'Lab reports'),
        t('esp.science.feature4', 'Scientific presentations')
      ],
      color: '#D4AF37'
    }
  ];

  return (
    <StandardPage
      seoTitle="ESP Courses - English for Specific Purposes"
      seoDescription="Industry-specific English courses for professionals"
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
              {t('esp.title', 'English for Specific Purposes')}
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed font-light">
              {t('esp.subtitle', 'Cursos especializados de inglês para profissionais. Aprenda o inglês que você precisa para sua área específica.')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/course-list"
                className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white font-bold text-xl rounded-xl shadow-lg hover:shadow-2xl hover:shadow-[#E91E63]/50 transition-all transform hover:scale-105"
              >
                {t('esp.cta', 'Ver Cursos Disponíveis')}
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What is ESP Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#E91E63]/10 to-[#E91E63]/5 rounded-3xl p-12 border-2 border-[#E91E63]/20"
          >
            <h2 className="text-4xl md:text-5xl font-black text-[#1A1A1A] mb-6 text-center" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
              {t('esp.whatIsESP.title', 'O Que É ESP?')}
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              {t('esp.whatIsESP.description', 'English for Specific Purposes (ESP) é uma abordagem de ensino de inglês focada nas necessidades específicas de profissionais em diferentes áreas. Ao invés de aprender inglês geral, você aprende o vocabulário, estruturas e habilidades de comunicação necessárias para sua profissão.')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-[#E91E63] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-[#1A1A1A] mb-2">{t('esp.whatIsESP.benefit1Title', 'Foco Prático')}</h3>
                  <p className="text-gray-700">{t('esp.whatIsESP.benefit1Desc', 'Aprenda apenas o que você precisa para sua área profissional.')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-[#E91E63] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-[#1A1A1A] mb-2">{t('esp.whatIsESP.benefit2Title', 'Aplicação Imediata')}</h3>
                  <p className="text-gray-700">{t('esp.whatIsESP.benefit2Desc', 'Use o inglês aprendido diretamente no seu trabalho.')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-[#E91E63] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-[#1A1A1A] mb-2">{t('esp.whatIsESP.benefit3Title', 'Resultados Rápidos')}</h3>
                  <p className="text-gray-700">{t('esp.whatIsESP.benefit3Desc', 'Veja progresso mais rápido focando em sua área.')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-[#E91E63] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-[#1A1A1A] mb-2">{t('esp.whatIsESP.benefit4Title', 'Personalizado')}</h3>
                  <p className="text-gray-700">{t('esp.whatIsESP.benefit4Desc', 'Cursos adaptados às necessidades específicas da sua profissão.')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ESP Categories Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-[#FFF5F9] to-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center text-[#1A1A1A] mb-16" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
            {t('esp.categoriesTitle', 'Categorias Disponíveis')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {espCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 group"
              >
                {/* Icon */}
                <div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border-2 transition-transform group-hover:scale-110"
                  style={{ 
                    backgroundColor: `${category.color}15`,
                    borderColor: `${category.color}30`
                  }}
                >
                  <div style={{ color: category.color }}>
                    {category.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-black text-[#1A1A1A] mb-4" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
                  {category.title}
                </h3>

                {/* Description */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {category.description}
                </p>

                {/* Features */}
                <ul className="space-y-3">
                  {category.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#E91E63] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Solutions Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#E91E63] to-[#C2185B] rounded-3xl p-12 shadow-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
              {t('esp.custom.title', 'Precisa de um Curso Personalizado?')}
            </h2>
            <p className="text-xl text-white/90 mb-8">
              {t('esp.custom.description', 'Não encontrou o curso para sua área? Entre em contato e criaremos um curso ESP personalizado para você ou sua empresa.')}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-12 py-6 bg-white text-[#E91E63] font-bold text-xl rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
            >
              {t('esp.custom.cta', 'Solicitar Curso Personalizado')}
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>
    </StandardPage>
  );
};

export default ESPCourses;
