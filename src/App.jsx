import { useEffect, useMemo, useState } from "react";
import MemoryOrbit from "./components/MemoryOrbit";
import OracleWindow from "./components/OracleWindow";
import PopupCascade from "./components/PopupCascade";
import IndexView from "./components/IndexView";
import MemoryForm from "./components/MemoryForm";
import ControlPanel from "./components/ControlPanel";
import ArchiveBrowser from "./components/ArchiveBrowser";
import AmbientHum from "./components/AmbientHum";
import DesktopControls from "./components/DesktopControls";
import { memories as starterMemories } from "./data/memories";
import { relatedMemories, spotifyEmbedUrl } from "./utils/memoryTools";

const STORAGE_KEY = "oracle-memory-archive-v3";

function SystemClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <time dateTime={now.toISOString()}>
      {now.toLocaleTimeString([], { hour12: false })}
    </time>
  );
}

function loadMemories() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return starterMemories;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : starterMemories;
  } catch {
    return starterMemories;
  }
}

function BootScreen({ memoryCount, onEnter }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 1400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="bios-screen">
      <div className="bios-noise" />
      <div className="bios-panel">
        <p>ORACLE BIOS 1.00</p>
        <p>CHECKING SUBJECT..........................OK</p>
        <p>CHECKING TEMPORAL INDEX...................OK</p>
        <p>CHECKING ENVIRONMENT ENGINE...............OK</p>
        <p>CHECKING MEMORY INTEGRITY.................PARTIAL</p>
        <br />
        <p>{String(memoryCount).padStart(2, "0")} FRAGMENTS RECOVERED</p>
        <p>ECHO ENGINE READY</p>
        <p>MEDIA SPECIMEN SYSTEM READY</p>

        {ready && (
          <button className="bios-enter" onClick={onEnter}>
            CONTINUE? [ Y ]
          </button>
        )}
      </div>
    </section>
  );
}

function TraceWindow({
  memory,
  memories,
  onClose,
  onUpdate,
  onSelectRelated,
  onPositionChange
}) {
  const relationships = relatedMemories(memory, memories);
  const spotifyEmbed = spotifyEmbedUrl(memory.spotifyUrl);

  return (
    <OracleWindow
      title={`FRAGMENT_${memory.id}.EXE`}
      width={430}
      initialX={72}
      initialY={92}
      onClose={onClose}
      onPositionChange={onPositionChange}
    >
      <div className="trace-terminal">
        <div className={`trace-scan ${memory.media?.dataUrl ? "has-specimen" : ""}`}>
          {memory.media?.dataUrl ? (
            memory.media.type?.startsWith("image/") ? (
              <img className="trace-media" src={memory.media.dataUrl} alt="" />
            ) : (
              <video className="trace-media" src={memory.media.dataUrl} muted controls />
            )
          ) : (
            <div className="trace-orb" />
          )}
          <span>FRAGMENT {memory.id}</span>
        </div>

        <dl>
          <div><dt>DATE</dt><dd>{memory.date}</dd></div>
          <div><dt>TIME</dt><dd>{memory.time}</dd></div>
          <div><dt>LOCATION</dt><dd>{memory.location}</dd></div>
          <div><dt>POSITION</dt><dd>{memory.coordinates}</dd></div>
          <div><dt>ATMOSPHERE</dt><dd>{memory.atmosphere}</dd></div>
          <div><dt>MOON</dt><dd>{memory.moonPhase || "UNRESOLVED"}</dd></div>
          <div><dt>PRECIPITATION</dt><dd>{memory.precipitation || "UNRESOLVED"}</dd></div>
          <div><dt>AUDIO</dt><dd>{memory.audio}</dd></div>
        </dl>

        {spotifyEmbed && (
          <iframe
            className="spotify-specimen"
            title={`Spotify audio trace for ${memory.title}`}
            src={spotifyEmbed}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        )}

        <blockquote>“{memory.recollection}”</blockquote>

        <section className="calibration">
          <span className="window-kicker">FRAGMENT CALIBRATION</span>

          {[
            ["confidence", "CERTAINTY"],
            ["intensity", "SIGNAL STRENGTH"],
            ["clarity", "VISUAL RESOLUTION"],
            ["warmth", "EMOTIONAL TEMPERATURE"]
          ].map(([field, label]) => (
            <label key={field}>
              <span>{label}</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={memory[field] ?? 0.5}
                onChange={(event) =>
                  onUpdate(memory.id, { [field]: Number(event.target.value) })
                }
              />
              <small>{Math.round((memory[field] ?? 0.5) * 100)}%</small>
            </label>
          ))}
        </section>

        <section className="relationship-panel">
          <span className="window-kicker">DETECTED ECHOES</span>

          {relationships.length ? (
            relationships.map((item) => (
              <button
                key={item.memory.id}
                type="button"
                onClick={() => onSelectRelated(item.memory)}
              >
                <strong>{item.memory.title}</strong>
                <small>{item.reasons.join(" / ")}</small>
              </button>
            ))
          ) : (
            <p>NO STRONG ECHOES DETECTED.</p>
          )}
        </section>
      </div>
    </OracleWindow>
  );
}

