import { useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { DraggableBlock } from "@/features/builder/DraggableBlock";
import { Palette } from "@/features/builder/Palette";
import { TemplatePicker } from "@/features/builder/TemplatePicker";
import { captureCanvasToPdf, downloadHtml } from "@/features/builder/exporters";
import { loadInitialBlocks } from "@/features/builder/state";
import { recordActivity } from "@/lib/activity";
import { blocksToHtml } from "@/features/builder/exporters";

export default function Builder() {
  const [blocks, setBlocks] = useState(() => loadInitialBlocks());
  const [bg, setBg] = useState(() => localStorage.getItem("dp_style_bg") || "#ffffff");
  const [color, setColor] = useState(() => localStorage.getItem("dp_style_color") || "#0f172a");
  const [selected, setSelected] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("dp_blocks", JSON.stringify(blocks));
  }, [blocks]);

  useEffect(() => { localStorage.setItem("dp_style_bg", bg); }, [bg]);
  useEffect(() => { localStorage.setItem("dp_style_color", color); }, [color]);

  useEffect(() => {
    recordActivity("builder_open");
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const ids = useMemo(() => blocks.map((b) => b.id), [blocks]);

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    setBlocks((items) => arrayMove(items, oldIndex, newIndex));
    recordActivity("reorder_block", { from: oldIndex, to: newIndex });
  };

  const addBlock = (type) => {
    const id = `${type}-${Date.now()}`;
    const initial = type === "image" ? { src: "", width: 480 } : {};
    setBlocks((prev) => [...prev, { id, type, data: initial }]);
    recordActivity("add_block", { type });
  };

  const removeBlock = (id) => {
    const blk = blocks.find((b) => b.id === id);
    recordActivity("remove_block", { type: blk?.type });
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const applyTemplate = (templateBlocks) => {
    setBlocks(templateBlocks);
    recordActivity("apply_template");
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#0a0112]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-6">
          <aside className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-white font-semibold">Blocks</h2>
            <Palette onAdd={addBlock} />
            <div className="mt-6">
              <TemplatePicker onApply={applyTemplate} />
            </div>
          </aside>

          <section className="rounded-xl border border-white/10 bg-white/5 p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-semibold">Canvas</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => captureCanvasToPdf(canvasRef.current)}
                  className="h-9 px-3 rounded-md bg-fuchsia-500 text-white hover:bg-fuchsia-400"
                >
                  Export PDF
                </button>
                <button
                  onClick={() => downloadHtml(blocks)}
                  className="h-9 px-3 rounded-md bg-white/10 text-white hover:bg-white/20"
                >
                  Download HTML
                </button>
              </div>
            </div>
            <div
              ref={canvasRef}
              id="portfolio-canvas"
              className="mx-auto max-w-3xl rounded-lg p-8 shadow-xl"
              style={{ background: bg, color }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { const type = e.dataTransfer.getData('text/plain'); if (type) addBlock(type); }}
            >
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={onDragEnd}
              >
                <SortableContext items={ids} strategy={rectSortingStrategy}>
                  <div className="space-y-6">
                    {blocks.map((b) => (
                      <DraggableBlock
                        key={b.id}
                        block={b}
                        onRemove={() => removeBlock(b.id)}
                        onUpdate={(data) =>
                          setBlocks((prev) =>
                            prev.map((x) => (x.id === b.id ? { ...x, data: { ...x.data, ...data } } : x)),
                          )
                        }
                        onSelect={() => setSelected(b.id)}
                        selected={selected === b.id}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </section>

          <aside className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-white font-semibold">Properties</h2>
            <div className="mt-3 space-y-3 text-white/80 text-sm">
              <div>
                <div className="mb-1">Canvas background</div>
                <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-9 w-full rounded-md bg-white/10" />
              </div>
              <div>
                <div className="mb-1">Text color</div>
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-full rounded-md bg-white/10" />
              </div>
              {selected && (
                <div className="pt-2 border-t border-white/10">
                  <div className="font-semibold text-white">Block settings</div>
                  {(() => {
                    const blk = blocks.find((x) => x.id === selected);
                    if (!blk) return null;
                    if (blk.type === 'heading' || blk.type === 'hero') {
                      return (
                        <div className="mt-2 space-y-2">
                          <label className="grid text-sm">
                            <span>Font size</span>
                            <input type="range" min="16" max="48" defaultValue={blk.type==='hero'?32:24} onChange={(e)=>{
                              const size = parseInt(e.target.value,10);
                              const key = blk.type==='hero' ? 'title' : 'text';
                              setBlocks(prev=>prev.map(x=>x.id===blk.id?{...x, data:{...x.data, fontSize:size}}:x));
                            }} />
                          </label>
                          <label className="grid text-sm">
                            <span>Align</span>
                            <select onChange={(e)=> setBlocks(prev=>prev.map(x=>x.id===blk.id?{...x, data:{...x.data, align:e.target.value}}:x))} className="h-9 rounded bg-white/10">
                              <option value="left">Left</option>
                              <option value="center">Center</option>
                              <option value="right">Right</option>
                            </select>
                          </label>
                        </div>
                      );
                    }
                    if (blk.type === 'image') {
                      return (
                        <div className="mt-2 space-y-2">
                          <label className="grid text-sm">
                            <span>Width</span>
                            <input type="range" min="120" max="960" value={blk.data.width||480} onChange={(e)=> setBlocks(prev=>prev.map(x=>x.id===blk.id?{...x, data:{...x.data, width:parseInt(e.target.value,10)}}:x))} />
                          </label>
                        </div>
                      );
                    }
                    return <div className="text-white/70 text-sm mt-2">Select a block to edit its settings.</div>;
                  })()}
                </div>
              )}
            </div>
            <div className="mt-6">
              <h3 className="text-white font-semibold mb-2">Live Preview</h3>
              <iframe title="preview" className="w-full h-72 rounded-md bg-white" srcDoc={blocksToHtml(blocks)} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
