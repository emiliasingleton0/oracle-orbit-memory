export function spotifyEmbedUrl(url = "") {
  const match = url.match(/open\.spotify\.com\/(track|album|playlist|episode|show|artist)\/([A-Za-z0-9]+)/);
  if (!match) return "";
  return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`;
}

export function moonPhaseForDate(dateString) {
  if (!dateString) return "UNRESOLVED";

  const date = new Date(`${dateString}T12:00:00Z`);
  const knownNewMoon = new Date("2000-01-06T18:14:00Z");
  const synodicMonth = 29.53058867;
  const days = (date - knownNewMoon) / 86400000;
  const age = ((days % synodicMonth) + synodicMonth) % synodicMonth;

  if (age < 1.85 || age >= 27.68) return "NEW MOON";
  if (age < 5.54) return "WAXING CRESCENT";
  if (age < 9.23) return "FIRST QUARTER";
  if (age < 12.92) return "WAXING GIBBOUS";
  if (age < 16.61) return "FULL MOON";
  if (age < 20.30) return "WANING GIBBOUS";
  if (age < 23.99) return "LAST QUARTER";
  return "WANING CRESCENT";
}

export function weatherCodeLabel(code) {
  const labels = {
    0: "CLEAR SKY",
    1: "MAINLY CLEAR",
    2: "PARTLY CLOUDY",
    3: "OVERCAST",
    45: "FOG",
    48: "RIME FOG",
    51: "LIGHT DRIZZLE",
    53: "DRIZZLE",
    55: "HEAVY DRIZZLE",
    61: "LIGHT RAIN",
    63: "RAIN",
    65: "HEAVY RAIN",
    71: "LIGHT SNOW",
    73: "SNOW",
    75: "HEAVY SNOW",
    80: "RAIN SHOWERS",
    81: "RAIN SHOWERS",
    82: "HEAVY SHOWERS",
    95: "THUNDERSTORM"
  };
  return labels[code] || "WEATHER FRAGMENT FOUND";
}

export async function reconstructEnvironment(location, date) {
  if (!location.trim() || !date) {
    throw new Error("Enter both a location and date first.");
  }

  const geocodeUrl =
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}` +
    "&count=1&language=en&format=json";

  const geoResponse = await fetch(geocodeUrl);
  if (!geoResponse.ok) throw new Error("Location lookup failed.");

  const geoData = await geoResponse.json();
  const place = geoData.results?.[0];
  if (!place) throw new Error("No matching location was found.");

  const weatherUrl =
    `https://archive-api.open-meteo.com/v1/archive?latitude=${place.latitude}` +
    `&longitude=${place.longitude}&start_date=${date}&end_date=${date}` +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum" +
    "&temperature_unit=fahrenheit&precipitation_unit=inch&timezone=auto";

  const weatherResponse = await fetch(weatherUrl);
  if (!weatherResponse.ok) throw new Error("Historical weather reconstruction failed.");

  const weather = await weatherResponse.json();
  const daily = weather.daily || {};
  const code = daily.weather_code?.[0];
  const high = daily.temperature_2m_max?.[0];
  const low = daily.temperature_2m_min?.[0];
  const precipitation = daily.precipitation_sum?.[0];

  return {
    locationResolved: [place.name, place.admin1, place.country]
      .filter(Boolean)
      .join(", ")
      .toUpperCase(),
    coordinates: `${Number(place.latitude).toFixed(4)}° / ${Number(place.longitude).toFixed(4)}°`,
    atmosphere: `${weatherCodeLabel(code)} / ${high ?? "?"}°F HIGH / ${low ?? "?"}°F LOW`,
    precipitation: precipitation == null ? "UNRESOLVED" : `${precipitation} IN`,
    moonPhase: moonPhaseForDate(date),
    timezone: place.timezone || "UNRESOLVED"
  };
}

export function relatedMemories(memory, memories) {
  if (!memory) return [];

  return memories
    .filter((candidate) => candidate.id !== memory.id)
    .map((candidate) => {
      let score = 0;
      const reasons = [];

      const audioA = memory.audio?.toUpperCase();
      const audioB = candidate.audio?.toUpperCase();
      if (audioA && audioB && !audioA.includes("NO AUDIO") && audioA === audioB) {
        score += 4;
        reasons.push("SHARED AUDIO");
      }

      if (
        memory.location &&
        candidate.location &&
        memory.location !== "LOCATION UNRESOLVED" &&
        memory.location === candidate.location
      ) {
        score += 3;
        reasons.push("SHARED PLACE");
      }

      if (memory.year && candidate.year && Math.abs(memory.year - candidate.year) <= 1) {
        score += 1;
        reasons.push("TEMPORAL PROXIMITY");
      }

      if (Math.abs((memory.warmth ?? 0.5) - (candidate.warmth ?? 0.5)) < 0.14) {
        score += 1;
        reasons.push("SIMILAR EMOTIONAL TEMPERATURE");
      }

      return { memory: candidate, score, reasons };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
