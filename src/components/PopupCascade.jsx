export default function PopupCascade({ visible, onDismiss }) {
  if (!visible) return null;

  return (
    <div className="single-popup-layer" aria-live="polite">
      <section className="single-popup">
        <div className="single-popup-titlebar">
          <span>ORACLE.SYS</span>
          <button onClick={onDismiss}>×</button>
        </div>

        <div className="single-popup-body">
          <span className="popup-index">FRAGMENT CONFLICT // 03</span>
          <p>YOU REMEMBERED THIS DIFFERENTLY LAST TIME.</p>
          <small>human recollection cannot be verified.</small>

          <div className="single-popup-actions">
            <button onClick={onDismiss}>KEEP THIS VERSION</button>
            <button onClick={onDismiss}>LET IT REMAIN UNCERTAIN</button>
          </div>
        </div>
      </section>
    </div>
  );
}
