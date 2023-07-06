import React, { useState, useEffect, ChangeEvent } from "react";
import useForceUpdate from "use-force-update";
import CountUp from "react-countup";

import { PokemonBattleState, createDefaultPokemonBattleStateForPokemonIdent } from "../models/battle/PokemonBattleState";
import { PokemonStatusIdent } from "../models/battle/BattleShared";
import { PokemonMoveSimple } from "../models/pokemon/PokemonMove";
import { calculateStatSpread } from "../models/pokemon/stat-calc";
import {
  PokemonIdent,
  PokemonTypeIdent,
  PokemonGender,
  PokemonNatureIdent,
  PokemonAbilityIdent,
  PokemonItemIdent,
  PokemonStatSpread,
  PokemonMoveIdent
} from "../models/pokemon/PokemonShared";

import { PokemonTypeBadge, PokemonTypeSelectList } from "../decorators/PokemonType";
import { PokemonSelectList, PokemonFormeSelectList, displayPokemonGender } from "../decorators/Pokemon";
import { displayPokemonMove } from "../decorators/PokemonMove";
import { PokemonMoveCategoryBadge } from "../decorators/PokemonMoveCategory";
import { PokemonNatureSelectList } from "../decorators/PokemonNature";
import { PokemonItemSelectList } from "../decorators/PokemonItem";
import { PokemonAbilitySelectList } from "../decorators/PokemonAbility";
import { PokemonStatusSelectList } from "../decorators/PokemonStatus";

import AllMoves from "../data/moves/all-moves.json";
const allMoves = AllMoves as PokemonMoveSimple[];

const StatBoostSelectList: React.FC<{
  statBoostValue: string,
  onStatBoostSelect?: (statBoostValue: string) => void
}> = ({
  statBoostValue,
  onStatBoostSelect = () => undefined
}) => {

  const [selectedStatBoostValue, setSelectedStatBoostValue] = useState<string>("0");

  const handleStatBoostSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatBoostValue(e.target.value);
    onStatBoostSelect(e.target.value);
  }

  useEffect(() => {
    setSelectedStatBoostValue(statBoostValue);
  }, [statBoostValue]);

  return (
    <select className="stat-boost-select-list" value={selectedStatBoostValue} onChange={handleStatBoostSelect}>
      <option value={"6"}>+6</option>
      <option value={"5"}>+5</option>
      <option value={"4"}>+4</option>
      <option value={"3"}>+3</option>
      <option value={"2"}>+2</option>
      <option value={"1"}>+1</option>
      <option value={"0"}>--</option>
      <option value={"-1"}>-1</option>
      <option value={"-2"}>-2</option>
      <option value={"-3"}>-3</option>
      <option value={"-4"}>-4</option>
      <option value={"-5"}>-5</option>
      <option value={"-6"}>-6</option>
    </select>
  )

};

