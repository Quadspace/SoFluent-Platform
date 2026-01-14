import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useUserSafe } from '../../hooks/useClerkSafe.jsx';
import { ArrowLeft, Mail, Phone, MessageSquare, Edit, Calendar, BookOpen, Flame } from 'lucide-react';
import axios from 'axios';

const StudentProfile = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { backendUrl, getToken } = useContext(AppContext);
	const [student, setStudent] = useState(null);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState('overview');

	useEffect(() => {
		fetchStudentData();
	}, [id]);

	const fetchStudentData = async () => {
		try {
			const token = await getToken();
			if (!token) {
				// Use mock data for preview
				setStudent({
					id: id,
					name: 'Ana Silva',
					email: 'ana.silva@email.com',
					phone: '+55 21 98765-4321',
					plan: 'Academy Plan',
					planPrice: 'R$297/mo',
					status: 'Active',
					joinedDate: 'Jan 5, 2026',
					englishLevel: 60,
					fitnessLevel: 70,
					attendance: { attended: 18, total: 20 },
					streak: 12,
					totalHours: 36.5,
					enrolledCourses: [
						{ title: 'Fluency Fit Beginner', progress: 65 },
						{ title: 'Business English Fundamentals', progress: 45 },
					],
					payments: [
						{ date: 'Jan 5, 2026', amount: 'R$297.00', status: 'Paid' },
						{ date: 'Dec 5, 2025', amount: 'R$297.00', status: 'Paid' },
					],
					notes: [],
				});
				setLoading(false);
				return;
			}

			const { data } = await axios.get(`${backendUrl}/api/educator/students/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (data.success) {
				setStudent(data.student);
			}
		} catch (error) {
			// Handle error silently, use mock data
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="w-12 h-12 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	if (!student) {
		return <div>Student not found</div>;
	}

	return (
		<div className="min-h-screen bg-white p-4 md:p-8">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<button
					onClick={() => navigate('/educator/student-enrolled')}
					className="flex items-center gap-2 text-[#666666] mb-6 hover:text-[#1A1A1A] transition-colors"
				>
					<ArrowLeft className="w-5 h-5" />
					Back to Students
				</button>

				{/* Student Info Card */}
				<div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-4">
							<img
								src={student.avatar || '/placeholder-avatar.png'}
								alt={student.name}
								className="w-20 h-20 rounded-full object-cover"
								onError={(e) => {
									e.target.src = 'https://ui-avatars.com/api/?name=' + student.name + '&background=E91E63&color=fff';
								}}
							/>
							<div>
								<h1 className="text-2xl font-bold text-[#1A1A1A] mb-1">{student.name}</h1>
								<div className="flex items-center gap-4 text-sm text-[#666666]">
									<div className="flex items-center gap-1">
										<Mail className="w-4 h-4" />
										{student.email}
									</div>
									{student.phone && (
										<div className="flex items-center gap-1">
											<Phone className="w-4 h-4" />
											{student.phone}
										</div>
									)}
								</div>
								<div className="flex items-center gap-3 mt-3">
									<span className={`px-3 py-1 rounded-full text-xs font-semibold ${
										student.plan === 'VIP' ? 'bg-[#E91E63] text-white' : 'bg-[#00BCD4] text-white'
									}`}>
										{student.plan} - {student.planPrice}
									</span>
									<span className={`px-3 py-1 rounded-full text-xs font-semibold ${
										student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
									}`}>
										{student.status}
									</span>
								</div>
							</div>
						</div>
						<div className="flex gap-2">
							<button className="p-2 bg-[#E91E63] text-white rounded-lg hover:bg-[#C2185B] transition-colors">
								<MessageSquare className="w-5 h-5" />
							</button>
							<button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
								<Edit className="w-5 h-5" />
							</button>
						</div>
					</div>
				</div>

				{/* Tabs */}
				<div className="flex gap-2 mb-6 border-b border-gray-200">
					{['overview', 'courses', 'payments', 'notes'].map((tab) => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`px-4 py-2 font-medium transition-colors ${
								activeTab === tab
									? 'text-[#E91E63] border-b-2 border-[#E91E63]'
									: 'text-[#666666] hover:text-[#1A1A1A]'
							}`}
						>
							{tab.charAt(0).toUpperCase() + tab.slice(1)}
						</button>
					))}
				</div>

				{/* Tab Content */}
				{activeTab === 'overview' && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Progress Cards */}
						<div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
							<h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">English Level</h3>
							<div className="mb-2">
								<div className="flex justify-between text-sm mb-1">
									<span className="text-[#666666]">Intermediate</span>
									<span className="text-[#1A1A1A] font-semibold">{student.englishLevel}%</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-3">
									<div
										className="bg-[#E91E63] h-3 rounded-full transition-all"
										style={{ width: `${student.englishLevel}%` }}
									/>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
							<h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Fitness Level</h3>
							<div className="mb-2">
								<div className="flex justify-between text-sm mb-1">
									<span className="text-[#666666]">Advanced Beginner</span>
									<span className="text-[#1A1A1A] font-semibold">{student.fitnessLevel}%</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-3">
									<div
										className="bg-[#00BCD4] h-3 rounded-full transition-all"
										style={{ width: `${student.fitnessLevel}%` }}
									/>
								</div>
							</div>
						</div>

						{/* Stats */}
						<div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
							<h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Activity</h3>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2 text-[#666666]">
										<Calendar className="w-5 h-5" />
										<span>Attendance</span>
									</div>
									<span className="font-semibold text-[#1A1A1A]">
										{student.attendance.attended}/{student.attendance.total} ({Math.round((student.attendance.attended / student.attendance.total) * 100)}%)
									</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2 text-[#666666]">
										<Flame className="w-5 h-5" />
										<span>Streak</span>
									</div>
									<span className="font-semibold text-[#1A1A1A]">{student.streak} days</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2 text-[#666666]">
										<BookOpen className="w-5 h-5" />
										<span>Total Hours</span>
									</div>
									<span className="font-semibold text-[#1A1A1A]">{student.totalHours} hours</span>
								</div>
							</div>
						</div>
					</div>
				)}

				{activeTab === 'courses' && (
					<div className="space-y-4">
						{student.enrolledCourses?.map((course, index) => (
							<div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
								<div className="flex items-center justify-between mb-2">
									<h3 className="text-lg font-semibold text-[#1A1A1A]">{course.title}</h3>
									<span className="text-sm text-[#666666]">{course.progress}%</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2 mb-2">
									<div
										className="bg-[#E91E63] h-2 rounded-full transition-all"
										style={{ width: `${course.progress}%` }}
									/>
								</div>
								<button className="text-[#E91E63] text-sm font-medium hover:underline">
									View Course →
								</button>
							</div>
						))}
					</div>
				)}

				{activeTab === 'payments' && (
					<div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-semibold text-[#1A1A1A]">Date</th>
									<th className="px-6 py-3 text-left text-xs font-semibold text-[#1A1A1A]">Amount</th>
									<th className="px-6 py-3 text-left text-xs font-semibold text-[#1A1A1A]">Status</th>
								</tr>
							</thead>
							<tbody>
								{student.payments?.map((payment, index) => (
									<tr key={index} className="border-t border-gray-200">
										<td className="px-6 py-4 text-sm text-[#666666]">{payment.date}</td>
										<td className="px-6 py-4 text-sm font-semibold text-[#1A1A1A]">{payment.amount}</td>
										<td className="px-6 py-4">
											<span className={`px-2 py-1 rounded-full text-xs font-semibold ${
												payment.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
											}`}>
												{payment.status}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{activeTab === 'notes' && (
					<div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
						<div className="mb-4">
							<textarea
								placeholder="Add a private note about this student..."
								className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#E91E63]"
								rows="4"
							/>
							<button className="mt-2 px-4 py-2 bg-[#E91E63] text-white rounded-lg hover:bg-[#C2185B] transition-colors">
								Add Note
							</button>
						</div>
						<div className="space-y-3">
							{student.notes?.length > 0 ? (
								student.notes.map((note, index) => (
									<div key={index} className="p-3 bg-gray-50 rounded-lg">
										<p className="text-sm text-[#666666]">{note.date}</p>
										<p className="text-[#1A1A1A]">{note.text}</p>
									</div>
								))
							) : (
								<p className="text-[#666666] text-center py-8">No notes yet</p>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default StudentProfile;
