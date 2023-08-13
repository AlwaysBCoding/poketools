import React, { useState, useEffect, KeyboardEvent } from "react";
import useForceUpdate from "use-force-update";

import { Pokemon } from "../models/pokemon/Pokemon";
import { PokemonBuild, createDefaultPokemonBuildForPokemonIdent } from "../models/pokemon/PokemonBuild";
import { PokemonTeam, createNewPokemonTeam } from "../models/pokemon/PokemonTeam";

import { PokemonBuildEditor } from "../components/PokemonBuildEditor";
import { PokemonTeamDisplayIndex } from "../components/PokemonTeamDisplay";
import { PokemonTeamResistancesDisplay } from "../components/PokemonTeamResistancesDisplay";
import { PokemonBuildUsageData } from "../components/PokemonBuildUsageData";

import AllPokemon from "../data/pokemon/all-pokemon.json";
const allPokemon = AllPokemon as Pokemon[];

export const TeamBuilderScreen = () => {
  const forceUpdate = useForceUpdate();
  const initialTeam = createNewPokemonTeam();

  const [team, setTeam] = useState<PokemonTeam>(initialTeam);
  const [teamNameString, setTeamNameString] = useState<string>(initialTeam.team_name);
  const [activeTeamIndex, setActiveTeamIndex] = useState<number | undefined>(undefined);
  const [activePokemonBuild, setActivePokemonBuild] = useState<PokemonBuild>();

  useEffect(() => {
    team.team_name = teamNameString;
    // eslint-disable-next-line
  }, [teamNameString]);

  const onPokemonBuildClick = (pokemonBuild: PokemonBuild, teamIndex: number) => {
    setActiveTeamIndex(teamIndex);
    setActivePokemonBuild(pokemonBuild);
  }

  const onAddNewPokemonClick = (teamIndex: number) => {
    const nextTeam = team;
    const nextPokemonBuild = createDefaultPokemonBuildForPokemonIdent(allPokemon[Math.floor(Math.random()*allPokemon.length)].ident);
    nextTeam.pokemonBuilds[teamIndex] = nextPokemonBuild;
    setTeam(nextTeam);
    setActiveTeamIndex(teamIndex);
    setActivePokemonBuild(nextPokemonBuild);
  }

  const savePokemonTeam = (team: PokemonTeam) => {
    const savedTeams: Record<string, PokemonTeam> = JSON.parse(`${localStorage.getItem("savedTeams")}`);
    let nextSavedTeams = savedTeams;
    nextSavedTeams[team.team_name] = team;
    localStorage.setItem("savedTeams", JSON.stringify(nextSavedTeams));
  }

  const savePokemonBuildData = (pokemonBuildData: PokemonBuild) => {
    if(team && activeTeamIndex !== undefined) {
      let nextPokemonTeam = team;
      nextPokemonTeam.pokemonBuilds[activeTeamIndex] = pokemonBuildData;
      savePokemonTeam(nextPokemonTeam);
      setActivePokemonBuild(pokemonBuildData);
      forceUpdate();
    }
  }

  return (
    <div className="screen team-builder-screen">
      <div className="team-display-container">
        <input
          className="team-name"
          placeholder={`DEFAULT TEAM`}
          value={teamNameString}
          onChange={(e) => { setTeamNameString(e.target.value) }} />
        <PokemonTeamDisplayIndex
          team={team}
          activeTeamIndex={activeTeamIndex}
          numberOfSlots={6}
          onPokemonBuildClick={onPokemonBuildClick}
          onAddNewPokemonClick={onAddNewPokemonClick} />
        {activePokemonBuild ? (
          <div className="pokemon-build-editor-container">
            <PokemonBuildEditor
              initialPokemonBuild={activePokemonBuild}
              updatePokemonBuildData={savePokemonBuildData} />
            <PokemonBuildUsageData
              pokemonBuild={activePokemonBuild} />
          </div>
        ) : (<></>)}
      </div>
      <div className="team-resistances-container">
        <PokemonTeamResistancesDisplay team={team} />
      </div>
    </div>
  )

}
