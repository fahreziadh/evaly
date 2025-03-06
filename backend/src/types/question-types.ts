// Define question types
export const QUESTION_TYPES = [
  "single-choice",
  "multiple-choice",
  "yes-or-no",
  "point-based",
  "text-field",
  "file-upload",
  "fill-the-blank",
  "audio-response",
  "video-response",
  "dropdown",
  "matching-pairs",
  "slider-scale",
  "ranking",
  "hotspot",
  "drag-and-drop",
  "matrix",
  "likert-scale",
  "open-ended",
  "code-snippet",
  "math-formula",
  "drawing"
] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number]; 