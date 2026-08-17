import countries from "world-countries";

const SUBREGION_TO_CONTINENT = {
  "Eastern Africa": "Africa",
  "Middle Africa": "Africa",
  "Northern Africa": "Africa",
  "Southern Africa": "Africa",
  "Western Africa": "Africa",

  "Central Asia": "Asia",
  "Eastern Asia": "Asia",
  "South-Eastern Asia": "Asia",
  "Southern Asia": "Asia",
  "Western Asia": "Asia",

  "Eastern Europe": "Europe",
  "Northern Europe": "Europe",
  "Southern Europe": "Europe",
  "Western Europe": "Europe",
  "Central Europe": "Europe",
  "Southeast Europe": "Europe",

  "North America": "North America",
  "Central America": "North America",
  "Caribbean": "North America",

  "South America": "South America",

  "Australia and New Zealand": "Oceania",
  "Melanesia": "Oceania",
  "Micronesia": "Oceania",
  "Polynesia": "Oceania"
};

export const CONTINENTS = ["Africa", "Asia", "Europe", "North America", "South America", "Oceania"];

const ISO_TO_CONTINENT = {};
const ISO_TO_COUNTRY_INFO = {};
const COUNTRIES_BY_CONTINENT = Object.fromEntries(CONTINENTS.map((c) => [c, 0]));

for (const country of countries) {
  const continent = SUBREGION_TO_CONTINENT[country.subregion];
  if (!continent) continue;
  ISO_TO_CONTINENT[country.cca2] = continent;
  ISO_TO_COUNTRY_INFO[country.cca2] = { name: country.name.common, flag: country.flag };
  COUNTRIES_BY_CONTINENT[continent] += 1;
}

export { COUNTRIES_BY_CONTINENT };

export function getContinent(iso2) {
  return ISO_TO_CONTINENT[iso2];
}

export function getCountryInfo(iso2) {
  return ISO_TO_COUNTRY_INFO[iso2];
}
