import React from 'react';
import type { KnowledgeQuestion } from '../data/sClassGameContent';
import type { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

type ProductKnowledgeCardProps = {
  question: KnowledgeQuestion;
  lang: Language;
  feedback: 'correct' | 'wrong' | null;
  hasNext: boolean;
  onAnswer: (answerId: string) => void;
  onNext: () => void;
  buttonEvents: (action: () => void) => React.ButtonHTMLAttributes<HTMLButtonElement>;
};

export const ProductKnowledgeCard: React.FC<ProductKnowledgeCardProps> = ({
  question, lang, feedback, hasNext, onAnswer, onNext, buttonEvents,
}) => {
  const t = TRANSLATIONS[lang];
  const answered = feedback === 'correct';
  return (
    <section id="knowledge-card" data-question-id={question.id} aria-labelledby="knowledge-product-title"
      className="w-full lg:w-[420px] xl:w-[460px] shrink-0 self-start rounded-xl border border-slate-700 bg-slate-900/90 p-5">
      <h2 id="knowledge-product-title" className="text-lg font-bold text-emerald-400">{t[question.titleKey]}</h2>
      <ul id="knowledge-learning-points" className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-300">
        {question.learningPointKeys.map((key) => <li key={key}>{t[key]}</li>)}
      </ul>
      <h3 id="knowledge-question" className="mt-5 font-semibold leading-relaxed">{t[question.questionKey]}</h3>
      <div role="group" aria-labelledby="knowledge-question" className="mt-4 grid gap-2">
        {question.answers.map((answer) => (
          <button key={answer.id} type="button" id={`knowledge-answer-${answer.id}`}
            {...buttonEvents(() => onAnswer(answer.id))} disabled={answered}
            className={`min-h-[3rem] rounded-lg border px-4 py-3 text-left text-sm leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:cursor-default ${answered && answer.correct ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300' : 'border-slate-600 bg-slate-800 text-slate-100 enabled:hover:border-emerald-500 enabled:hover:bg-slate-700'}`}>
            <span className="mr-2 font-bold">{answer.id.toUpperCase()}.</span>{t[answer.labelKey]}
          </button>
        ))}
      </div>
      {/* The HUD owns the live announcement; repeat it visually beside the answers. */}
      <p id="knowledge-feedback" aria-hidden="true"
        className={`mt-4 min-h-[1.5rem] text-sm font-bold ${feedback === 'wrong' ? 'text-red-400' : answered ? 'text-emerald-400' : 'text-slate-300'}`}>
        {answered ? `✓ ${t.game_correct} +${question.points}` : feedback === 'wrong' ? `✕ ${t.game_try_again}` : t.game_knowledge_hint}
      </p>
      {hasNext && (
        <button type="button" id="next-knowledge-btn" {...buttonEvents(onNext)}
          disabled={!answered} aria-hidden={!answered}
          className={`mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${!answered ? 'invisible' : ''}`}>
          {t.game_next_knowledge}
        </button>
      )}
    </section>
  );
};
