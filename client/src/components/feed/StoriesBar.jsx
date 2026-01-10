import React from 'react';
import { motion } from 'framer-motion';

const StoriesBar = () => {
	const stories = [
		{ id: 1, name: 'Heloisa', avatar: '/placeholder-avatar.png', hasNew: true, type: 'educator' },
		{ id: 2, name: 'Business', avatar: '/placeholder-avatar.png', hasNew: true, type: 'category' },
		{ id: 3, name: 'Daily', avatar: '/placeholder-avatar.png', hasNew: false, type: 'challenge' },
		{ id: 4, name: 'Grammar', avatar: '/placeholder-avatar.png', hasNew: false, type: 'category' },
		{ id: 5, name: 'Fitness', avatar: '/placeholder-avatar.png', hasNew: false, type: 'category' },
	];

	return (
		<div className="bg-white rounded-xl p-4 border border-gray-200 overflow-x-auto">
			<div className="flex gap-4">
				{stories.map((story, index) => (
					<motion.div
						key={story.id}
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: index * 0.1 }}
						className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0"
					>
						<div className={`relative w-16 h-16 rounded-full p-0.5 ${
							story.hasNew ? 'bg-gradient-to-r from-[#E91E63] to-[#00BCD4]' : 'bg-gray-300'
						}`}>
							<div className="w-full h-full rounded-full bg-white p-0.5">
								<img
									src={story.avatar}
									alt={story.name}
									className="w-full h-full rounded-full object-cover"
									onError={(e) => {
										e.target.src = 'https://ui-avatars.com/api/?name=' + story.name + '&background=E91E63&color=fff';
									}}
								/>
							</div>
						</div>
						<span className="text-xs text-[#1A1A1A] max-w-[60px] truncate">{story.name}</span>
					</motion.div>
				))}
			</div>
		</div>
	);
};

export default StoriesBar;
