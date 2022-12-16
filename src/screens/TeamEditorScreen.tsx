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
    }
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
          onPokemonBuildClick={onPokemonBuildClick} />
        {activePokemonBuild ? (
          <PokemonBuildEditor
            initialPokemonBuild={activePokemonBuild}
            updatePokemonBuildData={savePokemonBuildData} />
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
