import { useEffect, useState } from "react";
import { createStore } from "reusable";

import { usePlanets } from "./planets.store";
import { useApi } from "./api.store";

export const useCharacters = createStore(() => {
  const [characters, setCharacters] = useState([]);
  const { get } = useApi();
  const {
    planets,
    initializePlanetEmptyMap,
    setAsyncPlanetData
  } = usePlanets();
  useEffect(() => {
    try {
      handleAsyncCharactersData();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleAsyncCharactersData = async () => {
    const data = await get("https://swapi.co/api/people");
    const charactersData = data.results;
    setCharacters(charactersData);
    initializePlanetEmptyMap(charactersData);
    await setAsyncCharactersData(charactersData);
  };

  const setAsyncCharactersData = async data => {
    await setAsyncPlanetData();
    data.map(character => {
      character.planet = planets.get(character.homeworld);
    });
    setCharacters([...data]);
  };
  return {
    characters,
    setCharacters
  };
});
