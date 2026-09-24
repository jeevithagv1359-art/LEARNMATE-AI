import React, { useState } from 'react';
import {
  Clock,
  Search,
  ArrowRight,
  Trash2,
  BookOpen,
  Download,
  Sparkles,
  AlertCircle,
  HelpCircle,
  FileText,
  Compass,
  Lightbulb,
} from 'lucide-react';
import {
  LearningSession,
  QuizData,
  SummaryData,
  LearningPathData,
  SimplifiedConceptData,
  NavigationTab,
} from '../types';

interface MyLearningProps {
  sessions: LearningSession[];
  quizzes: QuizData[];
  summaries: SummaryData[];
  learningPaths: LearningPathData[];
  concepts: SimplifiedConceptData[];
  onSelectSession: (session: LearningSession) => void;
  onDeleteSession: (id: string) => void;
  onDeleteQuiz: (id: string) => void;
  onDeleteSummary: (id: string) => void;
  onDeletePath: (id: string) => void;
  onClearAll: () => void;
  onStartNew: () => void;
  onNavigateTab: (tab: NavigationTab) => void;
}

export const MyLearning: React.FC<MyLearningProps> = ({
  sessions,
  quizzes,
  summaries,
  learningPaths,
  concepts,
  onSelectSession,
  onDeleteSession,
  onDeleteQuiz,
  onDeleteSummary,
  onDeletePath,
  onClearAll,
  onStartNew,
  onNavigateTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'sessions' | 'quizzes' | 'summaries' | 'paths'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const term = searchTerm.toLowerCase();

  const filteredSessions = sessions.filter((s) => {
    return (
      s.title.toLowerCase().includes(term) ||
      s.topic.toLowerCase().includes(term) ||
      s.subject?.toLowerCase().includes(term) ||
      s.lastQuestion?.toLowerCase().includes(term)
    );
  });

  const filteredQuizzes = quizzes.filter((q) => {
    return (
      q.topic.toLowerCase().includes(term) ||
      q.questions.some((qu) => qu.question.toLowerCase().includes(term))
    );
  });

  const filteredSummaries = summaries.filter((s) => {
    return s.title.toLowerCase().includes(term) || s.summary.toLowerCase().includes(term);
  });

  const filteredPaths = learningPaths.filter((p) => {
    return p.topic.toLowerCase().includes(term) || p.overview.toLowerCase().includes(term);
  });

  const handleExportNotes = (session: LearningSession) => {
    const formatted = `# EduGenie Study Session: ${session.title}
Subject: ${session.subject || session.topic || 'General'}
Learning Level: ${session.level || 'intermediate'}
Date: ${new Date(session.updatedAt).toLocaleString()}

---

${session.messages
  .map(
    (m) => `### [${m.role === 'user' ? 'Student' : 'EduGenie Assistant'}] (${new Date(m.timestamp).toLocaleTimeString()}):
${m.content}
`
  )
  .join('\n---\n')}
`;

    const blob = new Blob([formatted], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edugenie-${(session.subject || session.title).toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalArtifactsCount = sessions.length + quizzes.length + summaries.length + learningPaths.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Deck */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700 mb-2">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Learning History & Saved Materials</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            My Learning
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Review and continue your past questions, practice quizzes, smart summaries, and learning roadmaps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {totalArtifactsCount > 0 && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear your local learning history?')) {
                  onClearAll();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}

          <button
            onClick={onStartNew}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>New Learning Session</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Category Pill Filters */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveSubTab('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeSubTab === 'all'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Items ({totalArtifactsCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('sessions')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeSubTab === 'sessions'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Q&A ({sessions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('quizzes')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeSubTab === 'quizzes'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Quizzes ({quizzes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('summaries')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeSubTab === 'summaries'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Summaries ({summaries.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('paths')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeSubTab === 'paths'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Roadmaps ({learningPaths.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search past topics, questions, or roadmaps..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-8">
        {/* SESSIONS SECTION */}
        {(activeSubTab === 'all' || activeSubTab === 'sessions') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Q&A Chat Sessions</span>
              </h2>
              <span className="text-xs text-slate-400">
                {filteredSessions.length} {filteredSessions.length === 1 ? 'session' : 'sessions'}
              </span>
            </div>

            {filteredSessions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500 text-xs">
                No matching chat sessions found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                          {session.subject || session.topic || 'Academic'}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(session.updatedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                          {session.title}
                        </h3>
                        {session.lastQuestion && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 italic">
                            Last asked: “{session.lastQuestion}”
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleExportNotes(session)}
                          title="Export as Markdown notes"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteSession(session.id)}
                          title="Delete session"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => onSelectSession(session)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer group"
                      >
                        <span>Continue Learning</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* QUIZZES SECTION */}
        {(activeSubTab === 'all' || activeSubTab === 'quizzes') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>3-Question Practice Quizzes</span>
              </h2>
              <span className="text-xs text-slate-400">
                {filteredQuizzes.length} {filteredQuizzes.length === 1 ? 'quiz' : 'quizzes'}
              </span>
            </div>

            {filteredQuizzes.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500 text-xs">
                No practice quizzes saved yet.{' '}
                <button
                  onClick={() => onNavigateTab('quiz')}
                  className="text-indigo-600 font-semibold underline hover:text-indigo-800 ml-1 cursor-pointer"
                >
                  Generate a quiz now.
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                          3 MCQs · 4 Options Each
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(quiz.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                        {quiz.topic}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        Sample Q: “{quiz.questions[0]?.question}”
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => onDeleteQuiz(quiz.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onNavigateTab('quiz')}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer group"
                      >
                        <span>Take / Retake Quiz</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUMMARIES SECTION */}
        {(activeSubTab === 'all' || activeSubTab === 'summaries') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-600" />
                <span>Smart Summaries</span>
              </h2>
              <span className="text-xs text-slate-400">
                {filteredSummaries.length} {filteredSummaries.length === 1 ? 'summary' : 'summaries'}
              </span>
            </div>

            {filteredSummaries.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500 text-xs">
                No summaries created yet.{' '}
                <button
                  onClick={() => onNavigateTab('summarize')}
                  className="text-indigo-600 font-semibold underline hover:text-indigo-800 ml-1 cursor-pointer"
                >
                  Summarize a passage.
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSummaries.map((sum) => (
                  <div
                    key={sum.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700">
                          {sum.compressionRatio}% Shorter
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(sum.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                        {sum.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {sum.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => onDeleteSummary(sum.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onNavigateTab('summarize')}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors cursor-pointer group"
                      >
                        <span>Open Summarizer</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* LEARNING PATHS SECTION */}
        {(activeSubTab === 'all' || activeSubTab === 'paths') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-purple-600" />
                <span>Personalized Learning Roadmaps</span>
              </h2>
              <span className="text-xs text-slate-400">
                {filteredPaths.length} {filteredPaths.length === 1 ? 'roadmap' : 'roadmaps'}
              </span>
            </div>

            {filteredPaths.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500 text-xs">
                No learning roadmaps generated yet.{' '}
                <button
                  onClick={() => onNavigateTab('path')}
                  className="text-indigo-600 font-semibold underline hover:text-indigo-800 ml-1 cursor-pointer"
                >
                  Build a roadmap.
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPaths.map((path) => (
                  <div
                    key={path.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700">
                          {path.totalDuration}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(path.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                        {path.topic}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {path.overview}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => onDeletePath(path.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onNavigateTab('path')}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors cursor-pointer group"
                      >
                        <span>View Roadmap</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
