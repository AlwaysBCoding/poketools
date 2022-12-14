import React from "react";
import { PokemonTypeIdent } from "../models/pokemon/PokemonShared";

export const displayPokemonType = (pokemonTypeIdent: PokemonTypeIdent) => {
  const typeSpriteImage = require(`./type-sprites/${pokemonTypeIdent}.type-sprite.png`);

  return (
    <div className="pokemon-type">
      <img src={typeSpriteImage} alt={pokemonTypeIdent} />
    </div>
  )
}
