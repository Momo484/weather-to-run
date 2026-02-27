import { useEffect, useState } from "react";

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler); // Cleanup clears the timer if the user keeps typing
  }, [value, delay]);
  return debouncedValue;
}

interface LocationSearchProps {
  onLocationSubmit: (
    latitude: number,
    longitude: number,
    name: string,
    country?: string,
  ) => void;
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  timezone?: string;
  population?: number;
  postcodes?: string[];
  country_id?: number;
  country?: string;
  admin1?: string; // This is usually the State or Province (e.g., New South Wales)
  admin2?: string; // County/Region
  admin3?: string; // Local municipality
  admin4?: string;
}

export function LocationSearch({ onLocationSubmit }: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    // Clear the dropdown immediately if they delete their text
    // (This fixes the cascading render error!)
    if (val.length < 3) {
      setResults([]);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${debouncedQuery}&count=5&language=en&format=json`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.results) {
          setResults(data.results);
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };

    fetchLocations();
  }, [debouncedQuery]); // This only triggers when the debounced query changes!

  const handleSelect = (location: GeocodingResult) => {
    setQuery(`${location.name}, ${location.admin1 || location.country}`);
    setIsOpen(false);
    // Pass the coordinates up to your main App to send to your C++ backend
    onLocationSubmit(
      location.latitude,
      location.longitude,
      location.name,
      location.admin1 || location.country,
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 relative overflow">
      <div className="text-center max-w-md w-full px-8 relative z-10">
        <h1 className="text-6xl font-bold text-amber-900 mb-4">
          Weather to Run
        </h1>
        <input
          type="text"
          className="mb-4 w-full px-6 py-4 rounded-full border-2 border-amber-200 focus:border-amber-400 focus:outline-none text-lg text-amber-900 placeholder-amber-400 bg-white"
          placeholder="Search for a city (e.g., Sydney)..."
          value={query}
          onChange={handleInputChange}
        />

        {/* The Autocomplete Dropdown */}
        {isOpen && results.length > 0 && (
          <ul className=" w-full px-6 py-4 rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none text-lg text-amber-900 placeholder-amber-400 bg-white">
            {results.map((location) => (
              <li
                key={location.id}
                className="p-3 cursor-pointer hover:bg-muted text-card-foreground border-b last:border-0 transition-colors"
                onClick={() => handleSelect(location)}
              >
                <span className="font-medium">{location.name}</span>
                <span className="text-muted-foreground text-sm ml-2">
                  {location.admin1 ? `${location.admin1}, ` : ""}
                  {location.country}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
