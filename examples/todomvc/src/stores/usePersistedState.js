import { useState, useEffect } from "react";

// custom hook:
export const usePersistedState = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    let persistedState = initialValue;
    try {
      persistedState = JSON.parse(localStorage.getItem(key));
    } catch (e) {
      console.error('cannot parse persisted state', e);
    }
    return persistedState;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('cannot persist state', value);
    }
  }, [value, setValue]);

  return [value, setValue];
}
