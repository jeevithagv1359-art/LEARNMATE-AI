import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, RefreshCw, AlertCircle, ArrowLeft, BookOpen, Layers } from 'lucide-react';
import { ChatMessage, LearningSession, LearningLevel, Subject } from '../types';
import { EducationalResponse } from './EducationalResponse';

interface AiAssistantProps {
  currentSession: LearningSession | null;
  onUpdateSession: (session: LearningSession) => void;
  onNewSession: () => void;
  onBackToHome?: () => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({
  currentSession,
  onUpdateSession,
  onNewSession,
  onBackToHome,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [level, setLevel] = useState<LearningLevel>(currentSession?.level || 'intermediate');
  const [subject, setSubject] = useState<Subject>(currentSession?.subject || 'General');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const messages = currentSession?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (queryToSend?: string) => {
    const text = (queryToSend || inputQuery).trim();

    // Check empty question validation
    if (!text) {
      setErrorMessage('Please enter a question or topic to start learning.');
      return;
    }

    if (isLoading) return;

    setInputQuery('');
    setErrorMessage(null);

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
      level,
      subject,
    };

    const newMessages = [...messages, userMessage];

    // Determine topic/title if this is the first user query
    let updatedTitle = currentSession?.title || text.slice(0, 45);
    if (!currentSession?.title && text.length > 45) {
      updatedTitle = `${text.slice(0, 42)}...`;
    }

    const updatedSession: LearningSession = {
      id: currentSession?.id || `session-${Date.now()}`,
      topic: currentSession?.topic || subject,
      title: updatedTitle,
      lastQuestion: text,
      subject,
      createdAt: currentSession?.createdAt || Date.now(),
      updatedAt: Date.now(),
      level,
      messages: newMessages,
    };

    // Update session state optimistically
    onUpdateSession(updatedSession);
    setIsLoading(true);

    try {
      // Send conversation history, topic, subject and level to backend API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          topic: updatedSession.topic,
          subject,
          learningLevel: level,
        }),
      });

      if (!response.ok) {
        throw new Error("Sorry, EduGenie couldn't generate a response right now. Please try again.");
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        role: 'assistant',
        content: data.reply || 'No response was returned.',
        timestamp: Date.now(),
        level,
        subject,
      };

      onUpdateSession({
        ...updatedSession,
        lastQuestion: text,
        updatedAt: Date.now(),
        messages: [...newMessages, assistantMessage],
      });
    } catch (err: any) {
      console.error('Chat request error:', err);
      setErrorMessage("Sorry, EduGenie couldn't generate a response right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    handleSend(promptText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 h-[calc(100vh-4.5rem)] flex flex-col">
      {/* Top Header Deck */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs mb-3 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Back to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Sparkles className="w-5 h-5 text-indigo-100" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate font-display leading-tight">
              AI Learning Assistant
            </h1>
            <p className="text-xs text-slate-500 truncate">
              Ask anything you want to learn.
            </p>
          </div>
        </div>

        {/* Controls: Subject, Level & New Session */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Subject Context Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
              title="Select subject context"
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

          {/* Learning Level Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as LearningLevel)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
              title="Select learning depth"
            >
              <option value="beginner">Beginner (Simple & Basic)</option>
              <option value="intermediate">Intermediate (Standard)</option>
              <option value="advanced">Advanced (Deep Technical)</option>
            </select>
          </div>

          <button
            onClick={onNewSession}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            title="Start a new learning topic"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Topic</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 sm:p-6 space-y-6 my-auto">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="max-w-md space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                What would you like to learn today?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Enter any academic question or syllabus concept. EduGenie provides student-friendly explanations, key takeaways, and real-world examples powered by AI.
              </p>
            </div>

            {/* Suggested Academic Questions */}
            <div className="w-full max-w-xl pt-2 space-y-2.5 text-left">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Sample Questions to Get Started
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'What is Artificial Intelligence?',
                  "Explain Newton's Third Law.",
                  'What is machine learning?',
                  'Explain photosynthesis.',
                  'What is an algorithm?',
                  'Explain database management.',
                ].map((demoQ, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(demoQ)}
                    className="p-3 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded-xl transition-colors text-left cursor-pointer flex items-center justify-between group"
                  >
                    <span>“{demoQ}”</span>
                    <span className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity ml-1">→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[92%] sm:max-w-[82%] rounded-2xl p-4 sm:p-5 shadow-xs ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-50/70 border border-slate-200 rounded-bl-none text-slate-900 w-full'
                  }`}
                >
                  {isUser ? (
                    <div className="text-sm sm:text-base font-normal leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </div>
                  ) : (
                    <EducationalResponse
                      content={msg.content}
                      onSelectPrompt={handleQuickPrompt}
                    />
                  )}

                  <div
                    className={`text-[10px] mt-2 text-right ${
                      isUser ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Section 14: Loading State: EduGenie is thinking... */}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1 animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-bl-none p-4 max-w-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>EduGenie is thinking...</span>
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="h-2 bg-slate-200 rounded-full w-44 animate-pulse" />
                <div className="h-2 bg-slate-200 rounded-full w-32 animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* Section 15: Error Handling with Retry button */}
        {errorMessage && (
          <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
            <div className="space-y-2 flex-1">
              <div className="font-semibold text-sm">Action Notice</div>
              <p className="text-xs text-rose-700 leading-relaxed">{errorMessage}</p>
              {messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                <button
                  onClick={() => handleSend(messages[messages.length - 1]?.content)}
                  className="text-xs font-semibold text-rose-900 bg-rose-100 hover:bg-rose-200 px-3 py-1.5 rounded-lg transition-colors inline-block cursor-pointer"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Large Input Deck as requested in Section 3 */}
      <div className="pt-3 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative bg-white border border-slate-300 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all p-2 flex flex-col sm:flex-row items-stretch sm:items-end gap-2"
        >
          <textarea
            ref={inputRef}
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your question or learning topic..."
            rows={2}
            className="flex-1 p-2 text-sm sm:text-base text-slate-900 bg-transparent focus:outline-none resize-none placeholder:text-slate-400"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white font-semibold text-sm rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs shrink-0 cursor-pointer"
            title="Ask EduGenie"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask EduGenie</span>
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-500 px-2 pt-1.5">
          <span>EduGenie AI Interactive Learning Assistant</span>
          <span className="hidden sm:inline">Press Shift + Enter for newline</span>
        </div>
      </div>
    </div>
  );
};
