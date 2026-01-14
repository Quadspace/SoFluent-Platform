import React from "react";
import { Link } from "react-router-dom";
import { useClerkSafe } from "../../hooks/useClerkSafe.jsx";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Target, Zap, TrendingUp, Users } from "lucide-react";
import Signature from "../Signature";

const CallToAction = () => {
	const { t } = useTranslation();
	const { openSignIn } = useClerkSafe();

	return (
		<section className="relative py-40 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-[#FFF5F9] via-white to-[#FFFBF0]">
			{/* Beautiful Gradient Overlays */}
			<div className="absolute inset-0 overflow-hidden">
				<motion.div
					className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#E91E63]/10 to-transparent rounded-full blur-3xl"
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.3, 0.5, 0.3],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut"
					}}
				/>
				<motion.div
					className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-[#D4AF37]/10 to-transparent rounded-full blur-3xl"
					animate={{
						scale: [1, 1.3, 1],
						opacity: [0.3, 0.5, 0.3],
					}}
					transition={{
						duration: 10,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 1
					}}
				/>
			</div>

			<div className="relative z-10 max-w-5xl mx-auto text-center">
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
				>
					{/* Beautiful Badge */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-full mb-10 shadow-sm"
					>
						<Sparkles className="w-5 h-5 text-[#D4AF37]" />
						<span className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider">Comece Sua Jornada Hoje</span>
					</motion.div>

					{/* Beautiful Headline */}
					<h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-[#1A1A1A] mb-10 leading-tight tracking-tight" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
						{t('messaging.tagline', 'Be Yourself')}
						<br />
						<span className="bg-gradient-to-r from-[#E91E63] via-[#D4AF37] to-[#E91E63] bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient">
							in English
						</span>
						<br />
						<span className="text-[#1A1A1A]">Prosper Globally</span>
					</h2>

					{/* Elegant Subheadline */}
					<p className="text-2xl md:text-3xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed font-light">
						{t('messaging.effectiveness', 'Science-backed English learning that\'s 20-40% more effective than traditional methods.')}
					</p>

					{/* Fluency Fit Academy Highlight */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="mb-12"
					>
						<Link
							to="/fluency-fit"
							className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-[#E91E63]/10 via-[#D4AF37]/10 to-[#E91E63]/10 border-2 border-[#E91E63]/30 rounded-2xl hover:border-[#E91E63]/50 transition-all group"
						>
							<div className="flex items-center gap-3">
								<Zap className="w-6 h-6 text-[#E91E63] group-hover:scale-110 transition-transform" />
								<div className="text-left">
									<div className="text-sm font-bold text-[#E91E63] uppercase tracking-wider">
										{t('fluencyFit.title', 'Fluency Fit Academy')}
									</div>
									<div className="text-xs text-gray-600">
										{t('fluencyFit.hero.subtitle', 'Get Fit AND Fluent in Half the Time')}
									</div>
								</div>
							</div>
							<ArrowRight className="w-5 h-5 text-[#E91E63] group-hover:translate-x-1 transition-transform" />
						</Link>
					</motion.div>

					{/* Beautiful CTA Buttons */}
					<div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
						<Link
							to="/fluency-fit"
							className="group relative px-14 py-7 bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white font-black text-xl rounded-2xl hover:shadow-2xl hover:shadow-[#E91E63]/40 transition-all transform hover:scale-105 overflow-hidden"
						>
							<span className="relative z-10 flex items-center gap-4">
								{t('fluencyFit.cta', 'Start Your Free 7-Day Trial')}
								<ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
							</span>
							<motion.div
								className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#E91E63] opacity-0 group-hover:opacity-100 transition-opacity"
								initial={false}
							/>
						</Link>
						<Link
							to="/about"
							className="px-14 py-7 bg-white border-2 border-gray-200 text-gray-800 font-black text-xl rounded-2xl hover:border-[#E91E63] hover:text-[#E91E63] transition-all flex items-center gap-4 shadow-sm hover:shadow-lg"
						>
							{t('common.learnMore', 'Saiba Mais')}
							<Target className="w-7 h-7" />
						</Link>
					</div>

					{/* Beautiful Stats */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
						{[
							{ icon: Users, value: '327+', label: 'Estudantes Ativos', color: '#E91E63', bg: 'from-[#E91E63]/10 to-[#E91E63]/5' },
							{ icon: TrendingUp, value: '4.8', label: 'Avaliação Média', color: '#D4AF37', bg: 'from-[#D4AF37]/10 to-[#D4AF37]/5' },
							{ icon: Zap, value: '20-40%', label: 'Mais Eficaz', color: '#E91E63', bg: 'from-[#E91E63]/10 to-[#E91E63]/5' },
						].map((stat, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0.2 + index * 0.1 }}
								className={`bg-gradient-to-br ${stat.bg} border border-white rounded-3xl p-10 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm`}
							>
								<div className="flex flex-col items-center text-center">
									<div 
										className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${stat.bg} border-2 transition-transform hover:scale-110`}
										style={{ borderColor: `${stat.color}30` }}
									>
										<stat.icon className="w-10 h-10" style={{ color: stat.color }} />
									</div>
									<div className="text-6xl font-black text-[#1A1A1A] mb-3" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
										{stat.value}
									</div>
									<div className="text-gray-600 font-bold text-sm uppercase tracking-wider">
										{stat.label}
									</div>
								</div>
							</motion.div>
						))}
					</div>

					{/* Signature */}
					<div className="w-full flex justify-end max-w-5xl mx-auto">
						<Signature />
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export default CallToAction;
