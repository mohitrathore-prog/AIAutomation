'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { BarChart3, TrendingUp, Sparkles, Youtube, Twitter, Linkedin, ArrowRight } from 'lucide-react';

const viewsData = [
  { date: 'Jul 28', views: 82000, subscriberGain: 280, revenue: 82 },
  { date: 'Jul 29', views: 95000, subscriberGain: 310, revenue: 95 },
  { date: 'Jul 30', views: 104000, subscriberGain: 420, revenue: 104 },
  { date: 'Jul 31', views: 115000, subscriberGain: 490, revenue: 115 },
  { date: 'Aug 01', views: 124000, subscriberGain: 510, revenue: 124 },
  { date: 'Aug 02', views: 139000, subscriberGain: 600, revenue: 139 },
  { date: 'Aug 03', views: 154200, subscriberGain: 620, revenue: 154 }
];

const platformComparisonData = [
  { platform: 'YouTube', views: 95000, engagementRate: 8.8, shares: 1200 },
  { platform: 'Instagram', views: 42000, engagementRate: 6.2, shares: 980 },
  { platform: 'LinkedIn', views: 12000, engagementRate: 12.4, shares: 450 },
  { platform: 'Twitter (X)', views: 5200, engagementRate: 4.1, shares: 120 }
];

export default function AnalyticsPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="min-h-screen pl-64 bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <main className="flex-1 p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Channel Analytics</h1>
            <p className="text-slate-400 text-sm mt-1">
              Performance metrics and automated self-improvement recommendations.
            </p>
          </div>
        </div>

        {/* Weekly AI Self-Improvement Recommendation Banner */}
        <div className="glass-card p-6 bg-indigo-950/20 border-indigo-500/25 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1.5 max-w-xl">
            <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-bounce" />
              AI Optimization Recommendations
            </h3>
            <p className="text-xs text-slate-350 leading-relaxed">
              Based on last week&apos;s analysis: Thumbnails using <strong className="text-white">vibrantly saturated pastel characters</strong> improved CTR by 4.2%. Audiences in Kids Education dropped retention during static scene changes.
            </p>
            <p className="text-[11px] text-slate-500 italic">
              Suggested Change: Shorten scenes from 8s to 5s, update Cartoon SDXL prompt template variables.
            </p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold rounded-lg text-white shadow-lg flex items-center gap-2 transition shrink-0">
            <span>Apply Optimization</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Charts Row */}
        {isMounted && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* Views trend */}
            <div className="glass-card p-6 bg-slate-900/40 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                Aggregated Views Trend
              </h3>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={viewsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontSize: 11 }} />
                    <Area type="monotone" dataKey="views" name="Views" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorViews)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Platform Comparison */}
            <div className="glass-card p-6 bg-slate-900/40 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                Platform Engagement Breakdown
              </h3>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                    <XAxis dataKey="platform" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontSize: 11 }} />
                    <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                    <Bar dataKey="views" name="Total Views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="shares" name="Social Shares" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
