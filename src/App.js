import { useState } from 'react';
import WorldMap from './components/WorldMap';
import SearchBar from './components/SearchBar';
import { useTravelStorage } from './utils/useTravelStorage';
import { findRegionForCity } from './utils/geoUtils';

function App() {
  const [travel, setTravel] = useTravelStorage();
  const [showRegions, setShowRegions] = useState(false);

  const addPlace = async (feat) => {
    if (!feat.place_type.includes("place")) return;

    const countryCode = feat.context
      ?.find(c => c.id.startsWith("country"))
      ?.short_code?.toUpperCase();

    // Add city (and country) immediately
    setTravel((prev) => {
      if (prev.cities.find(c => c.id === feat.id)) return prev;
      const next = {
        ...prev,
        cities: [
          ...prev.cities,
          { id: feat.id, name: feat.text, center: feat.center, country: countryCode }
        ]
      };
      if (countryCode && !prev.countries.includes(countryCode)) {
        next.countries = [...prev.countries, countryCode];
      }
      return next;
    });

    // Reverse geocode the city's coordinates to get the enclosing admin-1 region boundary
    try {
      const region = await findRegionForCity(feat.center);
      if (region) {
        setTravel((prev) => {
          if (prev.regions.find(r => r.id === region.id)) return prev;
          return {
            ...prev,
            regions: [
              ...prev.regions,
              { ...region, country: countryCode }
            ]
          };
        });
      }
    } catch {
      // Nominatim unavailable — city pin still shows
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <SearchBar onAdd={addPlace} />
      <button
        onClick={() => setShowRegions(v => !v)}
        style={toggleButtonStyle(showRegions)}
      >
        View: {showRegions ? "Regions" : "Countries"}
      </button>
      <WorldMap
        selectedCountry={travel.countries}
        selectedCities={travel.cities}
        selectedRegions={travel.regions}
        showRegions={showRegions}
      />
    </div>
  );
}

const toggleButtonStyle = (active) => ({
  position: "absolute",
  top: 20,
  right: 20,
  zIndex: 10,
  padding: "9px 16px",
  background: active ? "#2C46B0" : "#1a1a1a",
  color: "#fff",
  border: `1px solid ${active ? "#4a6fd6" : "#555"}`,
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 13,
  fontWeight: "500",
  letterSpacing: "0.3px"
});

export default App;
