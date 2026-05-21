import { Category, User } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'work', name: 'Work', color: '#3b82f6' },
  { id: 'personal', name: 'Personal', color: '#10b981' },
  { id: 'shopping', name: 'Shopping', color: '#f59e0b' },
  { id: 'health', name: 'Health', color: '#ef4444' },
];

export const MOCK_USERS: User[] = [
  { id: 'admin-1', name: 'Alex Rivers', email: 'admin@aura.com', role: 'admin' },
  { id: 'emp-1', name: 'Jordan Smith', email: 'jordan@aura.com', role: 'employee' },
  { id: 'emp-2', name: 'Sarah Chen', email: 'sarah@aura.com', role: 'employee' },
  { id: 'emp-3', name: 'Mike Ross', email: 'mike@aura.com', role: 'employee' },
];

export const PRIORITY_COLORS = {
  low: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
  high: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
};

export const STATUS_LABELS = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};
