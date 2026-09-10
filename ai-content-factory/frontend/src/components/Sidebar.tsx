'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  FolderLock,
  Cpu,
  Brain,
  Video,
  Database,
  BarChart3,
  Settings,
  ShieldCheck,
  FileSpreadsheet,
  Moon,
  Sun,
  ChevronDown
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeWorkspace, setActiveWorkspace] = useState('Kids Education');
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Content Planner', href: '/planner', icon: Calendar },
    { name: 'AI Generators', href: '/generators', icon: Video },
    { name: 'Asset & Prompts', href: '/library', icon: FolderLock },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'API Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-30">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg pulse-glow">
          CF
        </div>
        <div>
          <h1 className="font-bold text-white tracking-wide text-sm">CONTENT FACTORY</h1>
          <span className="text-xs text-indigo-400 font-semibold">Enterprise OS</span>
        </div>
      </div>

      {/* Workspace Switcher */}
      <div className="px-4 py-3 relative border-b border-slate-800">
        <button
          onClick={() => setWorkspaceOpen(!workspaceOpen)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-sm text-slate-200 transition"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="font-medium truncate max-w-[120px]">{activeWorkspace}</span>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>

        {workspaceOpen && (
          <div className="absolute left-4 right-4 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-50">
            {['Kids Education', 'Personal Brand', 'Corporate Marketing', 'Finance & Crypto'].map(ws => (
              <button
                key={ws}
                onClick={() => {
                  setActiveWorkspace(ws);
                  setWorkspaceOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-indigo-600 hover:text-white text-xs font-medium transition"
              >
                {ws}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation list */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'hover:bg-slate-800/80 hover:text-slate-100'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer info & Controls */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Theme Mode</span>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-slate-300 transition"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 p-2 bg-slate-800/35 border border-slate-700/30 rounded-lg">
          <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-sm">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">SaaS Admin</p>
            <p className="text-[10px] text-slate-500 truncate">admin@ai-content.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
