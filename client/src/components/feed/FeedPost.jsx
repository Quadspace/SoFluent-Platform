import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const FeedPost = ({ type = 'lesson' }) => {
	const [liked, setLiked] = useState(false);
	const [saved, setSaved] = useState(false);
	const [likes, setLikes] = useState(234);

	const handleLike = () => {
		setLiked(!liked);
		setLikes(liked ? likes - 1 : likes + 1);
	};

	// Mock data - will be replaced with real data
	const postData = {
		author: 'Heloisa Lott',
		avatar: '/placeholder-avatar.png',
		timeAgo: '2h ago',
		title: '3 English Phrases for the Gym',
		videoUrl: 'https://example.com/video.mp4',
		videoThumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
		description: 'Learn these essential phrases to use at the gym!',
		comments: 12,
		shares: 45,
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-white rounded-xl border border-gray-200 overflow-hidden"
		>
			{/* Header */}
			<div className="flex items-center justify-between p-4">
				<div className="flex items-center gap-3">
					<img
						src={postData.avatar}
						alt={postData.author}
						className="w-10 h-10 rounded-full object-cover"
						onError={(e) => {
							e.target.src = 'https://ui-avatars.com/api/?name=' + postData.author + '&background=E91E63&color=fff';
						}}
					/>
					<div>
						<p className="font-semibold text-[#1A1A1A]">{postData.author}</p>
						<p className="text-xs text-gray-500">{postData.timeAgo}</p>
					</div>
				</div>
				<button className="p-2 hover:bg-gray-100 rounded-full">
					<MoreHorizontal className="w-5 h-5 text-gray-500" />
				</button>
			</div>

			{/* Video/Image */}
			<div className="relative aspect-video bg-gray-100">
				<img
					src={postData.videoThumbnail}
					alt={postData.title}
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 flex items-center justify-center bg-black/20">
					<button className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
						<div className="w-0 h-0 border-l-[20px] border-l-[#E91E63] border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1" />
					</button>
				</div>
			</div>

			{/* Actions */}
			<div className="p-4">
				<div className="flex items-center justify-between mb-2">
					<div className="flex items-center gap-4">
						<button
							onClick={handleLike}
							className={`p-2 rounded-full transition-colors ${
								liked ? 'text-[#E91E63]' : 'text-gray-500 hover:text-[#E91E63]'
							}`}
						>
							<Heart className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
						</button>
						<button className="p-2 rounded-full text-gray-500 hover:text-[#00BCD4] transition-colors">
							<MessageCircle className="w-6 h-6" />
						</button>
						<button className="p-2 rounded-full text-gray-500 hover:text-[#00BCD4] transition-colors">
							<Share2 className="w-6 h-6" />
						</button>
					</div>
					<button
						onClick={() => setSaved(!saved)}
						className={`p-2 rounded-full transition-colors ${
							saved ? 'text-[#E91E63]' : 'text-gray-500 hover:text-[#E91E63]'
						}`}
					>
						<Bookmark className={`w-6 h-6 ${saved ? 'fill-current' : ''}`} />
					</button>
				</div>

				{/* Likes */}
				<p className="font-semibold text-[#1A1A1A] mb-2">{likes} likes</p>

				{/* Description */}
				<div className="mb-2">
					<span className="font-semibold text-[#1A1A1A]">{postData.author} </span>
					<span className="text-[#1A1A1A]">{postData.description}</span>
				</div>

				{/* Comments */}
				<button className="text-gray-500 text-sm mb-2">
					View all {postData.comments} comments
				</button>

				{/* Add Comment */}
				<div className="flex items-center gap-2 pt-2 border-t border-gray-100">
					<input
						type="text"
						placeholder="Add a comment..."
						className="flex-1 text-sm outline-none text-[#1A1A1A] placeholder-gray-400"
					/>
					<button className="text-[#E91E63] font-semibold text-sm">Post</button>
				</div>
			</div>
		</motion.div>
	);
};

export default FeedPost;
