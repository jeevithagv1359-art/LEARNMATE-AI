import React, { useState } from 'react';
import { Sparkles, Brain, Cpu, Copy, Check, Volume2, ArrowRight, RefreshCw, AlertCircle, Lightbulb } from 'lucide-react';
import { SimplifiedConceptData } from '../types';

interface ConceptSimplifierProps {
  onSaveConcept?: (concept: SimplifiedConceptData) => void;
  onExploreInChat?: (concept: string) => void;
}

export const ConceptSimplifier: React.FC<ConceptSimplifierProps> = ({
  onSaveConcept,
  onExploreInChat,
}) => {
  const [conceptInput, setConceptInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<'lamini' | 'cloud'>('lamini');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SimplifiedConceptData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const sampleConcepts = [
    { name: 'Quantum Entanglement', hint: 'Physics' },
    { name: 'Blockchain Consensus', hint: 'Computer Science' },
    { name: 'Photosynthesis & ATP', hint: 'Biology' },
    { name: 'CRISPR Gene Editing', hint: 'Biotechnology' },
    { name: 'Inflation & Interest Rates', hint: 'Economics' },
    { name: 'Recursion in Programming', hint: 'Computer Science' },
  ];

  const handleSimplify = async (targetConcept?: string) => {
    const text = (targetConcept || conceptInput).trim();
    if (!text) {
      setErrorMessage('Please enter a concept or topic to simplify.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setCopied(false);

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: text,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || 'Failed to simplify concept.');
      }

      const data: SimplifiedConceptData = await response.json();
      setResult(data);
      if (onSaveConcept) {
        onSaveConcept(data);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Could not simplify this concept right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const textToCopy = `Concept: ${result.concept}
Model: ${result.modelUsed}

Explanation:
${result.explanation}

Analogy:
${result.simpleAnalogy}

Key Takeaways:
${result.keyTakeaways.map((t) => `- ${t}`).join('\n')}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!result || typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `${result.concept}. ${result.explanation}. Think of it like this: ${result.simpleAnalogy}`
    );
    utterance.rate = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Deck */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-xs font-semibold text-violet-700">
          <Lightbulb className="w-3.5 h-3.5 text-violet-600" />
          <span>Simplified Concept Explanation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
          Understand Any Complex Topic
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Converts complicated academic theories into intuitive, beginner-friendly explanations with relatable analogies.
        </p>
      </div>

      {/* Multi-Model Selector Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Multi-Model AI Architecture
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Select engine for concept breakdown
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Lightweight Option: LaMini-Flan-T5 */}
          <button
            type="button"
            onClick={() => setSelectedModel('lamini')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              selectedModel === 'lamini'
                ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-indigo-600" />
                  LaMini-Flan-T5
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  Lightweight / Fast
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Ultra-fast, concise, simple beginner phrasing. Optimized for fast inference on modest hardware & Mac M1.
              </p>
            </div>
            <div className="mt-3 text-[11px] font-medium text-indigo-700">
              ⚡ Minimal latency · Pure clarity
            </div>
          </button>

          {/* Cloud Option: Cloud Generative AI */}
          <button
            type="button"
            onClick={() => setSelectedModel('cloud')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              selectedModel === 'cloud'
                ? 'border-violet-600 bg-violet-50/60 ring-2 ring-violet-500/20'
                : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-violet-600" />
                  Cloud Generative AI
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                  Cloud Generative AI
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Deep academic reasoning, multi-layered analogies, and comprehensive takeaway synthesis.
              </p>
            </div>
            <div className="mt-3 text-[11px] font-medium text-violet-700">
              ☁️ Rich nuances · High accuracy
            </div>
          </button>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSimplify();
          }}
          className="space-y-3 pt-2"
        >
          <div className="relative">
            <input
              type="text"
              value={conceptInput}
              onChange={(e) => setConceptInput(e.target.value)}
              placeholder="Enter any complex concept (e.g., Quantum Entanglement, CRISPR, Recursion)..."
              className="w-full px-4 py-3 text-sm sm:text-base text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Quick Sample Tags */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium mr-1">Try:</span>
              {sampleConcepts.slice(0, 3).map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setConceptInput(sample.name);
                    handleSimplify(sample.name);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs transition-colors cursor-pointer"
                >
                  {sample.name}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || !conceptInput.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Simplifying...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Simplify Concept</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error notice */}
      {errorMessage && (
        <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <p className="flex-1 text-xs sm:text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-5 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-slate-200 rounded-full w-48" />
            <div className="h-6 bg-slate-200 rounded-full w-24" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 rounded-full w-full" />
            <div className="h-3 bg-slate-200 rounded-full w-5/6" />
            <div className="h-3 bg-slate-200 rounded-full w-4/6" />
          </div>
          <div className="h-20 bg-slate-100 rounded-2xl w-full" />
        </div>
      )}

      {/* Result Card */}
      {result && !isLoading && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700">
                {result.modelUsed}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-2 font-display">
                {result.concept}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeak}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                title={isPlayingAudio ? 'Stop Reading' : 'Listen with Audio'}
              >
                <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'text-indigo-600 animate-pulse' : ''}`} />
              </button>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Simple Explanation */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Simple Explanation
            </div>
            <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-normal">
              {result.explanation}
            </p>
          </div>

          {/* Everyday Analogy */}
          {result.simpleAnalogy && (
            <div className="bg-gradient-to-r from-amber-50/80 to-amber-100/50 border border-amber-200/80 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Memorable Analogy</span>
              </div>
              <p className="text-sm sm:text-base text-amber-950 leading-relaxed italic">
                “{result.simpleAnalogy}”
              </p>
            </div>
          )}

          {/* Key Takeaways */}
          {result.keyTakeaways && result.keyTakeaways.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Key Takeaways
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {result.keyTakeaways.map((takeaway, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-800"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                      ✓
                    </div>
                    <span className="leading-relaxed">{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action to explore deeper */}
          {onExploreInChat && (
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => onExploreInChat(`Explain ${result.concept} in more depth and give exam questions.`)}
                className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer group"
              >
                <span>Ask follow-up questions in AI Tutor</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
