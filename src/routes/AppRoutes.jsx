import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';

import Dashboard  from '../pages/Dashboard';
import Tasks      from '../pages/Tasks';
import FollowUps  from '../pages/FollowUps';
import WorkLogs   from '../pages/WorkLogs';
import Goals      from '../pages/Goals';
import Calendar   from '../pages/Calendar';
import Projects   from '../pages/Projects';
import Knowledge  from '../pages/Knowledge';
import AISecretary from '../pages/AISecretary';
import Settings   from '../pages/Settings';

/**
 * Application route configuration.
 * All routes are children of MainLayout, which renders them via <Outlet />.
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true,          element: <Dashboard /> },
      { path: 'tasks',        element: <Tasks />     },
      { path: 'followups',    element: <FollowUps />  },
      { path: 'worklog',      element: <WorkLogs />   },
      { path: 'goals',        element: <Goals />     },
      { path: 'calendar',     element: <Calendar />  },
      { path: 'projects',     element: <Projects />  },
      { path: 'knowledge',    element: <Knowledge /> },
      { path: 'ai',           element: <AISecretary /> },
      { path: 'settings',     element: <Settings />  },
    ],
  },
]);

/**
 * AppRoutes — mounts the RouterProvider with the configured router.
 */
function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;
