import React, { useEffect, useState, KeyboardEvent } from "react";
import useForceUpdate from "use-force-update";

import AllPokemon from "../data/pokemon/all-pokemon.json";
import TypeChart from "../data/pokemon-type-effectiveness.json";
import { Pokemon } from "../models/pokemon/Pokemon";
import {
  calculatePokemonTotalStats,
  PokemonTypeInteraction,
  PokemonAbilityIdent,
  PokemonMoveIdent,
  PokemonTypeIdent
} from "../models/pokemon/PokemonShared";

import { PokemonDataTable } from "../components/PokemonDataTable";

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
    // eslint-disable-next-line
  }, [filteredPokemon])

  const keyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if(event.key === "Enter") {
      filterByQueryString(event.currentTarget.value);
    }
  }

  const filterByQueryString = (queryString: string) => {
    const tokens = queryString.split(/\s+/);
    const tokenTuples = [];
    for (let i = 0; i < tokens.length; i += 2) {
      let tuple = [tokens[i], tokens[i + 1]];
      tokenTuples.push(tuple);
    }

    var filteredPokemon = allPokemon;
    tokenTuples.forEach((tuple) => {
      const command = tuple[0];
      const arg = tuple[1];

      if(command === "a") {
        filteredPokemon = filteredPokemon.filter((pokemon) => {
          return pokemon.ability_idents.includes(arg as PokemonAbilityIdent);
        })
      }
      if(command === "c") {
        filteredPokemon = filteredPokemon.filter((pokemon) => {
          return pokemon.ident.includes(arg as PokemonAbilityIdent);
        })
      }
      if(command === "m") {
        filteredPokemon = filteredPokemon.filter((pokemon) => {
          return pokemon.move_idents.includes(arg as PokemonMoveIdent);
        })
      }
      if(command === "o") {
        setCurrentSortStat(arg);
        setCurrentSortStatDirection("desc");
      }
      if(command === "t") {
        filteredPokemon = filteredPokemon.filter((pokemon) => {
          return [pokemon.primary_type_ident, pokemon.secondary_type_ident].includes(arg as PokemonTypeIdent);
        })
      }
    })

    setFilteredPokemon(filteredPokemon);
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
      <div className="data-table-container">
        <PokemonDataTable
          pokemonList={sortedPokemon}
          currentSortStat={currentSortStat}
          currentSortStatDirection={currentSortStatDirection}
          sortByBaseStat={sortByBaseStat} />
      </div>
    </div>
  )
}
