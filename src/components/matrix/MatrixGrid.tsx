import styles from "./MatrixGrid.module.css";

interface MatrixGridProps {
  values: Array<Array<number | null>>;
  editableMask?: boolean[][];
  onChange?: (row: number, col: number, value: number | null) => void;
  onFocusCell?: (row: number, col: number) => void;
  highlightRow?: number | null;
  highlightCol?: number | null;
  readOnly?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}

export function MatrixGrid({
  values,
  editableMask,
  onChange,
  onFocusCell,
  highlightRow = null,
  highlightCol = null,
  readOnly = false,
  disabled = false,
  ariaLabel,
}: MatrixGridProps) {
  const cols = values[0]?.length ?? 0;

  return (
    <div
      className={styles.wrapper}
      role="group"
      aria-label={ariaLabel}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(2.75rem, 1fr))` }}
    >
      {values.map((row, r) =>
        row.map((value, c) => {
          const isEditable = !readOnly && (editableMask ? editableMask[r][c] : value === null);
          const isHighlighted = highlightRow === r || highlightCol === c;
          const classNames = [styles.cell, isEditable ? styles.editable : "", isHighlighted ? styles.highlighted : ""]
            .filter(Boolean)
            .join(" ");

          if (isEditable) {
            return (
              <input
                key={`${r}-${c}`}
                className={classNames}
                type="number"
                inputMode="decimal"
                value={value ?? ""}
                disabled={disabled}
                onFocus={() => onFocusCell?.(r, c)}
                onChange={(e) => {
                  const raw = e.target.value;
                  onChange?.(r, c, raw === "" ? null : Number(raw));
                }}
                aria-label={`linha ${r + 1}, coluna ${c + 1}`}
              />
            );
          }

          return (
            <span key={`${r}-${c}`} className={classNames}>
              {value ?? ""}
            </span>
          );
        }),
      )}
    </div>
  );
}
