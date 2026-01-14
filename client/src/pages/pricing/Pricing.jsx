/**
 * Pricing Page with Location-Based Rates
 * Shows different pricing for Brazil, US, and Europe markets
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CheckCircle, Star, Zap, Crown, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import LocationSelector from '../../components/pricing/LocationSelector';
import { useLocationPricing } from '../../hooks/useLocationPricing';
import StandardPage from '../../utils/pageConsistency';
import BrandButton from '../../components/common/BrandButton';
import BrandText from '../../components/common/BrandText';

const Pricing = () => {
  const { t } = useTranslation();
  const { pricing, market, loading } = useLocationPricing();

  const pricingTiers = [
    {
      id: 'free',
      name: t('pricing.free.name', 'Gratuito'),
      nameEn: 'Free',
      icon: <Zap className="w-8 h-8" />,
      price: pricing.free.display,
      period: '',
      features: [
        t('pricing.free.feature1', 'Acesso à comunidade'),
        t('pricing.free.feature2', '1 curso gravado'),
        t('pricing.free.feature3', 'Recursos de prática'),
        t('pricing.free.feature4', 'Newsletter semanal')
      ],
      cta: t('pricing.free.cta', 'Criar Conta Grátis'),
      ctaEn: 'Create Free Account',
      popular: false,
      color: 'gray'
    },
    {
      id: 'academy',
      name: t('pricing.academy.name', 'Fluency Fit Academy'),
      nameEn: 'Fluency Fit Academy',
      icon: <Star className="w-8 h-8" />,
      price: pricing.academy.display,
      period: pricing.academy.period,
      features: [
        t('pricing.academy.feature1', 'Tudo do Gratuito, mais:'),
        t('pricing.academy.feature2', '3x/semana aulas ao vivo (fitness + inglês)'),
        t('pricing.academy.feature3', 'Todos os cursos gravados'),
        t('pricing.academy.feature4', 'Acesso ilimitado à plataforma'),
        t('pricing.academy.feature5', 'Comunidade exclusiva'),
        t('pricing.academy.feature6', 'Certificado de conclusão')
      ],
      cta: t('pricing.academy.cta', 'Começar Agora'),
      ctaEn: 'Start Now',
      popular: true,
      color: 'cherry'
    },
    {
      id: 'vip',
      name: t('pricing.vip.name', 'VIP 1:1 Coaching'),
      nameEn: 'VIP 1:1 Coaching',
      icon: <Crown className="w-8 h-8" />,
      price: pricing.vip.display,
      period: pricing.vip.period,
      features: [
        t('pricing.vip.feature1', 'Tudo do Academy, mais:'),
        t('pricing.vip.feature2', '4x/mês aulas particulares com Heloisa'),
        t('pricing.vip.feature3', 'Plano de estudos personalizado'),
        t('pricing.vip.feature4', 'Feedback semanal detalhado'),
        t('pricing.vip.feature5', 'Preparação para entrevistas'),
        t('pricing.vip.feature6', 'Suporte prioritário')
      ],
      cta: t('pricing.vip.cta', 'Agendar Consulta'),
      ctaEn: 'Schedule Consultation',
      popular: false,
      color: 'gold'
    }
  ];

  return (
    <StandardPage
      loading={loading}
      seoTitle="Pricing - So Fluent"
      seoDescription="Choose the perfect plan for your English learning journey"
      background="bg-gradient-to-b from-white via-pink-50 to-white"
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
            <BrandText as="h1" variant="display" size="6xl" color="primary" weight="bold" className="mb-6 leading-tight tracking-tight md:text-7xl lg:text-8xl">
              {t('pricing.title', 'Escolha Seu Plano')}
            </BrandText>
            <BrandText size="2xl" color="secondary" className="mb-8 max-w-3xl mx-auto leading-relaxed md:text-3xl">
              {t('pricing.subtitle', 'Preços personalizados para seu mercado')}
            </BrandText>
            
            {/* Location Selector */}
            <div className="flex justify-center mb-8">
              <LocationSelector />
            </div>
            
            <BrandText size="sm" color="secondary">
              {t('pricing.locationNote', 'Preços ajustados automaticamente para seu mercado')}
            </BrandText>
          </motion.div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className={`relative bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${
                  tier.popular
                    ? 'border-[#E91E63] ring-4 ring-[#E91E63]/20 scale-105'
                    : 'border-gray-200'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-sofluent-cherry to-sofluent-cherry-dark text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      {t('pricing.mostPopular', '⭐ MAIS POPULAR')}
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`mb-6 w-16 h-16 rounded-2xl flex items-center justify-center ${
                  tier.color === 'cherry' ? 'bg-sofluent-cherry/10 text-sofluent-cherry' :
                  tier.color === 'gold' ? 'bg-sofluent-gold/10 text-sofluent-gold' :
                  'bg-gray-100 text-sofluent-gris'
                }`}>
                  {tier.icon}
                </div>

                {/* Name */}
                <BrandText as="h3" variant="display" size="2xl" color="primary" weight="bold" className="mb-4">
                  {tier.name}
                </BrandText>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <BrandText size="5xl" color={tier.color === 'cherry' ? 'cherry' : tier.color === 'gold' ? 'gold' : 'primary'} weight="bold">
                      {tier.price}
                    </BrandText>
                    {tier.period && (
                      <BrandText size="xl" color="secondary">{tier.period}</BrandText>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-10">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className={`w-6 h-6 flex-shrink-0 mt-0.5 ${
                        tier.color === 'cherry' ? 'text-[#E91E63]' :
                        tier.color === 'gold' ? 'text-[#D4AF37]' :
                        'text-green-500'
                      }`} />
                      <BrandText size="base" color="secondary" className="leading-relaxed">{feature}</BrandText>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                {tier.id === 'academy' ? (
                  <Link to="/fluency-fit" className="block">
                    <BrandButton
                      variant="primary"
                      size="large"
                      fullWidth
                      className="flex items-center justify-center gap-2"
                    >
                      {tier.cta}
                      <ArrowRight className="w-5 h-5" />
                    </BrandButton>
                  </Link>
                ) : (
                  <BrandButton
                    variant={tier.popular ? 'primary' : tier.color === 'gold' ? 'accent' : 'ghost'}
                    size="large"
                    fullWidth
                    className="flex items-center justify-center gap-2"
                  >
                    {tier.cta}
                    <ArrowRight className="w-5 h-5" />
                  </BrandButton>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Academy CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#E91E63] via-[#D4AF37] to-[#E91E63]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border-2 border-white/20 shadow-2xl"
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
                <BrandText size="3xl" color="white" weight="bold" className="md:text-4xl">
                  {t('pricing.academyBanner.title', 'Pronto para Transformar Seu Inglês?')}
                </BrandText>
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
              </div>
              <BrandText size="xl" color="white" className="mb-8 opacity-90 md:text-2xl">
                {t('pricing.academyBanner.subtitle', 'Junte-se à Fluency Fit Academy e alcance fluência com aulas ao vivo 3x por semana')}
              </BrandText>
              <Link to="/fluency-fit">
                <BrandButton
                  variant="accent"
                  size="large"
                  className="bg-white text-[#E91E63] hover:bg-gray-100 font-bold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all"
                >
                  {t('pricing.academyBanner.cta', 'Começar Agora - 7 Dias Grátis')}
                  <ArrowRight className="w-6 h-6 ml-2" />
                </BrandButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <BrandText as="h2" variant="display" size="4xl" color="primary" weight="bold" className="text-center mb-12 md:text-5xl">
            {t('pricing.faq.title', 'Perguntas Frequentes')}
          </BrandText>
          
          <div className="space-y-6">
            {[
              {
                q: t('pricing.faq.q1', 'Por que os preços são diferentes por região?'),
                a: t('pricing.faq.a1', 'Ajustamos nossos preços para serem justos e acessíveis em cada mercado, considerando o poder de compra local e condições econômicas.')
              },
              {
                q: t('pricing.faq.q2', 'Posso mudar de plano a qualquer momento?'),
                a: t('pricing.faq.a2', 'Sim! Você pode fazer upgrade ou downgrade a qualquer momento. As mudanças serão aplicadas no próximo ciclo de cobrança.')
              },
              {
                q: t('pricing.faq.q3', 'Há período de teste gratuito?'),
                a: t('pricing.faq.a3', 'Sim! O plano Gratuito oferece acesso completo à comunidade e 1 curso. O Academy oferece 7 dias grátis para novos membros.')
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-2xl p-6"
              >
                <BrandText as="h3" size="xl" color="primary" weight="bold" className="mb-3">{faq.q}</BrandText>
                <BrandText size="base" color="secondary" className="leading-relaxed">{faq.a}</BrandText>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </StandardPage>
  );
};

export default Pricing;
