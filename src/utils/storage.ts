import { LearningSession, QuizData, SummaryData, LearningPathData, SimplifiedConceptData } from '../types';

const SESSIONS_STORAGE_KEY = 'edugenie_learning_sessions_v1';
const QUIZZES_STORAGE_KEY = 'edugenie_quizzes_v1';
const SUMMARIES_STORAGE_KEY = 'edugenie_summaries_v1';
const PATHS_STORAGE_KEY = 'edugenie_paths_v1';
const CONCEPTS_STORAGE_KEY = 'edugenie_concepts_v1';

const INITIAL_DEMO_SESSIONS: LearningSession[] = [
  {
    id: 'session-demo-ml',
    topic: 'Machine Learning',
    title: 'Machine Learning Fundamentals',
    subject: 'Computer Science',
    lastQuestion: 'What is supervised learning?',
    level: 'intermediate',
    createdAt: Date.now() - 1000 * 60 * 45,
    updatedAt: Date.now() - 1000 * 60 * 45,
    messages: [
      {
        id: 'msg-ml-1',
        role: 'user',
        content: 'Explain machine learning.',
        timestamp: Date.now() - 1000 * 60 * 50,
      },
      {
        id: 'msg-ml-2',
        role: 'assistant',
        content: `### 💡 Explanation
Machine Learning (ML) is a branch of artificial intelligence where computer systems learn from data to identify patterns, make predictions, and improve their performance without being explicitly programmed for every single rule.

### 📌 Important Points
- **Data-Driven**: Algorithms parse large amounts of training examples rather than hard-coded logic.
- **Three Core Paradigms**:
  1. *Supervised Learning*: Learning with labeled input-output pairs.
  2. *Unsupervised Learning*: Discovering hidden patterns or groupings in unlabeled data.
  3. *Reinforcement Learning*: Learning via reward and punishment feedback loops.
- **Generalization**: The ultimate goal is to perform well on new, unseen data.

### 🌍 Real-World Example
Consider an email spam filter: instead of writing billions of manual keywords, the system inspects millions of emails marked as "spam" vs "inbox", recognizes subtle combinations of words and sender patterns, and automatically blocks future junk.

### 🔑 Key Terms
- **Training Data**: The historical dataset fed into the algorithm to calibrate its mathematical weights.
- **Model**: The mathematical representation produced after training that makes predictions on new inputs.`,
        timestamp: Date.now() - 1000 * 60 * 49,
      },
      {
        id: 'msg-ml-3',
        role: 'user',
        content: 'What is supervised learning?',
        timestamp: Date.now() - 1000 * 60 * 45,
      },
      {
        id: 'msg-ml-4',
        role: 'assistant',
        content: `### 💡 Explanation
Supervised Learning is the most widely used type of machine learning, where the model learns from a dataset that contains both **inputs (questions)** and **correct labels (answers)**—much like a student studying with flashcards where the answer is written on the back.

### 📌 Important Points
- **Input and Output**: Every training sample consists of features paired with a known ground-truth outcome.
- **Two Main Tasks**:
  1. *Classification*: Predicting discrete categories (e.g., Is this photo a cat or dog? Is this tumor benign or malignant?).
  2. *Regression*: Predicting continuous numerical quantities (e.g., predicting house prices or temperature).

### 🌍 Real-World Example
Predicting house prices: the algorithm is given thousands of past houses with their square footage, number of bedrooms, location, and the actual price they sold for. Once trained, you input a new house's stats and it predicts the selling price.

### 🔑 Key Terms
- **Labels**: The target ground-truth output you want the model to predict.
- **Loss Function**: A mathematical gauge measuring the error between model predictions and actual answers.`,
        timestamp: Date.now() - 1000 * 60 * 45 + 2000,
      },
    ],
  },
  {
    id: 'session-demo-1',
    topic: 'Biology',
    title: 'Photosynthesis & Plant Energy',
    subject: 'Biology',
    lastQuestion: 'Explain it in simpler words.',
    level: 'beginner',
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
    updatedAt: Date.now() - 1000 * 60 * 60 * 3,
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Explain photosynthesis.',
        timestamp: Date.now() - 1000 * 60 * 60 * 3,
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: `### 💡 Explanation
Photosynthesis is the biological process by which green plants and algae convert sunlight into chemical energy stored in glucose (sugar). Plants act as nature's solar power plants, capturing light to manufacture their own food while releasing life-sustaining oxygen.

### 📌 Important Points
- **Chemical Equation**: 6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂
- **Site of Action**: Occurs inside chloroplasts containing chlorophyll pigment.
- **Two Stages**: Light reactions (capturing photons) and the Calvin cycle (fixing carbon into sugars).

### 🌍 Real-World Example
A leaf works like a solar-powered bakery: sunlight powers the ovens, water and carbon dioxide are the raw batter, and glucose loaves are stored for plant growth while fresh oxygen breezes outside.

### 🔑 Key Terms
- **Chlorophyll**: The green pigment absorbing sunlight.
- **Stomata**: Microscopic leaf pores regulating gas exchange.`,
        timestamp: Date.now() - 1000 * 60 * 60 * 3 + 2000,
      },
    ],
  },
];

