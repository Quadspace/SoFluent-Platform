/**
 * Student Management
 * 3-Tier Platform: Student list with hover-to-zoom details
 */

import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useUserSafe } from '../../hooks/useClerkSafe.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  TrendingUp,
  Award,
  Users
} from 'lucide-react';
import StandardPage from '../../utils/pageConsistency';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import BrandButton from '../../components/common/BrandButton';
import StudentHoverCard from '../../components/admin/StudentHoverCard';
import '../../components/admin/StudentHoverCard.css';

const StudentManagement = () => {
  const { user } = useUserSafe();
  const { backendUrl, getToken } = useContext(AppContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchStudents();
  }, [search]);

  const fetchStudents = async () => {
    try {
      const token = await getToken();
      if (token) {
        const response = await fetch(`${backendUrl}/api/admin/students?search=${search}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setStudents(data.students || []);
          }
        }
      }
    } catch (error) {
      // Handle error silently, use empty students array
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <StandardPage
        loading={true}
        seoTitle="Student Management - So Fluent"
        background="bg-gradient-to-br from-sofluent-black via-sofluent-dark to-sofluent-black"
      />
    );
  }

  return (
    <StandardPage
      seoTitle="Student Management - So Fluent"
      seoDescription="Manage students and their progress"
      background="bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]"
      showNavbar={false}
      showFooter={false}
    >
    <div className="p-8">
      {/* Header */}
      <div className="bg-sofluent-dark/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
            Student Management
          </h1>
          <BrandButton variant="primary" size="small">
            Add Student
          </BrandButton>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-sofluent-dark border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-sofluent-cherry focus:outline-none"
            />
          </div>
          <select className="bg-sofluent-dark border border-white/10 rounded-lg px-4 py-2 text-white text-sm">
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="vip">VIP</option>
          </select>
        </div>

        {/* Students Table */}
        <div className="bg-gradient-to-br from-sofluent-dark to-sofluent-black border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-gray-400 font-semibold text-sm">Name</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold text-sm">Cohort</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold text-sm">Tier</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold text-sm">Status</th>
                <th className="px-6 py-4 text-left text-gray-400 font-semibold text-sm">Value</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student._id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <StudentHoverCard student={student}>
                      <div className="flex items-center gap-3 cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sofluent-cherry to-sofluent-gold flex items-center justify-center text-white font-bold">
                          {student.name?.charAt(0) || 'S'}
                        </div>
                        <span className="text-white font-semibold">{student.name}</span>
                      </div>
                    </StudentHoverCard>
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-sm">
                    {student.cohorts?.[0]?.name || 'No cohort'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-sofluent-gold/20 text-sofluent-gold rounded-full text-xs font-semibold">
                      {student.subscription?.tier || 'academy'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold">
                      ✅ Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white font-semibold">
                    R$ {student.totalSpent?.toLocaleString('pt-BR') || '0'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
    </StandardPage>
  );
};


export default StudentManagement;
