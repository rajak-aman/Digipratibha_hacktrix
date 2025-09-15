import { useEffect, useRef } from "react";

export function Block({ block, onUpdate }) {
  switch (block.type) {
    case "hero":
      return <Hero data={block.data} onUpdate={onUpdate} />;
    case "heading":
      return <Heading data={block.data} onUpdate={onUpdate} />;
    case "text":
      return <RichText data={block.data} onUpdate={onUpdate} />;
    case "image":
      return <ImageBlock data={block.data} onUpdate={onUpdate} />;
    case "about":
      return <About data={block.data} onUpdate={onUpdate} />;
    case "projects":
      return <Projects data={block.data} onUpdate={onUpdate} />;
    case "contact":
      return <Contact data={block.data} onUpdate={onUpdate} />;
    case "divider":
      return <div className="h-px bg-gray-200" />;
    default:
      return null;
  }
}

function placeCaretAtEnd(el) {
  if (!el) return;
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

function Editable({ value, onChange, as: Tag = "div", className = "", style }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && ref.current.innerText !== value) {
      ref.current.innerText = value;
    }
  }, [value]);

  return (
    <Tag
      ref={ref}
      className={className}
      style={style}
      contentEditable
      suppressContentEditableWarning
      onFocus={() => placeCaretAtEnd(ref.current)}
      onBlur={(e) => onChange?.(e.target.innerText)}
    >
      {value}
    </Tag>
  );
}

function Hero({ data = {}, onUpdate }) {
  const title = data.title || "Your Name";
  const subtitle = data.subtitle || "Student | Developer | Designer";
  return (
    <div style={{ textAlign: data.align || 'center' }}>
      <Editable value={title} className="font-bold" style={{ fontSize: (data.fontSize || 32) }} onChange={(v) => onUpdate?.({ title: v })} />
      <Editable value={subtitle} className="text-gray-600 mt-1" onChange={(v) => onUpdate?.({ subtitle: v })} />
    </div>
  );
}

function About({ data = {}, onUpdate }) {
  const body =
    data.body ||
    "I am passionate about building useful products and learning new technologies.";
  return <Editable value={body} className="leading-7" as="p" onChange={(v) => onUpdate?.({ body: v })} />;
}

function Projects({ data = {}, onUpdate }) {
  const items = data.items || [
    { title: "Project Alpha", desc: "A web app built with React." },
    { title: "Project Beta", desc: "An API service deployed on cloud." },
  ];
  return (
    <div className="grid gap-3">
      {items.map((it, i) => (
        <div key={i} className="rounded border p-3">
          <Editable value={it.title} className="font-semibold" onChange={(v) => { const next = [...items]; next[i] = { ...next[i], title: v }; onUpdate?.({ items: next }); }} />
          <Editable value={it.desc} className="text-gray-600" onChange={(v) => { const next = [...items]; next[i] = { ...next[i], desc: v }; onUpdate?.({ items: next }); }} />
        </div>
      ))}
    </div>
  );
}

function Contact({ data = {}, onUpdate }) {
  const email = data.email || "you@example.com";
  return (
    <div>
      <div className="text-gray-600">Email</div>
      <Editable value={email} className="font-semibold" onChange={(v) => onUpdate?.({ email: v })} />
    </div>
  );
}

import ResizableBox from "@/features/builder/ResizableBox";

function Heading({ data = {}, onUpdate }) {
  const text = data.text || "Section Heading";
  return <Editable value={text} className="font-semibold" style={{ fontSize: (data.fontSize || 24), textAlign: data.align || 'left' }} onChange={(v) => onUpdate?.({ text: v })} />;
}

function RichText({ data = {}, onUpdate }) {
  const text = data.text || "Double‑click to edit rich text.";
  return <Editable value={text} className="leading-7" as="p" style={{ textAlign: data.align || 'left', fontSize: data.fontSize || 16 }} onChange={(v) => onUpdate?.({ text: v })} />;
}

function ImageBlock({ data = {}, onUpdate }) {
  const src = data.src || "";
  const width = data.width || 480;
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <input
          type="text"
          value={src}
          onChange={(e) => onUpdate?.({ src: e.target.value })}
          placeholder="Image URL or leave empty and upload"
          className="h-9 w-full rounded-md border px-3"
        />
        <label className="text-sm">
          <span className="sr-only">Upload</span>
          <input type="file" accept="image/*" onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            const reader = new FileReader();
            reader.onload = () => onUpdate?.({ src: reader.result });
            reader.readAsDataURL(f);
          }} />
        </label>
      </div>
      {src ? (
        <ResizableBox width={width} onResize={(s) => onUpdate?.({ width: s.width })}>
          <img src={src} alt="" className="block w-full h-auto" />
        </ResizableBox>
      ) : (
        <div className="rounded border border-dashed p-6 text-center text-gray-500">Add an image URL or upload a file</div>
      )}
    </div>
  );
}

export const TEMPLATES = {
  classic: [
    { id: "hero-1", type: "hero", data: {} },
    { id: "heading-1", type: "heading", data: { text: "About" } },
    { id: "about-1", type: "about", data: {} },
    { id: "projects-1", type: "projects", data: {} },
    { id: "contact-1", type: "contact", data: {} },
  ],
  minimal: [
    { id: "hero-2", type: "hero", data: { subtitle: "Portfolio" } },
    { id: "image-2", type: "image", data: { src: "", width: 420 } },
    { id: "projects-2", type: "projects", data: {} },
    { id: "about-2", type: "about", data: {} },
    { id: "contact-2", type: "contact", data: {} },
  ],
  bold: [
    { id: "hero-3", type: "hero", data: { title: "Make it Bold" } },
    {
      id: "about-3",
      type: "about",
      data: { body: "Short intro with impact." },
    },
    { id: "projects-3", type: "projects", data: {} },
    { id: "contact-3", type: "contact", data: {} },
  ],
  timeline: [
    { id: "hero-4", type: "hero", data: { subtitle: "Timeline" } },
    {
      id: "projects-4",
      type: "projects",
      data: {
        items: [
          { title: "2025 — Internship", desc: "Built internal tooling." },
          {
            title: "2024 — Hackathon",
            desc: "Won 1st place building an AI app.",
          },
        ],
      },
    },
    { id: "about-4", type: "about", data: {} },
    { id: "contact-4", type: "contact", data: {} },
  ],
};
