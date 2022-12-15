import React from "react";
import { PokemonTypeIdent } from "../models/pokemon/PokemonShared";

export const PokemonTypeBadge: React.FC<{typeIdent: PokemonTypeIdent}> = ({ typeIdent }) => {
  const typeSpriteImage = require(`./type-sprites/${typeIdent}.type-sprite.png`);

  return (
    <div className="pokemon-type">
      <img src={typeSpriteImage} alt={typeIdent} />
    </div>
  )
}
