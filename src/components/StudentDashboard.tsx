import React, { useState } from 'react';
import { Sparkles, ArrowRight, Clock, BookOpen, Atom, Cpu, Dna, Calculator, History, ChevronRight } from 'lucide-react';
import { LearningSession, LearningLevel } from '../types';

interface StudentDashboardProps {
  onAskQuestion: (question: string, level?: LearningLevel) => void;
  recentSessions: LearningSession[];
  onOpenSession: (session: LearningSession) => void;
  onNavigate: (tab: 'home' | 'dashboard' | 'assistant' | 'history' | 'about') => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onAskQuestion,
  recentSessions,
  onOpenSession,
  onNavigate,
}) => {
  const [inputQuestion, setInputQuestion] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<LearningLevel>('intermediate');

  const exampleQuestions = [
    {
      text: 'Explain Artificial Intelligence.',
      category: 'Computer Science',
      icon: Cpu,
      color: 'bg-indigo-50 text-indigo-700',
    },
    {
      text: 'What is Newton’s Third Law?',
      category: 'Physics',
      icon: Atom,
      color: 'bg-blue-50 text-blue-700',
    },
    {
      text: 'Explain photosynthesis.',
      category: 'Biology',
      icon: Dna,
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      text: 'What is machine learning?',
      category: 'Computer Science',
      icon: Cpu,
      color: 'bg-violet-50 text-violet-700',
    },
  ];

  const subjectCategories = [
    { name: 'Physics & Astronomy', icon: Atom, count: 'Mechanics, Optics, Thermodynamics', prompt: 'Explain the difference between special and general relativity.' },
    { name: 'Cellular & Molecular Biology', icon: Dna, count: 'Genetics, Ecology, Bioenergetics', prompt: 'How does cellular respiration compare to photosynthesis?' },
    { name: 'Computer Science & AI', icon: Cpu, count: 'Data Structures, Algorithms, ML', prompt: 'Explain how neural networks learn with backpropagation.' },
    { name: 'Mathematics & Logic', icon: Calculator, count: 'Calculus, Probability, Linear Algebra', prompt: 'Explain the Central Limit Theorem in plain language.' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim()) return;
    onAskQuestion(inputQuestion.trim(), selectedLevel);
  };

  const handleExampleClick = (q: string) => {
    onAskQuestion(q, selectedLevel);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EduGenie Learning Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
            Welcome back, Scholar!
          </h1>
          <p className="text-sm sm:text-base text-indigo-100 font-normal leading-relaxed">
            What academic topic or concept would you like to master today? Ask any question to get an intuitive explanation, real-world examples, and key terms powered by AI.
          </p>
        </div>
      </div>

      {/* Main Question / Topic Input Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
              Ask EduGenie
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Enter any syllabus topic, exam question, or theory you want deconstructed.
            </p>
          </div>

          {/* Learning Level Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedLevel('beginner')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedLevel === 'beginner'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Foundational (Simpler)
            </button>
            <button
              type="button"
              onClick={() => setSelectedLevel('intermediate')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedLevel === 'intermediate'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Intermediate
            </button>
            <button
              type="button"
              onClick={() => setSelectedLevel('advanced')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedLevel === 'advanced'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Advanced / College
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="e.g. Explain photosynthesis or What is Newton's Third Law?"
              rows={3}
              className="w-full px-4 py-3.5 text-base text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400 resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-600 font-mono">Enter ↵</kbd> to submit
            </div>
            <button
              type="submit"
              disabled={!inputQuestion.trim()}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask EduGenie</span>
            </button>
          </div>
        </form>
      </div>

      {/* Demo Questions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
              Example Learning Questions
            </h3>
            <p className="text-xs text-slate-500">
              Click any question below to load it into the assistant.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {exampleQuestions.map((q, idx) => {
            const Icon = q.icon;
            return (
              <button
                key={idx}
                onClick={() => handleExampleClick(q.text)}
                className="group bg-white p-5 rounded-2xl border border-slate-200 text-left hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-lg ${q.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-slate-600 font-medium">
                    {q.category}
                  </span>
                </div>
                <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  “{q.text}”
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 pt-1">
                  <span>Explore topic</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Learning Activity & Subjects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Learning Questions */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900 font-display">
                Recent Learning Questions
              </h3>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              View all history →
            </button>
          </div>

          {recentSessions.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              No recent questions yet. Ask your first question above!
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentSessions.slice(0, 4).map((session) => (
                <button
                  key={session.id}
                  onClick={() => onOpenSession(session)}
                  className="w-full py-3.5 text-left flex items-start justify-between gap-4 hover:bg-slate-50 px-2 rounded-lg transition-colors group"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 truncate">
                      {session.title || session.topic || 'Learning Session'}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span>{session.messages[0]?.content || 'Question'}</span>
                      <span>·</span>
                      <span className="tabular-nums">
                        {new Date(session.updatedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0 mt-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Explore Academic Disciplines */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900 font-display">
              Curated Academic Disciplines
            </h3>
          </div>

          <div className="space-y-3">
            {subjectCategories.map((sub, idx) => {
              const Icon = sub.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleExampleClick(sub.prompt)}
                  className="w-full p-3 text-left rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 text-indigo-600 group-hover:bg-indigo-100 transition-colors flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700">
                        {sub.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {sub.count}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
