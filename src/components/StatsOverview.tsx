import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { Task } from '../types';
import { DEFAULT_CATEGORIES } from '../constants';

interface StatsOverviewProps {
  tasks: Task[];
}

export function StatsOverview({ tasks }: StatsOverviewProps) {
  // Priority Distribution
  const priorityData = [
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#3b82f6' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#f59e0b' },
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#ef4444' },
  ];

  // Status Distribution
  const statusData = [
    { name: 'To Do', value: tasks.filter(t => t.status === 'todo').length, color: '#94a3b8' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: '#6366f1' },
    { name: 'Done', value: tasks.filter(t => t.status === 'done').length, color: '#10b981' },
  ];

  // Category Distribution
  const categoryData = DEFAULT_CATEGORIES.map(cat => ({
    name: cat.name,
    value: tasks.filter(t => t.category === cat.id).length,
    color: cat.color
  })).filter(d => d.value > 0);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="p-8 space-y-8 animate-in transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-lg">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-widest pl-0.5">Total Tasks</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white font-display">{totalTasks}</p>
          <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full aura-gradient opacity-80" style={{ width: '100%' }} />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-lg">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-widest pl-0.5">Completed</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white font-display">{completedTasks}</p>
          <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${completionRate}%` }} />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-lg">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-widest pl-0.5">Efficiency</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white font-display">{completionRate}%</p>
          <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: `${completionRate}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8 font-display">Status Analytics</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={document.documentElement.classList.contains('dark') ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
                    borderColor: document.documentElement.classList.contains('dark') ? '#1e293b' : '#e2e8f0',
                    borderRadius: '12px',
                    color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#0f172a'
                  }} 
                  cursor={{ fill: 'transparent' }} 
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8 font-display">Domain Weight</h3>
          <div className="h-64 flex items-center justify-center">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
                      borderColor: document.documentElement.classList.contains('dark') ? '#1e293b' : '#e2e8f0',
                      borderRadius: '12px',
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">No Domain Data</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
