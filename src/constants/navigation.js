import {
  LayoutDashboard,
  CheckSquare,
  Phone,
  ClipboardList,
  Target,
  CalendarDays,
  Briefcase,
  BookOpen,
  Bot,
  Settings,
} from 'lucide-react';

/**
 * Application navigation items.
 * Each item maps a route path to its label and Lucide icon component.
 */
export const NAV_ITEMS = [
  { path: '/',          label: 'Dashboard',       icon: LayoutDashboard },
  { path: '/tasks',     label: 'Tasks',            icon: CheckSquare     },
  { path: '/followups', label: 'Follow-ups',       icon: Phone          },
  { path: '/worklog',   label: 'Daily Work Log',   icon: ClipboardList   },
  { path: '/goals',     label: 'Goals',            icon: Target          },
  { path: '/calendar',  label: 'Calendar',         icon: CalendarDays    },
  { path: '/projects',  label: 'Projects',         icon: Briefcase       },
  { path: '/knowledge', label: 'Knowledge Vault',  icon: BookOpen        },
  { path: '/ai',        label: 'AI Secretary',     icon: Bot             },
  { path: '/settings',  label: 'Settings',         icon: Settings        },
];

/**
 * Maps a route path to a human-readable page title shown in the Navbar.
 */
export const PAGE_TITLES = {
  '/':          'Dashboard',
  '/tasks':     'Tasks',
  '/followups': 'Follow-ups',
  '/worklog':   'Daily Work Log',
  '/goals':     'Goals',
  '/calendar':  'Calendar',
  '/projects':  'Projects',
  '/knowledge': 'Knowledge Vault',
  '/ai':        'AI Secretary',
  '/settings':  'Settings',
};
