'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import {
  FileText,
  Volume2,
  Video,
  Image as ImageIcon,
  FolderOpen,
  Plus,
  ArrowRight,
  Download,
  Trash2,
  Code2,
  ExternalLink
} from 'lucide-react';

export default function LibraryPage() {
  const [activeSubTab, setActiveSubTab] = useState<'assets' | 'prompts'>('assets');

  const [prompts, setPrompts] = useState([
    {
      id: 'pr1',
      name: 'Kids YouTube Script Generator',
      category: 'Script',
      version: 'v1.4',
      variables: ['topic', 'tone'],
      content: 'You are a Kids Content Director. Write a fun, engaging YouTube video script about {topic}. The tone should be {tone}. Use repetitive learning points.',
      updated: '3 days ago'
    },
    {
      id: 'pr2',
      name: 'Stable Diffusion Cartoon Prompt',
      category: 'Image Prompt',
      version: 'v2.1',
      variables: ['scene_description'],
      content: 'Generate a high-quality 2D cartoon style vector illustration of {scene_description}, vibrant pastel colors, kids storybook background, clean lines, no text --ar 16:9',
      updated: '1 week ago'
    },
    {
      id: 'pr3',
      name: 'ElevenLabs Voice Pacing',
      category: 'Voice',
      version: 'v1.0',
      variables: ['script_text'],
      content: 'Synthesize the following script with clear syllables, moderate pausing: {script_text}',
      updated: '2 weeks ago'
    }
  ]);

  const [assets, setAssets] = useState([
    {
      id: 'as1',
      name: 'phonics_script.txt',
      type: 'text',
      size: '2.0 KB',
      version: 2,
      tags: ['phonics', 'script'],
      url: '/assets/phonics_script.txt'
    },
    {
      id: 'as2',
      name: 'phonics_voiceover.wav',
      type: 'audio',
      size: '14.5 MB',
      version: 1,
      tags: ['vocals', 'kokoro'],
      url: '/assets/phonics_voiceover.wav'
    },
    {
      id: 'as3',
      name: 'phonics_final_shorts.mp4',
      type: 'video',
      size: '85.0 MB',
      version: 1,
      tags: ['renders', 'shorts'],
      url: '/assets/phonics_final.mp4'
    },
    {
      id: 'as4',
      name: 'phonics_thumbnail.png',
      type: 'image',
      size: '1.2 MB',
      version: 3,
      tags: ['thumbnail', 'sdxl'],
      url: '/assets/phonics_thumb.png'
    }
  ]);

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <FileText className="w-5 h-5 text-indigo-400" />;
      case 'audio':
        return <Volume2 className="w-5 h-5 text-emerald-400" />;
      case 'video':
        return <Video className="w-5 h-5 text-rose-400" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-amber-400" />;
      default:
        return <FolderOpen className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen pl-64 bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <main className="flex-1 p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Asset & Prompt Library</h1>
            <p className="text-slate-400 text-sm mt-1">
              Centralized repository storing prompt configurations, image files, audio tracks, and published videos.
            </p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold rounded-lg text-white shadow-lg flex items-center gap-2 transition">
            <Plus className="w-4 h-4" />
            <span>Add New Item</span>
          </button>
        </div>

        {/* Tab Subheaders */}
        <div className="flex border-b border-slate-800/80 gap-6">
          <button
            onClick={() => setActiveSubTab('assets')}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeSubTab === 'assets' ? 'text-indigo-400' : 'text-slate-450 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Asset Storage</span>
            {activeSubTab === 'assets' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"></div>
            )}
          </button>
          
          <button
            onClick={() => setActiveSubTab('prompts')}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeSubTab === 'prompts' ? 'text-indigo-400' : 'text-slate-450 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Prompt Templates</span>
            {activeSubTab === 'prompts' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"></div>
            )}
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="glass-card p-6 bg-slate-900/40 rounded-2xl border border-slate-800">
          {activeSubTab === 'assets' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-4 px-3">Name</th>
                    <th className="py-4 px-3">Type</th>
                    <th className="py-4 px-3">Size</th>
                    <th className="py-4 px-3">Version</th>
                    <th className="py-4 px-3">Tags</th>
                    <th className="py-4 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {assets.map(asset => (
                    <tr key={asset.id} className="hover:bg-slate-900/45 transition">
                      <td className="py-4 px-3 font-semibold text-slate-200 flex items-center gap-3">
                        {getAssetIcon(asset.type)}
                        <span>{asset.name}</span>
                      </td>
                      <td className="py-4 px-3 capitalize text-slate-400">{asset.type}</td>
                      <td className="py-4 px-3 text-slate-400">{asset.size}</td>
                      <td className="py-4 px-3">
                        <span className="p-1 px-2 rounded bg-slate-800/80 border border-slate-700 text-slate-300 font-medium">
                          v{asset.version}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex gap-1.5 flex-wrap">
                          {asset.tags.map((tag, idx) => (
                            <span key={idx} className="p-0.5 px-2 rounded-md bg-indigo-500/10 text-indigo-400 text-[9px] font-semibold border border-indigo-500/10">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-3 text-right space-x-2">
                        <button className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 transition">
                          <Download className="w-4 h-4 text-slate-350 text-slate-350" />
                        </button>
                        <button className="p-1.5 rounded bg-slate-800 hover:bg-rose-950/40 hover:text-rose-400 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeSubTab === 'prompts' && (
            <div className="space-y-6">
              {prompts.map(pr => (
                <div key={pr.id} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4 hover:border-slate-700 transition">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-white text-sm">{pr.name}</h4>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-600/15 text-indigo-400 uppercase">
                          {pr.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">Last updated: {pr.updated}</span>
                    </div>

                    <div className="flex gap-2">
                      <span className="p-1 px-2.5 rounded bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300">
                        {pr.version}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-800/80 rounded-lg text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {pr.content}
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold">
                    <div className="flex gap-2">
                      <span>Variables:</span>
                      {pr.variables.map((v, i) => (
                        <span key={i} className="text-indigo-400 font-mono">
                          {`{${v}}`}
                        </span>
                      ))}
                    </div>

                    <button className="flex items-center gap-1 text-indigo-400 hover:underline cursor-pointer">
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Test Variable Outputs</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
