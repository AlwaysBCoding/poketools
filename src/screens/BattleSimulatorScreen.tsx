import React, { useState, useEffect, ChangeEvent } from "react";

import { PokemonTeam } from "../models/pokemon/PokemonTeam";
import { Battle, createBattle } from "../models/battle/Battle";
import { BattleSide } from "../models/battle/BattleShared";

import { PokemonTeamDisplayIndex } from "../components/PokemonTeamDisplay";
import { BattleRenderer } from "../components/BattleRenderer";

export const BattleSimulatorScreen = () => {
  const [allTeams, setAllTeams] = useState<PokemonTeam[]>([]);
  const [blueTeamName, setBlueTeamName] = useState<string>("");
  const [redTeamName, setRedTeamName] = useState<string>("");
  const [activeBlueTeam, setActiveBlueTeam] = useState<PokemonTeam>();
  const [activeRedTeam, setActiveRedTeam] = useState<PokemonTeam>();
  const [battle, setBattle] = useState<Battle>();

  useEffect(() => {
    const savedTeams: Record<string, PokemonTeam> = JSON.parse(`${localStorage.getItem("savedTeams")}`);
    const nextTeams: PokemonTeam[] = Object.values(savedTeams);
    setAllTeams(nextTeams);
  }, []);

  const handleSelectTeamNameChange = (event: ChangeEvent<HTMLSelectElement>, side: BattleSide) => {
    if(side === "blue") {
      setBlueTeamName(event.target.value);
      const nextTeam: PokemonTeam | undefined = allTeams.find((team: PokemonTeam) => { return team.team_name === event.target.value });
      if(nextTeam) {
        setActiveBlueTeam(nextTeam);
      }
    } else if(side === "red") {
      setRedTeamName(event.target.value);
      const nextTeam: PokemonTeam | undefined = allTeams.find((team: PokemonTeam) => { return team.team_name === event.target.value });
      if(nextTeam) {
        setActiveRedTeam(nextTeam);
      }
    }
  }

  const startBattle = () => {
    if(activeBlueTeam && activeRedTeam) {
      const battle: Battle = createBattle({
        config: {variant: "singles"},
        blueSidePokemonBuilds: activeBlueTeam.pokemonBuilds,
        redSidePokemonBuilds: activeRedTeam.pokemonBuilds
      });
      setBattle(battle);
    }
  }

  return (
    <div className="screen battle-simulator-screen">
      <div className="blue-team-select">
        <select value={blueTeamName} onChange={(e) => { handleSelectTeamNameChange(e, "blue") }}>
          <option value={""} disabled={true}>
            --Blue Team--
          </option>
          {allTeams.map((team: PokemonTeam, index: number) => {
            return (
              <option key={`team-option-${index}`} value={team.team_name}>
                {team.team_name}
              </option>
            )
          })}
        </select>
        {activeBlueTeam ? (
          <PokemonTeamDisplayIndex team={activeBlueTeam} />
        ) : (<></>)}
      </div>
      <div className="red-team-select">
        <select value={redTeamName} onChange={(e) => { handleSelectTeamNameChange(e, "red") }}>
          <option value={""} disabled={true}>
            --Red Team--
          </option>
          {allTeams.map((team: PokemonTeam, index: number) => {
            return (
              <option key={`team-option-${index}`} value={team.team_name}>
                {team.team_name}
              </option>
            )
          })}
        </select>
        {activeRedTeam ? (
          <PokemonTeamDisplayIndex team={activeRedTeam} />
        ) : (<></>)}
      </div>
      <div className="button" onClick={startBattle}>
        <p>START BATTLE</p>
      </div>
      <div className="battle-container">
        {battle ? (
          <BattleRenderer battle={battle} />
        ): (<></>)}
      </div>
    </div>
  )

}
