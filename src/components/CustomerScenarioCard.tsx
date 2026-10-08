import React from 'react';
import type { LayoutScenario } from '../data/sClassLayoutScenarios';
import type { Language, PlanLayoutId } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

type CustomerScenarioCardProps = {
  scenario: LayoutScenario;
  lang: Language;
  feedback: 'correct' | 'wrong' | null;
  previewed: boolean;
  hasNext: boolean;
  onAnswer: (layoutId: PlanLayoutId) => void;
  onPreview: () => void;
  onNext: () => void;
  buttonEvents: (action: () => void) => React.ButtonHTMLAttributes<HTMLButtonElement>;
};

export const CustomerScenarioCard: React.FC<CustomerScenarioCardProps> = ({
  scenario, lang, feedback, previewed, hasNext, onAnswer, onPreview, onNext, buttonEvents,
}) => {
  const t = TRANSLATIONS[lang];
  const answered = feedback === 'correct';
  return (
    <section id="scenario-card" data-scenario-id={scenario.id} aria-labelledby="scenario-requirements-title"
      className="w-full lg:w-[420px] xl:w-[460px] shrink-0 self-start rounded-xl border border-slate-700 bg-slate-900/90 p-5">
      <h2 id="scenario-requirements-title" className="text-lg font-bold text-emerald-400">{t.game_customer_requirements}</h2>
      <ul id="scenario-requirements" className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-300">
        {scenario.requirementKeys.map((key) => <li key={key}>{t[key]}</li>)}
      </ul>
      <h3 id="scenario-question" className="mt-5 font-semibold leading-relaxed">{t[scenario.questionKey]}</h3>
      <div role="group" aria-labelledby="scenario-question" className="mt-4 grid gap-2">
        {scenario.choices.map((choice) => (
          <button key={choice.id} type="button" id={`scenario-answer-${choice.id}`}
            {...buttonEvents(() => onAnswer(choice.id))} disabled={answered}
            className={`min-h-[3rem] rounded-lg border px-4 py-3 text-left text-sm leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:cursor-default ${answered && choice.id === scenario.layoutId ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300' : 'border-slate-600 bg-slate-800 text-slate-100 enabled:hover:border-emerald-500 enabled:hover:bg-slate-700'}`}>
            {t[choice.labelKey]}
          </button>
        ))}
      </div>
      <p id="scenario-feedback" aria-hidden="true"
        className={`mt-4 min-h-[1.5rem] text-sm font-bold ${feedback === 'wrong' ? 'text-red-400' : answered ? 'text-emerald-400' : 'text-slate-300'}`}>
        {answered ? `✓ ${t.game_correct} +${scenario.points}` : feedback === 'wrong' ? `✕ ${t.game_try_again}` : t.game_scenario_hint}
      </p>
      {answered && (
        <>
          <p id="scenario-rationale" className="mt-3 text-sm leading-relaxed text-slate-300">{t[scenario.rationaleKey]}</p>
          <button type="button" id="view-layout-btn" {...buttonEvents(onPreview)} disabled={previewed}
            className="mt-4 min-h-[3rem] rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
            {t.game_view_layout}
          </button>
          {hasNext && previewed && (
            <button type="button" id="next-customer-btn" {...buttonEvents(onNext)}
              className="mt-3 block min-h-[3rem] rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
              {t.game_next_customer}
            </button>
          )}
        </>
      )}
    </section>
  );
};
