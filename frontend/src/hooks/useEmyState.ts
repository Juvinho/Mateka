import { useState, useEffect } from 'react';

export interface EmyState {
  visible: boolean;
  message: string;
  dismissed: boolean;
  showEmy: (msg?: string) => void;
  hideEmy: () => void;
  setMessage: (msg: string) => void;
}

const COOLDOWN_MS = 4 * 60 * 1000; // 4 minutes
const LS_KEY = 'emy_dismiss_cooldown';

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

export function useEmyState(activeHash: string): EmyState {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [dismissed, setDismissed] = useState(false);

  const showEmy = (msg?: string) => {
    const lastTimestamp = parseInt(localStorage.getItem(LS_KEY) || '0', 10);
    const now = Date.now();

    if (now - lastTimestamp >= COOLDOWN_MS || lastTimestamp === 0) {
      if (msg) setMessage(msg);
      setVisible(true);
      setDismissed(false);
    } else if (visible) {
      // Already visible — just update the message
      if (msg) setMessage(msg);
    }
  };

  const hideEmy = () => {
    setVisible(false);
    setDismissed(true);
    localStorage.setItem(LS_KEY, Date.now().toString());
  };

  useEffect(() => {
    const newMessage = pickMessage(activeHash);
    showEmy(newMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHash]);

  return {
    visible,
    message,
    dismissed,
    showEmy,
    hideEmy,
    setMessage,
  };
}
