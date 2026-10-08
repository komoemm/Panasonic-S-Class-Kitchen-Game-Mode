import { useEffect, useRef } from 'react';

export function useModalFocus(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!open || !ref.current) return;
    const dialog = ref.current;
    const opener = document.activeElement as HTMLElement | null;
    const focusables = () => [...dialog.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input, textarea, select, [tabindex="0"]')]
      .filter(e => e.getClientRects().length > 0);
    (focusables()[0] ?? dialog).focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); closeRef.current(); return; }
      if (event.key !== 'Tab') return;
      const items = focusables(), first = items[0], last = items[items.length - 1];
      if (!first) { event.preventDefault(); dialog.focus(); }
      else if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    };
    const onFocus = (event: FocusEvent) => { if (!dialog.contains(event.target as Node)) (focusables()[0] ?? dialog).focus(); };
    document.addEventListener('keydown', onKey); document.addEventListener('focusin', onFocus);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('focusin', onFocus); if (opener?.isConnected) opener.focus(); };
  }, [open]);
  return ref;
}
