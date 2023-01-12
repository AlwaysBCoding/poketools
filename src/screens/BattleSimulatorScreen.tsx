import React, { useState, useEffect, ChangeEvent } from "react";
import useForceUpdate from "use-force-update";

import { PokemonTeam } from "../models/pokemon/PokemonTeam";
import { BattleAction, composeReplaceAction } from "../models/battle/BattleAction";
import { Battle, createBattle } from "../models/battle/Battle";
import { BattleSide, BattleSlot } from "../models/battle/BattleShared";

import { PokemonTeamDisplayIndex } from "../components/PokemonTeamDisplay";
import { BattleRenderer } from "../components/BattleRenderer";
import { Pokemon } from "../models/pokemon/Pokemon";
import { PokemonBattleState } from "../models/battle/PokemonBattleState";

export const BattleSimulatorScreen = () => {
  const forceUpdate = useForceUpdate();
  const [allTeams, setAllTeams] = useState<PokemonTeam[]>([]);
  const [blueTeamName, setBlueTeamName] = useState<string>("");
  const [redTeamName, setRedTeamName] = useState<string>("");
  const [activeBlueTeam, setActiveBlueTeam] = useState<PokemonTeam>();
  const [activeRedTeam, setActiveRedTeam] = useState<PokemonTeam>();
  const [battle, setBattle] = useState<Battle>();
  const [historicalBattleStates, setHistoricalBattleStates] = useState<{battle: Battle, battleActions: Record<string, any>}[]>([]);
  const [battleActions, setBattleActions] = useState<any>({});
  const [agentActions, setAgentActions] = useState<number[]>([]);

  const [blueTeamOrderString, setBlueTeamOrderString] = useState<string>("[]");
  const [redTeamOrderString, setRedTeamOrderString] = useState<string>("[]");

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
      setBlueTeamOrderString("[]");
    } else if(side === "red") {
      setRedTeamName(event.target.value);
      const nextTeam: PokemonTeam | undefined = allTeams.find((team: PokemonTeam) => { return team.team_name === event.target.value });
      if(nextTeam) {
        setActiveRedTeam(nextTeam);
      }
      setRedTeamOrderString("[]");
    }
  }

  const startBattle = async () => {
    if(activeBlueTeam && activeRedTeam) {
      const battle: Battle = createBattle({
        config: {variant: "doubles"},
        blueSidePokemonBuilds: activeBlueTeam.pokemonBuilds,
        redSidePokemonBuilds: activeRedTeam.pokemonBuilds,
        blueSidePokemonOrder: JSON.parse(blueTeamOrderString),
        redSidePokemonOrder: JSON.parse(redTeamOrderString)
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
      setHistoricalBattleStates([{
        battle: nextBattle,
        battleActions: nextBattleActions
      }]);
      forceUpdate();
    }
  }

  const selectBattleActions = async (battle: Battle, blueActions: BattleAction[], redActions: BattleAction[]) => {
    const fetchOptions = {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "battle": battle,
        "blue_actions": blueActions,
        "red_actions": redActions
      })
    }

    const response = await fetch("http://localhost:8000/send-battle-actions", fetchOptions);
    const result = await response.json();
    const nextBattle = result.battle;
    const nextBattleActions = result.actions;
    const nextAgentActions = result.agent_actions;
    setBattle(nextBattle);
    setBattleActions(nextBattleActions);
    setAgentActions(nextAgentActions);
    setHistoricalBattleStates(historicalBattleStates.concat({
      battle: nextBattle,
      battleActions: nextBattleActions
    }));
    forceUpdate();
  }

  const replacePokemonAction = async (battleAction: BattleAction) => {
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

    const response = await fetch("http://localhost:8000/send-replace-pokemon-action", fetchOptions);
    const result = await response.json();
    const nextBattle = result.battle;
    const nextBattleActions = result.actions;
    const nextAgentActions = result.agent_actions;
    setBattle(nextBattle);
    setBattleActions(nextBattleActions);
    setAgentActions(nextAgentActions);
    setHistoricalBattleStates(historicalBattleStates.concat({
      battle: nextBattle,
      battleActions: nextBattleActions
    }));
    forceUpdate();
  }

  console.log(battle);

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
          <div className="team-preview blue-team-preview">
            <PokemonTeamDisplayIndex team={activeBlueTeam} onPokemonBuildClick={(_, teamIndex) => { setBlueTeamOrderString(JSON.stringify(JSON.parse(blueTeamOrderString).concat(teamIndex))) }} />
            <input
              className="blue-team-order"
              value={blueTeamOrderString}
              onChange={(e) => { setBlueTeamOrderString(e.target.value); }} />
          </div>
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
          <div className="team-preview red-team-preview">
            <PokemonTeamDisplayIndex team={activeRedTeam} onPokemonBuildClick={(_, teamIndex) => { setRedTeamOrderString(JSON.stringify(JSON.parse(redTeamOrderString).concat(teamIndex))) }} />
            <input
            className="red-team-order"
            value={redTeamOrderString}
            onChange={(e) => { setRedTeamOrderString(e.target.value); }} />
          </div>
        ) : (<></>)}
      </div>
      <div className="button" onClick={startBattle}>
        <p className="button-text">START BATTLE</p>
      </div>
      <div className="battle-container">
        {battle ? (
          <BattleRenderer
            battle={battle}
            battleActions={battleActions}
            agentActions={agentActions}
            selectBattleActions={selectBattleActions}
            replacePokemonAction={replacePokemonAction}
            historicalBattleStates={historicalBattleStates}
            perspective="blue" />
        ): (<></>)}
      </div>
    </div>
  )

}
