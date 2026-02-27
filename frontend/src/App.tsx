import { useEffect, useState } from "react";
import "./App.css";
import { LocationSearch } from "./components/LocationSearch";

interface LocationObj {
  longitude: string;
  latitude: string;
  name: string;
  country?: string;
}

interface DayData {
  time: string[];
  score: number[];
  rawTemp: number[];
  rawDp: number[];
  rawClouds: number[];
  rawWind: number[];
  scoredTemp: number[];
  scoredDp: number[];
  scoredClouds: number[];
  scoredWind: number[];
}

function App() {
  // Default return when location is provided
  const [location, setLocation] = useState<LocationObj>();
  const [weatherData, setWeatherData] = useState<DayData[]>([]);

  const handleLocationSubmit = (
    latitude: number,
    longitude: number,
    name: string,
    country?: string,
  ) => {
    setLocation({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      name,
      country,
    });
  };

  useEffect(() => {
    if (!location) return;

    const fetchRunningScores = async () => {
      try {
        // swap for renderURL when ready for deployment
        const url = `http://localhost:8080/api/forecast?lat=${location.latitude}&lon=${location.longitude}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: DayData[] = await response.json();
        setWeatherData(data);

        console.log("Successfully fetched 7 days of running data:", data);
      } catch (error) {
        console.error("Failed to fetch running scores:", error);
      }
    };

    fetchRunningScores();
  }, [location]);

  if (location == undefined) {
    return <LocationSearch onLocationSubmit={handleLocationSubmit} />;
  }

  return (
    <div className="min-h-scree bg-amber-50 p-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-amber-900 mb-3">
            Weather-To-Run
          </h1>
          <div className="flex items-center justify-center gap-3">
            <span className="text-amber-800 font-medium text-lg">
              `${location.name}, ${location.country}`
            </span>
            <button
              className="px-5 py-2 text-sm bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-full transition-color font-medium"
              onClick={() => {
                setLocation(undefined);
              }}
            >
              New Location
            </button>
          </div>
        </header>

        {weatherData.length == 0 ? (
          <div className="text-center text-amber-600">Loading...</div>
        ) : (
          <h1>Bro</h1>
        )}
      </div>
    </div>
  );
}

export default App;
