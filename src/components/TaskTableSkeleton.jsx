/**
 * TaskTableSkeleton component - Loading skeleton for TaskTable
 */
function TaskTableSkeleton({ count = 6 }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-12">
                <span className="sr-only">Select</span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Task Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Dependency
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Deadline
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array.from({ length: count }).map((_, i) => (
              <tr key={i}>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="w-5 h-5 rounded bg-slate-200 animate-pulse" />
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="h-6 w-16 bg-slate-200 rounded animate-pulse" />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="h-6 w-12 bg-slate-200 rounded animate-pulse" />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="h-6 w-14 bg-slate-200 rounded animate-pulse" />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="h-6 w-20 bg-slate-200 rounded animate-pulse" />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-8 h-8 bg-slate-200 rounded-lg animate-pulse" />
                    <div className="w-8 h-8 bg-slate-200 rounded-lg animate-pulse" />
                    <div className="w-8 h-8 bg-slate-200 rounded-lg animate-pulse" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TaskTableSkeleton;
export { TaskTableSkeleton };
