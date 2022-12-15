import React from "react";
import { Pokemon } from "../models/pokemon/Pokemon";
import { calculatePokemonTotalStats } from "../models/pokemon/PokemonShared";
import { PokemonTypeBadge } from "../decorators/PokemonType";

const PokemonTypeDisplay: React.FC<{pokemon: Pokemon}> = ({ pokemon }) => {

  return (
    <div className="pokemon-type-display">
      <PokemonTypeBadge typeIdent={pokemon.primary_type_ident} />
      {pokemon.secondary_type_ident ? (<PokemonTypeBadge typeIdent={pokemon.secondary_type_ident} />) : (<></>)}
    </div>
  )

}

const PokemonAbilityDisplay: React.FC<{pokemon: Pokemon}> = ({ pokemon }) => {

  return (
    <div className="pokemon-abilities-display">
      {pokemon.ability_idents.map((pokemonAbility, index) => {
        return (
          <p key={`ability-${index}`}>{pokemonAbility}</p>
        )
      })}
    </div>
  )

}

const calculateFullEVSpeed = (speed: number, boostingNature: boolean): number => {
  if(boostingNature) {
    return Math.floor((Math.floor((((2 * speed) + 31 + Math.floor(252 / 4)) * 50) / 100) + 5) * 1.10);
  } else {
    return Math.floor((((2 * speed) + 31 + Math.floor(252 / 4)) * 50) / 100) + 5;
  }
}


const PokemonBaseStatsDisplay: React.FC<{pokemon: Pokemon}> = ({ pokemon }) => {

  return (
    <div className="pokemon-base-stats-display">
      <p className="base-stat hp">{pokemon.base_stats.hp}</p>
      <p className="base-stat attack">{pokemon.base_stats.attack}</p>
      <p className="base-stat defense">{pokemon.base_stats.defense}</p>
      <p className="base-stat special-attack">{pokemon.base_stats.special_attack}</p>
      <p className="base-stat special-defense">{pokemon.base_stats.special_defense}</p>
      <p className="base-stat speed">{`${pokemon.base_stats.speed}/${calculateFullEVSpeed(pokemon.base_stats.speed, false)}/${calculateFullEVSpeed(pokemon.base_stats.speed, true)}`}</p>
      <p className="base-stat total">{calculatePokemonTotalStats(pokemon.base_stats)}</p>
    </div>
  )

}

const PokemonDataRow: React.FC<{
  pokemon: Pokemon,
  index: number,
  displayBaseStats?: boolean,
  clickable?: boolean
  onPokemonClick?: (pokemon: Pokemon) => void
}> = ({
  pokemon,
  index,
  displayBaseStats = true,
  clickable = false,
  onPokemonClick = () => undefined
}) => {

  const pokemonImage = require(`../data/pokemon/paldea/${String(pokemon.paldea_regional_pokedex_number).padStart(2, "0")}-${pokemon.ident.split("-")[0]}/${pokemon.ident}.static.png`);

  const dataRowClassName = clickable ? "pokemon-data-row clickable" : "pokemon-data-row";

  return (
    <div
      className={dataRowClassName}
      onClick={() => { onPokemonClick(pokemon) }}>
      <p className="index-number">{pokemon.paldea_regional_pokedex_number}</p>
      <div className="pokemon-image-display">
        <img className="pokemon-image" src={pokemonImage} alt={pokemon.ident} />
      </div>
      <p className="pokemon-ident">{pokemon.ident}</p>
      <PokemonTypeDisplay pokemon={pokemon} />
      <PokemonAbilityDisplay pokemon={pokemon} />
      {displayBaseStats ? (
        <PokemonBaseStatsDisplay pokemon={pokemon} />
      ) : (<></>)}
    </div>
  )

}

export const PokemonDataTable: React.FC<{
  pokemonList: Pokemon[],
  currentSortStat?: string,
  currentSortStatDirection?: "desc" | "asc",
  sortByBaseStat?: (baseStat: string, toggleDirection: boolean) => void,
  clickable?: boolean;
  onPokemonClick?: (pokemon: Pokemon) => void,
  displayBaseStats?: boolean
}> = ({
  pokemonList,
  currentSortStat = "total",
  currentSortStatDirection = "desc",
  sortByBaseStat = () => undefined,
  clickable = false,
  onPokemonClick = () => undefined,
  displayBaseStats = true
}) => {

  const dataTableClassName = displayBaseStats ? "pokemon-data-table base-stats" : "pokemon-data-table no-base-stats";

  return (
    <div className={dataTableClassName}>
      <div className="pokemon-header-row">
        <p className="pokemon-header-item index-number">Dex</p>
        <p className="pokemon-header-item pokemon-image">Pic</p>
        <p className="pokemon-header-item pokemon-ident">Ident</p>
        <p className="pokemon-header-item pokemon-type">Type</p>
        <p className="pokemon-header-item pokemon-abilities">Abilities</p>
        {displayBaseStats ? (
          <div className="pokemon-header-item pokemon-base-stats">
          <p className="pokemon-base-stats-primary">Base Stats</p>
          <div className="pokemon-base-stats-secondary">
            <p
              className="pokemon-base-stats-secondary-cell"
              onClick={() => { sortByBaseStat("hp", true) }}>
              HP
            </p>
            <p
              className="pokemon-base-stats-secondary-cell"
              onClick={() => { sortByBaseStat("attack", true) }}>
              ATTACK
            </p>
            <p
              className="pokemon-base-stats-secondary-cell"
              onClick={() => { sortByBaseStat("defense", true) }}>
              DEFENSE
            </p>
            <p
              className="pokemon-base-stats-secondary-cell"
              onClick={() => { sortByBaseStat("special-attack", true) }}>
              SP. ATT
            </p>
            <p
              className="pokemon-base-stats-secondary-cell"
              onClick={() => { sortByBaseStat("special-defense", true) }}>
              SP. DEF
            </p>
            <p
              className="pokemon-base-stats-secondary-cell"
              onClick={() => { sortByBaseStat("speed", true) }}>
              SPEED
            </p>
            <p
              className="pokemon-base-stats-secondary-cell"
              onClick={() => { sortByBaseStat("total", true) }}>
              TOTAL
            </p>
          </div>
        </div>
        ) : (<></>)}
      </div>
      {pokemonList.map((pokemon, index) => {
        return (
          <PokemonDataRow
            key={pokemon.ident}
            index={index}
            pokemon={pokemon}
            clickable={clickable}
            onPokemonClick={onPokemonClick}
            displayBaseStats={displayBaseStats} />
        )
      })}
    </div>
  )

}
