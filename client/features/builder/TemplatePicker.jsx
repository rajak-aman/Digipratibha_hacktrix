import { TEMPLATES } from "@/features/builder/blocks";
import { useI18n } from "@/i18n/i18n";

export function TemplatePicker({ onApply }) {
  const apply = (key) => onApply(JSON.parse(JSON.stringify(TEMPLATES[key])));
  const { t } = useI18n();
  return (
    <div>
      <h3 className="text-white/80 text-sm mb-2">{t("templates")}</h3>
      <div className="grid grid-cols-2 gap-2">
        {Object.keys(TEMPLATES).map((k) => (
          <button
            key={k}
            onClick={() => apply(k)}
            className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-left text-white/90 hover:bg-white/10"
          >
            <div className="font-medium capitalize">{k}</div>
            <div className="text-xs text-white/60">{t("use_template")}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
