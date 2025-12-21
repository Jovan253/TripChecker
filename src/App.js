import WorldMap from './components/WorldMap';
import SearchBar from './components/SearchBar';
import { useTravelStorage } from './utils/useTravelStorage';

function App() {
  const [travel, setTravel ] = useTravelStorage();

  const addPlace = (feat) => {
    const isCountry = feat.place_type.includes("country");
    const isCity = feat.place_type.includes("place");

    setTravel((prev) => {
      let next = { ...prev };

      if (isCountry) {
        const iso = feat.properties.short_code?.toUpperCase();
        if (iso && !prev.countries.includes(iso)) {
          next.countries = [...prev.countries, iso];
        }
      }

      if (isCity) {
        if (!prev.cities.find((c) => c.id === feat.id)) {
          const countryCode = feat.context?.find(c => c.id.startsWith("country"))?.short_code?.toUpperCase();
          next.cities = [
            ...prev.cities,
            {
              id: feat.id,
              name: feat.text,
              center: feat.center,
              country: countryCode
            }
          ];

          if (countryCode && !prev.countries.includes(countryCode)) {
            next.countries = [...next.countries, countryCode]
          }
        }
      }

      return next;
    })
  }


  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <SearchBar onAdd={addPlace}/>
      <WorldMap selectedCountry={travel.countries} selectedCities={travel.cities}/>
    </div>
  );
}

export default App;
