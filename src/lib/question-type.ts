import {
  ToggleLeft, // Point based
  AlignLeft, // Text field
  Upload, // File upload
  TextCursor, // Fill the blank
  Mic, // Audio response
  Video, // Video response
  ChevronsDown, // Dropdown
  ListOrdered, // Ranking
  Sliders, // Slider scale
  Calendar, // Date picker
  Clock, // Time picker
  Image, // Image choice
  Combine, // Matching pairs
  Grid, // Matrix
  MousePointer, // Hotspot
  SquarePi, // Formula input
  Code, ThumbsUp, // Likert scale
  FileText, // Open-ended
  Braces, // Code snippet
  PenTool,
  HandIcon, CopyCheck
} from "lucide-react";

export const questionTypes = {
  "multiple-choice": {
    value: "multiple-choice",
    label: "Multiple Choice",
    icon: CopyCheck,
    group: "choice",
    isHidden: false
  },
  "yes-or-no": {
    value: "yes-or-no",
    label: "Yes or No",
    icon: ToggleLeft,
    group: "choice",
    isHidden: false
  },
  "text-field": {
    value: "text-field",
    label: "Text Field",
    icon: AlignLeft,
    group: "input",
    isHidden: true
  },
  "file-upload": {
    value: "file-upload",
    label: "File Upload",
    icon: Upload,
    group: "input",
    isHidden: true
  },
  "fill-the-blank": {
    value: "fill-the-blank",
    label: "Fill the Blank",
    icon: TextCursor,
    group: "input",
    isHidden: true
  },
  "audio-response": {
    value: "audio-response",
    label: "Audio Response",
    icon: Mic,
    group: "input",
    isHidden: true
  },
  "video-response": {
    value: "video-response",
    label: "Video Response",
    icon: Video,
    group: "input",
    isHidden: true
  },
  "dropdown": {
    value: "dropdown",
    label: "Dropdown",
    icon: ChevronsDown,
    group: "choice",
    isHidden: true
  },
  "ranking": {
    value: "ranking",
    label: "Ranking",
    icon: ListOrdered,
    group: "scaleStructure",
    isHidden: true
  },
  "slider-scale": {
    value: "slider-scale",
    label: "Slider Scale",
    icon: Sliders,
    group: "scaleStructure",
    isHidden: true
  },
  "date-picker": {
    value: "date-picker",
    label: "Date Picker",
    icon: Calendar,
    group: "scaleStructure",
    isHidden: true
  },
  "time-picker": {
    value: "time-picker",
    label: "Time Picker",
    icon: Clock,
    group: "scaleStructure",
    isHidden: true
  },
  "image-choice": {
    value: "image-choice",
    label: "Image Choice",
    icon: Image,
    group: "choice",
    isHidden: true
  },
  "matching-pairs": {
    value: "matching-pairs",
    label: "Matching Pairs",
    icon: Combine,
    group: "scaleStructure",
    isHidden: true
  },
  "matrix": {
    value: "matrix",
    label: "Matrix",
    icon: Grid,
    group: "scaleStructure",
    isHidden: true
  },
  "hotspot": {
    value: "hotspot",
    label: "Hotspot",
    icon: MousePointer,
    group: "advanced",
    isHidden: true
  },
  "formula-input": {
    value: "formula-input",
    label: "Formula Input",
    icon: SquarePi,
    group: "advanced",
    isHidden: true
  },
  "drag-and-drop": {
    value: "drag-and-drop",
    label: "Drag and Drop",
    icon: HandIcon,
    group: "advanced",
    isHidden: true
  },
  "likert-scale": {
    value: "likert-scale",
    label: "Likert Scale",
    icon: ThumbsUp,
    group: "scaleStructure",
    isHidden: true
  },
  "open-ended": {
    value: "open-ended",
    label: "Open Ended",
    icon: FileText,
    group: "input",
    isHidden: true
  },
  "code-snippet": {
    value: "code-snippet",
    label: "Code Snippet",
    icon: Braces,
    group: "advanced",
    isHidden: true
  },
  "math-formula": {
    value: "math-formula",
    label: "Math Formula",
    icon: SquarePi,
    group: "advanced",
    isHidden: true
  },
  "drawing": {
    value: "drawing",
    label: "Drawing",
    icon: PenTool,
    group: "advanced",
    isHidden: true
  },
  "code-editor": {
    value: "code-editor",
    label: "Code Editor",
    icon: Code,
    group: "advanced",
    isHidden: true
  }
};

// Define question types
export const QUESTION_TYPES = [
  "multiple-choice",
  "yes-or-no",
  "text-field",
  "file-upload",
  "fill-the-blank",
  "audio-response",
  "video-response",
  "dropdown",
  "matching-pairs",
  "slider-scale",
  // "ranking",
  // "hotspot",
  // "drag-and-drop",
  // "matrix",
  // "likert-scale",
  // "open-ended",
  // "code-snippet",
  // "math-formula",
  // "drawing"
] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number]; 