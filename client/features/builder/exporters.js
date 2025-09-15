import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { renderToStaticMarkup } from "react-dom/server";
import { Block } from "@/features/builder/blocks";
import React from "react";

export async function captureCanvasToPdf(el) {
  if (!el) return;
  const controls = Array.from(el.querySelectorAll('.builder-controls'));
  const prev = controls.map((n) => n.style.display);
  controls.forEach((n) => (n.style.display = 'none'));
  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });
  controls.forEach((n, i) => (n.style.display = prev[i] || ''));
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
  const w = canvas.width * ratio;
  const h = canvas.height * ratio;
  const x = (pageWidth - w) / 2;
  const y = 40;
  pdf.addImage(imgData, "PNG", x, y, w, h);
  pdf.save("portfolio.pdf");
  try {
    const s = JSON.parse(localStorage.getItem("dp_stats")) || {};
    s.pdfExports = (s.pdfExports || 0) + 1;
    localStorage.setItem("dp_stats", JSON.stringify(s));
  } catch {}
  try {
    const { recordActivity } = await import("@/lib/activity");
    recordActivity("export_pdf");
  } catch {}
}

export function blocksToHtml(blocks) {
  const html = renderToStaticMarkup(
    React.createElement(
      "div",
      {
        style: {
          fontFamily: "Inter, system-ui, Arial, sans-serif",
          color: "#0f172a",
        },
      },
      blocks.map((b) => React.createElement(Block, { key: b.id, block: b })),
    ),
  );
  const doc = `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>Portfolio</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet"><style>body{max-width:800px;margin:40px auto;padding:0 20px;line-height:1.6}</style></head><body>${html}</body></html>`;
  return doc;
}

export function downloadHtml(blocks) {
  const doc = blocksToHtml(blocks);
  const blob = new Blob([doc], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "portfolio.html";
  a.click();
  try {
    const s = JSON.parse(localStorage.getItem("dp_stats")) || {};
    s.htmlDownloads = (s.htmlDownloads || 0) + 1;
    localStorage.setItem("dp_stats", JSON.stringify(s));
  } catch {}
  try {
    import("@/lib/activity").then(({ recordActivity }) => recordActivity("download_html"));
  } catch {}
}
