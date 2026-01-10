import React, { useState } from 'react';
import { Instagram, Lock, X } from 'lucide-react';
import { motion } from 'framer-motion';

const InstagramConnect = ({ onConnect, onSkip }) => {
	const [showPrivacy, setShowPrivacy] = useState(false);

	const handleConnect = () => {
		// Redirect to Instagram OAuth
		const clientId = import.meta.env.VITE_INSTAGRAM_CLIENT_ID;
		const redirectUri = `${window.location.origin}/auth/instagram/callback`;
		const scope = 'user_profile,user_media';
		const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;

		window.location.href = authUrl;
	};

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto border border-gray-200"
		>
			<div className="text-center mb-6">
				<div className="w-20 h-20 bg-gradient-to-br from-[#E91E63] to-[#00BCD4] rounded-full flex items-center justify-center mx-auto mb-4">
					<Instagram className="w-10 h-10 text-white" />
				</div>
				<h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Connect Your Instagram</h2>
				<p className="text-[#666666]">
					We'll create personalized English lessons based on your photos, captions, and interests!
				</p>
			</div>

			<div className="bg-gray-50 rounded-lg p-4 mb-6">
				<p className="text-sm font-semibold text-[#1A1A1A] mb-2">We'll use:</p>
				<ul className="text-sm text-[#666666] space-y-1">
					<li>• Your photos and captions</li>
					<li>• Your interests and hobbies</li>
					<li>• Places you visit</li>
					<li>• Content you engage with</li>
				</ul>
			</div>

			<div className="flex items-center gap-2 mb-6 text-sm text-[#666666]">
				<Lock className="w-4 h-4" />
				<span>Your data is private and secure. We never post without your permission.</span>
			</div>

			<div className="space-y-3">
				<button
					onClick={handleConnect}
					className="w-full bg-gradient-to-r from-[#E91E63] to-[#00BCD4] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
				>
					<Instagram className="w-5 h-5" />
					Connect Instagram
				</button>
				<button
					onClick={onSkip}
					className="w-full bg-gray-100 text-[#666666] py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
				>
					Skip for Now
				</button>
			</div>

			<p className="text-center text-xs text-[#666666] mt-4">
				💡 Students who connect Instagram learn 3x faster!
			</p>

			{showPrivacy && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="bg-white rounded-xl p-6 max-w-lg max-h-[80vh] overflow-y-auto"
					>
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-xl font-bold text-[#1A1A1A]">Privacy & Security</h3>
							<button
								onClick={() => setShowPrivacy(false)}
								className="p-2 hover:bg-gray-100 rounded-full"
							>
								<X className="w-5 h-5" />
							</button>
						</div>
						<div className="space-y-4 text-sm text-[#666666]">
							<div>
								<p className="font-semibold text-[#1A1A1A] mb-2">✅ What We Access:</p>
								<ul className="space-y-1 ml-4">
									<li>• Your last 50 Instagram photos</li>
									<li>• Your captions and hashtags</li>
									<li>• Accounts you follow (public only)</li>
									<li>• Locations you tag</li>
								</ul>
							</div>
							<div>
								<p className="font-semibold text-[#1A1A1A] mb-2">❌ What We Never Do:</p>
								<ul className="space-y-1 ml-4">
									<li>• Post to your Instagram</li>
									<li>• Share your data with others</li>
									<li>• Sell your information</li>
									<li>• Access your DMs or private messages</li>
								</ul>
							</div>
							<div>
								<p className="font-semibold text-[#1A1A1A] mb-2">🔒 Your Control:</p>
								<ul className="space-y-1 ml-4">
									<li>• View data we've collected</li>
									<li>• Delete specific photos from AI</li>
									<li>• Disconnect Instagram anytime</li>
									<li>• Download your data</li>
								</ul>
							</div>
						</div>
					</motion.div>
				</div>
			)}
		</motion.div>
	);
};

export default InstagramConnect;
