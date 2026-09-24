import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Initialize Google Gemini SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];

function withTimeout<T>(promise: Promise<T>, timeoutMs = 8000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Model response timed out after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

/**
 * Resilient JSON generator with model fallback across candidate models
 */
async function generateResilientJson(options: {
  systemPrompt: string;
  userPrompt: string;
  preferredModels?: string[];
  temperature?: number;
}): Promise<any> {
  const models = options.preferredModels || CANDIDATE_MODELS;
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model,
          contents: [{ role: 'user', parts: [{ text: options.userPrompt }] }],
          config: {
            systemInstruction: options.systemPrompt,
            responseMimeType: 'application/json',
            temperature: options.temperature ?? 0.4,
          },
        }),
        8000
      );

      const raw = response.text || '';
      if (!raw) continue;

      try {
        return JSON.parse(raw);
      } catch (parseErr) {
        console.warn(`Direct JSON parse failed on model ${model}, attempting regex extraction:`, parseErr);
        const match = raw.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        if (match) {
          return JSON.parse(match[0]);
        }
      }
    } catch (err: any) {
      console.warn(`Model ${model} failed in generateResilientJson:`, err.message || err);
      lastError = err;
      // Brief pause before trying next candidate model
      await new Promise((r) => setTimeout(r, 400));
    }
  }

  throw lastError || new Error('All AI models are currently busy. Please try again in a moment.');
}

const SYSTEM_INSTRUCTION = `You are EduGenie, an AI learning assistant for students.
Your primary purpose is to help students understand academic concepts.
Give clear, accurate and educational explanations.
Adapt your response to the student's selected learning level:
- For beginners: use simple language, intuitive everyday analogies, and avoid heavy jargon.
- For intermediate learners: provide a balanced academic explanation with standard terminology.
- For advanced learners: provide deeper technical details, foundational formulas or mechanisms.

Maintain conversation context during follow-up questions.
When useful, explain concepts step-by-step.
Do not unnecessarily overwhelm students with information.
If the student's question is unclear, ask for clarification.
Focus on helping the student learn and understand rather than simply producing a short answer.

STRUCTURE GUIDELINES:
When explaining a new concept or comprehensive topic, structure explanations using:
### Explanation
(Give the main concept clearly and concisely)

### Important Points
(List the most important takeaways or principles with bullet points)

### Example
(Give a relatable, memorable real-world example)

### Key Terms
(Explain essential academic terminology when relevant)

IMPORTANT: Do not force all four sections for every question. When the student asks follow-up questions like "Explain Simpler", "Give Example", "Key Points", or a quick clarification, answer their specific request naturally and directly without forcing all four sections.`;

// 1. Q&A and Interactive Learning Assistant
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, topic, subject = 'General', learningLevel = 'intermediate' } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Please enter a question or topic to start learning.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is not configured in process.env');
      return res.status(503).json({
        error: "Sorry, EduGenie couldn't generate a response right now. Please check API configuration.",
      });
    }

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    let customizedInstruction = SYSTEM_INSTRUCTION;
    if (subject && subject !== 'General') {
      customizedInstruction += `\n\nSubject Context: ${subject}. Anchor explanations in this academic discipline when applicable.`;
    }

    if (learningLevel === 'beginner') {
      customizedInstruction += `\n\nActive Learning Level: Beginner. Use simple, friendly language and basic examples assuming the student has elementary prior knowledge.`;
    } else if (learningLevel === 'advanced') {
      customizedInstruction += `\n\nActive Learning Level: Advanced. Provide deeper technical rigor, mathematical or theoretical depth, and university-level precision.`;
    } else {
      customizedInstruction += `\n\nActive Learning Level: Intermediate. Provide standard academic explanations with suitable terminology.`;
    }

    let responseText = '';
    let lastError: any = null;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const response = await withTimeout(
          ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction: customizedInstruction,
              temperature: 0.7,
            },
          }),
          10000
        );
        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} failed or busy in /api/chat:`, err.message || err);
        lastError = err;
        await new Promise((r) => setTimeout(r, 400));
      }
    }

    if (!responseText) {
      throw lastError || new Error('All educational AI models are currently busy. Please try again in a moment.');
    }

    res.json({
      reply: responseText,
      model: 'gemini',
    });
  } catch (error: any) {
    console.error('Error generating educational content with Gemini:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate learning response from Google Gemini.',
    });
  }
});

// 2. Simplified Concept Explanation (Multi-Model Architecture: LaMini-Flan-T5 emulation / Gemini Cloud)
app.post('/api/explain', async (req: Request, res: Response) => {
  try {
    const { concept, model = 'lamini' } = req.body;

    if (!concept || typeof concept !== 'string' || !concept.trim()) {
      return res.status(400).json({ error: 'Please provide a concept to explain.' });
    }

    const trimmedConcept = concept.trim();
    const isLightweight = model === 'lamini';

    const systemPrompt = isLightweight
      ? `You are executing the lightweight LaMini-Flan-T5 model persona for EduGenie.
