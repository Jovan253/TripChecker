import { useMemo, useState } from "react";
import { CONTINENTS, COUNTRIES_BY_CONTINENT, getContinent, getCountryInfo } from "../utils/continents";

export default function StatsPanel({ countries, cities }) {
  const [expandedContinent, setExpandedContinent] = useState(null);

  const statsByContinent = useMemo(() => {
    const stats = Object.fromEntries(
      CONTINENTS.map((c) => [c, { countriesVisited: 0, citiesVisited: 0, isoCodes: [] }])
    );

    for (const iso of countries) {
      const continent = getContinent(iso);
      if (continent) {
        stats[continent].countriesVisited += 1;
        stats[continent].isoCodes.push(iso);
      }
    }

    for (const city of cities) {
      const continent = getContinent(city.country);
      if (continent) stats[continent].citiesVisited += 1;
    }

    return stats;
  }, [countries, cities]);

  return (
    <div style={styles.panel}>
      <div style={styles.summary}>
        {countries.length} countries &middot; {cities.length} cities
      </div>

      {CONTINENTS.map((continent) => {
        const { countriesVisited, citiesVisited, isoCodes } = statsByContinent[continent];
        const total = COUNTRIES_BY_CONTINENT[continent];
        const percent = total ? Math.round((countriesVisited / total) * 100) : 0;
        const visited = countriesVisited > 0;
        const expanded = expandedContinent === continent;

        return (
          <div key={continent}>
            <div
              style={{
                ...(visited ? styles.row : styles.rowDim),
                cursor: visited ? "pointer" : "default"
              }}
              onClick={() => visited && setExpandedContinent(expanded ? null : continent)}
            >
              <span style={styles.continentName}>
                {continent} {visited && (expanded ? "▾" : "▸")}
              </span>
              <span style={styles.rowStats}>
                {countriesVisited}/{total} countries ({percent}%) &middot; {citiesVisited} cities
              </span>
            </div>

            {expanded && (
              <div style={styles.flags}>
                {isoCodes.map((iso) => {
                  const info = getCountryInfo(iso);
                  return (
                    <span
                      key={iso}
                      title={info?.name || iso}
                      className={`fi fi-${iso.toLowerCase()}`}
                      style={styles.flag}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  panel: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 10,
    width: 280,
    maxHeight: "70vh",
    overflowY: "auto",
    padding: 16,
    borderRadius: 8,
    background: "#2B2A2A",
    border: "1px solid #555",
    display: "flex",
    flexDirection: "column",
    gap: 10
  },
  summary: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    paddingBottom: 8,
    borderBottom: "1px solid #555"
  },
  row: {
    display: "flex",
    flexDirection: "column",
    gap: 2
  },
  rowDim: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    opacity: 0.5
  },
  continentName: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600"
  },
  rowStats: {
    color: "#ccc",
    fontSize: 12
  },
  flags: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    paddingTop: 6
  },
  flag: {
    width: 24,
    height: 18,
    borderRadius: 2,
    cursor: "default"
  }
};
