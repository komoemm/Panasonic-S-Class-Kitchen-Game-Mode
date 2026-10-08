import React from 'react';
import type { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

export type TrainingCategory = { id: string; label: string; points: number; maximum: number; items: readonly string[] };
type Props = { lang: Language; score: number; categories: readonly TrainingCategory[]; review: boolean; onToggleReview: () => void; onReturn: () => void; buttonEvents: (action: () => void) => React.ButtonHTMLAttributes<HTMLButtonElement> };

export function TrainingResults({ lang, score, categories, review, onToggleReview, onReturn, buttonEvents }: Props) {
  const t = TRANSLATIONS[lang];
  const maximum = categories.reduce((sum, category) => sum + category.maximum, 0);
  const completion = Math.round(score / maximum * 100);
  return (
    <section id={review ? 'training-review' : 'training-results'} aria-labelledby="training-result-title"
      className="w-full lg:w-[420px] xl:w-[460px] shrink-0 self-start rounded-xl border border-emerald-700/60 bg-slate-900/90 p-5">
      <h2 id="training-result-title" className="text-lg font-bold text-emerald-400">{review ? t.game_review : t.game_result}</h2>
      {review ? (
        <div className="mt-5 space-y-5">
          {categories.map((category) => (
            <section key={category.id}>
              <h3 className="font-semibold">{category.label}</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-300">
                {category.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <>
          <dl className="mt-5 space-y-3 text-sm">
            {categories.map((category) => (
              <div key={category.id} className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                <dt>{category.label}</dt>
                <dd id={`result-${category.id}`} className="shrink-0 font-bold tabular-nums text-emerald-300">{category.points} / {category.maximum}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-3 pt-2 text-base font-bold">
              <dt>{t.game_total}</dt><dd id="result-total" className="tabular-nums">{score} / {maximum}</dd>
            </div>
            <div className="flex justify-between gap-3"><dt>{t.game_completion}</dt><dd id="result-completion">{completion}%</dd></div>
          </dl>
          <p className="mt-5 rounded-lg border border-emerald-700 bg-emerald-950/40 p-3 text-sm font-bold text-emerald-300">✓ {t.game_complete}</p>
        </>
      )}
      <button type="button" id={review ? 'back-results-btn' : 'review-training-btn'} {...buttonEvents(onToggleReview)}
        className="mt-5 min-h-[3rem] w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
        {review ? t.game_back_results : t.game_review}
      </button>
      <button type="button" id="results-return-explore-btn" {...buttonEvents(onReturn)}
        className="mt-3 min-h-[3rem] w-full rounded-lg border border-slate-600 px-4 py-3 text-sm font-bold hover:border-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
        {t.game_return}
      </button>
    </section>
  );
}