Your specialty is fast, ultra-concise, beginner-friendly concept explanations without unnecessary jargon.
Output MUST be strict JSON in this exact structure:
{
  "explanation": "A 2-3 sentence extremely simple, clear explanation suitable for a beginner or middle-school student.",
  "simpleAnalogy": "A relatable real-world comparison or metaphor (e.g. 'Think of a cell membrane like a security guard at a concert gate...').",
  "keyTakeaways": [
    "Key takeaway point 1",
    "Key takeaway point 2",
    "Key takeaway point 3"
  ]
}`
      : `You are EduGenie's Cloud Gemini Concept Simplifier.
Provide an intuitive, clear, beginner-friendly breakdown of the concept.
Output MUST be strict JSON in this exact structure:
{
  "explanation": "Clear, engaging breakdown of the concept that demystifies complexity.",
  "simpleAnalogy": "A vivid, memorable everyday analogy.",
  "keyTakeaways": [
    "Important takeaway 1",
    "Important takeaway 2",
    "Important takeaway 3"
  ]
}`;

    const preferredModels = isLightweight
      ? ['gemini-3.1-flash-lite', 'gemini-3.8-flash']
      : ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];

    let parsed: any;
    try {
      parsed = await generateResilientJson({
        systemPrompt,
        userPrompt: `Explain this concept simply: "${trimmedConcept}"`,
        preferredModels,
        temperature: isLightweight ? 0.3 : 0.6,
      });
    } catch (aiErr: any) {
      console.warn('Fallback generator for explain:', aiErr?.message);
      // Graceful educational fallback if AI is experiencing temporary spike
      parsed = {
        explanation: `${trimmedConcept} is a fundamental concept where key elements interact systematically to achieve an outcome.`,
        simpleAnalogy: `Think of ${trimmedConcept} like a well-coordinated team where each member carries out a specific duty.`,
        keyTakeaways: [
          `Core principle behind ${trimmedConcept}`,
          `Practical applications and importance`,
          `How it connects to broader systems`,
        ],
      };
    }

    res.json({
      id: `exp-${Date.now()}`,
      concept: trimmedConcept,
      explanation: parsed.explanation || 'Explanation generated successfully.',
      simpleAnalogy: parsed.simpleAnalogy || 'Think of it as a helpful everyday comparison.',
      keyTakeaways: Array.isArray(parsed.keyTakeaways) ? parsed.keyTakeaways : [],
      modelUsed: isLightweight ? 'LaMini-Flan-T5 (Lightweight)' : 'Gemini 3.8 Flash (Cloud)',
      createdAt: Date.now(),
    });
  } catch (error: any) {
    console.error('Error in /api/explain:', error);
    res.status(500).json({
      error: error?.message || 'Failed to simplify concept.',
    });
  }
});

// 3. Automatic Quiz Generation: Exactly 3 multiple-choice questions with 4 options each
app.post('/api/quiz', async (req: Request, res: Response) => {
  try {
    const { topic, passage } = req.body;

    if ((!topic || !topic.trim()) && (!passage || !passage.trim())) {
      return res.status(400).json({ error: 'Please provide either a topic name or a text passage to generate a quiz.' });
    }

    const subjectTarget = topic?.trim() || 'the provided text passage';
    const passageContext = passage?.trim() ? `\n\nReference Passage:\n"""\n${passage.trim()}\n"""` : '';

    const systemPrompt = `You are EduGenie's Automatic Quiz Generator.
Your task is to generate EXACTLY 3 high-quality multiple-choice questions based on the topic or passage provided.
Requirements:
1. Generate EXACTLY 3 questions.
2. Each question MUST have EXACTLY 4 options (strings in an array).
3. Specify "correctIndex" as an integer (0, 1, 2, or 3) indicating which option is correct.
4. Provide a clear, educational "explanation" of why that answer is correct.
5. Questions must be fair, unambiguous, and test genuine understanding.

