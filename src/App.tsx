/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AiAssistant } from './components/AiAssistant';
import { ConceptSimplifier } from './components/ConceptSimplifier';
import { QuizGenerator } from './components/QuizGenerator';
import { SmartSummarizer } from './components/SmartSummarizer';
import { LearningPathPlanner } from './components/LearningPathPlanner';
import { MyLearning } from './components/MyLearning';
import { AboutPage } from './components/AboutPage';
import { Footer } from './components/Footer';
import {
  LearningSession,
  LearningLevel,
  Subject,
  ChatMessage,
  QuizData,
  SummaryData,
  LearningPathData,
  SimplifiedConceptData,
  NavigationTab,
} from './types';
import {
  getSavedSessions,
  saveSessionToStorage,
  removeSessionFromStorage,
  clearAllSavedSessions,
  getSavedQuizzes,
  saveQuizToStorage,
  removeQuizFromStorage,
  getSavedSummaries,
  saveSummaryToStorage,
  removeSummaryFromStorage,
  getSavedLearningPaths,
  saveLearningPathToStorage,
  removeLearningPathFromStorage,
  getSavedConcepts,
  saveConceptToStorage,
} from './utils/storage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [sessions, setSessions] = useState<LearningSession[]>([]);
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [summaries, setSummaries] = useState<SummaryData[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPathData[]>([]);
  const [concepts, setConcepts] = useState<SimplifiedConceptData[]>([]);
  const [currentSession, setCurrentSession] = useState<LearningSession | null>(null);

  // Load saved artifacts from local storage on mount
  useEffect(() => {
    setSessions(getSavedSessions());
    setQuizzes(getSavedQuizzes());
    setSummaries(getSavedSummaries());
    setLearningPaths(getSavedLearningPaths());
    setConcepts(getSavedConcepts());
  }, []);

  // Update or add a session to state & storage
  const handleUpdateSession = (updated: LearningSession) => {
    setCurrentSession(updated);
    saveSessionToStorage(updated);
    setSessions(getSavedSessions());
  };

  // Start asking a new question directly from Landing Page / Explorer
  const handleAskQuestion = async (
    question: string,
    level: LearningLevel = 'intermediate',
    subject: Subject = 'General'
  ) => {
    const trimmed = question.trim();
    if (!trimmed) return;

    // Create new session
    const title = trimmed.length > 40 ? `${trimmed.slice(0, 38)}...` : trimmed;
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
      level,
      subject,
    };

    const newSession: LearningSession = {
      id: `session-${Date.now()}`,
      topic: subject !== 'General' ? subject : 'Academic Topic',
      title,
      lastQuestion: trimmed,
      subject,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      level,
      messages: [userMsg],
    };

    // Save and switch to AI assistant immediately
    handleUpdateSession(newSession);
    setCurrentTab('assistant');

    // Make the initial call to API
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: trimmed }],
          topic: newSession.topic,
          subject,
          learningLevel: level,
        }),
      });

      if (!response.ok) {
        throw new Error("Sorry, EduGenie couldn't generate a response right now. Please try again.");
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'No response returned from assistant.',
        timestamp: Date.now(),
        level,
        subject,
      };

      const completedSession: LearningSession = {
        ...newSession,
        lastQuestion: trimmed,
        updatedAt: Date.now(),
        messages: [userMsg, assistantMsg],
      };

      handleUpdateSession(completedSession);
    } catch (err: any) {
      console.error('Initial question request error:', err);
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content: `Sorry, EduGenie couldn't generate a response right now. Please try again.`,
        timestamp: Date.now(),
        level,
        subject,
      };
      handleUpdateSession({
        ...newSession,
        lastQuestion: trimmed,
        updatedAt: Date.now(),
        messages: [userMsg, errorMsg],
      });
    }
  };

  // Open an existing session in the AI assistant
  const handleOpenSession = (session: LearningSession) => {
    setCurrentSession(session);
    setCurrentTab('assistant');
  };

  // Start fresh blank session
  const handleNewSession = () => {
    setCurrentSession(null);
    setCurrentTab('assistant');
  };

  // Delete a specific session
  const handleDeleteSession = (id: string) => {
    const updated = removeSessionFromStorage(id);
    setSessions(updated);
    if (currentSession?.id === id) {
      setCurrentSession(null);
    }
  };

  // Delete quiz
  const handleDeleteQuiz = (id: string) => {
    const updated = removeQuizFromStorage(id);
    setQuizzes(updated);
  };

  // Delete summary
  const handleDeleteSummary = (id: string) => {
    const updated = removeSummaryFromStorage(id);
    setSummaries(updated);
  };

  // Delete path
  const handleDeletePath = (id: string) => {
    const updated = removeLearningPathFromStorage(id);
    setLearningPaths(updated);
  };

  // Clear all sessions and data
  const handleClearAll = () => {
    clearAllSavedSessions();
    setSessions([]);
    setCurrentSession(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Top Bar Navigation */}
      <Navbar currentTab={currentTab} onNavigate={setCurrentTab} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <LandingPage
            onStartLearning={() => setCurrentTab('assistant')}
            onAskQuestion={handleAskQuestion}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'assistant' && (
          <AiAssistant
            currentSession={currentSession}
            onUpdateSession={handleUpdateSession}
            onNewSession={handleNewSession}
            onBackToHome={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'explain' && (
          <ConceptSimplifier
            onSaveConcept={(concept) => {
              saveConceptToStorage(concept);
              setConcepts(getSavedConcepts());
            }}
            onExploreInChat={(conceptQuestion) => {
              handleAskQuestion(conceptQuestion);
            }}
          />
        )}

        {currentTab === 'quiz' && (
          <QuizGenerator
            onSaveQuiz={(quiz) => {
              saveQuizToStorage(quiz);
              setQuizzes(getSavedQuizzes());
            }}
            onNavigateToTopic={(topic) => {
              handleAskQuestion(`Tell me about ${topic}`);
            }}
          />
        )}

        {currentTab === 'summarize' && (
          <SmartSummarizer
            onSaveSummary={(summary) => {
              saveSummaryToStorage(summary);
              setSummaries(getSavedSummaries());
            }}
          />
        )}

        {currentTab === 'path' && (
          <LearningPathPlanner
            onSavePath={(path) => {
              saveLearningPathToStorage(path);
              setLearningPaths(getSavedLearningPaths());
            }}
            onExploreInChat={(topic) => {
              handleAskQuestion(topic);
            }}
          />
        )}

        {currentTab === 'history' && (
          <MyLearning
            sessions={sessions}
            quizzes={quizzes}
            summaries={summaries}
            learningPaths={learningPaths}
            concepts={concepts}
            onSelectSession={handleOpenSession}
            onDeleteSession={handleDeleteSession}
            onDeleteQuiz={handleDeleteQuiz}
            onDeleteSummary={handleDeleteSummary}
            onDeletePath={handleDeletePath}
            onClearAll={handleClearAll}
            onStartNew={handleNewSession}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'about' && (
          <AboutPage
            onStartLearning={() => setCurrentTab('assistant')}
            onNavigateTab={setCurrentTab}
          />
        )}
      </main>

      {/* Persistent Footer (Hidden on active assistant view to give maximum chat workspace) */}
      {currentTab !== 'assistant' && <Footer onNavigate={setCurrentTab} />}
    </div>
  );
}
