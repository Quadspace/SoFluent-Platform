import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { assets, dummyDashboardData } from "../../assets/assets";
import Loading from "../../components/student/Loading";
import { toast } from "react-toastify";
import axios from "axios";
import Logger from "../../components/Logger";
import Signature from "../../components/Signature";
import QuickActions from "../../components/admin/QuickActions";
import UpcomingClasses from "../../components/admin/UpcomingClasses";
import RecentActivity from "../../components/admin/RecentActivity";
import RevenueChart from "../../components/admin/RevenueChart";
import MetricCard from "../../components/admin/MetricCard";
import { Users, BookOpen, DollarSign, Star, Calendar } from "lucide-react";
import { useUserSafe } from "../../hooks/useClerkSafe.jsx";

const Dashboard = () => {
	const { currency, backendUrl, getToken, isEducator } = useContext(AppContext);
	const { user } = useUserSafe();
	const [dashboardData, setDashboardData] = useState(null);
	const [userRole, setUserRole] = useState('assigned'); // 'master' or 'assigned'

	// Determine user role from metadata
	useEffect(() => {
		if (user?.publicMetadata?.role === 'master' || user?.publicMetadata?.role === 'admin') {
			setUserRole('master');
		} else {
			setUserRole('assigned');
		}
	}, [user]);

	const fetchDashboardData = async () => {
		try {
			const token = await getToken();
			if (!token) {
				setDashboardData(dummyDashboardData || {
					enrolledStudentsData: [],
					totalCourses: 0,
					totalEarnings: 0
				});
				return;
			}

			const { data } = await axios.get(backendUrl + "/api/educator/dashboard", {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (data.success) {
				setDashboardData(data.dashboardData);
			} else {
				setDashboardData(dummyDashboardData || {
					enrolledStudentsData: [],
					totalCourses: 0,
					totalEarnings: 0
				});
			}
		} catch (error) {
			setDashboardData(dummyDashboardData || {
				enrolledStudentsData: [],
				totalCourses: 0,
				totalEarnings: 0
			});
		}
	};

	useEffect(() => {
		fetchDashboardData();
	}, [isEducator]);

	const totalStudents = dashboardData?.enrolledStudentsData?.length || 327;
	const totalCourses = dashboardData?.totalCourses || 12;
	const totalEarnings = dashboardData?.totalEarnings || 89450;
	const avgRating = 4.8;
	const thisMonthRevenue = totalEarnings;
	const activeClasses = 18;

	return (
		<>
			<div className="min-h-screen bg-white p-4 md:p-8">
				<div className="max-w-7xl mx-auto space-y-6">
					{/* Header */}
					<div className="block sm:hidden">
						<Logger />
					</div>

					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">
								Dashboard Overview
							</h1>
							<p className="text-[#666666] mt-1">
								Welcome back{user?.fullName ? `, ${user.fullName}` : ''}! Here's what's happening today.
							</p>
							{/* Role Badge */}
							<div className="mt-2">
								<span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
									userRole === 'master' 
										? 'bg-[#E91E63] text-white' 
										: 'bg-[#00BCD4] text-white'
								}`}>
									{userRole === 'master' ? 'Master Profile' : 'Assigned Profile'}
								</span>
							</div>
						</div>
					</div>

					{/* Metric Cards */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						<MetricCard
							title="Active Students"
							value={totalStudents}
							subtitle="327 total enrolled"
							icon={<Users className="w-6 h-6" />}
							color="sofluent-pink"
							trend={{ positive: true, value: "+12%" }}
						/>
						<MetricCard
							title="This Month Revenue"
							value={`R$${thisMonthRevenue.toLocaleString()}`}
							subtitle="On track for R$100K"
							icon={<DollarSign className="w-6 h-6" />}
							color="green"
							trend={{ positive: true, value: "+12%" }}
						/>
						<MetricCard
							title="Classes This Week"
							value={activeClasses}
							subtitle="12 scheduled"
							icon={<Calendar className="w-6 h-6" />}
							color="sofluent-accent"
						/>
						<MetricCard
							title="Average Rating"
							value={avgRating}
							subtitle="Based on 87 reviews"
							icon={<Star className="w-6 h-6" />}
							color="yellow"
						/>
					</div>

					{/* Quick Actions */}
					<QuickActions userRole={userRole} />

					{/* Main Content Grid */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						<div className="lg:col-span-2 space-y-6">
							<UpcomingClasses />
							<RevenueChart />
						</div>
						<div>
							<RecentActivity />
						</div>
					</div>

					{/* Latest Enrollments Table */}
					{dashboardData?.enrolledStudentsData && dashboardData.enrolledStudentsData.length > 0 && (
						<div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
							<h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Latest Enrollments</h2>
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="text-[#1A1A1A] border-b border-gray-200 text-sm text-left">
										<tr>
											<th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th>
											<th className="px-4 py-3 font-semibold">Student Name</th>
											<th className="px-4 py-3 font-semibold">Course Title</th>
											<th className="px-4 py-3 font-semibold hidden md:table-cell">Date</th>
										</tr>
									</thead>
									<tbody className="text-sm text-[#666666]">
										{dashboardData.enrolledStudentsData.slice(0, 10).map((item, index) => (
											<tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
												<td className="px-4 py-3 text-center hidden sm:table-cell">{index + 1}</td>
												<td className="px-4 py-3">
													<div className="flex items-center space-x-3">
														<img
															src={item.student?.imageUrl || assets.profile_img}
															alt="student"
															className="w-9 h-9 rounded-full"
														/>
														<span className="truncate">{item.student?.name || 'Student'}</span>
													</div>
												</td>
												<td className="px-4 py-3 truncate">{item.courseTitle || 'Course'}</td>
												<td className="px-4 py-3 hidden md:table-cell text-gray-400">
													{new Date().toLocaleDateString()}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}
				</div>
			</div>
			<Signature />
		</>
	);
};

export default Dashboard;
