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

    if(tokens[0].toLowerCase() === "type") {
      if(tokens.length === 2) {
        const filteredPokemon = allPokemon.filter((pokemon) => {
          return [pokemon.primary_type_ident, pokemon.secondary_type_ident].includes(tokens[1] as PokemonTypeIdent);
        });
        setFilteredPokemon(filteredPokemon);
      } else if(tokens.length === 3) {
        const filteredPokemon = allPokemon.filter((pokemon) => {
          const values = [tokens[1] as PokemonTypeIdent, tokens[2] as PokemonTypeIdent];
          return values.every(value => {
            return [pokemon.primary_type_ident, pokemon.secondary_type_ident].includes(value);
          })
        });
        setFilteredPokemon(filteredPokemon);
      }
    } else if(tokens[0].toLowerCase() === "resists" && tokens.length === 2) {
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
    } else if(tokens[0].toLowerCase() === "beats" && tokens.length === 2) {
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
    } else if(tokens[0].toLowerCase() === "a" && tokens.length === 2) {
      const filteredPokemon = allPokemon.filter((pokemon) => {
        return pokemon.ability_idents.includes(tokens[1] as PokemonAbilityIdent)
      });
      setFilteredPokemon(filteredPokemon);
    } else if(tokens[0].toLowerCase() === "m" && tokens.length === 2) {
      const filteredPokemon = allPokemon.filter((pokemon) => {
        return pokemon.move_idents.includes(tokens[1] as PokemonMoveIdent);
      });
      setFilteredPokemon(filteredPokemon);
    } else if(tokens[0].toLowerCase() === "m" && tokens.length === 3) {
      const filteredPokemon = allPokemon.filter((pokemon) => {
        return pokemon.move_idents.includes(tokens[1] as PokemonMoveIdent) && pokemon.move_idents.includes(tokens[2] as PokemonMoveIdent);
      });
      setFilteredPokemon(filteredPokemon);
    } else if (tokens[0] === "c") {
      const filteredPokemon = allPokemon.filter((pokemon) => {
        return pokemon.ident.includes(tokens[1]) || pokemon.ident.includes(tokens[2])
      })
      setFilteredPokemon(filteredPokemon);
    } else if(tokens[1] === "than" && tokens.length === 3) {
      const comparePokemon = allPokemon.find((pokemon) => {
        return pokemon.ident === tokens[2];
      })!;
      if(tokens[0] === "faster") {
        const filteredPokemon = allPokemon.filter((pokemon) => {
          return pokemon.base_stats.speed >= comparePokemon.base_stats.speed
        });
        setCurrentSortStat("speed");
        setCurrentSortStatDirection("desc");
        setFilteredPokemon(filteredPokemon);
      } else if(tokens[0] === "slower") {
        const filteredPokemon = allPokemon.filter((pokemon) => {
          return pokemon.base_stats.speed <= comparePokemon.base_stats.speed
        });
        setCurrentSortStat("speed");
        setCurrentSortStatDirection("asc");
        setFilteredPokemon(filteredPokemon);
      }
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