function OracleMessageWindow({ memory, onClose }) {
  const [kept, setKept] = useState(false);

  return (
    <OracleWindow
      title="ORACLE.SYS"
      width={330}
      initialX={560}
      initialY={180}
      onClose={onClose}
    >
      <div className="oracle-message">
        {kept ? (
          <p>FRAGMENT {memory.id} WILL REMAIN IN THE ACTIVE ORBIT.</p>
        ) : (
          <>
            <p>You have returned to this memory <strong>{memory.visits}</strong> times.</p>
            <p>would you like me to keep it here?</p>
            <div className="message-actions">
              <button type="button" onClick={() => setKept(true)}>YES</button>
              <button type="button" onClick={() => setKept(true)}>ALWAYS</button>
            </div>
          </>
        )}
      </div>
    </OracleWindow>
  );
}

function AudioResidue({ memories, onClose, onSelect }) {
  const audioMemories = memories.filter((memory) => !memory.audio.includes("NO AUDIO"));

  return (
    <OracleWindow
      title="ACOUSTIC_IMPRINTS.EXE"
      width={380}
      initialX={660}
      initialY={320}
      onClose={onClose}
    >
      <div className="audio-residue">
        <p className="window-kicker">RECURRENT AUDIO FRAGMENTS</p>
        {audioMemories.map((memory) => (
          <button className="audio-row audio-row-button" key={memory.id} onClick={() => onSelect(memory)}>
            <span>{memory.id}</span>
            <strong>{memory.audio}</strong>
            <small>{memory.date}</small>
          </button>
        ))}
      </div>
    </OracleWindow>
  );
}

