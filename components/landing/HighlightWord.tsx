import { useState, useEffect, useRef } from "react";

export function HighlightWord({
  children,
  color,
  cursorUrl,
  onClick,
}: {
  children: React.ReactNode;
  color: string;
  cursorUrl: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setDims({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  // Generate a hand-drawn underline path
  const y = dims.h - 4;
  const segments = 12;
  const step = dims.w / segments;
  let d = `M 0 ${y}`;
  for (let i = 1; i <= segments; i++) {
    const jitter = (Math.sin(i * 3.7) * 2.5);
    d += ` Q ${i * step - step / 2} ${y + jitter} ${i * step} ${y + Math.sin(i * 2.1) * 1.5}`;
  }

  const pathLen = dims.w * 1.1;

  const [cursorDataUrl, setCursorDataUrl] = useState("");

  useEffect(() => {
    if (cursorUrl.startsWith("emoji:")) {
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><text y='24' font-size='24'>${cursorUrl.slice(6)}</text></svg>`;
      setCursorDataUrl(`url("data:image/svg+xml,${encodeURIComponent(svg)}") 16 16, pointer`);
    } else {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, 32, 32);
          setCursorDataUrl(`url("${canvas.toDataURL("image/png")}") 16 16, pointer`);
        }
      };
      img.src = cursorUrl;
    }
  }, [cursorUrl]);

  const cursor = cursorDataUrl || "pointer";

  return (
    <span
      ref={ref}
      className="relative inline-block"
      style={{ cursor }}
      onClick={onClick}
    >
      {children}
      {dims.w > 0 && (
        <svg
          className="absolute left-0 bottom-0 w-full pointer-events-none overflow-visible"
          style={{ height: dims.h }}
          preserveAspectRatio="none"
        >
          <path
            ref={pathRef}
            d={d}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={pathLen}
            strokeDashoffset={pathLen}
          >
            <animate
              attributeName="stroke-dashoffset"
              from={pathLen}
              to="0"
              dur="1s"
              fill="freeze"
              begin="0.5s"
            />
          </path>
        </svg>
      )}
    </span>
  );
}
