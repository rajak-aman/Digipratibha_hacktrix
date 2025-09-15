import { TEMPLATES } from "@/features/builder/blocks";

export function loadInitialBlocks() {
  const saved = localStorage.getItem("dp_blocks");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {}
  }
  return JSON.parse(JSON.stringify(TEMPLATES.classic));
}