export default function App() {
  const [entered, setEntered] = useState(false);
  const [activeMemory, setActiveMemory] = useState(null);
  const [windows, setWindows] = useState({ trace: false, oracle: false, audio: false });
  const [cascade, setCascade] = useState(false);
  const [showIndex, setShowIndex] = useState(false);
  const [showMemoryForm, setShowMemoryForm] = useState(false);
  const [showControlPanel, setShowControlPanel] = useState(false);
  const [showArchiveBrowser, setShowArchiveBrowser] = useState(false);
  const [activeNodePosition, setActiveNodePosition] = useState(null);
  const [traceWindowPosition, setTraceWindowPosition] = useState({
    x: 72,
    y: 92,
    width: 430,
    minimized: false
  });

  const [memories, setMemories] = useState(loadMemories);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
    } catch {
      // Large media attachments can exceed localStorage limits.
      console.warn("ORACLE could not persist the latest media attachment.");
    }
  }, [memories]);

  const years = useMemo(() => {
    const values = memories.map((memory) => memory.year).filter(Boolean);
    return values.length
      ? `${Math.min(...values)}—${Math.max(...values)}`
      : "UNRESOLVED";
  }, [memories]);

  const openMemory = (memory) => {
    setActiveMemory(memory);
    setWindows({ trace: true, oracle: true, audio: false });
    setShowArchiveBrowser(false);
  };

  const saveMemory = (memory) => {
    setMemories((current) => [...current, memory]);
    setActiveMemory(memory);
    setWindows({ trace: true, oracle: false, audio: false });
  };

  const updateMemory = (id, patch) => {
    setMemories((current) =>
      current.map((memory) => (memory.id === id ? { ...memory, ...patch } : memory))
    );
    setActiveMemory((current) =>
      current?.id === id ? { ...current, ...patch } : current
    );
  };

  const exportArchive = () => {
    const payload = {
      format: "oracle-memory-archive",
      version: 1,
      exportedAt: new Date().toISOString(),
      memories
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `oracle-archive-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importArchive = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const parsed = JSON.parse(await file.text());
        const incoming = Array.isArray(parsed) ? parsed : parsed.memories;
        if (!Array.isArray(incoming)) throw new Error("Archive does not contain a memories array.");
        setMemories(incoming);
        setActiveMemory(null);
        setWindows({ trace: false, oracle: false, audio: false });
        setShowControlPanel(false);
      } catch (error) {
        window.alert(`ORACLE could not import this archive. ${error.message}`);
      }
    };
    input.click();
  };

  const resetArchive = () => {
    const approved = window.confirm(
      "Reset ORACLE to the original recovered fragments? Export a backup first if you want to keep your archive."
    );
    if (!approved) return;
    setMemories(starterMemories);
    setActiveMemory(null);
    setWindows({ trace: false, oracle: false, audio: false });
    setShowControlPanel(false);
  };

  if (!entered) {
    return <BootScreen memoryCount={memories.length} onEnter={() => setEntered(true)} />;
  }

  const connectorVisible =
    activeMemory &&
    windows.trace &&
    !traceWindowPosition.minimized &&
    activeNodePosition;

  const connectorEnd = {
    x: traceWindowPosition.x + traceWindowPosition.width,
    y: traceWindowPosition.y + 76
  };

  return (
    <main className="oracle-app">
      <header className="os-topbar" data-tauri-drag-region>
        <div>
          <strong>ORACLE OS</strong>
          <span>SUBJECT // 0001</span>
        </div>

        <nav>
          <button onClick={() => setShowIndex(true)}>INDEX</button>
          <button onClick={() => setShowMemoryForm(true)}>RECONSTRUCT MEMORY</button>
          <button onClick={() => setWindows((current) => ({ ...current, audio: true }))}>ACOUSTIC IMPRINTS</button>
          <AmbientHum />
        </nav>

        <div className="desktop-status"><SystemClock /><DesktopControls /></div>
      </header>

      <MemoryOrbit
        memories={memories}
        activeMemory={activeMemory}
        onSelect={openMemory}
        onActiveScreenPosition={setActiveNodePosition}
      />

      {connectorVisible && (
        <svg className="connector-layer" aria-hidden="true">
          <line
            x1={activeNodePosition.x}
            y1={activeNodePosition.y}
            x2={connectorEnd.x}
            y2={connectorEnd.y}
          />
          <circle cx={activeNodePosition.x} cy={activeNodePosition.y} r="3" />
          <circle cx={connectorEnd.x} cy={connectorEnd.y} r="3" />
        </svg>
      )}

      <aside className="subject-readout">
        <span>SUBJECT // 0001</span>
        <strong>{memories.length} RECOVERED FRAGMENTS</strong>
        <small>{years}</small>
      </aside>

      <aside className="interaction-hint">
        DRAG TO ROTATE<br />
        SCROLL TO TRAVEL<br />
        SELECT A FRAGMENT TO EXAMINE
      </aside>

      <div className="center-label">
        <span>ARCHIVE CORE</span>
        <strong>ORACLE</strong>
        <small>ECHO ENGINE: ACTIVE</small>
      </div>

      {activeMemory && windows.trace && (
        <TraceWindow
          memory={activeMemory}
          memories={memories}
          onClose={() => setWindows((current) => ({ ...current, trace: false }))}
          onUpdate={updateMemory}
          onSelectRelated={openMemory}
          onPositionChange={setTraceWindowPosition}
        />
      )}

      {activeMemory && windows.oracle && (
        <OracleMessageWindow
          memory={activeMemory}
          onClose={() => setWindows((current) => ({ ...current, oracle: false }))}
        />
      )}

      {windows.audio && (
        <AudioResidue
          memories={memories}
          onSelect={openMemory}
          onClose={() => setWindows((current) => ({ ...current, audio: false }))}
        />
      )}

      {showControlPanel && (
        <ControlPanel
          onClose={() => setShowControlPanel(false)}
          onOpenIndex={() => {
            setShowControlPanel(false);
            setShowIndex(true);
          }}
          onOpenMemoryForm={() => {
            setShowControlPanel(false);
            setShowMemoryForm(true);
          }}
          onOpenAudio={() => {
            setShowControlPanel(false);
            setWindows((current) => ({ ...current, audio: true }));
          }}
          onOpenTraceManager={() => {
            setShowControlPanel(false);
            setShowArchiveBrowser(true);
          }}
          onExportArchive={exportArchive}
          onImportArchive={importArchive}
          onResetArchive={resetArchive}
        />
      )}

      {showArchiveBrowser && (
        <ArchiveBrowser
          memories={memories}
          onClose={() => setShowArchiveBrowser(false)}
          onSelect={openMemory}
        />
      )}

      <PopupCascade visible={cascade} onDismiss={() => setCascade(false)} />

      {showMemoryForm && (
        <MemoryForm
          onClose={() => setShowMemoryForm(false)}
          onSave={saveMemory}
        />
      )}

      {showIndex && (
        <IndexView
          memories={memories}
          onClose={() => setShowIndex(false)}
          onSelect={(memory) => {
            setShowIndex(false);
            openMemory(memory);
          }}
        />
      )}

      <div className="taskbar">
        <button onClick={() => setShowControlPanel(true)}>◈ START</button>
        <button onClick={() => setShowControlPanel(true)}>RECONSTRUCTION TOOLS</button>
        <button onClick={() => setShowArchiveBrowser(true)}>MEMORY ARCHIVE</button>
        <span className="taskbar-spacer" />
        <button onClick={() => setCascade(true)}>CONFLICT LOG</button>
        <button onClick={() => setShowIndex(true)}>INDEX</button>
        <span>{memories.length} FRAGMENTS</span>
      </div>
    </main>
  );
}
