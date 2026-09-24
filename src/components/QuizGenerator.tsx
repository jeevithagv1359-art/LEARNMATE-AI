import React, { useState } from 'react';
import { HelpCircle, Sparkles, RefreshCw, CheckCircle2, XCircle, ArrowRight, RotateCcw, BookOpen, AlertCircle, FileText } from 'lucide-react';
import { QuizData, QuizQuestion } from '../types';

interface QuizGeneratorProps {
  onSaveQuiz?: (quiz: QuizData) => void;
  onNavigateToTopic?: (topic: string) => void;
}

export const QuizGenerator: React.FC<QuizGeneratorProps> = ({ onSaveQuiz, onNavigateToTopic }) => {
  const [inputType, setInputType] = useState<'topic' | 'passage'>('topic');
  const [topicInput, setTopicInput] = useState('');
  const [passageInput, setPassageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sampleTopics = [
    'Newtonian Mechanics & Force Pairs',
    'Cellular Respiration & Mitochondria',
    'Database Normalization & ACID',
    'Supervised vs Unsupervised Learning',
    'Plate Tectonics & Earthquakes',
  ];

  const handleGenerate = async (presetTopic?: string) => {
    const topicToUse = presetTopic || topicInput;

    if (inputType === 'topic' && !topicToUse.trim()) {
      setErrorMessage('Please enter a topic name to generate a quiz.');
      return;
    }

    if (inputType === 'passage' && (!passageInput || passageInput.trim().length < 30)) {
      setErrorMessage('Please enter a passage of at least 30 characters.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSelectedAnswers({});
    setIsSubmitted(false);

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: inputType === 'topic' ? topicToUse.trim() : undefined,
          passage: inputType === 'passage' ? passageInput.trim() : undefined,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.error || 'Failed to generate quiz.');
      }

      const data: QuizData = await response.json();
      setCurrentQuiz(data);
      if (onSaveQuiz) {
        onSaveQuiz(data);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error generating quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (isSubmitted) return; // Prevent changing after submission
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    if (!currentQuiz) return;
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < currentQuiz.questions.length) {
      if (!confirm(`You have only answered ${answeredCount} of ${currentQuiz.questions.length} questions. Submit anyway?`)) {
        return;
      }
    }
    setIsSubmitted(true);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  // Calculate score
  const calculateScore = () => {
    if (!currentQuiz) return { score: 0, total: 3, percentage: 0 };
    let correct = 0;
    currentQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });
    const total = currentQuiz.questions.length;
    const percentage = Math.round((correct / total) * 100);
    return { score: correct, total, percentage };
  };

  const { score, total, percentage } = calculateScore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Deck */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-700">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Automatic Quiz Generation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
          Test Your Knowledge
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Instantly generates 3 multiple-choice questions with 4 options each from any academic topic or reading passage.
        </p>
      </div>

      {/* Generator Configuration Deck */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Source Mode
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              type="button"
              onClick={() => setInputType('topic')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                inputType === 'topic'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Generate by Topic
            </button>
            <button
              type="button"
              onClick={() => setInputType('passage')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                inputType === 'passage'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Generate from Passage
            </button>
          </div>
        </div>

        {inputType === 'topic' ? (
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              Academic Topic or Subject
            </label>
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="e.g. Machine Learning, Newton's Laws, Photosynthesis, World War II..."
              className="w-full px-4 py-3 text-sm sm:text-base text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400"
            />

            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 pt-1">
              <span className="font-medium mr-1">Popular Topics:</span>
              {sampleTopics.map((topic, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setTopicInput(topic);
                    handleGenerate(topic);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 transition-colors cursor-pointer"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              Paste Educational Passage or Textbook Notes
            </label>
            <textarea
              value={passageInput}
              onChange={(e) => setPassageInput(e.target.value)}
              placeholder="Paste a textbook paragraph, lecture notes, or educational text here to auto-generate 3 targeted MCQs..."
              rows={4}
              className="w-full px-4 py-3 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400 resize-y"
            />
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => handleGenerate()}
            disabled={isLoading || (inputType === 'topic' ? !topicInput.trim() : !passageInput.trim())}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating 3 MCQs...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate 3-Question Quiz</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <p className="flex-1 text-xs sm:text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6 animate-pulse">
          <div className="h-5 bg-slate-200 rounded-full w-52" />
          {[1, 2, 3].map((n) => (
            <div key={n} className="space-y-3 p-4 bg-slate-50 rounded-2xl">
              <div className="h-4 bg-slate-200 rounded-full w-3/4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <div className="h-10 bg-slate-200 rounded-xl" />
                <div className="h-10 bg-slate-200 rounded-xl" />
                <div className="h-10 bg-slate-200 rounded-xl" />
                <div className="h-10 bg-slate-200 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quiz Display Card */}
      {currentQuiz && !isLoading && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
          {/* Quiz Header & Score Deck */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 mb-1">
                <span className="bg-indigo-50 px-2.5 py-0.5 rounded-md">3 MCQs · 4 Options Each</span>
                <span>•</span>
                <span className="text-slate-400 font-normal">Self-Assessment</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                {currentQuiz.topic}
              </h2>
            </div>

            {isSubmitted && (
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl">
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Score</div>
                  <div className="text-lg font-extrabold text-slate-900 leading-tight">
                    {score} / {total}
                  </div>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white ${
                    percentage >= 70 ? 'bg-emerald-600' : percentage >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                >
                  {percentage}%
                </div>
              </div>
            )}
          </div>

          {/* 3 Questions */}
          <div className="space-y-8">
            {currentQuiz.questions.map((question, qIdx) => {
              const selectedOpt = selectedAnswers[qIdx];
              const isCorrect = selectedOpt === question.correctIndex;

              return (
                <div
                  key={question.id || qIdx}
                  className="space-y-4 p-5 sm:p-6 rounded-2xl bg-slate-50/70 border border-slate-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      <span className="text-indigo-600 mr-2">Q{qIdx + 1}.</span>
                      {question.question}
                    </h3>

                    {isSubmitted && (
                      <span className="shrink-0 mt-1">
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                            <XCircle className="w-3.5 h-3.5" /> Incorrect
                          </span>
                        )}
                      </span>
                    )}
                  </div>

                  {/* 4 Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {question.options.map((option, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      const isAnswer = optIdx === question.correctIndex;

                      let buttonStyle = 'bg-white border-slate-200 hover:border-indigo-300 text-slate-800';

                      if (isSubmitted) {
                        if (isAnswer) {
                          buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                        } else if (isSelected && !isAnswer) {
                          buttonStyle = 'bg-rose-50 border-rose-400 text-rose-950 line-through opacity-80';
                        } else {
                          buttonStyle = 'bg-white border-slate-200 opacity-60 text-slate-600';
                        }
                      } else if (isSelected) {
                        buttonStyle = 'bg-indigo-50 border-indigo-600 text-indigo-950 font-semibold ring-2 ring-indigo-500/30';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={isSubmitted}
                          onClick={() => handleSelectOption(qIdx, optIdx)}
                          className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-3 ${buttonStyle}`}
                        >
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                              isSubmitted && isAnswer
                                ? 'bg-emerald-600 text-white'
                                : isSubmitted && isSelected && !isAnswer
                                ? 'bg-rose-600 text-white'
                                : isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </div>
                          <span className="flex-1 leading-snug">{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation (Shown when submitted) */}
                  {isSubmitted && (
                    <div className="mt-3 p-3.5 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm space-y-1">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs text-indigo-700">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Why this is correct:</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Deck */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div>
              {isSubmitted ? (
                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Quiz</span>
                </button>
              ) : (
                <span className="text-xs text-slate-500">
                  Select your answers to see instant grading and explanations.
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!isSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit & Check Answers</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleGenerate()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Another Quiz</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
