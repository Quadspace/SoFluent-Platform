import React from "react";
import { motion } from "framer-motion";
import { Video, Users, BookOpen, Sparkles, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const LearningMethodsSection = () => {
	const { t } = useTranslation();

	const methods = [
		{
			icon: <Video className="w-16 h-16 text-[#E91E63]" />,
			title: t('methodology.recorded.title', 'Cursos Gravados'),
			description: t('methodology.recorded.description', 'As lições assíncronas podem ser acessadas a qualquer hora e quantas vezes você precisar. Todas incluem legendas e materiais extras de prática com gabarito, garantindo clareza e autonomia nos estudos.')
		},
		{
			icon: <Users className="w-16 h-16 text-[#E91E63]" />,
			title: t('methodology.live.title', 'Aulas ao vivo'),
			description: t('methodology.live.description', 'A prática em tempo real é essencial. Seja em grupos dinâmicos ou em aulas particulares, você exercita suas habilidades, recebe feedback imediato e mantém a motivação para avançar com segurança.')
		},
		{
			icon: <BookOpen className="w-16 h-16 text-[#E91E63]" />,
			title: t('methodology.virtual.title', 'Sala de aula virtual'),
			description: t('methodology.virtual.description', 'Nossa plataforma organiza tudo em um só lugar — materiais, lições, recursos adicionais e atividades gamificadas. Além disso, você interage com uma comunidade de alunos que compartilham a mesma jornada de aprendizado.')
		}
	];

	return (
		<section className="relative py-40 bg-[#0A0A0A] border-y border-white/5">
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-[0.05]">
				<div className="absolute inset-0" style={{
					backgroundImage: `
						linear-gradient(rgba(233, 30, 99, 0.1) 1px, transparent 1px),
						linear-gradient(90deg, rgba(233, 30, 99, 0.1) 1px, transparent 1px)
					`,
					backgroundSize: '60px 60px'
				}}></div>
			</div>

			<div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="text-center mb-24"
				>
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						className="inline-flex items-center gap-3 px-6 py-3 bg-[#E91E63]/10 border border-[#E91E63]/30 rounded-full mb-8 backdrop-blur-sm"
					>
						<Sparkles className="w-5 h-5 text-[#E91E63]" />
						<span className="text-sm font-bold text-[#E91E63] uppercase tracking-wider">Como Funciona</span>
					</motion.div>
					<h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight tracking-tight" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
						COMO VOCÊ APRENDE
						<span className="block bg-gradient-to-r from-[#E91E63] via-[#D4AF37] to-[#E91E63] bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient mt-4">
							COM A SO FLUENT
						</span>
					</h2>
					<p className="text-2xl md:text-3xl text-gray-400 max-w-4xl mx-auto leading-relaxed font-light">
						Uma abordagem completa que combina flexibilidade, prática real e comunidade para acelerar seu aprendizado.
					</p>
				</motion.div>

				{/* Methods Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{methods.map((method, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.15, duration: 0.6 }}
							className="bg-[#1A1A1A] border border-white/10 rounded-3xl p-10 shadow-2xl hover:shadow-[#E91E63]/20 transition-all duration-300 group"
						>
							<div className="mb-8">
								<div className="w-24 h-24 bg-[#E91E63]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#E91E63]/20 transition-colors border border-[#E91E63]/20">
									{method.icon}
								</div>
							</div>
							<h3 className="text-3xl font-black text-white mb-6 group-hover:text-[#E91E63] transition-colors" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
								{method.title}
							</h3>
							<p className="text-gray-400 leading-relaxed text-lg font-light">
								{method.description}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default LearningMethodsSection;
