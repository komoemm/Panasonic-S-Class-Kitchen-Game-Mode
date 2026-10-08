import React, { useState, useCallback, useEffect, useRef, Suspense, lazy } from 'react';
import { AppMode, KitchenConfig, Language, ProductInstallationTask } from './types';
import { calculateKitchenPrice } from './utils/pricing';
import { TopBar } from './components/TopBar';
import { StepWizard } from './components/StepWizard';
import { KitchenViewportSkeleton } from './components/KitchenViewportSkeleton';
import { TRANSLATIONS } from './i18n/translations';
import { KNOWLEDGE_QUESTIONS } from './data/sClassGameContent';
import { ProductKnowledgeCard } from './components/ProductKnowledgeCard';
import { LAYOUT_SCENARIOS } from './data/sClassLayoutScenarios';
import { CustomerScenarioCard } from './components/CustomerScenarioCard';
import { TrainingJourney, TrainingPhase } from './components/TrainingJourney';
import { TrainingResults, TrainingCategory } from './components/TrainingResults';
import { createTrainingAudio } from './utils/trainingAudio';

type IdentifyProductId = 'sink' | 'cooktop' | 'rangeHood';
type IdentifyTask = {
  id: string;
  productId: IdentifyProductId;
  instructionKey: 'game_find_sink' | 'game_find_cooktop' | 'game_find_range_hood';
  points: number;
};

const IDENTIFY_TASKS: readonly IdentifyTask[] = [
  { id: 'find-sink', productId: 'sink', instructionKey: 'game_find_sink', points: 100 },
  { id: 'find-cooktop', productId: 'cooktop', instructionKey: 'game_find_cooktop', points: 100 },
  { id: 'find-range-hood', productId: 'rangeHood', instructionKey: 'game_find_range_hood', points: 100 },
];

type InstallationTask = ProductInstallationTask & {
  id: string;
  instructionKey: 'game_install_sink' | 'game_install_cooktop' | 'game_install_range_hood';
  points: number;
};

const INSTALLATION_TASKS: readonly InstallationTask[] = [
  { id: 'install-sink', productId: 'sink', instructionKey: 'game_install_sink', points: 100, placementOrientation: 'horizontal' },
  { id: 'install-cooktop', productId: 'cooktop', instructionKey: 'game_install_cooktop', points: 100, placementOrientation: 'horizontal' },
  { id: 'install-range-hood', productId: 'rangeHood', instructionKey: 'game_install_range_hood', points: 100, placementOrientation: 'vertical' },
];

// Code Splitting with React.lazy for Google Lighthouse performance & Core Web Vitals optimization
const KitchenViewport3D = lazy(() => import('./components/KitchenViewport3D'));
const QuotationModal = lazy(() => import('./components/QuotationModal'));
const BlueprintModal = lazy(() => import('./components/BlueprintModal'));

