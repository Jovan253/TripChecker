import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

const STORAGE_KEY = "trip-checker-v1";
const DEFAULT_DATA = { countries: [], cities: [] };

export function useTravelData() {
  const { user } = useAuth();
  const [data, setDataState] = useState(DEFAULT_DATA);

  useEffect(() => {
    if (!user) {
      setDataState(DEFAULT_DATA);
      return;
    }

    const docRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setDataState(snap.data());
      } else {
        let initial = DEFAULT_DATA;
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            initial = {
              countries: parsed.countries || [],
              cities: (parsed.cities || []).map((city) => {
                if (Array.isArray(city.center)) {
                  const { center, ...rest } = city;
                  return { ...rest, lng: center[0], lat: center[1] };
                }
                return city;
              })
            };
          }
        } catch {
          initial = DEFAULT_DATA;
        }
        setDoc(docRef, initial);
      }
    });

    return unsubscribe;
  }, [user]);

  const setData = (updater) => {
    setDataState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (user) {
        setDoc(doc(db, "users", user.uid), next);
      }
      return next;
    });
  };

  return [data, setData];
}
