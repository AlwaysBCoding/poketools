import React, { useState, useEffect, ChangeEvent } from "react";
import useForceUpdate from "use-force-update";

import {
  PokemonIdent,
  PokemonTypeIdent,
  PokemonGender,
  PokemonNatureIdent,
  PokemonStatSpread
} from "../models/pokemon/PokemonShared";
import { Pokemon } from "../models/pokemon/Pokemon";
import { PokemonBuild, createDefaultPokemonBuildForPokemonIdent } from "../models/pokemon/PokemonBuild";
import { calculateStatSpread } from "../models/pokemon/stat-calc";

import { PokemonTypeBadge, PokemonTypeSelectList } from "../decorators/PokemonType";
import { PokemonSelectList } from "../decorators/Pokemon";
import { PokemonNatureSelectList } from "../decorators/PokemonNature";
import { toTitleCase } from "../decorators/DecoratorsShared";

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
                <option key={`option-${index}`} value={gender}>{toTitleCase(gender)}</option>
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
      {/*
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
      </div> */}
    </div>
  )

}

// import React, { useState, useEffect, KeyboardEvent } from "react";

// import { Pokemon } from "../models/pokemon/Pokemon";
// import { PokemonBuild, createDefaultPokemonBuildForPokemonIdent } from "../models/pokemon/PokemonBuild";
// import { PokemonItem } from "../models/pokemon/PokemonItem";

// import { PokemonBuildDisplay } from "../components/PokemonBuildDisplay";
// import { PokemonDataTable } from "../components/PokemonDataTable";
// import { PokemonAbilityIdent, PokemonTypeIdent, PokemonMoveIdent } from "../models/pokemon/PokemonShared";

// import AllPokemon from "../data/pokemon/all-pokemon.json";
// import AllItems from "../data/items/all-items.json";
// import AllTypes from "../data/pokemon-types.json";

// const allPokemon = AllPokemon as Pokemon[];
// const allItems = AllItems as PokemonItem[];
// const allTypes: PokemonTypeIdent[] = AllTypes.map((typeData) => { return typeData.ident as PokemonTypeIdent });

// const AllPokemonSelectList: React.FC<{
//   currentInputValue: string,
//   onPokemonSelect: (pokemon: Pokemon) => void
// }> = ({
//   currentInputValue,
//   onPokemonSelect
// }) => {
//   const filteredPokemon = allPokemon.filter((pokemon) => {
//     return pokemon.ident.includes(currentInputValue);
//   });

//   return (
//     <div className="data-select-list all-pokemon-select-list">
//       <PokemonDataTable
//         pokemonList={filteredPokemon}
//         clickable={true}
//         onPokemonClick={onPokemonSelect} />
//     </div>
//   )
// }

// const AllItemsSelectList: React.FC<{
//   currentInputValue: string,
//   onItemSelect: (item: PokemonItem) => void
// }> = ({
//   currentInputValue,
//   onItemSelect = () => undefined
// }) => {
//   const filteredItems = allItems.filter((item) => {
//     return item.ident.includes(currentInputValue);
//   })
//   return (
//     <div className="data-select-list all-items-select-list">
//       <div className="generic-data-table">
//         <div className="generic-header-row">
//           <p className="generic-header-item">Item Name</p>
//         </div>
//         {filteredItems.map((item, index) => {
//           return (
//             <div
//               key={`item-index-${index}`}
//               className="generic-data-row clickable"
//               onClick={() => { onItemSelect(item); }}>
//               <p className="item-ident">{item.ident}</p>
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

// const PokemonAbilitySelectList: React.FC<{
//   pokemon: Pokemon,
//   onAbilitySelect: (abilityIdent: PokemonAbilityIdent) => void
// }> = ({
//   pokemon,
//   onAbilitySelect = () => undefined
// }) => {
//   return (
//     <div className="all-abilities-select-list">
//       <div className="generic-data-table">
//         <div className="generic-header-row">
//           <p className="generic-header-item">Ability Name</p>
//         </div>
//         {pokemon.ability_idents.map((abilityIdent, index) => {
//           return (
//             <div
//               key={`ability-index-${index}`}
//               className="generic-data-row clickable"
//               onClick={() => { onAbilitySelect(abilityIdent); }}>
//               <p className="ability-ident">{abilityIdent}</p>
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

