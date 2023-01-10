import React, { useState } from "react";

import { Battle } from "../models/battle/Battle";
import { BattleAction } from "../models/battle/BattleAction";
import { Pokemon } from "../models/pokemon/Pokemon";
import { PokemonBattleState } from "../models/battle/PokemonBattleState";
import { BattleSide } from "../models/battle/BattleShared";

import { displayBattleAction } from "../decorators/BattleAction";
import { displayPokemonIdent } from "../decorators/Pokemon";

import { PokemonBattleTeamDisplayIndex } from "../components/PokemonBattleTeamDisplay";

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

export const BattleActionsRenderer: React.FC<{
  battle: Battle,
  battleActions: any,
  selectBattleActions: (blueActions: BattleAction[], redActions: BattleAction[]) => void
}> = ({
  battle,
  battleActions,
  selectBattleActions = () => undefined
}) => {
  const [blueField1BattleAction, setBlueField1BattleAction] = useState<BattleAction | null>(null);
  const [blueField2BattleAction, setBlueField2BattleAction] = useState<BattleAction | null>(null);
  const [redField1BattleAction, setRedField1BattleAction] = useState<BattleAction | null>(null);
  const [redField2BattleAction, setRedField2BattleAction] = useState<BattleAction | null>(null);
  const [blueField1BattleActionTarget, setBlueField1BattleActionTarget] = useState<string | null>(null);
  const [blueField2BattleActionTarget, setBlueField2BattleActionTarget] = useState<string | null>(null);
  const [redField1BattleActionTarget, setRedField1BattleActionTarget] = useState<string | null>(null);
  const [redField2BattleActionTarget, setRedField2BattleActionTarget] = useState<string | null>(null);
  const [actionTargetSlotCursor, setActionTargetSlotCursor] = useState<string | null>(null);

  const selectBattleAction = (battleAction: BattleAction, slot: string) => {
    if(actionTargetSlotCursor) {
      if(actionTargetSlotCursor === "blue-field-1") {
        setBlueField1BattleActionTarget(slot);
        const nextBattleAction = blueField1BattleAction;
        nextBattleAction!.action_data['selected_targets'] = [slot];
        setBlueField1BattleAction(nextBattleAction);
      }
      if(actionTargetSlotCursor === "blue-field-2") {
        setBlueField2BattleActionTarget(slot);
        const nextBattleAction = blueField2BattleAction;
        nextBattleAction!.action_data['selected_targets'] = [slot];
        setBlueField2BattleAction(nextBattleAction);
      }
      if(actionTargetSlotCursor === "red-field-1") {
        setRedField1BattleActionTarget(slot);
        const nextBattleAction = redField1BattleAction;
        nextBattleAction!.action_data['selected_targets'] = [slot];
        setRedField1BattleAction(nextBattleAction);
      }
      if(actionTargetSlotCursor === "red-field-2") {
        setRedField2BattleActionTarget(slot);
        const nextBattleAction = redField2BattleAction;
        nextBattleAction!.action_data['selected_targets'] = [slot];
        setRedField2BattleAction(nextBattleAction);
      }
      setActionTargetSlotCursor(null);
    } else {
      if(battleAction.action_data.move) {
        if(battleAction.action_data.move.target === "any-adjacent") {
          setActionTargetSlotCursor(slot);
        }
      }
      if(slot === "blue-field-1") { setBlueField1BattleAction(battleAction); }
      if(slot === "blue-field-2") { setBlueField2BattleAction(battleAction); }
      if(slot === "red-field-1") { setRedField1BattleAction(battleAction); }
      if(slot === "red-field-2") { setRedField2BattleAction(battleAction); }
    }
  }

  const submitActions = () => {
    if(blueField1BattleAction && blueField2BattleAction && redField1BattleAction && redField2BattleAction) {
      selectBattleActions([blueField1BattleAction, blueField2BattleAction], [redField1BattleAction, redField2BattleAction]);
      setBlueField1BattleAction(null);
      setBlueField2BattleAction(null);
      setRedField1BattleAction(null);
      setRedField2BattleAction(null);
      setBlueField1BattleActionTarget(null);
      setBlueField2BattleActionTarget(null);
      setRedField1BattleActionTarget(null);
      setRedField2BattleActionTarget(null);
      setActionTargetSlotCursor(null);
    }
  }

  const renderBattleActionsForSlot = (slot: string) => {
    const selectedBattleActionClassName = actionTargetSlotCursor === slot ? "selected-battle-action selecting-target" : "selected-battle-action";
    return (
      <div className="battle-actions">
        <div className="moves">
          {battleActions[slot] ? battleActions[slot].map((battleAction: BattleAction, index: number) => {
            if(battleAction.action_type === "move") {
              return (
                <div className="action move" key={`${slot}-move-${index}`} onClick={() => { selectBattleAction(battleAction, slot) }}>
                  <p>{displayBattleAction(battleAction)}</p>
                  {/* agentActions[index].toFixed(4) */}
                </div>
              )
            } else {
              return (<></>)
            }
          }) : (<></>)}
        </div>
        <div className="switches">
          {battleActions[slot] ? battleActions[slot].map((battleAction: BattleAction, index: number) => {
            if(battleAction.action_type === "switch") {
              return (
                <div className="action switch" key={`${slot}-switch-${index}`} onClick={() => { selectBattleAction(battleAction, slot) }}>
                  <p>{displayBattleAction(battleAction)}</p>
                  {/* agentActions[index].toFixed(4) */}
                </div>
              )
            } else {
              return (<></>)
            }
          }) : (<></>)}
        </div>
        <div className="flex-spacer" />
        <div className={selectedBattleActionClassName}>
          {slot === "blue-field-1" && blueField1BattleAction ? (
            <>
              {blueField1BattleActionTarget ? (<p>{`${displayBattleAction(blueField1BattleAction)} (${blueField1BattleActionTarget})`}</p>) : (<p>{displayBattleAction(blueField1BattleAction)}</p>)}
            </>
          ) : (<></>)}
          {slot === "blue-field-2" && blueField2BattleAction ? (
            <>
              {blueField2BattleActionTarget ? (<p>{`${displayBattleAction(blueField2BattleAction)} (${blueField2BattleActionTarget})`}</p>) : (<p>{displayBattleAction(blueField2BattleAction)}</p>)}
            </>
          ) : (<></>)}
          {slot === "red-field-1" && redField1BattleAction ? (
            <>
              {redField1BattleActionTarget ? (<p>{`${displayBattleAction(redField1BattleAction)} (${redField1BattleActionTarget})`}</p>) : (<p>{displayBattleAction(redField1BattleAction)}</p>)}
            </>
          ) : (<></>)}
          {slot === "red-field-2" && redField2BattleAction ? (
            <>
              {redField2BattleActionTarget ? (<p>{`${displayBattleAction(redField2BattleAction)} (${redField2BattleActionTarget})`}</p>) : (<p>{displayBattleAction(redField2BattleAction)}</p>)}
            </>
          ) : (<></>)}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="pokemon-battle-actions">
        <div className="battle-action-section blue-field-1">
          {renderBattleActionsForSlot("blue-field-1")}
        </div>
        <div className="battle-action-section blue-field-2">
          {renderBattleActionsForSlot("blue-field-2")}
        </div>
        <div className="battle-action-section red-field-1">
          {renderBattleActionsForSlot("red-field-1")}
        </div>
        <div className="battle-action-section red-field-2">
          {renderBattleActionsForSlot("red-field-2")}
        </div>
      </div>
      <div className="button" onClick={submitActions}>
        <p className="button-text">SUBMIT ACTIONS</p>
      </div>
    </>
  )

}

interface PokemonDecoratedBattleState {
  pokemon_battle_state: PokemonBattleState;
  pokemon_image: any;
  health_percentage: number;
}

export const BattleRenderer: React.FC<{
  battle: Battle,
  battleActions: any,
  agentActions: number[],
  selectBattleActions?: (blueActions: BattleAction[], redActions: BattleAction[]) => void,
  perspective: BattleSide
}> = ({
  battle,
  battleActions,
  agentActions,
  selectBattleActions = () => undefined,
  perspective
}) => {

  const decoratePokemonBattleState = (pokemonBattleState: PokemonBattleState): PokemonDecoratedBattleState => {
    let pokemonImage;
    const pokemon: Pokemon = pokemonBattleState.pokemon_build.pokemon;
    const pokemonPerspective = pokemonBattleState.battle_side === "blue" ? "back" : "front";
    try {
      pokemonImage = require(`../data/pokemon/paldea/${String(pokemon.paldea_regional_pokedex_number).padStart(2, "0")}-${pokemon.ident.split("-")[0]}/${pokemon.ident}.motion.${pokemonPerspective}.gif`);
    } catch (error) {
      pokemonImage = require(`../data/pokemon/paldea/${String(pokemon.paldea_regional_pokedex_number).padStart(2, "0")}-${pokemon.ident.split("-")[0]}/${pokemon.ident}.static.png`);
    }
    return {
      pokemon_battle_state: pokemonBattleState,
      pokemon_image: pokemonImage,
      health_percentage: (pokemonBattleState.current_hp / pokemonBattleState.pokemon_build.stat_spread.hp) * 100
    }
  }

  const pokemonBattleStateAtSlot = (slot: string): PokemonBattleState | undefined => {
    const targetBattleId = battle.battle_state.field_state[slot];
    if(slot.startsWith("blue")) {
      return battle.battle_state.blue_side_pokemon.find((pokemonBattleState) => { return pokemonBattleState.battle_id === targetBattleId });
    } else if(slot.startsWith("red")) {
      return battle.battle_state.red_side_pokemon.find((pokemonBattleState) => { return pokemonBattleState.battle_id === targetBattleId });
    }
  }

  const renderPokemonAtSlot = (pokemonDecoratedBattleState: PokemonDecoratedBattleState, slot: string) => {
    return (
      <div className={`side-pokemon ${slot}`}>
        <p className="pokemon-ident">{displayPokemonIdent(pokemonDecoratedBattleState.pokemon_battle_state.pokemon_build.pokemon.ident)}</p>
        <div className="hp-bar-container">
          <div className="current-hp" style={{width: `${pokemonDecoratedBattleState.health_percentage}%`}}></div>
        </div>
        <img src={pokemonDecoratedBattleState.pokemon_image} className="pokemon-image" alt="pokemon-image" />
      </div>
    );
  }

  const blueField1 = pokemonBattleStateAtSlot("blue-field-1");
  const blueField2 = pokemonBattleStateAtSlot("blue-field-2");
  const redField1 = pokemonBattleStateAtSlot("red-field-1");
  const redField2 = pokemonBattleStateAtSlot("red-field-2");

  return (
    <div className="battle-renderer-container">
      <div className="battle-renderer">
        <PokemonBattleTeamDisplayIndex pokemonBattleStates={battle.battle_state.blue_side_pokemon} />
        <div className="pokemons">
          <div className="player-pokemons">
            {blueField1 ? renderPokemonAtSlot(decoratePokemonBattleState(blueField1), "blue-field-1") : (<></>)}
            {blueField2 ? renderPokemonAtSlot(decoratePokemonBattleState(blueField2), "blue-field-2") : (<></>)}
          </div>
          <div className="side-field-state player-field-state">
            {battle.battle_state.blue_side_state.tailwind > 0 ? (<p>{`Tailwind: ${battle.battle_state.blue_side_state.tailwind}`}</p>) : (<></>)}
            {battle.battle_state.blue_side_state.reflect > 0 ? (<p>{`Reflect: ${battle.battle_state.blue_side_state.reflect}`}</p>) : (<></>)}
            {battle.battle_state.blue_side_state.light_screen > 0 ? (<p>{`Light Screen: ${battle.battle_state.blue_side_state.light_screen}`}</p>) : (<></>)}
          </div>
          <div className="global-field-state">
          </div>
          <div className="side-field-state enemy-field-state">
            {battle.battle_state.red_side_state.tailwind > 0 ? (<p>{`Tailwind: ${battle.battle_state.red_side_state.tailwind}`}</p>) : (<></>)}
            {battle.battle_state.red_side_state.reflect > 0 ? (<p>{`Reflect: ${battle.battle_state.red_side_state.reflect}`}</p>) : (<></>)}
            {battle.battle_state.red_side_state.light_screen > 0 ? (<p>{`Light Screen: ${battle.battle_state.red_side_state.light_screen}`}</p>) : (<></>)}
          </div>
          <div className="enemy-pokemons">
            {redField1 ? renderPokemonAtSlot(decoratePokemonBattleState(redField1), "red-field-1") : (<></>)}
            {redField2 ? renderPokemonAtSlot(decoratePokemonBattleState(redField2), "red-field-2") : (<></>)}
          </div>
        </div>
        <PokemonBattleTeamDisplayIndex pokemonBattleStates={battle.battle_state.red_side_pokemon} />
      </div>
      <BattleActionsRenderer battle={battle} battleActions={battleActions} selectBattleActions={selectBattleActions}/>
      <BattleLogRenderer battle={battle} />
      {agentActions.length > 0 ? (
        <BattleEvalBar maxActionValue={Math.max(...(agentActions.slice(0, battleActions.length)))} />
      ) : (<></>)}
    </div>
  )

}
