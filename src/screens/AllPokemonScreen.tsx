import React from "react";
import AllPokemon from "../data/pokemon/all-pokemon.json";

import { Pokemon } from "../models/pokemon/Pokemon";

const PokemonTypeDisplay: React.FC<{pokemon: Pokemon}> = ({ pokemon }) => {

  return (
    <div className="pokemon-type-display">
      <p>{pokemon.primary_type_ident}</p>
      <p>{pokemon.secondary_type_ident}</p>
    </div>
  )

}

const PokemonAbilityDisplay: React.FC<{pokemon: Pokemon}> = ({ pokemon }) => {

  return (
    <div className="pokemon-abilities-display">
      {pokemon.ability_idents.map((pokemonAbility) => {
        return (
          <p>{pokemonAbility}</p>
        )
      })}
    </div>
  )

}

const PokemonBaseStatsDisplay: React.FC<{pokemon: Pokemon}> = ({ pokemon }) => {

  return (
    <div className="pokemon-base-stats-display">
      <p className="base-stat hp">{pokemon.base_stats.hp}</p>
      <p className="base-stat attack">{pokemon.base_stats.attack}</p>
      <p className="base-stat defense">{pokemon.base_stats.defense}</p>
      <p className="base-stat special-attack">{pokemon.base_stats.special_attack}</p>
      <p className="base-stat special-defense">{pokemon.base_stats.special_defense}</p>
      <p className="base-stat speed">{pokemon.base_stats.speed}</p>
    </div>
  )

}

const PokemonDataRow: React.FC<{pokemon: Pokemon, index: number}> = ({ pokemon, index }) => {

  const pokemonImage = require(`../data/pokemon/paldea/${String(pokemon.paldea_regional_pokedex_number).padStart(2, "0")}-${pokemon.ident.split("-")[0]}/${pokemon.ident}.static.png`);

  return (
    <div className="pokemon-data-row">
      <p className="index-number">{index + 1}</p>
      <div className="pokemon-image-display">
        <img className="pokemon-image" src={pokemonImage} alt={pokemon.ident} />
      </div>
      <p className="pokemon-ident">{pokemon.ident}</p>
      <PokemonTypeDisplay pokemon={pokemon} />
      <PokemonAbilityDisplay pokemon={pokemon} />
      <PokemonBaseStatsDisplay pokemon={pokemon} />
    </div>
  )

}

const PokemonDataTable: React.FC<{sortedPokemon: Pokemon[]}> = ({ sortedPokemon }) => {

  return (
    <div className="pokemon-data-table">
      <div className="pokemon-header-row">
        <p className="pokemon-header-item index-number">Index</p>
        <p className="pokemon-header-item pokemon-image">Pic</p>
        <p className="pokemon-header-item pokemon-ident">Ident</p>
        <p className="pokemon-header-item pokemon-type">Type</p>
        <p className="pokemon-header-item pokemon-abilities">Abilities</p>
        <div className="pokemon-header-item pokemon-base-stats">
          <p className="pokemon-base-stats-primary">Base Stats</p>
          <div className="pokemon-base-stats-secondary">
            <p className="pokemon-base-stats-secondary-cell">HP</p>
            <p className="pokemon-base-stats-secondary-cell">ATTACK</p>
            <p className="pokemon-base-stats-secondary-cell">DEFENSE</p>
            <p className="pokemon-base-stats-secondary-cell">SP. ATT</p>
            <p className="pokemon-base-stats-secondary-cell">SP. DEF</p>
            <p className="pokemon-base-stats-secondary-cell">SPEED</p>
          </div>
        </div>
      </div>
      {sortedPokemon.map((pokemon, index) => {
        return (
          <PokemonDataRow key={pokemon.ident} index={index} pokemon={pokemon} />
        )
      })}
    </div>
  )

}

export const AllPokemonScreen = () => {
  const allPokemon = AllPokemon as Pokemon[];

  return (
    <div className="screen all-pokemon-screen">
      <PokemonDataTable sortedPokemon={allPokemon} />
    </div>
  )
}