// const PokemonMoveSelectList: React.FC<{
//   pokemon: Pokemon,
//   currentInputValue: string,
//   onMoveSelect: (moveIdent: PokemonMoveIdent) => void
// }> = ({
//   pokemon,
//   currentInputValue,
//   onMoveSelect = () => undefined
// }) => {
//   return (
//     <div className="all-moves-select-list">
//       <div className="generic-data-table">
//         <div className="generic-header-row">
//           <p className="generic-header-item">Move Name</p>
//         </div>
//         {pokemon.move_idents
//           .filter((moveIdent) => { return moveIdent.includes(currentInputValue) })
//           .map((moveIdent, index) => {
//             return (
//               <div
//                 key={`move-index-${index}`}
//                 className="generic-data-row clickable"
//                 onClick={() => { onMoveSelect(moveIdent); }}>
//                 <p className="move-ident">{moveIdent}</p>
//               </div>
//             );
//         })}
//       </div>
//     </div>
//   )
// }

// const AllTypesSelectList: React.FC<{
//   currentInputValue: string,
//   onTypeSelect: (typeIdent: PokemonTypeIdent) => void
// }> = ({
//   currentInputValue,
//   onTypeSelect = () => undefined
// }) => {

//   return (
//     <div className="data-select-list all-types-select-list">
//       <div className="generic-data-table">
//         <div className="generic-header-row">
//           <p className="generic-header-item">Type Ident</p>
//         </div>
//         {allTypes
//           .filter((typeIdent) => { return typeIdent.includes(currentInputValue) })
//           .map((typeIdent, index) => {
//             return (
//               <div
//                 key={`type-index-${index}`}
//                 className="generic-data-row clickable"
//                 onClick={() => { onTypeSelect(typeIdent); }}>
//                 <p className="type-ident">{typeIdent}</p>
//               </div>
//             )
//         })}
//       </div>
//     </div>
//   )
// }

// const PokemonStatsSection = () => {
//   return (
//     <div className="pokemon-stats-section">
//       <p>HELLO</p>
//     </div>
//   )
// }

// export const PokemonBuildEditor: React.FC<{
//   initialPokemonBuild: PokemonBuild,
//   savePokemonBuildData: (pokemonBuildData: PokemonBuild) => void
// }> = ({
//   initialPokemonBuild,
//   savePokemonBuildData = () => undefined
// }) => {
//   const [activeSectionIdent, setactiveSectionIdent] = useState<string>("");
//   const [activeSectionInputValue, setActiveSectionInputValue] = useState<string>("");
//   const [pokemonBuildData, setPokemonBuildData] = useState<PokemonBuild>(initialPokemonBuild);

//   useEffect(() => {
//     setPokemonBuildData(initialPokemonBuild);
//     setactiveSectionIdent("");
//     setActiveSectionInputValue("");
//     // eslint-disable-next-line
//   }, [initialPokemonBuild]);

//   const onSectionClick = (sectionName: string): void => {
//     if(activeSectionIdent === "nickname" && sectionName === "") {
//       const nextPokemonBuildData = Object.assign(pokemonBuildData, {nickname: activeSectionInputValue});
//       setPokemonBuildData(nextPokemonBuildData);
//       setactiveSectionIdent(sectionName);
//       setActiveSectionInputValue("");
//     } if(sectionName === "stats") {
//       savePokemonBuildData(pokemonBuildData);
//       setactiveSectionIdent(sectionName);
//       setActiveSectionInputValue("");
//     } else if(sectionName !== activeSectionIdent) {
//       setactiveSectionIdent(sectionName);
//       setActiveSectionInputValue("");
//     }
//   }

//   const onSectionInputChange = (inputValue: string): void => {
//     setActiveSectionInputValue(inputValue);
//   }

//   const onPokemonSelect = (pokemon: Pokemon): void => {
//     if(pokemon.ident !== pokemonBuildData.pokemon.ident) {
//       setPokemonBuildData(
//         createDefaultPokemonBuildForPokemonIdent(pokemon.ident)
//       );
//     }
//     setactiveSectionIdent("");
//     setActiveSectionInputValue("");
//   }

//   const onItemSelect = (item: PokemonItem): void => {
//     if(item.ident !== pokemonBuildData.item_ident) {
//       const nextPokemonBuildData = Object.assign(pokemonBuildData, {item_ident: item.ident});
//       setPokemonBuildData(nextPokemonBuildData);
//     }
//     setactiveSectionIdent("");
//     setActiveSectionInputValue("");
//   }

