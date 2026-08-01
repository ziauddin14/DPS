import { useState, useEffect, useCallback } from 'react';
import { CheckSquare, Clock, Activity, PhoneCall, CalendarDays, Target, AlertCircle } from 'lucide-react';
import DashboardHeader from '../components/DashboardHeader';
import StatsCard from '../components/StatsCard';
import AIRecommendationCard from '../components/AIRecommendationCard';
import TaskStatusDonut from '../components/TaskStatusDonut';
import WorkCategoryChart from '../components/WorkCategoryChart';
import WorkLogHeatmap from '../components/WorkLogHeatmap';
import GoalsProgress from '../components/GoalsProgress';
import TodayTimeline from '../components/TodayTimeline';
import ProjectsProgress from '../components/ProjectsProgress';
import RecentKnowledge from '../components/RecentKnowledge';
import dashboardService from '../services/dashboardService';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';

// Number of skeleton cards shown while loading stats
const STATS_SKELETON_COUNT = 6;

/**
 * Dashboard Page.
 * Upgraded premium executive dashboard integrating interactive charts, heatmap,
 * timeline, and progress indicators from live MERN API aggregates.
 */
function Dashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Toast notifications hook
  const { toasts, showToast, removeToast } = useToast();

  const fetchDashboardStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await dashboardService.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.message || 'Failed to fetch dashboard data.');
      }
    } catch {
      setError('Could not retrieve dashboard data from server. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch stats on mount
  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  // Construct statistics cards definition based on live state
  const getStatsData = () => {
    if (!stats) return [];
    return [
      {
        title:       'Total Tasks',
        value:       String(stats.tasks?.total ?? 0).padStart(2, '0'),
        icon:        CheckSquare,
        description: 'All tasks',
        colorClass:  'text-blue-605 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400',
      },
      {
        title:       'Pending Tasks',
        value:       String(stats.tasks?.pending ?? 0).padStart(2, '0'),
        icon:        Clock,
        description: 'Awaiting start',
        colorClass:  'text-amber-605 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400',
      },
      {
        title:       'In Progress Tasks',
        value:       String(stats.tasks?.inProgress ?? 0).padStart(2, '0'),
        icon:        Activity,
        description: 'Currently working on',
        colorClass:  'text-purple-605 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400',
      },
      {
        title:       "Today's Follow-ups",
        value:       String(stats.followups?.todayFollowups ?? 0).padStart(2, '0'),
        icon:        PhoneCall,
        description: 'Due today',
        colorClass:  'text-emerald-650 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400',
      },
      {
        title:       "Today's Meetings",
        value:       String(stats.calendar?.todayEvents?.length ?? 0).padStart(2, '0'),
        icon:        CalendarDays,
        description: 'Scheduled today',
        colorClass:  'text-rose-605 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-400',
      },
      {
        title:       'Active Goals',
        value:       String(stats.goals?.active ?? 0).padStart(2, '0'),
        icon:        Target,
        description: 'Not completed',
        colorClass:  'text-indigo-605 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400',
      },
    ];
  };

  const statsData = getStatsData();

  return (
    <div className="p-6 sm:p-8 space-y-4 max-w-7xl mx-auto relative min-h-[calc(100vh-70px)]">
      
      {/* 1. Page Header */}
      <DashboardHeader />

      {/* Error Banner */}
      {error && (
        <div className="flex items-center justify-between gap-3 p-4 bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm font-semibold rounded-xl">
          <div className="flex items-center gap-2 min-w-0">
            <AlertCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-xs font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-300 rounded"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2. AI Focus Card (Temporarily commented out)
      <div className="border-2 border-primary-500/20 dark:border-primary-500/30 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
        <AIRecommendationCard />
      </div>
      */}

      {/* 3. KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {isLoading
          ? Array.from({ length: STATS_SKELETON_COUNT }).map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm p-6 animate-pulse space-y-4"
                aria-hidden="true"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl" />
                  <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-24" />
                </div>
                <div className="h-8 bg-slate-100 dark:bg-slate-700 rounded w-12" />
              </div>
            ))
          : statsData.map((stat, index) => (
              <StatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                description={stat.description}
                colorClass={stat.colorClass}
              />
            ))}
      </div>

      {/* 4. Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TaskStatusDonut tasks={stats?.tasks} isLoading={isLoading} />
        <WorkCategoryChart categoryBreakdown={stats?.workLogs?.categoryBreakdown} isLoading={isLoading} />
      </div>

      {/* 5. Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 h-full">
          <WorkLogHeatmap
            dailyHeatmap={stats?.workLogs?.dailyHeatmap}
            streak={stats?.workLogs?.streak}
            isLoading={isLoading}
          />
        </div>
        <div className="h-full flex flex-col">
          <GoalsProgress goalProgress={stats?.goalProgress} isLoading={isLoading} />
        </div>
      </div>

      {/* 6. Today's Work */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodayTimeline todayTimeline={stats?.todayTimeline} isLoading={isLoading} />
        <ProjectsProgress activeProjects={stats?.projects?.activeProjects} isLoading={isLoading} />
      </div>

      {/* 7. Recent Knowledge */}
      <div className="w-full">
        <RecentKnowledge recentNotes={stats?.knowledge?.recentNotes} isLoading={isLoading} />
      </div>

      {/* Toast notifications */}
      <Toast toasts={toasts} onRemove={removeToast} />

    </div>
  );
}

export default Dashboard;
export { Dashboard };