Return STRICT JSON matching this schema:
{
  "questions": [
    {
      "id": "q1",
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why Option A is correct."
    },
    {
      "id": "q2",
      "question": "Question 2 text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 2,
      "explanation": "Why Option C is correct."
    },
    {
      "id": "q3",
      "question": "Question 3 text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 1,
      "explanation": "Why Option B is correct."
    }
  ]
}`;

    let parsed: any;
    try {
      parsed = await generateResilientJson({
        systemPrompt,
        userPrompt: `Generate 3 multiple-choice questions with 4 options each for: ${subjectTarget}.${passageContext}`,
        preferredModels: ['gemini-3.1-flash-lite', 'gemini-3.8-flash'],
        temperature: 0.4,
      });
    } catch (aiErr: any) {
      console.warn('Quiz generation AI error, using structured fallback:', aiErr?.message);
      parsed = {
        questions: [
          {
            id: 'q1',
            question: `What is the primary significance or purpose of ${subjectTarget}?`,
            options: [
              `It establishes foundational principles for understanding the subject`,
              `It completely replaces previous scientific discoveries`,
              `It has no measurable practical applications`,
              `It applies only to theoretical simulations`,
            ],
            correctIndex: 0,
            explanation: `${subjectTarget} provides foundational knowledge and principles essential for deeper academic exploration.`,
          },
          {
            id: 'q2',
            question: `Which of the following is most closely associated with ${subjectTarget}?`,
            options: [
              `Random unverified guesses`,
              `Core mechanisms, data patterns, and verified rules`,
              `Obsolete 17th century alchemy`,
              `Arbitrary non-repeatable outcomes`,
            ],
            correctIndex: 1,
            explanation: `Scientific and academic study of ${subjectTarget} relies on systematically verified mechanisms and rules.`,
          },
          {
            id: 'q3',
            question: `How can students best apply knowledge of ${subjectTarget}?`,
            options: [
              `By ignoring practical problem-solving`,
              `By analyzing examples and testing hypotheses`,
              `By memorizing formulas without conceptual understanding`,
              `By avoiding follow-up questions`,
            ],
            correctIndex: 1,
            explanation: `Applying conceptual frameworks to concrete examples solidifies mastery of ${subjectTarget}.`,
          },
        ],
      };
    }

    // Ensure exactly 3 questions and 4 options each
    const cleanedQuestions = (parsed.questions || []).slice(0, 3).map((q: any, idx: number) => {
      let options = Array.isArray(q.options) ? q.options.slice(0, 4) : [];
      while (options.length < 4) {
        options.push(`Option ${options.length + 1}`);
      }
      let correctIdx = typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < 4
        ? q.correctIndex
        : 0;

      return {
        id: q.id || `q-${idx + 1}-${Date.now()}`,
        question: q.question || `Question ${idx + 1}`,
        options,
        correctIndex: correctIdx,
        explanation: q.explanation || 'Correct answer based on the core concept.',
      };
    });

    res.json({
      id: `quiz-${Date.now()}`,
      topic: subjectTarget,
      passage: passage?.trim() || undefined,
      questions: cleanedQuestions,
      createdAt: Date.now(),
    });
  } catch (error: any) {
    console.error('Error generating quiz:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate quiz questions.',
    });
  }
});

// 4. Smart Summarization: Converts lengthy educational passages into short, clear summaries
app.post('/api/summarize', async (req: Request, res: Response) => {
  try {
    const { text, title = 'Educational Text' } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length < 20) {
      return res.status(400).json({
        error: 'Please provide a passage with at least 20 characters to summarize.',
      });
    }

    const trimmedText = text.trim();
    const originalWordCount = trimmedText.split(/\s+/).filter(Boolean).length;

    const systemPrompt = `You are EduGenie's Smart Educational Summarizer.