//   const onAbilitySelect = (abilityIdent: PokemonAbilityIdent): void => {
//     if(abilityIdent !== pokemonBuildData.ability_ident) {
//       const nextPokemonBuildData = Object.assign(pokemonBuildData, {ability_ident: abilityIdent});
//       setPokemonBuildData(nextPokemonBuildData);
//     }
//     setactiveSectionIdent("");
//     setActiveSectionInputValue("");
//   }

//   const onMoveSelect = (moveIdent: PokemonMoveIdent): void => {
//     let moveSlotIndex = 0;
//     if(activeSectionIdent === "move1") { moveSlotIndex = 0; }
//     if(activeSectionIdent === "move2") { moveSlotIndex = 1; }
//     if(activeSectionIdent === "move3") { moveSlotIndex = 2; }
//     if(activeSectionIdent === "move4") { moveSlotIndex = 3; }
//     const nextMoveIdents = pokemonBuildData.move_idents;
//     nextMoveIdents[moveSlotIndex] = moveIdent;
//     const nextPokemonBuildData = Object.assign(pokemonBuildData, {move_idents: nextMoveIdents});
//     setPokemonBuildData(nextPokemonBuildData);
//     setactiveSectionIdent("");
//     setActiveSectionInputValue("");
//   }

//   const onTypeSelect = (teraTypeIdent: PokemonTypeIdent): void => {
//     if(teraTypeIdent !== pokemonBuildData.tera_type_ident) {
//       const nextPokemonBuildData = Object.assign(pokemonBuildData, {tera_type_ident: teraTypeIdent});
//       setPokemonBuildData(nextPokemonBuildData);
//     }
//     setactiveSectionIdent("");
//     setActiveSectionInputValue("");
//   }

//   const onEnterPress = (): void => {
//     if(activeSectionIdent === "pokemon") {
//       const filteredPokemon = allPokemon.filter((pokemon) => { return pokemon.ident.includes(activeSectionInputValue) });
//       if(filteredPokemon.length > 0) {
//         onPokemonSelect(filteredPokemon[0]);
//       }
//     }
//     if(activeSectionIdent === "item") {
//       const filteredItems = allItems.filter((item) => { return item.ident.includes(activeSectionInputValue) });
//       if(filteredItems.length > 0) {
//         onItemSelect(filteredItems[0]);
//       }
//     }
//     if(activeSectionIdent === "tera-type") {
//       const filteredTypes = allTypes.filter((typeIdent) => { return typeIdent.includes(activeSectionInputValue) });
//       if(filteredTypes.length > 0) {
//         onTypeSelect(filteredTypes[0]);
//       }
//     }
//     if(["move1", "move2", "move3", "move4"].includes(activeSectionIdent)) {
//       const filteredMoves = pokemonBuildData.pokemon.move_idents.filter((moveIdent) => { return moveIdent.includes(activeSectionInputValue); })
//       if(filteredMoves.length > 0) {
//         onMoveSelect(filteredMoves[0]);
//       }
//     }
//   }

//   return (
//     <div
//       className="pokemon-build-editor">
//       <PokemonBuildDisplay
//         pokemonBuild={pokemonBuildData}
//         activeSectionIdent={activeSectionIdent}
//         onSectionClick={onSectionClick}
//         onSectionInputChange={onSectionInputChange}
//         onEnterPress={onEnterPress} />
//       {activeSectionIdent === "pokemon" ? (
//         <AllPokemonSelectList
//           currentInputValue={activeSectionInputValue}
//           onPokemonSelect={onPokemonSelect}/>
//       ) : (<></>)}
//       {activeSectionIdent === "item" ? (
//         <AllItemsSelectList
//           currentInputValue={activeSectionInputValue}
//           onItemSelect={onItemSelect} />
//       ) : (<></>)}
//       {activeSectionIdent === "ability" ? (
//         <PokemonAbilitySelectList
//           pokemon={pokemonBuildData.pokemon}
//           onAbilitySelect={onAbilitySelect} />
//       ) : (<></>)}
//       {activeSectionIdent === "tera-type" ? (
//         <AllTypesSelectList
//           currentInputValue={activeSectionInputValue}
//           onTypeSelect={onTypeSelect} />
//       ) : (<></>)}
//       {["move1", "move2", "move3", "move4"].includes(activeSectionIdent) ? (
//         <PokemonMoveSelectList
//           pokemon={pokemonBuildData.pokemon}
//           currentInputValue={activeSectionInputValue}
//           onMoveSelect={onMoveSelect} />
//       ) : (<></>)}
//       {activeSectionIdent === "stats" ? (
//         <PokemonStatsSection />
//       ) : (<></>)}
//     </div>
//   )

// }
