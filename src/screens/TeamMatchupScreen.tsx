import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { PokemonTeam } from "../models/pokemon/PokemonTeam";

import { PokemonTeamResistancesDisplay } from "../components/PokemonTeamResistancesDisplay";

export const TeamMatchupScreen = () => {
  const location = useLocation();
  const [team, setTeam] = useState<PokemonTeam>();

  useEffect(() => {
    const teamName = location.state.teamName;
    const savedTeams = JSON.parse(`${localStorage.getItem("savedTeams")}`);
    const teamData: PokemonTeam = savedTeams[teamName] as PokemonTeam;
    setTeam(teamData);
  }, [location.state.teamName]);

  if(team) {
    return (
      <div className="screen team-matchup-screen">
        <div className="tema-resistances-container">
          <PokemonTeamResistancesDisplay team={team} />
        </div>
      </div>
    )
  } else {
    return (
      <div className="screen team-matchup-screen">
      </div>
    )
  }
}
