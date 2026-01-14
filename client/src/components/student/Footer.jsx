import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SocialIcons from "../SocialIcons";
import { Mail, Send, ArrowRight } from "lucide-react";
import { brandAssets } from "../../assets/branding/brand-assets";

const Footer = () => {
	const { t } = useTranslation();
	const [subscribeEmail, setSubscribeEmail] = useState("");

	const handleSubscribe = () => {
		// TODO: Replace this with your subscription API integration
		alert(`Subscribed with: ${subscribeEmail}`);
		setSubscribeEmail("");
	};

	return (
		<footer className="bg-[#1A1A1A] text-left w-full border-t border-white/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
					{/* Brand Column */}
					<div className="flex flex-col">
						<div className="mb-6">
							<img 
								src={brandAssets.logos.white} 
								alt="So Fluent Logo" 
								className="h-12 w-auto mb-6"
							/>
						</div>
						<p className="text-gray-400 mb-6 leading-relaxed text-base">
							{t('messaging.tagline')}. {t('messaging.effectiveness')}
						</p>
						<SocialIcons />
					</div>

					{/* Links Column */}
					<div className="flex flex-col">
						<h3 className="font-bold text-white mb-6 text-lg">Empresa</h3>
						<ul className="space-y-3">
							<li>
								<Link to="/" className="text-gray-400 hover:text-[#E91E63] transition-colors text-base">
									{t('nav.home')}
								</Link>
							</li>
							<li>
								<Link to="/about" className="text-gray-400 hover:text-[#E91E63] transition-colors text-base">
									{t('nav.about')}
								</Link>
							</li>
							<li>
								<Link to="/contact" className="text-gray-400 hover:text-[#E91E63] transition-colors text-base">
									{t('nav.contact')}
								</Link>
							</li>
							<li>
								<Link to="/privacy-policy" className="text-gray-400 hover:text-[#E91E63] transition-colors text-base">
									{t('footer.privacy')}
								</Link>
							</li>
						</ul>
					</div>

					{/* Quick Links - Enhanced with Academy Prominence */}
					<div className="flex flex-col">
						<h3 className="font-bold text-white mb-6 text-lg">Links Rápidos</h3>
						<ul className="space-y-3">
							<li>
								<Link 
									to="/fluency-fit" 
									className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#E91E63]/20 to-[#D4AF37]/20 border border-[#E91E63]/30 rounded-lg hover:from-[#E91E63]/30 hover:to-[#D4AF37]/30 transition-all"
								>
									<span className="text-white font-bold text-base group-hover:text-[#D4AF37] transition-colors">
										{t('nav.fluencyFit', 'Fluency Fit Academy')}
									</span>
									<span className="px-2 py-0.5 bg-[#D4AF37] text-[#1A1A1A] text-xs font-black rounded-full">
										HOT
									</span>
									<ArrowRight className="w-4 h-4 text-[#E91E63] group-hover:translate-x-1 transition-transform" />
								</Link>
							</li>
							<li>
								<Link to="/course-list" className="text-gray-400 hover:text-[#E91E63] transition-colors text-base">
									Cursos
								</Link>
							</li>
							<li>
								<Link to="/products" className="text-gray-400 hover:text-[#E91E63] transition-colors text-base">
									Produtos
								</Link>
							</li>
							<li>
								<Link to="/pricing" className="text-gray-400 hover:text-[#E91E63] transition-colors text-base">
									{t('nav.pricing', 'Pricing')}
								</Link>
							</li>
						</ul>
					</div>

					{/* Newsletter Column */}
					<div className="flex flex-col">
						<h3 className="font-bold text-white mb-6 text-lg flex items-center gap-2">
							<Mail className="w-5 h-5 text-[#E91E63]" />
							Newsletter
						</h3>
						<p className="text-gray-400 mb-6 text-sm leading-relaxed">
							Receba as últimas notícias, artigos e recursos diretamente na sua caixa de entrada.
						</p>
						<div className="flex flex-col sm:flex-row gap-3">
							<input
								type="email"
								placeholder="Seu email"
								className="flex-1 px-5 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E91E63] transition-all text-base"
								value={subscribeEmail}
								onChange={(e) => setSubscribeEmail(e.target.value)}
							/>
							<button
								onClick={handleSubscribe}
								className="px-6 py-3 bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#E91E63]/50 transition-all flex items-center justify-center gap-2"
							>
								<Send className="w-4 h-4" />
								Inscrever
							</button>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="pt-8 border-t border-white/10">
					<p className="text-center text-sm text-gray-500">
						{t('footer.copyright', '© 2026 So Fluent. Todos os direitos reservados.')}
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
