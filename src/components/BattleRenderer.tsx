import React from "react";

import { Battle } from "../models/battle/Battle";
import { BattleAction } from "../models/battle/BattleAction";
import { Pokemon } from "../models/pokemon/Pokemon";
import { PokemonBattleState } from "../models/battle/PokemonBattleState";
import { BattleSide } from "../models/battle/BattleShared";

export const BattleEvalBar: React.FC<{maxActionValue: number}> = ({ maxActionValue }) => {
  return (
    <div className="battle-eval-bar-container">
      <div className="battle-eval-bar" style={{height: `${maxActionValue * 100}%`}}></div>
    </div>
  )
}

export const BattleLogRenderer: React.FC<{battle: Battle}> = ({ battle }) => {
  return (
    <div className="battle-log-renderer">
      {battle.battle_turns.map((battleTurn, index) => {
        return (
          <div className="battle-turn" key={`battle-turn-${index}`}>
            <h4 className="battle-turn-index">{`TURN: ${index}`}</h4>
            {battleTurn.map((battleEvent, index) => {
              return (
                <p className="battle-event" key={`battle-event-${index}`}>
                  {battleEvent}
                </p>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export const BattleRenderer: React.FC<{
  battle: Battle,
  battleActions: BattleAction[],
  agentActions: number[],
  selectBattleAction?: (battleAction: BattleAction) => void,
  perspective: BattleSide
}> = ({
  battle,
  battleActions,
  agentActions,
  selectBattleAction = () => undefined,
  perspective
}) => {
  let bluePokemonImage;
  let redPokemonImage;
  let bluePokemonHealthPercentage;
  let redPokemonHealthPercentage;

  const blueFieldPokemonBattleState: PokemonBattleState | undefined = battle.battle_state.blue_side_pokemon.find((pokemon) => { return pokemon.location === "field" });
  if(blueFieldPokemonBattleState) {
    const blueFieldPokemon: Pokemon = blueFieldPokemonBattleState.pokemon_build.pokemon;
    const bluePerspective = perspective === "blue" ? "back" : "front";
    bluePokemonHealthPercentage = (blueFieldPokemonBattleState.current_hp / blueFieldPokemonBattleState.pokemon_build.stat_spread.hp) * 100;
    try {
      bluePokemonImage = require(`../data/pokemon/paldea/${String(blueFieldPokemon.paldea_regional_pokedex_number).padStart(2, "0")}-${blueFieldPokemon.ident.split("-")[0]}/${blueFieldPokemon.ident}.motion.${bluePerspective}.gif`);
    } catch (error) {
      bluePokemonImage = require(`../data/pokemon/paldea/${String(blueFieldPokemon.paldea_regional_pokedex_number).padStart(2, "0")}-${blueFieldPokemon.ident.split("-")[0]}/${blueFieldPokemon.ident}.static.png`);
    }
  }

  const redFieldPokemonBattleState: PokemonBattleState | undefined = battle.battle_state.red_side_pokemon.find((pokemon) => { return pokemon.location === "field" });
  if(redFieldPokemonBattleState) {
    const redFieldPokemon: Pokemon = redFieldPokemonBattleState.pokemon_build.pokemon;
    const redPerspective = perspective === "red" ? "back" : "front";
    redPokemonHealthPercentage = (redFieldPokemonBattleState.current_hp / redFieldPokemonBattleState.pokemon_build.stat_spread.hp) * 100;
    try {
      redPokemonImage = require(`../data/pokemon/paldea/${String(redFieldPokemon.paldea_regional_pokedex_number).padStart(2, "0")}-${redFieldPokemon.ident.split("-")[0]}/${redFieldPokemon.ident}.motion.${redPerspective}.gif`);
    } catch (error) {
      redPokemonImage = require(`../data/pokemon/paldea/${String(redFieldPokemon.paldea_regional_pokedex_number).padStart(2, "0")}-${redFieldPokemon.ident.split("-")[0]}/${redFieldPokemon.ident}.static.png`);
    }
  }

  return (
    <div className="battle-renderer-container">
      <div className="battle-renderer">
        <div className="pokemons">
          <div className="player-pokemons">
            {blueFieldPokemonBattleState ? (
              <div className="side-pokemon blue-field-1">
                <p className="pokemon-ident">{blueFieldPokemonBattleState.pokemon_build.pokemon.ident}</p>
                <div className="hp-bar-container">
                  <div className="current-hp" style={{width: `${bluePokemonHealthPercentage}%`}}></div>
                </div>
                <img src={bluePokemonImage} className="pokemon-image" alt="pokemon-image" />
              </div>
            ) : (<></>)}
          </div>
          <div className="enemy-pokemons">
            {redFieldPokemonBattleState ? (
              <div className="side-pokemon red-field-1">
                <p className="pokemon-ident">{redFieldPokemonBattleState.pokemon_build.pokemon.ident}</p>
                <div className="hp-bar-container">
                  <div className="current-hp" style={{width: `${redPokemonHealthPercentage}%`}}></div>
                </div>
                <img src={redPokemonImage} className="pokemon-image" alt="pokemon-image" />
              </div>
            ) : (<></>)}
          </div>
        </div>
        <div className="battle-actions">
          <div className="moves">
            {battleActions.map((battleAction: BattleAction, index: number) => {
              if(battleAction.action_type === "move") {
                return (
                  <div className="action move" key={`move-${index}`} onClick={() => { selectBattleAction(battleAction) }}>
                    <p>{`${battleAction.action_data.move.ident} | ${agentActions[index].toFixed(4)}`}</p>
                  </div>
                )
              } else {
                return (<></>)
              }
            })}
          </div>
          <div className="switches">
            {battleActions.map((battleAction: BattleAction, index: number) => {
              if(battleAction.action_type === "switch") {
                return (
                  <div className="action switch" key={`switch-${index}`} onClick={() => { selectBattleAction(battleAction) }}>
                    <p>{`switch -> ${battleAction.action_data.switch_target.pokemon_build.pokemon.ident} | ${agentActions[index].toFixed(4)}`}</p>
                  </div>
                )
              } else {
                return (<></>)
              }
            })}
          </div>
        </div>
      </div>
      <BattleLogRenderer battle={battle} />
      {agentActions.length > 0 ? (
        <BattleEvalBar maxActionValue={Math.max(...agentActions)} />
      ) : (<></>)}
    </div>
  )

}