import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Dumbbell, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  PlayCircle,
  Calendar,
  Clock,
  Award,
  Heart
} from 'lucide-react';
import Navbar from '../../components/student/Navbar';
import Footer from '../../components/student/Footer';
import WorkoutSchedule from '../../components/fluency-fit/WorkoutSchedule';

const FluencyFitAcademy = () => {
  const { t } = useTranslation();

  const howItWorks = [
    {
      step: 1,
      icon: <Users className="w-12 h-12 text-sofluent-pink" />,
      title: t('fluencyFit.steps.join.title', 'Join the Academy'),
      description: t('fluencyFit.steps.join.description', 'Sign up and become part of a community of ambitious learners')
    },
    {
      step: 2,
      icon: <Dumbbell className="w-12 h-12 text-sofluent-pink" />,
      title: t('fluencyFit.steps.workout.title', 'Join Live Workouts'),
      description: t('fluencyFit.steps.workout.description', 'Participate in live fitness sessions while practicing English')
    },
    {
      step: 3,
      icon: <PlayCircle className="w-12 h-12 text-sofluent-pink" />,
      title: t('fluencyFit.steps.practice.title', 'Practice English'),
      description: t('fluencyFit.steps.practice.description', 'Learn vocabulary and phrases during workouts')
    },
    {
      step: 4,
      icon: <TrendingUp className="w-12 h-12 text-sofluent-pink" />,
      title: t('fluencyFit.steps.transform.title', 'Transform Your Life'),
      description: t('fluencyFit.steps.transform.description', 'Achieve fitness goals and English fluency simultaneously')
    }
  ];

  const pricingTiers = [
    {
      name: t('fluencyFit.pricing.academy.name', 'Academy'),
      price: 'R$ 297',
      period: t('fluencyFit.pricing.month', '/month'),
      features: [
        t('fluencyFit.pricing.academy.feature1', 'Live workout sessions (3x/week)'),
        t('fluencyFit.pricing.academy.feature2', 'English practice during workouts'),
        t('fluencyFit.pricing.academy.feature3', 'Access to workout library'),
        t('fluencyFit.pricing.academy.feature4', 'Community support'),
        t('fluencyFit.pricing.academy.feature5', 'Progress tracking')
      ],
      popular: false
    },
    {
      name: t('fluencyFit.pricing.vip.name', 'VIP Circle'),
      price: 'R$ 997',
      period: t('fluencyFit.pricing.month', '/month'),
      features: [
        t('fluencyFit.pricing.vip.feature1', 'Everything in Academy'),
        t('fluencyFit.pricing.vip.feature2', '1:1 coaching sessions with Heloisa'),
        t('fluencyFit.pricing.vip.feature3', 'Personalized fitness & English plan'),
        t('fluencyFit.pricing.vip.feature4', 'Exclusive VIP events'),
        t('fluencyFit.pricing.vip.feature5', 'Priority support'),
        t('fluencyFit.pricing.vip.feature6', 'Advanced progress analytics')
      ],
      popular: true
    }
  ];

  const faqs = [
    {
      q: t('fluencyFit.faq.q1', 'How does combining fitness and English learning work?'),
      a: t('fluencyFit.faq.a1', 'During live workout sessions, Heloisa teaches English vocabulary and phrases related to fitness movements, creating a natural learning environment that makes retention 20-40% more effective.')
    },
    {
      q: t('fluencyFit.faq.q2', 'Do I need to be fit to join?'),
      a: t('fluencyFit.faq.a2', 'No! All fitness levels are welcome. Workouts are adaptable to your current fitness level.')
    },
    {
      q: t('fluencyFit.faq.q3', 'What if I miss a live session?'),
      a: t('fluencyFit.faq.a3', 'All sessions are recorded and available in the workout library for you to access anytime.')
    },
    {
      q: t('fluencyFit.faq.q4', 'Can I cancel anytime?'),
      a: t('fluencyFit.faq.a4', 'Yes, you can cancel your subscription at any time with no penalties.')
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sofluent-pink/10 via-cyan-100/70 to-sofluent-accent/10 py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              {t('fluencyFit.hero.title', 'Get Fit AND Fluent in Half the Time')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              {t('fluencyFit.hero.subtitle', 'Science-backed English learning through fitness')}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-sofluent-pink text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              {t('fluencyFit.cta', 'Start Your Free 7-Day Trial')}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Science Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-sofluent-pink to-sofluent-accent text-white p-8 rounded-2xl shadow-xl"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('fluencyFit.science.title', '20-40% More Effective')}
              </h2>
              <p className="text-lg md:text-xl mb-2">
                {t('fluencyFit.science.subtitle', 'Peer-Reviewed Research')}
              </p>
              <p className="text-sm opacity-90">
                {t('fluencyFit.science.description', 'Studies show that learning while moving increases retention and engagement significantly.')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Workout Schedule */}
      <WorkoutSchedule />

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            {t('fluencyFit.howItWorks.title', 'How It Works')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md text-center"
              >
                <div className="flex justify-center mb-4">{step.icon}</div>
                <div className="bg-sofluent-pink text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            {t('fluencyFit.pricing.title', 'Choose Your Plan')}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingTiers.map((tier) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                  tier.popular ? 'ring-4 ring-sofluent-pink' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-sofluent-pink text-white px-4 py-1 rounded-full text-sm font-semibold">
                    {t('fluencyFit.pricing.popular', 'Most Popular')}
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2 text-gray-800">{tier.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-sofluent-pink">{tier.price}</span>
                  <span className="text-gray-600">{tier.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    tier.popular
                      ? 'bg-sofluent-pink text-white hover:bg-pink-600'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {t('fluencyFit.pricing.cta', 'Get Started')}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            {t('fluencyFit.successStories.title', 'Success Stories')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[1, 2, 3].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-sofluent-pink rounded-full flex items-center justify-center text-white font-bold">
                    {String.fromCharCode(64 + index)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-800">
                      {t(`fluencyFit.successStories.story${index}.name`, `Member ${index}`)}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {t(`fluencyFit.successStories.story${index}.role`, 'Academy Member')}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "{t(`fluencyFit.successStories.story${index}.quote`, 'Fluency Fit Academy transformed my life! I lost weight and improved my English at the same time.')}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            {t('fluencyFit.faq.title', 'Frequently Asked Questions')}
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-lg"
              >
                <h3 className="font-semibold text-gray-800 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-sofluent-pink to-sofluent-accent">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('fluencyFit.finalCta.title', 'Ready to Transform Your Life?')}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {t('fluencyFit.finalCta.subtitle', 'Join 300+ ambitious Brazilians transforming their careers')}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-sofluent-pink px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              {t('fluencyFit.cta', 'Start Your Free 7-Day Trial')}
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FluencyFitAcademy;
