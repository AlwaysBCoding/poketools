import React, { useState, useEffect, ChangeEvent } from "react";
import useForceUpdate from "use-force-update";

import {
  PokemonIdent,
  PokemonTypeIdent,
  PokemonGender,
  PokemonNatureIdent,
  PokemonAbilityIdent,
  PokemonItemIdent,
  PokemonMoveIdent,
  PokemonStatSpread
} from "../models/pokemon/PokemonShared";
import { PokemonBuild, createDefaultPokemonBuildForPokemonIdent } from "../models/pokemon/PokemonBuild";
import { PokemonMoveSimple } from "../models/pokemon/PokemonMove";
import { calculateStatSpread } from "../models/pokemon/stat-calc";

import { PokemonTypeBadge, PokemonTypeSelectList } from "../decorators/PokemonType";
import { PokemonMoveCategoryBadge } from "../decorators/PokemonMoveCategory";
import { PokemonSelectList, displayPokemonGender } from "../decorators/Pokemon";
import { PokemonNatureSelectList } from "../decorators/PokemonNature";
import { PokemonAbilitySelectList } from "../decorators/PokemonAbility";
import { PokemonItemSelectList } from "../decorators/PokemonItem";
import { toTitleCase } from "../decorators/DecoratorsShared";

import AllMoves from "../data/moves/all-moves.json";
const ALL_MOVES = AllMoves as PokemonMoveSimple[];

