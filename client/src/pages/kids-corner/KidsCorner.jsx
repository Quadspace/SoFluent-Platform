import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Video, 
  Gamepad2, 
  Trophy, 
  Shield, 
  Clock,
  Star,
  PlayCircle,
  Users
} from 'lucide-react';
import Navbar from '../../components/student/Navbar';
import Footer from '../../components/student/Footer';

const KidsCorner = () => {
  const { t } = useTranslation();
  const [selectedGame, setSelectedGame] = useState(null);

  const features = [
    {
      icon: <Gamepad2 className="w-10 h-10 text-yellow-500" />,
      title: t('kidsCorner.features.games.title', 'Vocabulary Quest'),
      description: t('kidsCorner.features.games.description', 'Fun games to learn English vocabulary through play')
    },
    {
      icon: <Video className="w-10 h-10 text-blue-500" />,
      title: t('kidsCorner.features.videos.title', 'Culture Capsules'),
      description: t('kidsCorner.features.videos.description', 'Educational videos about English-speaking cultures')
    },
    {
      icon: <Trophy className="w-10 h-10 text-purple-500" />,
      title: t('kidsCorner.features.rewards.title', 'Rewards & Badges'),
      description: t('kidsCorner.features.rewards.description', 'Earn badges and rewards for learning')
    },
    {
      icon: <Shield className="w-10 h-10 text-green-500" />,
      title: t('kidsCorner.features.safety.title', 'Safe & Secure'),
      description: t('kidsCorner.features.safety.description', 'Parent-controlled safe learning environment')
    }
  ];

  const games = [
    {
      id: 1,
      name: t('kidsCorner.games.wordMatch.name', 'Word Match'),
      description: t('kidsCorner.games.wordMatch.description', 'Match words with pictures'),
      ageRange: '5-8',
      difficulty: 'Easy'
    },
    {
      id: 2,
      name: t('kidsCorner.games.spellQuest.name', 'Spell Quest'),
      description: t('kidsCorner.games.spellQuest.description', 'Learn spelling through adventure'),
      ageRange: '7-10',
      difficulty: 'Medium'
    },
    {
      id: 3,
      name: t('kidsCorner.games.pronunciation.name', 'Pronunciation Practice'),
      description: t('kidsCorner.games.pronunciation.description', 'Practice pronunciation with fun activities'),
      ageRange: '6-12',
      difficulty: 'Easy'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-yellow-100 via-blue-100 to-purple-100 py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <img 
                src="/red-balloon-logo.png" 
                alt="Red Balloon" 
                className="h-16 w-auto"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span className="text-4xl font-bold text-gray-800">+</span>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800">
                {t('kidsCorner.hero.title', "Kids' Corner")}
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              {t('kidsCorner.hero.subtitle', 'Fun English learning for kids, powered by Red Balloon')}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-400 text-gray-800 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              {t('kidsCorner.cta', 'Start Learning Now')}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            {t('kidsCorner.features.title', 'Fun Learning Features')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            {t('kidsCorner.games.title', 'Learning Games')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedGame(game)}
              >
                <div className="flex items-center justify-between mb-4">
                  <Gamepad2 className="w-8 h-8 text-yellow-500" />
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {game.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{game.name}</h3>
                <p className="text-gray-600 mb-4">{game.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{game.ageRange} {t('kidsCorner.games.years', 'years')}</span>
                  </div>
                </div>
                <button className="mt-4 w-full bg-yellow-400 text-gray-800 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                  {t('kidsCorner.games.play', 'Play Now')}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Library Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            {t('kidsCorner.videos.title', 'Culture Capsules')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[1, 2, 3].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center">
                  <PlayCircle className="w-16 h-16 text-white opacity-80" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {t(`kidsCorner.videos.video${index}.title`, `Video ${index}: Cultural Adventure`)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t(`kidsCorner.videos.video${index}.description`, 'Learn about English-speaking cultures')}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{t('kidsCorner.videos.duration', '5-10 min')}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Parent Dashboard Preview */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              {t('kidsCorner.parentDashboard.title', 'Parent Dashboard')}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {t('kidsCorner.parentDashboard.description', 'Track your child\'s progress, set time limits, and manage their learning journey')}
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">{t('kidsCorner.parentDashboard.progress', 'Progress Tracking')}</h3>
                <p className="text-sm text-gray-600">{t('kidsCorner.parentDashboard.progressDesc', 'See what your child is learning')}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <Clock className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">{t('kidsCorner.parentDashboard.timeLimit', 'Time Limits')}</h3>
                <p className="text-sm text-gray-600">{t('kidsCorner.parentDashboard.timeLimitDesc', 'Control screen time')}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <Shield className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">{t('kidsCorner.parentDashboard.safety', 'Safe Content')}</h3>
                <p className="text-sm text-gray-600">{t('kidsCorner.parentDashboard.safetyDesc', 'Age-appropriate content only')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-400 to-orange-400">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('kidsCorner.finalCta.title', 'Ready to Start Learning?')}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {t('kidsCorner.finalCta.subtitle', 'Join Red Balloon students learning English through fun and games')}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-yellow-600 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              {t('kidsCorner.cta', 'Start Learning Now')}
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default KidsCorner;
