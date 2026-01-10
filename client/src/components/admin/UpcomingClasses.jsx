import React from 'react';
import { Calendar, Clock, Users, Play, Eye, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const UpcomingClasses = ({ classes = [] }) => {
	// Mock data if no classes provided
	const mockClasses = [
		{
			id: 1,
			title: 'Fluency Fit Beginner',
			time: '9:00 AM',
			students: 18,
			type: 'fitness',
			status: 'upcoming'
		},
		{
			id: 2,
			title: 'Business English Advanced',
			time: '2:00 PM',
			students: 12,
			type: 'business',
			status: 'upcoming'
		},
		{
			id: 3,
			title: 'Fluency Fit Intermediate',
			time: '6:00 PM',
			students: 24,
			type: 'fitness',
			status: 'upcoming'
		}
	];

	const displayClasses = classes.length > 0 ? classes : mockClasses;

	const getTypeIcon = (type) => {
		return type === 'fitness' ? '🏋️' : '💼';
	};

	const getTimeUntil = (time) => {
		// Simple time calculation - in real app, use actual datetime
		const now = new Date();
		const [hours, minutes] = time.split(':');
		const classTime = new Date();
		classTime.setHours(parseInt(hours), parseInt(minutes), 0);
		
		if (classTime < now) {
			classTime.setDate(classTime.getDate() + 1);
		}
		
		const diff = classTime - now;
		const hoursUntil = Math.floor(diff / (1000 * 60 * 60));
		const minutesUntil = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		
		if (hoursUntil > 0) {
			return `${hoursUntil}h ${minutesUntil}m`;
		}
		return `${minutesUntil}m`;
	};

	return (
		<div className="bg-white rounded-xl shadow-md p-6 border border-gray-200" data-upcoming-classes>
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold text-[#1A1A1A] flex items-center gap-2">
					<Calendar className="w-5 h-5 text-[#E91E63]" />
					Upcoming Classes (Today)
				</h3>
			</div>
			
			<div className="space-y-4">
				{displayClasses.map((classItem, index) => (
					<motion.div
						key={classItem.id || index}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
						className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
					>
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<div className="flex items-center gap-2 mb-2">
									<span className="text-xl">{getTypeIcon(classItem.type)}</span>
									<h4 className="font-semibold text-gray-800">{classItem.title}</h4>
								</div>
								
								<div className="flex items-center gap-4 text-sm text-gray-600">
									<div className="flex items-center gap-1">
										<Clock className="w-4 h-4" />
										<span>{classItem.time}</span>
									</div>
									<div className="flex items-center gap-1">
										<Users className="w-4 h-4" />
										<span>{classItem.students} students</span>
									</div>
									<div className="text-[#E91E63] font-medium">
										Starts in {getTimeUntil(classItem.time)}
									</div>
								</div>
							</div>
							
							<div className="flex gap-2">
								<button className="p-2 bg-[#E91E63] text-white rounded-lg hover:bg-[#C2185B] transition-colors">
									<Play className="w-4 h-4" />
								</button>
								<button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
									<Eye className="w-4 h-4" />
								</button>
								<button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
									<Bell className="w-4 h-4" />
								</button>
							</div>
						</div>
					</motion.div>
				))}
			</div>
			
			{displayClasses.length === 0 && (
				<div className="text-center py-8 text-gray-500">
					<Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
					<p>No classes scheduled for today</p>
				</div>
			)}
		</div>
	);
};

export default UpcomingClasses;
