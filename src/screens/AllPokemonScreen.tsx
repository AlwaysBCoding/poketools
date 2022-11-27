import React, { useEffect, useState, KeyboardEvent } from "react";
import useForceUpdate from "use-force-update";

import AllPokemon from "../data/pokemon/all-pokemon.json";
import TypeChart from "../data/pokemon-type-effectiveness.json";
import { Pokemon } from "../models/pokemon/Pokemon";
import { calculatePokemonTotalStats, PokemonTypeInteraction } from "../models/pokemon/PokemonShared";

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
      {pokemon.ability_idents.map((pokemonAbility, index) => {
        return (
          <p key={`ability-${index}`}>{pokemonAbility}</p>
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
      <p className="base-stat total">{calculatePokemonTotalStats(pokemon.base_stats)}</p>
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

const PokemonDataTable: React.FC<{
  sortedPokemon: Pokemon[],
  currentSortStat: string,
  currentSortStatDirection: "desc" | "asc",
  sortByBaseStat: (baseStat: string, toggleDirection: boolean) => void
}> = ({ sortedPokemon, currentSortStat, currentSortStatDirection, sortByBaseStat }) => {

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
  const forceUpdate = useForceUpdate();

  const allPokemon = AllPokemon as Pokemon[];
  const typeChart = TypeChart as PokemonTypeInteraction[];
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>(allPokemon);
  const [currentSortStat, setCurrentSortStat] = useState<string>("");
  const [currentSortStatDirection, setCurrentSortStatDirection] = useState<"desc" | "asc">("desc");
  const [sortedPokemon, setSortedPokemon] = useState<Pokemon[]>(filteredPokemon);
  const [queryString, setQueryString] = useState<string>("");

  useEffect(() => {
    sortByBaseStat(currentSortStat, false);
  }, [filteredPokemon])

  const keyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if(event.key === "Enter") {
      filterByQueryString(event.currentTarget.value);
    }
  }

  const filterByQueryString = (queryString: string) => {
    const tokens = queryString.split(/\s+/);

    if(tokens[0].toLowerCase() === "resists" && tokens.length === 2) {
      const filteredPokemon = allPokemon.filter((pokemon) => {
        const primaryTypeResistance = typeChart.find((interaction) => {
          return interaction.offensive_type_ident === tokens[1] && interaction.defensive_type_ident === pokemon.primary_type_ident;
        })!.effectiveness;
        const secondaryTypeResistance = pokemon.secondary_type_ident ? (
          typeChart.find((interaction) => {
            return interaction.offensive_type_ident === tokens[1] && interaction.defensive_type_ident === pokemon.secondary_type_ident;
          })!.effectiveness
        ) : 1;
        const resistanceValue = primaryTypeResistance * secondaryTypeResistance;
        return resistanceValue < 1;
      });
      setFilteredPokemon(filteredPokemon);
    } else if(tokens[0].toLowerCase() === "defeats" && tokens.length === 2) {
      const filteredPokemon = allPokemon.filter((pokemon) => {
        const primaryTypeEffectiveness = typeChart.find((interaction) => {
          return interaction.offensive_type_ident === pokemon.primary_type_ident && interaction.defensive_type_ident === tokens[1];
        })!.effectiveness;
        const secondaryTypeEffectiveness = pokemon.secondary_type_ident ? (
          typeChart.find((interaction) => {
            return interaction.offensive_type_ident === pokemon.secondary_type_ident && interaction.defensive_type_ident === tokens[1];
          })!.effectiveness
        ) : 1;
        const effectivenessValue = primaryTypeEffectiveness * secondaryTypeEffectiveness;
        return effectivenessValue > 1;
      });
      setFilteredPokemon(filteredPokemon);
    } else {
      setCurrentSortStat("");
      setFilteredPokemon(allPokemon);
    }
  }

  const sortByBaseStat = (baseStat: string, toggleDirection: boolean) => {
    let sorted: Pokemon[] = filteredPokemon;
    let nextSortStatDirection = currentSortStatDirection;
    if(baseStat === "hp") {
      sorted = filteredPokemon.sort((pokemonA, pokemonB) => { return pokemonB.base_stats.hp - pokemonA.base_stats.hp});
    }
    if(baseStat === "attack") {
      sorted = filteredPokemon.sort((pokemonA, pokemonB) => { return pokemonB.base_stats.attack - pokemonA.base_stats.attack});
    }
    if(baseStat === "defense") {
      sorted = filteredPokemon.sort((pokemonA, pokemonB) => { return pokemonB.base_stats.defense - pokemonA.base_stats.defense});
    }
    if(baseStat === "special-attack") {
      sorted = filteredPokemon.sort((pokemonA, pokemonB) => { return pokemonB.base_stats.special_attack - pokemonA.base_stats.special_attack});
    }
    if(baseStat === "special-defense") {
      sorted = filteredPokemon.sort((pokemonA, pokemonB) => { return pokemonB.base_stats.special_defense - pokemonA.base_stats.special_defense});
    }
    if(baseStat === "speed") {
      sorted = filteredPokemon.sort((pokemonA, pokemonB) => { return pokemonB.base_stats.speed - pokemonA.base_stats.speed});
    }
    if(baseStat === "total") {
      sorted = filteredPokemon.sort((pokemonA, pokemonB) => { return calculatePokemonTotalStats(pokemonB.base_stats) - calculatePokemonTotalStats(pokemonA.base_stats) });
    }

    if(toggleDirection && currentSortStat === baseStat) {
      if(currentSortStatDirection === "desc") {
        nextSortStatDirection = "asc";
      } else if(currentSortStatDirection === "asc") {
        nextSortStatDirection = "desc";
      }
    } else if(toggleDirection) {
      nextSortStatDirection = "desc";
    }

    if(nextSortStatDirection === "asc") { sorted.reverse(); }

    setCurrentSortStat(baseStat);
    setCurrentSortStatDirection(nextSortStatDirection);
    setSortedPokemon(sorted);
    forceUpdate();
  }

  return (
    <div
      className="screen all-pokemon-screen">
      <input
        className="query-input"
        placeholder="QUERY INPUT"
        value={queryString}
        onKeyPress={keyPressHandler}
        onChange={(e) => { setQueryString(e.target.value) }} />
      <PokemonDataTable
        sortedPokemon={sortedPokemon}
        currentSortStat={currentSortStat}
        currentSortStatDirection={currentSortStatDirection}
        sortByBaseStat={sortByBaseStat} />
    </div>
  )
}
