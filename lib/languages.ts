const LANGUAGE_COLORS: Record<string, string> = {
  Kotlin: "#A97BFF",
  Java: "#E76F00",
  TypeScript: "#3178C6",
  JavaScript: "#F1E05A",
  PHP: "#8892BF",
  Python: "#4B8BBE",
  CSS: "#9B6BDF",
  HTML: "#E34C26",
  Go: "#00ADD8",
  Rust: "#DEA584",
  "C#": "#68A063",
  Shell: "#89E051",
  Blade: "#F7523F",
};

const FALLBACK_COLOR = "#a3a3a3";

export function getLanguageColor(language: string | null): string {
  return (language && LANGUAGE_COLORS[language]) || FALLBACK_COLOR;
}
