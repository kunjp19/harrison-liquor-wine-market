const trendBoard = document.querySelector("[data-local-trends]");

const trendText = {
  rain: {
    label: "Rainy-day cue",
    title: "Make it one quick stop",
    copy: "Rain near Lincoln Park usually means customers want a faster trip: drinks, snacks, mixers, and convenience basics in one visit.",
    meta: "Live weather cue. Call Harrison for exact prices, sizes, and availability."
  },
  warm: {
    label: "Warm-weather cue",
    title: "Cold drinks, snacks, and mixers",
    copy: "Warmer weather is a good time to feature beer offers, energy drinks, soft drinks, mixers, chips, candy, and quick hosting add-ons.",
    meta: "Live weather cue. Alcohol requires legal age and valid ID."
  },
  cold: {
    label: "Cold-weather cue",
    title: "Fast counter stop",
    copy: "Colder weather favors a quick planned stop: bottle requests, snacks, tobacco or vape questions for eligible adults, and convenience items.",
    meta: "Live weather cue. Adult-only products require legal age and valid ID."
  },
  normal: {
    label: "Local stop cue",
    title: "Build the stop around the plan",
    copy: "Use current offers as the anchor, then add snacks, mixers, grocery basics, or adult-only categories when legally eligible.",
    meta: "Live weather cue. Product availability must be confirmed with the store."
  }
};

const chooseTrend = ({ temperature, precipitation, weatherCode }) => {
  if (precipitation > 0 || [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) return "rain";
  if (temperature >= 76) return "warm";
  if (temperature <= 38) return "cold";
  return "normal";
};

const setTrend = (kind, weather) => {
  const cue = trendText[kind] || trendText.normal;
  trendBoard.dataset.apiStatus = "live";
  trendBoard.querySelector("[data-trend-label]").textContent = cue.label;
  trendBoard.querySelector("[data-trend-title]").textContent = cue.title;
  trendBoard.querySelector("[data-trend-copy]").textContent = cue.copy;
  trendBoard.querySelector("[data-trend-card-title]").textContent = cue.title;
  trendBoard.querySelector("[data-trend-card-copy]").textContent = cue.copy;
  trendBoard.querySelector("[data-trend-meta]").textContent = weather
    ? `${cue.meta} Current Lincoln Park cue: ${Math.round(weather.temperature)}°F.`
    : cue.meta;
};

const loadTrendCue = async () => {
  if (!trendBoard) return;

  try {
    const params = new URLSearchParams({
      latitude: "42.2233",
      longitude: "-83.1709",
      current: "temperature_2m,precipitation,weather_code",
      temperature_unit: "fahrenheit",
      timezone: "America/Detroit"
    });
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    if (!response.ok) throw new Error("Weather unavailable");
    const data = await response.json();
    const weather = {
      temperature: Number(data.current?.temperature_2m),
      precipitation: Number(data.current?.precipitation || 0),
      weatherCode: Number(data.current?.weather_code || 0)
    };
    setTrend(chooseTrend(weather), weather);
  } catch {
    trendBoard.dataset.apiStatus = "fallback";
    setTrend("normal");
  }
};

loadTrendCue();
