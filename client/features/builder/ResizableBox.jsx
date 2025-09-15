import { useEffect, useRef, useState } from "react";

export default function ResizableBox({ width = 300, height = 'auto', min = 100, max = 1200, aspect = null, onResize, className = '', children }) {
  const ref = useRef(null);
  const [w, setW] = useState(width);
  const [h, setH] = useState(typeof height === 'number' ? height : 0);

  useEffect(() => setW(width), [width]);
  useEffect(() => { if (typeof height === 'number') setH(height); }, [height]);

  useEffect(() => { onResize?.({ width: w, height: h || 'auto' }); }, [w, h]);

  function onMouseDown(e) {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = ref.current.offsetWidth;
    const startH = ref.current.offsetHeight;
    function move(ev) {
      let newW = Math.min(max, Math.max(min, startW + (ev.clientX - startX)));
      let newH = startH + (ev.clientY - startY);
      if (aspect) newH = newW / aspect;
      setW(newW);
      setH(newH);
    }
    function up() { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); }
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  }

  return (
    <div ref={ref} className={`relative inline-block align-top ${className}`} style={{ width: w, height: h || 'auto', minHeight: 24 }}>
      {children}
      <div onMouseDown={onMouseDown} className="absolute bottom-1 right-1 size-4 cursor-se-resize rounded bg-black/30 border border-white/20" />
    </div>
  );
}
