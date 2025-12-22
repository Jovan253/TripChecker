import { useState } from "react";
import Map from "react-map-gl/mapbox";
import { Source, Layer, Popup } from "react-map-gl/mapbox";

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
  const [hoverInfo, setHoverInfo] = useState(null);
  const [clickedCity, setClickedCity] = useState(null);

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
      interactiveLayerIds={["country-fills", "city-circles"]}

      onLoad={(e) => {
        const map = e.target;
        map.getStyle().layers
          .filter((l) => l.type === 'symbol')
          .forEach((l) => map.setLayoutProperty(l.id, "visibility", "none"));
      }}

      onMouseMove={(e) => {
        const feature = e.features?.[0];
        if (feature && feature.layer.id === "city-circles") {
          setHoverInfo({
            lngLat: e.lngLat,
            name: feature.properties.name
          });
          e.target.getCanvas().style.cursor = "pointer";
        } else {
          setHoverInfo(null);
          e.target.getCanvas().style.cursor = "";
        }
      }}

      onMouseLeave={() => {
        setHoverInfo(null);
      }}

      onClick={(e) => {
        const feature = e.features?.[0];
        if (feature?.layer.id === "city-circles") {
          setClickedCity({
            name: feature.properties.name,
            coordinates: feature.geometry.coordinates
          });
        }
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
            properties: {
              name: city.name,
            },
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

      {hoverInfo && (
        <Popup
          longitude={hoverInfo.lngLat.lng}
          latitude={hoverInfo.lngLat.lat}
          closeButton={false}
          closeOnClick={false}
          offset={8}
          className="city-popup"
        >
          {hoverInfo.name}
        </Popup>
      )}

      {clickedCity && (
        <Popup
          longitude={clickedCity.coordinates[0]}
          latitude={clickedCity.coordinates[1]}
          onClose={() => setClickedCity(null)}
          offset={8}
        >
          {clickedCity.name}
        </Popup>
      )}
    </Map>
  );
}
