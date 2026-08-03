import { useEffect, useRef, useState } from "react";

export default function AmbientHum() {
  const [enabled, setEnabled] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      audioRef.current?.context?.close();
    };
  }, []);

  const stop = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.gain.gain.setTargetAtTime(0, audio.context.currentTime, 0.08);
    window.setTimeout(() => audio.context.close(), 220);
    audioRef.current = null;
    setEnabled(false);
  };

  const start = async () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const context = new AudioContext();
    await context.resume();

    const gain = context.createGain();
    gain.gain.value = 0.018;
    gain.connect(context.destination);

    const oscillatorA = context.createOscillator();
    const oscillatorB = context.createOscillator();
    oscillatorA.type = "sine";
    oscillatorB.type = "sine";
    oscillatorA.frequency.value = 54;
    oscillatorB.frequency.value = 81;

    const gainA = context.createGain();
    const gainB = context.createGain();
    gainA.gain.value = 0.45;
    gainB.gain.value = 0.18;

    oscillatorA.connect(gainA).connect(gain);
    oscillatorB.connect(gainB).connect(gain);
    oscillatorA.start();
    oscillatorB.start();

    audioRef.current = { context, gain, oscillatorA, oscillatorB };
    setEnabled(true);
  };

  return (
    <button
      className={`ambient-toggle ${enabled ? "is-on" : ""}`}
      type="button"
      onClick={() => (enabled ? stop() : start())}
      title="Toggle a quiet generated machine hum"
    >
      AMBIENT HUM {enabled ? "ON" : "OFF"}
    </button>
  );
}
