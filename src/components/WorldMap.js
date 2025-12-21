import Map from "react-map-gl/mapbox";
import { Source, Layer } from "react-map-gl/mapbox";

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

      <Source
        id="cities"
        type="geojson"
        data={{
          type: "FeatureCollection",
          features: selectedCities.map(city => ({
            type: "Feature",
            id: city.id,
            geometry: {
              type: "Point",
              coordinates: city.center
            }
          }))
        }}
      >
        <Layer
          id="city-circles"
          type="circle"
          paint={{
            'circle-radius': 4,
            "circle-color": "#C73428",
            "circle-stroke-width": 1.5,
            "circle-stroke-color": "#fff"
          }}
        />
      </Source>
    </Map>
  );
}
