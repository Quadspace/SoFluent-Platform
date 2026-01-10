import React from "react";
import { assets } from "../../assets/assets";
import { getFeaturedTestimonials } from "../../data/testimonials";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const TestimonialsSection = () => {
	const { t } = useTranslation();
	const testimonials = getFeaturedTestimonials();

	return (
		<div className="pb-14 px-8 md:px-0">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6 }}
			>
				<h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
					{t('testimonials.title', 'Success Stories')}
				</h2>
				<p className="md:text-base text-gray-500 mt-3 max-w-2xl">
					{t('testimonials.subtitle', 'Hear from our learners as they share their journeys of transformation, success, and how our platform has made a difference in their lives.')}
				</p>
			</motion.div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">
				{testimonials.map((testimonial, index) => (
					<motion.div
						key={testimonial.id}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: index * 0.1 }}
						className="text-sm text-left border border-gray-200 pb-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
					>
						<div className="flex items-center gap-4 px-5 py-4 bg-gradient-to-r from-[#E91E63]/10 to-[#00BCD4]/10">
							<div className="relative">
								<img 
									className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md" 
									src={testimonial.image} 
									alt={testimonial.name}
									onError={(e) => {
										e.target.src = '/placeholder-headshot.png';
									}}
								/>
								<div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
							</div>
							<div className="flex-1">
								<h1 className="text-lg font-semibold text-gray-800">{testimonial.name}</h1>
								<p className="text-sm text-gray-600">{testimonial.role}</p>
								{testimonial.location && (
									<p className="text-xs text-gray-500">{testimonial.location}</p>
								)}
							</div>
						</div>
						<div className="p-5 pb-7">
							<div className="flex gap-0.5 mb-4">
								{[...Array(5)].map((_, i) => (
									<img 
										className="h-5 w-5" 
										key={i} 
										src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank} 
										alt="star" 
									/>
								))}
								<span className="ml-2 text-sm text-gray-600 font-medium">{testimonial.rating}</span>
							</div>
							<p className="text-gray-700 leading-relaxed">{testimonial.feedback}</p>
						</div>
						<div className="px-5">
							<button className="text-[#E91E63] hover:text-pink-600 font-medium text-sm transition-colors">
								{t('testimonials.readMore', 'Read full story')} →
							</button>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
};

export default TestimonialsSection;
