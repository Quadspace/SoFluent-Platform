import React, { useState } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

const CommunityPost = () => {
	const [liked, setLiked] = useState(false);
	const [likes, setLikes] = useState(567);

	const handleLike = () => {
		setLiked(!liked);
		setLikes(liked ? likes - 1 : likes + 1);
	};

	const post = {
		author: 'Juliana Costa',
		avatar: '/placeholder-avatar.png',
		timeAgo: '3h ago',
		image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
		text: "Just had my first English conversation with a tourist! 🇧🇷🇺🇸 So Fluent is changing my life!",
		comments: 34,
		shares: 89,
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
						src={post.avatar}
						alt={post.author}
						className="w-10 h-10 rounded-full object-cover"
						onError={(e) => {
							e.target.src = 'https://ui-avatars.com/api/?name=' + post.author + '&background=E91E63&color=fff';
						}}
					/>
					<div>
						<p className="font-semibold text-[#1A1A1A]">{post.author}</p>
						<p className="text-xs text-gray-500">{post.timeAgo}</p>
					</div>
				</div>
			</div>

			{/* Image */}
			<div className="aspect-square bg-gray-100">
				<img
					src={post.image}
					alt="Community post"
					className="w-full h-full object-cover"
				/>
			</div>

			{/* Actions */}
			<div className="p-4">
				<div className="flex items-center gap-4 mb-2">
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

				<p className="font-semibold text-[#1A1A1A] mb-2">{likes} likes</p>

				<div className="mb-2">
					<span className="font-semibold text-[#1A1A1A]">{post.author} </span>
					<span className="text-[#1A1A1A]">{post.text}</span>
				</div>

				<button className="text-gray-500 text-sm">
					View all {post.comments} comments
				</button>
			</div>
		</motion.div>
	);
};

export default CommunityPost;