export default function App() {
  const [lang, setLang] = useState<Language>('ja');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState<boolean>(false);
  const [isBlueprintModalOpen, setIsBlueprintModalOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [appMode, setAppMode] = useState<AppMode>('explore');
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [currentInstallationTaskIndex, setCurrentInstallationTaskIndex] = useState(0);
  const [currentKnowledgeIndex, setCurrentKnowledgeIndex] = useState(0);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [scenarioPreviewed, setScenarioPreviewed] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'identification-complete' | 'installation-complete' | 'knowledge-complete' | 'complete'>('idle');
  const [gamePhase, setGamePhase] = useState<TrainingPhase>('identification');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [availableProductIds, setAvailableProductIds] = useState<string[] | null>(null);
  // Synchronous action lock also protects answers/Next before React commits an update.
  const taskPhaseRef = useRef<'inactive' | 'ready' | 'answered' | 'previewed' | 'advancing'>('inactive');
  const trainingButtonTouchRef = useRef<{ pointerId: number; x: number; y: number; button: HTMLButtonElement } | null>(null);
  const currentTask = IDENTIFY_TASKS[currentTaskIndex];
  const currentInstallationTask = INSTALLATION_TASKS[currentInstallationTaskIndex];
  const currentKnowledgeQuestion = KNOWLEDGE_QUESTIONS[currentKnowledgeIndex];
  const activeKnowledgeQuestionIdRef = useRef<string | null>(null);
  const currentScenario = LAYOUT_SCENARIOS[currentScenarioIndex];
  const activeScenarioIdRef = useRef<string | null>(null);
  const scenarioSessionRef = useRef(0);
  const scenarioSession = scenarioSessionRef.current;
  const preScenarioRef = useRef<{ config: KitchenConfig; step: number; sidebarOpen: boolean } | null>(null);
  const [reviewTraining, setReviewTraining] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioRef = useRef<ReturnType<typeof createTrainingAudio> | null>(null);
  if (!audioRef.current) audioRef.current = createTrainingAudio();
  useEffect(() => () => audioRef.current?.dispose(), []);
  const handleToggleSound = () => {
    const enabled = !soundEnabled;
    audioRef.current?.setEnabled(enabled);
    setSoundEnabled(enabled);
  };

  useEffect(() => {
    activeKnowledgeQuestionIdRef.current = appMode === 'game' && gamePhase === 'knowledge' && gameStatus === 'playing'
      ? currentKnowledgeQuestion.id : null;
    activeScenarioIdRef.current = appMode === 'game' && gamePhase === 'scenario' && gameStatus === 'playing'
      ? currentScenario.id : null;
    taskPhaseRef.current = appMode === 'game' && gameStatus === 'playing' ? 'ready' : 'inactive';
  }, [appMode, currentTaskIndex, currentInstallationTaskIndex, currentKnowledgeIndex, currentScenarioIndex, gameStatus, gamePhase]);

  // Default initial configuration
  const [config, setConfig] = useState<KitchenConfig>({
    layout: 'type-i',
    detail: 'type-i-standard',
    planType: 'standard-default-locked',
    floorUnit: 'high-storage',
    upgrades: {
      sugoPikaSink: true,
      tripleWideIH: true,
      autoCleanHood: true,
      slimSensorFaucet: true,
    },
    sinkLocation: 'left',
    cabinetFinish: 'charcoal-slate',
  });

  const priceCalc = calculateKitchenPrice(config, lang);
  const t = TRANSLATIONS[lang];
  const showSidebar = appMode === 'explore' && isSidebarOpen;
  const canStartGame = availableProductIds !== null &&
    IDENTIFY_TASKS.every((task) => availableProductIds.includes(task.productId));

  const handleStartGame = () => {
    if (!canStartGame) return;
    taskPhaseRef.current = 'inactive';
    setReviewTraining(false);
    setCurrentTaskIndex(0);
    setCurrentInstallationTaskIndex(0);
    setCurrentKnowledgeIndex(0);
    activeKnowledgeQuestionIdRef.current = null;
    activeScenarioIdRef.current = null;
    setCurrentScenarioIndex(0);
    setScenarioPreviewed(false);
    setScore(0);
    setFeedback(null);
    setGamePhase('identification');
    setGameStatus('playing');
    setAppMode('game');
  };

  const handleReturnToExplore = () => {
    taskPhaseRef.current = 'inactive';
    activeScenarioIdRef.current = null;
    scenarioSessionRef.current += 1;
    setReviewTraining(false);
    const original = preScenarioRef.current;
    preScenarioRef.current = null;
    if (original) {
      setConfig(original.config);
      setCurrentStep(original.step);
      setIsSidebarOpen(original.sidebarOpen);
    }
    setCurrentScenarioIndex(0);
    setScenarioPreviewed(false);
    setCurrentInstallationTaskIndex(0);
    setCurrentKnowledgeIndex(0);
    activeKnowledgeQuestionIdRef.current = null;
    setAppMode('explore');
    setGameStatus('idle');
    setGamePhase('identification');
    setFeedback(null);
  };

  const handleTrainingButtonClick = (event: React.MouseEvent<HTMLButtonElement>, action: () => void) => {
    // Touch is handled on pointerup: browsers can omit the synthesized click after a drag.
    const nativeEvent = event.nativeEvent as PointerEvent & { sourceCapabilities?: { firesTouchEvents: boolean } };
    if (nativeEvent.pointerType === 'touch' || nativeEvent.sourceCapabilities?.firesTouchEvents) return;
    action();
  };

  const handleTrainingButtonPointerUp = (event: React.PointerEvent<HTMLButtonElement>, action: () => void) => {
    const start = trainingButtonTouchRef.current;
    trainingButtonTouchRef.current = null;
    if (event.pointerType !== 'touch' || !start || event.currentTarget !== start.button || event.pointerId !== start.pointerId ||
      Math.hypot(event.clientX - start.x, event.clientY - start.y) > 6) return;
    action();
  };

  const trainingButtonEvents = (action: () => void) => ({
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => handleTrainingButtonClick(event, action),
    onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => {
      trainingButtonTouchRef.current = event.pointerType === 'touch'
        ? { pointerId: event.pointerId, x: event.clientX, y: event.clientY, button: event.currentTarget } : null;
    },
    onPointerMove: (event: React.PointerEvent<HTMLButtonElement>) => {
      const start = trainingButtonTouchRef.current;
      if (start && event.pointerId === start.pointerId &&
        Math.hypot(event.clientX - start.x, event.clientY - start.y) > 6) trainingButtonTouchRef.current = null;
    },
    onPointerUp: (event: React.PointerEvent<HTMLButtonElement>) => handleTrainingButtonPointerUp(event, action),
    onPointerCancel: () => { trainingButtonTouchRef.current = null; },
  });

  const handleProductSelect = useCallback((productId: string) => {
    if (appMode !== 'game' || gamePhase !== 'identification' ||
      gameStatus !== 'playing' || taskPhaseRef.current !== 'ready') return;
    if (productId !== currentTask.productId) {
      audioRef.current?.play('wrong');
      setFeedback('wrong');
      return;
    }
    taskPhaseRef.current = 'answered';
    audioRef.current?.play('correct');
    setScore((previous) => previous + currentTask.points);
    setFeedback('correct');
    if (currentTaskIndex === IDENTIFY_TASKS.length - 1) {
      setGameStatus('identification-complete');
      audioRef.current?.play('complete');
    }
  }, [appMode, gamePhase, gameStatus, currentTask, currentTaskIndex]);

  const handleNextTask = () => {
    if (appMode !== 'game' || gamePhase !== 'identification' || gameStatus !== 'playing' ||
      taskPhaseRef.current !== 'answered' || currentTaskIndex >= IDENTIFY_TASKS.length - 1) return;
    taskPhaseRef.current = 'advancing';
    setFeedback(null);
    setCurrentTaskIndex((previous) => previous + 1);
  };

  const handleStartInstallation = () => {
    if (appMode !== 'game' || gameStatus !== 'identification-complete' ||
      taskPhaseRef.current !== 'inactive') return;
    taskPhaseRef.current = 'advancing';
    setFeedback(null);
    setCurrentInstallationTaskIndex(0);
    setGamePhase('installation');
    setGameStatus('playing');
  };

  const handleInstallationDrop = useCallback((productId: ProductInstallationTask['productId'], correct: boolean) => {
    if (appMode !== 'game' || gamePhase !== 'installation' ||
      gameStatus !== 'playing' || taskPhaseRef.current !== 'ready' ||
      productId !== currentInstallationTask.productId) return;
    if (!correct) {
      audioRef.current?.play('wrong');
      setFeedback('wrong');
      return;
    }
    taskPhaseRef.current = 'answered';
    audioRef.current?.play('correct');
    setFeedback('correct');
    setScore((previous) => previous + currentInstallationTask.points);
    if (currentInstallationTaskIndex === INSTALLATION_TASKS.length - 1) {
      setGameStatus('installation-complete');
      audioRef.current?.play('complete');
    }
  }, [appMode, gamePhase, gameStatus, currentInstallationTask, currentInstallationTaskIndex]);

  const handleNextInstallation = () => {
    if (appMode !== 'game' || gamePhase !== 'installation' || gameStatus !== 'playing' ||
      taskPhaseRef.current !== 'answered' || currentInstallationTaskIndex >= INSTALLATION_TASKS.length - 1) return;
    taskPhaseRef.current = 'advancing';
    setFeedback(null);
    setCurrentInstallationTaskIndex((previous) => previous + 1);
  };

  const handleStartKnowledge = () => {
    if (appMode !== 'game' || gamePhase !== 'installation' || gameStatus !== 'installation-complete' ||
      taskPhaseRef.current !== 'inactive') return;
    taskPhaseRef.current = 'advancing';
    setCurrentKnowledgeIndex(0);
    setFeedback(null);
    setGamePhase('knowledge');
    setGameStatus('playing');
  };

  const handleKnowledgeAnswer = (questionId: string, answerId: string) => {
    if (appMode !== 'game' || gamePhase !== 'knowledge' || gameStatus !== 'playing' ||
      taskPhaseRef.current !== 'ready' || questionId !== activeKnowledgeQuestionIdRef.current ||
      currentKnowledgeQuestion.id !== activeKnowledgeQuestionIdRef.current) return;
    const answer = currentKnowledgeQuestion.answers.find((choice) => choice.id === answerId);
    if (!answer) return;
    if (!answer.correct) {
      audioRef.current?.play('wrong');
      setFeedback('wrong');
      return;
    }
    taskPhaseRef.current = 'answered';
    audioRef.current?.play('correct');
    setFeedback('correct');
    setScore((previous) => previous + currentKnowledgeQuestion.points);
    if (currentKnowledgeIndex === KNOWLEDGE_QUESTIONS.length - 1) {
      setGameStatus('knowledge-complete');
      audioRef.current?.play('complete');
    }
  };

  const handleNextKnowledge = () => {
    if (appMode !== 'game' || gamePhase !== 'knowledge' || gameStatus !== 'playing' ||
      taskPhaseRef.current !== 'answered' || currentKnowledgeQuestion.id !== activeKnowledgeQuestionIdRef.current ||
      currentKnowledgeIndex >= KNOWLEDGE_QUESTIONS.length - 1) return;
    taskPhaseRef.current = 'advancing';
    activeKnowledgeQuestionIdRef.current = null;
    setFeedback(null);
    setCurrentKnowledgeIndex((previous) => previous + 1);
  };

  const handleStartScenarios = () => {
    if (appMode !== 'game' || gamePhase !== 'knowledge' || gameStatus !== 'knowledge-complete' ||
      taskPhaseRef.current !== 'inactive') return;
    taskPhaseRef.current = 'advancing';
    scenarioSessionRef.current += 1;
    // Snapshot the whole existing configuration, including the nested upgrades record.
    // Viewport-owned finishes/isolation/exploded state remain in the mounted viewport.
    preScenarioRef.current = { config: { ...config, upgrades: { ...config.upgrades } }, step: currentStep, sidebarOpen: isSidebarOpen };
    setCurrentScenarioIndex(0);
    setScenarioPreviewed(false);
    setFeedback(null);
    setGamePhase('scenario');
    setGameStatus('playing');
  };

  const isActiveScenario = (scenarioId: string) => appMode === 'game' && gamePhase === 'scenario' &&
    gameStatus === 'playing' && scenarioSession === scenarioSessionRef.current &&
    scenarioId === activeScenarioIdRef.current && currentScenario.id === activeScenarioIdRef.current;

  const handleScenarioAnswer = (scenarioId: string, layoutId: string) => {
    if (!isActiveScenario(scenarioId) || taskPhaseRef.current !== 'ready' ||
      !currentScenario.choices.some((choice) => choice.id === layoutId)) return;
    if (layoutId !== currentScenario.layoutId) {
      audioRef.current?.play('wrong');
      setFeedback('wrong');
      return;
    }
    taskPhaseRef.current = 'answered';
    audioRef.current?.play('correct');
    setFeedback('correct');
    setScore((previous) => previous + currentScenario.points);
  };

  const handlePreviewLayout = (scenarioId: string) => {
    if (!isActiveScenario(scenarioId) || taskPhaseRef.current !== 'answered') return;
    taskPhaseRef.current = 'previewed';
    // Use the same configuration setter as the wizard; the existing scene rebuild handles geometry.
    setConfig((previous) => previous.layout === currentScenario.layoutId ? previous : { ...previous, layout: currentScenario.layoutId });
    setScenarioPreviewed(true);
    if (currentScenarioIndex === LAYOUT_SCENARIOS.length - 1) {
      setGameStatus('complete');
      audioRef.current?.play('complete');
    }
  };

  const handleNextCustomer = (scenarioId: string) => {
    if (!isActiveScenario(scenarioId) || taskPhaseRef.current !== 'previewed' ||
      currentScenarioIndex >= LAYOUT_SCENARIOS.length - 1) return;
    taskPhaseRef.current = 'advancing';
    activeScenarioIdRef.current = null;
    setCurrentScenarioIndex((previous) => previous + 1);
    setScenarioPreviewed(false);
    setFeedback(null);
  };

  const installationTask = appMode === 'game' && gamePhase === 'installation' &&
    gameStatus === 'playing' && feedback !== 'correct' ? currentInstallationTask : null;
  const instruction = gameStatus === 'complete' ? t.game_complete :
    gameStatus === 'identification-complete' ? t.game_identification_complete :
    gameStatus === 'installation-complete' ? t.game_installation_complete :
    gameStatus === 'knowledge-complete' ? t.game_knowledge_complete :
    gamePhase === 'scenario' ? t[currentScenario.questionKey] :
    gamePhase === 'knowledge' ? t[currentKnowledgeQuestion.titleKey] :
    gamePhase === 'installation' ? t[currentInstallationTask.instructionKey] : t[currentTask.instructionKey];
  const trainingTitle = gameStatus === 'complete' ? t.game_result : gamePhase === 'scenario' ? t.game_customer_training : gamePhase === 'knowledge' ? t.game_product_knowledge :
    gamePhase === 'installation' ? t.game_installation_training : t.game_training;
  const trainingHint = gamePhase === 'scenario' ? t.game_scenario_hint : gamePhase === 'knowledge' ? t.game_knowledge_hint :
    gamePhase === 'installation' ? t.game_drag_product_hint : t.game_click_hint;
  const taskPoints = gamePhase === 'scenario' ? currentScenario.points : gamePhase === 'knowledge' ? currentKnowledgeQuestion.points :
    gamePhase === 'installation' ? currentInstallationTask.points : currentTask.points;

  // Sequential phase totals come from the existing task data and single score state.
  const productNames = [t.game_sink, t.game_cooktop, t.game_range_hood];
  const resultGroups = [
    { id: 'identification', label: t.game_identification, tasks: IDENTIFY_TASKS, items: productNames },
    { id: 'installation', label: t.game_install, tasks: INSTALLATION_TASKS, items: productNames },
    { id: 'knowledge', label: t.game_knowledge_category, tasks: KNOWLEDGE_QUESTIONS, items: KNOWLEDGE_QUESTIONS.map((question) => t[question.titleKey]) },
    { id: 'scenario', label: t.game_customer_scenarios, tasks: LAYOUT_SCENARIOS, items: LAYOUT_SCENARIOS.map((scenario) => t[scenario.choices.find((choice) => choice.id === scenario.layoutId)!.labelKey]) },
  ];
  let previousMaximum = 0;
  const resultCategories: TrainingCategory[] = resultGroups.map(({ tasks, ...group }) => {
    const maximum = tasks.reduce((sum, task) => sum + task.points, 0);
    const points = Math.max(0, Math.min(maximum, score - previousMaximum));
    previousMaximum += maximum;
    return { ...group, points, maximum };
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#080c15] text-slate-100 selection:bg-[#00a86b] selection:text-white">
      {/* Top Header Bar */}
      <TopBar
        lang={lang}
        onSelectLang={setLang}
        priceCalc={priceCalc}
        onOpenQuotationModal={() => setIsQuotationModalOpen(true)}
        onOpenBlueprintModal={() => setIsBlueprintModalOpen(true)}
      />

      {/* React training HUD; the Three.js viewport stays mounted below. */}
      <section aria-label={trainingTitle} className="max-w-[1720px] w-full mx-auto px-3 sm:px-5 lg:px-6 pt-4">
        {appMode === 'game' && (
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <TrainingJourney phase={gamePhase} phaseComplete={gameStatus !== 'playing'} lang={lang} />
            <button type="button" id="sound-toggle-btn" aria-pressed={soundEnabled} {...trainingButtonEvents(handleToggleSound)}
              className="min-h-[2.75rem] rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-xs font-semibold hover:border-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
              {t.game_sound}: {soundEnabled ? t.game_sound_on : t.game_sound_off}
            </button>
          </div>
        )}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3">
          <div>
            <p className="text-xs font-bold tracking-widest text-emerald-400">{trainingTitle}</p>
            {appMode === 'game' && (
              <>
                {gameStatus === 'playing' && (
                  <p className="mt-1 text-xs font-semibold text-slate-400" id="game-progress">
                    {gamePhase === 'scenario' ? t.game_scenario : gamePhase === 'knowledge' ? t.game_knowledge : t.game_task} {gamePhase === 'scenario'
                      ? `${currentScenarioIndex + 1} / ${LAYOUT_SCENARIOS.length}` : gamePhase === 'knowledge'
                      ? `${currentKnowledgeIndex + 1} / ${KNOWLEDGE_QUESTIONS.length}`
                      : gamePhase === 'installation' ? `${currentInstallationTaskIndex + 1} / ${INSTALLATION_TASKS.length}`
                      : `${currentTaskIndex + 1} / ${IDENTIFY_TASKS.length}`}
                  </p>
                )}
                <h2 className="mt-1 text-lg font-bold" id="game-task">
                  {instruction}
                </h2>
              </>
            )}
            {appMode === 'explore' && availableProductIds !== null && !canStartGame && (
              <p id="game-unavailable" className="mt-1 text-sm text-slate-400">{t.game_requires_products}</p>
            )}
          </div>
          {appMode === 'game' && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm">
              <p className="font-semibold" id="game-score">{t.game_score}: {score}</p>
              {(gameStatus === 'identification-complete' || gamePhase !== 'identification') && (
                <p className="font-semibold" id="game-products-identified">
                  {t.game_products_identified}: {IDENTIFY_TASKS.length} / {IDENTIFY_TASKS.length}
                </p>
              )}
              {(gameStatus === 'installation-complete' || gamePhase === 'knowledge' || gamePhase === 'scenario') && (
                <p className="font-semibold" id="game-products-installed">{t.game_products_installed}: {INSTALLATION_TASKS.length} / {INSTALLATION_TASKS.length}</p>
              )}
              {(gameStatus === 'knowledge-complete' || gamePhase === 'scenario') && (
                <p className="font-semibold" id="game-knowledge-count">{t.game_knowledge}: {KNOWLEDGE_QUESTIONS.length} / {KNOWLEDGE_QUESTIONS.length}</p>
              )}
              {gameStatus === 'complete' && (
                <p className="font-semibold" id="game-scenarios-count">{t.game_customer_scenarios}: {LAYOUT_SCENARIOS.length} / {LAYOUT_SCENARIOS.length}</p>
              )}
              <p role="status" aria-live="polite" aria-atomic="true" id="game-feedback"
                className={`training-feedback grid w-full rounded-lg border px-3 py-2 min-h-[2.75rem] font-bold ${feedback === 'wrong' ? 'border-red-800 bg-red-950/40 text-red-300' : feedback === 'correct' ? 'border-emerald-800 bg-emerald-950/40 text-emerald-300' : 'border-slate-700 text-slate-300'}`}>
                <span className="col-start-1 row-start-1">
                  {feedback === 'correct' ? `✓ ${t.game_correct} +${taskPoints}` : feedback === 'wrong' ? `✕ ${t.game_try_again}` : trainingHint}
                </span>
                <span aria-hidden="true" className="invisible col-start-1 row-start-1">{trainingHint}</span>
              </p>
              {gameStatus === 'playing' && gamePhase === 'identification' && (
                <button type="button" id="next-task-btn" onClick={handleNextTask}
                  disabled={feedback !== 'correct'} aria-hidden={feedback !== 'correct'}
                  className={`min-h-[3rem] rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${feedback !== 'correct' ? 'invisible' : ''}`}>
                  {t.game_next_task}
                </button>
              )}
              {gameStatus === 'identification-complete' && (
                <button type="button" id="start-installation-btn" onClick={handleStartInstallation}
                  className="min-h-[3rem] rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
                  {t.game_start_installation}
                </button>
              )}
              {gameStatus === 'installation-complete' && (
                <button type="button" id="start-knowledge-btn" {...trainingButtonEvents(handleStartKnowledge)}
                  className="min-h-[3rem] rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
                  {t.game_start_knowledge}
                </button>
              )}
              {gameStatus === 'knowledge-complete' && (
                <button type="button" id="start-scenarios-btn" {...trainingButtonEvents(handleStartScenarios)}
                  className="min-h-[3rem] rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
                  {t.game_start_scenarios}
                </button>
              )}
              {gameStatus === 'playing' && gamePhase === 'installation' && currentInstallationTaskIndex < INSTALLATION_TASKS.length - 1 && (
                <button type="button" id="next-installation-btn" {...trainingButtonEvents(handleNextInstallation)}
                  disabled={feedback !== 'correct'} aria-hidden={feedback !== 'correct'}
                  className={`min-h-[3rem] rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${feedback !== 'correct' ? 'invisible' : ''}`}>
                  {t.game_next_installation}
                </button>
              )}
            </div>
          )}
          <button type="button" id={appMode === 'explore' ? 'start-game-btn' : 'return-explore-btn'}
            {...trainingButtonEvents(appMode === 'explore' ? handleStartGame : handleReturnToExplore)}
            disabled={appMode === 'explore' && !canStartGame}
            aria-describedby={appMode === 'explore' && availableProductIds !== null && !canStartGame ? 'game-unavailable' : undefined}
            className="min-h-[3rem] rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
            {appMode === 'explore' ? t.game_start : t.game_return}
          </button>
        </div>
      </section>

      {/* Main Responsive Layout */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-3 sm:p-5 lg:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6 relative overflow-x-hidden">
        {appMode === 'game' && gameStatus === 'complete' && (
          <TrainingResults lang={lang} score={score} categories={resultCategories} review={reviewTraining}
            onToggleReview={() => setReviewTraining(!reviewTraining)} onReturn={handleReturnToExplore} buttonEvents={trainingButtonEvents} />
        )}
        {appMode === 'game' && gamePhase === 'knowledge' && gameStatus === 'playing' ? (
          <ProductKnowledgeCard question={currentKnowledgeQuestion} lang={lang} feedback={feedback}
            hasNext={currentKnowledgeIndex < KNOWLEDGE_QUESTIONS.length - 1}
            onAnswer={(answerId) => handleKnowledgeAnswer(currentKnowledgeQuestion.id, answerId)}
            onNext={handleNextKnowledge} buttonEvents={trainingButtonEvents} />
        ) : appMode === 'game' && gamePhase === 'scenario' && gameStatus === 'playing' ? (
          <CustomerScenarioCard scenario={currentScenario} lang={lang} feedback={feedback} previewed={scenarioPreviewed}
            hasNext={currentScenarioIndex < LAYOUT_SCENARIOS.length - 1}
            onAnswer={(layoutId) => handleScenarioAnswer(currentScenario.id, layoutId)}
            onPreview={() => handlePreviewLayout(currentScenario.id)}
            onNext={() => handleNextCustomer(currentScenario.id)} buttonEvents={trainingButtonEvents} />
        ) : null}
        {/* Left / Center 3D Interactive Viewport with Suspense Skeleton */}
        <section 
          aria-label={lang === 'ja' ? '3Dモデル表示領域' : '3D Model Viewport Area'}
          className="flex-1 min-w-0 flex flex-col h-[480px] sm:h-[560px] lg:h-[calc(100vh-100px)] min-h-[440px] transition-all duration-300 ease-in-out relative"
        >
          <Suspense fallback={<KitchenViewportSkeleton lang={lang} />}>
            <KitchenViewport3D
              config={config}
              lang={lang}
              mode={appMode}
              installationTask={installationTask}
              onInstallationDrop={handleInstallationDrop}
              onProductSelect={handleProductSelect}
              onAvailableProductsChange={setAvailableProductIds}
              activeFocus={appMode === 'explore' && currentStep === 6 ? 'sink' : undefined}
              onSelectFinish={(finishId) => setConfig((prev) => ({ ...prev, cabinetFinish: finishId }))}
              onOpenQuotation={() => setIsQuotationModalOpen(true)}
              onOpenBlueprint={() => setIsBlueprintModalOpen(true)}
              isSidebarOpen={showSidebar}
              onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
            />
          </Suspense>
        </section>

        {/* Right 7-Step Configurator Wizard Panel (Collapsible Container with smooth transition) */}
        <aside 
          aria-label={lang === 'ja' ? '7ステップ見積シミュレーター設定' : '7-Step Kitchen Configuration Wizard'}
          aria-hidden={!showSidebar}
          inert={!showSidebar}
          className={`${appMode === 'game' ? 'hidden' : 'flex'} flex-col h-[520px] sm:h-[600px] lg:h-[calc(100vh-100px)] min-h-[500px] transition-all duration-300 ease-in-out ${
            showSidebar
              ? 'w-full lg:w-[420px] xl:w-[460px] opacity-100' 
              : 'w-0 opacity-0 pointer-events-none p-0 overflow-hidden m-0 border-0'
          }`}
        >
          <div className="w-full sm:w-[380px] lg:w-[420px] xl:w-[460px] h-full flex flex-col">
            <StepWizard
              currentStep={currentStep}
              onSetStep={setCurrentStep}
              config={config}
              onChangeConfig={setConfig}
              priceCalc={priceCalc}
              lang={lang}
              onOpenQuotationModal={() => setIsQuotationModalOpen(true)}
              onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
              isSidebarOpen={isSidebarOpen}
            />
          </div>
        </aside>
      </main>

      {/* Itemized Printable Official Quotation Modal (Lazy Loaded on demand) */}
      {isQuotationModalOpen && (
        <Suspense fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-200 text-sm shadow-2xl">
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <span className="font-medium">
                {lang === 'ja' ? '見積書データを読み込み中...' : 'Loading quotation...'}
              </span>
            </div>
          </div>
        }>
          <QuotationModal
            isOpen={isQuotationModalOpen}
            onClose={() => setIsQuotationModalOpen(false)}
            config={config}
            priceCalc={priceCalc}
            lang={lang}
          />
        </Suspense>
      )}

      {/* 2D Architectural Blueprint Diagram Modal (Lazy Loaded on demand) */}
      {isBlueprintModalOpen && (
        <Suspense fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-200 text-sm shadow-2xl">
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <span className="font-medium">
                {lang === 'ja' ? '2D図面データを読み込み中...' : 'Loading architectural blueprint...'}
              </span>
            </div>
          </div>
        }>
          <BlueprintModal
            isOpen={isBlueprintModalOpen}
            onClose={() => setIsBlueprintModalOpen(false)}
            config={config}
            lang={lang}
          />
        </Suspense>
      )}
    </div>
  );
}
