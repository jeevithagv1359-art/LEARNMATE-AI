import React, { useState } from 'react';
import { FileText, Sparkles, Copy, Check, Clock, TrendingDown, ArrowRight, RefreshCw, AlertCircle, BookOpen } from 'lucide-react';
import { SummaryData } from '../types';

interface SmartSummarizerProps {
  onSaveSummary?: (summary: SummaryData) => void;
}

export const SmartSummarizer: React.FC<SmartSummarizerProps> = ({ onSaveSummary }) => {
  const [passageInput, setPassageInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summaryResult, setSummaryResult] = useState<SummaryData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const samplePassages = [
    {
      title: 'Cell Division: Mitosis & Meiosis',
      text: `Cell division is the biological process by which a parent cell divides into two or more daughter cells. In eukaryotes, there are two distinct types of cell division: mitosis and meiosis. Mitosis is a vegetative division wherein each daughter cell duplicates the exact chromosomal composition of the parent cell, which is fundamental for tissue growth, regular cell replacement, and asexual reproduction. It progresses through five distinct stages: prophase, prometaphase, metaphase, anaphase, and telophase, accompanied by cytokinesis. Conversely, meiosis is a specialized reductive division occurring in germ cells to produce gametes (sperm and egg cells). Meiosis reduces the chromosome count by half—from diploid (2n) to haploid (1n)—via two sequential rounds of nuclear division (Meiosis I and Meiosis II). Crucially, during prophase I of meiosis, homologous chromosomes undergo genetic recombination or crossing-over, which introduces indispensable genetic diversity across generations.`,
    },
    {
      title: 'The Industrial Revolution & Steam Power',
      text: `The Industrial Revolution, beginning in Great Britain during the mid-18th century, marked a profound turning point in human economic and technological history. Prior to this epoch, manufacturing was almost exclusively agrarian, artisanal, and reliant on human muscle, draught animals, or unpredictable watermills. The development and widespread commercialization of James Watt's improved steam engine in 1776 drastically transformed production capacity. Steam engines liberated factories from geographical dependence on swift-flowing rivers, allowing massive textile mills and iron foundries to cluster near coalfields and urban transportation hubs. This mechanized transition catalyzed unprecedented urban migration, fundamentally reconfigured societal labor relations, spawned the modern factory system, and dramatically stimulated global trade networks through steamships and transcontinental railways, laying the direct infrastructure of our modern industrialized world.`,
    },
    {
      title: 'Theory of Special Relativity',
      text: `Proposed by Albert Einstein in 1905, the Special Theory of Relativity fundamentally revolutionized classical Newtonian mechanics by revising our understanding of space and time. It rests upon two foundational postulates: first, the laws of physics are invariant across all inertial reference frames; second, the speed of light in a vacuum is universally constant (approximately 299,792 kilometers per second) regardless of the motion of the light source or observer. From these counter-intuitive postulates emerge radical physical consequences, including time dilation (moving clocks tick demonstrably slower relative to a stationary observer), length contraction (objects shrink along the axis of relative motion), and the relativity of simultaneity. Perhaps most celebrated is the mass-energy equivalence expressed by E = mc², demonstrating that mass and energy are mutually convertible manifestations of the same physical entity.`,
    },
  ];

  const handleSummarize = async (presetText?: string, presetTitle?: string) => {
    const textToUse = (presetText || passageInput).trim();
    const titleToUse = (presetTitle || titleInput).trim() || 'Educational Passage';

    if (!textToUse || textToUse.length < 30) {
      setErrorMessage('Please enter an educational passage with at least 30 characters to summarize.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setCopied(false);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToUse,
          title: titleToUse,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.error || 'Failed to summarize passage.');
      }

      const data: SummaryData = await response.json();
      setSummaryResult(data);
      if (onSaveSummary) {
        onSaveSummary(data);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error creating summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!summaryResult) return;
    const textToCopy = `Summary: ${summaryResult.title}
    
${summaryResult.summary}

Key Takeaways:
${summaryResult.keyPoints.map((p) => `• ${p}`).join('\n')}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Deck */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-xs font-semibold text-sky-700">
          <FileText className="w-3.5 h-3.5 text-sky-600" />
          <span>Smart Summarization</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
          Digest Long Texts in Seconds
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Condenses long academic articles, textbook chapters, and research notes into crisp, high-retention summaries while keeping all critical points.
        </p>
      </div>

      {/* Input Deck */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-700">
              Optional Passage Title
            </label>
            <span className="text-[11px] text-slate-400">Helps organize your study notes</span>
          </div>
          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            placeholder="e.g. Chapter 4: Photosynthesis & Chloroplasts..."
            className="w-full px-4 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700">
            Educational Passage / Study Text
          </label>
          <textarea
            value={passageInput}
            onChange={(e) => setPassageInput(e.target.value)}
            placeholder="Paste your lengthy textbook reading, syllabus passage, or research notes here..."
            rows={6}
            className="w-full px-4 py-3 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400 resize-y"
          />
        </div>

        {/* Preset Sample Passages */}
        <div className="space-y-2 pt-1">
          <div className="text-xs font-medium text-slate-500">Or try a sample academic reading:</div>
          <div className="flex flex-wrap gap-2">
            {samplePassages.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setTitleInput(item.title);
                  setPassageInput(item.text);
                  handleSummarize(item.text, item.title);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-sky-800 text-xs font-medium text-slate-700 transition-colors cursor-pointer border border-transparent hover:border-sky-200"
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => handleSummarize()}
            disabled={isLoading || !passageInput.trim()}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Summarizing Text...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Smart Summary</span>
              </>
            )}
          </button>
        </div>
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
          <div className="grid grid-cols-3 gap-4">
            <div className="h-14 bg-slate-100 rounded-2xl" />
            <div className="h-14 bg-slate-100 rounded-2xl" />
            <div className="h-14 bg-slate-100 rounded-2xl" />
          </div>
          <div className="h-4 bg-slate-200 rounded-full w-48" />
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 rounded-full w-full" />
            <div className="h-3 bg-slate-200 rounded-full w-5/6" />
            <div className="h-3 bg-slate-200 rounded-full w-4/6" />
          </div>
        </div>
      )}

      {/* Result Display */}
      {summaryResult && !isLoading && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Header & Metrics */}
          <div className="space-y-4 pb-4 border-b border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-sky-50 text-sky-700">
                  Preserved Key Knowledge
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1.5 font-display">
                  {summaryResult.title}
                </h2>
              </div>

              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
              </button>
            </div>

            {/* Compression Metrics Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 text-center">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Original Words
                </div>
                <div className="text-xl font-bold text-slate-800 mt-0.5 tabular-nums">
                  {summaryResult.originalWordCount}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 text-center">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Summary Words
                </div>
                <div className="text-xl font-bold text-indigo-700 mt-0.5 tabular-nums">
                  {summaryResult.summaryWordCount}
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3.5 text-center">
                <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider flex items-center justify-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Compression</span>
                </div>
                <div className="text-xl font-bold text-emerald-800 mt-0.5 tabular-nums">
                  {summaryResult.compressionRatio}% Shorter
                </div>
              </div>
            </div>
          </div>

          {/* Executive Summary Prose */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Executive Summary
            </div>
            <p className="text-base text-slate-800 leading-relaxed font-normal">
              {summaryResult.summary}
            </p>
          </div>

          {/* Key Bullet Takeaways */}
          {summaryResult.keyPoints && summaryResult.keyPoints.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Core Academic Takeaways
              </div>
              <div className="space-y-2">
                {summaryResult.keyPoints.map((point, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs sm:text-sm text-slate-800"
                  >
                    <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                      {i + 1}
                    </div>
                    <span className="leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
