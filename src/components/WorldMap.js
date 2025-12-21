import Map from "react-map-gl/mapbox";
import { Source, Layer, Marker } from "react-map-gl/mapbox";

const countryFillLayer = (selected) => ({
  id: "country-fills",
  type: "fill",
  source: "countries",
  "source-layer": "country_boundaries",
  paint: {
    "fill-color": [
      "case",
      ["in", ["get", "iso_3166_1"], ["literal", selected]],
      "#2C46B0", // selected country
      "#2B2A2A"  // default
    ],
    "fill-opacity": 1
  }
});

const borderLayer = {
  id: "country-borders",
  type: "line",
  source: "countries",
  "source-layer": "country_boundaries",
  paint: {
    "line-color": "#444",
    "line-width": 1
  }
};

export default function WorldMap({ selectedCountry, selectedCities }) {
  return (
    <Map
      initialViewState={{
        longitude: 0,
        latitude: 20,
        zoom: 1.5
      }}
      projection="mercator"
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      interactiveLayerIds={["country-fills"]}
      onLoad={(e) => {
        const map = e.target;
        map.getStyle().layers
          .filter((l) => l.type === 'symbol')
          .forEach((l) => map.setLayoutProperty(l.id, "visibility", "none"));
      }}
    >
      {/* Country Fills */}
      <Source
        id="countries"
        type="vector"
        url="mapbox://mapbox.country-boundaries-v1"
      >
        <Layer {...countryFillLayer(selectedCountry)} />
        <Layer {...borderLayer} />
      </Source>

      {selectedCities.map((city) => (
        <Marker
          key={city.id}
          longitude={city.center[0]}
          latitude={city.center[1]}
          anchor="bottom"
        >
          <svg width="20" height="30" viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 0C7.03 0 3 4.03 3 9c0 7.5 9 27 9 27s9-19.5 9-27c0-4.97-4.03-9-9-9z"
              fill="#C73428"
            />
            <circle cx="12" cy="9" r="3" fill="white" />
          </svg>

        </Marker>
      ))}

    </Map>
  );
}
