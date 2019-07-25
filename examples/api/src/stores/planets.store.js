import { useState } from "react";
import { createStore } from "reusable";
import { useApi } from "./api.store";

export const usePlanets = createStore(() => {
  const [planets, setPlanets] = useState(new Map());
  const { get } = useApi();
  const initializePlanetEmptyMap = data => {
    data.map(character => {
      if (!planets.has(character.homeworld)) {
        //setting an empty map of "planetUrl" => ""
        setPlanets(planets.set(character.homeworld, ""));
      }
    });
  };
  const setAsyncPlanetData = async () => {
    let promises = [];
    planets.forEach((value, key) => {
      promises.push(get(key));
    });
    const values = await Promise.all(promises);
    Object.keys(values).forEach(key => {
      setPlanets(planets.set(values[key].url, values[key].name));
    });
  };
  return {
    planets,
    setPlanets,
    initializePlanetEmptyMap,
    setAsyncPlanetData
  };
});
