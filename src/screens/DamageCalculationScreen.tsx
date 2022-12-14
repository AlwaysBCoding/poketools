import React, { useState, useEffect, ChangeEvent } from "react";

import { PokemonTeam } from "../models/pokemon/PokemonTeam";
import { PokemonBuild } from "../models/pokemon/PokemonBuild";
import { BattleState } from "../models/battle/BattleState";
import { PokemonBattleState, createNewPokemonBattleState } from "../models/battle/PokemonBattleState";

import { PokemonTeamDisplayIndex } from "../components/PokemonTeamDisplay";
import { PokemonBattleStateEditor } from "../components/PokemonBattleStateEditor";

export const DamageCalculationScreen = () => {
  const [allTeams, setAllTeams] = useState<PokemonTeam[]>([])
  const [activeTeam, setActiveTeam] = useState<PokemonTeam>();
  const [selectedTeamName, setSelectedTeamName] = useState<string>();
  const [activeAttackingPokemonBattleState, setActiveAttackingPokemonBattleState] = useState<PokemonBattleState>();
  const [activeDefendingPokemonBattleState, setActiveDefendingPokemonBattleState] = useState<PokemonBattleState>();

  useEffect(() => {

    const savedTeams: Record<string, PokemonTeam> = JSON.parse(`${localStorage.getItem("savedTeams")}`);
    const nextTeams: PokemonTeam[] = Object.values(savedTeams);

    setAllTeams(nextTeams);

  }, []);

  const handleSelectTeamNameChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeamName(event.target.value);
    const nextTeam: PokemonTeam | undefined = allTeams.find((team: PokemonTeam) => { return team.team_name === event.target.value });
    if(nextTeam) {
      setActiveTeam(nextTeam);
    }
  }

  const selectActiveAttackingPokemon = (pokemonBuild: PokemonBuild): void => {
    const nextActiveAttackingPokemonBattleState = createNewPokemonBattleState(pokemonBuild);
    setActiveAttackingPokemonBattleState(nextActiveAttackingPokemonBattleState);
  }

  return (
    <div className="screen damage-calculation-screen">
      <div className="active-team-section">
        <div className="active-team-select">
          <select value={selectedTeamName} onChange={handleSelectTeamNameChange}>
            <option value={""}>
              --Select a Team--
            </option>
            {allTeams.map((team: PokemonTeam, index: number) => {
              return (
                <option key={`team-option-${index}`} value={team.team_name}>
                  {team.team_name}
                </option>
              )
            })}
            </select>
        </div>
        {activeTeam ? (
          <div className="active-team-display">
            <PokemonTeamDisplayIndex team={activeTeam} onPokemonBuildClick={selectActiveAttackingPokemon} />
          </div>
        ) : (<></>)
        }
      </div>
      <div className="pokemon-battle-states">
        <div className="pokemon-battle-state attacking-pokemon">
          {activeAttackingPokemonBattleState ? (
            <PokemonBattleStateEditor initialPokemonBattleState={activeAttackingPokemonBattleState} />
          ) : (<></>)}
        </div>
        <div className="pokemon-battle-state defending-pokemon">
          {activeDefendingPokemonBattleState ? (
            <PokemonBattleStateEditor initialPokemonBattleState={activeDefendingPokemonBattleState} />
          ) : (<></>)}
        </div>
      </div>
    </div>
  )

}
