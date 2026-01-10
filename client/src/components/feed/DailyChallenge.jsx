import React, { useState } from 'react';
import { Mic, SkipForward, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

const DailyChallenge = () => {
	const [recording, setRecording] = useState(false);
	const [completed, setCompleted] = useState(false);

	const challenge = {
		title: "Daily Challenge",
		phrase: "I'm working out to feel confident and strong.",
		completedCount: 18,
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-gradient-to-br from-[#E91E63] to-[#00BCD4] rounded-xl p-6 text-white"
		>
			<div className="flex items-center gap-2 mb-4">
				<Flame className="w-5 h-5" />
				<h3 className="font-bold text-lg">{challenge.title}</h3>
			</div>

			<p className="text-white/90 mb-6">
				Record yourself saying:
			</p>

			<div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-6">
				<p className="text-xl font-semibold text-center">
					"{challenge.phrase}"
				</p>
			</div>

			<div className="flex items-center gap-3 mb-4">
				<button
					onClick={() => {
						setRecording(!recording);
						if (recording) setCompleted(true);
					}}
					className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${
						completed
							? 'bg-green-500 hover:bg-green-600'
							: recording
							? 'bg-red-500 hover:bg-red-600'
							: 'bg-white text-[#E91E63] hover:bg-white/90'
					}`}
				>
					<Mic className="w-5 h-5" />
					{completed ? 'Completed!' : recording ? 'Stop Recording' : 'Record Audio'}
				</button>
				<button className="p-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
					<SkipForward className="w-5 h-5" />
				</button>
			</div>

			<p className="text-white/80 text-sm text-center">
				🔥 {challenge.completedCount} students completed today!
			</p>
		</motion.div>
	);
};

export default DailyChallenge;