export const PokemonBuildEditor: React.FC<{
  initialPokemonBuild: PokemonBuild,
  updatePokemonBuildData: (pokemonBuildData: PokemonBuild) => void
}> = ({
  initialPokemonBuild,
  updatePokemonBuildData = () => undefined
}) => {
  const forceUpdate = useForceUpdate();
  const [pokemonBuild, setPokemonBuild] = useState<PokemonBuild>(initialPokemonBuild);

  useEffect(() => {
    setPokemonBuild(initialPokemonBuild);
  }, [initialPokemonBuild]);

  const handlePokemonSelect = (pokemonIdent: PokemonIdent) => {
    const nextPokemonBuild = createDefaultPokemonBuildForPokemonIdent(pokemonIdent);
    setPokemonBuild(nextPokemonBuild);
    updatePokemonBuildData(nextPokemonBuild);
    forceUpdate();
  }

  const handleTeraTypeSelect = (pokemonTypeIdent: PokemonTypeIdent) => {
    const nextPokemonBuild = pokemonBuild;
    nextPokemonBuild.tera_type_ident = pokemonTypeIdent;
    setPokemonBuild(nextPokemonBuild);
    updatePokemonBuildData(nextPokemonBuild);
    forceUpdate();
  }

  const handleLevelChange = (levelString: string) => {
    const nextPokemonBuild = pokemonBuild;
    nextPokemonBuild.level = Number(levelString);
    setPokemonBuild(nextPokemonBuild);
    updatePokemonBuildData(nextPokemonBuild);
    forceUpdate();
  }

  const handleGenderChange = (gender: PokemonGender) => {
    const nextPokemonBuild = pokemonBuild;
    nextPokemonBuild.gender = gender;
    setPokemonBuild(nextPokemonBuild);
    updatePokemonBuildData(nextPokemonBuild);
    forceUpdate();
  }

  const handleStatValueChange = (statIdent: string, value: string) => {
    const nextPokemonBuild = pokemonBuild;
    if(statIdent === "iv-hp") { nextPokemonBuild.iv_spread.hp = Number(value); }
    if(statIdent === "ev-hp") { nextPokemonBuild.ev_spread.hp = Number(value); }
    if(statIdent === "iv-attack") { nextPokemonBuild.iv_spread.attack = Number(value); }
    if(statIdent === "ev-attack") { nextPokemonBuild.ev_spread.attack = Number(value); }
    if(statIdent === "iv-defense") { nextPokemonBuild.iv_spread.defense = Number(value); }
    if(statIdent === "ev-defense") { nextPokemonBuild.ev_spread.defense = Number(value); }
    if(statIdent === "iv-special_attack") { nextPokemonBuild.iv_spread.special_attack = Number(value); }
    if(statIdent === "ev-special_attack") { nextPokemonBuild.ev_spread.special_attack = Number(value); }
    if(statIdent === "iv-special_defense") { nextPokemonBuild.iv_spread.special_defense = Number(value); }
    if(statIdent === "ev-special_defense") { nextPokemonBuild.ev_spread.special_defense = Number(value); }
    if(statIdent === "iv-speed") { nextPokemonBuild.iv_spread.speed = Number(value); }
    if(statIdent === "ev-speed") { nextPokemonBuild.ev_spread.speed = Number(value); }
    const nextStatSpread: PokemonStatSpread = calculateStatSpread(
      nextPokemonBuild.pokemon.ident,
      nextPokemonBuild.iv_spread,
      nextPokemonBuild.ev_spread,
      nextPokemonBuild.nature_ident
    );
    nextPokemonBuild.stat_spread = nextStatSpread;
    setPokemonBuild(nextPokemonBuild);
    updatePokemonBuildData(nextPokemonBuild);
    forceUpdate();
  }

  const handleNatureSelect = (pokemonNatureIdent: PokemonNatureIdent) => {
    const nextPokemonBuild = pokemonBuild;
    const nextStatSpread: PokemonStatSpread = calculateStatSpread(
      nextPokemonBuild.pokemon.ident,
      nextPokemonBuild.iv_spread,
      nextPokemonBuild.ev_spread,
      pokemonNatureIdent
    );
    nextPokemonBuild.nature_ident = pokemonNatureIdent;
    nextPokemonBuild.stat_spread = nextStatSpread;
    setPokemonBuild(nextPokemonBuild);
    updatePokemonBuildData(nextPokemonBuild);
    forceUpdate();
  }

  const handleAbilitySelect = (abilityIdent: PokemonAbilityIdent) => {
    const nextPokemonBuild = pokemonBuild;
    nextPokemonBuild.ability_ident = abilityIdent;
    setPokemonBuild(nextPokemonBuild);
    updatePokemonBuildData(nextPokemonBuild);
    forceUpdate();
  }

  const handleItemSelect = (itemIdent: PokemonItemIdent) => {
    const nextPokemonBuild = pokemonBuild;
    nextPokemonBuild.item_ident = itemIdent;
    setPokemonBuild(nextPokemonBuild);
    updatePokemonBuildData(nextPokemonBuild);
    forceUpdate();
  }

  const handleMoveSelect = (moveIdent: PokemonMoveIdent, moveIndex: number) => {
    const nextPokemonBuild = pokemonBuild;
    pokemonBuild.move_idents[moveIndex] = moveIdent;
    setPokemonBuild(nextPokemonBuild);
    updatePokemonBuildData(nextPokemonBuild);
    forceUpdate();
  }

  const move0 = ALL_MOVES.find((move: PokemonMoveSimple) => { return move.ident === pokemonBuild.move_idents[0] });
  const move1 = ALL_MOVES.find((move: PokemonMoveSimple) => { return move.ident === pokemonBuild.move_idents[1] });
  const move2 = ALL_MOVES.find((move: PokemonMoveSimple) => { return move.ident === pokemonBuild.move_idents[2] });
  const move3 = ALL_MOVES.find((move: PokemonMoveSimple) => { return move.ident === pokemonBuild.move_idents[3] });

  return (
    <div className="pokemon-build-editor">
      <div className="data-group pokemon-meta">
        <div className="data-row data-row-select-value pokemon-ident">
          <p className="data-row-label">Pokemon</p>
          <PokemonSelectList
            pokemonIdent={pokemonBuild.pokemon.ident}
            onPokemonSelect={handlePokemonSelect} />
        </div>
        <div className="data-row pokemon-type">
          <p className="data-row-label">Type</p>
          <PokemonTypeBadge typeIdent={pokemonBuild.pokemon.primary_type_ident} />
          {pokemonBuild.pokemon.secondary_type_ident ? (<PokemonTypeBadge typeIdent={pokemonBuild.pokemon.secondary_type_ident} />) : (<></>)}
        </div>
        <div className="data-row data-row-select-value pokemon-tera-type">
          <p className="data-row-label">Tera</p>
          <PokemonTypeSelectList
            typeIdent={pokemonBuild.tera_type_ident}
            onTypeSelect={handleTeraTypeSelect} />
        </div>
        <div className="data-row data-row-select-value pokemon-gender">
          <p className="data-row-label">Gender</p>
          <select className="data-row-select" value={pokemonBuild.gender} onChange={(e) => { handleGenderChange(e.target.value as PokemonGender); }}>
            {pokemonBuild.pokemon.genders.map((gender: PokemonGender, index: number) => {
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
            value={pokemonBuild.level}
            onChange={(e) => { handleLevelChange(e.target.value); }} />
        </div>
      </div>
      <div className="data-group pokemon-volatile-build-info">
        <div className="data-row data-row-select-value">
          <p className="data-row-label">Ability</p>
          <PokemonAbilitySelectList
            pokemonBuild={pokemonBuild}
            onAbilitySelect={handleAbilitySelect} />
        </div>
        <div className="data-row data-row-select-value">
          <p className="data-row-label">Item</p>
          <PokemonItemSelectList
            itemIdent={pokemonBuild.item_ident}
            onItemSelect={handleItemSelect} />
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
          <p className="col-2">{pokemonBuild.pokemon.base_stats.hp}</p>
          <input
            className="col-3"
            value={pokemonBuild.iv_spread.hp}
            onChange={(e) => { handleStatValueChange("iv-hp", e.target.value); }} />
          <input
            className="col-4"
            value={pokemonBuild.ev_spread.hp}
            onChange={(e) => { handleStatValueChange("ev-hp", e.target.value); }} />
          <p className="col-5">{pokemonBuild.stat_spread.hp}</p>
          <p className="col-6" />
        </div>
        <div className="data-row data-row-attack">
          <p className="col-1">Attack</p>
          <p className="col-2">{pokemonBuild.pokemon.base_stats.attack}</p>
          <input
            className="col-3"
            value={pokemonBuild.iv_spread.attack}
            onChange={(e) => { handleStatValueChange("iv-attack", e.target.value); }} />
          <input
            className="col-4"
            value={pokemonBuild.ev_spread.attack}
            onChange={(e) => { handleStatValueChange("ev-attack", e.target.value); }} />
          <p className="col-5">{pokemonBuild.stat_spread.attack}</p>
          <p className="col-6" />
        </div>
        <div className="data-row data-row-defense">
          <p className="col-1">Defense</p>
          <p className="col-2">{pokemonBuild.pokemon.base_stats.defense}</p>
          <input
            className="col-3"
            value={pokemonBuild.iv_spread.defense}
            onChange={(e) => { handleStatValueChange("iv-defense", e.target.value); }} />
          <input
            className="col-4"
            value={pokemonBuild.ev_spread.defense}
            onChange={(e) => { handleStatValueChange("ev-defense", e.target.value); }} />
          <p className="col-5">{pokemonBuild.stat_spread.defense}</p>
          <p className="col-6" />
        </div>
        <div className="data-row data-row-special-attack">
          <p className="col-1">Sp. Atk</p>
          <p className="col-2">{pokemonBuild.pokemon.base_stats.special_attack}</p>
          <input
            className="col-3"
            value={pokemonBuild.iv_spread.special_attack}
            onChange={(e) => { handleStatValueChange("iv-special_attack", e.target.value); }} />
          <input
            className="col-4"
            value={pokemonBuild.ev_spread.special_attack}
            onChange={(e) => { handleStatValueChange("ev-special_attack", e.target.value); }} />
          <p className="col-5">{pokemonBuild.stat_spread.special_attack}</p>
          <p className="col-6" />
        </div>
        <div className="data-row data-row-special-defense">
          <p className="col-1">Sp. Def</p>
          <p className="col-2">{pokemonBuild.pokemon.base_stats.special_defense}</p>
          <input
            className="col-3"
            value={pokemonBuild.iv_spread.special_defense}
            onChange={(e) => { handleStatValueChange("iv-special_defense", e.target.value); }} />
          <input
            className="col-4"
            value={pokemonBuild.ev_spread.special_defense}
            onChange={(e) => { handleStatValueChange("ev-special_defense", e.target.value); }} />
          <p className="col-5">{pokemonBuild.stat_spread.special_defense}</p>
          <p className="col-6" />
        </div>
        <div className="data-row data-row-speed">
          <p className="col-1">Speed</p>
          <p className="col-2">{pokemonBuild.pokemon.base_stats.speed}</p>
          <input
            className="col-3"
            value={pokemonBuild.iv_spread.speed}
            onChange={(e) => { handleStatValueChange("iv-speed", e.target.value); }} />
          <input
            className="col-4"
            value={pokemonBuild.ev_spread.speed}
            onChange={(e) => { handleStatValueChange("ev-speed", e.target.value); }} />
          <p className="col-5">{pokemonBuild.stat_spread.speed}</p>
          <p className="col-6" />
        </div>
        <div className="data-row data-row-select-value data-row-nature-select">
          <p className="data-row-label pokemon-nature">Nature</p>
          <PokemonNatureSelectList
            natureIdent={pokemonBuild.nature_ident}
            onNatureSelect={handleNatureSelect} />
        </div>
      </div>
      <div className="data-group pokemon-moves">
        <div className="data-row header-row">
          <p className="col-1">Move</p>
          <p className="col-2">BP</p>
          <p className="col-3">Type</p>
          <p className="col-4">Cat</p>
        </div>
        <div className="data-row move-1">
          <select className="col-1" value={pokemonBuild.move_idents[0]} onChange={(e) => { handleMoveSelect(e.target.value as PokemonMoveIdent, 0) }}>
            <option value={""}>(none)</option>
            {pokemonBuild.pokemon.move_idents.map((moveIdent: PokemonMoveIdent, index: number) => {
              return (
                <option key={`option-${index}`} value={moveIdent}>{toTitleCase(moveIdent)}</option>
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
        </div>
        <div className="data-row move-2">
          <select className="col-1" value={pokemonBuild.move_idents[1]} onChange={(e) => { handleMoveSelect(e.target.value as PokemonMoveIdent, 1) }}>
            <option value={""}>(none)</option>
            {pokemonBuild.pokemon.move_idents.map((moveIdent: PokemonMoveIdent, index: number) => {
              return (
                <option key={`option-${index}`} value={moveIdent}>{toTitleCase(moveIdent)}</option>
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
        </div>
        <div className="data-row move-3">
          <select className="col-1" value={pokemonBuild.move_idents[2]} onChange={(e) => { handleMoveSelect(e.target.value as PokemonMoveIdent, 2) }}>
            <option value={""}>(none)</option>
            {pokemonBuild.pokemon.move_idents.map((moveIdent: PokemonMoveIdent, index: number) => {
              return (
                <option key={`option-${index}`} value={moveIdent}>{toTitleCase(moveIdent)}</option>
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
        </div>
        <div className="data-row move-4">
          <select className="col-1" value={pokemonBuild.move_idents[3]} onChange={(e) => { handleMoveSelect(e.target.value as PokemonMoveIdent, 3) }}>
            <option value={""}>(none)</option>
            {pokemonBuild.pokemon.move_idents.map((moveIdent: PokemonMoveIdent, index: number) => {
              return (
                <option key={`option-${index}`} value={moveIdent}>{toTitleCase(moveIdent)}</option>
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
        </div>
      </div>
    </div>
  )

}
