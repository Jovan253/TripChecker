import { useEffect, useState } from "react";

const STORAGE_KEY = "trip-checker-v1";

export function useTravelStorage() {
    const [data, setData] = useState(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return { countries: [], cities: [], regions: [] };
            const parsed = JSON.parse(raw);
            return {
                countries: parsed.countries || [],
                cities: parsed.cities || [],
                regions: parsed.regions || []
            };
        } catch {
            return { countries: [], cities: [], regions: [] };
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [data]);

    return [data, setData];
}