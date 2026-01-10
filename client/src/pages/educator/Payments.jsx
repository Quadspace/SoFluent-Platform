import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { DollarSign, AlertCircle, TrendingUp, Download, RefreshCw } from 'lucide-react';
import axios from 'axios';
import MetricCard from '../../components/admin/MetricCard';

const Payments = () => {
	const { backendUrl, getToken } = useContext(AppContext);
	const [payments, setPayments] = useState([]);
	const [failedPayments, setFailedPayments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState({
		thisMonth: 89450,
		thisYear: 312479,
		activeSubs: 297,
		successRate: 98.5,
	});

	useEffect(() => {
		fetchPayments();
	}, []);

	const fetchPayments = async () => {
		try {
			const token = await getToken();
			if (!token) {
				// Mock data for preview
				setPayments([
					{ id: 1, student: 'Ana Silva', amount: 297, plan: 'Academy', date: 'Jan 10', status: 'success' },
					{ id: 2, student: 'Carlos Mendes', amount: 997, plan: 'VIP', date: 'Jan 10', status: 'success' },
					{ id: 3, student: 'Juliana Costa', amount: 297, plan: 'Academy', date: 'Jan 9', status: 'success' },
					{ id: 4, student: 'Pedro Santos', amount: 997, plan: 'VIP', date: 'Jan 9', status: 'failed' },
					{ id: 5, student: 'Maria Oliveira', amount: 297, plan: 'Academy', date: 'Jan 8', status: 'success' },
				]);
				setFailedPayments([
					{ id: 4, student: 'Pedro Santos', amount: 997, plan: 'VIP', date: 'Jan 9', reason: 'Card Declined' },
					{ id: 6, student: 'Fernanda Cruz', amount: 297, plan: 'Academy', date: 'Jan 8', reason: 'Expired Card' },
				]);
				setLoading(false);
				return;
			}

			const { data } = await axios.get(`${backendUrl}/api/educator/payments`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (data.success) {
				setPayments(data.payments);
				setFailedPayments(data.failedPayments || []);
				setStats(data.stats || stats);
			}
		} catch (error) {
			console.error('Error fetching payments:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-white p-4 md:p-8">
			<div className="max-w-7xl mx-auto space-y-6">
				{/* Header */}
				<div>
					<h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">Payments & Billing</h1>
					<p className="text-[#666666] mt-1">Manage transactions, subscriptions, and billing</p>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<MetricCard
						title="This Month Revenue"
						value={`R$${stats.thisMonth.toLocaleString()}`}
						subtitle="On track for R$100K"
						icon={<DollarSign className="w-6 h-6" />}
						color="green"
						trend={{ positive: true, value: "+12%" }}
					/>
					<MetricCard
						title="This Year Revenue"
						value={`R$${stats.thisYear.toLocaleString()}`}
						subtitle="Total revenue"
						icon={<TrendingUp className="w-6 h-6" />}
						color="sofluent-pink"
					/>
					<MetricCard
						title="Active Subscriptions"
						value={stats.activeSubs}
						subtitle="Monthly recurring"
						icon={<DollarSign className="w-6 h-6" />}
						color="sofluent-accent"
					/>
					<MetricCard
						title="Success Rate"
						value={`${stats.successRate}%`}
						subtitle="Payment success"
						icon={<TrendingUp className="w-6 h-6" />}
						color="yellow"
					/>
				</div>

				{/* Failed Payments Alert */}
				{failedPayments.length > 0 && (
					<div className="bg-red-50 border border-red-200 rounded-xl p-6">
						<div className="flex items-center gap-3 mb-4">
							<AlertCircle className="w-6 h-6 text-red-600" />
							<h2 className="text-lg font-semibold text-red-900">Failed Payments (Action Required!)</h2>
						</div>
						<div className="space-y-3">
							{failedPayments.map((payment) => (
								<div key={payment.id} className="bg-white rounded-lg p-4 flex items-center justify-between">
									<div>
										<p className="font-semibold text-[#1A1A1A]">{payment.student}</p>
										<p className="text-sm text-[#666666]">
											R${payment.amount} - {payment.plan} ({payment.reason})
										</p>
										<p className="text-xs text-[#666666]">Last attempt: {payment.date}</p>
									</div>
									<div className="flex gap-2">
										<button className="px-4 py-2 bg-[#E91E63] text-white rounded-lg hover:bg-[#C2185B] transition-colors text-sm">
											Send Reminder
										</button>
										<button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
											Contact
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Recent Transactions */}
				<div className="bg-white rounded-xl shadow-md border border-gray-200">
					<div className="p-6 border-b border-gray-200 flex items-center justify-between">
						<h2 className="text-lg font-semibold text-[#1A1A1A]">Recent Transactions</h2>
						<div className="flex gap-2">
							<button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
								<Download className="w-5 h-5 text-gray-600" />
							</button>
							<button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
								<RefreshCw className="w-5 h-5 text-gray-600" />
							</button>
						</div>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-semibold text-[#1A1A1A]">Date</th>
									<th className="px-6 py-3 text-left text-xs font-semibold text-[#1A1A1A]">Student</th>
									<th className="px-6 py-3 text-left text-xs font-semibold text-[#1A1A1A]">Amount</th>
									<th className="px-6 py-3 text-left text-xs font-semibold text-[#1A1A1A]">Plan</th>
									<th className="px-6 py-3 text-left text-xs font-semibold text-[#1A1A1A]">Status</th>
								</tr>
							</thead>
							<tbody>
								{payments.map((payment) => (
									<tr key={payment.id} className="border-t border-gray-200 hover:bg-gray-50">
										<td className="px-6 py-4 text-sm text-[#666666]">{payment.date}</td>
										<td className="px-6 py-4 text-sm font-semibold text-[#1A1A1A]">{payment.student}</td>
										<td className="px-6 py-4 text-sm font-semibold text-[#1A1A1A]">R${payment.amount}</td>
										<td className="px-6 py-4 text-sm text-[#666666]">{payment.plan}</td>
										<td className="px-6 py-4">
											<span className={`px-2 py-1 rounded-full text-xs font-semibold ${
												payment.status === 'success'
													? 'bg-green-100 text-green-700'
													: 'bg-red-100 text-red-700'
											}`}>
												{payment.status === 'success' ? '✓ Success' : '✗ Failed'}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Payments;