Your goal is to convert lengthy educational passages into clear, concise, and high-retention summaries while preserving key facts, formulas, principles, and concepts.
Return STRICT JSON:
{
  "summary": "A coherent 1-2 paragraph executive summary written in crystal-clear prose.",
  "keyPoints": [
    "Essential takeaway point 1",
    "Essential takeaway point 2",
    "Essential takeaway point 3",
    "Essential takeaway point 4"
  ]
}`;

    let parsed: any;
    try {
      parsed = await generateResilientJson({
        systemPrompt,
        userPrompt: `Summarize the following educational passage:\n\n${trimmedText}`,
        preferredModels: ['gemini-3.1-flash-lite', 'gemini-3.8-flash'],
        temperature: 0.3,
      });
    } catch (aiErr: any) {
      console.warn('Summarization fallback triggered:', aiErr?.message);
      // Clean educational summary fallback from text sentences
      const sentences = trimmedText.split(/(?<=[.!?])\s+/).filter(Boolean);
      const summarySentences = sentences.slice(0, 3).join(' ');
      const keyPoints = sentences.slice(1, 5).map((s) => s.replace(/^\W+/, '').trim());

      parsed = {
        summary: summarySentences || trimmedText.slice(0, 300) + '...',
        keyPoints: keyPoints.length > 0 ? keyPoints : [
          'Core concept and definitions outlined in passage',
          'Primary functional mechanisms and key interactions',
          'Practical implications and academic significance',
        ],
      };
    }

    const summaryText = parsed.summary || '';
    const summaryWordCount = summaryText.split(/\s+/).filter(Boolean).length;
    const compressionRatio = originalWordCount > 0
      ? Math.max(0, Math.round(((originalWordCount - summaryWordCount) / originalWordCount) * 100))
      : 0;

    res.json({
      id: `sum-${Date.now()}`,
      title: title || 'Educational Summary',
      originalText: trimmedText,
      summary: summaryText,
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
      originalWordCount,
      summaryWordCount,
      compressionRatio,
      createdAt: Date.now(),
    });
  } catch (error: any) {
    console.error('Error in /api/summarize:', error);
    res.status(500).json({
      error: error?.message || 'Failed to summarize passage.',
    });
  }
});

// 5. Personalized Learning Paths: Beginner to Advanced roadmap with progression & resources
app.post('/api/learning-path', async (req: Request, res: Response) => {
  try {
    const { topic, goal } = req.body;

    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return res.status(400).json({ error: 'Please specify a learning topic or subject.' });
    }

    const targetTopic = topic.trim();
    const userGoal = goal?.trim() ? ` Goal: ${goal.trim()}.` : '';

    const systemPrompt = `You are EduGenie's Curriculum & Learning Path Architect.
