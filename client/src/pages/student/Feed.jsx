import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserSafe } from '../../hooks/useClerkSafe.jsx';
import { AppContext } from '../../context/AppContext';
import StoriesBar from '../../components/feed/StoriesBar';
import EnhancedFeedPost from '../../components/feed/EnhancedFeedPost';
import DailyChallenge from '../../components/feed/DailyChallenge';
import CommunityPost from '../../components/feed/CommunityPost';
import CreatePostModal from '../../components/social/CreatePostModal';
import LiveActivityFeed from '../../components/feed/LiveActivityFeed';
import { Bell, MessageCircle, User, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import StandardPage from '../../utils/pageConsistency';
import BrandButton from '../../components/common/BrandButton';
import BrandText from '../../components/common/BrandText';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const Feed = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { user } = useUserSafe();
	const { backendUrl, getToken } = useContext(AppContext);
	const [feedItems, setFeedItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showCreatePost, setShowCreatePost] = useState(false);

	useEffect(() => {
		fetchPersonalizedFeed();
	}, []);

	const fetchPersonalizedFeed = async () => {
		try {
			const token = await getToken();
			
			if (token) {
				// Fetch both personalized feed and social feed
				const [personalizedRes, socialRes] = await Promise.all([
					fetch(`${backendUrl}/api/feed/personalized`, {
						headers: { 'Authorization': `Bearer ${token}` }
					}),
					fetch(`${backendUrl}/api/social/feed`, {
						headers: { 'Authorization': `Bearer ${token}` }
					})
				]);

				const feedItems = [];
				
				if (personalizedRes.ok) {
					const data = await personalizedRes.json();
					if (data.success && data.feed) {
						feedItems.push(...data.feed);
					}
				}

				if (socialRes.ok) {
					const data = await socialRes.json();
					if (data.success && data.posts) {
						// Convert social posts to feed format
						const socialFeedItems = data.posts.map(post => ({
							id: post._id,
							type: 'community',
							title: post.content?.text?.substring(0, 50) || 'Student Post',
							description: post.content?.text || '',
							image: post.content?.imageUrl,
							audioUrl: post.content?.audioUrl,
							videoUrl: post.content?.videoUrl,
							author: post.user?.name || 'Student',
							authorImage: post.user?.imageUrl,
							timestamp: new Date(post.createdAt).toLocaleDateString(),
							likes: post.likes?.length || 0,
							comments: post.comments?.length || 0,
							liked: post.liked || false,
							featured: post.featured || false,
							postType: post.type
						}));
						feedItems.push(...socialFeedItems);
					}
				}

				if (feedItems.length > 0) {
					setFeedItems(feedItems);
				} else {
					setFeedItems(generateMockFeed());
				}
			} else {
				setFeedItems(generateMockFeed());
			}
		} catch (error) {
			// Fallback to mock feed on error
			setFeedItems(generateMockFeed());
		} finally {
			setLoading(false);
		}
	};

	const generateMockFeed = () => {
		return [
			{
				id: 'challenge-1',
				type: 'challenge',
				title: "Today's Challenge",
				description: "Record yourself saying:",
				phrase: "I'm working out to feel confident and strong.",
				completed: false,
				completedCount: 18,
				timestamp: 'Today',
				author: 'So Fluent'
			},
			{
				id: 'lesson-1',
				type: 'lesson',
				title: 'Advanced Negotiation Tactics',
				description: 'Perfect for your career goals',
				duration: '12 min',
				level: 'Advanced',
				timestamp: '2h ago',
				author: 'So Fluent',
				likes: 234,
				comments: 12
			},
			{
				id: 'community-1',
				type: 'community',
				title: 'Student Win!',
				description: 'I just gave my first presentation in English at work! 🎉',
				author: 'Ana Silva',
				timestamp: '3h ago',
				likes: 456,
				comments: 23
			}
		];
	};

	return (
		<StandardPage
			showNavbar={false}
			showFooter={false}
			seoTitle="Feed - So Fluent"
			seoDescription="Your personalized English learning feed"
			background="bg-gradient-to-br from-sofluent-dark via-sofluent-black to-sofluent-dark"
		>
			<div className="min-h-screen">
				{/* Top Bar */}
				<div className="sticky top-0 z-50 bg-sofluent-black/80 backdrop-blur-xl border-b border-white/10 px-4 py-3">
					<div className="max-w-2xl mx-auto flex items-center justify-between">
						<BrandText as="h1" size="xl" color="white" weight="bold">So Fluent</BrandText>
						<div className="flex items-center gap-4">
							<BrandButton
								variant="primary"
								size="small"
								onClick={() => setShowCreatePost(true)}
								className="flex items-center gap-2"
							>
								<Plus className="w-4 h-4" />
								<span>{t('social.createPost')}</span>
							</BrandButton>
						<Bell className="w-6 h-6 text-white/80 hover:text-white cursor-pointer transition-colors" />
						<MessageCircle className="w-6 h-6 text-white/80 hover:text-white cursor-pointer transition-colors" />
						<User className="w-6 h-6 text-white/80 hover:text-white cursor-pointer transition-colors" />
					</div>
				</div>
			</div>

			{/* Main Feed */}
			<div className="max-w-2xl mx-auto px-4 py-6">
			{/* Live Activity Feed */}
			<div className="mb-6">
				<LiveActivityFeed maxItems={3} />
			</div>

			{/* Stories Bar */}
			<StoriesBar />

				{/* Feed Items */}
				<div className="mt-6 space-y-6">
					{loading ? (
						<div className="flex justify-center py-20">
							<SkeletonLoader type="list" count={3} />
						</div>
					) : (
						feedItems.map((item) => {
							if (item.type === 'challenge') {
								return <DailyChallenge key={item.id} challenge={item} />;
							}
							if (item.type === 'community') {
								return <CommunityPost key={item.id} post={item} />;
							}
							// Lesson/recommendation posts
							return (
								<EnhancedFeedPost
									key={item.id}
									post={item}
									onLike={async (id, liked) => {
										try {
											const token = await getToken();
											if (token && id) {
												const response = await fetch(`${backendUrl}/api/social/posts/${id}/like`, {
													method: 'POST',
													headers: {
														'Authorization': `Bearer ${token}`
													}
												});
												if (response.ok) {
													const data = await response.json();
													if (data.success) {
														// Update local state
														setFeedItems(prev => prev.map(p => 
															p.id === id ? { ...p, liked: data.liked, likes: data.likes } : p
														));
													}
												}
											}
										} catch (error) {
											// Handle like error silently
										}
									}}
									onComment={async (id) => {
										// Open comment modal or navigate to post detail
										navigate(`/feed/post/${id}`);
									}}
									onShare={(id) => {
										// Share functionality
										if (navigator.share) {
											navigator.share({
												title: 'So Fluent Post',
												text: 'Check out this post on So Fluent!',
												url: `${window.location.origin}/feed/${id}`
											});
										}
									}}
									onSave={async (id, saved) => {
										// Save functionality - implement save/unsave
										try {
											const token = await getToken();
											if (token) {
												await fetch(`${backendUrl}/api/social/save/${id}`, {
													method: saved ? 'DELETE' : 'POST',
													headers: { 'Authorization': `Bearer ${token}` }
												});
											}
										} catch (error) {
											// Handle save error silently
										}
									}}
								/>
							);
						})
					)}
				</div>
			</div>

			{/* Create Post Modal */}
			{showCreatePost && (
				<CreatePostModal
					onClose={() => setShowCreatePost(false)}
					onPostCreated={() => {
						fetchPersonalizedFeed();
						setShowCreatePost(false);
					}}
				/>
			)}

			{/* Bottom Navigation */}
			<div className="fixed bottom-0 left-0 right-0 bg-sofluent-black/80 backdrop-blur-xl border-t border-white/10">
				<div className="max-w-2xl mx-auto flex items-center justify-around py-3">
					<button className="flex flex-col items-center gap-1">
						<div className="w-6 h-6 bg-sofluent-cherry rounded"></div>
						<BrandText size="xs" color="cherry" weight="semibold">Home</BrandText>
					</button>
					<button className="flex flex-col items-center gap-1">
						<div className="w-6 h-6 bg-white/20 rounded"></div>
						<span className="text-xs text-white/60">Explore</span>
					</button>
					<button className="flex flex-col items-center gap-1">
						<div className="w-6 h-6 bg-white/20 rounded"></div>
						<span className="text-xs text-white/60">Create</span>
					</button>
					<button className="flex flex-col items-center gap-1">
						<div className="w-6 h-6 bg-white/20 rounded"></div>
						<span className="text-xs text-white/60">Chat</span>
					</button>
					<button className="flex flex-col items-center gap-1">
						<div className="w-6 h-6 bg-white/20 rounded-full"></div>
						<span className="text-xs text-white/60">Profile</span>
					</button>
				</div>
			</div>
			</div>
		</StandardPage>
	);
};

export default Feed;
