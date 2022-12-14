import React, { useState } from "react";
import { PokemonBattleState } from "../models/battle/PokemonBattleState";
import { displayPokemonType } from "../decorators/pokemon-types";

export const PokemonBattleStateEditor: React.FC<{
  initialPokemonBattleState: PokemonBattleState
}> = ({
  initialPokemonBattleState
}) => {
  const [pokemonBattleState, setPokemonBattleState] = useState<PokemonBattleState>(initialPokemonBattleState);

  return (
    <div className="pokemon-battle-state-editor">
      <div className="data-row pokemon-ident">
        <h4>{pokemonBattleState.pokemon_build.pokemon.ident}</h4>
      </div>
      <div className="data-row">
        {displayPokemonType(pokemonBattleState.pokemon_build.pokemon.primary_type_ident)}
      </div>
    </div>
  )
}
