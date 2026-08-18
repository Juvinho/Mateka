import { useEffect, useState } from "react";
import styles from "./XpToast.module.css";

export function XpToast({ amount, onDone }: { amount: number; onDone: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDone();
    }, 1200);
    return () => clearTimeout(timer);
  }, [onDone]);

  if (!visible) return null;

  return <div className={styles.toast}>+{amount} XP</div>;
}
