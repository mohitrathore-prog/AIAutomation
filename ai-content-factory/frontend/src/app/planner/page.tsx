'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Calendar from '@/components/Calendar';

export default function PlannerPage() {
  return (
    <div className="min-h-screen pl-64 bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <main className="flex-1 p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Content Calendar</h1>
          <p className="text-slate-400 text-sm mt-1">
            Drag-and-drop schedule management for automated social publishing.
          </p>
        </div>

        <Calendar />
      </main>
    </div>
  );
}
