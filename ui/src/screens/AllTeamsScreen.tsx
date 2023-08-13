import React, { useState, useEffect } from "react";
import { PokemonTeam } from "../models/pokemon/PokemonTeam";

import { PokemonTeamDisplay } from "../components/PokemonTeamDisplay";

export const AllTeamsScreen = () => {

  const [teams, setTeams] = useState<PokemonTeam[]>([])

  useEffect(() => {

    const savedTeams: Record<string, PokemonTeam> = JSON.parse(`${localStorage.getItem("savedTeams")}`);
    const nextTeams: PokemonTeam[] = savedTeams ? Object.values(savedTeams) : [];

    setTeams(nextTeams);

  }, []);

  const onUpdate = () => {
    const savedTeams: Record<string, PokemonTeam> = JSON.parse(`${localStorage.getItem("savedTeams")}`);
    const nextTeams: PokemonTeam[] = savedTeams ? Object.values(savedTeams) : [];
    setTeams(nextTeams);
  }

  return (
    <div className="screen all-teams-screen">
      <h4>ALL TEAMS</h4>
      {teams.map((team, index) => {
        return (
          <PokemonTeamDisplay
            key={`pokemon-team-${index}`}
            team={team}
            config={{actions: true, editable: true, saveable: true, deleteable: true}}
            onUpdate={onUpdate}
            mode="list" />
        )
      })}
    </div>
  )

}
