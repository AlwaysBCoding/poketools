import React, { useState, useEffect } from "react";

import { Battle } from "../models/battle/Battle";
import { BattleAction } from "../models/battle/BattleAction";
import { Pokemon } from "../models/pokemon/Pokemon";
import { PokemonBattleState } from "../models/battle/PokemonBattleState";
import { BattleSide, BattleSlot } from "../models/battle/BattleShared";

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

export const BattleStateHistoryControls: React.FC<{
  onStepBackwards: () => void,
  onStepForwards: () => void,
}> = ({
  onStepBackwards = () => undefined,
  onStepForwards = () => undefined
}) => {
  return (
    <div className="battle-state-history-controls">
      <div className="button step-backward" onClick={onStepBackwards}>
        <p className="button-text">{`<< STEP`}</p>
      </div>
      <div className="button step-forward" onClick={onStepForwards}>
        <p className="button-text">{`STEP >>`}</p>
      </div>
    </div>
  )
}

export const BattleActionsRenderer: React.FC<{
  battle: Battle,
  battleActions: any,
  selectBattleActions: (battle: Battle, blueActions: BattleAction[], redActions: BattleAction[]) => void,
  replacePokemonAction: (battleAction: BattleAction) => void
}> = ({
  battle,
  battleActions,
  selectBattleActions = () => undefined,
  replacePokemonAction = () => undefined
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

  const resetState = () => {
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

  useEffect(() => {
    resetState();
  }, [battle]);

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
    if(battle.active_prompt_slot) {
      if(battle.active_prompt_slot === "blue-field-1" && blueField1BattleAction) { replacePokemonAction(blueField1BattleAction) }
      if(battle.active_prompt_slot === "blue-field-2" && blueField2BattleAction) { replacePokemonAction(blueField2BattleAction) }
      if(battle.active_prompt_slot === "red-field-1" && redField1BattleAction) { replacePokemonAction(redField1BattleAction) }
      if(battle.active_prompt_slot === "red-field-2" && redField2BattleAction) { replacePokemonAction(redField2BattleAction) }
      resetState();
    } else {
      const blueActions = [];
      const redActions = [];
      if(blueField1BattleAction) { blueActions.push(blueField1BattleAction); }
      if(blueField2BattleAction) { blueActions.push(blueField2BattleAction); }
      if(redField1BattleAction) { redActions.push(redField1BattleAction); }
      if(redField2BattleAction) { redActions.push(redField2BattleAction); }
      selectBattleActions(battle, blueActions, redActions);
      resetState();
    }
  }

  const renderBattleActionsForSlot = (slot: string) => {
    const selectedBattleActionClassName = actionTargetSlotCursor === slot ? "selected-battle-action selecting-target" : "selected-battle-action";
    return (
      <div className="battle-actions">
        <div className="replaces">
          {battleActions[slot] ? battleActions[slot].map((battleAction: BattleAction, index: number) => {
            if(battleAction.action_type === "replace") {
              return (
                <div className="action replace" key={`${slot}-replace-${index}`} onClick={() => { selectBattleAction(battleAction, slot) }}>
                  <p>{displayBattleAction(battleAction)}</p>
                  {/* agentActions[index].toFixed(4) */}
                </div>
              )
            } else {
              return (<></>)
            }
          }) : (<></>)}
        </div>
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

  if(battle.status !== "complete") {
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
  } else {
    return (
      <div className="pokemon-battle-actions">
        <h4 className="battle-complete-text">BATTLE COMPLETE</h4>
      </div>
    )
  }

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
  selectBattleActions?: (battle: Battle, blueActions: BattleAction[], redActions: BattleAction[]) => void,
  replacePokemonAction?: (battleAction: BattleAction) => void
  perspective: BattleSide,
  historicalBattleStates: {battle: Battle, battleActions: Record<string, any>}[]
}> = ({
  battle,
  battleActions,
  agentActions,
  selectBattleActions = () => undefined,
  replacePokemonAction = () => undefined,
  perspective,
  historicalBattleStates
}) => {

  const [activeBattle, setActiveBattle] = useState<Battle>(battle);
  const [activeBattleActions, setActiveBattleActions] = useState<any>(battleActions);
  const [historicalBattleStateRewindCursor, setHistoricalBattleStateRewindCursor] = useState<number>(0);

  useEffect(() => {
    setActiveBattle(battle);
    setHistoricalBattleStateRewindCursor(0);
  }, [battle])

  useEffect(() => {
    setActiveBattleActions(battleActions);
    setHistoricalBattleStateRewindCursor(0);
  }, [battleActions])

  const stepHistoricalBattleState = (direction: "backwards" | "forwards") => {
    let nextHistoricalBattleStateRewindCursor = historicalBattleStateRewindCursor;
    if(direction === "backwards") {
      nextHistoricalBattleStateRewindCursor = Math.min(nextHistoricalBattleStateRewindCursor + 1, (historicalBattleStates.length - 1));
    } else if(direction === "forwards") {
      nextHistoricalBattleStateRewindCursor = Math.max(nextHistoricalBattleStateRewindCursor - 1, 0);
    }
    const historicalBattleState = historicalBattleStates[(historicalBattleStates.length - 1 - nextHistoricalBattleStateRewindCursor)];
    setActiveBattle(historicalBattleState.battle);
    setActiveBattleActions(historicalBattleState.battleActions);
    setHistoricalBattleStateRewindCursor(nextHistoricalBattleStateRewindCursor);
  }

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
    const targetBattleId = activeBattle.battle_state.field_state[slot];
    if(slot.startsWith("blue")) {
      return activeBattle.battle_state.blue_side_pokemon.find((pokemonBattleState) => { return pokemonBattleState.battle_id === targetBattleId });
    } else if(slot.startsWith("red")) {
      return activeBattle.battle_state.red_side_pokemon.find((pokemonBattleState) => { return pokemonBattleState.battle_id === targetBattleId });
    }
  }

  const renderStatBoostBadgeForStat = (pokemonBattleState: PokemonBattleState, stat: string) => {
    let statBoostValue;
    let statBoostText;
    let statBoostSymbol;
    let statBoostClassName = `stat-boost`;
    if(stat === "attack") {
      statBoostValue = pokemonBattleState.stat_boosts.attack;
      statBoostText = `Atk`;
    }
    if(stat === "defense") {
      statBoostValue = pokemonBattleState.stat_boosts.defense;
      statBoostText = `Def`;
    }
    if(stat === "special_attack") {
      statBoostValue = pokemonBattleState.stat_boosts.special_attack;
      statBoostText = `SpA`;
    }
    if(stat === "special_defense") {
      statBoostValue = pokemonBattleState.stat_boosts.special_defense;
      statBoostText = `SpD`;
    }
    if(stat === "speed") {
      statBoostValue = pokemonBattleState.stat_boosts.speed;
      statBoostText = `Spe`;
    }
    if(stat === "accuracy") {
      statBoostValue = pokemonBattleState.stat_boosts.accuracy;
      statBoostText = `Acc`;
    }
    if(stat === "evasiveness") {
      statBoostValue = pokemonBattleState.stat_boosts.evasiveness;
      statBoostText = `Eva`;
    }
    if(stat === "critical_hit") {
      statBoostValue = pokemonBattleState.stat_boosts.critical_hit;
      statBoostText = `Cri`;
    }

    if(statBoostValue && statBoostValue > 0) {
      statBoostSymbol = "+";
      statBoostClassName += " positive";
    } else {
      statBoostSymbol = "";
      statBoostClassName += " negative";
    }

    return (
      <p className={statBoostClassName}>{`${statBoostSymbol}${statBoostValue} ${statBoostText}`}</p>
    )
  }

  const renderPokemonAtSlot = (pokemonDecoratedBattleState: PokemonDecoratedBattleState, slot: string) => {
    return (
      <div className={`side-pokemon ${slot}`}>
        <p className="pokemon-ident">{displayPokemonIdent(pokemonDecoratedBattleState.pokemon_battle_state.pokemon_build.pokemon.ident)}</p>
        <div className="hp-bar-container">
          <div className="current-hp" style={{width: `${pokemonDecoratedBattleState.health_percentage}%`}}></div>
        </div>
        <div className="stat-boosts">
          {pokemonDecoratedBattleState.pokemon_battle_state.stat_boosts.attack ? renderStatBoostBadgeForStat(pokemonDecoratedBattleState.pokemon_battle_state, "attack") : (<></>)}
          {pokemonDecoratedBattleState.pokemon_battle_state.stat_boosts.defense ? renderStatBoostBadgeForStat(pokemonDecoratedBattleState.pokemon_battle_state, "defense") : (<></>)}
          {pokemonDecoratedBattleState.pokemon_battle_state.stat_boosts.special_attack ? renderStatBoostBadgeForStat(pokemonDecoratedBattleState.pokemon_battle_state, "special_attack") : (<></>)}
          {pokemonDecoratedBattleState.pokemon_battle_state.stat_boosts.special_defense ? renderStatBoostBadgeForStat(pokemonDecoratedBattleState.pokemon_battle_state, "special_defense") : (<></>)}
          {pokemonDecoratedBattleState.pokemon_battle_state.stat_boosts.speed ? renderStatBoostBadgeForStat(pokemonDecoratedBattleState.pokemon_battle_state, "speed") : (<></>)}
          {pokemonDecoratedBattleState.pokemon_battle_state.stat_boosts.accuracy ? renderStatBoostBadgeForStat(pokemonDecoratedBattleState.pokemon_battle_state, "accuracy") : (<></>)}
          {pokemonDecoratedBattleState.pokemon_battle_state.stat_boosts.evasiveness ? renderStatBoostBadgeForStat(pokemonDecoratedBattleState.pokemon_battle_state, "evasiveness") : (<></>)}
          {pokemonDecoratedBattleState.pokemon_battle_state.stat_boosts.critical_hit ? renderStatBoostBadgeForStat(pokemonDecoratedBattleState.pokemon_battle_state, "critical_hit") : (<></>)}
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
        <PokemonBattleTeamDisplayIndex
          pokemonBattleStates={activeBattle.battle_state.blue_side_pokemon} />
          {/* onPokemonBattleStateClick={(pokemonBattleState, teamIndex) => replacePokemonAction("blue-field-1", pokemonBattleState.battle_id)}  */}
        <div className="pokemons">
          <div className="player-pokemons">
            {blueField1 ? renderPokemonAtSlot(decoratePokemonBattleState(blueField1), "blue-field-1") : (<></>)}
            {blueField2 ? renderPokemonAtSlot(decoratePokemonBattleState(blueField2), "blue-field-2") : (<></>)}
          </div>
          <div className="side-field-state player-field-state">
            {activeBattle.battle_state.blue_side_state.tailwind > 0 ? (<p>{`Tailwind: ${activeBattle.battle_state.blue_side_state.tailwind}`}</p>) : (<></>)}
            {activeBattle.battle_state.blue_side_state.reflect > 0 ? (<p>{`Reflect: ${activeBattle.battle_state.blue_side_state.reflect}`}</p>) : (<></>)}
            {activeBattle.battle_state.blue_side_state.light_screen > 0 ? (<p>{`Light Screen: ${activeBattle.battle_state.blue_side_state.light_screen}`}</p>) : (<></>)}
          </div>
          <div className="global-field-state">
          </div>
          <div className="side-field-state enemy-field-state">
            {activeBattle.battle_state.red_side_state.tailwind > 0 ? (<p>{`Tailwind: ${activeBattle.battle_state.red_side_state.tailwind}`}</p>) : (<></>)}
            {activeBattle.battle_state.red_side_state.reflect > 0 ? (<p>{`Reflect: ${activeBattle.battle_state.red_side_state.reflect}`}</p>) : (<></>)}
            {activeBattle.battle_state.red_side_state.light_screen > 0 ? (<p>{`Light Screen: ${activeBattle.battle_state.red_side_state.light_screen}`}</p>) : (<></>)}
          </div>
          <div className="enemy-pokemons">
            {redField1 ? renderPokemonAtSlot(decoratePokemonBattleState(redField1), "red-field-1") : (<></>)}
            {redField2 ? renderPokemonAtSlot(decoratePokemonBattleState(redField2), "red-field-2") : (<></>)}
          </div>
        </div>
        <PokemonBattleTeamDisplayIndex
          pokemonBattleStates={activeBattle.battle_state.red_side_pokemon} />
          {/* onPokemonBattleStateClick={(pokemonBattleState, teamIndex) => replacePokemonAction("red-field-1", pokemonBattleState.battle_id) } */}
      </div>
      <BattleActionsRenderer battle={activeBattle} battleActions={activeBattleActions} selectBattleActions={selectBattleActions} replacePokemonAction={replacePokemonAction} />
      <BattleLogRenderer battle={activeBattle} />
      <BattleStateHistoryControls
        onStepBackwards={() => stepHistoricalBattleState("backwards")}
        onStepForwards={() => stepHistoricalBattleState("forwards")} />
      {agentActions.length > 0 ? (
        <BattleEvalBar maxActionValue={Math.max(...(agentActions.slice(0, battleActions.length)))} />
      ) : (<></>)}
    </div>
  )

}
