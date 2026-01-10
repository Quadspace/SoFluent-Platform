import React from 'react';
import { motion } from 'framer-motion';

const MetricCard = ({ title, value, subtitle, icon, color = 'sofluent-pink', trend }) => {
	const colorClasses = {
		'sofluent-pink': 'bg-[#E91E63]/10 text-[#E91E63] border-[#E91E63]/20',
		'sofluent-accent': 'bg-[#00BCD4]/10 text-[#00BCD4] border-[#00BCD4]/20',
		'green': 'bg-green-100 text-green-600 border-green-200',
		'blue': 'bg-blue-100 text-blue-600 border-blue-200',
		'yellow': 'bg-yellow-100 text-yellow-600 border-yellow-200',
		'purple': 'bg-purple-100 text-purple-600 border-purple-200'
	};

	const cardClass = colorClasses[color] || colorClasses['sofluent-pink'];

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className={`rounded-xl p-6 border-2 ${cardClass} shadow-md hover:shadow-lg transition-shadow`}
		>
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<p className="text-sm font-medium opacity-80 mb-1">{title}</p>
					<p className="text-3xl font-bold mb-1">{value}</p>
					{subtitle && (
						<p className="text-xs opacity-70">{subtitle}</p>
					)}
					{trend && (
						<div className="flex items-center gap-1 mt-2">
							<span className={`text-xs font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
								{trend.positive ? '↑' : '↓'} {trend.value}
							</span>
							<span className="text-xs opacity-70">vs last month</span>
						</div>
					)}
				</div>
				{icon && (
					<div className={`p-3 rounded-lg ${cardClass.split(' ')[0]} opacity-20`}>
						{icon}
					</div>
				)}
			</div>
		</motion.div>
	);
};

export default MetricCard;
