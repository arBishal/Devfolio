import { useEffect, useId, useRef, useState } from "react";
import { FOCUS_TINT } from "@/utils/focusStyles";
import type { KeyboardEvent } from "react";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string> {
  /** Visible caption above the control; also names it for assistive tech. */
  label: string;
  value: T;
  options: readonly SelectOption<T>[];
  onChange: (value: T) => void;
}

/**
 * Fully theme-driven, accessible single-select — a replacement for native
 * <select> whose popup, unlike a native one, can't be styled to match the
 * active theme. Follows the WAI-ARIA "select-only combobox" pattern: focus
 * stays on the trigger, which owns aria-activedescendant while the listbox
 * is open. The popup opens upward (drop-up) since both instances live at the
 * bottom of the sidebar.
 *
 * Keyboard: ↑/↓ open & move, Home/End jump, Enter/Space select, Esc close,
 * printable keys type-ahead to the first matching label.
 */
export function Select<T extends string>({ label, value, options, onChange }: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  // -1 means "no matching option" (unset/empty list) — kept distinct from index 0
  // so an unknown value is never mis-announced as the first option being selected.
  const selectedIndex = options.findIndex((o) => o.value === value);
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const hasActive = open && activeIndex >= 0 && activeIndex < options.length;

  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const typeahead = useRef({ buffer: "", timer: 0 });

  const baseId = useId();
  const labelId = `${baseId}-label`;
  const valueId = `${baseId}-value`;
  const listId = `${baseId}-list`;
  const optionId = (i: number) => `${baseId}-opt-${i}`;

  const selectedLabel = options[selectedIndex]?.label ?? "";

  const openList = () => {
    setActiveIndex(selectedIndex);
    setOpen(true);
  };
  const close = () => setOpen(false);

  const choose = (i: number) => {
    const opt = options[i];
    if (opt) onChange(opt.value);
    close();
    buttonRef.current?.focus();
  };

  const moveActive = (next: number) => {
    if (options.length === 0) return;
    setActiveIndex(Math.max(0, Math.min(options.length - 1, next)));
  };

  // Realign the highlight if the controlled value changes from outside while
  // the menu is open, so Enter can never commit a stale option. Selection-driven
  // arrow navigation doesn't touch `value`, so it isn't disturbed by this.
  useEffect(() => {
    setActiveIndex(selectedIndex);
  }, [selectedIndex]);

  // Close when a press lands outside the control. pointerdown covers mouse,
  // touch and pen — mousedown alone doesn't fire reliably on touch devices.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Keep the highlighted option in view during keyboard navigation.
  useEffect(() => {
    if (open) optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const typeaheadMatch = (char: string) => {
    const t = typeahead.current;
    window.clearTimeout(t.timer);
    t.buffer += char.toLowerCase();
    t.timer = window.setTimeout(() => { t.buffer = ""; }, 500);
    const idx = options.findIndex((o) => o.label.toLowerCase().startsWith(t.buffer));
    if (idx < 0) return;
    if (open) moveActive(idx);
    else onChange(options[idx].value);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (open) moveActive(activeIndex + 1); else openList();
        break;
      case "ArrowUp":
        e.preventDefault();
        if (open) moveActive(activeIndex - 1); else openList();
        break;
      case "Home":
        if (open) { e.preventDefault(); moveActive(0); }
        break;
      case "End":
        if (open) { e.preventDefault(); moveActive(options.length - 1); }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open) choose(activeIndex); else openList();
        break;
      case "Escape":
        if (open) { e.preventDefault(); close(); }
        break;
      case "Tab":
        if (open) close();
        break;
      default:
        if (e.key.length === 1 && !e.altKey && !e.ctrlKey && !e.metaKey) typeaheadMatch(e.key);
    }
  };

  return (
    <div ref={rootRef} className="space-y-1">
      <span id={labelId} className="block text-t-text/80 text-xs lg:text-sm">{label}</span>
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-labelledby={`${labelId} ${valueId}`}
          aria-activedescendant={hasActive ? optionId(activeIndex) : undefined}
          onClick={() => (open ? close() : openList())}
          onKeyDown={onKeyDown}
          className={`w-full flex items-center justify-between gap-2 bg-transparent text-t-text/80 text-sm border-b border-t-border px-2 py-1 cursor-pointer hover:text-t-text transition-colors ${FOCUS_TINT} focus-visible:border-t-warning`}
        >
          <span id={valueId}>{selectedLabel}</span>
          <svg
            aria-hidden="true" focusable="false"
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={`flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {open && (
          <ul
            id={listId}
            role="listbox"
            aria-labelledby={labelId}
            className="absolute left-0 right-0 bottom-full mb-1 max-h-60 overflow-y-auto rounded-md border border-t-border bg-t-bg shadow-lg py-1 z-[var(--z-nav)]"
          >
            {options.map((opt, i) => {
              const isSelected = i === selectedIndex;
              const isActive = i === activeIndex;
              return (
                <li
                  key={opt.value}
                  ref={(el) => { optionRefs.current[i] = el; }}
                  id={optionId(i)}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => choose(i)}
                  onMouseMove={() => setActiveIndex(i)}
                  className={`flex items-center justify-between gap-2 px-3 py-1.5 text-sm cursor-pointer transition-colors ${isActive ? "bg-t-header-bg" : ""} ${isSelected ? "text-t-accent" : "text-t-text/80"}`}
                >
                  <span>{opt.label}</span>
                  {isSelected && (
                    <svg
                      aria-hidden="true" focusable="false"
                      width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      className="flex-shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
