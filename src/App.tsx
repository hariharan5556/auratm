/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, LayoutGrid, Calendar, ChevronRight, Bell, User, Sun, Moon, LogOut } from 'lucide-react';
import { nanoid } from 'nanoid';
import { Sidebar } from './components/Sidebar';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';
import { StatsOverview } from './components/StatsOverview';
import { Login } from './components/Login';
import { Task, Status, Category, User as UserType } from './types';
import { DEFAULT_CATEGORIES, STATUS_LABELS } from './constants';
import { cn } from './lib/utils';
import { fetchTasks, upsertTask, deleteTaskById, backupTasks, isSupabaseConfigured } from './lib/supabase';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('aura_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
    const saved = localStorage.getItem('aura_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<'board' | 'stats'>('board');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    // always keep a local cache; if Supabase configured we also persist remotely
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
    if (isSupabaseConfigured) {
      // best-effort background backup to Supabase storage
      backupTasks(tasks).catch(() => {
        // ignore backup errors here
      });
    }
  }, [tasks]);

  useEffect(() => {
    // On mount, prefer remote tasks when Supabase is configured
    if (isSupabaseConfigured) {
      (async () => {
        try {
          const remote = await fetchTasks();
          if (remote && remote.length) setTasks(remote);
          else {
            const saved = localStorage.getItem('taskflow_tasks');
            if (saved) setTasks(JSON.parse(saved));
          }
        } catch (err) {
          const saved = localStorage.getItem('taskflow_tasks');
          if (saved) setTasks(JSON.parse(saved));
        }
      })();
    } else {
      const saved = localStorage.getItem('taskflow_tasks');
      if (saved) setTasks(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('aura_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('aura_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('aura_user');
    }
  }, [currentUser]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  const handleLogout = () => setCurrentUser(null);

  const filteredTasks = useMemo(() => {
    if (!currentUser) return [];
    return tasks.filter(task => {
      // Role-based visibility
      const isAdmin = currentUser.role === 'admin';
      const isAssignedToMe = task.assignedTo === currentUser.id;
      const isVisible = isAdmin || isAssignedToMe;
      
      if (!isVisible) return false;

      const matchesCategory = selectedCategory ? task.category === selectedCategory : true;
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           task.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [tasks, selectedCategory, searchQuery, currentUser]);

  const handleAddTask = (taskData: Partial<Task>) => {
    if (!currentUser) return;
    const newTask: Task = {
      id: nanoid(),
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      category: taskData.category || DEFAULT_CATEGORIES[0].id,
      dueDate: taskData.dueDate || new Date().toISOString(),
      status: 'todo',
      createdAt: new Date().toISOString(),
      createdBy: currentUser.id,
      assignedTo: taskData.assignedTo,
    };
    setTasks(prev => [newTask, ...prev]);
    if (isSupabaseConfigured) {
      upsertTask(newTask).catch(() => {/* ignore remote error for now */});
      backupTasks([newTask, ...tasks]).catch(() => {/* ignore backup error */});
    }
  };

  const handleUpdateTask = (taskData: Partial<Task>) => {
    if (!editingTask) return;
    setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...taskData } : t));
    const updated = { ...editingTask, ...taskData } as Task;
    setEditingTask(null);
    if (isSupabaseConfigured) {
      upsertTask(updated).catch(() => {/* ignore */});
      backupTasks(tasks.map(t => t.id === updated.id ? updated : t)).catch(() => {/* ignore */});
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (isSupabaseConfigured) {
      deleteTaskById(id).catch(() => {/* ignore */});
      backupTasks(tasks.filter(t => t.id !== id)).catch(() => {/* ignore */});
    }
  };

  const handleStatusChange = (id: string, status: Status) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    if (isSupabaseConfigured) {
      const updated = tasks.find(t => t.id === id);
      if (updated) {
        const toUpsert = { ...updated, status } as Task;
        upsertTask(toUpsert).catch(() => {/* ignore */});
        backupTasks(tasks.map(t => t.id === id ? toUpsert : t)).catch(() => {/* ignore */});
      }
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  const columns: Status[] = ['todo', 'in-progress', 'done'];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        categories={DEFAULT_CATEGORIES}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        theme={theme}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-8 shrink-0 transition-colors">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm dark:text-slate-200"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-6">
            <button 
              type="button"
              title="Toggle theme"
              onClick={toggleTheme}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button type="button" title="Notifications" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
            </button>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-3 pl-2 group relative">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900 dark:text-white leading-none mb-1">{currentUser.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{currentUser.role === 'admin' ? 'Project Lead' : 'Team Member'}</p>
              </div>
              <button type="button" aria-label="Log out" onClick={handleLogout} className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center border border-indigo-200 dark:border-indigo-800 hover:border-red-500 transition-all">
                <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:hidden" />
                <LogOut className="w-4 h-4 text-red-500 hidden group-hover:block" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'board' ? (
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">Tasks Board</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    {currentUser.role === 'admin' ? 'Manage and assign project objectives.' : 'Track and execute your assigned objectives.'}
                  </p>
                </div>
                {currentUser.role === 'admin' && (
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 aura-gradient text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-red-500/20 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    Create Task
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                {columns.map(status => (
                  <div key={status} className="flex flex-col gap-4">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 dark:text-slate-200 text-sm uppercase tracking-wider">{STATUS_LABELS[status]}</h3>
                        <span className="flex items-center justify-center px-1.5 py-0.5 min-w-5 bg-slate-200 dark:bg-slate-800 rounded text-[10px] font-bold text-slate-600 dark:text-slate-400 transition-colors">
                          {filteredTasks.filter(t => t.status === status).length}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-4 min-h-125">
                      <AnimatePresence mode="popLayout">
                        {filteredTasks
                          .filter(t => t.status === status)
                          .map(task => (
                            <TaskCard 
                              key={task.id} 
                              task={task} 
                              onDelete={handleDeleteTask}
                              onEdit={openEditModal}
                              onStatusChange={handleStatusChange}
                              isAdmin={currentUser.role === 'admin'}
                            />
                          ))}
                      </AnimatePresence>
                      
                      {filteredTasks.filter(t => t.status === status).length === 0 && (
                        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 h-32 opacity-50">
                          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">No tasks here</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <StatsOverview tasks={filteredTasks} />
          )}
        </div>
      </main>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        initialTask={editingTask}
        onSubmit={editingTask ? handleUpdateTask : handleAddTask}
        userRole={currentUser.role}
      />
    </div>
  );
}
