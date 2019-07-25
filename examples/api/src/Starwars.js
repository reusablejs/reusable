import React from "react";

import { Table } from "./components/Table";
import { Loader } from "./components/Loader";
import { useCharacters } from "./stores/characters.store";
import { useLoadingState } from "./stores/loadingState.store";

export const Starwars = () => {
  const { characters } = useCharacters();
  const { loading } = useLoadingState();
  const columns = ["name", "gender", "birth_year", "height", "planet"];
  return (
    <React.Fragment>
      {loading || !characters.length ? (
        <Loader size="md" />
      ) : (
        <Table data={characters} columns={columns} />
      )}
    </React.Fragment>
  );
};
