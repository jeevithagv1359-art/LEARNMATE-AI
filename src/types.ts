export type LearningLevel = 'beginner' | 'intermediate' | 'advanced';

export type Subject =
  | 'General'
  | 'Mathematics'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'Computer Science'
  | 'English';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  topic?: string;
  level?: LearningLevel;
  subject?: Subject;
  modelUsed?: string;
}

export interface LearningSession {
  id: string;
  topic: string;
  title: string;
  lastQuestion?: string;
  subject?: Subject;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  level?: LearningLevel;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[]; // exactly 4 options
  correctIndex: number; // 0, 1, 2, or 3
  explanation: string;
}

export interface QuizData {
  id: string;
  topic: string;
  passage?: string;
  questions: QuizQuestion[]; // 3 MCQs
  createdAt: number;
}

export interface SummaryData {
  id: string;
  title: string;
  originalText: string;
  summary: string;
  keyPoints: string[];
  originalWordCount: number;
  summaryWordCount: number;
  compressionRatio: number;
  createdAt: number;
}

export interface LearningPathMilestone {
  stage: 'Beginner' | 'Intermediate' | 'Advanced';
  durationWeeks: string;
  coreConcepts: string[];
  description: string;
  practicalProjects: string[];
  recommendedResources: Array<{
    name: string;
    type: 'Documentation' | 'Book' | 'Course' | 'Hands-on Practice';
    description?: string;
  }>;
}

export interface LearningPathData {
  id: string;
  topic: string;
  overview: string;
  totalDuration: string;
  targetAudience: string;
  milestones: LearningPathMilestone[];
  createdAt: number;
}

export interface SimplifiedConceptData {
  id: string;
  concept: string;
  explanation: string;
  simpleAnalogy: string;
  keyTakeaways: string[];
  modelUsed: 'LaMini-Flan-T5 (Lightweight)' | 'Gemini 3.8 Flash (Cloud)';
  createdAt: number;
}

export type NavigationTab =
  | 'home'
  | 'assistant'
  | 'explain'
  | 'quiz'
  | 'summarize'
  | 'path'
  | 'history'
  | 'about';
