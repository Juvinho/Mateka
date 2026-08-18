import type { ContextItem } from "../../data/types";
import { MatrixGrid } from "./MatrixGrid";
import styles from "./ContextMatrices.module.css";

export function ContextMatrices({ items }: { items?: ContextItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className={styles.row}>
      {items.map((item) => (
        <div key={item.label} className={styles.item}>
          <span className={styles.label}>{item.label} =</span>
          <MatrixGrid values={item.matrix} readOnly ariaLabel={`matriz ${item.label}`} />
        </div>
      ))}
    </div>
  );
}
