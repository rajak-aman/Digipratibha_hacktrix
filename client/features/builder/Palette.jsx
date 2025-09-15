import { useI18n } from "@/i18n/i18n";
const items = [
  { type: "hero", key: "block_hero" },
  { type: "heading", key: "block_heading" },
  { type: "text", key: "block_text" },
  { type: "image", key: "block_image" },
  { type: "projects", key: "block_projects" },
  { type: "about", key: "block_about" },
  { type: "contact", key: "block_contact" },
  { type: "divider", key: "block_divider" },
];

export function Palette({ onAdd }) {
  const { t } = useI18n();
  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      {items.map((it) => (
        <button
          key={it.type}
          onClick={() => onAdd(it.type)}
          draggable
          onDragStart={(e) => e.dataTransfer.setData("text/plain", it.type)}
          className="h-9 rounded-md bg-white/10 text-white hover:bg-white/20 text-sm"
        >
          + {t(it.key)}
        </button>
      ))}
    </div>
  );
}
