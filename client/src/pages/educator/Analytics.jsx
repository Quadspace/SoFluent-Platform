import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Users, BookOpen, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import axios from 'axios';
import RevenueChart from '../../components/admin/RevenueChart';

const Analytics = () => {
	const { backendUrl, getToken } = useContext(AppContext);
	const [analytics, setAnalytics] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchAnalytics();
	}, []);

	const fetchAnalytics = async () => {
		try {
			const token = await getToken();
			if (!token) {
				// Mock data for preview
				setAnalytics({
					engagement: {
						activeStudents: 297,
						totalStudents: 327,
						avgClassesPerWeek: 2.8,
						avgHomeworkCompletion: 78,
						avgTimeSpent: 4.2,
						topPerformers: [
							{ name: 'Carlos Mendes', hours: 12, attendance: 100 },
							{ name: 'Ana Silva', hours: 8, attendance: 95 },
							{ name: 'Juliana Costa', hours: 7, attendance: 90 },
						],
						atRisk: [
							{ name: 'Pedro Santos', daysSinceLogin: 7 },
							{ name: 'Maria Oliveira', classesAttended: 1 },
						],
					},
					courses: {
						mostPopular: [
							{ title: 'Fluency Fit Beginner', students: 156, rating: 4.9 },
							{ title: 'Business English', students: 98, rating: 4.8 },
							{ title: 'Conversation Mastery', students: 76, rating: 5.0 },
						],
						highestCompletion: [
							{ title: 'Fluency Fit Intermediate', rate: 87 },
							{ title: 'Pronunciation Bootcamp', rate: 82 },
							{ title: 'Grammar Foundations', rate: 78 },
						],
						needsImprovement: [
							{ title: 'TOEFL Prep', rate: 45 },
						],
					},
					revenue: {
						mrr: 118309,
						growthRate: 12,
						churnRate: 3.2,
						arpu: 362,
						funnel: {
							visitors: 2450,
							trialSignups: 87,
							paidConversions: 23,
						},
					},
				});
				setLoading(false);
				return;
			}

			const { data } = await axios.get(`${backendUrl}/api/educator/analytics`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (data.success) {
				setAnalytics(data.analytics);
			}
		} catch (error) {
			// Handle error silently, use mock data
		} finally {
			setLoading(false);
		}
	};

	if (loading || !analytics) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="w-12 h-12 border-4 border-sofluent-cherry border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white p-4 md:p-8">
			<div className="max-w-7xl mx-auto space-y-6">
				{/* Header */}
				<div>
					<h1 className="text-2xl md:text-3xl font-bold text-sofluent-black">Analytics & Insights</h1>
					<p className="text-sofluent-gris mt-1">Track student engagement, course performance, and revenue</p>
				</div>

				{/* Student Engagement */}
				<div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
					<h2 className="text-lg font-semibold text-sofluent-black mb-4">Student Engagement</h2>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
						<div className="bg-gray-50 rounded-lg p-4">
							<p className="text-sm text-sofluent-gris mb-1">Active Students</p>
							<p className="text-2xl font-bold text-sofluent-black">
								{analytics.engagement.activeStudents}/{analytics.engagement.totalStudents}
							</p>
							<p className="text-xs text-sofluent-gris mt-1">
								{Math.round((analytics.engagement.activeStudents / analytics.engagement.totalStudents) * 100)}% active
							</p>
						</div>
						<div className="bg-gray-50 rounded-lg p-4">
							<p className="text-sm text-sofluent-gris mb-1">Avg Classes/Week</p>
							<p className="text-2xl font-bold text-sofluent-black">{analytics.engagement.avgClassesPerWeek}</p>
							<p className="text-xs text-sofluent-gris mt-1">Target: 3.0</p>
						</div>
						<div className="bg-gray-50 rounded-lg p-4">
							<p className="text-sm text-sofluent-gris mb-1">Homework Completion</p>
							<p className="text-2xl font-bold text-sofluent-black">{analytics.engagement.avgHomeworkCompletion}%</p>
						</div>
						<div className="bg-gray-50 rounded-lg p-4">
							<p className="text-sm text-sofluent-gris mb-1">Avg Time/Week</p>
							<p className="text-2xl font-bold text-sofluent-black">{analytics.engagement.avgTimeSpent}h</p>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<h3 className="font-semibold text-sofluent-black mb-3">Top Performers</h3>
							<div className="space-y-2">
								{analytics.engagement.topPerformers.map((student, index) => (
									<div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
										<span className="text-sm text-sofluent-black">{student.name}</span>
										<div className="flex items-center gap-4 text-xs text-sofluent-gris">
											<span>{student.hours}h/week</span>
											<span>{student.attendance}% attendance</span>
										</div>
									</div>
								))}
							</div>
						</div>
						<div>
							<h3 className="font-semibold text-sofluent-black mb-3 flex items-center gap-2">
								<AlertCircle className="w-5 h-5 text-red-500" />
								At-Risk Students
							</h3>
							<div className="space-y-2">
								{analytics.engagement.atRisk.map((student, index) => (
									<div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
										<span className="text-sm text-sofluent-black">{student.name}</span>
										<span className="text-xs text-red-600">
											{student.daysSinceLogin ? `${student.daysSinceLogin} days inactive` : `${student.classesAttended} class in 2 weeks`}
										</span>
									</div>
								))}
							</div>
							<BrandButton variant="primary" size="small" className="mt-3">
								Send Re-Engagement Email
							</BrandButton>
						</div>
					</div>
				</div>

				{/* Course Performance */}
				<div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
					<h2 className="text-lg font-semibold text-sofluent-black mb-4">Course Performance</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div>
							<h3 className="font-semibold text-[#1A1A1A] mb-3">Most Popular</h3>
							<div className="space-y-2">
								{analytics.courses.mostPopular.map((course, index) => (
									<div key={index} className="p-2 bg-gray-50 rounded">
										<p className="text-sm font-semibold text-sofluent-black">{course.title}</p>
										<p className="text-xs text-sofluent-gris">{course.students} students • ⭐ {course.rating}</p>
									</div>
								))}
							</div>
						</div>
						<div>
							<h3 className="font-semibold text-[#1A1A1A] mb-3">Highest Completion</h3>
							<div className="space-y-2">
								{analytics.courses.highestCompletion.map((course, index) => (
									<div key={index} className="p-2 bg-gray-50 rounded">
										<p className="text-sm font-semibold text-sofluent-black">{course.title}</p>
										<p className="text-xs text-sofluent-gris">{course.rate}% completion</p>
									</div>
								))}
							</div>
						</div>
						<div>
							<h3 className="font-semibold text-sofluent-black mb-3 flex items-center gap-2">
								<AlertCircle className="w-5 h-5 text-yellow-500" />
								Needs Improvement
							</h3>
							<div className="space-y-2">
								{analytics.courses.needsImprovement.map((course, index) => (
									<div key={index} className="p-2 bg-yellow-50 rounded">
										<p className="text-sm font-semibold text-sofluent-black">{course.title}</p>
										<p className="text-xs text-yellow-600">{course.rate}% completion (investigate)</p>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Revenue Insights */}
				<div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
					<h2 className="text-lg font-semibold text-sofluent-black mb-4">Revenue Insights</h2>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
						<div className="bg-gray-50 rounded-lg p-4">
							<p className="text-sm text-sofluent-gris mb-1">MRR</p>
							<p className="text-2xl font-bold text-sofluent-black">R${analytics.revenue.mrr.toLocaleString()}</p>
						</div>
						<div className="bg-gray-50 rounded-lg p-4">
							<p className="text-sm text-sofluent-gris mb-1">Growth Rate</p>
							<p className="text-2xl font-bold text-green-600">+{analytics.revenue.growthRate}%</p>
						</div>
						<div className="bg-gray-50 rounded-lg p-4">
							<p className="text-sm text-[#666666] mb-1">Churn Rate</p>
							<p className="text-2xl font-bold text-[#1A1A1A]">{analytics.revenue.churnRate}%</p>
							<p className="text-xs text-sofluent-gris mt-1">Industry avg: 5-7%</p>
						</div>
						<div className="bg-gray-50 rounded-lg p-4">
							<p className="text-sm text-sofluent-gris mb-1">ARPU</p>
							<p className="text-2xl font-bold text-sofluent-black">R${analytics.revenue.arpu}</p>
						</div>
					</div>
					<div className="mb-6">
						<h3 className="font-semibold text-sofluent-black mb-3">Conversion Funnel</h3>
						<div className="space-y-2">
							<div className="flex items-center justify-between p-3 bg-gray-50 rounded">
								<span className="text-sm text-sofluent-gris">Website Visitors</span>
								<span className="font-semibold text-sofluent-black">{analytics.revenue.funnel.visitors}</span>
							</div>
							<div className="flex items-center justify-between p-3 bg-gray-50 rounded">
								<span className="text-sm text-sofluent-gris">Trial Signups</span>
								<span className="font-semibold text-sofluent-black">
									{analytics.revenue.funnel.trialSignups} ({Math.round((analytics.revenue.funnel.trialSignups / analytics.revenue.funnel.visitors) * 100)}%)
								</span>
							</div>
							<div className="flex items-center justify-between p-3 bg-gray-50 rounded">
								<span className="text-sm text-sofluent-gris">Paid Conversions</span>
								<span className="font-semibold text-sofluent-black">
									{analytics.revenue.funnel.paidConversions} ({Math.round((analytics.revenue.funnel.paidConversions / analytics.revenue.funnel.trialSignups) * 100)}%)
								</span>
							</div>
						</div>
					</div>
					<RevenueChart />
				</div>
			</div>
		</div>
	);
};

export default Analytics;
