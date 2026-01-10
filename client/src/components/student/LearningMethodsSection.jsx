import React from "react";
import { motion } from "framer-motion";
import { Video, Users, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

const LearningMethodsSection = () => {
	const { t } = useTranslation();

	const methods = [
		{
			icon: <Video className="w-12 h-12 text-[#E91E63]" />,
			title: 'Cursos Gravados',
			description: 'as lições assíncronas podem ser acessadas a qualquer hora e quantas vezes você precisar. Todas incluem legendas e materiais extras de prática com gabarito, garantindo clareza e autonomia nos estudos.'
		},
		{
			icon: <Users className="w-12 h-12 text-[#E91E63]" />,
			title: 'Aulas ao vivo',
			description: 'a prática em tempo real é essencial. Seja em grupos dinâmicos ou em aulas particulares, você exercita suas habilidades, recebe feedback imediato e mantém a motivação para avançar com segurança.'
		},
		{
			icon: <BookOpen className="w-12 h-12 text-[#E91E63]" />,
			title: 'Sala de aula virtual',
			description: 'nossa plataforma organiza tudo em um só lugar — materiais, lições, recursos adicionais e atividades gamificadas. Além disso, você interage com uma comunidade de alunos que compartilham a mesma jornada de aprendizado.'
		}
	];

	return (
		<section className="section bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
						Como você aprende com a So Fluent
					</h2>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{methods.map((method, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1 }}
							className="card p-8"
						>
							<div className="mb-6">
								{method.icon}
							</div>
							<h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">
								{method.title}
							</h3>
							<p className="text-[#666666] leading-relaxed">
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
