import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckSquare, Shield, User, ArrowRight, Sparkles } from 'lucide-react';
import { Role, User as UserType } from '../types';
import { MOCK_USERS } from '../constants';
import { cn } from '../lib/utils';

interface LoginProps {
  onLogin: (user: UserType) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [role, setRole] = useState<Role>('admin');
  const [email, setEmail] = useState('admin@aura.com');

  const handleToggle = (r: Role) => {
    setRole(r);
    setEmail(r === 'admin' ? 'admin@aura.com' : 'jordan@aura.com');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = MOCK_USERS.find(u => u.email === email && u.role === role);
    if (user) {
      onLogin(user);
    } else {
      alert('Invalid credentials for selected role');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-500 overflow-hidden relative">
      {/* Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full animate-pulse" />

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 dark:border-slate-800 relative z-10">
        
        {/* Left Side: Visual/Branding */}
        <div className={cn(
          "hidden md:flex flex-col justify-between p-12 text-white relative transition-all duration-700",
          role === 'admin' ? "bg-indigo-600" : "aura-gradient"
        )}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
              <CheckSquare className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold font-display tracking-tight">Aura TM</span>
          </div>

          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={role}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <h2 className="text-4xl font-bold leading-tight font-display">
                  {role === 'admin' ? 'Orchestrate Excellence.' : 'Focus on what matters.'}
                </h2>
                <p className="text-white/70 text-lg">
                  {role === 'admin' 
                    ? 'Command your team, assign objectives, and track real-time progress through our premium dashboard.' 
                    : 'Streamline your workflow and stay ahead of your deadlines with your personalized task environment.'}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-white/50">
            <Sparkles className="w-4 h-4 text-orange-300" />
            <span>Trusted by 10,000+ Teams Worldwide</span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display mb-2">Welcome Back</h1>
            <p className="text-slate-500 dark:text-slate-400">Select your portal to continue</p>
          </div>

          {/* Role Toggle */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-8">
            <button
              onClick={() => handleToggle('admin')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
                role === 'admin' 
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              <Shield className="w-4 h-4" />
              Admin Portal
            </button>
            <button
              onClick={() => handleToggle('employee')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
                role === 'employee' 
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              <User className="w-4 h-4" />
              Employee Portal
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="portal-email" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block pl-1">
                Portal Email
              </label>
              <div className="relative">
                <input
                  id="portal-email"
                  type="email"
                  value={email}
                  readOnly
                  title="Portal Email"
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-default"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg">
                  DEMO PASS
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="secret-access" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block pl-1">
                Secret Access
              </label>
              <input
                id="secret-access"
                type="password"
                defaultValue="••••••••"
                readOnly
                title="Secret Access"
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 outline-none cursor-default"
              />
            </div>

            <button
              type="submit"
              className={cn(
                "w-full py-4 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-2 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]",
                role === 'admin' ? "bg-indigo-600 shadow-indigo-500/20" : "aura-gradient shadow-red-500/20"
              )}
            >
              Authenticate Portal
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-600 font-medium uppercase tracking-widest">
            Secured by Aura Security Protocols
          </p>
        </div>
      </div>
    </div>
  );
}
