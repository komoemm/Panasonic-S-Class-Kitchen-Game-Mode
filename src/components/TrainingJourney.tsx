import React from 'react';
import type { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

export type TrainingPhase = 'identification' | 'installation' | 'knowledge' | 'scenario';
const PHASES: readonly TrainingPhase[] = ['identification', 'installation', 'knowledge', 'scenario'];
const LABELS = ['game_identify', 'game_install', 'game_knowledge', 'game_customer_scenarios'];

export function TrainingJourney({ phase, phaseComplete, lang }: { phase: TrainingPhase; phaseComplete: boolean; lang: Language }) {
  const t = TRANSLATIONS[lang];
  const current = PHASES.indexOf(phase);
  return (
    <ol id="training-journey" aria-label={t.game_journey} className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:flex-1 sm:grid-cols-4">
      {PHASES.map((id, index) => {
        const state = index < current || (index === current && phaseComplete) ? 'completed' : index === current ? 'current' : 'upcoming';
        return (
          <li key={id} data-phase={id} data-state={state} aria-current={state === 'current' ? 'step' : undefined}
            className={`flex min-w-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold ${state === 'completed' ? 'border-emerald-800 bg-emerald-950/40 text-emerald-300' : state === 'current' ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-slate-700 text-slate-400'}`}>
            <span aria-hidden="true">{state === 'completed' ? '✓' : state === 'current' ? '●' : '○'}</span>
            <span className="min-w-0 break-words">{t[LABELS[index]]}<span className="sr-only"> — {t[`game_phase_${state}`]}</span></span>
          </li>
        );
      })}
    </ol>
  );
}
