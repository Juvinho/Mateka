import { useState, useEffect, useCallback } from 'react';
import { notebookStore } from '../data/notebookStore';

export function useNotebook() {
  const [content, setContentState] = useState(notebookStore.getContent());
  const [isOpen, setIsOpenState] = useState(notebookStore.getIsOpen());

  // Subscribe to store changes so all components stay in sync
  useEffect(() => {
    const unsubscribe = notebookStore.subscribe((newContent, newIsOpen) => {
      setContentState(newContent);
      setIsOpenState(newIsOpen);
    });
    return unsubscribe;
  }, []);

  // Add/remove a body class so other elements can react to the open state via CSS
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('notebook-is-open');
    } else {
      document.body.classList.remove('notebook-is-open');
    }
    return () => {
      document.body.classList.remove('notebook-is-open');
    };
  }, [isOpen]);

  const setContent = useCallback((newContent: string) => {
    notebookStore.setContent(newContent);
  }, []);

  const setIsOpen = useCallback((newIsOpen: boolean) => {
    notebookStore.setIsOpen(newIsOpen);
  }, []);

  const toggle = useCallback(() => {
    notebookStore.setIsOpen(!notebookStore.getIsOpen());
  }, []);

  return {
    content,
    isOpen,
    setContent,
    setIsOpen,
    toggle,
  };
}
