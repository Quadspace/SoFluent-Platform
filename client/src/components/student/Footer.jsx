import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Instagram, Youtube, Linkedin, Mail, ArrowRight } from "lucide-react";

const Footer = () => {
	const { t } = useTranslation();
	const [subscribeEmail, setSubscribeEmail] = useState("");

	const handleSubscribe = () => {
		alert(`Inscrito com: ${subscribeEmail}`);
		setSubscribeEmail("");
	};

	const footerLinks = {
		students: [
			{ name: 'Dashboard', path: '/dashboard' },
			{ name: 'Membros', path: '/membros' },
			{ name: 'Orders', path: '/orders' },
			{ name: 'Account details', path: '/account' },
		],
		quickLinks: [
			{ name: 'Sobre Nós', path: '/about' },
			{ name: 'Contact us', path: '/contact' },
			{ name: 'Privacy Policy', path: '/privacy-policy' },
			{ name: 'Shop', path: '/products' },
		],
	};

	const socialLinks = [
		{ icon: <Instagram className="w-5 h-5" />, url: 'https://instagram.com/sofluent', label: 'Instagram' },
		{ icon: <Youtube className="w-5 h-5" />, url: 'https://youtube.com/sofluent', label: 'YouTube' },
		{ icon: <Linkedin className="w-5 h-5" />, url: 'https://linkedin.com/company/sofluent', label: 'LinkedIn' },
	];

	return (
		<footer className="bg-[#1A1A1A] text-white">
			{/* Main Footer */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Brand Column */}
					<div>
						<Link to="/" className="inline-block mb-4">
							<span className="text-2xl font-bold text-white">
								So<span className="text-[#E91E63]">Fluent</span>
							</span>
						</Link>
						<p className="text-gray-400 text-sm mb-4">
							So Fluent LLC is a dynamic, virtual institute committed to empowering Brazilian professionals around the globe to master professional English.
						</p>
					</div>

					{/* Students Links */}
					<div>
						<h3 className="font-semibold text-white mb-4">Students</h3>
						<ul className="space-y-2">
							{footerLinks.students.map((link) => (
								<li key={link.path}>
									<Link
										to={link.path}
										className="text-gray-400 hover:text-white text-sm transition-colors"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Links rápidos */}
					<div>
						<h3 className="font-semibold text-white mb-4">Links rápidos</h3>
						<ul className="space-y-2">
							{footerLinks.quickLinks.map((link) => (
								<li key={link.path}>
									<Link
										to={link.path}
										className="text-gray-400 hover:text-white text-sm transition-colors"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Newsletter */}
					<div>
						<h3 className="font-semibold text-white mb-4">Newsletter</h3>
						<p className="text-gray-400 text-sm mb-4">
							Assine nossa newsletter para ter acesso aos nossos conteúdos. Insira seu email para se inscrever.
						</p>
						<div className="flex flex-col gap-2">
							<input
								type="email"
								placeholder="Enter Your Email Address"
								className="bg-white/10 border border-white/20 rounded px-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#E91E63]"
								value={subscribeEmail}
								onChange={(e) => setSubscribeEmail(e.target.value)}
							/>
							<button
								onClick={handleSubscribe}
								className="btn-primary flex items-center justify-center gap-2 text-sm py-2 w-full"
							>
								Inscreva-se <ArrowRight className="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className="border-t border-white/10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<p className="text-center text-gray-400 text-sm">
						© 2025 SoFluent.ai feito por Tomada Digital. Todos os direitos reservados.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
