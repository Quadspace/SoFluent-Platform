import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, DollarSign, MessageSquare, FileText, Users } from 'lucide-react';

const QuickActions = ({ userRole = 'assigned' }) => {
	const navigate = useNavigate();

	// Master profile has access to all actions
	// Assigned profiles have limited access
	const masterActions = [
		{
			icon: <Users className="w-5 h-5" />,
			label: 'View Students',
			action: () => navigate('/educator/student-enrolled'),
			color: 'bg-[#E91E63] hover:bg-[#C2185B]'
		},
		{
			icon: <Plus className="w-5 h-5" />,
			label: 'Create Course',
			action: () => navigate('/educator/add-course'),
			color: 'bg-[#00BCD4] hover:bg-[#0097A7]'
		},
		{
			icon: <FileText className="w-5 h-5" />,
			label: 'My Courses',
			action: () => navigate('/educator/my-courses'),
			color: 'bg-green-500 hover:bg-green-600'
		},
		{
			icon: <DollarSign className="w-5 h-5" />,
			label: 'View Revenue',
			action: () => {
				// Scroll to revenue chart
				window.scrollTo({ top: document.querySelector('[data-revenue-chart]')?.offsetTop || 0, behavior: 'smooth' });
			},
			color: 'bg-yellow-500 hover:bg-yellow-600'
		},
		{
			icon: <MessageSquare className="w-5 h-5" />,
			label: 'Student Messages',
			action: () => navigate('/educator/student-enrolled'),
			color: 'bg-blue-500 hover:bg-blue-600'
		},
		{
			icon: <Calendar className="w-5 h-5" />,
			label: 'Schedule',
			action: () => {
				// Scroll to upcoming classes
				window.scrollTo({ top: document.querySelector('[data-upcoming-classes]')?.offsetTop || 0, behavior: 'smooth' });
			},
			color: 'bg-purple-500 hover:bg-purple-600'
		}
	];

	// Assigned profiles have limited actions
	const assignedActions = [
		{
			icon: <FileText className="w-5 h-5" />,
			label: 'My Courses',
			action: () => navigate('/educator/my-courses'),
			color: 'bg-[#00BCD4] hover:bg-[#0097A7]'
		},
		{
			icon: <Users className="w-5 h-5" />,
			label: 'View Students',
			action: () => navigate('/educator/student-enrolled'),
			color: 'bg-[#E91E63] hover:bg-[#C2185B]'
		},
		{
			icon: <Calendar className="w-5 h-5" />,
			label: 'Schedule',
			action: () => {
				window.scrollTo({ top: document.querySelector('[data-upcoming-classes]')?.offsetTop || 0, behavior: 'smooth' });
			},
			color: 'bg-green-500 hover:bg-green-600'
		}
	];

	const actions = userRole === 'master' ? masterActions : assignedActions;

	return (
		<div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
			<h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Quick Actions</h3>
			<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
				{actions.map((action, index) => (
					<button
						key={index}
						onClick={action.action}
						className={`${action.color} text-white p-4 rounded-lg flex flex-col items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-sm font-medium`}
					>
						{action.icon}
						<span className="text-sm">{action.label}</span>
					</button>
				))}
			</div>
		</div>
	);
};

export default QuickActions;
