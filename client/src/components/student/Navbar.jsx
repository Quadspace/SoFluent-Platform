import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useClerkSafe, useUserSafe, UserButtonSafe } from "../../hooks/useClerkSafe.jsx";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { brandAssets } from "../../assets/branding/brand-assets";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSwitcher";

const Navbar = () => {
	const { navigate, isEducator, backendUrl, setIsEducator, getToken } = useContext(AppContext);
	const { openSignIn } = useClerkSafe();
	const { user } = useUserSafe();
	const { t } = useTranslation();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const navLinks = [
		{ path: '/', key: 'nav.home' },
		{ path: '/my-english-journey', key: 'nav.myEnglishJourney' },
		{ path: '/so-fluent-talks', key: 'nav.soFluentTalks' },
		{ path: '/fluency-fit', key: 'nav.fluencyFit' },
		{ path: '/esp-courses', key: 'nav.espCourses' },
		{ path: '/course-list', key: 'nav.courses' },
		{ path: '/pricing', key: 'nav.pricing' },
		{ path: '/about', key: 'nav.about' },
		{ path: '/contact', key: 'nav.contact' },
	];

	const becomeEducator = async () => {
		try {
			if (isEducator) {
				navigate('/educator')
				return;
			}
			const token = await getToken();
			const { data } = await axios.get(backendUrl + '/api/educator/update-role', { headers: { Authorization: `Bearer ${token}` } })
			if (data.success) {
				setIsEducator(true);
				toast.success(data.message)
			} else {
				toast.error(data.message)
			}
		} catch (error) {
			toast.error(error.message)
		}
	}

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 bg-[#1A1A1A]/95 backdrop-blur-xl border-b border-white/10 shadow-xl">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-24">
					{/* Logo - Using brand kit logo */}
					<Link to="/" className="flex items-center group">
						<img 
							src={brandAssets.logos.white} 
							alt="So Fluent Logo" 
							className="h-12 w-auto group-hover:opacity-80 transition-opacity"
						/>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center gap-2">
						{navLinks.map((link) => {
							const isFluencyFit = link.path === '/fluency-fit';
							return (
								<NavLink
									key={link.path}
									to={link.path}
									className={({ isActive }) =>
										`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all relative ${
											isActive
												? 'text-white bg-[#E91E63]/20'
												: isFluencyFit
												? 'text-white bg-gradient-to-r from-[#E91E63]/30 to-[#D4AF37]/30 border border-[#E91E63]/40 hover:from-[#E91E63]/40 hover:to-[#D4AF37]/40'
												: 'text-gray-300 hover:text-white hover:bg-white/5'
										}`
									}
								>
									{({ isActive }) => (
										<>
											<span className="flex items-center gap-2">
												{t(link.key, link.key.replace('nav.', '').replace(/([A-Z])/g, ' $1').trim())}
												{isFluencyFit && (
													<span className="px-2 py-0.5 bg-[#D4AF37] text-[#1A1A1A] text-xs font-black rounded-full">
														HOT
													</span>
												)}
											</span>
											{isActive && (
												<motion.div
													layoutId="activeTab"
													className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#E91E63] to-[#D4AF37]"
													initial={false}
													transition={{ type: "spring", stiffness: 500, damping: 30 }}
												/>
											)}
										</>
									)}
								</NavLink>
							);
						})}
					</div>

					{/* Right Section */}
					<div className="hidden md:flex items-center gap-4">
						{/* Language Switcher */}
						<LanguageSwitcher />
						
						{user ? (
							<>
								<Link
									to="/my-enrollments"
									className="text-sm font-semibold text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
								>
									{t('nav.myEnrollments', 'My Enrollments')}
								</Link>
								{isEducator && (
									<button
										onClick={becomeEducator}
										className="text-sm font-semibold text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
									>
										{t('nav.dashboard', 'Dashboard')}
									</button>
								)}
								<UserButtonSafe />
							</>
						) : (
							<>
								<button
									onClick={() => {
										if (openSignIn) {
											openSignIn();
										} else {
											toast.info('Please configure Clerk authentication. See AUTHENTICATION_SETUP.md');
										}
									}}
									className="text-sm font-semibold text-white hover:text-[#E91E63] transition-colors px-5 py-2.5 rounded-lg hover:bg-white/10 border border-white/20"
								>
									{t('nav.login', 'Login')}
								</button>
								<button
									onClick={() => {
										if (openSignIn) {
											openSignIn();
										} else {
											toast.info('Please configure Clerk authentication. See AUTHENTICATION_SETUP.md');
										}
									}}
									className="px-8 py-2.5 bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#E91E63]/50 transition-all transform hover:scale-105 font-semibold"
								>
									{t('nav.createAccount', 'Get Started')}
								</button>
							</>
						)}
					</div>

					{/* Mobile Menu Button */}
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
					>
						{isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
					</button>
				</div>
			</div>

					{/* Mobile Menu */}
					<AnimatePresence>
						{isMenuOpen && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								exit={{ opacity: 0, height: 0 }}
								className="md:hidden bg-[#1A1A1A] border-t border-white/10 overflow-hidden"
							>
								<div className="px-4 py-4 space-y-2">
									{/* Language Switcher in Mobile */}
									<div className="px-4 py-2">
										<LanguageSwitcher />
									</div>
									<hr className="border-white/10 my-3" />
									
									{navLinks.map((link) => {
										const isAcademy = link.path === '/fluency-fit';
										return (
											<NavLink
												key={link.path}
												to={link.path}
												onClick={() => setIsMenuOpen(false)}
												className={({ isActive }) =>
													isAcademy
														? `block px-4 py-3 text-base font-bold rounded-lg transition-all bg-gradient-to-r from-[#E91E63]/30 to-[#D4AF37]/30 border border-[#E91E63]/40 ${
																isActive
																	? 'text-white'
																	: 'text-white hover:from-[#E91E63]/40 hover:to-[#D4AF37]/40'
															}`
														: `block px-4 py-3 text-base font-semibold rounded-lg transition-colors ${
																isActive
																	? 'text-white bg-[#E91E63]/20'
																	: 'text-gray-300 hover:text-white hover:bg-white/5'
															}`
												}
											>
												<div className="flex items-center justify-between">
													<span>{t(link.key)}</span>
													{isAcademy && (
														<span className="px-2 py-0.5 bg-[#D4AF37] text-[#1A1A1A] text-xs font-black rounded-full">
															HOT
														</span>
													)}
												</div>
											</NavLink>
										);
									})}
									<hr className="border-white/10 my-3" />
									{user ? (
										<>
											<Link
												to="/my-enrollments"
												onClick={() => setIsMenuOpen(false)}
												className="block px-4 py-3 text-base font-semibold text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
											>
												{t('nav.myEnrollments', 'My Enrollments')}
											</Link>
											{isEducator && (
												<button
													onClick={() => { becomeEducator(); setIsMenuOpen(false); }}
													className="block w-full text-left px-4 py-3 text-base font-semibold text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
												>
													{t('nav.dashboard', 'Dashboard')}
												</button>
											)}
											<UserButtonSafe />
										</>
									) : (
										<>
											<button
												onClick={() => { openSignIn(); setIsMenuOpen(false); }}
												className="block w-full text-left px-4 py-3 text-base font-semibold text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
											>
												{t('nav.login', 'Login')}
											</button>
											<button
												onClick={() => { openSignIn(); setIsMenuOpen(false); }}
												className="w-full px-4 py-3 bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white font-semibold rounded-lg mt-2"
											>
												{t('nav.createAccount', 'Create Account')}
											</button>
										</>
									)}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
		</nav>
	);
};

export default Navbar;
