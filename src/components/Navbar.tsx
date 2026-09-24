import React, { useState } from 'react';
import { Sparkles, Menu, X, BookOpen, Clock, Info, HelpCircle, FileText, Compass, Lightbulb } from 'lucide-react';
import { NavigationTab } from '../types';

interface NavbarProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: NavigationTab) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  const navItems: Array<{ id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'home', label: 'Home', icon: BookOpen },
    { id: 'assistant', label: 'AI Tutor', icon: Sparkles },
    { id: 'explain', label: 'Concept Simplifier', icon: Lightbulb },
    { id: 'quiz', label: 'Quiz Generator', icon: HelpCircle },
    { id: 'summarize', label: 'Smart Summarizer', icon: FileText },
    { id: 'path', label: 'Learning Paths', icon: Compass },
    { id: 'history', label: 'My Learning', icon: Clock },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Wordmark & Subtitle */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform shrink-0">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 font-display block leading-none">
                EduGenie
              </span>
              <span className="text-[10px] font-medium text-slate-500 hidden sm:block mt-0.5 tracking-tight">
                AI Learning Assistant & Knowledge Suite
              </span>
            </div>
          </button>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors hover:text-slate-900 py-1 border-b-2 cursor-pointer whitespace-nowrap ${
                  currentTab === item.id
                    ? 'text-indigo-600 border-indigo-600 font-semibold'
                    : 'border-transparent text-slate-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Medium screen navigation summary */}
          <div className="hidden md:flex xl:hidden items-center gap-4 text-xs font-semibold text-slate-600">
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-indigo-600 ${currentTab === 'home' ? 'text-indigo-600 font-bold' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('assistant')}
              className={`hover:text-indigo-600 ${currentTab === 'assistant' ? 'text-indigo-600 font-bold' : ''}`}
            >
              AI Tutor
            </button>
            <button
              onClick={() => handleNavClick('quiz')}
              className={`hover:text-indigo-600 ${currentTab === 'quiz' ? 'text-indigo-600 font-bold' : ''}`}
            >
              Quiz (3 MCQs)
            </button>
            <button
              onClick={() => handleNavClick('explain')}
              className={`hover:text-indigo-600 ${currentTab === 'explain' ? 'text-indigo-600 font-bold' : ''}`}
            >
              Simplifier
            </button>
            <button
              onClick={() => handleNavClick('summarize')}
              className={`hover:text-indigo-600 ${currentTab === 'summarize' ? 'text-indigo-600 font-bold' : ''}`}
            >
              Summarize
            </button>
            <button
              onClick={() => handleNavClick('path')}
              className={`hover:text-indigo-600 ${currentTab === 'path' ? 'text-indigo-600 font-bold' : ''}`}
            >
              Paths
            </button>
            <button
              onClick={() => handleNavClick('history')}
              className={`hover:text-indigo-600 ${currentTab === 'history' ? 'text-indigo-600 font-bold' : ''}`}
            >
              My Learning
            </button>
          </div>

          {/* Prominent Action */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => handleNavClick('assistant')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask EduGenie</span>
            </button>
          </div>

          {/* Mobile menu toggle button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1 shadow-lg max-h-[85vh] overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2">
            <button
              onClick={() => handleNavClick('assistant')}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Learning</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
