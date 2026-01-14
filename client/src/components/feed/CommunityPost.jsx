import React, { useState, useContext } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppContext } from '../../context/AppContext';

const CommunityPost = ({ post }) => {
	const { backendUrl, getToken } = useContext(AppContext);
	const [liked, setLiked] = useState(post?.liked || false);
	const [likes, setLikes] = useState(post?.likes || 0);

	const handleLike = async () => {
		if (!post?.id) return;
		
		try {
			const token = await getToken();
			if (token) {
				const response = await fetch(`${backendUrl}/api/social/posts/${post.id}/like`, {
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${token}`
					}
				});
				
				if (response.ok) {
					const data = await response.json();
					if (data.success) {
						setLiked(data.liked);
						setLikes(data.likes);
					}
				}
			}
		} catch (error) {
			// Error handled by useErrorHandler hook
		}
	};

	// Use provided post or fallback
	const postData = post || {
		author: 'Juliana Costa',
		authorImage: null,
		timestamp: '3h ago',
		image: null,
		description: "Just had my first English conversation with a tourist! 🇧🇷🇺🇸 So Fluent is changing my life!",
		comments: 34,
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] rounded-xl border border-white/10 overflow-hidden mb-6"
		>
			{/* Header */}
			<div className="flex items-center justify-between p-4">
				<div className="flex items-center gap-3">
					{postData.authorImage ? (
						<img
							src={postData.authorImage}
							alt={postData.author}
							className="w-10 h-10 rounded-full object-cover"
						/>
					) : (
						<div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E91E63] to-[#D4AF37] flex items-center justify-center text-white font-bold">
							{postData.author?.charAt(0) || 'S'}
						</div>
					)}
					<div>
						<p className="font-semibold text-white">{postData.author}</p>
						<p className="text-xs text-gray-400">{postData.timestamp}</p>
					</div>
				</div>
			</div>

			{/* Image */}
			{postData.image && (
				<div className="aspect-square bg-white/5">
					<img
						src={postData.image}
						alt="Community post"
						className="w-full h-full object-cover"
					/>
				</div>
			)}

			{/* Text Content */}
			{postData.description && (
				<div className="px-4 pt-4">
					<p className="text-white">{postData.description}</p>
				</div>
			)}

			{/* Actions */}
			<div className="p-4">
				<div className="flex items-center gap-4 mb-2">
					<button
						onClick={handleLike}
						className={`p-2 rounded-full transition-colors ${
							liked ? 'text-[#E91E63]' : 'text-gray-400 hover:text-[#E91E63]'
						}`}
					>
						<Heart className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
					</button>
					<button className="p-2 rounded-full text-gray-400 hover:text-[#E91E63] transition-colors">
						<MessageCircle className="w-6 h-6" />
					</button>
					<button className="p-2 rounded-full text-gray-400 hover:text-[#E91E63] transition-colors">
						<Share2 className="w-6 h-6" />
					</button>
				</div>

				<p className="font-semibold text-white mb-2">{likes} {likes === 1 ? 'like' : 'likes'}</p>

				{postData.comments > 0 && (
					<button className="text-gray-400 text-sm hover:text-white transition-colors">
						View all {postData.comments} comments
					</button>
				)}
			</div>
		</motion.div>
	);
};

export default CommunityPost;
