import { useState } from 'react';
import { useNotebook } from '../../hooks/useNotebook';
import { EmyAvatar } from './EmyAvatar';
import negativeEmyImg from '../../assets/mascot/negative-emy.png';

/**
 * Emy-Dark — the dark/red counterpart of Emy-chan.
 * Fixed to the bottom-left corner, she acts as the gateway to the Virtual Notebook.
 * Clicking her avatar toggles the notebook open/closed.
 * A speech bubble prompt can be independently toggled.
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
            aria-label="Fechar mensagem da Emy-Dark"
          >
            &times;
          </button>
          Mii Aqui...Deixe suas anotações bem aqui.
        </div>
      )}
      <button
        className="emy-callout__avatar-btn"
        onClick={toggle}
        aria-label={isOpen ? 'Fechar Caderno Virtual' : 'Abrir Caderno Virtual'}
      >
        <EmyAvatar size="medium" imgSrc={negativeEmyImg} className="reverse-emy-avatar" />
      </button>
    </div>
  );
}
