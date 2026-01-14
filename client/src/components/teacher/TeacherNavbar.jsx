/**
 * Teacher Navbar Component
 * 3-Tier Platform: Navigation for Teachers
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useClerkSafe } from '../../hooks/useClerkSafe.jsx';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  DollarSign,
  Settings,
  LogOut
} from 'lucide-react';

const TeacherNavbar = () => {
  const location = useLocation();
  const { signOut } = useClerkSafe();

  const navItems = [
    { path: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/teacher/students', icon: Users, label: 'My Students' },
    { path: '/teacher/content', icon: BookOpen, label: 'Content' },
    { path: '/teacher/earnings', icon: DollarSign, label: 'Earnings' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[#1A1A1A]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/teacher/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#4CAF50] to-[#45A049] rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">SF</span>
            </div>
            <span className="text-white font-black text-lg">Teacher Portal</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-[#4CAF50]/20 text-[#4CAF50]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => signOut && signOut()}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TeacherNavbar;
