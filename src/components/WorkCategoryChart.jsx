import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Card } from './ui';

/**
 * WorkCategoryChart component.
 * Renders a horizontal bar chart displaying hours spent per activity category.
 *
 * @param {Array} categoryBreakdown - List of objects: { category: string, hours: number }.
 * @param {boolean} isLoading - Controls loading skeleton state.
 */
function WorkCategoryChart({ categoryBreakdown = [], isLoading = false }) {
  const data = Array.isArray(categoryBreakdown) ? categoryBreakdown : [];
  const isEmpty = data.length === 0;

  if (isLoading) {
    return (
      <Card title="Time by Category" subtitle="Hours spent in the last 7 days">
        <div className="space-y-4 h-[260px] flex flex-col justify-center animate-pulse">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="space-y-2">
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24" />
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-full" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // Custom tooltips for premium feel
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataInfo = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700 px-3 py-2 rounded-xl shadow-lg text-xs font-semibold text-slate-800 dark:text-slate-100 flex flex-col gap-0.5">
          <span className="text-slate-400 dark:text-slate-550">{dataInfo.category}</span>
          <span className="font-bold text-primary-600 dark:text-primary-400 text-sm">
            {dataInfo.hours} {dataInfo.hours === 1 ? 'hour' : 'hours'}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <Card title="Time by Category" subtitle="Hours spent in the last 7 days">
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center h-[260px] text-center">
          <span className="text-4xl mb-2" role="img" aria-label="Clock">📊</span>
          <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">No work logged in this period.</p>
        </div>
      ) : (
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 15, left: -20, bottom: 5 }}
            >
              <XAxis 
                type="number" 
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
              />
              <YAxis 
                dataKey="category" 
                type="category" 
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }} />
              <Bar 
                dataKey="hours" 
                fill="#3b82f6" 
                radius={[0, 8, 8, 0]}
                maxBarSize={20}
                className="hover:fill-primary-600 transition-colors duration-200 cursor-pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}

export default WorkCategoryChart;
export { WorkCategoryChart };
