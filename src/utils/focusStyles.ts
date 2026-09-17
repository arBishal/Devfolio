// Shared keyboard-focus affordances (focus-visible only — never on mouse click).
//
// FOCUS_CARET: a themed "›" prompt caret that appears before a text control on
// keyboard focus. Space is reserved only while focused, so unfocused items keep
// no leading gap. inline-block keeps any hover underline off the caret; 1.3em
// scales it with the control's own text. Pair with the element's hover styles.
//
// Use FOCUS_CARET for text buttons/links. For controls a caret can't sit on
// cleanly — native <select>, icon-only buttons, and justify-between rows where a
// caret would disrupt layout — use FOCUS_TINT so the focus cue keeps the same
// warning color without a caret.

export const FOCUS_CARET =
  "focus-visible:outline-none " +
  "focus-visible:before:content-['›'] focus-visible:before:mr-1 focus-visible:before:text-t-warning " +
  "focus-visible:before:inline-block focus-visible:before:text-[1.3em] focus-visible:before:font-bold " +
  "focus-visible:before:leading-none focus-visible:before:align-middle";

export const FOCUS_TINT = "focus-visible:outline-none focus-visible:text-t-warning";
