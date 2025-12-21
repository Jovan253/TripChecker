import WorldMap from './components/WorldMap';
import SearchBar from './components/SearchBar';
import { useTravelStorage } from './utils/useTravelStorage';

function App() {
  const [travel, setTravel ] = useTravelStorage();

  const addCountry = (feat, prev) => {
    const iso = feat.properties.short_code?.toUpperCase();
    if (!iso || prev.countries.includes(iso)) return prev;

    return {
      ...prev,
      countries: [...prev.countries, iso]
    }
  }

  const addPlace = (feat) => {
    const isCountry = feat.place_type.includes("country");
    const isCity = feat.place_type.includes("place");

    setTravel((prev) => {
      if (isCountry) {
        return addCountry(feat, prev);
      }

      if (isCity) {
        if (prev.cities.find((c) => c.id === feat.id)) return prev;

        return{
          ...prev,
          cities: [
            ...prev.cities,
            {
              id: feat.id,
              name: feat.text,
              center: feat.center,
              country: feat.context?.find(c => c.id.startsWith("country"))?.short_code?.toUpperCase()
            }
          ]
        }
      }

      return prev;
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
