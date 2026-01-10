import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useClerkSafe, useUserSafe, UserButtonSafe } from "../../hooks/useClerkSafe.jsx";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
	const { navigate, isEducator, backendUrl, setIsEducator, getToken } = useContext(AppContext);
	const { openSignIn } = useClerkSafe();
	const { user } = useUserSafe();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const navLinks = [
		{ name: 'Início', path: '/', pt: 'Início', en: 'Home' },
		{ name: 'Sobre Nós', path: '/about', pt: 'Sobre Nós', en: 'About Us' },
		{ name: 'Nossos Cursos', path: '/course-list', pt: 'Nossos Cursos', en: 'Our Courses' },
		{ name: 'Membros', path: '/membros', pt: 'Membros', en: 'Members' },
		{ name: 'Contate-nos', path: '/contact', pt: 'Contate-nos', en: 'Contact Us' },
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
		<nav className="fixed top-0 left-0 right-0 z-50 bg-[#1A1A1A]/95 backdrop-blur-md border-b border-white/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-20">
					{/* Logo */}
					<Link to="/" className="flex items-center group">
						<div className="relative">
							<span className="text-2xl font-bold text-white group-hover:text-[#E91E63] transition-colors">
								So<span className="text-[#E91E63] group-hover:text-white transition-colors">Fluent</span>
							</span>
							<div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#E91E63] to-[#00BCD4] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
						</div>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center gap-1">
						{navLinks.map((link) => (
							<NavLink
								key={link.path}
								to={link.path}
								className={({ isActive }) =>
									`px-4 py-2 text-sm font-semibold rounded-lg transition-all relative ${
										isActive
											? 'text-white bg-[#E91E63]/20'
											: 'text-gray-300 hover:text-white hover:bg-white/5'
									}`
								}
							>
								{link.pt}
								{({ isActive }) => isActive && (
									<motion.div
										layoutId="activeTab"
										className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#E91E63] to-[#00BCD4]"
										initial={false}
										transition={{ type: "spring", stiffness: 500, damping: 30 }}
									/>
								)}
							</NavLink>
						))}
					</div>

					{/* Right Section */}
					<div className="hidden md:flex items-center gap-4">
						{user ? (
							<>
								<Link
									to="/my-enrollments"
									className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
								>
									Minhas Inscrições
								</Link>
								{isEducator && (
									<button
										onClick={becomeEducator}
										className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
									>
										Dashboard
									</button>
								)}
								<UserButtonSafe />
							</>
						) : (
							<>
								<button
									onClick={() => openSignIn()}
									className="text-sm font-semibold text-gray-300 hover:text-white transition-colors px-4 py-2"
								>
									Login
								</button>
								<button
									onClick={() => openSignIn()}
									className="px-6 py-2.5 bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#E91E63]/50 transition-all transform hover:scale-105"
								>
									Criar Conta
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
							{navLinks.map((link) => (
								<NavLink
									key={link.path}
									to={link.path}
									onClick={() => setIsMenuOpen(false)}
									className={({ isActive }) =>
										`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
											isActive
												? 'text-white bg-[#E91E63]/20'
												: 'text-gray-300 hover:text-white hover:bg-white/5'
										}`
									}
								>
									{link.pt}
								</NavLink>
							))}
							<hr className="border-white/10 my-3" />
							{user ? (
								<>
									<Link
										to="/my-enrollments"
										onClick={() => setIsMenuOpen(false)}
										className="block px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
									>
										Minhas Inscrições
									</Link>
									<UserButtonSafe />
								</>
							) : (
								<>
									<button
										onClick={() => { openSignIn(); setIsMenuOpen(false); }}
										className="block w-full text-left px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
									>
										Login
									</button>
									<button
										onClick={() => { openSignIn(); setIsMenuOpen(false); }}
										className="w-full px-4 py-3 bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white font-semibold rounded-lg mt-2"
									>
										Criar Conta
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
