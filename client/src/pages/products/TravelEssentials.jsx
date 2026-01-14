/**
 * Travel Essentials - Coming Soon Page
 * Travel English mini-course (not yet launched)
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Plane, MapPin, Clock, Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import StandardPage from '../../utils/pageConsistency';
import BrandText from '../../components/common/BrandText';

const TravelEssentials = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const handleNotifyMe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error(t('travelEssentials.emailRequired', 'Por favor, insira seu email'));
      return;
    }
    // TODO: Integrate with email service
    toast.success(t('travelEssentials.notifySuccess', 'Obrigado! Te avisaremos quando o curso for lançado.'));
    setEmail('');
  };

  const features = [
    t('travelEssentials.feature1', 'Comunicação prática para viagens'),
    t('travelEssentials.feature2', 'Frases essenciais para aeroportos, hotéis e restaurantes'),
    t('travelEssentials.feature3', 'Vocabulário contextual para situações reais'),
    t('travelEssentials.feature4', 'Dicas culturais e práticas de viagem'),
    t('travelEssentials.feature5', 'Preparação para intercâmbio e mobilidade internacional'),
    t('travelEssentials.feature6', 'Confiança para viajar e se comunicar')
  ];

  return (
    <StandardPage
      seoTitle="Travel Essentials - Coming Soon"
      seoDescription="Travel English mini-course - Coming soon"
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
            {/* Coming Soon Badge */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8941A] text-white rounded-full mb-8 shadow-lg"
            >
              <Clock className="w-5 h-5" />
              <span className="font-bold text-lg">{t('travelEssentials.comingSoon', 'EM BREVE')}</span>
            </motion.div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-[#1A1A1A] mb-6 leading-tight tracking-tight" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
              {t('travelEssentials.title', 'Travel Essentials')}
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed font-light">
              {t('travelEssentials.subtitle', 'Inglês para Viagens. Um mini curso que prepara você para viagens internacionais com comunicação prática e contextual.')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center text-[#1A1A1A] mb-16" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
            {t('travelEssentials.whatsIncluded', 'O Que Está Por Vir')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-md"
              >
                <CheckCircle className="w-6 h-6 text-[#E91E63] flex-shrink-0 mt-1" />
                <span className="text-gray-700 text-lg leading-relaxed">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Email Signup Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-[#FFF5F9] to-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-12 shadow-2xl border-2 border-gray-100"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-[#E91E63]/20 to-[#E91E63]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-[#E91E63]/30">
                <Mail className="w-10 h-10 text-[#E91E63]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-[#1A1A1A] mb-4" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
                {t('travelEssentials.notifyTitle', 'Seja Notificado do Lançamento')}
              </h2>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                {t('travelEssentials.notifyDesc', 'Queremos te avisar assim que o Travel Essentials estiver disponível. Deixe seu email abaixo!')}
              </p>
            </div>

            <form onSubmit={handleNotifyMe} className="max-w-md mx-auto">
              <div className="flex gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('travelEssentials.emailPlaceholder', 'seu@email.com')}
                  className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-xl text-lg focus:outline-none focus:border-[#E91E63] transition-colors"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  {t('travelEssentials.notifyMe', 'Avisar')}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Plane className="w-12 h-12" />,
                title: t('travelEssentials.preview1Title', 'Aeroportos'),
                description: t('travelEssentials.preview1Desc', 'Check-in, segurança, imigração e mais.')
              },
              {
                icon: <MapPin className="w-12 h-12" />,
                title: t('travelEssentials.preview2Title', 'Hotéis & Restaurantes'),
                description: t('travelEssentials.preview2Desc', 'Reservas, pedidos e comunicação com serviços.')
              },
              {
                icon: <Plane className="w-12 h-12" />,
                title: t('travelEssentials.preview3Title', 'Situações do Dia a Dia'),
                description: t('travelEssentials.preview3Desc', 'Transporte, compras e interações sociais.')
              }
            ].map((preview, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center bg-white p-8 rounded-2xl shadow-lg"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#E91E63]/20 to-[#E91E63]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-[#E91E63]/30">
                  <div className="text-[#E91E63]">
                    {preview.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">{preview.title}</h3>
                <p className="text-gray-700 leading-relaxed">{preview.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </StandardPage>
  );
};

export default TravelEssentials;
