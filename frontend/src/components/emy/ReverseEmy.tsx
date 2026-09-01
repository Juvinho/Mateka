import { useState } from 'react';
import { useNotebook } from '../../hooks/useNotebook';
import { EmyAvatar } from './EmyAvatar';
import negativeEmyImg from '../../assets/mascot/negative-emy.png';

/**
 * Mii-chan — the quieter companion who keeps the smart notebook.
 * Mounted by App.tsx only inside sections (module hubs, lessons), and only
 * once a module's first-time intro has been seen (see `showMii` in App.tsx).
 * Clicking her avatar toggles the notebook open/closed; a speech bubble
 * prompt can be independently toggled.
 */
export function ReverseEmy() {
  const { toggle, isOpen } = useNotebook();
  const [bubbleVisible, setBubbleVisible] = useState(true);

  const toggleBubble = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBubbleVisible(!bubbleVisible);
  };

  return (
    <div className="reverse-emy-callout">
      {bubbleVisible && !isOpen && (
        <div className="reverse-emy-callout__bubble">
          <button
            className="emy-callout__close"
            onClick={toggleBubble}
            aria-label="Fechar mensagem da Mii-chan"
          >
            &times;
          </button>
          Oi, sou a Mii-chan! Deixe suas anotações aqui. 📝
        </div>
      )}
      <button
        className="emy-callout__avatar-btn"
        onClick={toggle}
        aria-label={isOpen ? 'Fechar Caderno Virtual' : 'Abrir Caderno Virtual'}
      >
        <EmyAvatar size="medium" imgSrc={negativeEmyImg} className="reverse-emy-avatar" alt="Mii-chan" />
      </button>
    </div>
  );
}
