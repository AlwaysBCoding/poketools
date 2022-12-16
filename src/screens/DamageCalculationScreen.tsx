import React, { useState, useEffect, ChangeEvent } from "react";
import useForceUpdate from "use-force-update";

import { Pokemon } from "../models/pokemon/Pokemon";
import { PokemonTeam } from "../models/pokemon/PokemonTeam";
import { PokemonBuild, createDefaultPokemonBuildForPokemonIdent } from "../models/pokemon/PokemonBuild";
import { PokemonMoveIdent } from "../models/pokemon/PokemonShared";

import { BattleState, createEmptyBattleState } from "../models/battle/BattleState";
import { PokemonBattleState, createNewPokemonBattleState } from "../models/battle/PokemonBattleState";
import { calculateDamage } from "../models/battle/damage-calc";

import { PokemonTeamDisplayIndex } from "../components/PokemonTeamDisplay";
import { PokemonBattleStateEditor } from "../components/PokemonBattleStateEditor";

import { toTitleCase, displayPercentage } from "../decorators/DecoratorsShared";

import AllPokemon from "../data/pokemon/all-pokemon.json";
const allPokemon = AllPokemon as Pokemon[];

const alphabeticalComp = (a: Pokemon, b: Pokemon): number => {
  if(a.ident > b.ident) { return 1; }
  if(b.ident > a.ident) { return -1; }
  if(a.ident === b.ident) { return 0; }
  return 0;
}

export const DamageCalculationScreen = () => {
  const forceUpdate = useForceUpdate();
  const [allTeams, setAllTeams] = useState<PokemonTeam[]>([])
  const [activeTeam, setActiveTeam] = useState<PokemonTeam>();
  const [selectedTeamName, setSelectedTeamName] = useState<string>();
  const [activeAttackingPokemonBattleState, setActiveAttackingPokemonBattleState] = useState<PokemonBattleState>();
  const [activeDefendingPokemonBattleState, setActiveDefendingPokemonBattleState] = useState<PokemonBattleState>();
  const [selectedTargetPokemonIdent, setSelectedTargetPokemonIdent] = useState<string>("");

  const emptyBattleState: BattleState = createEmptyBattleState();

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

  const handleSelectTargetPokemonIdent = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedTargetPokemonIdent(event.target.value);
    const nextPokemonBuild = createDefaultPokemonBuildForPokemonIdent(event.target.value);
    const nextPokemonBattleState = createNewPokemonBattleState(nextPokemonBuild);
    setActiveDefendingPokemonBattleState(nextPokemonBattleState);
  }

  const selectActiveAttackingPokemon = (pokemonBuild: PokemonBuild): void => {
    const nextActiveAttackingPokemonBattleState = createNewPokemonBattleState(pokemonBuild);
    setActiveAttackingPokemonBattleState(nextActiveAttackingPokemonBattleState);
  }

  const updateAttackingPokemonBattleState = (nextPokemonBattleState: PokemonBattleState): void => {
    setActiveAttackingPokemonBattleState(nextPokemonBattleState);
    forceUpdate();
  }

  const updateDefendingPokemonBattleState = (nextPokemonBattleState: PokemonBattleState): void => {
    setActiveDefendingPokemonBattleState(nextPokemonBattleState);
    forceUpdate();
  }

  return (
    <div className="screen damage-calculation-screen">
      <div className="target-pokemon-section">
        <select value={selectedTargetPokemonIdent} onChange={handleSelectTargetPokemonIdent}>
          <option value={""}>
              --Select a Target--
          </option>
          {allPokemon.sort(alphabeticalComp).map((pokemon: Pokemon, index: number) => {
            return (
              <option key={`pokemon-${index}`} value={pokemon.ident}>{toTitleCase(pokemon.ident)}</option>
            )
          })}
        </select>
      </div>
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
            <PokemonBattleStateEditor
              initialPokemonBattleState={activeAttackingPokemonBattleState}
              updatePokemonBattleState={updateAttackingPokemonBattleState} />
          ) : (<></>)}
        </div>
        <div className="pokemon-battle-state defending-pokemon">
          {activeDefendingPokemonBattleState ? (
            <PokemonBattleStateEditor
              initialPokemonBattleState={activeDefendingPokemonBattleState}
              updatePokemonBattleState={updateDefendingPokemonBattleState} />
          ) : (<></>)}
        </div>
      </div>
      {activeAttackingPokemonBattleState && activeDefendingPokemonBattleState ? (
        <div className="damage-calcs">
          <h4>DAMAGE CALCS</h4>
          {activeAttackingPokemonBattleState?.pokemon_build.move_idents.map((moveIdent: PokemonMoveIdent, index: number) => {
            const damageAmount = calculateDamage(
              emptyBattleState,
              activeAttackingPokemonBattleState,
              activeDefendingPokemonBattleState,
              moveIdent
            );
            return (
              <div className="move-damage-calc" key={`move-${index}`}>
                <p className="col-1 move-ident">{moveIdent}</p>
                <p className="col-2 move-damage">{damageAmount}</p>
                <p className="col-3 move-damage-percentage">{displayPercentage(damageAmount / activeDefendingPokemonBattleState.pokemon_build.stat_spread.hp)}</p>
              </div>
            )
          })}
        </div>
      ) : (<></>)}
    </div>
  )

}
