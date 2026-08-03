import { useEffect, useState } from "react";

export default function DesktopControls() {
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    setDesktop(Boolean(window.__TAURI_INTERNALS__));
  }, []);

  const act = async (action) => {
    if (!window.__TAURI_INTERNALS__) return;
    const { getCurrentWindow } = await import("@tauri-apps/api/window");
    const appWindow = getCurrentWindow();
    if (action === "minimize") await appWindow.minimize();
    if (action === "maximize") await appWindow.toggleMaximize();
    if (action === "close") await appWindow.close();
  };

  if (!desktop) return null;

  return (
    <div className="desktop-controls" aria-label="Application window controls">
      <button onClick={() => act("minimize")} aria-label="Minimize ORACLE">—</button>
      <button onClick={() => act("maximize")} aria-label="Maximize ORACLE">□</button>
      <button onClick={() => act("close")} aria-label="Close ORACLE">×</button>
    </div>
  );
}
