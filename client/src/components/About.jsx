import React from "react";
import { useClerkSafe, useUserSafe } from "../hooks/useClerkSafe.jsx";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { getHeadshotByIndex } from "../assets/headshots/headshots";
import { getProfessionalImage } from "../assets/professional-images";
import StandardPage from "../utils/pageConsistency";
import BrandText from "./common/BrandText";
import BrandButton from "./common/BrandButton";
import { Sparkles, ArrowRight } from "lucide-react";

const About = () => {
	const { user } = useUserSafe();
	const { openSignIn } = useClerkSafe();
	const { t } = useTranslation();
	
	return (
		<StandardPage
			seoTitle="About So Fluent"
			seoDescription="Learn about So Fluent - English learning platform led by a Black woman"
			background="bg-gradient-to-b from-sofluent-pink/5 via-white to-sofluent-accent/5"
		>
			<div className="w-full mx-auto px-6 py-16">
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

					{/* Founder Section with Representation Emphasis */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="bg-white p-8 md:p-12 rounded-2xl shadow-xl mb-12 text-center relative overflow-hidden border-2 border-[#D4AF37]/30"
					>
						{/* Background Image */}
						<div className="absolute inset-0 opacity-5">
							<img 
								src={getProfessionalImage('IMG_9441', 'large')} 
								alt="" 
								className="w-full h-full object-cover"
							/>
						</div>
						
						{/* Representation Badge */}
						<div className="absolute top-6 right-6">
							<span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B8941A] text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
								{t('about.representation', '⭐ Liderada por Mulher Negra')}
							</span>
						</div>
						
						<div className="relative z-10">
							<div className="flex flex-col items-center mb-6">
								<img
									src={getProfessionalImage('IMG_9476', 'medium')}
									alt="Heloisa"
									className="w-40 h-40 rounded-full object-cover border-4 border-sofluent-pink shadow-xl mb-4 ring-4 ring-sofluent-pink/20"
									onError={(e) => {
										e.target.src = getHeadshotByIndex(0);
									}}
								/>
								<h2 className="text-3xl font-bold text-gray-800 mb-2">
									{t('about.founder.name', 'Heloisa')}
								</h2>
								<p className="text-lg text-sofluent-pink font-semibold mb-2">
									{t('about.founder.title', 'Founder & Lead Instructor')}
								</p>
								<p className="text-base text-[#D4AF37] font-bold mb-4">
									{t('about.founder.representation', 'Liderando com Representatividade e Excelência')}
								</p>
							</div>
							<p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto mb-6">
								{t('about.founder.bio', 'With a passion for both fitness and language learning, Heloisa created So Fluent to help ambitious Brazilians transform their careers through science-backed English learning. Her innovative approach combines physical activity with language acquisition, making learning 20-40% more effective.')}
							</p>
							<p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto font-semibold">
								{t('about.founder.representationDesc', 'Como uma escola liderada por uma mulher negra, a So Fluent valoriza a diversidade e busca refletir isso em suas práticas e materiais, criando um espaço onde todos os brasileiros podem prosperar.')}
							</p>
						</div>
					</motion.div>

					{/* Team Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="mb-12"
					>
						<h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
							{t('about.team.title', 'Our Team')}
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{[
								{ name: 'Heloisa', role: t('about.team.founder', 'Founder'), image: getProfessionalImage('IMG_9519', 'medium') },
								{ name: 'Bruna', role: t('about.team.instructor', 'Lead Instructor'), image: getProfessionalImage('IMG_9493', 'medium') },
								{ name: 'Team', role: t('about.team.support', 'Support Team'), image: getProfessionalImage('IMG_9513', 'medium') },
							].map((member, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: index * 0.1 }}
									className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow"
								>
									<img
										src={member.image}
										alt={member.name}
										className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-sofluent-pink/30 shadow-lg"
										onError={(e) => {
											e.target.src = getHeadshotByIndex(index);
										}}
									/>
									<h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
									<p className="text-sofluent-pink font-semibold">{member.role}</p>
								</motion.div>
							))}
						</div>
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

					{/* Section: Join Us - Enhanced with Academy Focus */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="mt-12 text-center bg-gradient-to-r from-[#E91E63] via-[#D4AF37] to-[#E91E63] p-8 md:p-12 rounded-2xl shadow-xl border-2 border-white/20"
					>
						<div className="flex items-center justify-center gap-3 mb-4">
							<Sparkles className="w-8 h-8 text-white animate-pulse" />
							<h2 className="text-3xl md:text-4xl font-bold text-white">
								{t('about.cta.title', 'Ready to Transform Your Career?')}
							</h2>
							<Sparkles className="w-8 h-8 text-white animate-pulse" />
						</div>
						<p className="text-white/90 mb-2 text-lg md:text-xl font-semibold">
							{t('about.cta.academyTitle', 'Join Fluency Fit Academy')}
						</p>
						<p className="text-white/80 mb-8 text-base md:text-lg">
							{t('about.cta.subtitle', '3x/week live classes (fitness + English), unlimited courses, exclusive community')}
						</p>

						{user ? (
							<Link to="/fluency-fit">
								<BrandButton
									variant="accent"
									size="large"
									className="bg-white text-[#E91E63] hover:bg-gray-100 font-bold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all"
								>
									{t('about.cta.button', 'Join Academy Now')}
									<ArrowRight className="w-6 h-6 ml-2" />
								</BrandButton>
							</Link>
						) : (
							<button
								onClick={() => openSignIn()}
								className="px-8 py-4 bg-white text-[#E91E63] font-bold rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 text-lg flex items-center gap-2 mx-auto"
							>
								{t('about.cta.button', 'Get Started - 7 Days Free')}
								<ArrowRight className="w-6 h-6" />
							</button>
						)}
					</motion.div>
				</motion.div>
			</div>
		</StandardPage>
	);
};

export default About;
