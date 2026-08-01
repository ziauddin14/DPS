import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card } from './ui';

/**
 * TaskStatusDonut component.
 * Renders a responsive donut chart showing task distribution by status.
 *
 * @param {Object} tasks - Object containing task counts (pending, inProgress, completed, total).
 * @param {boolean} isLoading - Controls loading skeleton state.
 */
function TaskStatusDonut({ tasks, isLoading = false }) {
  const pending = tasks?.pending ?? 0;
  const inProgress = tasks?.inProgress ?? 0;
  const completed = tasks?.completed ?? 0;
  const total = tasks?.total ?? (pending + inProgress + completed);

  const data = [
    { name: 'Pending', value: pending, color: '#f59e0b' },
    { name: 'In Progress', value: inProgress, color: '#3b82f6' },
    { name: 'Completed', value: completed, color: '#10b981' },
  ].filter(item => item.value > 0);

  const isEmpty = data.length === 0;

  if (isLoading) {
    return (
      <Card title="Task Distribution" subtitle="Tasks by status breakdown">
        <div className="flex flex-col items-center justify-center h-[260px] animate-pulse space-y-4">
          <div className="w-36 h-36 rounded-full border-8 border-slate-100 dark:border-slate-700 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-700" />
          </div>
          <div className="flex justify-center gap-4 w-full">
            <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        </div>
      </Card>
    );
  }

  // Custom tooltips for premium feel
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataInfo = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700 px-3 py-2 rounded-xl shadow-lg text-xs font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dataInfo.color }} />
          <span>{dataInfo.name}:</span>
          <span className="font-bold text-slate-900 dark:text-white">{dataInfo.value}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <Card title="Task Status" subtitle="Overview of task progression">
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center h-[260px] text-center">
          <span className="text-4xl mb-2" role="img" aria-label="Inbox">📥</span>
          <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">No tasks created yet.</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 h-[260px]">
          {/* Donut Chart Container */}
          <div className="relative w-44 h-44 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      className="transition-colors duration-200 outline-none hover:opacity-85"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text displaying total */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 select-none tracking-tight">
                {total}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest select-none">
                Total Tasks
              </span>
            </div>
          </div>

          {/* Custom Legend */}
          <div className="flex flex-col gap-3 flex-1 min-w-0 w-full">
            {[
              { label: 'Pending', count: pending, color: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
              { label: 'In Progress', count: inProgress, color: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400' },
              { label: 'Completed', count: completed, color: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
            ].map(item => (
              <div 
                key={item.label}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50/50 dark:bg-slate-700/20 border border-slate-100/50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-3 h-3 rounded-full flex-shrink-0 ${item.color}`} />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">
                    {item.label}
                  </span>
                </div>
                <span className={`text-xs font-bold ${item.text}`}>
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

export default TaskStatusDonut;
export { TaskStatusDonut };
