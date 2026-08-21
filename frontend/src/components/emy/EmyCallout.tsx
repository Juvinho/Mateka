import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { EmyAvatar } from './EmyAvatar';

interface EmyCalloutProps {
  activeHash: string;
}

function pickMessage(activeHash: string): string {
  if (activeHash === '#hero' || activeHash === '' || activeHash === '#') {
    return 'Olá! Eu sou a Emy-chan 💜 Bem-vindo ao Matéka!';
  }
  if (activeHash === '#modulos' || activeHash.startsWith('#modulos/')) {
    return 'Bora estudar! Você está indo muito bem! 🔥';
  }
  if (activeHash === '#basicos') {
    return 'Conceitos básicos são a base de tudo! 📐';
  }
  if (activeHash === '#conteudos') {
    return 'Escolha um módulo e comece sua jornada! ✨';
  }
  if (activeHash.startsWith('#aula-')) {
    return 'Foca na aula! Qualquer dúvida, estou aqui 📚';
  }
  if (activeHash.startsWith('#exercicio-')) {
    return 'Hora de praticar! Você consegue! 💪';
  }
  if (activeHash.startsWith('#endless-')) {
    return 'Modo infinito! Vai com tudo! 🚀';
  }
  return 'Estou aqui se precisar de ajuda! 📚';
}

/**
 * Emy-chan's fixed bottom-right callout.
 *
 * The AVATAR is always visible — it never unmounts or hides. This ensures Emy-chan
 * is a permanent global UI element regardless of route, navigation, or user actions.
 *
 * The SPEECH BUBBLE is independently toggleable:
 *   - Clicking the avatar toggles it open/closed.
 *   - Clicking × closes the bubble (Emy's avatar stays visible).
 *   - The bubble message updates whenever the active route changes.
 *
 * Rendered into document.body via a portal so `position: fixed` always resolves
 * relative to the real viewport, even when an ancestor has a CSS filter/transform.
 */
export function EmyCallout({ activeHash }: EmyCalloutProps) {
  const [bubbleOpen, setBubbleOpen] = useState(true);
  const message = pickMessage(activeHash);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const prevHashRef = useRef(activeHash);

  // Animate bubble in on mount
  useEffect(() => {
    const el = bubbleRef.current;
    if (!el || !bubbleOpen) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 10, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(1.4)' },
    );
  // Only on first mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-open the bubble when navigating to a new route
  useEffect(() => {
    if (activeHash === prevHashRef.current) return;
    prevHashRef.current = activeHash;
    setBubbleOpen(true);
  }, [activeHash]);

  // Animate bubble in when it opens (after being closed by the user)
  useEffect(() => {
    const el = bubbleRef.current;
    if (!el || !bubbleOpen) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 10, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'back.out(1.4)' },
    );
  }, [bubbleOpen]);

  const closeBubble = () => {
    const el = bubbleRef.current;
    if (el) {
      gsap.to(el, {
        opacity: 0,
        y: 8,
        scale: 0.95,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => setBubbleOpen(false),
      });
    } else {
      setBubbleOpen(false);
    }
  };

  const toggleBubble = () => {
    if (bubbleOpen) {
      closeBubble();
    } else {
      setBubbleOpen(true);
    }
  };

  return createPortal(
    <div className="emy-callout">
      {bubbleOpen && (
        <div ref={bubbleRef} className="emy-callout__bubble">
          <button
            className="emy-callout__close"
            onClick={closeBubble}
            aria-label="Fechar mensagem da Emy"
          >
            &times;
          </button>
          {message}
        </div>
      )}
      <button
        className="emy-callout__avatar-btn"
        onClick={toggleBubble}
        aria-label={bubbleOpen ? 'Ocultar mensagem da Emy-chan' : 'Ver mensagem da Emy-chan'}
      >
        <EmyAvatar size="medium" />
      </button>
    </div>,
    document.body,
  );
}
