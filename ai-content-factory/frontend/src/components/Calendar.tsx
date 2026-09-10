'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Eye, Share2, Youtube, Twitter, Linkedin, HelpCircle } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  platform: 'youtube' | 'twitter' | 'linkedin' | 'instagram';
  time: string;
  status: 'published' | 'scheduled' | 'review';
}

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState('August 2026');
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  // Hardcode events corresponding to monthly grid slots
  const [events, setEvents] = useState<Record<number, CalendarEvent[]>>({
    3: [
      { id: '1', title: 'The Phonics Alphabet Song', platform: 'youtube', time: '14:00', status: 'published' }
    ],
    4: [
      { id: '2', title: 'Learning Colors with Fruits', platform: 'youtube', time: '14:00', status: 'scheduled' }
    ],
    7: [
      { id: '3', title: '5 Basic English Words', platform: 'linkedin', time: '09:00', status: 'scheduled' }
    ],
    12: [
      { id: '4', title: 'How Magnets Work (Visual Rules)', platform: 'instagram', time: '16:30', status: 'review' }
    ],
    18: [
      { id: '5', title: 'Kids Art & Craft Tutorial', platform: 'youtube', time: '11:00', status: 'scheduled' }
    ],
    22: [
      { id: '6', title: 'Simple Science Experiments', platform: 'twitter', time: '10:00', status: 'scheduled' }
    ]
  });

  const [unscheduledDrafts, setUnscheduledDrafts] = useState([
    { id: 'd1', title: 'Counting 1 to 10 with Animals', platform: 'youtube' },
    { id: 'd2', title: 'Why is the Sky Blue?', platform: 'instagram' },
    { id: 'd3', title: 'Introduction to Phonics', platform: 'twitter' }
  ]);

  // Generate numbers for August 2026 starting on Saturday (so offsets = 5 days)
  const daysInMonth = 31;
  const startOffset = 5; // August 1st, 2026 is Saturday
  const gridCells: Array<{ day?: number; events?: CalendarEvent[] }> = [];

  // Empty cells for offset
  for (let i = 0; i < startOffset; i++) {
    gridCells.push({});
  }

  // Real days
  for (let i = 1; i <= daysInMonth; i++) {
    gridCells.push({
      day: i,
      events: events[i] || []
    });
  }

  // Handle slot assignment
  const handleAssignDraft = (day: number, draft: any) => {
    const newEvent: CalendarEvent = {
      id: Math.random().toString(),
      title: draft.title,
      platform: draft.platform,
      time: '12:00',
      status: 'scheduled'
    };

    setEvents(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), newEvent]
    }));

    setUnscheduledDrafts(prev => prev.filter(d => d.id !== draft.id));
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return <Youtube className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />;
      case 'twitter':
        return <Twitter className="w-3.5 h-3.5 text-sky-400 fill-sky-400/20" />;
      case 'linkedin':
        return <Linkedin className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
      {/* Calendar Grid */}
      <div className="xl:col-span-3 glass-card p-6 bg-slate-900/40 rounded-2xl border border-slate-800">
        
        {/* Calendar Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">{currentMonth}</h2>
            <div className="flex gap-1.5 ml-2">
              <button className="p-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700/60 transition">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700/60 transition">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex bg-slate-950/80 p-1 rounded-lg border border-slate-800/80">
            {(['month', 'week', 'day'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3.5 py-1 text-xs font-semibold capitalize rounded-md transition-all ${
                  view === v 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Days of Week Row */}
        <div className="grid grid-cols-7 text-center text-xs text-slate-500 font-bold border-b border-slate-800/80 pb-3">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Grid Cells */}
        <div className="grid grid-cols-7 gap-1.5 mt-2">
          {gridCells.map((cell, idx) => (
            <div
              key={idx}
              className={`min-h-[100px] p-2 bg-slate-950/30 border border-slate-800/40 rounded-xl flex flex-col justify-between group transition hover:border-slate-700 ${
                cell.day ? 'cursor-pointer' : 'opacity-25 pointer-events-none bg-slate-950/10'
              }`}
              onClick={() => {
                if (cell.day && unscheduledDrafts.length > 0) {
                  // Assign the first unscheduled draft as a demo interaction
                  handleAssignDraft(cell.day, unscheduledDrafts[0]);
                }
              }}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-500 group-hover:text-white transition">
                  {cell.day}
                </span>
                {cell.day && (
                  <button className="opacity-0 group-hover:opacity-100 p-0.5 rounded bg-slate-800 hover:bg-indigo-600 transition">
                    <Plus className="w-3 h-3 text-slate-200" />
                  </button>
                )}
              </div>

              {/* Render Events */}
              <div className="mt-2 space-y-1.5 overflow-hidden">
                {cell.events?.map(ev => (
                  <div
                    key={ev.id}
                    className={`p-1 px-1.5 rounded text-[10px] flex items-center justify-between border ${
                      ev.status === 'published' 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : ev.status === 'review'
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate max-w-[80%]">
                      {getPlatformIcon(ev.platform)}
                      <span className="truncate font-semibold">{ev.title}</span>
                    </div>
                    <span className="text-[8px] text-slate-500 font-bold">{ev.time}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unscheduled Queue */}
      <div className="glass-card p-6 bg-slate-900/40 rounded-2xl border border-slate-800 flex flex-col">
        <h3 className="text-sm font-bold text-white mb-4">Unscheduled Queue</h3>
        <p className="text-[11px] text-slate-400 mb-6">
          Draft scripts ready to schedule. Click on any date on the left to schedule the top draft.
        </p>

        <div className="flex-1 space-y-3.5 overflow-y-auto">
          {unscheduledDrafts.map(draft => (
            <div
              key={draft.id}
              className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between hover:border-slate-700 transition cursor-grab"
            >
              <div className="space-y-1 truncate max-w-[80%]">
                <p className="text-xs font-semibold text-slate-200 truncate">{draft.title}</p>
                <div className="flex items-center gap-1.5">
                  {getPlatformIcon(draft.platform)}
                  <span className="text-[10px] text-slate-500 capitalize">{draft.platform}</span>
                </div>
              </div>
              <Plus className="w-4 h-4 text-slate-500 hover:text-white cursor-pointer" />
            </div>
          ))}

          {unscheduledDrafts.length === 0 && (
            <div className="h-full flex items-center justify-center text-xs text-slate-600 font-medium py-12">
              Queue is empty.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
