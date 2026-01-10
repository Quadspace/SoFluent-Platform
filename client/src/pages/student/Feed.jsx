import React, { useState, useEffect } from 'react';
import { useUserSafe } from '../../hooks/useClerkSafe.jsx';
import StoriesBar from '../../components/feed/StoriesBar';
import FeedPost from '../../components/feed/FeedPost';
import DailyChallenge from '../../components/feed/DailyChallenge';
import CommunityPost from '../../components/feed/CommunityPost';
import { Bell, MessageCircle, User } from 'lucide-react';

const Feed = () => {
	const { user } = useUserSafe();
	const [feedItems, setFeedItems] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Simulate loading personalized feed
		setTimeout(() => {
			setFeedItems([
				{ type: 'lesson', id: 1 },
				{ type: 'challenge', id: 2 },
				{ type: 'community', id: 3 },
				{ type: 'lesson', id: 4 },
			]);
			setLoading(false);
		}, 1000);
	}, []);

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Top Bar */}
			<div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
				<div className="max-w-2xl mx-auto flex items-center justify-between">
					<h1 className="text-xl font-bold text-[#1A1A1A]">So Fluent</h1>
					<div className="flex items-center gap-4">
						<Bell className="w-6 h-6 text-[#1A1A1A]" />
						<MessageCircle className="w-6 h-6 text-[#1A1A1A]" />
						<User className="w-6 h-6 text-[#1A1A1A]" />
					</div>
				</div>
			</div>

			{/* Main Feed */}
			<div className="max-w-2xl mx-auto px-4 py-6">
				{/* Stories Bar */}
				<StoriesBar />

				{/* Feed Items */}
				<div className="mt-6 space-y-6">
					{loading ? (
						<div className="flex justify-center py-20">
							<div className="w-12 h-12 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin" />
						</div>
					) : (
						feedItems.map((item) => {
							if (item.type === 'challenge') {
								return <DailyChallenge key={item.id} />;
							}
							if (item.type === 'community') {
								return <CommunityPost key={item.id} />;
							}
							return <FeedPost key={item.id} type={item.type} />;
						})
					)}
				</div>
			</div>

			{/* Bottom Navigation */}
			<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
				<div className="max-w-2xl mx-auto flex items-center justify-around py-3">
					<button className="flex flex-col items-center gap-1">
						<div className="w-6 h-6 bg-[#E91E63] rounded"></div>
						<span className="text-xs text-[#E91E63]">Home</span>
					</button>
					<button className="flex flex-col items-center gap-1">
						<div className="w-6 h-6 bg-gray-400 rounded"></div>
						<span className="text-xs text-gray-500">Explore</span>
					</button>
					<button className="flex flex-col items-center gap-1">
						<div className="w-6 h-6 bg-gray-400 rounded"></div>
						<span className="text-xs text-gray-500">Create</span>
					</button>
					<button className="flex flex-col items-center gap-1">
						<div className="w-6 h-6 bg-gray-400 rounded"></div>
						<span className="text-xs text-gray-500">Chat</span>
					</button>
					<button className="flex flex-col items-center gap-1">
						<div className="w-6 h-6 bg-gray-400 rounded-full"></div>
						<span className="text-xs text-gray-500">Profile</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default Feed;
