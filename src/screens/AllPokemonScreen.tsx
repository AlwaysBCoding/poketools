import React from "react";
import AllPokemon from "../data/pokemon/all-pokemon.json";

import { Pokemon } from "../models/pokemon/Pokemon";

export const AllPokemonScreen = () => {
  return (
    <div className="screen all-pokemon-screen">
      <h1>All Pokemon</h1>
      <div className="pokemon-list">
        {AllPokemon.map((pokemonData) => {
          const pokemon = pokemonData as Pokemon;
          return (
            <div className="pokemon">
              <pre>{JSON.stringify(pokemon)}</pre>
            </div>
          )
        })}
      </div>
    </div>
  )
}
