'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import {
  Search,
  BookOpen,
  Image,
  Mic,
  Clapperboard,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  RotateCw,
  Play
} from 'lucide-react';

export default function GeneratorsPage() {
  const [activeTab, setActiveTab] = useState<'research' | 'script' | 'image' | 'voice' | 'video' | 'qc'>('research');
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('Introduction to Space & Galaxies for Kids');
  const [tone, setTone] = useState('Curious and friendly');
  
  const [results, setResults] = useState<Record<string, any>>({
    research: null,
    script: null,
    image: null,
    voice: null,
    video: null,
    qc: null
  });

  const apiBase = 'http://localhost:4000/api';

  const handleRunAgent = async (agentKey: typeof activeTab) => {
    setLoading(true);
    try {
      let endpoint = '';
      let payload: any = { workspaceId: 'kids-education-ws', topic, brandVoice: tone };

      switch (agentKey) {
        case 'research':
          endpoint = '/agents/research';
          break;
        case 'script':
          endpoint = '/agents/script';
          break;
        case 'image':
          endpoint = '/agents/prompts';
          // Use script output segments if available
          payload.additionalParams = {
            segments: results.script?.data?.segments || [
              { sceneId: 1, visualPrompt: 'Deep space showing neon purple galaxies, vector animation style' }
            ]
          };
          break;
        case 'voice':
          endpoint = '/agents/voice';
          payload.additionalParams = {
            fullNarration: results.script?.output || 'Hello kids, welcome to space!',
            voiceEngine: 'Kokoro'
          };
          break;
        case 'video':
          endpoint = '/video/render';
          payload = {
            contentItemId: 'fa11a8b9-8c9d-4cfb-a7e8-b7c11a681b99',
            scenes: results.script?.data?.segments || [
              { sceneId: 1, visualPrompt: 'Stars and comets flying by, 2d cartoon', durationSec: 6, narration: 'Welcome to space!' }
            ],
            aspectRatio: '16:9',
            resolution: '1080p'
          };
          break;
        case 'qc':
          endpoint = '/qc/validate';
          // Trigger a copyright fail check as a demo if the title contains copyright-fail
          const simulatesFailure = topic.toLowerCase().includes('copyright-fail');
          payload = {
            id: 'fa11a8b9-8c9d-4cfb-a7e8-b7c11a681b99',
            title: simulatesFailure ? 'Copyright-fail Demo track' : topic,
            contentType: 'YouTube Shorts',
            data: results.script?.data || {}
          };
          break;
      }

      const res = await fetch(`${apiBase}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setResults(prev => ({ ...prev, [agentKey]: data }));
    } catch (err: any) {
      console.error(err);
      setResults(prev => ({
        ...prev,
        [agentKey]: { success: false, error: err.message || 'Server connection failed.' }
      }));
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'research', label: '1. Topic Research', icon: Search },
    { key: 'script', label: '2. Script Writer', icon: BookOpen },
    { key: 'image', label: '3. Image Prompter', icon: Image },
    { key: 'voice', label: '4. Voice Director', icon: Mic },
    { key: 'video', label: '5. Video Compiler', icon: Clapperboard },
    { key: 'qc', label: '6. Quality Audit', icon: ShieldCheck }
  ] as const;

  return (
    <div className="min-h-screen pl-64 bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <main className="flex-1 p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">AI Content Pipelines</h1>
          <p className="text-slate-400 text-sm mt-1">
            Individually test agent pipelines, parameter variables, and quality assurance gates.
          </p>
        </div>

        {/* Studio Setup Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* Settings Left Panel */}
          <div className="xl:col-span-1 glass-card p-6 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Pipeline Setup</h3>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold">Video/Post Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500 transition"
                  placeholder="Enter a topic..."
                />
                <span className="text-[9px] text-slate-500">
                  Tip: Include &quot;copyright-fail&quot; to test Quality Control retry workflow.
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold">Brand Voice / Tone</label>
                <input
                  type="text"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500 transition"
                  placeholder="e.g. Energetic, educational..."
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <button
                onClick={() => handleRunAgent(activeTab)}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800/40 text-xs font-semibold rounded-lg text-white transition shadow-lg"
              >
                {loading ? <RotateCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? 'Executing Agent...' : `Run ${tabs.find(t => t.key === activeTab)?.label.split(' ')[1]}`}
              </button>
            </div>
          </div>

          {/* Interactive tabs Right Panel */}
          <div className="xl:col-span-3 flex flex-col gap-6">
            
            {/* Tabs Header */}
            <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800/80 overflow-x-auto gap-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg shrink-0 transition-all ${
                      isSelected 
                        ? 'bg-slate-800 text-white border border-slate-700 shadow-md' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Results Console */}
            <div className="glass-card p-6 bg-slate-900/40 rounded-2xl border border-slate-800 flex-1 min-h-[380px] flex flex-col">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Console output</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-indigo-400 font-semibold border border-indigo-500/10">
                  Ready
                </span>
              </div>

              <div className="flex-1 flex flex-col">
                {!results[activeTab] && (
                  <div className="flex-grow flex flex-col items-center justify-center text-center py-12">
                    <Sparkles className="w-12 h-12 text-slate-700 mb-3 pulse-glow" />
                    <p className="text-xs text-slate-500 font-medium">No results generated yet.</p>
                    <p className="text-[10px] text-slate-600 mt-1">Adjust inputs on the left side and run the agent.</p>
                  </div>
                )}

                {results[activeTab] && (
                  <div className="space-y-6">
                    {/* Diagnostic Summary */}
                    {results[activeTab].success !== false && (
                      <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Agent ran successfully in 45ms. Returning parsed JSON metadata payload.</span>
                      </div>
                    )}

                    {results[activeTab].success === false && (
                      <div className="p-3.5 bg-rose-500/5 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Execution Error: {results[activeTab].error}</span>
                      </div>
                    )}

                    {/* Dynamic Outputs based on active agent */}
                    {activeTab === 'research' && results.research?.data && (
                      <div className="space-y-4 text-xs">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                            <p className="font-bold text-white mb-2">High Intent Keywords</p>
                            <ul className="list-disc pl-4 space-y-1 text-slate-400">
                              {results.research.data.keywords.map((k: string, i: number) => (
                                <li key={i}>{k}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                            <p className="font-bold text-white mb-2">Trend KPI Insights</p>
                            <p className="text-slate-400">Monthly Volume: <strong className="text-slate-200">{results.research.data.searchVolumeRange}</strong></p>
                            <p className="text-slate-400">Competition Index: <strong className="text-slate-200">{results.research.data.competition}</strong></p>
                            <p className="text-slate-400">Interest Score: <strong className="text-emerald-400 font-bold">{results.research.data.trendScore}/100</strong></p>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                          <p className="font-bold text-white mb-2">Hook Title Suggestions</p>
                          <ul className="space-y-1.5 text-slate-300 font-semibold">
                            {results.research.data.suggestedTitles.map((t: string, i: number) => (
                              <li key={i} className="flex gap-2 items-center">
                                <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {activeTab === 'script' && results.script?.data && (
                      <div className="space-y-4 text-xs">
                        <div className="flex gap-4">
                          <span className="p-2 px-3.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                            Duration: <strong className="text-white">{results.script.data.estimatedDurationSec}s</strong>
                          </span>
                          <span className="p-2 px-3.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                            Word Count: <strong className="text-white">{results.script.data.wordCount} words</strong>
                          </span>
                        </div>

                        <div className="space-y-3">
                          {results.script.data.segments.map((seg: any) => (
                            <div key={seg.sceneId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                              <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold border-b border-slate-900 pb-1.5">
                                <span>SCENE {seg.sceneId}</span>
                                <span>{seg.durationSec} SECS</span>
                              </div>
                              <p className="text-slate-200 italic font-medium">&quot;{seg.narration}&quot;</p>
                              <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-2 bg-indigo-950/20 p-2 rounded">
                                <Image className="w-3.5 h-3.5 text-indigo-400" />
                                <span><strong className="text-slate-300">Prompt Idea:</strong> {seg.visualPrompt}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'image' && results.image?.data && (
                      <div className="space-y-3 text-xs">
                        <p className="font-bold text-white mb-2">Generated Prompts for Flux</p>
                        {results.image.data.prompts.map((p: any) => (
                          <div key={p.sceneId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                            <span className="text-[10px] text-slate-500 font-bold">SCENE {p.sceneId}</span>
                            <p className="text-indigo-400 font-mono select-all bg-slate-900/60 p-2 rounded border border-indigo-950">{p.optimizedPrompt}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'voice' && results.voice?.data && (
                      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-2">
                        <p className="font-bold text-white">Voice Director Synthesizer Parameters</p>
                        <div className="grid grid-cols-2 gap-4 text-slate-400 mt-2">
                          <p>Speech Engine: <strong className="text-slate-200">{results.voice.data.engine}</strong></p>
                          <p>Voice ID Model: <strong className="text-slate-200">{results.voice.data.voiceId}</strong></p>
                          <p>Audio Stability: <strong className="text-slate-200">{results.voice.data.stability * 100}%</strong></p>
                          <p>Clarity Factor: <strong className="text-slate-200">{results.voice.data.clarity * 100}%</strong></p>
                        </div>
                      </div>
                    )}

                    {activeTab === 'video' && results.video && (
                      <div className="space-y-4 text-xs">
                        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="font-bold text-white">Video Render Stream Compiled</p>
                            <p className="text-[10px] text-slate-500">File URL: {results.video.videoUrl}</p>
                          </div>
                          
                          {/* Simulated video playback trigger */}
                          <div className="flex gap-2">
                            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-lg flex items-center gap-1.5 shadow">
                              <Play className="w-3.5 h-3.5" />
                              <span>Play Video Preview</span>
                            </button>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                          <p className="font-bold text-slate-400 text-[10px] uppercase tracking-wider mb-2">FFmpeg Logs</p>
                          <pre className="font-mono text-[9px] text-slate-500 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                            {results.video.ffmpegLog}
                          </pre>
                        </div>
                      </div>
                    )}

                    {activeTab === 'qc' && results.qc && (
                      <div className="space-y-4 text-xs">
                        <div className="flex justify-between items-center p-4 bg-slate-950 border border-slate-800 rounded-xl">
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 font-bold">AUDIT RATING</span>
                            <p className={`text-2xl font-black ${results.qc.passed ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {results.qc.score}%
                            </p>
                          </div>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase border ${
                            results.qc.passed 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {results.qc.passed ? 'Passed' : 'Review Queue'}
                          </span>
                        </div>

                        {/* List of check results */}
                        <div className="space-y-2">
                          {results.qc.checks.map((c: any, i: number) => (
                            <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-3 justify-between">
                              <div className="space-y-1">
                                <p className="font-semibold text-slate-200">{c.name}</p>
                                <p className="text-[10px] text-slate-500">{c.feedback}</p>
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                c.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                              }`}>
                                {c.score}/100
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
