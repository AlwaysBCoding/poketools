import React, { useState } from "react";
import { PokemonBuild, pokemonBuildTemplateToPokemonBuild } from "../models/pokemon/PokemonBuild"
import { PokemonBuildTemplate } from "../models/pokemon/PokemonBuildTemplate";
import { PokemonTeam } from "../models/pokemon/PokemonTeam";

export const ImportTeamScreen = () => {
  const [importData, setImportData] = useState<string>("");

  const importTeam = () => {
    const data = JSON.parse(importData)
    const pokemonBuilds: PokemonBuild[] = data.map((pbt: PokemonBuildTemplate) => { return pokemonBuildTemplateToPokemonBuild(pbt) })
    const timestamp = Date.now();
    const team: PokemonTeam = {
      team_name: `Imported Team: ${timestamp}`,
      created_at: timestamp,
      pokemonBuilds
    }

    let nextSavedTeams: Record<string, PokemonTeam> = {};
    const savedTeams: Record<string, PokemonTeam> = JSON.parse(`${localStorage.getItem("savedTeams")}`);
    nextSavedTeams[team.team_name] = team;
    if(!savedTeams) {
      nextSavedTeams[team.team_name] = team;
    } else {
      nextSavedTeams = savedTeams;
      nextSavedTeams[team.team_name] = team;
    }
    localStorage.setItem("savedTeams", JSON.stringify(nextSavedTeams));
    alert("team imported");
  }

  return (
    <div className="screen import-team-screen">
      <h1>Import Team</h1>
      <div className="import-section">
        <textarea
          placeholder="ENTER JSON DATA"
          value={importData}
          onChange={(e) => { setImportData(e.target.value); }} />
      </div>
      <div className="button import-action" onClick={importTeam}>
        Import!
      </div>
    </div>
  )
}
