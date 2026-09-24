import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Brain,
  BookOpen,
  HelpCircle,
  FileText,
  Compass,
  Lightbulb,
  Cpu,
  Atom,
  Calculator,
  Layers,
  ChevronRight,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { Subject, LearningLevel, NavigationTab } from '../types';
import heroImg from '../assets/images/hero_edugenie_learning_1790232214535.jpg';

interface LandingPageProps {
  onStartLearning: () => void;
  onAskQuestion: (question: string, level?: LearningLevel, subject?: Subject) => void;
  onNavigateTab: (tab: NavigationTab) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartLearning,
  onAskQuestion,
  onNavigateTab,
}) => {
  const [quickInput, setQuickInput] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject>('General');
  const [selectedLevel, setSelectedLevel] = useState<LearningLevel>('intermediate');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    onAskQuestion(quickInput.trim(), selectedLevel, selectedSubject);
  };

  // Section: Clickable example cards for instant Q&A
  const exampleCards: Array<{
    title: string;
    question: string;
    category: Subject;
    icon: React.ComponentType<{ className?: string }>;
    accent: string;
    subtitle: string;
  }> = [
    {
      title: 'Artificial Intelligence',
      question: 'What is Artificial Intelligence?',
      category: 'Computer Science',
      icon: Cpu,
      accent: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      subtitle: 'Neural networks, autonomous systems & perception',
    },
    {
      title: 'Machine Learning',
      question: 'What is machine learning?',
      category: 'Computer Science',
      icon: Brain,
      accent: 'bg-violet-50 text-violet-700 border-violet-200',
      subtitle: 'Supervised learning, training models & prediction',
    },
    {
      title: 'Physics',
      question: "Explain Newton's Third Law.",
      category: 'Physics',
      icon: Atom,
      accent: 'bg-blue-50 text-blue-700 border-blue-200',
      subtitle: 'Forces, equal and opposite reactions, momentum',
    },
    {
      title: 'Mathematics',
      question: 'What is an algorithm and how do we calculate complexity?',
      category: 'Mathematics',
      icon: Calculator,
      accent: 'bg-amber-50 text-amber-700 border-amber-200',
      subtitle: 'Proofs, mathematical logic & algorithmic efficiency',
    },
    {
      title: 'Computer Science',
      question: 'Explain database management and ACID properties.',
      category: 'Computer Science',
      icon: Layers,
      accent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      subtitle: 'Data structures, storage systems & transactions',
    },
  ];

  // Key Feature Modules Card Deck
  const featureModules = [
    {
      id: 'assistant' as NavigationTab,
      title: 'AI Question Answering',
      tag: 'Generative AI Tutor',
      description: 'Concise and intelligent answers to academic and general knowledge questions with step-by-step guidance.',
      icon: Sparkles,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      btnText: 'Ask Question',
    },
    {
      id: 'explain' as NavigationTab,
      title: 'Simplified Concept Explanation',
      tag: 'Multi-Model Intelligence',
      description: 'Converts complex academic theories into crystal-clear beginner explanations with vivid everyday analogies.',
      icon: Lightbulb,
      color: 'bg-violet-50 text-violet-700 border-violet-200',
      btnText: 'Simplify Concept',
    },
    {
      id: 'quiz' as NavigationTab,
      title: 'Automatic Quiz Generation',
      tag: '3 MCQs · 4 Options Each',
      description: 'Generates exactly 3 multiple-choice questions with 4 options each from any topic or passage with instant scoring.',
      icon: HelpCircle,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      btnText: 'Generate Quiz',
    },
    {
      id: 'summarize' as NavigationTab,
      title: 'Smart Summarization',
      tag: 'High Retention',
      description: 'Condenses lengthy educational passages and textbook chapters into clear summaries while preserving key points.',
      icon: FileText,
      color: 'bg-sky-50 text-sky-700 border-sky-200',
      btnText: 'Summarize Text',
    },
    {
      id: 'path' as NavigationTab,
      title: 'Personalized Learning Paths',
      tag: 'Beginner to Advanced',
      description: 'Builds progressive milestone learning plans with timelines, core topics, projects, and vetted study resources.',
      icon: Compass,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      btnText: 'Build Roadmap',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Subtitle Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>AI-Powered Learning Assistant</span>
            </div>

            {/* Exact Required Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12] font-display text-balance">
              Learn Smarter with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                EduGenie
              </span>
            </h1>

            {/* Exact Required Description */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl font-normal">
              An AI-powered learning assistant that helps students understand academic topics through interactive learning with Generative AI.
            </p>

            {/* Hero CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onStartLearning}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg transition-all cursor-pointer"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onAskQuestion('What is Artificial Intelligence?', selectedLevel, selectedSubject)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Ask EduGenie</span>
              </button>

              <button
                onClick={() => onNavigateTab('quiz')}
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Try 3-MCQ Quiz</span>
              </button>
            </div>

            {/* Key Value Props */}
            <div className="pt-3 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Multi-Model AI Architecture</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Automatic 3-MCQ Quizzes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Beginner to Advanced Roadmaps</span>
              </div>
            </div>
          </div>

          {/* Clean Educational AI Illustration */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xl shadow-indigo-100 bg-slate-900 group">
              <img
                src={heroImg}
                alt="EduGenie educational learning assistant visual"
                className="w-full h-auto object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <div className="text-xs uppercase tracking-wider font-semibold text-indigo-300 mb-1">
                  AI Knowledge & Learning Suite
                </div>
                <div className="text-base font-bold text-white">
                  Ask. Understand. Master.
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Q&A, simplified explanations, automatic quizzes, smart summaries & personalized learning paths.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instant Question Input Deck on Home */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Ready to learn something new?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Enter any academic question or learning topic to begin right away.
              </p>
            </div>

            {/* Quick Level Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
              {(['beginner', 'intermediate', 'advanced'] as LearningLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                    selectedLevel === lvl
                      ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleQuickSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Enter your question or learning topic... (e.g. What is Artificial Intelligence?)"
                className="w-full px-4 py-3.5 text-sm sm:text-base text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Optional Subject Context Selector */}
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="font-medium text-slate-500">Subject:</span>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value as Subject)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="General">General</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="English">English</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!quickInput.trim()}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask EduGenie</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Complete Key Features Suite Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1.5">
            Key Capabilities
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Explore EduGenie’s Learning Tools
          </h3>
          <p className="mt-2 text-slate-600 text-sm">
            Everything you need for academic mastery, powered by modular AI models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureModules.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl ${item.color} border flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {item.tag}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => onNavigateTab(item.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer group"
                  >
                    <span>{item.btnText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dashboard Quick Start - What would you like to learn today? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1.5">
            Quick Start Explorer
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            What would you like to learn today?
          </h3>
          <p className="mt-2 text-slate-600 text-sm">
            Select an example topic below to immediately explore it with EduGenie.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {exampleCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <button
                key={idx}
                onClick={() => onAskQuestion(card.question, selectedLevel, card.category)}
                className="group bg-white p-5 rounded-2xl border border-slate-200 text-left hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3 cursor-pointer"
              >
                <div className="space-y-3">
                  <div className={`w-9 h-9 rounded-xl ${card.accent} border flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {card.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {card.subtitle}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                  <span className="italic truncate max-w-[150px]">“{card.question}”</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0 ml-1" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1.5">
            How It Works
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            The Interactive Learning Flow
          </h3>
          <p className="mt-2 text-slate-600 text-sm">
            Student asks a question → EduGenie analyzes the request → AI generates an educational response → Student continues learning through follow-up questions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold font-display">
              1
            </div>
            <h4 className="text-base font-bold text-slate-900">Enter Academic Topic</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Ask any syllabus question or theory. Customize your learning level (Beginner, Intermediate, Advanced) and subject.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold font-display">
              2
            </div>
            <h4 className="text-base font-bold text-slate-900">Structured AI Response</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              EduGenie breaks down the concept into an intuitive Explanation, Important Points, Real-World Example, and Key Terms.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold font-display">
              3
            </div>
            <h4 className="text-base font-bold text-slate-900">Follow-Up & Deeper Understanding</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Click Quick Actions like “Explain Simpler”, “Give Example”, or “Explain Step-by-Step” to clarify doubts interactively.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <h3 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-balance">
              Start learning with EduGenie today
            </h3>
            <p className="text-indigo-200 text-sm sm:text-base">
              Personalized explanations, instant follow-up answers, 3-MCQ quizzes, smart summarization, and clear educational roadmaps designed for students.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onStartLearning}
                className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-bold text-indigo-950 bg-white hover:bg-indigo-50 rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Launch AI Tutor</span>
              </button>

              <button
                onClick={() => onNavigateTab('quiz')}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-base font-bold text-white bg-indigo-700/60 hover:bg-indigo-700 border border-indigo-500/50 rounded-xl transition-colors cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Take a 3-MCQ Quiz</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
