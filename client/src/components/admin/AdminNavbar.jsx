/**
 * Admin Navbar Component
 * 3-Tier Platform: Navigation for Master Admin
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useClerkSafe } from '../../hooks/useClerkSafe.jsx';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  DollarSign,
  Settings,
  LogOut,
  BookOpen
} from 'lucide-react';

const AdminNavbar = () => {
  const location = useLocation();
  const { signOut } = useClerkSafe();

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/cohorts', icon: BookOpen, label: 'Cohorts' },
    { path: '/admin/students', icon: Users, label: 'Students' },
    { path: '/admin/teachers', icon: GraduationCap, label: 'Teachers' },
    { path: '/admin/financials', icon: DollarSign, label: 'Financials' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[#1A1A1A]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#E91E63] to-[#D4AF37] rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">SF</span>
            </div>
            <span className="text-white font-black text-lg">So Fluent Admin</span>
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
                      ? 'bg-[#E91E63]/20 text-[#E91E63]'
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

export default AdminNavbar;
