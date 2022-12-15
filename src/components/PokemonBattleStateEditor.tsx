import React, { useState, useEffect } from "react";

import { PokemonBattleState } from "../models/battle/PokemonBattleState";

import { displayPokemonType } from "../decorators/pokemon-types";

import { PokemonNatureSelectList } from "../decorators/PokemonNature";
import { PokemonItemSelectList } from "../decorators/PokemonItem";
import { PokemonAbilitySelectList } from "../decorators/PokemonAbility";
import { PokemonStatusSelectList } from "../decorators/PokemonStatus";

import { PokemonNatureIdent, PokemonAbilityIdent, PokemonItemIdent } from "../models/pokemon/PokemonShared";
import { PokemonStatusIdent } from "../models/battle/BattleShared";

export const PokemonBattleStateEditor: React.FC<{
  initialPokemonBattleState: PokemonBattleState
}> = ({
  initialPokemonBattleState
}) => {
  const [pokemonBattleState, setPokemonBattleState] = useState<PokemonBattleState>(initialPokemonBattleState);

  useEffect(() => {
    setPokemonBattleState(initialPokemonBattleState);
  }, [initialPokemonBattleState]);

  const handleNatureSelect = (pokemonNatureIdent: PokemonNatureIdent) => {
    // ...
  }

  const handleAbilitySelect = (pokemonAbilityIdent: PokemonAbilityIdent) => {
    // ...
  }

  const handleStatusSelect = (pokemonStatusIdent: PokemonStatusIdent) => {
    // ...
  }

  const handleItemSelect = (pokemonItemIdent: PokemonItemIdent) => {
    // ...
  }

  return (
    <div className="pokemon-battle-state-editor">
      <div className="data-group pokemon-meta">
        <div className="data-row pokemon-ident">
          <p className="data-row-label">Pokemon</p>
          <h4>{pokemonBattleState.pokemon_build.pokemon.ident}</h4>
        </div>
        <div className="data-row pokemon-type">
          <p className="data-row-label">Type</p>
          {displayPokemonType(pokemonBattleState.pokemon_build.pokemon.primary_type_ident)}
          {pokemonBattleState.pokemon_build.pokemon.secondary_type_ident ? displayPokemonType(pokemonBattleState.pokemon_build.pokemon.secondary_type_ident) : (<></>)}
        </div>
        <div className="data-row pokemon-tera-type">
          <p className="data-row-label">Tera</p>
          {displayPokemonType(pokemonBattleState.pokemon_build.tera_type_ident)}
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
          <p className="col-3">{pokemonBattleState.pokemon_build.iv_spread.hp}</p>
          <p className="col-4">{pokemonBattleState.pokemon_build.ev_spread.hp}</p>
          <p className="col-5">{pokemonBattleState.pokemon_build.stat_spread.hp}</p>
          <p className="col-6" />
        </div>
        <div className="data-row data-row-attack">
          <p className="col-1">Attack</p>
          <p className="col-2">{pokemonBattleState.pokemon_build.pokemon.base_stats.attack}</p>
          <p className="col-3">{pokemonBattleState.pokemon_build.iv_spread.attack}</p>
          <p className="col-4">{pokemonBattleState.pokemon_build.ev_spread.attack}</p>
          <p className="col-5">{pokemonBattleState.pokemon_build.stat_spread.attack}</p>
          <p className="col-6" />
        </div>
        <div className="data-row data-row-defense">
          <p className="col-1">Defense</p>
          <p className="col-2">{pokemonBattleState.pokemon_build.pokemon.base_stats.defense}</p>
          <p className="col-3">{pokemonBattleState.pokemon_build.iv_spread.defense}</p>
          <p className="col-4">{pokemonBattleState.pokemon_build.ev_spread.defense}</p>
          <p className="col-5">{pokemonBattleState.pokemon_build.stat_spread.defense}</p>
          <p className="col-6" />
        </div>
        <div className="data-row data-row-special-attack">
          <p className="col-1">Sp. Atk</p>
          <p className="col-2">{pokemonBattleState.pokemon_build.pokemon.base_stats.special_attack}</p>
          <p className="col-3">{pokemonBattleState.pokemon_build.iv_spread.special_attack}</p>
          <p className="col-4">{pokemonBattleState.pokemon_build.ev_spread.special_attack}</p>
          <p className="col-5">{pokemonBattleState.pokemon_build.stat_spread.special_attack}</p>
          <p className="col-6" />
        </div>
        <div className="data-row data-row-special-defense">
          <p className="col-1">Sp. Def</p>
          <p className="col-2">{pokemonBattleState.pokemon_build.pokemon.base_stats.special_defense}</p>
          <p className="col-3">{pokemonBattleState.pokemon_build.iv_spread.special_defense}</p>
          <p className="col-4">{pokemonBattleState.pokemon_build.ev_spread.special_defense}</p>
          <p className="col-5">{pokemonBattleState.pokemon_build.stat_spread.special_defense}</p>
          <p className="col-6" />
        </div>
        <div className="data-row data-row-speed">
          <p className="col-1">Speed</p>
          <p className="col-2">{pokemonBattleState.pokemon_build.pokemon.base_stats.speed}</p>
          <p className="col-3">{pokemonBattleState.pokemon_build.iv_spread.speed}</p>
          <p className="col-4">{pokemonBattleState.pokemon_build.ev_spread.speed}</p>
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
    </div>
  )
}
