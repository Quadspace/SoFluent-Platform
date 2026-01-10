import React from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Signature from "../Signature";

const CallToAction = () => {
	const { t } = useTranslation();
	return (
		<div className="flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0">
			<h1 className="text-xl md:text-4xl text-gray-800 font-semibold">
				{t('messaging.tagline')}
			</h1>
			<p className="text-gray-500 sm:text-sm">
				{t('messaging.effectiveness')}
			</p>
			<div className="flex flex-col sm:flex-row items-center font-medium gap-6 mt-4">
				<Link to="/fluency-fit">
					<button className="px-10 py-3 rounded-md text-white bg-[#E91E63] hover:bg-pink-600 transition-colors">
						{t('fluencyFit.cta')}
					</button>
				</Link>
				<Link to="/about">
					<button className="flex items-center gap-2 text-gray-700 hover:text-[#E91E63] transition-colors">
						{t('common.learnMore', 'Learn more')} <img src={assets.arrow_icon} alt="arrow_icon" />
					</button>
				</Link>
			</div>
			<div className="w-full flex justify-end">
				<Signature />
			</div>
		</div>
	);
};

export default CallToAction;
