import WorldMap from './components/WorldMap';
import SearchBar from './components/SearchBar';
import { useState } from 'react';

function App() {
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);

  const addPlace = (feat) => {
    const { id, place_type, text, center } = feat;

    if (place_type.includes("country")) {
      console.log(feat.properties)
      const iso = feat.properties.short_code?.toUpperCase();
      console.log(iso)
      setSelectedCountry((prev) =>
        prev.includes(iso) ? prev : [...prev, iso]
      )
    } else if (place_type.includes("place")) {
      const n = feat.context.length
      const iso = feat.context[n-1].short_code.toUpperCase();
      console.log(iso);
      setSelectedCities((prev) =>
        prev.find((c) => c.id === id) ? prev : [...prev, {id, text, center}]
      )
      setSelectedCountry((prev) =>
        prev.includes(iso) ? prev : [...prev, iso]
      )
    }
  }


  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <SearchBar onAdd={addPlace}/>
      <WorldMap selectedCountry={selectedCountry} selectedCities={selectedCities}/>
    </div>
  );
}

export default App;
