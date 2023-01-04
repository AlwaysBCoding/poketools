import React from "react";

import { PokemonTeam } from "../models/pokemon/PokemonTeam";
import { calculateDamage } from "../models/battle/damage-calc";
import { BattleState, createEmptyBattleState } from "../models/battle/BattleState";
import { PokemonBattleState, createNewPokemonBattleState } from "../models/battle/PokemonBattleState";

import { displayPokemonIdent } from "../decorators/Pokemon";
import { displayPokemonMove } from "../decorators/PokemonMove";

export const MoveCoverageTable: React.FC<{blueTeam: PokemonTeam, redTeam: PokemonTeam}> = ({ blueTeam, redTeam }) => {

  const emptyBattleState: BattleState = createEmptyBattleState();
  const blueTeamBattleStates: PokemonBattleState[] = blueTeam.pokemonBuilds.map((pokemonBuild) => { return createNewPokemonBattleState(pokemonBuild, "blue") });
  const redTeamBattleStates: PokemonBattleState[] = redTeam.pokemonBuilds.map((pokemonBuild) => { return createNewPokemonBattleState(pokemonBuild, "red") });

  return (
    <div className="move-coverage-table">
      <div className="header-row">
        <p className="header-item pokemon-display">Pokemon</p>
        <p className="header-item pokemon-moves">Moves</p>
        <p className="header-item pokemon-build pokemon-build-1">{displayPokemonIdent(redTeam.pokemonBuilds[0].pokemon.ident)}</p>
        <p className="header-item pokemon-build pokemon-build-2">{displayPokemonIdent(redTeam.pokemonBuilds[1].pokemon.ident)}</p>
        <p className="header-item pokemon-build pokemon-build-3">{displayPokemonIdent(redTeam.pokemonBuilds[2].pokemon.ident)}</p>
        <p className="header-item pokemon-build pokemon-build-4">{displayPokemonIdent(redTeam.pokemonBuilds[3].pokemon.ident)}</p>
        <p className="header-item pokemon-build pokemon-build-5">{displayPokemonIdent(redTeam.pokemonBuilds[4].pokemon.ident)}</p>
        <p className="header-item pokemon-build pokemon-build-6">{displayPokemonIdent(redTeam.pokemonBuilds[5].pokemon.ident)}</p>
      </div>
      {blueTeam.pokemonBuilds.map((pokemonBuild, pokemonBuildIndex) => {
        const pokemonImage = require(`../data/pokemon/paldea/${String(pokemonBuild.pokemon.paldea_regional_pokedex_number).padStart(2, "0")}-${pokemonBuild.pokemon.ident.split("-")[0]}/${pokemonBuild.pokemon.ident}.static.png`);
        return (
          <div
            className="data-row"
            key={`pokemon-build-${pokemonBuildIndex}`}>
            <div className="data-item pokemon-display">
              <img className="pokemon-image-asset" src={pokemonImage} alt={pokemonBuild.pokemon.ident} />
              <p className="pokemon-ident">{displayPokemonIdent(pokemonBuild.pokemon.ident)}</p>
            </div>
            <div className="data-item pokemon-moves">
              {pokemonBuild.move_idents.map((moveIdent, index) => {
                return (
                  <p key={`pokemon-move-${index}`} className={`pokemon-move pokemon-move-${index}`}>{displayPokemonMove(moveIdent)}</p>
                )
              })}
            </div>
            <div className="data-item pokemon-build pokemon-build-1">
              {pokemonBuild.move_idents.map((moveIdent, index) => {
                const lowRollDamage = calculateDamage({
                  battleState: emptyBattleState,
                  attackingPokemon: blueTeamBattleStates[pokemonBuildIndex],
                  targetPokemon: redTeamBattleStates[0],
                  moveIdent: moveIdent,
                  hardcodedRandomRoll: 0.85,
                  hardcodedCritRoll: 0,
                  hardcodedTargetingValue: "single"
                });
                const highRollDamage = calculateDamage({
                  battleState: emptyBattleState,
                  attackingPokemon: blueTeamBattleStates[pokemonBuildIndex],
                  targetPokemon: redTeamBattleStates[0],
                  moveIdent: moveIdent,
                  hardcodedRandomRoll: 1,
                  hardcodedCritRoll: 0,
                  hardcodedTargetingValue: "single"
                });
                const lowRollDamageDisplay = lowRollDamage ? `${((lowRollDamage / redTeamBattleStates[0].pokemon_build.stat_spread.hp) * 100).toFixed(2)}%` : ``;
                const highRollDamageDisplay = highRollDamage ? `${((highRollDamage / redTeamBattleStates[0].pokemon_build.stat_spread.hp) * 100).toFixed(2)}%` : ``;
                let damageCalcClassName = `pokemon-damage-calc pokemon-damage-calc-${index}`;
                if((lowRollDamage / redTeamBattleStates[0].pokemon_build.stat_spread.hp) > 1) { damageCalcClassName += " one-hit-ko"; }
                if(lowRollDamage === 0) { damageCalcClassName += " no-damage"; }
                if((highRollDamage / redTeamBattleStates[0].pokemon_build.stat_spread.hp) <= 0.25) { damageCalcClassName += " low-damage"; }
                return (
                  <div key={`pokemon-damage-calc-${index}`} className={damageCalcClassName}>
                    <p className={`pokemon-damage-roll pokemon-damage-roll-low`}>
                      {lowRollDamageDisplay}
                    </p>
                    <p className={`pokemon-damage-roll pokemon-damage-roll-high`}>
                      {highRollDamageDisplay}
                    </p>
                  </div>
                )
              })}
            </div>
            <div className="data-item pokemon-build pokemon-build-2">
              {pokemonBuild.move_idents.map((moveIdent, index) => {
                const lowRollDamage = calculateDamage({
                  battleState: emptyBattleState,
                  attackingPokemon: blueTeamBattleStates[pokemonBuildIndex],
                  targetPokemon: redTeamBattleStates[1],
                  moveIdent: moveIdent,
                  hardcodedRandomRoll: 0.85,
                  hardcodedCritRoll: 0,
                  hardcodedTargetingValue: "single"
                });
                const highRollDamage = calculateDamage({
                  battleState: emptyBattleState,
                  attackingPokemon: blueTeamBattleStates[pokemonBuildIndex],
                  targetPokemon: redTeamBattleStates[1],
                  moveIdent: moveIdent,
                  hardcodedRandomRoll: 1,
                  hardcodedCritRoll: 0,
                  hardcodedTargetingValue: "single"
                });
                const lowRollDamageDisplay = lowRollDamage ? `${((lowRollDamage / redTeamBattleStates[1].pokemon_build.stat_spread.hp) * 100).toFixed(2)}%` : ``;
                const highRollDamageDisplay = highRollDamage ? `${((highRollDamage / redTeamBattleStates[1].pokemon_build.stat_spread.hp) * 100).toFixed(2)}%` : ``;
                let damageCalcClassName = `pokemon-damage-calc pokemon-damage-calc-${index}`;
                if((lowRollDamage / redTeamBattleStates[1].pokemon_build.stat_spread.hp) > 1) { damageCalcClassName += " one-hit-ko"; }
                if(lowRollDamage === 0) { damageCalcClassName += " no-damage"; }
                if((highRollDamage / redTeamBattleStates[1].pokemon_build.stat_spread.hp) <= 0.25) { damageCalcClassName += " low-damage"; }
                return (
                  <div key={`pokemon-damage-calc-${index}`} className={damageCalcClassName}>
                    <p className={`pokemon-damage-roll pokemon-damage-roll-low`}>
                      {lowRollDamageDisplay}
                    </p>
                    <p className={`pokemon-damage-roll pokemon-damage-roll-high`}>
                      {highRollDamageDisplay}
                    </p>
                  </div>
                )
              })}
            </div>
            <div className="data-item pokemon-build pokemon-build-3">
              {pokemonBuild.move_idents.map((moveIdent, index) => {
                const lowRollDamage = calculateDamage({
                  battleState: emptyBattleState,
                  attackingPokemon: blueTeamBattleStates[pokemonBuildIndex],
                  targetPokemon: redTeamBattleStates[2],
                  moveIdent: moveIdent,
                  hardcodedRandomRoll: 0.85,
                  hardcodedCritRoll: 0,
                  hardcodedTargetingValue: "single"
                });
                const highRollDamage = calculateDamage({
                  battleState: emptyBattleState,
                  attackingPokemon: blueTeamBattleStates[pokemonBuildIndex],
                  targetPokemon: redTeamBattleStates[2],
                  moveIdent: moveIdent,
                  hardcodedRandomRoll: 1,
                  hardcodedCritRoll: 0,
                  hardcodedTargetingValue: "single"
                });
                const lowRollDamageDisplay = lowRollDamage ? `${((lowRollDamage / redTeamBattleStates[2].pokemon_build.stat_spread.hp) * 100).toFixed(2)}%` : ``;
                const highRollDamageDisplay = highRollDamage ? `${((highRollDamage / redTeamBattleStates[2].pokemon_build.stat_spread.hp) * 100).toFixed(2)}%` : ``;
                let damageCalcClassName = `pokemon-damage-calc pokemon-damage-calc-${index}`;
                if((lowRollDamage / redTeamBattleStates[2].pokemon_build.stat_spread.hp) > 1) { damageCalcClassName += " one-hit-ko"; }
                if(lowRollDamage === 0) { damageCalcClassName += " no-damage"; }
                if((highRollDamage / redTeamBattleStates[2].pokemon_build.stat_spread.hp) <= 0.25) { damageCalcClassName += " low-damage"; }
                return (
                  <div key={`pokemon-damage-calc-${index}`} className={damageCalcClassName}>
                    <p className={`pokemon-damage-roll pokemon-damage-roll-low`}>
                      {lowRollDamageDisplay}
                    </p>
                    <p className={`pokemon-damage-roll pokemon-damage-roll-high`}>
                      {highRollDamageDisplay}
                    </p>
                  </div>
                )
              })}
            </div>
            <div className="data-item pokemon-build pokemon-build-4">
              {pokemonBuild.move_idents.map((moveIdent, index) => {
                const lowRollDamage = calculateDamage({
                  battleState: emptyBattleState,
                  attackingPokemon: blueTeamBattleStates[pokemonBuildIndex],
                  targetPokemon: redTeamBattleStates[3],
                  moveIdent: moveIdent,
                  hardcodedRandomRoll: 0.85,
                  hardcodedCritRoll: 0,
                  hardcodedTargetingValue: "single"
                });
                const highRollDamage = calculateDamage({
                  battleState: emptyBattleState,
                  attackingPokemon: blueTeamBattleStates[pokemonBuildIndex],
                  targetPokemon: redTeamBattleStates[3],
                  moveIdent: moveIdent,
                  hardcodedRandomRoll: 1,
                  hardcodedCritRoll: 0,
                  hardcodedTargetingValue: "single"
                });
                const lowRollDamageDisplay = lowRollDamage ? `${((lowRollDamage / redTeamBattleStates[3].pokemon_build.stat_spread.hp) * 100).toFixed(2)}%` : ``;
                const highRollDamageDisplay = highRollDamage ? `${((highRollDamage / redTeamBattleStates[3].pokemon_build.stat_spread.hp) * 100).toFixed(2)}%` : ``;
                let damageCalcClassName = `pokemon-damage-calc pokemon-damage-calc-${index}`;
                if((lowRollDamage / redTeamBattleStates[3].pokemon_build.stat_spread.hp) > 1) { damageCalcClassName += " one-hit-ko"; }
                if(lowRollDamage === 0) { damageCalcClassName += " no-damage"; }
                if((highRollDamage / redTeamBattleStates[3].pokemon_build.stat_spread.hp) <= 0.25) { damageCalcClassName += " low-damage"; }
                return (
                  <div key={`pokemon-damage-calc-${index}`} className={damageCalcClassName}>
                    <p className={`pokemon-damage-roll pokemon-damage-roll-low`}>
                      {lowRollDamageDisplay}
                    </p>
                    <p className={`pokemon-damage-roll pokemon-damage-roll-high`}>
                      {highRollDamageDisplay}
                    </p>
                  </div>
                )
              })}
            </div>
            <div className="data-item pokemon-build pokemon-build-5">
              {pokemonBuild.move_idents.map((moveIdent, index) => {
                const lowRollDamage = calculateDamage({
                  battleState: emptyBattleState,
                  attackingPokemon: blueTeamBattleStates[pokemonBuildIndex],
                  targetPokemon: redTeamBattleStates[4],
                  moveIdent: moveIdent,
                  hardcodedRandomRoll: 0.85,
                  hardcodedCritRoll: 0,
                  hardcodedTargetingValue: "single"
                });
                const highRollDamage = calculateDamage({
                  battleState: emptyBattleState,
                  attackingPokemon: blueTeamBattleStates[pokemonBuildIndex],
                  targetPokemon: redTeamBattleStates[4],
                  moveIdent: moveIdent,
                  hardcodedRandomRoll: 1,
                  hardcodedCritRoll: 0,
                  hardcodedTargetingValue: "single"
                });
                const lowRollDamageDisplay = lowRollDamage ? `${((lowRollDamage / redTeamBattleStates[4].pokemon_build.stat_spread.hp) * 100).toFixed(2)}%` : ``;
                const highRollDamageDisplay = highRollDamage ? `${((highRollDamage / redTeamBattleStates[4].pokemon_build.stat_spread.hp) * 100).toFixed(2)}%` : ``;
                let damageCalcClassName = `pokemon-damage-calc pokemon-damage-calc-${index}`;
                if((lowRollDamage / redTeamBattleStates[4].pokemon_build.stat_spread.hp) > 1) { damageCalcClassName += " one-hit-ko"; }
                if(lowRollDamage === 0) { damageCalcClassName += " no-damage"; }
                if((highRollDamage / redTeamBattleStates[4].pokemon_build.stat_spread.hp) <= 0.25) { damageCalcClassName += " low-damage"; }
                return (
                  <div key={`pokemon-damage-calc-${index}`} className={damageCalcClassName}>
                    <p className={`pokemon-damage-roll pokemon-damage-roll-low`}>
                      {lowRollDamageDisplay}
                    </p>
                    <p className={`pokemon-damage-roll pokemon-damage-roll-high`}>
                      {highRollDamageDisplay}
                    </p>
                  </div>
                )
              })}
            </div>
            <div className="data-item pokemon-build pokemon-build-6">
              {pokemonBuild.move_idents.map((moveIdent, index) => {
                const lowRollDamage = calculateDamage({
                  battleState: emptyBattleState,
                  attackingPokemon: blueTeamBattleStates[pokemonBuildIndex],
                  targetPokemon: redTeamBattleStates[5],
                  moveIdent: moveIdent,
                  hardcodedRandomRoll: 0.85,
                  hardcodedCritRoll: 0,
                  hardcodedTargetingValue: "single"
                });
                const highRollDamage = calculateDamage({
                  battleState: emptyBattleState,
                  attackingPokemon: blueTeamBattleStates[pokemonBuildIndex],
                  targetPokemon: redTeamBattleStates[5],
                  moveIdent: moveIdent,
                  hardcodedRandomRoll: 1,
                  hardcodedCritRoll: 0,
                  hardcodedTargetingValue: "single"
                });
                const lowRollDamageDisplay = lowRollDamage ? `${((lowRollDamage / redTeamBattleStates[5].pokemon_build.stat_spread.hp) * 100).toFixed(2)}%` : ``;
                const highRollDamageDisplay = highRollDamage ? `${((highRollDamage / redTeamBattleStates[5].pokemon_build.stat_spread.hp) * 100).toFixed(2)}%` : ``;
                let damageCalcClassName = `pokemon-damage-calc pokemon-damage-calc-${index}`;
                if((lowRollDamage / redTeamBattleStates[5].pokemon_build.stat_spread.hp) > 1) { damageCalcClassName += " one-hit-ko"; }
                if(lowRollDamage === 0) { damageCalcClassName += " no-damage"; }
                if((highRollDamage / redTeamBattleStates[5].pokemon_build.stat_spread.hp) <= 0.25) { damageCalcClassName += " low-damage"; }
                return (
                  <div key={`pokemon-damage-calc-${index}`} className={damageCalcClassName}>
                    <p className={`pokemon-damage-roll pokemon-damage-roll-low`}>
                      {lowRollDamageDisplay}
                    </p>
                    <p className={`pokemon-damage-roll pokemon-damage-roll-high`}>
                      {highRollDamageDisplay}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )

}
