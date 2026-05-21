import React from 'react';
import { motion } from 'motion/react';
import { Clock, MoreVertical, Trash2, Edit2, ArrowRight, User } from 'lucide-react';
import { Task, Priority, Status } from '../types';
import { PRIORITY_COLORS, DEFAULT_CATEGORIES, MOCK_USERS } from '../constants';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onStatusChange: (id: string, status: Status) => void;
  isAdmin?: boolean;
}

export function TaskCard({ task, onDelete, onEdit, onStatusChange, isAdmin }: TaskCardProps) {
  const category = DEFAULT_CATEGORIES.find(c => c.id === task.category);
  const assignee = MOCK_USERS.find(u => u.id === task.assignedTo);
  
  const nextStatusMap: Record<Status, Status | null> = {
    'todo': 'in-progress',
    'in-progress': 'done',
    'done': null
  };

  const nextStatus = nextStatusMap[task.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-wrap gap-2">
          <span className={cn(
            "text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg border",
            PRIORITY_COLORS[task.priority]
          )}>
            {task.priority}
          </span>
          {category && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shadow-sm transition-colors">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: category.color }} />
              {category.name}
            </span>
          )}
        </div>
        
        {isAdmin && (
          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
            <button 
              onClick={() => onEdit(task)}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onDelete(task.id)}
              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1.5 line-clamp-2 leading-tight text-base font-display">{task.title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-xs mb-5 line-clamp-3 leading-relaxed">{task.description}</p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold tracking-wide">
              {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
            </span>
          </div>
          {assignee && (
            <div className="flex items-center gap-1.5 overflow-hidden">
              <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <User className="w-3 h-3 text-slate-400" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 truncate">
                {assignee.name}
              </span>
            </div>
          )}
        </div>

        {nextStatus && (
          <button
            onClick={() => onStatusChange(task.id, nextStatus)}
            className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors uppercase tracking-widest pl-3 py-1 group/btn"
          >
            Next
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
