import React from 'react';
import { LayoutDashboard, CheckSquare, BarChart2, Settings, Plus, Filter, Tag } from 'lucide-react';
import { cn } from '../lib/utils';
import { Category } from '../types';

interface SidebarProps {
  activeTab: 'board' | 'stats';
  onTabChange: (tab: 'board' | 'stats') => void;
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  theme?: 'light' | 'dark';
}

export function Sidebar({ activeTab, onTabChange, categories, selectedCategory, onCategorySelect, theme }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 h-screen flex flex-col bg-slate-50/50 dark:bg-slate-900/50 transition-colors">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8 group cursor-default">
          <div className="w-8 h-8 aura-gradient rounded-lg flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-105 transition-transform">
            <CheckSquare className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight font-display">Aura TM</h1>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => onTabChange('board')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === 'board' 
                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            Board
          </button>
          <button
            onClick={() => onTabChange('stats')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === 'stats' 
                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
            )}
          >
            <BarChart2 className="w-4 h-4" />
            Analytics
          </button>
        </nav>

        <div className="mt-10">
          <div className="flex items-center justify-between px-3 mb-4">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Categories</span>
            <Tag className="w-3 h-3 text-slate-400 dark:text-slate-500" />
          </div>
          <div className="space-y-1">
            <button
              onClick={() => onCategorySelect(null)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                selectedCategory === null 
                  ? "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/30"
              )}
            >
              <Filter className="w-4 h-4 opacity-70" />
              All Tasks
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  selectedCategory === category.id 
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/30"
                )}
              >
                <div className="relative">
                  <span className="w-2.5 h-2.5 rounded-full block" style={{ backgroundColor: category.color }} />
                  <span className="absolute inset-0 rounded-full blur-[2px] opacity-40 animate-pulse" style={{ backgroundColor: category.color }} />
                </div>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-slate-200 dark:border-slate-800">
        <button className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </aside>
  );
}
