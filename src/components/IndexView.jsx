export default function IndexView({ memories, onClose, onSelect }) {
  const cells = Array.from({ length: 36 }, (_, index) => 79 + index);

  return (
    <section className="index-view">
      <button className="index-close" onClick={onClose}>CLOSE INDEX</button>
      <div className="index-grid">
        {cells.map((number, index) => {
          const memory = memories[index % memories.length];
          const showMemory = [4, 9, 15, 22, 29].includes(index);
          const showDefinition = [7, 18, 26].includes(index);

          return (
            <article className={`index-cell ${showMemory ? "has-memory" : ""}`} key={number}>
              <span className="index-number">{number}</span>

              {showMemory && (
                <button className="index-memory-card" onClick={() => onSelect(memory)}>
                  <div className="index-image-placeholder">
                    {memory.media?.dataUrl && memory.media.type?.startsWith("image/") ? (
                      <img src={memory.media.dataUrl} alt="" />
                    ) : (
                      <span>FRAGMENT {memory.id}</span>
                    )}
                  </div>
                  <strong>{memory.title}</strong>
                  <small>{memory.date}</small>
                </button>
              )}

              {showDefinition && (
                <div className="index-definition">
                  <strong>{["EXPRESSION", "VISION", "ONIRIC"][index % 3]}</strong>
                  <p>
                    {index % 3 === 0
                      ? "A communicative act of being human. A trace made visible."
                      : index % 3 === 1
                      ? "The faculty by which a subject receives and processes light."
                      : "Contents of dreams, fragments, and unresolved impressions."}
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