// Demo Quizzes for instant practice
const INITIAL_DEMO_QUIZZES: QuizData[] = [
  {
    id: 'quiz-demo-ai',
    topic: 'Artificial Intelligence & Neural Networks',
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    questions: [
      {
        id: 'q1',
        question: 'Which of the following best defines Supervised Learning?',
        options: [
          'Learning without any target labels or feedback',
          'Learning by training on paired input features and known ground-truth labels',
          'Learning purely through robot physical interaction',
          'Hardcoded rule-based IF-ELSE programming',
        ],
        correctIndex: 1,
        explanation: 'Supervised learning trains models on labeled datasets containing both inputs and their correct targets.',
      },
      {
        id: 'q2',
        question: 'What is the primary role of a Loss Function in machine learning?',
        options: [
          'To format the dataset into JSON files',
          'To measure the error between model predictions and actual ground truth',
          'To encrypt user training credentials',
          'To speed up CPU clock frequency',
        ],
        correctIndex: 1,
        explanation: 'A loss function quantifies how far off model predictions are from the true answers during training.',
      },
      {
        id: 'q3',
        question: 'Why do deep neural networks have multiple hidden layers?',
        options: [
          'To make the code file longer',
          'To learn hierarchical feature representations from low-level edges to high-level abstract concepts',
          'To bypass the need for any training data',
          'To prevent the computer from overheating',
        ],
        correctIndex: 1,
        explanation: 'Deep layers allow models to automatically extract increasingly abstract and complex hierarchical features.',
      },
    ],
  },
];

// SESSIONS
export function getSavedSessions(): LearningSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_SESSIONS));
      return INITIAL_DEMO_SESSIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_DEMO_SESSIONS;
  } catch (err) {
    console.error('Failed to load learning sessions from storage:', err);
    return INITIAL_DEMO_SESSIONS;
  }
}

export function saveSessionToStorage(session: LearningSession): void {
  try {
    const existing = getSavedSessions();
    const index = existing.findIndex((s) => s.id === session.id);
    let updated: LearningSession[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = { ...session, updatedAt: Date.now() };
    } else {
      updated = [session, ...existing];
    }
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save session to storage:', err);
  }
}

export function removeSessionFromStorage(id: string): LearningSession[] {
  try {
    const existing = getSavedSessions();
    const filtered = existing.filter((s) => s.id !== id);
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (err) {
    console.error('Failed to delete session:', err);
    return [];
  }
}

export function clearAllSavedSessions(): void {
  try {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify([]));
  } catch (err) {
    console.error('Failed to clear sessions:', err);
  }
}

// QUIZZES
export function getSavedQuizzes(): QuizData[] {
  try {
    const raw = localStorage.getItem(QUIZZES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(QUIZZES_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_QUIZZES));
      return INITIAL_DEMO_QUIZZES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_DEMO_QUIZZES;
  }
}

export function saveQuizToStorage(quiz: QuizData): void {
  try {
    const list = getSavedQuizzes().filter((q) => q.id !== quiz.id);
    localStorage.setItem(QUIZZES_STORAGE_KEY, JSON.stringify([quiz, ...list]));
  } catch (e) {
    console.error(e);
  }
}

export function removeQuizFromStorage(id: string): QuizData[] {
  try {
    const filtered = getSavedQuizzes().filter((q) => q.id !== id);
    localStorage.setItem(QUIZZES_STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (e) {
    return [];
  }
}

// SUMMARIES
export function getSavedSummaries(): SummaryData[] {
  try {
    const raw = localStorage.getItem(SUMMARIES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveSummaryToStorage(summary: SummaryData): void {
  try {
    const list = getSavedSummaries().filter((s) => s.id !== summary.id);
    localStorage.setItem(SUMMARIES_STORAGE_KEY, JSON.stringify([summary, ...list]));
  } catch (e) {
    console.error(e);
  }
}

export function removeSummaryFromStorage(id: string): SummaryData[] {
  try {
    const filtered = getSavedSummaries().filter((s) => s.id !== id);
    localStorage.setItem(SUMMARIES_STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (e) {
    return [];
  }
}

// LEARNING PATHS
export function getSavedLearningPaths(): LearningPathData[] {
  try {
    const raw = localStorage.getItem(PATHS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveLearningPathToStorage(pathData: LearningPathData): void {
  try {
    const list = getSavedLearningPaths().filter((p) => p.id !== pathData.id);
    localStorage.setItem(PATHS_STORAGE_KEY, JSON.stringify([pathData, ...list]));
  } catch (e) {
    console.error(e);
  }
}

export function removeLearningPathFromStorage(id: string): LearningPathData[] {
  try {
    const filtered = getSavedLearningPaths().filter((p) => p.id !== id);
    localStorage.setItem(PATHS_STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (e) {
    return [];
  }
}

// CONCEPTS
export function getSavedConcepts(): SimplifiedConceptData[] {
  try {
    const raw = localStorage.getItem(CONCEPTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveConceptToStorage(concept: SimplifiedConceptData): void {
  try {
    const list = getSavedConcepts().filter((c) => c.id !== concept.id);
    localStorage.setItem(CONCEPTS_STORAGE_KEY, JSON.stringify([concept, ...list]));
  } catch (e) {
    console.error(e);
  }
}
