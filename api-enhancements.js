const weatherCard = document.querySelector("[data-weather-stop]");

const weatherLabels = {
  0: "clear",
  1: "mostly clear",
  2: "partly cloudy",
  3: "cloudy",
  45: "foggy",
  48: "foggy",
  51: "drizzly",
  53: "drizzly",
  55: "drizzly",
  61: "rainy",
  63: "rainy",
  65: "rainy",
  71: "snowy",
  73: "snowy",
  75: "snowy",
  80: "showery",
  81: "showery",
  82: "showery",
  95: "stormy"
};

const buildStopIdea = ({ temperature, precipitation, code }) => {
  const label = weatherLabels[code] || "local";

  if (precipitation > 0 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95].includes(code)) {
    return {
      title: "Rainy-day quick stop",
      copy: `Lincoln Park is ${label}. Call ahead for posted offers, snacks, mixers, energy drinks and convenience basics before you head out.`
    };
  }

  if (temperature >= 76) {
    return {
      title: "Warm-weather drink run",
      copy: `It is about ${Math.round(temperature)}°F near Harrison Blvd. Ask about cold drinks, energy drink offers, snacks and mix-and-match add-ons.`
    };
  }

  if (temperature <= 38) {
    return {
      title: "Cold-weather counter stop",
      copy: `It is about ${Math.round(temperature)}°F near Lincoln Park. Call ahead and keep the trip simple: offers, snacks, mixers and everyday basics.`
    };
  }

  return {
    title: "Good day for a quick stop",
    copy: `Current local weather is ${label}, about ${Math.round(temperature)}°F. Check posted offers, snacks, drinks and convenience items before visiting.`
  };
};

const updateWeatherCard = async () => {
  if (!weatherCard) return;

  const title = weatherCard.querySelector("[data-weather-title]");
  const copy = weatherCard.querySelector("[data-weather-copy]");
  const meta = weatherCard.querySelector("[data-weather-meta]");

  try {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=42.2233&longitude=-83.1709&current=temperature_2m,precipitation,weather_code&temperature_unit=fahrenheit&timezone=America%2FDetroit";
    const response = await fetch(url, { headers: { accept: "application/json" } });
    if (!response.ok) throw new Error("Weather unavailable");

    const data = await response.json();
    const current = data.current || {};
    const idea = buildStopIdea({
      temperature: Number(current.temperature_2m),
      precipitation: Number(current.precipitation || 0),
      code: Number(current.weather_code)
    });

    title.textContent = idea.title;
    copy.textContent = idea.copy;
    meta.textContent = "Weather data: Open-Meteo. Offers and inventory still need store confirmation.";
    weatherCard.dataset.apiStatus = "live";
  } catch {
    title.textContent = "Plan around today";
    copy.textContent = "Call ahead for current offers, snacks, drinks, mixers and convenience basics before making a special trip.";
    meta.textContent = "Live weather is optional. Store pricing and availability should be confirmed by phone.";
    weatherCard.dataset.apiStatus = "fallback";
  }
};

updateWeatherCard();
