import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useForceUpdate from "use-force-update";

import { Pokemon } from "../models/pokemon/Pokemon";
import { PokemonTeam } from "../models/pokemon/PokemonTeam";
import { PokemonBuild, createDefaultPokemonBuildForPokemonIdent } from "../models/pokemon/PokemonBuild";

import { PokemonBuildEditor } from "../components/PokemonBuildEditor";
import { PokemonTeamDisplayIndex } from "../components/PokemonTeamDisplay";
import { PokemonTeamResistancesDisplay } from "../components/PokemonTeamResistancesDisplay";

import AllPokemon from "../data/pokemon/all-pokemon.json";
const allPokemon = AllPokemon as Pokemon[];

export const TeamEditorScreen = () => {
  const forceUpdate = useForceUpdate();
  const location = useLocation();
  const [team, setTeam] = useState<PokemonTeam>();
  const [activePokemonBuild, setActivePokemonBuild] = useState<PokemonBuild>();
  const [activeTeamIndex, setActiveTeamIndex] = useState<number | undefined>(undefined);

  useEffect(() => {
    const teamName = location.state.teamName;
    const savedTeams = JSON.parse(`${localStorage.getItem("savedTeams")}`);
    const teamData: PokemonTeam = savedTeams[teamName] as PokemonTeam;
    setTeam(teamData);
  }, [location.state.teamName]);

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
      forceUpdate();
    }
  }

  const onAddNewPokemonClick = (teamIndex: number) => {
    const nextTeam = team;
    const randomPokemonData = allPokemon[Math.floor(Math.random()*allPokemon.length)];
    const nextPokemonBuild = createDefaultPokemonBuildForPokemonIdent(randomPokemonData.ident);
    nextTeam!.pokemonBuilds[teamIndex] = nextPokemonBuild;
    setTeam(nextTeam);
    setActiveTeamIndex(teamIndex);
    setActivePokemonBuild(nextPokemonBuild);
  }

  const onPokemonBuildClick = (pokemonBuild: PokemonBuild, teamIndex: number) => {
    setActiveTeamIndex(teamIndex);
    setActivePokemonBuild(pokemonBuild);
  }

  if(team) {
    return (
      <div className="screen team-editor-screen">
        <PokemonTeamDisplayIndex
          team={team}
          activeTeamIndex={activeTeamIndex}
          numberOfSlots={6}
          onPokemonBuildClick={onPokemonBuildClick}
          onAddNewPokemonClick={onAddNewPokemonClick} />
        {activePokemonBuild ? (
          <PokemonBuildEditor
            initialPokemonBuild={activePokemonBuild}
            updatePokemonBuildData={savePokemonBuildData} />
        ) : (<></>)}
        <div className="team-resistances-container">
          <PokemonTeamResistancesDisplay team={team} />
        </div>
      </div>
      )
  } else {
    return (
      <div className="screen team-editor-screen">
      </div>
    )
  }
}
