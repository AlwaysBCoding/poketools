import React, { useState, useEffect, KeyboardEvent } from "react";
import useForceUpdate from "use-force-update";

import AllPokemon from "../data/pokemon/all-pokemon.json";
import { Pokemon } from "../models/pokemon/Pokemon";
import { createDefaultPokemonBuildForPokemon, createDefaultPokemonBuildForPokemonIdent } from "../models/pokemon/PokemonBuild";
import { PokemonTeam, createNewPokemonTeam } from "../models/pokemon/PokemonTeam";
import { calculatePokemonTotalStats } from "../models/pokemon/PokemonShared";

import { PokemonDataTable } from "../components/PokemonDataTable";
import { PokemonTeamDisplay } from "../components/PokemonTeamDisplay";
import { PokemonTeamResistancesDisplay } from "../components/PokemonTeamResistancesDisplay";

export const TeamBuilderScreen = () => {
  const forceUpdate = useForceUpdate();
  const allPokemon = AllPokemon as Pokemon[];

  const [searchString, setSearchString] = useState<string>("");
  const [team, setTeam] = useState<PokemonTeam>(createNewPokemonTeam());
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>(allPokemon);

  useEffect(() => {
    const nextFilteredPokemon = allPokemon.filter((pokemon) => {
      return pokemon.ident.includes(searchString);
    });
    nextFilteredPokemon.sort((pokemonA, pokemonB) => { return calculatePokemonTotalStats(pokemonB.base_stats) - calculatePokemonTotalStats(pokemonA.base_stats) });
    setFilteredPokemon(nextFilteredPokemon);
    // eslint-disable-next-line
  }, [searchString]);

  const keyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if(event.key === "Enter") {
      selectPokemon(filteredPokemon[0]);
    }
  }

  const selectPokemon = (pokemon: Pokemon) => {
    let nextTeam = team;
    nextTeam.pokemonBuilds.push(createDefaultPokemonBuildForPokemon(pokemon));
    setTeam(nextTeam);
    setSearchString("");
    forceUpdate();
  }

  return (
    <div className="screen team-builder-screen">
      <div className="pokemon-select">
        <input
          className="pokemon-select-input"
          placeholder="SEARCH POKEMON"
          value={searchString}
          onKeyPress={keyPressHandler}
          onChange={(e) => { setSearchString(e.target.value) }} />
        <div className="pokemon-data-table-container">
          <PokemonDataTable
            pokemonList={filteredPokemon}
            clickable={true}
            onPokemonClick={(pokemon: Pokemon) => { selectPokemon(pokemon); }}
            displayBaseStats={false} />
        </div>
      </div>
      <div className="team-display-container">
        <PokemonTeamDisplay
          team={team}
          config={{editable: true, saveable: true}}
          mode="show" />
      </div>
      <div className="team-resistances-container">
        <PokemonTeamResistancesDisplay team={team} />
      </div>
    </div>
  )

}
