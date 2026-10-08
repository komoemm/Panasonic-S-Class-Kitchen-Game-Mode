export type TrainingCue = 'correct' | 'wrong' | 'complete';

// Optional feedback only. Create/resume the context from the sound button's user gesture.
export function createTrainingAudio() {
  let context: AudioContext | null = null;
  let enabled = false;
  const active = new Set<OscillatorNode>();
  const stop = () => {
    active.forEach((node) => { try { node.stop(); } catch { /* Already stopped. */ } });
    active.clear();
  };
  return {
    setEnabled(value: boolean) {
      enabled = value;
      if (!value) { stop(); return; }
      try {
        if (!context) {
          const Audio = window.AudioContext;
          if (!Audio) return;
          context = new Audio();
        }
        if (context.state === 'suspended') void context.resume().catch(() => {});
      } catch { /* Unavailable audio never blocks training. */ }
    },
    play(cue: TrainingCue) {
      if (!enabled || !context || context.state !== 'running') return;
      try {
        const start = context.currentTime + (cue === 'complete' ? 0.18 : 0);
        const frequencies = cue === 'complete' ? [523, 659, 784] : cue === 'correct' ? [659, 880] : [262, 220];
        frequencies.forEach((frequency, index) => {
          const oscillator = context!.createOscillator();
          const gain = context!.createGain();
          const at = start + index * 0.09;
          oscillator.type = 'sine';
          oscillator.frequency.value = frequency;
          gain.gain.setValueAtTime(0, at);
          gain.gain.linearRampToValueAtTime(0.045, at + 0.012);
          gain.gain.exponentialRampToValueAtTime(0.001, at + 0.09);
          oscillator.connect(gain).connect(context!.destination);
          active.add(oscillator);
          oscillator.onended = () => { active.delete(oscillator); oscillator.disconnect(); gain.disconnect(); };
          oscillator.start(at);
          oscillator.stop(at + 0.1);
        });
      } catch { /* Sound is best effort, including browser/device failures. */ }
    },
    dispose() {
      enabled = false;
      stop();
      if (context) { try { void context.close().catch(() => {}); } catch { /* Closed context. */ } }
      context = null;
    },
  };
}
