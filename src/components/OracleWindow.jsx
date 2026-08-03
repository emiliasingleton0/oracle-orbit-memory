import { useEffect, useRef, useState } from "react";

export default function OracleWindow({
  title,
  children,
  initialX = 120,
  initialY = 120,
  width = 360,
  zIndex = 50,
  onFocus,
  onClose,
  onPositionChange,
  ghost = false
}) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    onPositionChange?.({
      x: position.x,
      y: position.y,
      width: maximized ? window.innerWidth - 32 : width,
      minimized,
      maximized
    });
  }, [position, width, minimized, maximized, onPositionChange]);

  const beginDrag = (event) => {
    if (event.button !== 0 || maximized) return;
    onFocus?.();

    const startX = event.clientX;
    const startY = event.clientY;
    const original = { ...position };

    const move = (moveEvent) => {
      setPosition({
        x: Math.max(0, original.x + moveEvent.clientX - startX),
        y: Math.max(46, original.y + moveEvent.clientY - startY)
      });
    };

    const end = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", end);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
  };

  const style = maximized
    ? {
        transform: "translate(16px, 60px)",
        width: "calc(100vw - 32px)",
        maxHeight: "calc(100vh - 110px)",
        zIndex
      }
    : {
        transform: `translate(${position.x}px, ${position.y}px)`,
        width,
        zIndex
      };

  return (
    <section
      ref={ref}
      className={`oracle-window ${ghost ? "ghost-window" : ""} ${minimized ? "is-minimized" : ""} ${maximized ? "is-maximized" : ""}`}
      style={style}
      onMouseDown={onFocus}
    >
      <div className="window-titlebar" onMouseDown={beginDrag}>
        <span>{title}</span>

        <div className="window-controls">
          <button
            type="button"
            aria-label={minimized ? "Restore window" : "Minimize window"}
            onClick={(event) => {
              event.stopPropagation();
              setMinimized((value) => !value);
            }}
          >
            _
          </button>

          <button
            type="button"
            aria-label={maximized ? "Restore window size" : "Maximize window"}
            onClick={(event) => {
              event.stopPropagation();
              setMaximized((value) => !value);
              setMinimized(false);
            }}
          >
            □
          </button>

          <button
            type="button"
            aria-label="Close window"
            onClick={(event) => {
              event.stopPropagation();
              onClose?.();
            }}
          >
            ×
          </button>
        </div>
      </div>

      {!minimized && <div className="window-body">{children}</div>}
    </section>
  );
}
