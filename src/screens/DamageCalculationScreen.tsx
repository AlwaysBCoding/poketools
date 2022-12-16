import React, { useState, useEffect, ChangeEvent } from "react";
import useForceUpdate from "use-force-update";
import CountUp from "react-countup";

import { Pokemon } from "../models/pokemon/Pokemon";
import { PokemonTeam } from "../models/pokemon/PokemonTeam";
import { PokemonBuild, createDefaultPokemonBuildForPokemonIdent } from "../models/pokemon/PokemonBuild";
import { PokemonMoveIdent } from "../models/pokemon/PokemonShared";

import { BattleState, createEmptyBattleState } from "../models/battle/BattleState";
import { PokemonBattleState, createNewPokemonBattleState, createDefaultPokemonBattleStateForPokemonIdent } from "../models/battle/PokemonBattleState";
import { calculateDamage } from "../models/battle/damage-calc";

import { PokemonTeamDisplayIndex } from "../components/PokemonTeamDisplay";
import { PokemonBattleStateEditor } from "../components/PokemonBattleStateEditor";

import { displayPokemonMove } from "../decorators/PokemonMove";

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
  const [selectedTeamName, setSelectedTeamName] = useState<string>("");
  const [activeAttackingPokemonBattleState, setActiveAttackingPokemonBattleState] = useState<PokemonBattleState>();
  const [activeDefendingPokemonBattleState, setActiveDefendingPokemonBattleState] = useState<PokemonBattleState>(
    createDefaultPokemonBattleStateForPokemonIdent("hydreigon")
  );
  const [selectedTargetPokemonIdent, setSelectedTargetPokemonIdent] = useState<string>("");
  const [activeTeamIndex, setActiveTeamIndex] = useState<number | undefined>(undefined);

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

  const onPokemonBuildClick = (pokemonBuild: PokemonBuild, teamIndex: number) => {
    setActiveTeamIndex(teamIndex);
    selectActiveAttackingPokemon(pokemonBuild);
  }

  let attackingPokemonDamageCalcs: number[][] = [];
  let defendingPokemonDamageCalcs: number[][] = [];

  if(activeAttackingPokemonBattleState && activeDefendingPokemonBattleState) {
    attackingPokemonDamageCalcs = activeAttackingPokemonBattleState.pokemon_build.move_idents.map((moveIdent: PokemonMoveIdent) => {
      const lowRollDamageAmount = calculateDamage(
        emptyBattleState,
        activeAttackingPokemonBattleState,
        activeDefendingPokemonBattleState,
        moveIdent,
        0.85
      );
      const highRollDamageAmount = calculateDamage(
        emptyBattleState,
        activeAttackingPokemonBattleState,
        activeDefendingPokemonBattleState,
        moveIdent,
        1.00
      );
      return [
        Number(((lowRollDamageAmount / activeDefendingPokemonBattleState.pokemon_build.stat_spread.hp) * 100).toFixed(2)),
        Number(((highRollDamageAmount / activeDefendingPokemonBattleState.pokemon_build.stat_spread.hp) * 100).toFixed(2)),
      ];
    });
    defendingPokemonDamageCalcs = activeAttackingPokemonBattleState.pokemon_build.move_idents.map((moveIdent: PokemonMoveIdent) => {
      const lowRollDamageAmount = calculateDamage(
        emptyBattleState,
        activeDefendingPokemonBattleState,
        activeAttackingPokemonBattleState,
        moveIdent,
        0.85
      );
      const highRollDamageAmount = calculateDamage(
        emptyBattleState,
        activeDefendingPokemonBattleState,
        activeAttackingPokemonBattleState,
        moveIdent,
        1.00
      );
      return [
        Number(((lowRollDamageAmount / activeAttackingPokemonBattleState.pokemon_build.stat_spread.hp) * 100).toFixed(2)),
        Number(((highRollDamageAmount / activeAttackingPokemonBattleState.pokemon_build.stat_spread.hp) * 100).toFixed(2)),
      ];
    });
  }

  return (
    <div className="screen damage-calculation-screen">
      <div className="content-section">
        <div className="active-team-section">
          <div className="active-team-select">
            <select value={selectedTeamName} onChange={handleSelectTeamNameChange}>
              <option value={""} disabled={true}>
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
              <PokemonTeamDisplayIndex
                team={activeTeam}
                activeTeamIndex={activeTeamIndex}
                arrange={"vertical"}
                onPokemonBuildClick={onPokemonBuildClick} />
            </div>
          ) : (<></>)
          }
        </div>
        <div className="pokemon-battle-state attacking-pokemon">
          {activeAttackingPokemonBattleState ? (
            <>
              <PokemonBattleStateEditor
                initialPokemonBattleState={activeAttackingPokemonBattleState}
                updatePokemonBattleState={updateAttackingPokemonBattleState}
                damageCalcs={attackingPokemonDamageCalcs} />
            </>
          ) : (<></>)}
        </div>
        <div className="pokemon-battle-state defending-pokemon">
          {activeDefendingPokemonBattleState ? (
            <>
              <PokemonBattleStateEditor
                initialPokemonBattleState={activeDefendingPokemonBattleState}
                updatePokemonBattleState={updateDefendingPokemonBattleState}
                damageCalcs={defendingPokemonDamageCalcs} />
            </>
          ) : (<></>)}
        </div>
      </div>
    </div>
  )

}
