import React, { useState, useEffect } from "react";
import { PokemonTeam } from "../models/pokemon/PokemonTeam";

import { PokemonTeamDisplay } from "../components/PokemonTeamDisplay";

export const AllTeamsScreen = () => {

  const [teams, setTeams] = useState<PokemonTeam[]>([])

  useEffect(() => {

    const savedTeams: Record<string, PokemonTeam> = JSON.parse(`${localStorage.getItem("savedTeams")}`);
    const nextTeams: PokemonTeam[] = Object.values(savedTeams);
    setTeams(nextTeams);

  }, [])

  return (
    <div className="screen all-teams-screen">
      <h4>ALL TEAMS</h4>
      {teams[0] ? (
        <PokemonTeamDisplay team={teams[0]} />
      ) : (<></>)}
    </div>
  )

}
