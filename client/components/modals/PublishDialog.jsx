import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useI18n } from "@/i18n/i18n";

export default function PublishDialog({ open, onOpenChange }) {
  const { t } = useI18n();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("deploy_title")}</DialogTitle>
          <DialogDescription>
            {t("deploy_desc")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm text-white/80">
          <p>{t("deploy_desc")}</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <button onClick={() => alert('To deploy: Click “Open MCP popover”, connect Netlify, then tell the assistant “Deploy to Netlify”.')} className="h-10 rounded-md bg-green-500/20 text-green-300 hover:bg-green-500/30">{t("deploy_netlify_btn")}</button>
            <button onClick={() => alert('To deploy: Click “Open MCP popover”, connect Vercel, then tell the assistant “Deploy to Vercel”.')} className="h-10 rounded-md bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">{t("deploy_vercel_btn")}</button>
          </div>
          <ol className="list-decimal pl-5 space-y-1">
            <li>{t("deploy_step1")}</li>
            <li>{t("deploy_step2")}</li>
          </ol>
          <p className="text-white/60">{t("tip_export")}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
