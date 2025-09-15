import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Block } from "@/features/builder/blocks";

export function DraggableBlock({ block, onRemove, onUpdate, onSelect, selected }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`rounded-md border ${selected? 'border-fuchsia-400 ring-2 ring-fuchsia-300/40' : 'border-gray-200'} bg-white`}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b builder-controls">
        <div className="text-xs font-medium text-gray-500">
          {block.type.toUpperCase()}
        </div>
        <div className="flex items-center gap-2">
          <button
            {...listeners}
            {...attributes}
            className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
          >
            Drag
          </button>
          <button
            onClick={onRemove}
            className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
          >
            Remove
          </button>
        </div>
      </div>
      <div className="p-4">
        <Block block={block} onUpdate={onUpdate} />
      </div>
    </div>
  );
}
