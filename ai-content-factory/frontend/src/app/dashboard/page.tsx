'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MetricCard from '@/components/MetricCard';
import {
  TrendingUp,
  Users,
  HardDrive,
  Coins,
  Play,
  RotateCw,
  AlertCircle,
  CheckCircle,
  Activity,
  ArrowRight,
  ShieldCheck,
  ServerCrash
} from 'lucide-react';

export default function Dashboard() {
  const [pipelines, setPipelines] = useState([
    {
      id: 'p1',
      title: 'The Phonics Alphabet Song',
      type: 'YouTube Shorts',
      status: 'published',
      step: 'Publishing',
      progress: 100,
      timestamp: '2 hours ago'
    },
    {
      id: 'p2',
      title: 'Learning Colors with Fruits',
      type: 'YouTube Shorts',
      status: 'scheduled',
      step: 'SEO optimized',
      progress: 90,
      timestamp: '1 day left'
    },
    {
      id: 'p3',
      title: 'Gravity & Magnetism Simple Rules',
      type: 'Long YouTube Video',
      status: 'generating',
      step: 'Voice Generation',
      progress: 65,
      timestamp: 'Est. 4 mins'
    },
    {
      id: 'p4',
      title: '10 DIY Paper Toys for Kids',
      type: 'Instagram Reels',
      status: 'failed',
      step: 'Brand QC Verification',
      progress: 80,
      timestamp: 'Error Code 409'
    }
  ]);

  const apiStatus = [
    { name: 'Supabase DB', status: 'operational', type: 'Database' },
    { name: 'n8n Orchestrator', status: 'operational', type: 'Automation' },
    { name: 'Gemini 1.5 Flash', status: 'operational', type: 'LLM Agent' },
    { name: 'OpenAI TTS & Image', status: 'operational', type: 'Media API' },
    { name: 'ElevenLabs Engine', status: 'operational', type: 'Voice Engine' },
    { name: 'YouTube API v3', status: 'degraded', type: 'Publisher' }
  ];

  return (
    <div className="min-h-screen pl-64 bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Enterprise Overview</h1>
            <p className="text-slate-400 text-sm mt-1">Autonomous content pipeline dashboard status.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg border border-slate-700 transition">
              Refresh Status
            </button>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold rounded-lg text-white shadow-lg transition">
              Trigger Manual Pipeline
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Aggregated Views"
            value="154.2K"
            change="+12.4%"
            isPositive={true}
            icon={TrendingUp}
            colorClass="indigo"
          />
          <MetricCard
            title="Total Subscribers"
            value="4,820"
            change="+8.2%"
            isPositive={true}
            icon={Users}
            colorClass="emerald"
          />
          <MetricCard
            title="Storage Occupied"
            value="24.5 GB"
            change="/ 100 GB"
            isPositive={true}
            icon={HardDrive}
            colorClass="amber"
          />
          <MetricCard
            title="Available Credits"
            value="8,420"
            change="-4.2%"
            isPositive={false}
            icon={Coins}
            colorClass="rose"
          />
        </div>

        {/* Pipeline & Status Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Active Workflows queue */}
          <div className="xl:col-span-2 glass-card p-6 bg-slate-900/40 rounded-2xl border border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-500" />
                Active Pipelines
              </h2>
              <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full">
                4 Active Jobs
              </span>
            </div>

            <div className="space-y-4">
              {pipelines.map(p => (
                <div key={p.id} className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition hover:border-slate-700">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{p.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-medium">
                        {p.type}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span>Step: <strong className="text-slate-300 font-semibold">{p.step}</strong></span>
                      <span>•</span>
                      <span>{p.timestamp}</span>
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex items-center gap-4">
                    {/* Progress Bar */}
                    <div className="flex-1 md:w-32 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          p.status === 'published' ? 'bg-emerald-500' :
                          p.status === 'scheduled' ? 'bg-indigo-500' :
                          p.status === 'failed' ? 'bg-rose-500' : 'bg-amber-500 pulse-glow'
                        }`}
                        style={{ width: `${p.progress}%` }}
                      ></div>
                    </div>

                    {/* Status Badge */}
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                      p.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      p.status === 'scheduled' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                      p.status === 'failed' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {p.status === 'published' && <CheckCircle className="w-3 h-3" />}
                      {p.status === 'failed' && <AlertCircle className="w-3 h-3" />}
                      {p.status === 'generating' && <RotateCw className="w-3 h-3 animate-spin" />}
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engine integrations status */}
          <div className="glass-card p-6 bg-slate-900/40 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                Integration Health
              </h2>

              <div className="space-y-3.5">
                {apiStatus.map((api, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-2 bg-slate-900/40 rounded-lg border border-slate-800/40">
                    <div>
                      <p className="font-semibold text-slate-200">{api.name}</p>
                      <span className="text-[10px] text-slate-500">{api.type}</span>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      api.status === 'operational' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {api.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between">
              <span>Next Audit: in 4 mins</span>
              <span className="text-emerald-400 font-semibold cursor-pointer flex items-center gap-0.5 hover:underline">
                View detailed logs <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
