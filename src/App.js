import { useMemo, useState } from 'react';
import WorldMap from './components/WorldMap';
import SearchBar from './components/SearchBar';
import AuthPage from './components/Auth/AuthPage';
import StatsPanel from './components/StatsPanel';
import { useTravelData } from './utils/useTravelData';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user, loading, logOut } = useAuth();
  const [travel, setTravel ] = useTravelData();
  const [showStats, setShowStats] = useState(false);
  const [showCities, setShowCities] = useState(true);

  const addPlace = (feat) => {
    if (!feat.place_type.includes("place")) return;

    setTravel((prev) => {
      if (prev.cities.find((c) => c.id === feat.id)) return prev;

      // City-states (Singapore, Monaco, Vatican City...) have no context array
      // since they have no parent admin division - fall back to the feature's
      // own short_code, which is present when the feature is itself a country.
      const countryCode = (
        feat.context?.find(c => c.id.startsWith("country"))?.short_code
        ?? feat.properties?.short_code
      )?.toUpperCase();
      const cities = [
        ...prev.cities,
        {
          id: feat.id,
          name: feat.text,
          lng: feat.center[0],
          lat: feat.center[1],
          country: countryCode
        }
      ];

      const countries = countryCode && !prev.countries.includes(countryCode)
        ? [...prev.countries, countryCode]
        : prev.countries;

      return { cities, countries };
    })
  }

  const removeCity = (cityId) => {
    setTravel((prev) => {
      const city = prev.cities.find((c) => c.id === cityId);
      if (!city) return prev;

      const cities = prev.cities.filter((c) => c.id !== cityId);
      const countryStillVisited = cities.some((c) => c.country === city.country);

      return {
        cities,
        countries: countryStillVisited
          ? prev.countries
          : prev.countries.filter((iso) => iso !== city.country)
      };
    })
  }

  const cityCountByCountry = useMemo(() => {
    const counts = {};
    for (const city of travel.cities) {
      if (!city.country) continue;
      counts[city.country] = (counts[city.country] || 0) + 1;
    }
    return counts;
  }, [travel.cities]);

  if (loading) {
    return <div style={{ width: "100%", height: "100%", background: "#1a1a1a" }} />;
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <SearchBar onAdd={addPlace}/>
      <div style={styles.topRight}>
        <button onClick={() => setShowCities((prev) => !prev)} style={styles.button}>
          {showCities ? "Hide cities" : "Show cities"}
        </button>
        <button onClick={() => setShowStats((prev) => !prev)} style={styles.button}>Stats</button>
        <button onClick={logOut} style={styles.button}>Sign out</button>
      </div>
      {showStats && <StatsPanel countries={travel.countries} cities={travel.cities} />}
      <WorldMap selectedCountry={travel.countries} selectedCities={travel.cities} cityCountByCountry={cityCountByCountry} onRemoveCity={removeCity} showCities={showCities}/>
    </div>
  );
}

const styles = {
  topRight: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
    display: "flex",
    gap: 8
  },
  button: {
    padding: "8px 14px",
    fontSize: 13,
    borderRadius: 4,
    border: "1px solid #555",
    background: "#2B2A2A",
    color: "#fff",
    cursor: "pointer"
  }
};

export default App;
