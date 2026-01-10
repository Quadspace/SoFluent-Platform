import React from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';

const RevenueChart = ({ data = [] }) => {
	// Mock data for last 30 days
	const generateMockData = () => {
		const days = [];
		const today = new Date();
		for (let i = 29; i >= 0; i--) {
			const date = new Date(today);
			date.setDate(date.getDate() - i);
			days.push({
				date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
				revenue: Math.floor(Math.random() * 5000) + 2000 // R$2,000 - R$7,000 per day
			});
		}
		return days;
	};

	const chartData = data.length > 0 ? data : generateMockData();
	const maxRevenue = Math.max(...chartData.map(d => d.revenue));
	const totalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0);
	const avgDaily = Math.floor(totalRevenue / chartData.length);
	const growth = '+12%'; // Mock growth

	return (
		<div className="bg-white rounded-xl shadow-md p-6 border border-gray-200" data-revenue-chart>
			<div className="flex items-center justify-between mb-6">
				<div>
					<h3 className="text-lg font-semibold text-[#1A1A1A] flex items-center gap-2">
						<DollarSign className="w-5 h-5 text-[#E91E63]" />
						Revenue Chart (Last 30 Days)
					</h3>
					<p className="text-sm text-gray-500 mt-1">Total: R${totalRevenue.toLocaleString()}</p>
				</div>
				<div className="flex items-center gap-2 text-green-600">
					<TrendingUp className="w-4 h-4" />
					<span className="text-sm font-medium">{growth}</span>
				</div>
			</div>
			
			<div className="relative h-64">
				{/* Chart bars */}
				<div className="flex items-end justify-between h-full gap-1">
					{chartData.map((day, index) => {
						const height = (day.revenue / maxRevenue) * 100;
						return (
							<div
								key={index}
								className="flex-1 flex flex-col items-center group relative"
								style={{ height: '100%' }}
							>
								<div
									className="w-full bg-gradient-to-t from-[#E91E63] to-[#E91E63]/60 rounded-t transition-all hover:opacity-80 cursor-pointer"
									style={{ height: `${height}%`, minHeight: '4px' }}
									title={`${day.date}: R$${day.revenue.toLocaleString()}`}
								/>
								{index % 5 === 0 && (
									<span className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-left whitespace-nowrap">
										{day.date}
									</span>
								)}
							</div>
						);
					})}
				</div>
				
				{/* Grid lines */}
				<div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
					{[0, 25, 50, 75, 100].map((percent) => (
						<div
							key={percent}
							className="border-t border-gray-200"
							style={{ marginTop: `${percent === 0 ? 0 : 100 - percent}%` }}
						/>
					))}
				</div>
			</div>
			
			{/* Stats */}
			<div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
				<div>
					<p className="text-xs text-gray-500">Average Daily</p>
					<p className="text-lg font-semibold text-gray-800">R${avgDaily.toLocaleString()}</p>
				</div>
				<div>
					<p className="text-xs text-gray-500">Peak Day</p>
					<p className="text-lg font-semibold text-gray-800">
						R${Math.max(...chartData.map(d => d.revenue)).toLocaleString()}
					</p>
				</div>
				<div>
					<p className="text-xs text-gray-500">Growth</p>
					<p className="text-lg font-semibold text-green-600">{growth}</p>
				</div>
			</div>
		</div>
	);
};

export default RevenueChart;
