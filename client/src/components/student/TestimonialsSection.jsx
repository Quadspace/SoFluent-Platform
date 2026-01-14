import React from "react";
import { getFeaturedTestimonials } from "../../data/testimonials";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Quote, Star, CheckCircle2 } from "lucide-react";

const TestimonialsSection = () => {
	const { t } = useTranslation();
	const testimonials = getFeaturedTestimonials();

	return (
		<section className="relative py-32 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Beautiful Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="text-center mb-20"
				>
					<h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-[#1A1A1A] mb-8 leading-tight tracking-tight" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
						{t('testimonials.title', 'Success Stories')}
					</h2>
					<p className="text-2xl md:text-3xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
						{t('testimonials.subtitle', 'Hear from our learners as they share their journeys of transformation, success, and how our platform has made a difference in their lives.')}
					</p>
				</motion.div>

				{/* Beautiful Testimonials Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{testimonials.map((testimonial, index) => (
						<motion.div
							key={testimonial.id}
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.15, duration: 0.6 }}
							className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
						>
							{/* Beautiful Quote Icon */}
							<div className="mb-8">
								<div className="w-16 h-16 bg-gradient-to-br from-[#E91E63]/10 to-[#E91E63]/5 rounded-2xl flex items-center justify-center border border-[#E91E63]/20">
									<Quote className="w-8 h-8 text-[#E91E63]" />
								</div>
							</div>

							{/* Rating */}
							<div className="flex gap-1 mb-6">
								{[...Array(5)].map((_, i) => (
									<Star 
										key={i}
										className={`w-6 h-6 ${i < Math.floor(testimonial.rating) ? 'fill-[#D4AF37] text-[#D4AF37]' : 'fill-gray-200 text-gray-200'}`}
									/>
								))}
								<span className="ml-3 text-lg font-bold text-[#1A1A1A]">{testimonial.rating}</span>
							</div>

							{/* Testimonial Text */}
							<p className="text-gray-700 leading-relaxed mb-10 text-lg font-light">
								"{testimonial.feedback}"
							</p>

							{/* Beautiful Author */}
							<div className="flex items-center gap-4 pt-8 border-t border-gray-100">
								<div className="relative">
									<img 
										className="w-16 h-16 rounded-full object-cover border-2 border-[#E91E63]/30 shadow-lg ring-2 ring-[#E91E63]/10" 
										src={testimonial.image} 
										alt={testimonial.name}
										onError={(e) => {
											e.target.src = '/placeholder-headshot.png';
										}}
									/>
									<div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
										<CheckCircle2 className="w-3 h-3 text-white" />
									</div>
								</div>
								<div className="flex-1">
									<h4 className="text-xl font-black text-[#1A1A1A] mb-1" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>{testimonial.name}</h4>
									<p className="text-sm text-[#D4AF37] font-bold uppercase tracking-wide">{testimonial.role}</p>
									{testimonial.location && (
										<p className="text-xs text-gray-500 mt-1 font-medium">{testimonial.location}</p>
									)}
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default TestimonialsSection;
