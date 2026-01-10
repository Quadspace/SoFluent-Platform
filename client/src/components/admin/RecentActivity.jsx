import React from 'react';
import { CheckCircle, DollarSign, MessageSquare, Star, UserPlus, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const RecentActivity = ({ activities = [] }) => {
	// Mock data if no activities provided
	const mockActivities = [
		{
			id: 1,
			type: 'completion',
			message: 'Ana Silva completed "Business Presentation" course',
			time: '2 hours ago',
			icon: <CheckCircle className="w-5 h-5 text-green-500" />,
			color: 'text-green-600'
		},
		{
			id: 2,
			type: 'payment',
			message: 'Carlos Mendes upgraded to VIP (R$997/mo)',
			time: '5 hours ago',
			icon: <DollarSign className="w-5 h-5 text-yellow-500" />,
			color: 'text-yellow-600'
		},
		{
			id: 3,
			type: 'homework',
			message: 'Juliana Costa submitted homework (needs review)',
			time: '1 day ago',
			icon: <AlertCircle className="w-5 h-5 text-blue-500" />,
			color: 'text-blue-600'
		},
		{
			id: 4,
			type: 'review',
			message: 'Pedro Santos left 5-star review',
			time: '2 days ago',
			icon: <Star className="w-5 h-5 text-purple-500" />,
			color: 'text-purple-600'
		},
		{
			id: 5,
			type: 'message',
			message: 'Maria Oliveira sent you a message',
			time: '2 days ago',
			icon: <MessageSquare className="w-5 h-5 text-[#E91E63]" />,
			color: 'text-[#E91E63]'
		},
		{
			id: 6,
			type: 'signup',
			message: 'João Lima joined Fluency Fit Academy',
			time: '3 days ago',
			icon: <UserPlus className="w-5 h-5 text-[#00BCD4]" />,
			color: 'text-[#00BCD4]'
		}
	];

	const displayActivities = activities.length > 0 ? activities : mockActivities;

	const getActivityEmoji = (type) => {
		const emojis = {
			completion: '🎉',
			payment: '💳',
			homework: '📝',
			review: '⭐',
			message: '💬',
			signup: '👋'
		};
		return emojis[type] || '📌';
	};

	return (
		<div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
			<h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Recent Activity</h3>
			
			<div className="space-y-3 max-h-96 overflow-y-auto">
				{displayActivities.map((activity, index) => (
					<motion.div
						key={activity.id || index}
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: index * 0.05 }}
						className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
					>
						<div className="flex-shrink-0 mt-1">
							{activity.icon}
						</div>
						<div className="flex-1 min-w-0">
							<p className={`text-sm font-medium ${activity.color || 'text-gray-700'}`}>
								<span className="mr-2">{getActivityEmoji(activity.type)}</span>
								{activity.message}
							</p>
							<p className="text-xs text-gray-500 mt-1">{activity.time}</p>
						</div>
					</motion.div>
				))}
			</div>
			
			{displayActivities.length === 0 && (
				<div className="text-center py-8 text-gray-500">
					<MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
					<p>No recent activity</p>
				</div>
			)}
		</div>
	);
};

export default RecentActivity;
