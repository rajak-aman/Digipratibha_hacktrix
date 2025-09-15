import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SUGGESTIONS = [
  "How do I add an image?",
  "How to export PDF?",
  "What does each template include?",
  "How to deploy to Netlify/Vercel?",
];

function respond(q) {
  const t = q.toLowerCase();
  if (t.includes("image")) return "Use the Image block from the left palette. Paste a URL or upload, then drag the corner handle to resize.";
  if (t.includes("export") || t.includes("pdf")) return "Click Export PDF on the canvas toolbar. You can also Download HTML for self‑hosting.";
  if (t.includes("template")) return "There are 4 templates: Classic, Minimal, Bold, and Timeline. Apply one from the left Template picker and customize blocks.";
  if (t.includes("deploy") || t.includes("host") || t.includes("netlify") || t.includes("vercel")) return "Open One‑click Hosting in the header, then Connect Netlify or Vercel via the MCP popover and ask me to deploy.";
  if (t.includes("resize") || t.includes("scale")) return "Grab the small square at the bottom‑right of an element (like images) to resize. Blocks can be reordered by dragging their header.";
  if (t.includes("user") || t.includes("profile")) return "Open Profile from the avatar in the header to update username, photo, bio, links, and more.";
  return "I can help with building, exporting, templates, and deployment. Try asking about images, resizing, hosting, or PDF export.";
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hi! I’m your guide. Ask anything about the builder or site." }]);

  const send = (text) => {
    const q = (text || input).trim();
    if (!q) return;
    const a = respond(q);
    setMessages((m) => [...m, { role: "user", content: q }, { role: "assistant", content: a }]);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-12 px-4 rounded-full bg-fuchsia-500 text-white shadow-lg hover:bg-fuchsia-400"
      >
        Ask AI
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>AI Assistant</DialogTitle>
          </DialogHeader>
          <div className="max-h-[50vh] overflow-auto space-y-3 pr-1">
            {messages.map((m, i) => (
              <div key={i} className={`${m.role === 'assistant' ? 'bg-white/5' : 'bg-fuchsia-500/20'} rounded-md p-3 text-sm text-white/90`}>
                {m.content}
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} className="h-9 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs px-2">
                {s}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="mt-3 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the builder, export, hosting…"
              className="h-10 flex-1 rounded-md bg-white/10 px-3 text-white"
            />
            <button type="submit" className="h-10 px-4 rounded-md bg-fuchsia-500 text-white hover:bg-fuchsia-400">Send</button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
