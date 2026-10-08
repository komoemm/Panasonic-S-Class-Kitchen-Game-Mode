import { useModalFocus } from '../utils/useModalFocus';
import React from 'react';
import { KitchenConfig, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { X, Layers } from 'lucide-react';

interface BlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: KitchenConfig;
  lang: Language;
}

export const BlueprintModal: React.FC<BlueprintModalProps> = ({
  isOpen,
  onClose,
  config,
  lang,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ja;

  const dialogRef = useModalFocus(isOpen, onClose);
  if (!isOpen) return null;

  const isLeft = config.sinkLocation === 'left';
  // Existing schematic coordinates; no scale or installation dimensions are implied.
  const sinkX = isLeft ? 50 : 390;
  const cooktopX = isLeft ? 370 : 50;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="blueprint-modal-title" tabIndex={-1} className="relative w-full max-w-4xl glass-panel-elevated rounded-2xl shadow-2xl border border-emerald-500/30 overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-900/95 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h3 id="blueprint-modal-title" className="font-bold text-base text-white">
              {t.blueprint_title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label={t.dialog_close}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Blueprint Content */}
        <div className="p-6 sm:p-8 space-y-6 bg-[#0c121e]">
          <p className="text-sm text-slate-300">{t.blueprint_scope}</p>
          {config.layout !== 'type-i' ? <p id="blueprint-unavailable" role="status" className="rounded-xl border border-slate-700 p-4 text-slate-200">{t.blueprint_unavailable}</p> : <>
          {/* Existing I-Type concept schematic */}
          <div className="relative p-4 sm:p-6 rounded-2xl bg-slate-950 border border-cyan-500/20 shadow-inner flex flex-col items-center">
            <div className="text-xs font-mono text-cyan-400/80 mb-2 w-full flex justify-between">
              <span>{t.blueprint_plan}</span>
              <span>{t.layout_type_i_name}</span>
            </div>

            <svg
              role="img" aria-label={t.blueprint_title}
              viewBox="0 0 700 280"
              className="w-full max-w-2xl h-auto stroke-cyan-400/70"
            >
              <defs>
                <pattern
                  id="grid-pattern"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>

              {/* Grid Background */}
              <rect width="700" height="280" fill="url(#grid-pattern)" />

              {/* Overall Countertop Outline (2550mm) */}
              <rect
                x="50"
                y="50"
                width="600"
                height="150"
                fill="#0f172a"
                stroke="#00a86b"
                strokeWidth="2.5"
                rx="4"
              />

              {/* Sink Unit */}
              <rect
                x={sinkX}
                y="70"
                width="160"
                height="110"
                fill="#1e293b"
                stroke="#38bdf8"
                strokeWidth="1.8"
                rx="6"
              />
              {/* Drain ring */}
              <circle
                cx={sinkX + 115}
                cy="125"
                r="14"
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth="1.2"
              />
              {/* Faucet Mount */}
              <circle
                cx={sinkX + 80}
                cy="64"
                r="8"
                fill="#38bdf8"
              />
              <text
                x={sinkX + 80}
                y="105"
                fill="#93c5fd"
                fontSize="10"
                textAnchor="middle"
                fontFamily="sans-serif"
                fontWeight="bold"
              >
                {t.game_sink}
              </text>

              {/* Center Work Prep Zone or Dishwasher indicator */}
              <rect
                x="230"
                y="55"
                width="120"
                height="140"
                fill="transparent"
                stroke="#64748b"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x="290"
                y="120"
                fill="#94a3b8"
                fontSize="10"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                {t.blueprint_prep}
              </text>


              {/* IH Cooktop Unit */}
              <rect
                x={cooktopX}
                y="75"
                width="180"
                height="100"
                fill="#18181b"
                stroke="#f43f5e"
                strokeWidth="1.8"
                rx="3"
              />
              {/* 3 Burners for Triple Wide IH */}
              {config.upgrades.tripleWideIH ? (
                <>
                  <circle cx={cooktopX + 38} cy="120" r="22" fill="#000" stroke="#f43f5e" strokeWidth="1.5" />
                  <circle cx={cooktopX + 90} cy="120" r="22" fill="#000" stroke="#00f2fe" strokeWidth="1.5" />
                  <circle cx={cooktopX + 142} cy="120" r="22" fill="#000" stroke="#f43f5e" strokeWidth="1.5" />
                  <text
                    x={cooktopX + 90}
                    y="165"
                    fill="#f43f5e"
                    fontSize="9"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {t.game_cooktop}
                  </text>
                </>
              ) : (
                <>
                  <circle cx={cooktopX + 55} cy="120" r="24" fill="#000" stroke="#f43f5e" strokeWidth="1.5" />
                  <circle cx={cooktopX + 125} cy="120" r="24" fill="#000" stroke="#f43f5e" strokeWidth="1.5" />
                  <text
                    x={cooktopX + 90}
                    y="165"
                    fill="#f43f5e"
                    fontSize="9"
                    textAnchor="middle"
                  >
                    {t.blueprint_standard_cooktop}
                  </text>
                </>
              )}

              {/* Handedness Dynamic Mirroring Indicator Label */}
              <text
                x="350"
                y="235"
                fill="#00a86b"
                fontSize="11"
                textAnchor="middle"
                fontFamily="sans-serif"
                fontWeight="bold"
              >
                {isLeft ? t.blueprint_sink_left : t.blueprint_sink_right}
              </text>
            </svg>
          </div>
          </>}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            {t.blueprint_close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlueprintModal;