export const PokemonBattleStateEditor: React.FC<{
  initialPokemonBattleState: PokemonBattleState,
  updatePokemonBattleState?: (nextPokemonBattleState: PokemonBattleState) => void,
  targeting: string,
  updateTargeting?: (nextTargeting: string) => void,
  criticalHit: boolean,
  updateCriticalHit?: (nextCriticalHit: boolean) => void,
  damageCalcs?: number[][];
}> = ({
  initialPokemonBattleState,
  updatePokemonBattleState = () => undefined,
  targeting,
  updateTargeting = () => undefined,
  criticalHit,
  updateCriticalHit = () => undefined,
  damageCalcs = []
}) => {
  const forceUpdate = useForceUpdate();
  const [pokemonBattleState, setPokemonBattleState] = useState<PokemonBattleState>(initialPokemonBattleState);
  const [targetingValue, setTargetingValue] = useState<string>(targeting);
  const [criticalHitValue, setCriticalHitValue] = useState<boolean>(criticalHit);

  useEffect(() => {
    setPokemonBattleState(initialPokemonBattleState);
  }, [initialPokemonBattleState]);

 useEffect(() => {
  setTargetingValue(targeting);
 }, [targeting]);

 useEffect(() => {
  setCriticalHitValue(criticalHit);
 }, [criticalHit]);

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

  const handleAbilitySelect = (abilityIdent: PokemonAbilityIdent) => {
    const nextPokemonBattleState = pokemonBattleState;
    nextPokemonBattleState.ability_ident = abilityIdent;
    setPokemonBattleState(nextPokemonBattleState);
    updatePokemonBattleState(nextPokemonBattleState);
    forceUpdate();
  }

  const handleStatusSelect = (statusIdent: PokemonStatusIdent) => {
    const nextPokemonBattleState = pokemonBattleState;
    nextPokemonBattleState.status = statusIdent;
    setPokemonBattleState(nextPokemonBattleState);
    updatePokemonBattleState(nextPokemonBattleState);
    forceUpdate();
  }

  const handlePokemonSelect = (pokemonIdent: PokemonIdent) => {
    const nextPokemonBattleState = createDefaultPokemonBattleStateForPokemonIdent(pokemonIdent);
    setPokemonBattleState(nextPokemonBattleState);
    updatePokemonBattleState(nextPokemonBattleState);
    forceUpdate();
  }

  const handleFormeSelect = (formeIdent: PokemonIdent) => {
    const nextPokemonBattleState = createDefaultPokemonBattleStateForPokemonIdent(formeIdent);
    setPokemonBattleState(nextPokemonBattleState);
    updatePokemonBattleState(nextPokemonBattleState);
    forceUpdate();
  }

  const handleTeraTypeSelect = (typeIdent: PokemonTypeIdent) => {
    const nextPokemonBattleState = pokemonBattleState;
    nextPokemonBattleState.pokemon_build.tera_type_ident = typeIdent;
    setPokemonBattleState(nextPokemonBattleState);
    updatePokemonBattleState(nextPokemonBattleState);
    forceUpdate();
  }

  const handleLevelChange = (levelString: string) => {
    const nextPokemonBattleState = pokemonBattleState;
    const nextLevel = Number(levelString);
    const nextStatSpread: PokemonStatSpread = calculateStatSpread(
      nextPokemonBattleState.pokemon_build.pokemon.ident,
      nextPokemonBattleState.pokemon_build.iv_spread,
      nextPokemonBattleState.pokemon_build.ev_spread,
      nextPokemonBattleState.pokemon_build.nature_ident,
      nextLevel
    );
    nextPokemonBattleState.pokemon_build.level = nextLevel;
    nextPokemonBattleState.pokemon_build.stat_spread = nextStatSpread;
    setPokemonBattleState(nextPokemonBattleState);
    updatePokemonBattleState(nextPokemonBattleState);
    forceUpdate();
  }

  const handleGenderChange = (gender: PokemonGender) => {
    const nextPokemonBattleState = pokemonBattleState;
    nextPokemonBattleState.pokemon_build.gender = gender;
    setPokemonBattleState(nextPokemonBattleState);
    updatePokemonBattleState(nextPokemonBattleState);
    forceUpdate();
  }

  const handleItemSelect = (itemIdent: PokemonItemIdent) => {
    const nextPokemonBattleState = pokemonBattleState;
    if(itemIdent) {
      nextPokemonBattleState.item_ident = itemIdent;
    } else {
      nextPokemonBattleState.item_ident = null;
    }
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

  const handleTerastallizedChange = (booleanString: string) => {
    const nextPokemonBattleState = pokemonBattleState;
    if(booleanString === "false") {
      nextPokemonBattleState.terastallized = false;
    } else if(booleanString === "true") {
      nextPokemonBattleState.terastallized = true;
    }
    setPokemonBattleState(nextPokemonBattleState);
    updatePokemonBattleState(nextPokemonBattleState);
    forceUpdate();
  }

  const handleStatBoostValueChange = (statIdent: string, value: number) => {
    const nextPokemonBattleState = pokemonBattleState;
    if(statIdent === "attack") { nextPokemonBattleState.stat_boosts["attack"] = value; }
    if(statIdent === "defense") { nextPokemonBattleState.stat_boosts["defense"] = value; }
    if(statIdent === "special_attack") { nextPokemonBattleState.stat_boosts["special_attack"] = value; }
    if(statIdent === "special_defense") { nextPokemonBattleState.stat_boosts["special_defense"] = value; }
    if(statIdent === "speed") { nextPokemonBattleState.stat_boosts["speed"] = value; }
    setPokemonBattleState(nextPokemonBattleState);
    updatePokemonBattleState(nextPokemonBattleState);
    forceUpdate();
  }

  const handleTargetingSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setTargetingValue(e.target.value);
    updateTargeting(e.target.value);
    forceUpdate();
  }

  const handleCriticalHitSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    if(e.target.value === "false") {
      setCriticalHitValue(false);
      updateCriticalHit(false);
    } else if(e.target.value === "true") {
      setCriticalHitValue(true);
      updateCriticalHit(true);
    }
    forceUpdate();
  }

  const pokemonImage = require(`../data/pokemon/${pokemonBattleState.pokemon_build.pokemon.pokedex_region}/${String(pokemonBattleState.pokemon_build.pokemon.regional_pokedex_number).padStart(2, "0")}-${pokemonBattleState.pokemon_build.pokemon.ident.split("-")[0]}/${pokemonBattleState.pokemon_build.pokemon.ident}.static.png`);
  const move0 = allMoves.find((move: PokemonMoveSimple) => { return move.ident === pokemonBattleState.pokemon_build.move_idents[0] });
  const move1 = allMoves.find((move: PokemonMoveSimple) => { return move.ident === pokemonBattleState.pokemon_build.move_idents[1] });
  const move2 = allMoves.find((move: PokemonMoveSimple) => { return move.ident === pokemonBattleState.pokemon_build.move_idents[2] });
  const move3 = allMoves.find((move: PokemonMoveSimple) => { return move.ident === pokemonBattleState.pokemon_build.move_idents[3] });

  return (
    <div className="pokemon-battle-state-editor">
      <img className="pokemon-sprite" src={pokemonImage} alt={pokemonBattleState.pokemon_build.pokemon.ident} />
      <div className="data-group pokemon-meta">
        <div className="data-row pokemon-ident">
          <p className="data-row-label">Pokemon</p>
          <PokemonSelectList
            pokemonIdent={pokemonBattleState.pokemon_build.pokemon.ident}
            formeRootIdent={pokemonBattleState.pokemon_build.pokemon.forme_root_ident}
            onPokemonSelect={handlePokemonSelect} />
        </div>
        <div className="data-row pokemon-forme">
          <p className="data-row-label">Forme</p>
          <PokemonFormeSelectList
            formeIdent={pokemonBattleState.pokemon_build.pokemon.ident}
            formeRootIdent={pokemonBattleState.pokemon_build.pokemon.forme_root_ident ? pokemonBattleState.pokemon_build.pokemon.forme_root_ident : pokemonBattleState.pokemon_build.pokemon.ident}
            onFormeSelect={handleFormeSelect} />
        </div>
        <div className="data-row pokemon-type">
          <p className="data-row-label">Type</p>
          <PokemonTypeBadge typeIdent={pokemonBattleState.pokemon_build.pokemon.primary_type_ident} />
          {pokemonBattleState.pokemon_build.pokemon.secondary_type_ident ? (<PokemonTypeBadge typeIdent={pokemonBattleState.pokemon_build.pokemon.secondary_type_ident} />) : (<></>)}
        </div>
        <div className="data-row pokemon-tera-type">
          <p className="data-row-label">Tera</p>
          <PokemonTypeSelectList
            typeIdent={pokemonBattleState.pokemon_build.tera_type_ident}
            onTypeSelect={handleTeraTypeSelect} />
        </div>
        <div className="data-row data-row-select-value pokemon-gender">
          <p className="data-row-label">Gender</p>
          <select className="data-row-select" value={pokemonBattleState.pokemon_build.gender} onChange={(e) => { handleGenderChange(e.target.value as PokemonGender); }}>
            {pokemonBattleState.pokemon_build.pokemon.genders.map((gender: PokemonGender, index: number) => {
              return (
                <option key={`option-${index}`} value={gender}>{displayPokemonGender(gender)}</option>
              )
            })}
          </select>
        </div>
        <div className="data-row data-row-input-value pokemon-level">
          <p className="data-row-label">Level</p>
          <input
            className="data-row-input level"
            value={pokemonBattleState.pokemon_build.level}
            onChange={(e) => { handleLevelChange(e.target.value); }} />
        </div>
      </div>
      <div className="data-group pokemon-build-info">
        <div className="data-row data-row-select-value">
          <p className="data-row-label">Ability</p>
          <PokemonAbilitySelectList
            pokemonBuild={pokemonBattleState.pokemon_build}
            onAbilitySelect={handleAbilitySelect} />
        </div>
        <div className="data-row data-row-select-value">
          <p className="data-row-label">Item</p>
          <PokemonItemSelectList
            itemIdent={pokemonBattleState.item_ident}
            onItemSelect={handleItemSelect} />
        </div>
      </div>
      <div className="data-group pokemon-volatile-build-info">
        <div className="data-row data-row-select-value">
          <p className="data-row-label">Status</p>
          <PokemonStatusSelectList
            pokemonStatusIdent={pokemonBattleState.status}
            onStatusSelect={handleStatusSelect} />
        </div>
        <div className="data-row data-row-select-value">
          <p className="data-row-label">Terastallized</p>
          <select className="terastallized-select-list" value={`${pokemonBattleState.terastallized}`} onChange={(e) => { handleTerastallizedChange(e.target.value); }}>
            <option value={"false"}>No</option>
            <option value={"true"}>Yes</option>
          </select>
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
          <StatBoostSelectList
            statBoostValue={`${pokemonBattleState.stat_boosts.attack}`}
            onStatBoostSelect={(valueString) => { handleStatBoostValueChange("attack", Number(valueString)) }} />
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
          <StatBoostSelectList
            statBoostValue={`${pokemonBattleState.stat_boosts.defense}`}
            onStatBoostSelect={(valueString) => { handleStatBoostValueChange("defense", Number(valueString)) }} />
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
          <StatBoostSelectList
            statBoostValue={`${pokemonBattleState.stat_boosts.special_attack}`}
            onStatBoostSelect={(valueString) => { handleStatBoostValueChange("special_attack", Number(valueString)) }} />
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
          <StatBoostSelectList
            statBoostValue={`${pokemonBattleState.stat_boosts.special_defense}`}
            onStatBoostSelect={(valueString) => { handleStatBoostValueChange("special_defense", Number(valueString)) }} />
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
          <StatBoostSelectList
            statBoostValue={`${pokemonBattleState.stat_boosts.speed}`}
            onStatBoostSelect={(valueString) => { handleStatBoostValueChange("speed", Number(valueString)) }} />
        </div>
        <div className="data-row data-row-select-value data-row-nature-select">
          <p className="data-row-label pokemon-nature">Nature</p>
          <PokemonNatureSelectList
            natureIdent={pokemonBattleState.pokemon_build.nature_ident}
            onNatureSelect={handleNatureSelect} />
        </div>
      </div>
      <div className="data-group pokemon-moves">
        <div className="data-row header-row">
          <p className="col-1">Move</p>
          <p className="col-2">BP</p>
          <p className="col-3">Type</p>
          <p className="col-4">Cat</p>
          {damageCalcs.length > 0 ? (
            <>
              <p className="col-5">Low</p>
              <p className="col-6">High</p>
            </>
          ) : (<></>)}
        </div>
        <div className="data-row move-1">
          <select className="col-1" value={pokemonBattleState.pokemon_build.move_idents[0]} onChange={(e) => { handleMoveSelect(e.target.value as PokemonMoveIdent, 0) }}>
            <option value={""}>(none)</option>
            {pokemonBattleState.pokemon_build.pokemon.move_idents.map((moveIdent: PokemonMoveIdent, index: number) => {
              return (
                <option key={`option-${index}`} value={moveIdent}>{displayPokemonMove(moveIdent)}</option>
              );
            })}
          </select>
          <p className="col-2">{move0?.base_power || "-"}</p>
          <div className="col-3">
            {move0 ? (<PokemonTypeBadge typeIdent={move0.type_ident} />) : (<p>-</p>)}
          </div>
          <div className="col-4">
            {move0?.category_ident ? (<PokemonMoveCategoryBadge moveCategory={move0.category_ident} />) : (<p>-</p>)}
          </div>
          {damageCalcs.length > 0 ? (
            <>
              <CountUp
                className="col-5 damage-calc low-roll"
                duration={0.3}
                decimals={2}
                end={damageCalcs[0][0]}
                preserveValue={true}
                suffix={"%"} />
              <CountUp
                className="col-6 damage-calc high-roll"
                duration={0.3}
                decimals={2}
                end={damageCalcs[0][1]}
                preserveValue={true}
                suffix={"%"} />
            </>
          ) : (<></>)}
        </div>
        <div className="data-row move-2">
          <select className="col-1" value={pokemonBattleState.pokemon_build.move_idents[1]} onChange={(e) => { handleMoveSelect(e.target.value as PokemonMoveIdent, 1) }}>
            <option value={""}>(none)</option>
            {pokemonBattleState.pokemon_build.pokemon.move_idents.map((moveIdent: PokemonMoveIdent, index: number) => {
              return (
                <option key={`option-${index}`} value={moveIdent}>{displayPokemonMove(moveIdent)}</option>
              );
            })}
          </select>
          <p className="col-2">{move1?.base_power || "-"}</p>
          <div className="col-3">
            {move1 ? (<PokemonTypeBadge typeIdent={move1.type_ident} />) : (<p>-</p>)}
          </div>
          <div className="col-4">
            {move1?.category_ident ? (<PokemonMoveCategoryBadge moveCategory={move1.category_ident} />) : (<p>-</p>)}
          </div>
          {damageCalcs.length > 0 ? (
            <>
              <CountUp
                className="col-5 damage-calc low-roll"
                duration={0.3}
                decimals={2}
                end={damageCalcs[1][0]}
                preserveValue={true}
                suffix={"%"} />
              <CountUp
                className="col-6 damage-calc high-roll"
                duration={0.3}
                decimals={2}
                end={damageCalcs[1][1]}
                preserveValue={true}
                suffix={"%"} />
            </>
          ) : (<></>)}
        </div>
        <div className="data-row move-3">
          <select className="col-1" value={pokemonBattleState.pokemon_build.move_idents[2]} onChange={(e) => { handleMoveSelect(e.target.value as PokemonMoveIdent, 2) }}>
            <option value={""}>(none)</option>
            {pokemonBattleState.pokemon_build.pokemon.move_idents.map((moveIdent: PokemonMoveIdent, index: number) => {
              return (
                <option key={`option-${index}`} value={moveIdent}>{displayPokemonMove(moveIdent)}</option>
              );
            })}
          </select>
          <p className="col-2">{move2?.base_power || "-"}</p>
          <div className="col-3">
            {move2 ? (<PokemonTypeBadge typeIdent={move2.type_ident} />) : (<p>-</p>)}
          </div>
          <div className="col-4">
            {move2?.category_ident ? (<PokemonMoveCategoryBadge moveCategory={move2.category_ident} />) : (<p>-</p>)}
          </div>
          {damageCalcs.length > 0 ? (
            <>
              <CountUp
                className="col-5 damage-calc low-roll"
                duration={0.3}
                decimals={2}
                end={damageCalcs[2][0]}
                preserveValue={true}
                suffix={"%"} />
              <CountUp
                className="col-6 damage-calc high-roll"
                duration={0.3}
                decimals={2}
                end={damageCalcs[2][1]}
                preserveValue={true}
                suffix={"%"} />
            </>
          ) : (<></>)}
        </div>
        <div className="data-row move-4">
          <select className="col-1" value={pokemonBattleState.pokemon_build.move_idents[3]} onChange={(e) => { handleMoveSelect(e.target.value as PokemonMoveIdent, 3) }}>
            <option value={""}>(none)</option>
            {pokemonBattleState.pokemon_build.pokemon.move_idents.map((moveIdent: PokemonMoveIdent, index: number) => {
              return (
                <option key={`option-${index}`} value={moveIdent}>{displayPokemonMove(moveIdent)}</option>
              );
            })}
          </select>
          <p className="col-2">{move3?.base_power || "-"}</p>
          <div className="col-3">
            {move3 ? (<PokemonTypeBadge typeIdent={move3.type_ident} />) : (<p>-</p>)}
          </div>
          <div className="col-4">
            {move3?.category_ident ? (<PokemonMoveCategoryBadge moveCategory={move3.category_ident} />) : (<p>-</p>)}
          </div>
          {damageCalcs.length > 0 ? (
            <>
              <CountUp
                className="col-5 damage-calc low-roll"
                duration={0.3}
                decimals={2}
                end={damageCalcs[3][0]}
                preserveValue={true}
                suffix={"%"} />
              <CountUp
                className="col-6 damage-calc high-roll"
                duration={0.3}
                decimals={2}
                end={damageCalcs[3][1]}
                preserveValue={true}
                suffix={"%"} />
            </>
          ) : (<></>)}
        </div>
      </div>
      <div className="data-group pokemon-move-modifiers">
        <div className="data-row data-row-select-value">
          <p className="data-row-label">Targeting</p>
          <select className="targeting-select-list" value={targetingValue} onChange={handleTargetingSelect}>
            <option value={"single"}>Single</option>
            <option value={"spread"}>Spread</option>
          </select>
        </div>
        <div className="data-row data-row-select-value">
          <p className="data-row-label">Critical Hit</p>
          <select className="critical-hit-select-list" value={`${criticalHitValue}`} onChange={handleCriticalHitSelect}>
            <option value={"false"}>No</option>
            <option value={"true"}>Yes</option>
          </select>
        </div>
      </div>
    </div>
  )
}
