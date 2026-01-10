import React from "react";
import Footer from "./student/Footer";
import { useClerkSafe, useUserSafe } from "../hooks/useClerkSafe.jsx";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { getHeadshotByIndex } from "../assets/headshots/headshots";

const About = () => {
	const { user } = useUserSafe();
	const { openSignIn } = useClerkSafe();
	const { t } = useTranslation();
	
	return (
		<>
			<div className="w-full mx-auto px-6 py-16 bg-gradient-to-b from-sofluent-pink/5 via-white to-sofluent-accent/5">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="max-w-4xl mx-auto"
				>
					<h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-6">
						{t('about.title', 'About So Fluent')}
					</h1>
					<p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
						{t('about.subtitle', 'Be Yourself in English. Prosper Globally.')}
					</p>

					{/* Founder Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="bg-white p-8 md:p-12 rounded-2xl shadow-xl mb-12 text-center"
					>
						<div className="flex flex-col items-center mb-6">
							<img
								src={getHeadshotByIndex(0)}
								alt="Heloisa"
								className="w-32 h-32 rounded-full object-cover border-4 border-sofluent-pink shadow-lg mb-4"
								onError={(e) => {
									e.target.src = '/placeholder-headshot.png';
								}}
							/>
							<h2 className="text-3xl font-bold text-gray-800 mb-2">
								{t('about.founder.name', 'Heloisa')}
							</h2>
							<p className="text-lg text-sofluent-pink font-semibold mb-4">
								{t('about.founder.title', 'Founder & Lead Instructor')}
							</p>
						</div>
						<p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
							{t('about.founder.bio', 'With a passion for both fitness and language learning, Heloisa created So Fluent to help ambitious Brazilians transform their careers through science-backed English learning. Her innovative approach combines physical activity with language acquisition, making learning 20-40% more effective.')}
						</p>
					</motion.div>

					{/* Section: Our Mission */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="bg-white p-8 rounded-xl shadow-lg mb-8"
					>
						<h2 className="text-2xl font-semibold text-gray-800 mb-4">
							{t('about.mission.title', 'Our Mission')}
						</h2>
						<p className="text-gray-700 leading-relaxed">
							{t('about.mission.text', 'At So Fluent, we believe that learning English should be natural, engaging, and effective. Our science-backed approach combines fitness with language learning, helping ambitious Brazilians achieve fluency faster while staying healthy. We\'re not just teaching English - we\'re transforming careers and lives.')}
						</p>
					</motion.div>

					{/* Section: Why Choose Us */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="p-6 border-2 border-sofluent-pink/20 rounded-xl shadow-md text-center bg-white hover:shadow-lg transition-shadow"
						>
							<div className="text-4xl mb-4">🏋️</div>
							<h3 className="text-xl font-semibold text-gray-800 mb-2">
								{t('about.features.fitness.title', 'Fitness + Learning')}
							</h3>
							<p className="text-gray-600">
								{t('about.features.fitness.text', 'Science-backed method that\'s 20-40% more effective than traditional learning.')}
							</p>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.1 }}
							className="p-6 border-2 border-sofluent-accent/20 rounded-xl shadow-md text-center bg-white hover:shadow-lg transition-shadow"
						>
							<div className="text-4xl mb-4">🌍</div>
							<h3 className="text-xl font-semibold text-gray-800 mb-2">
								{t('about.features.global.title', 'Global Community')}
							</h3>
							<p className="text-gray-600">
								{t('about.features.global.text', 'Join 300+ ambitious Brazilians transforming their careers together.')}
							</p>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.2 }}
							className="p-6 border-2 border-sofluent-pink/20 rounded-xl shadow-md text-center bg-white hover:shadow-lg transition-shadow"
						>
							<div className="text-4xl mb-4">🎯</div>
							<h3 className="text-xl font-semibold text-gray-800 mb-2">
								{t('about.features.results.title', 'Proven Results')}
							</h3>
							<p className="text-gray-600">
								{t('about.features.results.text', 'Real success stories from students who landed their dream jobs.')}
							</p>
						</motion.div>
					</div>

					{/* Section: Join Us */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="mt-12 text-center bg-gradient-to-r from-sofluent-pink to-sofluent-accent p-8 rounded-2xl shadow-xl"
					>
						<h2 className="text-3xl font-bold text-white mb-4">
							{t('about.cta.title', 'Ready to Transform Your Career?')}
						</h2>
						<p className="text-white/90 mb-8 text-lg">
							{t('about.cta.subtitle', 'Join So Fluent today and start your journey to fluency and fitness.')}
						</p>

						{user ? (
							<Link 
								to="/fluency-fit" 
								className="inline-block px-8 py-4 bg-white text-sofluent-pink font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
							>
								{t('about.cta.button', 'Explore Courses')}
							</Link>
						) : (
							<button
								onClick={() => openSignIn()}
								className="px-8 py-4 bg-white text-sofluent-pink font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
							>
								{t('about.cta.button', 'Get Started')}
							</button>
						)}
					</motion.div>
				</motion.div>
			</div>
			<Footer />
		</>
	);
};

export default About;
