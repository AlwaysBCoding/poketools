import React, { useState, useEffect } from "react";
import CountUp from "react-countup";

import { PokemonTeam } from "../models/pokemon/PokemonTeam";
import { calculateDamage } from "../models/battle/damage-calc";
import { BattleState } from "../models/battle/BattleState";
import { PokemonBattleState, createNewPokemonBattleState } from "../models/battle/PokemonBattleState";

import { displayPokemonIdent } from "../decorators/Pokemon";
import { displayPokemonMove } from "../decorators/PokemonMove";

export const MoveCoverageTable: React.FC<{
  battleState: BattleState,
  blueTeam: PokemonTeam,
  redTeam: PokemonTeam
}> = ({ battleState, blueTeam, redTeam }) => {

  const [activeBattleState, setActiveBattleState] = useState<BattleState>(battleState);
  const [activeBlueTeam, setActiveBlueTeam] = useState<PokemonTeam>(blueTeam);
  const [activeRedTeam, setActiveRedTeam] = useState<PokemonTeam>(redTeam);
  const [blueTeamBattleStates, setBlueTeamBattleStates] = useState<PokemonBattleState[]>(blueTeam.pokemonBuilds.map((pokemonBuild) => { return createNewPokemonBattleState(pokemonBuild, "blue") }));
  const [redTeamBattleStates, setRedTeamBattleStates] = useState<PokemonBattleState[]>(redTeam.pokemonBuilds.map((pokemonBuild) => { return createNewPokemonBattleState(pokemonBuild, "red") }));

  useEffect(() => {
    setActiveBattleState(battleState);
  }, [battleState]);

  useEffect(() => {
    setActiveBlueTeam(blueTeam);
    setBlueTeamBattleStates(blueTeam.pokemonBuilds.map((pokemonBuild) => { return createNewPokemonBattleState(pokemonBuild, "blue") }));
  }, [blueTeam]);

  useEffect(() => {
    setActiveRedTeam(redTeam);
    setRedTeamBattleStates(redTeam.pokemonBuilds.map((pokemonBuild) => { return createNewPokemonBattleState(pokemonBuild, "red") }));
  }, [redTeam]);

  return (
    <div className="move-coverage-table">
      <div className="header-row">
        <p className="header-item pokemon-display">Pokemon</p>
        <p className="header-item pokemon-moves">Moves</p>
        <p className="header-item pokemon-build pokemon-build-1">{displayPokemonIdent(activeRedTeam.pokemonBuilds[0].pokemon.ident)}</p>
        <p className="header-item pokemon-build pokemon-build-2">{displayPokemonIdent(activeRedTeam.pokemonBuilds[1].pokemon.ident)}</p>
        <p className="header-item pokemon-build pokemon-build-3">{displayPokemonIdent(activeRedTeam.pokemonBuilds[2].pokemon.ident)}</p>
        <p className="header-item pokemon-build pokemon-build-4">{displayPokemonIdent(activeRedTeam.pokemonBuilds[3].pokemon.ident)}</p>
        <p className="header-item pokemon-build pokemon-build-5">{displayPokemonIdent(activeRedTeam.pokemonBuilds[4].pokemon.ident)}</p>
        <p className="header-item pokemon-build pokemon-build-6">{displayPokemonIdent(activeRedTeam.pokemonBuilds[5].pokemon.ident)}</p>
      </div>
      {activeBlueTeam.pokemonBuilds.map((pokemonBuild, pokemonBuildIndex) => {
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
                  battleState: activeBattleState,
                  attackingPokemon: blueTeamBattleStates[pokemonBuildIndex],
                  targetPokemon: redTeamBattleStates[0],
                  moveIdent: moveIdent,
                  hardcodedRandomRoll: 0.85,
                  hardcodedCritRoll: 0,
                  hardcodedTargetingValue: "single"
                });
                const highRollDamage = calculateDamage({
                  battleState: activeBattleState,
                  attackingPokemon: blueTeamBattleStates[pokemonBuildIndex],
                  targetPokemon: redTeamBattleStates[0],
                  moveIdent: moveIdent,
                  hardcodedRandomRoll: 1,
                  hardcodedCritRoll: 0,
                  hardcodedTargetingValue: "single"
                });
                const lowRollPercentage = (lowRollDamage / redTeamBattleStates[0].pokemon_build.stat_spread.hp);
                const highRollPercentage = (highRollDamage / redTeamBattleStates[0].pokemon_build.stat_spread.hp);
                let damageCalcClassName = `pokemon-damage-calc pokemon-damage-calc-${index}`;
                if(lowRollPercentage > 1) { damageCalcClassName += " guaranteed-one-hit-ko"; }
                if(lowRollPercentage > 0.50 && lowRollPercentage < 1) { damageCalcClassName += " guaranteed-two-hit-ko"; }
                if(lowRollPercentage === 0) { damageCalcClassName += " no-damage"; }
                return (
                  <div key={`pokemon-damage-calc-${index}`} className={damageCalcClassName}>
                    {lowRollPercentage ? (
                      <>
                      <CountUp
                        className="pokemon-damage-roll pokemon-damage-roll-low"
                        duration={0.3}
                        decimals={2}
                        end={lowRollPercentage * 100}
                        preserveValue={true}
                        suffix={"%"} />
                      <CountUp
                        className="pokemon-damage-roll pokemon-damage-roll-high"
                        duration={0.3}
                        decimals={2}
                        end={highRollPercentage * 100}
                        preserveValue={true}
                        suffix={"%"} />
                      </>
                    ) : (<></>)}
                  </div>
                )
              })}
            </div>
            <div className="data-item pokemon-build pokemon-build-2">
              {pokemonBuild.move_idents.map((moveIdent, index) => {
                const lowRollDamage = calculateDamage({
                  battleState: activeBattleState,
                  attackingPokemon: blueTeamBattleStates[pokemonBuildIndex],
                  targetPokemon: redTeamBattleStates[1],
                  moveIdent: moveIdent,
                  hardcodedRandomRoll: 0.85,
                  hardcodedCritRoll: 0,
                  hardcodedTargetingValue: "single"
                });
                const highRollDamage = calculateDamage({
                  battleState: activeBattleState,
                  attackingPokemon: blueTeamBattleStates[pokemonBuildIndex],
                  targetPokemon: redTeamBattleStates[1],
                  moveIdent: moveIdent,
                  hardcodedRandomRoll: 1,
                  hardcodedCritRoll: 0,
                  hardcodedTargetingValue: "single"
                });
                const lowRollPercentage = (lowRollDamage / redTeamBattleStates[1].pokemon_build.stat_spread.hp);
                const highRollPercentage = (highRollDamage / redTeamBattleStates[1].pokemon_build.stat_spread.hp);
                let damageCalcClassName = `pokemon-damage-calc pokemon-damage-calc-${index}`;
                if(lowRollPercentage > 1) { damageCalcClassName += " guaranteed-one-hit-ko"; }
                if(lowRollPercentage > 0.50 && lowRollPercentage < 1) { damageCalcClassName += " guaranteed-two-hit-ko"; }
                if(lowRollPercentage === 0) { damageCalcClassName += " no-damage"; }
                return (
                  <div key={`pokemon-damage-calc-${index}`} className={damageCalcClassName}>
                    {lowRollPercentage ? (
                      <>
                      <CountUp
                        className="pokemon-damage-roll pokemon-damage-roll-low"
                        duration={0.3}
                        decimals={2}
                        end={lowRollPercentage * 100}
                        preserveValue={true}
                        suffix={"%"} />
                      <CountUp
                        className="pokemon-damage-roll pokemon-damage-roll-high"
                        duration={0.3}
                        decimals={2}
                        end={highRollPercentage * 100}
                        preserveValue={true}
                        suffix={"%"} />
                      </>
                    ) : (<></>)}
                  </div>
                )
              })}
            </div>
            <div className="data-item pokemon-build pokemon-build-3">
              {pokemonBuild.move_idents.map((moveIdent, index) => {
                const lowRollDamage = calculateDamage({
                  battleState: activeBattleState,
                  attackingPokemon: blueTeamBattleStates[pokemonBuildIndex],
                  targetPokemon: redTeamBattleStates[2],
                  moveIdent: moveIdent,
                  hardcodedRandomRoll: 0.85,
                  hardcodedCritRoll: 0,
                  hardcodedTargetingValue: "single"
                });
                const highRollDamage = calculateDamage({
                  battleState: activeBattleState,
                  attackingPokemon: blueTeamBattleStates[pokemonBuildIndex],
                  targetPokemon: redTeamBattleStates[2],
                  moveIdent: moveIdent,
                  hardcodedRandomRoll: 1,
                  hardcodedCritRoll: 0,
                  hardcodedTargetingValue: "single"
                });
                const lowRollPercentage = (lowRollDamage / redTeamBattleStates[2].pokemon_build.stat_spread.hp);
                const highRollPercentage = (highRollDamage / redTeamBattleStates[2].pokemon_build.stat_spread.hp);
                let damageCalcClassName = `pokemon-damage-calc pokemon-damage-calc-${index}`;
                if(lowRollPercentage > 1) { damageCalcClassName += " guaranteed-one-hit-ko"; }
                if(lowRollPercentage > 0.50 && lowRollPercentage < 1) { damageCalcClassName += " guaranteed-two-hit-ko"; }
                if(lowRollPercentage === 0) { damageCalcClassName += " no-damage"; }
                return (
                  <div key={`pokemon-damage-calc-${index}`} className={damageCalcClassName}>
                    {lowRollPercentage ? (
                      <>
                      <CountUp
                        className="pokemon-damage-roll pokemon-damage-roll-low"
                        duration={0.3}
                        decimals={2}
                        end={lowRollPercentage * 100}
                        preserveValue={true}
                        suffix={"%"} />
                      <CountUp
                        className="pokemon-damage-roll pokemon-damage-roll-high"
                        duration={0.3}
                        decimals={2}
                        end={highRollPercentage * 100}
                        preserveValue={true}
                        suffix={"%"} />
                      </>
                    ) : (<></>)}
                  </div>
                )
              })}
            </div>
            <div className="data-item pokemon-build pokemon-build-4">
              {pokemonBuild.move_idents.map((moveIdent, index) => {
                const lowRollDamage = calculateDamage({
                  battleState: activeBattleState,
                  attackingPokemon: blueTeamBattleStates[pokemonBuildIndex],
                  targetPokemon: redTeamBattleStates[3],
                  moveIdent: moveIdent,
                  hardcodedRandomRoll: 0.85,
                  hardcodedCritRoll: 0,
                  hardcodedTargetingValue: "single"
                });
                const highRollDamage = calculateDamage({
                  battleState: activeBattleState,
                  attackingPokemon: blueTeamBattleStates[pokemonBuildIndex],
                  targetPokemon: redTeamBattleStates[3],
                  moveIdent: moveIdent,
                  hardcodedRandomRoll: 1,
                  hardcodedCritRoll: 0,
                  hardcodedTargetingValue: "single"
                });
                const lowRollPercentage = (lowRollDamage / redTeamBattleStates[3].pokemon_build.stat_spread.hp);
                const highRollPercentage = (highRollDamage / redTeamBattleStates[3].pokemon_build.stat_spread.hp);
                let damageCalcClassName = `pokemon-damage-calc pokemon-damage-calc-${index}`;
                if(lowRollPercentage > 1) { damageCalcClassName += " guaranteed-one-hit-ko"; }
                if(lowRollPercentage > 0.50 && lowRollPercentage < 1) { damageCalcClassName += " guaranteed-two-hit-ko"; }
                if(lowRollPercentage === 0) { damageCalcClassName += " no-damage"; }
                return (
                  <div key={`pokemon-damage-calc-${index}`} className={damageCalcClassName}>
                    {lowRollPercentage ? (
                      <>
                      <CountUp
                        className="pokemon-damage-roll pokemon-damage-roll-low"
                        duration={0.3}
                        decimals={2}
                        end={lowRollPercentage * 100}
                        preserveValue={true}
                        suffix={"%"} />
                      <CountUp
                        className="pokemon-damage-roll pokemon-damage-roll-high"
                        duration={0.3}
                        decimals={2}
                        end={highRollPercentage * 100}
                        preserveValue={true}
                        suffix={"%"} />
                      </>
                    ) : (<></>)}
                  </div>
                )
              })}
            </div>
            <div className="data-item pokemon-build pokemon-build-5">
              {pokemonBuild.move_idents.map((moveIdent, index) => {
                const lowRollDamage = calculateDamage({
                  battleState: activeBattleState,
                  attackingPokemon: blueTeamBattleStates[pokemonBuildIndex],
                  targetPokemon: redTeamBattleStates[4],
                  moveIdent: moveIdent,
                  hardcodedRandomRoll: 0.85,
                  hardcodedCritRoll: 0,
                  hardcodedTargetingValue: "single"
                });
                const highRollDamage = calculateDamage({
                  battleState: activeBattleState,
                  attackingPokemon: blueTeamBattleStates[pokemonBuildIndex],
                  targetPokemon: redTeamBattleStates[4],
                  moveIdent: moveIdent,
                  hardcodedRandomRoll: 1,
                  hardcodedCritRoll: 0,
                  hardcodedTargetingValue: "single"
                });
                const lowRollPercentage = (lowRollDamage / redTeamBattleStates[4].pokemon_build.stat_spread.hp);
                const highRollPercentage = (highRollDamage / redTeamBattleStates[4].pokemon_build.stat_spread.hp);
                let damageCalcClassName = `pokemon-damage-calc pokemon-damage-calc-${index}`;
                if(lowRollPercentage > 1) { damageCalcClassName += " guaranteed-one-hit-ko"; }
                if(lowRollPercentage > 0.50 && lowRollPercentage < 1) { damageCalcClassName += " guaranteed-two-hit-ko"; }
                if(lowRollPercentage === 0) { damageCalcClassName += " no-damage"; }
                return (
                  <div key={`pokemon-damage-calc-${index}`} className={damageCalcClassName}>
                    {lowRollPercentage ? (
                      <>
                      <CountUp
                        className="pokemon-damage-roll pokemon-damage-roll-low"
                        duration={0.3}
                        decimals={2}
                        end={lowRollPercentage * 100}
                        preserveValue={true}
                        suffix={"%"} />
                      <CountUp
                        className="pokemon-damage-roll pokemon-damage-roll-high"
                        duration={0.3}
                        decimals={2}
                        end={highRollPercentage * 100}
                        preserveValue={true}
                        suffix={"%"} />
                      </>
                    ) : (<></>)}
                  </div>
                )
              })}
            </div>
            <div className="data-item pokemon-build pokemon-build-6">
              {pokemonBuild.move_idents.map((moveIdent, index) => {
                const lowRollDamage = calculateDamage({
                  battleState: activeBattleState,
                  attackingPokemon: blueTeamBattleStates[pokemonBuildIndex],
                  targetPokemon: redTeamBattleStates[5],
                  moveIdent: moveIdent,
                  hardcodedRandomRoll: 0.85,
                  hardcodedCritRoll: 0,
                  hardcodedTargetingValue: "single"
                });
                const highRollDamage = calculateDamage({
                  battleState: activeBattleState,
                  attackingPokemon: blueTeamBattleStates[pokemonBuildIndex],
                  targetPokemon: redTeamBattleStates[5],
                  moveIdent: moveIdent,
                  hardcodedRandomRoll: 1,
                  hardcodedCritRoll: 0,
                  hardcodedTargetingValue: "single"
                });
                const lowRollPercentage = (lowRollDamage / redTeamBattleStates[5].pokemon_build.stat_spread.hp);
                const highRollPercentage = (highRollDamage / redTeamBattleStates[5].pokemon_build.stat_spread.hp);
                let damageCalcClassName = `pokemon-damage-calc pokemon-damage-calc-${index}`;
                if(lowRollPercentage > 1) { damageCalcClassName += " guaranteed-one-hit-ko"; }
                if(lowRollPercentage > 0.50 && lowRollPercentage < 1) { damageCalcClassName += " guaranteed-two-hit-ko"; }
                if(lowRollPercentage === 0) { damageCalcClassName += " no-damage"; }
                return (
                  <div key={`pokemon-damage-calc-${index}`} className={damageCalcClassName}>
                    {lowRollPercentage ? (
                      <>
                      <CountUp
                        className="pokemon-damage-roll pokemon-damage-roll-low"
                        duration={0.3}
                        decimals={2}
                        end={lowRollPercentage * 100}
                        preserveValue={true}
                        suffix={"%"} />
                      <CountUp
                        className="pokemon-damage-roll pokemon-damage-roll-high"
                        duration={0.3}
                        decimals={2}
                        end={highRollPercentage * 100}
                        preserveValue={true}
                        suffix={"%"} />
                      </>
                    ) : (<></>)}
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
