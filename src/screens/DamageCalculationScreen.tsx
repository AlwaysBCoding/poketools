import React, { useState, useEffect, ChangeEvent } from "react";
import useForceUpdate from "use-force-update";

import { Pokemon } from "../models/pokemon/Pokemon";
import { PokemonTeam } from "../models/pokemon/PokemonTeam";
import { PokemonBuild } from "../models/pokemon/PokemonBuild";
import { PokemonMoveIdent } from "../models/pokemon/PokemonShared";

import { BattleState, createEmptyBattleState } from "../models/battle/BattleState";
import { PokemonBattleState, createNewPokemonBattleState, createDefaultPokemonBattleStateForPokemonIdent } from "../models/battle/PokemonBattleState";
import { calculateDamage } from "../models/battle/damage-calc";

import { PokemonTeamDisplayIndex } from "../components/PokemonTeamDisplay";
import { PokemonBattleStateEditor } from "../components/PokemonBattleStateEditor";
import { BattleFieldStateEditor } from "../components/BattleFieldStateEditor";

import AllPokemon from "../data/pokemon/all-pokemon.json";
const allPokemon = AllPokemon as Pokemon[];

export const DamageCalculationScreen = () => {
  const forceUpdate = useForceUpdate();
  const [allTeams, setAllTeams] = useState<PokemonTeam[]>([]);
  const [activeAttackingTeam, setActiveAttackingTeam] = useState<PokemonTeam>();
  const [selectedAttackingTeamName, setSelectedAttackingTeamName] = useState<string>("");
  const [activeDefendingTeam, setActiveDefendingTeam] = useState<PokemonTeam>();
  const [selectedDefendingTeamName, setSelectedDefendingTeamName] = useState<string>("");
  const [activeAttackingPokemonBattleState, setActiveAttackingPokemonBattleState] = useState<PokemonBattleState>(
    createDefaultPokemonBattleStateForPokemonIdent(allPokemon[Math.floor(Math.random()*allPokemon.length)].ident)
  );
  const [activeDefendingPokemonBattleState, setActiveDefendingPokemonBattleState] = useState<PokemonBattleState>(
    createDefaultPokemonBattleStateForPokemonIdent(allPokemon[Math.floor(Math.random()*allPokemon.length)].ident)
  );
  const [activeAttackingTeamIndex, setActiveAttackingTeamIndex] = useState<number | undefined>(undefined);
  const [activeDefendingTeamIndex, setActiveDefendingTeamIndex] = useState<number | undefined>(undefined);

  const [attackingTargetingValue, setAttackingTargetingValue] = useState<string>("single");
  const [attackingCriticalHitValue, setAttackingCriticalHitValue] = useState<boolean>(false);
  const [defendingTargetingValue, setDefendingTargetingValue] = useState<string>("single");
  const [defendingCriticalHitValue, setDefendingCriticalHitValue] = useState<boolean>(false);

  const [battleState, setBattleState] = useState<BattleState>(createEmptyBattleState());

  useEffect(() => {
    const savedTeams: Record<string, PokemonTeam> = localStorage.getItem("savedTeams") ? JSON.parse(localStorage.getItem("savedTeams")!) : {};
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

  const updateTargeting = (nextTargeting: string, side: "attacking" | "defending"): void => {
    if(side === "attacking") {
      setAttackingTargetingValue(nextTargeting);
    } else if(side === "defending") {
      setDefendingTargetingValue(nextTargeting);
    }
    forceUpdate();
  }

  const updateCriticalHit = (nextCriticalHit: boolean, side: "attacking" | "defending"): void => {
    if(side === "attacking") {
      setAttackingCriticalHitValue(nextCriticalHit);
    } else if(side === "defending") {
      setDefendingCriticalHitValue(nextCriticalHit);
    }
    forceUpdate();
  }

  const onPokemonBuildClick = (pokemonBuild: PokemonBuild, teamIndex: number, side: "attacking" | "defending") => {
    if(side === "attacking") {
      setActiveAttackingTeamIndex(teamIndex);
      selectActiveAttackingPokemon(pokemonBuild);
    } else if(side === "defending") {
      setActiveDefendingTeamIndex(teamIndex);
      selectActiveDefendingPokemon(pokemonBuild);
    }
  }

  const updateBattleState = (nextBattleState: BattleState) => {
    setBattleState(nextBattleState);
  }

  let attackingPokemonDamageCalcs: number[][] = [[0, 0], [0, 0], [0, 0], [0, 0]];
  let defendingPokemonDamageCalcs: number[][] = [[0, 0], [0, 0], [0, 0], [0, 0]];

  if(activeAttackingPokemonBattleState && activeDefendingPokemonBattleState) {
    const attackingPokemonDamageCalcsData = activeAttackingPokemonBattleState.pokemon_build.move_idents.map((moveIdent: PokemonMoveIdent) => {
      const lowRollDamageAmount = calculateDamage({
        battleState: battleState,
        attackingPokemon: activeAttackingPokemonBattleState,
        targetPokemon: activeDefendingPokemonBattleState,
        moveIdent: moveIdent,
        hardcodedRandomRoll: 0.85,
        hardcodedCritRoll: attackingCriticalHitValue ? 1 : 0,
        hardcodedTargetingValue: attackingTargetingValue
      });
      const highRollDamageAmount = calculateDamage({
        battleState: battleState,
        attackingPokemon: activeAttackingPokemonBattleState,
        targetPokemon: activeDefendingPokemonBattleState,
        moveIdent: moveIdent,
        hardcodedRandomRoll: 1.00,
        hardcodedCritRoll: attackingCriticalHitValue ? 1 : 0,
        hardcodedTargetingValue: attackingTargetingValue
      });
      return [
        Number(((lowRollDamageAmount / activeDefendingPokemonBattleState.pokemon_build.stat_spread.hp) * 100).toFixed(2)),
        Number(((highRollDamageAmount / activeDefendingPokemonBattleState.pokemon_build.stat_spread.hp) * 100).toFixed(2)),
      ];
    });
    attackingPokemonDamageCalcs[0] = attackingPokemonDamageCalcsData[0] ? attackingPokemonDamageCalcsData[0] : [0, 0];
    attackingPokemonDamageCalcs[1] = attackingPokemonDamageCalcsData[1] ? attackingPokemonDamageCalcsData[1] : [0, 0];
    attackingPokemonDamageCalcs[2] = attackingPokemonDamageCalcsData[2] ? attackingPokemonDamageCalcsData[2] : [0, 0];
    attackingPokemonDamageCalcs[3] = attackingPokemonDamageCalcsData[3] ? attackingPokemonDamageCalcsData[3] : [0, 0];
    const defendingPokemonDamageCalcsData = activeDefendingPokemonBattleState.pokemon_build.move_idents.map((moveIdent: PokemonMoveIdent) => {
      const lowRollDamageAmount = calculateDamage({
        battleState: battleState,
        attackingPokemon: activeDefendingPokemonBattleState,
        targetPokemon: activeAttackingPokemonBattleState,
        moveIdent: moveIdent,
        hardcodedRandomRoll: 0.85,
        hardcodedCritRoll: defendingCriticalHitValue ? 1 : 0,
        hardcodedTargetingValue: defendingTargetingValue
      });
      const highRollDamageAmount = calculateDamage({
        battleState: battleState,
        attackingPokemon: activeDefendingPokemonBattleState,
        targetPokemon: activeAttackingPokemonBattleState,
        moveIdent: moveIdent,
        hardcodedRandomRoll: 1.00,
        hardcodedCritRoll: defendingCriticalHitValue ? 1 : 0,
        hardcodedTargetingValue: defendingTargetingValue
      });
      return [
        Number(((lowRollDamageAmount / activeAttackingPokemonBattleState.pokemon_build.stat_spread.hp) * 100).toFixed(2)),
        Number(((highRollDamageAmount / activeAttackingPokemonBattleState.pokemon_build.stat_spread.hp) * 100).toFixed(2)),
      ];
    });
    defendingPokemonDamageCalcs[0] = defendingPokemonDamageCalcsData[0] ? defendingPokemonDamageCalcsData[0] : [0, 0];
    defendingPokemonDamageCalcs[1] = defendingPokemonDamageCalcsData[1] ? defendingPokemonDamageCalcsData[1] : [0, 0];
    defendingPokemonDamageCalcs[2] = defendingPokemonDamageCalcsData[2] ? defendingPokemonDamageCalcsData[2] : [0, 0];
    defendingPokemonDamageCalcs[3] = defendingPokemonDamageCalcsData[3] ? defendingPokemonDamageCalcsData[3] : [0, 0];
  }

  return (
    <div className="screen damage-calculation-screen">
      <div className="battle-field-state-container">
        <BattleFieldStateEditor
          onBattleFieldStateChange={updateBattleState} />
      </div>
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
                targeting={attackingTargetingValue}
                updateTargeting={(nextTargeting: string) => { updateTargeting(nextTargeting, "attacking") }}
                criticalHit={attackingCriticalHitValue}
                updateCriticalHit={(nextCriticalHit: boolean) => { updateCriticalHit(nextCriticalHit, "attacking") }}
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
                targeting={defendingTargetingValue}
                updateTargeting={(nextTargeting: string) => { updateTargeting(nextTargeting, "defending") }}
                criticalHit={defendingCriticalHitValue}
                updateCriticalHit={(nextCriticalHit: boolean) => { updateCriticalHit(nextCriticalHit, "defending") }}
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
