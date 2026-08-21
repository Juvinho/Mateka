type NotebookListener = (content: string, isOpen: boolean) => void;

const STORAGE_KEY = 'mateka:virtual-notebook';

let content = '';
try {
  content = localStorage.getItem(STORAGE_KEY) || '';
} catch {
  // Ignore localStorage errors (e.g. private browsing with storage disabled)
}

let isOpen = false;
const listeners = new Set<NotebookListener>();

export const notebookStore = {
  getContent: () => content,
  getIsOpen: () => isOpen,
  setContent: (newContent: string) => {
    content = newContent;
    try {
      localStorage.setItem(STORAGE_KEY, content);
    } catch {
      // Ignore errors
    }
    notebookStore.notify();
  },
  setIsOpen: (newIsOpen: boolean) => {
    isOpen = newIsOpen;
    notebookStore.notify();
  },
  subscribe: (listener: NotebookListener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  notify: () => {
    listeners.forEach((l) => l(content, isOpen));
  },
};
