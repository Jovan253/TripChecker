export async function findRegionForCity(cityCoords) {
  const [lng, lat] = cityCoords; // Mapbox format: [longitude, latitude]

  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?` +
    new URLSearchParams({
      lat,
      lon: lng,
      zoom: 5,
      polygon_geojson: 1,
      polygon_threshold: "0.005",
      format: "json"
    }),
    { headers: { "User-Agent": "TripChecker/1.0" } }
  );

  const data = await res.json();
  console.log('[region] Nominatim reverse result:', data.display_name, data.geojson?.type);

  if (!data.geojson) return null;

  return {
    id: `${data.osm_type}${data.osm_id}`,
    name: data.address?.state || data.address?.region || data.name,
    geometry: data.geojson
  };
}
