import React, { useState } from 'react';
import { Compass, Sparkles, Download, CheckCircle2, BookOpen, Layers, ArrowRight, RefreshCw, AlertCircle, Calendar, GraduationCap } from 'lucide-react';
import { LearningPathData, LearningPathMilestone } from '../types';

interface LearningPathPlannerProps {
  onSavePath?: (pathData: LearningPathData) => void;
  onExploreInChat?: (topic: string) => void;
}

export const LearningPathPlanner: React.FC<LearningPathPlannerProps> = ({
  onSavePath,
  onExploreInChat,
}) => {
  const [topicInput, setTopicInput] = useState('');
  const [goalInput, setGoalInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState<LearningPathData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const samplePathTopics = [
    'Machine Learning & Deep Neural Networks',
    'Full-Stack Web Development',
    'Quantum Computing & Mechanics',
    'Data Science & Statistical Analysis',
    'Organic Chemistry Mastery',
  ];

  const handleGeneratePath = async (presetTopic?: string) => {
    const topicToUse = (presetTopic || topicInput).trim();
    if (!topicToUse) {
      setErrorMessage('Please enter a subject or skill to plan a learning path.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/learning-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicToUse,
          goal: goalInput.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.error || 'Failed to generate learning path.');
      }

      const data: LearningPathData = await response.json();
      setCurrentPath(data);
      if (onSavePath) {
        onSavePath(data);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Could not generate learning path. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportMarkdown = () => {
    if (!currentPath) return;

    let md = `# Learning Path: ${currentPath.topic}
**Estimated Duration**: ${currentPath.totalDuration}
**Target Audience**: ${currentPath.targetAudience}

## Overview
${currentPath.overview}

---

`;

    currentPath.milestones.forEach((m) => {
      md += `### Stage: ${m.stage} (${m.durationWeeks})
${m.description}

**Core Concepts:**
${m.coreConcepts.map((c) => `- ${c}`).join('\n')}

**Practical Projects:**
${m.practicalProjects.map((p) => `- ${p}`).join('\n')}

**Recommended Resources:**
${m.recommendedResources.map((r) => `- [${r.type}] ${r.name}: ${r.description || ''}`).join('\n')}

---
`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edugenie-roadmap-${currentPath.topic.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'beginner':
        return {
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          border: 'border-emerald-200',
        };
      case 'intermediate':
        return {
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          dot: 'bg-indigo-500',
          border: 'border-indigo-200',
        };
      case 'advanced':
        return {
          badge: 'bg-purple-50 text-purple-700 border-purple-200',
          dot: 'bg-purple-500',
          border: 'border-purple-200',
        };
      default:
        return {
          badge: 'bg-slate-50 text-slate-700 border-slate-200',
          dot: 'bg-slate-500',
          border: 'border-slate-200',
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Deck */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700">
          <Compass className="w-3.5 h-3.5 text-indigo-600" />
          <span>Personalized Learning Paths</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
          Curated Roadmap to Mastery
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Generates structured milestone plans from Beginner to Advanced with topics, realistic timelines, practical projects, and vetted resources.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Topic or Skill to Master
            </label>
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="e.g. Machine Learning, Astrophysics, Organic Chemistry..."
              className="w-full px-4 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Optional Goal or Specific Focus
            </label>
            <input
              type="text"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder="e.g. Pass AP exam, build neural networks, university prep..."
              className="w-full px-4 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Quick Sample Topics */}
        <div className="space-y-2 pt-1">
          <div className="text-xs font-medium text-slate-500">Popular Learning Paths:</div>
          <div className="flex flex-wrap gap-2">
            {samplePathTopics.map((topic, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setTopicInput(topic);
                  handleGeneratePath(topic);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => handleGeneratePath()}
            disabled={isLoading || !topicInput.trim()}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Designing Learning Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Create Personalized Learning Path</span>
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
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6 animate-pulse">
          <div className="h-6 bg-slate-200 rounded-full w-56" />
          <div className="h-3 bg-slate-200 rounded-full w-3/4" />
          <div className="space-y-4 pt-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 bg-slate-100 rounded-2xl" />
            ))}
          </div>
        </div>
      )}

      {/* Results Display */}
      {currentPath && !isLoading && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
          {/* Header Deck */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 mb-1">
                <span className="bg-indigo-50 px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {currentPath.totalDuration}
                </span>
                <span>•</span>
                <span className="text-slate-500 font-normal">{currentPath.targetAudience}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                {currentPath.topic}
              </h2>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
                {currentPath.overview}
              </p>
            </div>

            <button
              onClick={handleExportMarkdown}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Roadmap</span>
            </button>
          </div>

          {/* Milestones Progression Timeline */}
          <div className="space-y-6">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Progression Milestones (Beginner to Advanced)
            </div>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 sm:before:left-5 before:w-0.5 before:bg-slate-200">
              {currentPath.milestones.map((milestone, idx) => {
                const colors = getStageColor(milestone.stage);

                return (
                  <div key={idx} className="relative flex items-start gap-4 sm:gap-6">
                    {/* Step Icon */}
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-xs shrink-0 z-10 ${
                        idx === 0 ? 'bg-emerald-600' : idx === 1 ? 'bg-indigo-600' : 'bg-purple-600'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 bg-slate-50/70 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${colors.badge}`}>
                            {milestone.stage}
                          </span>
                          <span className="text-xs font-semibold text-slate-500 tabular-nums">
                            {milestone.durationWeeks}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-700 leading-relaxed font-normal">
                        {milestone.description}
                      </p>

                      {/* Core Concepts */}
                      {milestone.coreConcepts && milestone.coreConcepts.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Core Concepts
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {milestone.coreConcepts.map((concept, cIdx) => (
                              <span
                                key={cIdx}
                                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800"
                              >
                                {concept}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Practical Projects */}
                      {milestone.practicalProjects && milestone.practicalProjects.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Hands-On Practice / Projects
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {milestone.practicalProjects.map((project, pIdx) => (
                              <div
                                key={pIdx}
                                className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 flex items-center gap-2"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                <span>{project}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recommended Resources */}
                      {milestone.recommendedResources && milestone.recommendedResources.length > 0 && (
                        <div className="space-y-2 pt-1 border-t border-slate-200/60">
                          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Suggested Study Resources</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {milestone.recommendedResources.map((res, rIdx) => (
                              <div
                                key={rIdx}
                                className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs space-y-0.5"
                              >
                                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                                  <span className="text-[10px] uppercase font-bold text-indigo-600 px-1.5 py-0.5 rounded bg-indigo-50">
                                    {res.type}
                                  </span>
                                  <span className="truncate">{res.name}</span>
                                </div>
                                {res.description && (
                                  <p className="text-[11px] text-slate-500 line-clamp-1">
                                    {res.description}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Follow-up CTA */}
          {onExploreInChat && (
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => onExploreInChat(`Help me start Stage 1 of the ${currentPath.topic} learning path.`)}
                className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer group"
              >
                <span>Start Stage 1 in AI Tutor</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
