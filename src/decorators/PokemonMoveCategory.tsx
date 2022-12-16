import React from "react";
import { PokemonMoveCategory } from "../models/pokemon/PokemonShared";

export const PokemonMoveCategoryBadge: React.FC<{moveCategory: PokemonMoveCategory}> = ({ moveCategory }) => {
  const moveCategorySpriteImage = require(`./move-category-sprites/${moveCategory}.move-category-sprite.png`);

  return (
    <div className="pokemon-move-category">
      <img src={moveCategorySpriteImage} alt={moveCategory} />
    </div>
  )

}
