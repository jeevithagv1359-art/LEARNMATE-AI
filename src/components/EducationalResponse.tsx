import React, { useState } from 'react';
import { Copy, Check, Volume2, VolumeX, Lightbulb, BookOpen, Globe, Key } from 'lucide-react';

interface EducationalResponseProps {
  content: string;
  onSelectPrompt?: (prompt: string) => void;
}

interface ParsedSection {
  title: string;
  type: 'explanation' | 'points' | 'example' | 'terms' | 'general';
  body: string;
}

export const EducationalResponse: React.FC<EducationalResponseProps> = ({
  content,
  onSelectPrompt,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown hashes and asterisks for smooth speaking
    const cleanText = content
      .replace(/###/g, '')
      .replace(/\*\*/g, '')
      .replace(/[*_`]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Parse structured sections if present
  const parseSections = (text: string): ParsedSection[] => {
    const rawSections = text.split(/(?=###\s+)/g);

    if (rawSections.length <= 1 && !text.includes('###')) {
      return [{ title: '', type: 'general', body: text }];
    }

    const parsed: ParsedSection[] = [];

    for (const sec of rawSections) {
      const match = sec.match(/^###\s+([^\n]+)\n?([\s\S]*)$/);
      if (match) {
        const header = match[1].trim();
        const body = match[2].trim();
        const lower = header.toLowerCase();

        let type: ParsedSection['type'] = 'general';
        if (lower.includes('explanation')) type = 'explanation';
        else if (lower.includes('important point') || lower.includes('point') || lower.includes('key point')) type = 'points';
        else if (lower.includes('example') || lower.includes('real-world')) type = 'example';
        else if (lower.includes('key term') || lower.includes('term') || lower.includes('vocabulary')) type = 'terms';

        parsed.push({ title: header, type, body });
      } else if (sec.trim()) {
        parsed.push({ title: '', type: 'general', body: sec.trim() });
      }
    }

    return parsed.length > 0 ? parsed : [{ title: '', type: 'general', body: text }];
  };

  // Helper to render markdown-like text (bold, lists, backticks, equations)
  const renderFormattedText = (raw: string) => {
    const lines = raw.split('\n');
    return (
      <div className="space-y-2 text-slate-700 leading-relaxed text-sm md:text-base">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1" />;

          // Bullet item
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const bulletText = trimmed.replace(/^[-*]\s+/, '');
            return (
              <div key={idx} className="flex items-start gap-2.5 ml-1">
                <span className="text-indigo-600 font-bold mt-1.5 text-xs select-none">●</span>
                <div className="flex-1">{formatInlineSpans(bulletText)}</div>
              </div>
            );
          }

          // Numbered item
          const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-2.5 ml-1">
                <span className="text-indigo-700 font-semibold text-xs tabular-nums bg-indigo-50 px-1.5 py-0.5 rounded mt-0.5 select-none">
                  {numMatch[1]}.
                </span>
                <div className="flex-1">{formatInlineSpans(numMatch[2])}</div>
              </div>
            );
          }

          return <p key={idx}>{formatInlineSpans(trimmed)}</p>;
        })}
      </div>
    );
  };

  const formatInlineSpans = (text: string) => {
    // Basic regex parser for **bold** and `code/formula`
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 text-xs bg-slate-100 text-indigo-800 font-mono rounded border border-slate-200">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  const sections = parseSections(content);
  const isStructured = sections.some((s) => s.type !== 'general');

  return (
    <div className="space-y-4 w-full">
      {/* Action tool bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs text-slate-500">
        <span className="flex items-center gap-1.5 font-medium text-indigo-700">
          <BookOpen className="w-3.5 h-3.5" />
          EduGenie Explanation
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSpeech}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-slate-600 hover:text-indigo-700 hover:bg-slate-100 transition-colors"
            title={isSpeaking ? 'Stop speaking' : 'Listen to explanation'}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-slate-600 hover:text-indigo-700 hover:bg-slate-100 transition-colors"
            title="Copy response to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Main content body */}
      {isStructured ? (
        <div className="space-y-4">
          {sections.map((sec, idx) => {
            if (sec.type === 'explanation') {
              return (
                <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 md:p-5">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2.5 tracking-tight">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    {sec.title || 'Explanation'}
                  </h4>
                  {renderFormattedText(sec.body)}
                </div>
              );
            }

            if (sec.type === 'points') {
              return (
                <div key={idx} className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-4 md:p-5">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-indigo-950 mb-2.5 tracking-tight">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    {sec.title || 'Important Points'}
                  </h4>
                  {renderFormattedText(sec.body)}
                </div>
              );
            }

            if (sec.type === 'example') {
              return (
                <div key={idx} className="bg-amber-50/50 border border-amber-200/70 rounded-xl p-4 md:p-5">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-amber-900 mb-2.5 tracking-tight">
                    <Globe className="w-4 h-4 text-amber-600" />
                    {sec.title || 'Real-World Example'}
                  </h4>
                  {renderFormattedText(sec.body)}
                </div>
              );
            }

            if (sec.type === 'terms') {
              return (
                <div key={idx} className="bg-emerald-50/40 border border-emerald-200/70 rounded-xl p-4 md:p-5">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-950 mb-2.5 tracking-tight">
                    <Key className="w-4 h-4 text-emerald-600" />
                    {sec.title || 'Key Terms'}
                  </h4>
                  {renderFormattedText(sec.body)}
                </div>
              );
            }

            return (
              <div key={idx} className="py-1">
                {sec.title && <h4 className="text-sm font-semibold text-slate-900 mb-2">{sec.title}</h4>}
                {renderFormattedText(sec.body)}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-1">
          {renderFormattedText(content)}
        </div>
      )}

      {/* Quick Learning Actions as requested in Section 8 & 13 */}
      {onSelectPrompt && (
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Quick Learning Actions
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onSelectPrompt('Explain it in simpler words.')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-900 border border-indigo-200/80 rounded-lg transition-colors cursor-pointer"
            >
              <span>Explain Simpler</span>
            </button>

            <button
              onClick={() => onSelectPrompt('Give me another clear real-world example.')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-900 border border-emerald-200/80 rounded-lg transition-colors cursor-pointer"
            >
              <span>Give Example</span>
            </button>

            <button
              onClick={() => onSelectPrompt('Summarize the essential key points.')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 hover:text-amber-900 border border-amber-200/80 rounded-lg transition-colors cursor-pointer"
            >
              <span>Key Points</span>
            </button>

            <button
              onClick={() => onSelectPrompt('Explain this concept step-by-step.')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 hover:text-sky-900 border border-sky-200/80 rounded-lg transition-colors cursor-pointer"
            >
              <span>Explain Step-by-Step</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
