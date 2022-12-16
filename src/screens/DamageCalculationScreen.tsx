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
  const [activeAttackingTeam, setActiveAttackingTeam] = useState<PokemonTeam>();
  const [selectedAttackingTeamName, setSelectedAttackingTeamName] = useState<string>("");
  const [activeDefendingTeam, setActiveDefendingTeam] = useState<PokemonTeam>();
  const [selectedDefendingTeamName, setSelectedDefendingTeamName] = useState<string>("");
  const [activeAttackingPokemonBattleState, setActiveAttackingPokemonBattleState] = useState<PokemonBattleState>(
    createDefaultPokemonBattleStateForPokemonIdent("garchomp")
  );
  const [activeDefendingPokemonBattleState, setActiveDefendingPokemonBattleState] = useState<PokemonBattleState>(
    createDefaultPokemonBattleStateForPokemonIdent("hydreigon")
  );
  const [activeAttackingTeamIndex, setActiveAttackingTeamIndex] = useState<number | undefined>(undefined);
  const [activeDefendingTeamIndex, setActiveDefendingTeamIndex] = useState<number | undefined>(undefined);

  const emptyBattleState: BattleState = createEmptyBattleState();

  useEffect(() => {

    const savedTeams: Record<string, PokemonTeam> = JSON.parse(`${localStorage.getItem("savedTeams")}`);
    const nextTeams: PokemonTeam[] = Object.values(savedTeams);

    setAllTeams(nextTeams);

  }, []);

  const handleSelectTeamNameChange = (event: ChangeEvent<HTMLSelectElement>, side: string) => {
    if(side === "attacking") {
      setSelectedAttackingTeamName(event.target.value);
      const nextTeam: PokemonTeam | undefined = allTeams.find((team: PokemonTeam) => { return team.team_name === event.target.value });
      if(nextTeam) {
        setActiveAttackingTeam(nextTeam);
        setActiveAttackingTeamIndex(0);
        selectActiveAttackingPokemon(nextTeam.pokemonBuilds[0]);
      }
    } else if (side === "defending") {
      setSelectedDefendingTeamName(event.target.value);
      const nextTeam: PokemonTeam | undefined = allTeams.find((team: PokemonTeam) => { return team.team_name === event.target.value });
      if(nextTeam) {
        setActiveDefendingTeam(nextTeam);
        setActiveDefendingTeamIndex(0);
        selectActiveDefendingPokemon(nextTeam.pokemonBuilds[0]);
      }
    }
  }

  const selectActiveAttackingPokemon = (pokemonBuild: PokemonBuild): void => {
    const nextActiveAttackingPokemonBattleState = createNewPokemonBattleState(pokemonBuild);
    setActiveAttackingPokemonBattleState(nextActiveAttackingPokemonBattleState);
  }

  const selectActiveDefendingPokemon = (pokemonBuild: PokemonBuild): void => {
    const nextActiveDefendingPokemonBattleState = createNewPokemonBattleState(pokemonBuild);
    setActiveDefendingPokemonBattleState(nextActiveDefendingPokemonBattleState);
  }

  const updateAttackingPokemonBattleState = (nextPokemonBattleState: PokemonBattleState): void => {
    setActiveAttackingPokemonBattleState(nextPokemonBattleState);
    forceUpdate();
  }

  const updateDefendingPokemonBattleState = (nextPokemonBattleState: PokemonBattleState): void => {
    setActiveDefendingPokemonBattleState(nextPokemonBattleState);
    forceUpdate();
  }

  const onPokemonBuildClick = (pokemonBuild: PokemonBuild, teamIndex: number, side: string) => {
    if(side === "attacking") {
      setActiveAttackingTeamIndex(teamIndex);
      selectActiveAttackingPokemon(pokemonBuild);
    } else if(side === "defending") {
      setActiveDefendingTeamIndex(teamIndex);
      selectActiveDefendingPokemon(pokemonBuild);
    }
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
        <div className="active-team-section attacking-team">
          <div className="active-team-select">
            <select value={selectedAttackingTeamName} onChange={(e) => { handleSelectTeamNameChange(e, "attacking") }}>
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
          {activeAttackingTeam ? (
            <div className="active-team-display">
              <PokemonTeamDisplayIndex
                team={activeAttackingTeam}
                activeTeamIndex={activeAttackingTeamIndex}
                arrange={"vertical"}
                onPokemonBuildClick={(pokemonBuild, teamIndex) => { onPokemonBuildClick(pokemonBuild, teamIndex, "attacking") }} />
            </div>
          ) : (<></>)}
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
        <div className="active-team-section defending-team">
          <div className="active-team-select">
            <select value={selectedDefendingTeamName} onChange={(e) => { handleSelectTeamNameChange(e, "defending") }}>
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
          {activeDefendingTeam ? (
            <div className="active-team-display">
              <PokemonTeamDisplayIndex
                team={activeDefendingTeam}
                activeTeamIndex={activeDefendingTeamIndex}
                arrange={"vertical"}
                onPokemonBuildClick={(pokemonBuild, teamIndex) => { onPokemonBuildClick(pokemonBuild, teamIndex, "defending") }} />
            </div>
            ) : (<></>)}
        </div>
      </div>
    </div>
  )

}
