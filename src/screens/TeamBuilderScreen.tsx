import React, { useState, useEffect } from "react";
import useForceUpdate from "use-force-update";

import AllPokemon from "../data/pokemon/all-pokemon.json";
import { Pokemon } from "../models/pokemon/Pokemon";
import { PokemonBuild, createDefaultPokemonBuildForPokemon } from "../models/pokemon/PokemonBuild";
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
  }, [searchString]);

  const selectPokemon = (pokemon: Pokemon) => {
    let nextTeam = team;
    nextTeam.pokemonBuilds.push(createDefaultPokemonBuildForPokemon(pokemon));
    setTeam(nextTeam);
    setSearchString("");
    forceUpdate();
  }

  const saveTeam = () => {
    let nextSavedTeams: Record<string, PokemonTeam> = {};
    const savedTeams: Record<string, PokemonTeam> = JSON.parse(`${localStorage.getItem("savedTeams")}`);
    if(!savedTeams) {
      nextSavedTeams[team.team_name] = team;
    } else {
      nextSavedTeams = savedTeams;
      nextSavedTeams[team.team_name] = team;
    }
    localStorage.setItem("savedTeams", JSON.stringify(nextSavedTeams));
  }

  return (
    <div className="screen team-builder-screen">
      <div className="team-name-section">
        <h1>{team.team_name}</h1>
        <div
          className="button"
          onClick={saveTeam}>
          <p className="button-text">SAVE</p>
        </div>
      </div>
      <div className="pokemon-select">
        <input
          className="pokemon-select-input"
          placeholder="SEARCH POKEMON"
          value={searchString}
          onChange={(e) => { setSearchString(e.target.value) }} />
        <div className="pokemon-data-table-container">
          <PokemonDataTable
            pokemonList={filteredPokemon.slice(0, 5)}
            clickable={true}
            onPokemonClick={(pokemon: Pokemon) => { selectPokemon(pokemon); }}
            displayBaseStats={false} />
        </div>
      </div>
      <div className="team-display-container">
        <PokemonTeamDisplay team={team} />
      </div>
      <div className="team-resistances-container">
        <PokemonTeamResistancesDisplay team={team} />
      </div>
    </div>
  )

}
