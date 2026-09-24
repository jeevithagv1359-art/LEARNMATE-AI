import React from 'react';
import {
  Sparkles,
  Cpu,
  Layers,
  CheckCircle2,
  Brain,
  Zap,
  ShieldCheck,
  Server,
  ArrowRight,
  Code2,
  FileText,
  HelpCircle,
  Compass,
} from 'lucide-react';
import { NavigationTab } from '../types';

interface AboutPageProps {
  onStartLearning: () => void;
  onNavigateTab?: (tab: NavigationTab) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onStartLearning, onNavigateTab }) => {
  const capabilities = [
    {
      title: 'AI-Powered Question Answering',
      desc: 'Provides concise and intelligent answers to academic and general knowledge questions using Google Gemini generative AI with step-by-step clarity.',
      icon: Sparkles,
      color: 'bg-indigo-50 text-indigo-700',
    },
    {
      title: 'Simplified Concept Explanation',
      desc: 'Converts complex concepts into simple, beginner-friendly explanations with relatable real-world analogies using lightweight LaMini-Flan-T5 model persona.',
      icon: Brain,
      color: 'bg-violet-50 text-violet-700',
    },
    {
      title: 'Automatic Quiz Generation',
      desc: 'Generates exactly 3 multiple-choice questions with 4 options each from a given topic or passage and identifies the correct answers with pedagogical explanations.',
      icon: HelpCircle,
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'Smart Summarization',
      desc: 'Converts lengthy educational passages and textbook chapters into short, clear summaries while preserving essential principles and formulas.',
      icon: FileText,
      color: 'bg-sky-50 text-sky-700',
    },
    {
      title: 'Personalized Learning Paths',
      desc: 'Creates structured learning plans from beginner to advanced level, including topics, progression milestones, timelines, and suggested study resources.',
      icon: Compass,
      color: 'bg-purple-50 text-purple-700',
    },
    {
      title: 'Multi-Model AI Architecture',
      desc: 'Combines local/lightweight AI inference for instant concept explanations with cloud-based Gemini AI for complex reasoning and multi-turn tutoring.',
      icon: Cpu,
      color: 'bg-amber-50 text-amber-700',
    },
  ];

  const modularApis = [
    { method: 'POST', path: '/api/chat', purpose: 'Multi-turn academic Q&A with learning levels' },
    { method: 'POST', path: '/api/explain', purpose: 'Concept simplification with LaMini / Gemini engine toggle' },
    { method: 'POST', path: '/api/quiz', purpose: 'Automatic generation of 3 MCQs with 4 options each & grading' },
    { method: 'POST', path: '/api/summarize', purpose: 'Educational text compression and core takeaway extraction' },
    { method: 'POST', path: '/api/learning-path', purpose: 'Curriculum roadmap from beginner to advanced' },
    { method: 'GET', path: '/api/models', purpose: 'Multi-model system status and hardware compatibility' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header Deck */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>System Overview & Architecture</span>
        </div>

        {/* Exact Heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-display">
          About EduGenie
        </h1>

        {/* Exact Description */}
        <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
          EduGenie is a Google Gemini-powered learning assistant designed to support students in understanding academic topics through Generative AI and interactive learning.
        </p>
      </div>

      {/* Purpose Section */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            🎯
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">
            Purpose & Vision
          </h2>
        </div>
        <p className="text-slate-600 text-base leading-relaxed">
          Traditional educational search tools often present walls of unstructured text that can overwhelm students. EduGenie bridges this gap by functioning as a patient, personalized academic companion. Rather than merely producing raw answers, EduGenie formats concepts into structured, pedagogically sound breakdowns—featuring simple explanations, key bullet points, intuitive real-world examples, automatic practice quizzes, text summarization, and curated learning roadmaps.
        </p>
      </section>

      {/* Technology & Multi-Model AI Architecture */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">
            System Architecture
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Multi-Model AI Architecture
          </h3>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            Combines lightweight AI inference for rapid concept simplification with cloud-based Gemini AI for multi-turn academic synthesis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Brain className="w-6 h-6 text-indigo-600" />
                <h4 className="text-lg font-bold text-slate-900">
                  LaMini-Flan-T5 Persona
                </h4>
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                Lightweight Inference
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Tailored for instant concept simplification, elementary phrasing, and relatable analogies. Highly optimized for modest compute environments and low-resource devices such as Apple Silicon (Mac M1/M2/M3).
            </p>
            <div className="text-xs text-indigo-700 font-medium pt-2 border-t border-slate-100">
              ⚡ Ultra-fast single-pass breakdown · Minimal latency
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-6 h-6 text-violet-600" />
                <h4 className="text-lg font-bold text-slate-900">
                  Cloud Gemini 3.8 Flash
                </h4>
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                Generative AI Cloud
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Powers deep multi-turn conversational tutoring, automatic 3-question MCQ generation, academic passage summarization, and multi-week Beginner-to-Advanced curriculum roadmaps.
            </p>
            <div className="text-xs text-violet-700 font-medium pt-2 border-t border-slate-100">
              ☁️ State-of-the-art context window · High reasoning fidelity
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">
            Core Learning Features
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Everything Built Into EduGenie
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
              >
                <div className={`w-9 h-9 rounded-xl ${cap.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">{cap.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{cap.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modular Backend REST APIs */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-display">
                Modular REST Backend
              </h3>
              <p className="text-xs text-slate-500">
                Independent modules for each major learning capability
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              REST API Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {modularApis.map((api, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs"
            >
              <span className={`px-2 py-0.5 rounded font-mono font-bold ${
                api.method === 'POST' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-700'
              }`}>
                {api.method}
              </span>
              <div className="flex-1">
                <span className="font-mono font-semibold text-slate-900">{api.path}</span>
                <p className="text-slate-500 mt-0.5 text-[11px]">{api.purpose}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Scalable Design & Robust Error Handling */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
            <ShieldCheck className="w-5 h-5" />
            <span>Robust Error Handling</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Gracefully handles generative AI outages, network latency, and JSON-parsing anomalies with automatic regex recovery, retry logic, and user-friendly error banners.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
            <Layers className="w-5 h-5" />
            <span>Extensible Architecture</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Designed for future scalability: native support for voice interaction, multilingual learning, student progress tracking, PDF/syllabus uploads, and LMS integrations.
          </p>
        </div>
      </section>

      {/* Footer CTA */}
      <div className="pt-6 border-t border-slate-200 text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-900 font-display">
          Ready to experience EduGenie?
        </h3>
        <button
          onClick={onStartLearning}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch AI Learning Assistant</span>
        </button>
      </div>
    </div>
  );
};
