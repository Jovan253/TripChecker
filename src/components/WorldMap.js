import { useState, useMemo } from "react";
import Map from "react-map-gl/mapbox";
import { Source, Layer, Popup } from "react-map-gl/mapbox";
import { lerpColor } from "../utils/colorScale";

const UNVISITED_COLOR = "#2B2A2A";
const LIGHT_VISITED_COLOR = "#6C86D6";
const MEDIUM_VISITED_COLOR = lerpColor(LIGHT_VISITED_COLOR, "#111A47", 0.5);
const DARK_VISITED_COLOR = "#111A47";

function colorForCityCount(count) {
  if (count >= 5) return DARK_VISITED_COLOR;
  if (count >= 2) return MEDIUM_VISITED_COLOR;
  return LIGHT_VISITED_COLOR;
}

function buildCountryFillColor(selected, cityCountByCountry) {
  if (selected.length === 0) {
    return UNVISITED_COLOR;
  }

  const matchExpression = ["match", ["get", "iso_3166_1"]];
  for (const iso of selected) {
    matchExpression.push(iso, colorForCityCount(cityCountByCountry[iso] || 0));
  }
  matchExpression.push(UNVISITED_COLOR);

  return matchExpression;
}

const countryFillLayer = (selected, cityCountByCountry) => ({
  id: "country-fills",
  type: "fill",
  source: "countries",
  "source-layer": "country_boundaries",
  paint: {
    "fill-color": buildCountryFillColor(selected, cityCountByCountry),
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

export default function WorldMap({ selectedCountry, selectedCities, cityCountByCountry = {}, onRemoveCity }) {
  const [hoverInfo, setHoverInfo] = useState(null);
  const [clickedCity, setClickedCity] = useState(null);

  const fillLayer = useMemo(
    () => countryFillLayer(selectedCountry, cityCountByCountry),
    [selectedCountry, cityCountByCountry]
  );

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
            id: feature.properties.id,
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
        <Layer {...fillLayer} />
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
              id: city.id,
              name: city.name,
            },
            geometry: {
              type: "Point",
              coordinates: [city.lng, city.lat]
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
          <div style={styles.clickedCityPopup}>
            <span>{clickedCity.name}</span>
            <button
              style={styles.removeButton}
              onClick={() => {
                onRemoveCity(clickedCity.id);
                setClickedCity(null);
              }}
            >
              Remove
            </button>
          </div>
        </Popup>
      )}
    </Map>
  );
}

const styles = {
  clickedCityPopup: {
    display: "flex",
    alignItems: "center",
    gap: 8
  },
  removeButton: {
    padding: "2px 8px",
    fontSize: 12,
    borderRadius: 4,
    border: "1px solid #C73428",
    background: "none",
    color: "#C73428",
    cursor: "pointer"
  }
};
