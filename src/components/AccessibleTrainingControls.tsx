import React, { useEffect, useState } from 'react';
import type { InstallationControls, Language, ProductInstallationTask } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

const buttonClass = 'min-h-[3rem] rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm enabled:hover:border-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:opacity-50';
const productIds = ['sink', 'cooktop', 'rangeHood'] as const;
const productKeys = ['game_sink', 'game_cooktop', 'game_range_hood'] as const;

export function AccessibleIdentification({ lang, disabled, onSelect, buttonEvents }: {
  lang: Language; disabled: boolean; onSelect: (id: string) => void;
  buttonEvents: (action: () => void) => React.ButtonHTMLAttributes<HTMLButtonElement>;
}) {
  const t = TRANSLATIONS[lang];
  return <section data-training-controls id="accessible-identification" aria-labelledby="identify-controls-title"
    className="w-full lg:w-[300px] shrink-0 self-start rounded-xl border border-slate-700 bg-slate-900/90 p-4">
    <h3 id="identify-controls-title" className="font-bold">{t.game_choose_product}</h3>
    <p className="mt-2 text-sm text-slate-300">{t.game_identify_controls_hint}</p>
    <div className="mt-3 grid gap-2">
      {productIds.map((id, i) => <button id={`identify-product-${id}`} type="button" key={id}
        className={buttonClass} disabled={disabled} {...buttonEvents(() => onSelect(id))}>{t[productKeys[i]]}</button>)}
    </div>
  </section>;
}

export function AccessibleInstallation({ controls, task, lang, disabled, buttonEvents }: {
  controls: InstallationControls | null; task: ProductInstallationTask; lang: Language; disabled: boolean;
  buttonEvents: (action: () => void) => React.ButtonHTMLAttributes<HTMLButtonElement>;
}) {
  const t = TRANSLATIONS[lang];
  const [offset, setOffset] = useState<ReturnType<InstallationControls['getOffset']> | null>(null);
  useEffect(() => { setOffset(controls?.getOffset() ?? null); }, [controls]);
  const act = (action: (c: InstallationControls) => void) => {
    if (!controls || disabled) return;
    action(controls); setOffset(controls.getOffset());
  };
  const vertical = task.placementOrientation === 'vertical';
  return <section data-training-controls id="accessible-installation" aria-labelledby="install-controls-title"
    onFocus={() => setOffset(controls?.getOffset() ?? null)}
    className="w-full lg:w-[300px] shrink-0 self-start rounded-xl border border-slate-700 bg-slate-900/90 p-4">
    <h3 id="install-controls-title" className="font-bold">{t.game_move_product}</h3>
    <p className="mt-2 text-sm text-slate-300">{t.game_move_controls_hint}</p>
    <p className="mt-2 text-sm text-slate-300">{vertical ? t.game_vertical_axes : t.game_horizontal_axes}</p>
    <div className="mt-3 grid grid-cols-2 gap-2">
      {([
        ['left', t.game_move_left, -0.1, 0], ['right', t.game_move_right, 0.1, 0],
        ['negative', vertical ? t.game_move_down : t.game_move_back, 0, -0.1],
        ['positive', vertical ? t.game_move_up : t.game_move_front, 0, 0.1],
      ] as const).map(([id, label, x, axis]) => <button key={id} id={`placement-${id}`} type="button"
        className={buttonClass} disabled={!controls || disabled}
        {...buttonEvents(() => act(c => c.move(x, axis)))}>{label}</button>)}
    </div>
    <p id="placement-offset" role="status" aria-live="polite" aria-atomic="true" className="mt-3 text-sm leading-relaxed text-slate-300">
      {offset && !disabled ? `${t.game_target_offset}: ${t.game_axis_horizontal} ${Math.round(offset.x * 100)} cm; ${vertical ? t.game_axis_vertical : t.game_axis_depth} ${Math.round(offset.planeAxis * 100)} cm. ${t.game_placement_tolerance}: ${Math.round(offset.tolerance * 100)} cm.` : t.game_move_controls_hint}
    </p>
    <p className="mt-2 text-xs text-slate-400">{t.game_offset_sign_hint}</p>
    <div className="mt-3 grid gap-2">
      <button id="placement-confirm" type="button" disabled={!controls || disabled} className={buttonClass}
        {...buttonEvents(() => act(c => c.confirm()))}>{t.game_confirm_placement}</button>
      <button id="placement-reset" type="button" disabled={!controls || disabled} className={buttonClass}
        {...buttonEvents(() => act(c => c.reset()))}>{t.game_reset_placement}</button>
    </div>
  </section>;
}
