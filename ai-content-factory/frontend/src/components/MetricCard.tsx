'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ComponentType<{ className?: string }>;
  colorClass?: string;
}

export default function MetricCard({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
  colorClass = 'indigo'
}: MetricCardProps) {
  const colorMap: Record<string, string> = {
    indigo: 'from-indigo-500/10 to-purple-500/5 border-indigo-500/20 text-indigo-400',
    emerald: 'from-emerald-500/10 to-teal-500/5 border-emerald-500/20 text-emerald-400',
    rose: 'from-rose-500/10 to-pink-500/5 border-rose-500/20 text-rose-400',
    amber: 'from-amber-500/10 to-orange-500/5 border-amber-500/20 text-amber-400'
  };

  return (
    <div className={`glass-card p-6 bg-gradient-to-br ${colorMap[colorClass] || colorMap.indigo} rounded-2xl`}>
      <div className="flex justify-between items-start">
        <span className="text-slate-400 text-xs font-semibold tracking-wider uppercase">{title}</span>
        <div className={`p-2 rounded-xl bg-slate-800/40 border border-slate-700/30`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold tracking-tight">{value}</span>
        <span className={`flex items-center text-xs font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {change}
        </span>
      </div>
      
      <div className="mt-2 text-[10px] text-slate-500 font-medium">
        vs. previous 30 days
      </div>
    </div>
  );
}
