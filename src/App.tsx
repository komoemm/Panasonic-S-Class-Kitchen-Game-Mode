import React, { useState, useCallback, useEffect, useRef, Suspense, lazy } from 'react';
import { AppMode, KitchenConfig, Language, ProductInstallationTask } from './types';
import { calculateKitchenPrice } from './utils/pricing';
import { TopBar } from './components/TopBar';
import { StepWizard } from './components/StepWizard';
import { KitchenViewportSkeleton } from './components/KitchenViewportSkeleton';
import { TRANSLATIONS } from './i18n/translations';

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
  instructionKey: 'game_install_sink' | 'game_install_cooktop';
  points: number;
};

const INSTALLATION_TASKS: readonly InstallationTask[] = [
  { id: 'install-sink', productId: 'sink', instructionKey: 'game_install_sink', points: 100, placementOrientation: 'horizontal' },
  { id: 'install-cooktop', productId: 'cooktop', instructionKey: 'game_install_cooktop', points: 100, placementOrientation: 'horizontal' },
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
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'identification-complete' | 'complete'>('idle');
  const [gamePhase, setGamePhase] = useState<'identification' | 'installation'>('identification');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [availableProductIds, setAvailableProductIds] = useState<string[] | null>(null);
  // Synchronous action lock also protects answers/Next before React commits an update.
  const taskPhaseRef = useRef<'inactive' | 'ready' | 'answered' | 'advancing'>('inactive');
  const trainingButtonTouchRef = useRef<{ pointerId: number; x: number; y: number; button: HTMLButtonElement } | null>(null);
  const currentTask = IDENTIFY_TASKS[currentTaskIndex];
  const currentInstallationTask = INSTALLATION_TASKS[currentInstallationTaskIndex];

  useEffect(() => {
    taskPhaseRef.current = appMode === 'game' && gameStatus === 'playing' ? 'ready' : 'inactive';
  }, [appMode, currentTaskIndex, currentInstallationTaskIndex, gameStatus, gamePhase]);

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
    setCurrentTaskIndex(0);
    setCurrentInstallationTaskIndex(0);
    setScore(0);
    setFeedback(null);
    setGamePhase('identification');
    setGameStatus('playing');
    setAppMode('game');
  };

  const handleReturnToExplore = () => {
    taskPhaseRef.current = 'inactive';
    setCurrentInstallationTaskIndex(0);
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
      setFeedback('wrong');
      return;
    }
    taskPhaseRef.current = 'answered';
    setScore((previous) => previous + currentTask.points);
    setFeedback('correct');
    if (currentTaskIndex === IDENTIFY_TASKS.length - 1) setGameStatus('identification-complete');
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
      setFeedback('wrong');
      return;
    }
    taskPhaseRef.current = 'answered';
    setFeedback('correct');
    setScore((previous) => previous + currentInstallationTask.points);
    if (currentInstallationTaskIndex === INSTALLATION_TASKS.length - 1) setGameStatus('complete');
  }, [appMode, gamePhase, gameStatus, currentInstallationTask, currentInstallationTaskIndex]);

  const handleNextInstallation = () => {
    if (appMode !== 'game' || gamePhase !== 'installation' || gameStatus !== 'playing' ||
      taskPhaseRef.current !== 'answered' || currentInstallationTaskIndex >= INSTALLATION_TASKS.length - 1) return;
    taskPhaseRef.current = 'advancing';
    setFeedback(null);
    setCurrentInstallationTaskIndex((previous) => previous + 1);
  };

  const installationTask = appMode === 'game' && gamePhase === 'installation' &&
    gameStatus === 'playing' && feedback !== 'correct' ? currentInstallationTask : null;
  const instruction = gameStatus === 'complete' ? t.game_complete :
    gameStatus === 'identification-complete' ? t.game_identification_complete :
    gamePhase === 'installation' ? t[currentInstallationTask.instructionKey] : t[currentTask.instructionKey];
  const trainingHint = gamePhase === 'installation' ? t.game_drag_product_hint : t.game_click_hint;

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
      <section aria-label={gamePhase === 'installation' ? t.game_installation_training : t.game_training} className="max-w-[1720px] w-full mx-auto px-3 sm:px-5 lg:px-6 pt-4">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3">
          <div>
            <p className="text-xs font-bold tracking-widest text-emerald-400">{gamePhase === 'installation' ? t.game_installation_training : t.game_training}</p>
            {appMode === 'game' && (
              <>
                {gameStatus === 'playing' && (
                  <p className="mt-1 text-xs font-semibold text-slate-400" id="game-progress">
                    {t.game_task} {gamePhase === 'installation'
                      ? `${currentInstallationTaskIndex + 1} / ${INSTALLATION_TASKS.length}`
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
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
              <p className="font-semibold" id="game-score">{t.game_score}: {score}</p>
              {(gameStatus === 'identification-complete' || gamePhase === 'installation') && (
                <p className="font-semibold" id="game-products-identified">
                  {t.game_products_identified}: {IDENTIFY_TASKS.length} / {IDENTIFY_TASKS.length}
                </p>
              )}
              {gameStatus === 'complete' && (
                <p className="font-semibold" id="game-products-installed">{t.game_products_installed}: {INSTALLATION_TASKS.length} / {INSTALLATION_TASKS.length}</p>
              )}
              <p role="status" aria-live="polite" aria-atomic="true" id="game-feedback"
                className={`grid min-h-[2.5rem] sm:min-h-0 font-bold ${feedback === 'wrong' ? 'text-red-400' : feedback === 'correct' ? 'text-emerald-400' : 'text-slate-300'}`}>
                <span className="col-start-1 row-start-1">
                  {feedback === 'correct' ? `✓ ${t.game_correct} +${gamePhase === 'installation' ? currentInstallationTask.points : currentTask.points}` : feedback === 'wrong' ? `✕ ${t.game_try_again}` : trainingHint}
                </span>
                <span aria-hidden="true" className="invisible col-start-1 row-start-1">{trainingHint}</span>
              </p>
              {gameStatus === 'playing' && gamePhase === 'identification' && (
                <button type="button" id="next-task-btn" onClick={handleNextTask}
                  disabled={feedback !== 'correct'} aria-hidden={feedback !== 'correct'}
                  className={`rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${feedback !== 'correct' ? 'invisible' : ''}`}>
                  {t.game_next_task}
                </button>
              )}
              {gameStatus === 'identification-complete' && (
                <button type="button" id="start-installation-btn" onClick={handleStartInstallation}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
                  {t.game_start_installation}
                </button>
              )}
              {gameStatus === 'playing' && gamePhase === 'installation' && currentInstallationTaskIndex < INSTALLATION_TASKS.length - 1 && (
                <button type="button" id="next-installation-btn" {...trainingButtonEvents(handleNextInstallation)}
                  disabled={feedback !== 'correct'} aria-hidden={feedback !== 'correct'}
                  className={`rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${feedback !== 'correct' ? 'invisible' : ''}`}>
                  {t.game_next_installation}
                </button>
              )}
            </div>
          )}
          <button type="button" id={appMode === 'explore' ? 'start-game-btn' : 'return-explore-btn'}
            {...trainingButtonEvents(appMode === 'explore' ? handleStartGame : handleReturnToExplore)}
            disabled={appMode === 'explore' && !canStartGame}
            aria-describedby={appMode === 'explore' && availableProductIds !== null && !canStartGame ? 'game-unavailable' : undefined}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
            {appMode === 'explore' ? t.game_start : t.game_return}
          </button>
        </div>
      </section>

      {/* Main Responsive Layout */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-3 sm:p-5 lg:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6 relative overflow-x-hidden">
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

