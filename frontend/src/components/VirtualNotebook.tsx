import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { useNotebook } from '../hooks/useNotebook';

/**
 * Virtual Notebook — "Caderno Obscuro"
 *
 * A fixed panel (bottom-left, above Emy-Dark) where users can jot notes
 * during lessons and exercises. Content auto-saves to localStorage via
 * notebookStore and persists across page refreshes.
 *
 * Open/close is controlled by the global notebookStore (toggled by ReverseEmy).
 * GSAP handles the open/close animation; the panel starts hidden.
 *
 * Rendered into document.body via a portal so that `position: fixed` always
 * resolves relative to the real viewport, even when an ancestor has a
 * CSS filter/transform applied (e.g. the app-content loading transition).
 */
export function VirtualNotebook() {
  const { isOpen, content, setContent, setIsOpen } = useNotebook();
  const containerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // On first render, set initial state without animation
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (!isOpen) {
        gsap.set(el, { display: 'none', opacity: 0, scale: 0.8, x: -40, y: 40 });
      }
      return;
    }

    if (isOpen) {
      gsap.killTweensOf(el);
      gsap.fromTo(
        el,
        { display: 'flex', opacity: 0, scale: 0.8, x: -40, y: 40 },
        { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.4, ease: 'back.out(1.2)' },
      );
    } else {
      gsap.killTweensOf(el);
      gsap.to(el, {
        opacity: 0,
        scale: 0.8,
        x: -40,
        y: 40,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(el, { display: 'none' });
        },
      });
    }
  }, [isOpen]);

  return createPortal(
    <div ref={containerRef} className="virtual-notebook">
      <div className="virtual-notebook__header">
        <h3>Caderno Obscuro</h3>
        <button
          type="button"
          className="virtual-notebook__close"
          onClick={() => setIsOpen(false)}
          aria-label="Fechar caderno"
        >
          &times;
        </button>
      </div>
      <div className="virtual-notebook__body">
        <textarea
          className="virtual-notebook__textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Digite suas anotações aqui... Tudo será salvo automaticamente no abismo."
          spellCheck={false}
        />
      </div>
    </div>,
    document.body,
  );
}
