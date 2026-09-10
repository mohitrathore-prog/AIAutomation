'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import {
  Lock,
  Eye,
  EyeOff,
  Save,
  KeyRound,
  Database,
  Globe,
  CheckCircle,
  AlertTriangle,
  RotateCw,
  Cpu
} from 'lucide-react';

export default function SettingsPage() {
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  
  // State for keys config inputs
  const [credentials, setCredentials] = useState<Record<string, { raw: string; encrypted: string; visible: boolean }>>({
    supabase: { raw: 'https://mock-supabase-db.supabase.co', encrypted: '', visible: false },
    openai: { raw: 'sk-proj-mockopenairawkey1001010101010101', encrypted: '', visible: false },
    gemini: { raw: 'AIzaSyMockGeminiKey2026-AgY_antigravity', encrypted: '', visible: false },
    elevenlabs: { raw: 'mockelevenlabskey99882211', encrypted: '', visible: false },
    youtube: { raw: 'oauth2-client-mocksecret-yt-v3', encrypted: '', visible: false }
  });

  const apiBase = 'http://localhost:4000/api';

  const handleEncryptAndSave = async (key: string) => {
    setLoadingKey(key);
    try {
      const res = await fetch(`${apiBase}/credentials/encrypt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawKey: credentials[key].raw })
      });
      const data = await res.json();
      if (data.success) {
        setCredentials(prev => ({
          ...prev,
          [key]: {
            ...prev[key],
            encrypted: data.encryptedPayload
          }
        }));
      }
    } catch (err) {
      console.error('Encryption failed', err);
    } finally {
      setLoadingKey(null);
    }
  };

  const toggleVisibility = (key: string) => {
    setCredentials(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        visible: !prev[key].visible
      }
    }));
  };

  return (
    <div className="min-h-screen pl-64 bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <main className="flex-1 p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Credentials & Settings</h1>
            <p className="text-slate-400 text-sm mt-1">
              Configure secure integration API keys and provider endpoints.
            </p>
          </div>
        </div>

        {/* Security Alert banner */}
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-start gap-3">
          <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Cryptographic Key Storage Enabled</p>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              API Keys are encrypted client-to-server and saved in the Supabase database using standard <strong className="text-white">AES-256-GCM authenticated encryption</strong> with dynamic Initialization Vectors (IVs) and auth tags.
            </p>
          </div>
        </div>

        {/* Credentials Form Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Main Credentials Inputs */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Database section */}
            <div className="glass-card p-6 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                Supabase Connection settings
              </h3>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold">Supabase Endpoint URL</label>
                  <input
                    type="text"
                    value={credentials.supabase.raw}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      supabase: { ...prev.supabase, raw: e.target.value }
                    }))}
                    className="w-full text-xs p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-350 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* AI Model providers key section */}
            <div className="glass-card p-6 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                AI Providers API Keys
              </h3>

              <div className="space-y-6 divide-y divide-slate-800/60">
                
                {/* OpenAI Key */}
                <div className="pt-2 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-300">OpenAI API Key</span>
                    <button
                      onClick={() => toggleVisibility('openai')}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold transition"
                    >
                      {credentials.openai.visible ? <EyeOff className="w-4 h-4 inline" /> : <Eye className="w-4 h-4 inline" />} Show
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type={credentials.openai.visible ? 'text' : 'password'}
                      value={credentials.openai.raw}
                      onChange={(e) => setCredentials(prev => ({
                        ...prev,
                        openai: { ...prev.openai, raw: e.target.value }
                      }))}
                      className="flex-1 text-xs p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500 transition"
                    />
                    <button
                      onClick={() => handleEncryptAndSave('openai')}
                      disabled={loadingKey === 'openai'}
                      className="px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800/40 text-xs font-semibold rounded-lg text-white transition flex items-center gap-1.5 shrink-0"
                    >
                      {loadingKey === 'openai' ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      Encrypt & Save
                    </button>
                  </div>
                  {credentials.openai.encrypted && (
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-mono text-indigo-400 break-all select-all">
                      <span className="text-slate-500 block font-semibold text-[9px] uppercase mb-1">Encrypted Cipher Text Payload:</span>
                      {credentials.openai.encrypted}
                    </div>
                  )}
                </div>

                {/* Gemini Key */}
                <div className="pt-6 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-300">Gemini (Google AI Studio) Key</span>
                    <button
                      onClick={() => toggleVisibility('gemini')}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold transition"
                    >
                      {credentials.gemini.visible ? <EyeOff className="w-4 h-4 inline" /> : <Eye className="w-4 h-4 inline" />} Show
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type={credentials.gemini.visible ? 'text' : 'password'}
                      value={credentials.gemini.raw}
                      onChange={(e) => setCredentials(prev => ({
                        ...prev,
                        gemini: { ...prev.gemini, raw: e.target.value }
                      }))}
                      className="flex-1 text-xs p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500 transition"
                    />
                    <button
                      onClick={() => handleEncryptAndSave('gemini')}
                      disabled={loadingKey === 'gemini'}
                      className="px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800/40 text-xs font-semibold rounded-lg text-white transition flex items-center gap-1.5 shrink-0"
                    >
                      {loadingKey === 'gemini' ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      Encrypt & Save
                    </button>
                  </div>
                  {credentials.gemini.encrypted && (
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-mono text-indigo-400 break-all select-all">
                      <span className="text-slate-500 block font-semibold text-[9px] uppercase mb-1">Encrypted Cipher Text Payload:</span>
                      {credentials.gemini.encrypted}
                    </div>
                  )}
                </div>

                {/* ElevenLabs Voice Key */}
                <div className="pt-6 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-300">ElevenLabs API Voice Key</span>
                    <button
                      onClick={() => toggleVisibility('elevenlabs')}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold transition"
                    >
                      {credentials.elevenlabs.visible ? <EyeOff className="w-4 h-4 inline" /> : <Eye className="w-4 h-4 inline" />} Show
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type={credentials.elevenlabs.visible ? 'text' : 'password'}
                      value={credentials.elevenlabs.raw}
                      onChange={(e) => setCredentials(prev => ({
                        ...prev,
                        elevenlabs: { ...prev.elevenlabs, raw: e.target.value }
                      }))}
                      className="flex-1 text-xs p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500 transition"
                    />
                    <button
                      onClick={() => handleEncryptAndSave('elevenlabs')}
                      disabled={loadingKey === 'elevenlabs'}
                      className="px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800/40 text-xs font-semibold rounded-lg text-white transition flex items-center gap-1.5 shrink-0"
                    >
                      {loadingKey === 'elevenlabs' ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      Encrypt & Save
                    </button>
                  </div>
                  {credentials.elevenlabs.encrypted && (
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-mono text-indigo-400 break-all select-all">
                      <span className="text-slate-500 block font-semibold text-[9px] uppercase mb-1">Encrypted Cipher Text Payload:</span>
                      {credentials.elevenlabs.encrypted}
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>

          {/* Integration instructions Right Panel */}
          <div className="xl:col-span-1 glass-card p-6 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-6 text-xs text-slate-350">
            <h3 className="font-bold text-white uppercase tracking-wider">How keys are stored</h3>
            <p className="leading-relaxed">
              When you press <strong className="text-indigo-400">&quot;Encrypt & Save&quot;</strong>:
            </p>
            <ol className="list-decimal pl-4 space-y-2">
              <li>The frontend submits a post request to the secure Node.js encryption middleware `/api/credentials/encrypt`.</li>
              <li>A random 12-byte Initialization Vector (IV) is generated.</li>
              <li>The key is ciphered using <strong className="text-indigo-400">AES-256-GCM</strong>.</li>
              <li>A 16-byte authentication tag is generated to prevent unauthorized manipulation (tampering).</li>
              <li>The composite string `iv:authTag:cipher` is sent back and saved under `credentials_settings` in Supabase.</li>
            </ol>
            
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2 mt-4">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Security Guarantee</span>
              <p className="text-[10px] leading-relaxed">
                Even if database read access is compromised, the encrypted credentials cannot be read without the runtime encryption secret key.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
