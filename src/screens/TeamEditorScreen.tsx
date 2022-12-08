import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { PokemonTeam } from "../models/pokemon/PokemonTeam";
import { PokemonBuild } from "../models/pokemon/PokemonBuild";

import { PokemonBuildEditor } from "../components/PokemonBuildEditor";
import { PokemonTeamDisplayIndex } from "../components/PokemonTeamDisplay";

export const TeamEditorScreen = () => {
  const location = useLocation();
  const [team, setTeam] = useState<PokemonTeam>();
  const [activePokemonBuild, setActivePokemonBuild] = useState<PokemonBuild>();

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
    if(team) {
      let nextPokemonTeam = team;
      const targetIndex = team.pokemonBuilds.findIndex((pokemonBuild) => { return pokemonBuild.pokemon.ident === pokemonBuildData.pokemon.ident });
      nextPokemonTeam.pokemonBuilds[targetIndex] = pokemonBuildData;
      savePokemonTeam(nextPokemonTeam);
    }
  }

  const onPokemonBuildClick = (pokemonBuild: PokemonBuild, teamIndex: number) => {
    setActivePokemonBuild(pokemonBuild);
  }

  if(team) {
    return (
      <div className="screen team-editor-screen">
        <PokemonTeamDisplayIndex
          team={team}
          onPokemonBuildClick={onPokemonBuildClick} />
        {activePokemonBuild ? (
          <PokemonBuildEditor
            initialPokemonBuild={activePokemonBuild}
            savePokemonBuildData={savePokemonBuildData} />
        ) : (<></>)}
      </div>
      )
  } else {
    return (
      <div className="screen team-editor-screen">
      </div>
    )
  }
}