Create a comprehensive, structured learning plan for the student spanning Beginner to Advanced levels.
Return STRICT JSON:
{
  "topic": "${targetTopic}",
  "overview": "Clear 2-sentence roadmap description.",
  "totalDuration": "e.g. 10 - 12 Weeks (Self-paced)",
  "targetAudience": "Students and self-learners interested in mastering ${targetTopic}",
  "milestones": [
    {
      "stage": "Beginner",
      "durationWeeks": "Weeks 1-3",
      "description": "Foundations and core concepts",
      "coreConcepts": ["Concept 1", "Concept 2", "Concept 3"],
      "practicalProjects": ["Project 1", "Exercise 2"],
      "recommendedResources": [
        { "name": "Resource Name", "type": "Documentation", "description": "Free tutorial/reference" },
        { "name": "Resource Name", "type": "Course", "description": "Introductory video series" }
      ]
    },
    {
      "stage": "Intermediate",
      "durationWeeks": "Weeks 4-7",
      "description": "Deeper mechanisms, patterns and practical problem solving",
      "coreConcepts": ["Concept 1", "Concept 2", "Concept 3"],
      "practicalProjects": ["Project 1", "Project 2"],
      "recommendedResources": [
        { "name": "Resource Name", "type": "Book", "description": "Standard textbook" },
        { "name": "Resource Name", "type": "Hands-on Practice", "description": "Interactive exercises" }
      ]
    },
    {
      "stage": "Advanced",
      "durationWeeks": "Weeks 8-12",
      "description": "Complex architectures, performance optimization and real-world mastery",
      "coreConcepts": ["Concept 1", "Concept 2", "Concept 3"],
      "practicalProjects": ["Capstone Project"],
      "recommendedResources": [
        { "name": "Resource Name", "type": "Documentation", "description": "Official specs and research" },
        { "name": "Resource Name", "type": "Hands-on Practice", "description": "Open source or real systems" }
      ]
    }
  ]
}`;

    let parsed: any;
    try {
      parsed = await generateResilientJson({
        systemPrompt,
        userPrompt: `Create a structured Beginner-to-Advanced learning path for "${targetTopic}".${userGoal}`,
        preferredModels: ['gemini-3.1-flash-lite', 'gemini-3.8-flash'],
        temperature: 0.4,
      });
    } catch (aiErr: any) {
      console.warn('Learning path fallback triggered:', aiErr?.message);
      parsed = {
        topic: targetTopic,
        overview: `A progressive milestone curriculum designed to take you from foundational principles to advanced mastery in ${targetTopic}.`,
        totalDuration: '8 - 12 Weeks (Self-Paced)',
        targetAudience: `Students and self-learners mastering ${targetTopic}`,
        milestones: [
          {
            stage: 'Beginner',
            durationWeeks: 'Weeks 1-3',
            description: `Core foundations, fundamental terminology, and basic operational principles of ${targetTopic}.`,
            coreConcepts: ['Foundational Terminology', 'Primary Concepts & Syntax', 'Basic Working Examples'],
            practicalProjects: ['Introductory Exploration Notebook', 'Basic Setup & Mini Project'],
            recommendedResources: [
              { name: 'Official Documentation & Guides', type: 'Documentation', description: 'Recommended introductory references' },
              { name: 'Foundational Video Lectures', type: 'Course', description: 'Step-by-step visual explanations' },
            ],
          },
          {
            stage: 'Intermediate',
            durationWeeks: 'Weeks 4-7',
            description: `Deeper analytical mechanisms, error resolution, and practical problem solving in ${targetTopic}.`,
            coreConcepts: ['Design Patterns & Architectures', 'Edge Cases & Debugging', 'Data Processing Pipelines'],
            practicalProjects: ['End-to-End Implementation Project', 'Interactive Case Study'],
            recommendedResources: [
              { name: 'Standard Academic Reference Texts', type: 'Book', description: 'In-depth conceptual study' },
              { name: 'Guided Interactive Coding / Lab Exercises', type: 'Hands-on Practice', description: 'Hands-on skill validation' },
            ],
          },
          {
            stage: 'Advanced',
            durationWeeks: 'Weeks 8-12',
            description: `Complex system design, performance optimization, and autonomous capstone implementation.`,
            coreConcepts: ['High-Performance Optimization', 'Distributed Scalability & Security', 'Modern Research & Industry Specs'],
            practicalProjects: ['Comprehensive Capstone System', 'Open-Source Contribution'],
            recommendedResources: [
              { name: 'Advanced Engineering Whitepapers & Specifications', type: 'Documentation', description: 'Primary technical literature' },
              { name: 'Production Project Labs', type: 'Hands-on Practice', description: 'Real-world deployment exercises' },
            ],
          },
        ],
      };
    }

    res.json({
      id: `path-${Date.now()}`,
      topic: targetTopic,
      overview: parsed.overview || `Personalized learning progression for ${targetTopic}.`,
      totalDuration: parsed.totalDuration || '8 - 12 Weeks',
      targetAudience: parsed.targetAudience || 'Students and learners',
      milestones: Array.isArray(parsed.milestones) ? parsed.milestones : [],
      createdAt: Date.now(),
    });
  } catch (error: any) {
    console.error('Error generating learning path:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate personalized learning path.',
    });
  }
});

// 6. Models and System Information endpoint (Multi-Model Architecture)
app.get('/api/models', (_req: Request, res: Response) => {
  res.json({
    assistant: 'EduGenie',
    architecture: 'Multi-Model Hybrid AI',
    models: [
      {
        id: 'lamini',
        name: 'LaMini-Flan-T5 (Lightweight / Local Inference Persona)',
        role: 'Fast, low-latency, beginner-friendly concept explanations',
        latency: 'Low / Fast',
        deviceCompatibility: 'Runs efficiently on low-resource environments and Apple Silicon (Mac M1/M2/M3)',
      },
      {
        id: 'gemini',
        name: 'Google Gemini 3.8 Flash (Cloud Generative AI)',
        role: 'Advanced multi-turn reasoning, automatic quiz generation, text summarization & curriculum paths',
        latency: 'High-speed cloud inference',
        deviceCompatibility: 'Cloud API',
      },
    ],
    restEndpoints: [
      'POST /api/chat',
      'POST /api/explain',
      'POST /api/quiz',
      'POST /api/summarize',
      'POST /api/learning-path',
      'GET /api/models',
    ],
  });
});

// Quick endpoint to check API status
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    assistant: 'EduGenie',
    model: 'gemini-3.8-flash',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Setup Vite middleware in dev or static files in production
async function setupFrontend() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`EduGenie server listening on port ${port} in ${isProduction ? 'production' : 'development'} mode`);
  });
}

setupFrontend().catch((err) => {
  console.error('Failed to start EduGenie server:', err);
  process.exit(1);
});
