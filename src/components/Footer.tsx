import React from 'react';
import { Sparkles } from 'lucide-react';
import { NavigationTab } from '../types';

interface FooterProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-slate-900 font-display">EduGenie</div>
              <div className="text-[11px] text-slate-500">Google Gemini Powered Learning Assistant</div>
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-600 font-medium">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('assistant')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              AI Tutor
            </button>
            <button
              onClick={() => onNavigate('explain')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Concept Simplifier
            </button>
            <button
              onClick={() => onNavigate('quiz')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              3-MCQ Quiz Generator
            </button>
            <button
              onClick={() => onNavigate('summarize')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Smart Summarizer
            </button>
            <button
              onClick={() => onNavigate('path')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Learning Paths
            </button>
            <button
              onClick={() => onNavigate('history')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              My Learning
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              About
            </button>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} EduGenie. Built for interactive academic learning with Google Gemini & Multi-Model AI.</p>
          <p>Multi-Model AI Architecture · Lightweight Local + Cloud Gemini</p>
        </div>
      </div>
    </footer>
  );
};
