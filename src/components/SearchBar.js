import { useState } from "react";

export default function SearchBar({ onAdd }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const handleChange = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (!value) {
            setResults([]);
            return;
        }

        const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json?` +
            new URLSearchParams({
                access_token: process.env.REACT_APP_MAPBOX_TOKEN,
                types: "place",
                limit: 8,
                language: "en"
            })
        );

        const data = await res.json();
        setResults(data.features || []);
    };

    return (
        <div style={styles.container}>
            <input
                placeholder="Search cities..."
                value={query}
                onChange={handleChange}
                style={styles.input}
            />

            {results.length > 0 && (
                <div style={styles.dropdown}>
                    {results.map((feat) => (
                        <button
                            key={feat.id}
                            style={styles.option}
                            onClick={() => {
                                onAdd(feat);
                                setQuery("");
                                setResults([]);
                            }}
                        >
                            {feat.place_name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        position: "absolute",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
        width: 320,
    },
    input: {
        width: "100%",
        padding: "10px",
        fontSize: 14,
        boxSizing: "border-box"
    },
    dropdown: {
        background: "#fff",
        border: "1px solid #ccc",
        maxHeight: 220,
        overflowY: "auto"
    },
    option: {
        width: "100%",
        padding: "8px 10px",
        textAlign: "left",
        background: "none",
        border: "none",
        borderBottom: "1px solid #f0f0f0",
        cursor: "pointer",
        fontSize: 13
    }
};
