import { useEffect, useState } from "react";

const STORAGE_KEY = "trip-checker-v1";

export function useTravelStorage() {
    const [data, setData] = useState(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : { countries: [], cities: []};
        } catch {
            return { countries: [], cities: []};
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [data]);

    return [data, setData];
}