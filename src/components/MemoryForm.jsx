import { useRef, useState } from "react";
import OracleWindow from "./OracleWindow";
import { reconstructEnvironment } from "../utils/memoryTools";

const blank = {
  title: "",
  date: "",
  time: "",
  location: "",
  song: "",
  spotifyUrl: "",
  description: ""
};

const MAX_MEDIA_BYTES = 2.5 * 1024 * 1024;

export default function MemoryForm({ onClose, onSave }) {
  const [form, setForm] = useState(blank);
  const [media, setMedia] = useState(null);
  const [environment, setEnvironment] = useState(null);
  const [status, setStatus] = useState("");
  const [reconstructing, setReconstructing] = useState(false);
  const fileInput = useRef(null);

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const chooseFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_MEDIA_BYTES) {
      setStatus("Please choose a photo or short video under 2.5 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setMedia({
        name: file.name,
        type: file.type,
        dataUrl: String(reader.result)
      });
      setStatus("MEDIA FRAGMENT ATTACHED");
    };
    reader.onerror = () => setStatus("The media file could not be read.");
    reader.readAsDataURL(file);
  };

  const reconstruct = async () => {
    setReconstructing(true);
    setStatus("RECONSTRUCTING ENVIRONMENT...");

    try {
      const result = await reconstructEnvironment(form.location, form.date);
      setEnvironment(result);
      setStatus("ENVIRONMENTAL FRAGMENT RECOVERED");
    } catch (error) {
      setStatus(error.message || "Environmental reconstruction failed.");
    } finally {
      setReconstructing(false);
    }
  };

  const submit = (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.date || !form.description.trim()) {
      setStatus("Memory name, date, and recollection are required.");
      return;
    }

    const dateObject = new Date(`${form.date}T12:00:00`);
    const year = dateObject.getFullYear();

    onSave({
      id: String(Date.now()).slice(-4),
      title: form.title.trim(),
      date: dateObject.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }).toUpperCase(),
      sourceDate: form.date,
      year,
      time: form.time || "TIME UNRESOLVED",
      location:
        environment?.locationResolved ||
        form.location.trim().toUpperCase() ||
        "LOCATION UNRESOLVED",
      coordinates: environment?.coordinates || "POSITION UNRESOLVED",
      atmosphere: environment?.atmosphere || "ATMOSPHERIC DATA UNRESOLVED",
      precipitation: environment?.precipitation || "UNRESOLVED",
      moonPhase: environment?.moonPhase || "UNRESOLVED",
      timezone: environment?.timezone || "UNRESOLVED",
      audio: form.song.trim().toUpperCase() || "NO AUDIO TRACE",
      spotifyUrl: form.spotifyUrl.trim(),
      recollection: form.description.trim(),
      intensity: 0.72,
      clarity: 0.74,
      warmth: 0.7,
      confidence: 0.8,
      distance: 3.1 + Math.random() * 2.1,
      angle: Math.random() * Math.PI * 2,
      height: -1 + Math.random() * 2,
      visits: 1,
      media
    });

    onClose();
  };

  return (
    <OracleWindow
      title="RECONSTRUCT_MEMORY.EXE"
      width={470}
      initialX={170}
      initialY={78}
      onClose={onClose}
    >
      <form className="memory-form" onSubmit={submit}>
        <div className="memory-form-intro">
          <span>NEW MEMORY FRAGMENT</span>
          <p>Enter the fragments you still remember.</p>
        </div>

        <label>
          MEMORY NAME
          <input
            name="title"
            value={form.title}
            onChange={update}
            placeholder="Late train home"
          />
        </label>

        <div className="memory-form-row">
          <label>
            DATE
            <input type="date" name="date" value={form.date} onChange={update} />
          </label>

          <label>
            TIME
            <input type="time" name="time" value={form.time} onChange={update} />
          </label>
        </div>

        <label>
          LOCATION
          <input
            name="location"
            value={form.location}
            onChange={update}
            placeholder="New York, NY"
          />
        </label>

        <button
          className="reconstruct-environment"
          type="button"
          disabled={reconstructing}
          onClick={reconstruct}
        >
          {reconstructing ? "RECONSTRUCTING..." : "RECONSTRUCT WEATHER + POSITION + MOON"}
        </button>

        {environment && (
          <div className="environment-preview">
            <span>{environment.coordinates}</span>
            <strong>{environment.atmosphere}</strong>
            <small>{environment.moonPhase} / {environment.timezone}</small>
          </div>
        )}

        <label>
          SONG / AUDIO TRACE
          <input
            name="song"
            value={form.song}
            onChange={update}
            placeholder="Almost Blue — Chet Baker"
          />
        </label>

        <label>
          SPOTIFY LINK
          <input
            name="spotifyUrl"
            value={form.spotifyUrl}
            onChange={update}
            placeholder="https://open.spotify.com/track/..."
          />
        </label>

        <label>
          SHORT RECOLLECTION
          <textarea
            name="description"
            value={form.description}
            onChange={update}
            rows="5"
            placeholder="Write the part you are afraid you might forget."
          />
        </label>

        <div className="memory-upload">
          <input
            ref={fileInput}
            type="file"
            accept="image/*,video/*"
            onChange={chooseFile}
            hidden
          />

          <button type="button" onClick={() => fileInput.current?.click()}>
            + ATTACH PHOTO OR SHORT VIDEO
          </button>

          {media && (
            <div className="media-preview">
              {media.type.startsWith("image/") ? (
                <img src={media.dataUrl} alt="" />
              ) : (
                <video src={media.dataUrl} muted controls />
              )}
              <span>{media.name}</span>
            </div>
          )}
        </div>

        {status && <p className="form-status">{status}</p>}

        <button className="memory-save" type="submit">
          ARCHIVE FRAGMENT
        </button>
      </form>
    </OracleWindow>
  );
}
