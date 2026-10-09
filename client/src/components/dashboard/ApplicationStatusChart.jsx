import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

export default function ApplicationStatusChart({ applications }) {
  // Aggregate application counts across 5 statuses
  const statusCounts = {
    Applied: 0,
    'Under Review': 0,
    Shortlisted: 0,
    Selected: 0,
    Rejected: 0,
  };

  applications.forEach((app) => {
    if (statusCounts[app.status] !== undefined) {
      statusCounts[app.status] += 1;
    }
  });

  const chartData = [
    { name: 'Applied', count: statusCounts.Applied, color: '#3157D5' },
    { name: 'Under Review', count: statusCounts['Under Review'], color: '#B7791F' },
    { name: 'Shortlisted', count: statusCounts.Shortlisted, color: '#6478F0' },
    { name: 'Selected', count: statusCounts.Selected, color: '#168568' },
    { name: 'Rejected', count: statusCounts.Rejected, color: '#C2414B' },
  ];

  const totalApps = applications.length;

  return (
    <div className="bg-white rounded-2xl border border-[#E4E8F0] p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-[#14213D]">
            Application Stage Distribution
          </h3>
          <p className="text-xs text-[#667085]">
            Progress tracking across {totalApps} total active submissions
          </p>
        </div>
      </div>

      <div className="h-64 w-full pt-2">
        {totalApps === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-[#667085]">
            No applications submitted yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fill: '#667085', fontSize: 11 }}
                axisLine={{ stroke: '#E4E8F0' }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: '#667085', fontSize: 11 }}
                axisLine={{ stroke: '#E4E8F0' }}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(246, 248, 252, 0.7)' }}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid #E4E8F0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend summary pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-[#F8FAFC] text-[11px]">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5 text-[#667085]">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="truncate">{item.name}:</span>
            <strong className="text-[#14213D]">{item.count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
