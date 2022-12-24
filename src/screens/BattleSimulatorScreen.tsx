import React, { useState, useEffect, ChangeEvent } from "react";
import useForceUpdate from "use-force-update";

import { PokemonTeam } from "../models/pokemon/PokemonTeam";
import { BattleAction } from "../models/battle/BattleAction";
import { Battle, createBattle } from "../models/battle/Battle";
import { BattleSide } from "../models/battle/BattleShared";

import { PokemonTeamDisplayIndex } from "../components/PokemonTeamDisplay";
import { BattleRenderer } from "../components/BattleRenderer";

export const BattleSimulatorScreen = () => {
  const forceUpdate = useForceUpdate();
  const [allTeams, setAllTeams] = useState<PokemonTeam[]>([]);
  const [blueTeamName, setBlueTeamName] = useState<string>("");
  const [redTeamName, setRedTeamName] = useState<string>("");
  const [activeBlueTeam, setActiveBlueTeam] = useState<PokemonTeam>();
  const [activeRedTeam, setActiveRedTeam] = useState<PokemonTeam>();
  const [battle, setBattle] = useState<Battle>();
  const [battleActions, setBattleActions] = useState<BattleAction[]>([]);
  const [agentActions, setAgentActions] = useState<number[]>([]);

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

  const startBattle = async () => {
    if(activeBlueTeam && activeRedTeam) {
      const battle: Battle = createBattle({
        config: {variant: "singles"},
        blueSidePokemonBuilds: activeBlueTeam.pokemonBuilds,
        redSidePokemonBuilds: activeRedTeam.pokemonBuilds
      });
      setBattle(battle);

      const fetchOptions = {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(battle)
      }

      const response = await fetch("http://localhost:8000/start-battle", fetchOptions);
      const result = await response.json();
      const nextBattle = result.battle;
      const nextBattleActions = result.actions;
      const nextAgentActions = result.agent_actions;
      setBattle(nextBattle);
      setBattleActions(nextBattleActions);
      setAgentActions(nextAgentActions);
      forceUpdate();
    }
  }

  const selectBattleAction = async (battleAction: BattleAction) => {
    const fetchOptions = {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "battle": battle,
        "battle_action": battleAction
      })
    }

    const response = await fetch("http://localhost:8000/send-battle-action", fetchOptions);
    const result = await response.json();
    const nextBattle = result.battle;
    const nextBattleActions = result.actions;
    const nextAgentActions = result.agent_actions;
    setBattle(nextBattle);
    setBattleActions(nextBattleActions);
    setAgentActions(nextAgentActions);
    forceUpdate();
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
          <BattleRenderer
            battle={battle}
            battleActions={battleActions}
            agentActions={agentActions}
            selectBattleAction={selectBattleAction}
            perspective="blue" />
        ): (<></>)}
      </div>
    </div>
  )

}
