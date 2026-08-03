import OracleWindow from "./OracleWindow";

export default function ArchiveBrowser({ memories, onClose, onSelect }) {
  return (
    <OracleWindow
      title="MEMORY_ARCHIVE.EXE"
      width={430}
      initialX={540}
      initialY={95}
      onClose={onClose}
    >
      <div className="trace-manager">
        <div className="trace-manager-heading">
          <span>{memories.length} ARCHIVED FRAGMENTS</span>
          <small>A simple list view of the orbit.</small>
        </div>

        <p className="archive-purpose">
          The orbit is the visual experience. This archive is the practical view for
          finding a specific memory by title or date.
        </p>

        <div className="trace-manager-list">
          {memories.map((memory) => (
            <button key={memory.id} onClick={() => onSelect(memory)}>
              <span>{memory.id}</span>
              <strong>{memory.title}</strong>
              <small>{memory.date}</small>
            </button>
          ))}
        </div>
      </div>
    </OracleWindow>
  );
}
