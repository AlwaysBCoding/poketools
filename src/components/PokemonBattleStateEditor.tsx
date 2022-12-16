import React, { useState, useEffect, ChangeEvent } from "react";
import useForceUpdate from "use-force-update";

import { PokemonBattleState } from "../models/battle/PokemonBattleState";
import { PokemonStatusIdent } from "../models/battle/BattleShared";
import { PokemonMoveSimple } from "../models/pokemon/PokemonMove";
import { calculateStatSpread } from "../models/pokemon/stat-calc";
import {
  PokemonNatureIdent,
  PokemonAbilityIdent,
  PokemonItemIdent,
  PokemonStatSpread,
  PokemonMoveIdent
} from "../models/pokemon/PokemonShared";

import { toTitleCase } from "../decorators/DecoratorsShared";
import { PokemonTypeBadge } from "../decorators/PokemonType";

import { PokemonNatureSelectList } from "../decorators/PokemonNature";
import { PokemonItemSelectList } from "../decorators/PokemonItem";
import { PokemonAbilitySelectList } from "../decorators/PokemonAbility";
import { PokemonStatusSelectList } from "../decorators/PokemonStatus";

import AllMoves from "../data/moves/all-moves.json";
const allMoves = AllMoves as PokemonMoveSimple[];

export const PokemonBattleStateEditor: React.FC<{
  initialPokemonBattleState: PokemonBattleState,
  updatePokemonBattleState?: (nextPokemonBattleState: PokemonBattleState) => void
}> = ({
  initialPokemonBattleState,
  updatePokemonBattleState = () => undefined
}) => {
  const forceUpdate = useForceUpdate();
  const [pokemonBattleState, setPokemonBattleState] = useState<PokemonBattleState>(initialPokemonBattleState);

  useEffect(() => {
    setPokemonBattleState(initialPokemonBattleState);
  }, [initialPokemonBattleState]);

  const handleStatValueChange = (statIdent: string, value: string) => {
    const nextPokemonBattleState = pokemonBattleState;
    if(statIdent === "iv-hp") { nextPokemonBattleState.pokemon_build.iv_spread.hp = Number(value); }
    if(statIdent === "ev-hp") { nextPokemonBattleState.pokemon_build.ev_spread.hp = Number(value); }
    if(statIdent === "iv-attack") { nextPokemonBattleState.pokemon_build.iv_spread.attack = Number(value); }
    if(statIdent === "ev-attack") { nextPokemonBattleState.pokemon_build.ev_spread.attack = Number(value); }
    if(statIdent === "iv-defense") { nextPokemonBattleState.pokemon_build.iv_spread.defense = Number(value); }
    if(statIdent === "ev-defense") { nextPokemonBattleState.pokemon_build.ev_spread.defense = Number(value); }
    if(statIdent === "iv-special_attack") { nextPokemonBattleState.pokemon_build.iv_spread.special_attack = Number(value); }
    if(statIdent === "ev-special_attack") { nextPokemonBattleState.pokemon_build.ev_spread.special_attack = Number(value); }
    if(statIdent === "iv-special_defense") { nextPokemonBattleState.pokemon_build.iv_spread.special_defense = Number(value); }
    if(statIdent === "ev-special_defense") { nextPokemonBattleState.pokemon_build.ev_spread.special_defense = Number(value); }
    if(statIdent === "iv-speed") { nextPokemonBattleState.pokemon_build.iv_spread.speed = Number(value); }
    if(statIdent === "ev-speed") { nextPokemonBattleState.pokemon_build.ev_spread.speed = Number(value); }
    const nextStatSpread: PokemonStatSpread = calculateStatSpread(
      pokemonBattleState.pokemon_build.pokemon.ident,
      pokemonBattleState.pokemon_build.iv_spread,
      pokemonBattleState.pokemon_build.ev_spread,
      pokemonBattleState.pokemon_build.nature_ident
    );
    nextPokemonBattleState.pokemon_build.stat_spread = nextStatSpread;
    setPokemonBattleState(nextPokemonBattleState);
    updatePokemonBattleState(nextPokemonBattleState);
    forceUpdate();
  }

  const handleNatureSelect = (pokemonNatureIdent: PokemonNatureIdent) => {
    const nextPokemonBattleState = pokemonBattleState;
    const nextStatSpread: PokemonStatSpread = calculateStatSpread(
      pokemonBattleState.pokemon_build.pokemon.ident,
      pokemonBattleState.pokemon_build.iv_spread,
      pokemonBattleState.pokemon_build.ev_spread,
      pokemonNatureIdent
    );
    nextPokemonBattleState.pokemon_build.stat_spread = nextStatSpread;
    setPokemonBattleState(nextPokemonBattleState);
    updatePokemonBattleState(nextPokemonBattleState);
    forceUpdate();
  }

  const handleAbilitySelect = (pokemonAbilityIdent: PokemonAbilityIdent) => {
    // ...
  }

  const handleStatusSelect = (pokemonStatusIdent: PokemonStatusIdent) => {
    // ...
  }

  const handleItemSelect = (pokemonItemIdent: PokemonItemIdent) => {
    const nextPokemonBattleState = pokemonBattleState;
    nextPokemonBattleState.item_ident = pokemonItemIdent;
    setPokemonBattleState(nextPokemonBattleState);
    updatePokemonBattleState(nextPokemonBattleState);
    forceUpdate();
  }

  const handleMoveSelect = (moveIdent: PokemonMoveIdent, moveIndex: number) => {
    const nextPokemonBattleState = pokemonBattleState;
    nextPokemonBattleState.pokemon_build.move_idents[moveIndex] = moveIdent;
    setPokemonBattleState(nextPokemonBattleState);
    updatePokemonBattleState(nextPokemonBattleState);
    forceUpdate();
  }

  const move0 = allMoves.find((move: PokemonMoveSimple) => { return move.ident === pokemonBattleState.pokemon_build.move_idents[0] });
  const move1 = allMoves.find((move: PokemonMoveSimple) => { return move.ident === pokemonBattleState.pokemon_build.move_idents[1] });
  const move2 = allMoves.find((move: PokemonMoveSimple) => { return move.ident === pokemonBattleState.pokemon_build.move_idents[2] });
  const move3 = allMoves.find((move: PokemonMoveSimple) => { return move.ident === pokemonBattleState.pokemon_build.move_idents[3] });

  return (
    <div className="pokemon-battle-state-editor">
      <div className="data-group pokemon-meta">
        <div className="data-row pokemon-ident">
          <p className="data-row-label">Pokemon</p>
          <h4>{pokemonBattleState.pokemon_build.pokemon.ident}</h4>
        </div>
        <div className="data-row pokemon-type">
          <p className="data-row-label">Type</p>
          <PokemonTypeBadge typeIdent={pokemonBattleState.pokemon_build.pokemon.primary_type_ident} />
          {pokemonBattleState.pokemon_build.pokemon.secondary_type_ident ? (<PokemonTypeBadge typeIdent={pokemonBattleState.pokemon_build.pokemon.secondary_type_ident} />) : (<></>)}
        </div>
        <div className="data-row pokemon-tera-type">
          <p className="data-row-label">Tera</p>
          <PokemonTypeBadge typeIdent={pokemonBattleState.pokemon_build.tera_type_ident} />
        </div>
        <div className="data-row pokemon-level">
          <p className="data-row-label">Level</p>
          <p className="data-row-value">{pokemonBattleState.pokemon_build.level}</p>
        </div>
        <div className="data-row pokemon-gender">
          <p className="data-row-label">Gender</p>
          <p className="data-row-value">{pokemonBattleState.pokemon_build.gender}</p>
        </div>
      </div>
      <div className="data-group pokemon-stats">
        <div className="data-row header-row">
          <p className="col-1"></p>
          <p className="col-2">Base</p>
          <p className="col-3">IVs</p>
          <p className="col-4">EVs</p>
          <p className="col-5">Total</p>
          <p className="col-6" />
        </div>
        <div className="data-row data-row-hp">
          <p className="col-1">HP</p>
          <p className="col-2">{pokemonBattleState.pokemon_build.pokemon.base_stats.hp}</p>
          <input
            className="col-3"
            value={pokemonBattleState.pokemon_build.iv_spread.hp}
            onChange={(e) => { handleStatValueChange("iv-hp", e.target.value); }} />
          <input
            className="col-4"
            value={pokemonBattleState.pokemon_build.ev_spread.hp}
            onChange={(e) => { handleStatValueChange("ev-hp", e.target.value); }} />
          <p className="col-5">{pokemonBattleState.pokemon_build.stat_spread.hp}</p>
          <p className="col-6" />
        </div>
        <div className="data-row data-row-attack">
          <p className="col-1">Attack</p>
          <p className="col-2">{pokemonBattleState.pokemon_build.pokemon.base_stats.attack}</p>
          <input
            className="col-3"
            value={pokemonBattleState.pokemon_build.iv_spread.attack}
            onChange={(e) => { handleStatValueChange("iv-attack", e.target.value); }} />
          <input
            className="col-4"
            value={pokemonBattleState.pokemon_build.ev_spread.attack}
            onChange={(e) => { handleStatValueChange("ev-attack", e.target.value); }} />
          <p className="col-5">{pokemonBattleState.pokemon_build.stat_spread.attack}</p>
          <p className="col-6" />
        </div>
        <div className="data-row data-row-defense">
          <p className="col-1">Defense</p>
          <p className="col-2">{pokemonBattleState.pokemon_build.pokemon.base_stats.defense}</p>
          <input
            className="col-3"
            value={pokemonBattleState.pokemon_build.iv_spread.defense}
            onChange={(e) => { handleStatValueChange("iv-defense", e.target.value); }} />
          <input
            className="col-4"
            value={pokemonBattleState.pokemon_build.ev_spread.defense}
            onChange={(e) => { handleStatValueChange("ev-defense", e.target.value); }} />
          <p className="col-5">{pokemonBattleState.pokemon_build.stat_spread.defense}</p>
          <p className="col-6" />
        </div>
        <div className="data-row data-row-special-attack">
          <p className="col-1">Sp. Atk</p>
          <p className="col-2">{pokemonBattleState.pokemon_build.pokemon.base_stats.special_attack}</p>
          <input
            className="col-3"
            value={pokemonBattleState.pokemon_build.iv_spread.special_attack}
            onChange={(e) => { handleStatValueChange("iv-special_attack", e.target.value); }} />
          <input
            className="col-4"
            value={pokemonBattleState.pokemon_build.ev_spread.special_attack}
            onChange={(e) => { handleStatValueChange("ev-special_attack", e.target.value); }} />
          <p className="col-5">{pokemonBattleState.pokemon_build.stat_spread.special_attack}</p>
          <p className="col-6" />
        </div>
        <div className="data-row data-row-special-defense">
          <p className="col-1">Sp. Def</p>
          <p className="col-2">{pokemonBattleState.pokemon_build.pokemon.base_stats.special_defense}</p>
          <input
            className="col-3"
            value={pokemonBattleState.pokemon_build.iv_spread.special_defense}
            onChange={(e) => { handleStatValueChange("iv-special_defense", e.target.value); }} />
          <input
            className="col-4"
            value={pokemonBattleState.pokemon_build.ev_spread.special_defense}
            onChange={(e) => { handleStatValueChange("ev-special_defense", e.target.value); }} />
          <p className="col-5">{pokemonBattleState.pokemon_build.stat_spread.special_defense}</p>
          <p className="col-6" />
        </div>
        <div className="data-row data-row-speed">
          <p className="col-1">Speed</p>
          <p className="col-2">{pokemonBattleState.pokemon_build.pokemon.base_stats.speed}</p>
          <input
            className="col-3"
            value={pokemonBattleState.pokemon_build.iv_spread.speed}
            onChange={(e) => { handleStatValueChange("iv-speed", e.target.value); }} />
          <input
            className="col-4"
            value={pokemonBattleState.pokemon_build.ev_spread.speed}
            onChange={(e) => { handleStatValueChange("ev-speed", e.target.value); }} />
          <p className="col-5">{pokemonBattleState.pokemon_build.stat_spread.speed}</p>
          <p className="col-6" />
        </div>
        <div className="data-row-select-value data-row-nature-select">
          <p className="data-row-label">Nature</p>
          <PokemonNatureSelectList
            natureIdent={pokemonBattleState.pokemon_build.nature_ident}
            onNatureSelect={handleNatureSelect} />
        </div>
      </div>
      <div className="data-group pokemon-volatile-build-info">
        <div className="data-row-select-value">
          <p className="data-row-label">Ability</p>
          <PokemonAbilitySelectList
            pokemonBuild={pokemonBattleState.pokemon_build}
            onAbilitySelect={handleAbilitySelect} />
        </div>
        <div className="data-row-select-value">
          <p className="data-row-label">Item</p>
          <PokemonItemSelectList
            itemIdent={pokemonBattleState.item_ident}
            onItemSelect={handleItemSelect} />
        </div>
        <div className="data-row-select-value">
          <p className="data-row-label">Status</p>
          <PokemonStatusSelectList
            pokemonStatusIdent={pokemonBattleState.status}
            onStatusSelect={handleStatusSelect} />
        </div>
      </div>
      <div className="data-group pokemon-moves">
        <div className="data-row move-1">
          <select className="col-1" value={pokemonBattleState.pokemon_build.move_idents[0]} onChange={(e) => { handleMoveSelect(e.target.value as PokemonMoveIdent, 0) }}>
            <option value={""}>(none)</option>
            {pokemonBattleState.pokemon_build.pokemon.move_idents.map((moveIdent: PokemonMoveIdent, index: number) => {
              return (
                <option key={`option-${index}`} value={moveIdent}>{toTitleCase(moveIdent)}</option>
              );
            })}
          </select>
          <p className="col-2">{move0?.base_power || "-"}</p>
          <div className="col-3">
            {move0 ? (<PokemonTypeBadge typeIdent={move0.type_ident} />) : (<></>)}
          </div>
          <p className="col-4">{move0?.category_ident || "-"}</p>
        </div>
        <div className="data-row move-2">
          <select className="col-1" value={pokemonBattleState.pokemon_build.move_idents[1]} onChange={(e) => { handleMoveSelect(e.target.value as PokemonMoveIdent, 1) }}>
            <option value={""}>(none)</option>
            {pokemonBattleState.pokemon_build.pokemon.move_idents.map((moveIdent: PokemonMoveIdent, index: number) => {
              return (
                <option key={`option-${index}`} value={moveIdent}>{toTitleCase(moveIdent)}</option>
              );
            })}
          </select>
          <p className="col-2">{move1?.base_power || "-"}</p>
          <div className="col-3">
            {move1 ? (<PokemonTypeBadge typeIdent={move1.type_ident} />) : (<></>)}
          </div>
          <p className="col-4">{move1?.category_ident || "-"}</p>
        </div>
        <div className="data-row move-3">
          <select className="col-1" value={pokemonBattleState.pokemon_build.move_idents[2]} onChange={(e) => { handleMoveSelect(e.target.value as PokemonMoveIdent, 2) }}>
            <option value={""}>(none)</option>
            {pokemonBattleState.pokemon_build.pokemon.move_idents.map((moveIdent: PokemonMoveIdent, index: number) => {
              return (
                <option key={`option-${index}`} value={moveIdent}>{toTitleCase(moveIdent)}</option>
              );
            })}
          </select>
          <p className="col-2">{move2?.base_power || "-"}</p>
          <div className="col-3">
            {move2 ? (<PokemonTypeBadge typeIdent={move2.type_ident} />) : (<></>)}
          </div>
          <p className="col-4">{move2?.category_ident || "-"}</p>
        </div>
        <div className="data-row move-4">
          <select className="col-1" value={pokemonBattleState.pokemon_build.move_idents[3]} onChange={(e) => { handleMoveSelect(e.target.value as PokemonMoveIdent, 3) }}>
            <option value={""}>(none)</option>
            {pokemonBattleState.pokemon_build.pokemon.move_idents.map((moveIdent: PokemonMoveIdent, index: number) => {
              return (
                <option key={`option-${index}`} value={moveIdent}>{toTitleCase(moveIdent)}</option>
              );
            })}
          </select>
          <p className="col-2">{move3?.base_power || "-"}</p>
          <div className="col-3">
            {move3 ? (<PokemonTypeBadge typeIdent={move3.type_ident} />) : (<></>)}
          </div>
          <p className="col-4">{move3?.category_ident || "-"}</p>
        </div>
      </div>
    </div>
  )
}
