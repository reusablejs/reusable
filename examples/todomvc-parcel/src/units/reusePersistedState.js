import { reuseState, reuseEffect } from "reusable";

// custom hook:
export const reusePersistedState = (key, initialValue) => {
  const [value, setValue] = reuseState(() => {
    let persistedState = initialValue;
    try {
      persistedState = JSON.parse(localStorage.getItem(key));
    } catch (e) {
      console.error('cannot parse persisted state', e);
    }
    return persistedState;
  });

  reuseEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('cannot persist state', value);
    }
  }, [value, setValue]);

  return [value, setValue];
}
