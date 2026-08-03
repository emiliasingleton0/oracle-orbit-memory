import OracleWindow from "./OracleWindow";

export default function ControlPanel({ onClose, onOpenIndex, onOpenMemoryForm, onOpenAudio, onOpenTraceManager, onExportArchive, onImportArchive, onResetArchive }) {
  return (
    <OracleWindow title="RECONSTRUCTION_TOOLS.EXE" width={390} initialX={150} initialY={110} onClose={onClose}>
      <div className="control-panel-grid">
        <button onClick={onOpenIndex}><span>01</span><strong>INDEX</strong><small>Browse the complete archive.</small></button>
        <button onClick={onOpenMemoryForm}><span>02</span><strong>RECONSTRUCT</strong><small>Create a new memory trace.</small></button>
        <button onClick={onOpenAudio}><span>03</span><strong>ACOUSTIC IMPRINTS</strong><small>View recurring songs and sound traces.</small></button>
        <button onClick={onOpenTraceManager}><span>04</span><strong>FRAGMENT MANAGER</strong><small>Open and inspect saved memories.</small></button>
        <button onClick={onExportArchive}><span>05</span><strong>EXPORT ARCHIVE</strong><small>Download a portable JSON backup.</small></button>
        <button onClick={onImportArchive}><span>06</span><strong>IMPORT ARCHIVE</strong><small>Restore fragments from an ORACLE backup.</small></button>
        <button className="danger-tool" onClick={onResetArchive}><span>07</span><strong>RESET ARCHIVE</strong><small>Restore the original recovered fragments.</small></button>
      </div>
    </OracleWindow>
  );
}
