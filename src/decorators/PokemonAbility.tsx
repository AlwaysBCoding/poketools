import React, { useState, useEffect, ChangeEvent } from "react";
import { PokemonBuild } from "../models/pokemon/PokemonBuild";
import { PokemonAbilityIdent } from "../models/pokemon/PokemonShared";
import { toTitleCase } from "./DecoratorsShared";

export const PokemonAbilitySelectList: React.FC<{
  pokemonBuild: PokemonBuild,
  onAbilitySelect?: (pokemonAbilityIdent: PokemonAbilityIdent) => void
}> = ({
  pokemonBuild,
  onAbilitySelect = () => undefined
}) => {

  const [selectedAbilityIdent, setSelectedAbilityIdent] = useState<PokemonAbilityIdent>(pokemonBuild.ability_ident);

  const handleAbilitySelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedAbilityIdent(e.target.value as PokemonAbilityIdent);
    onAbilitySelect(e.target.value as PokemonAbilityIdent);
  }

  useEffect(() => {
    setSelectedAbilityIdent(pokemonBuild.ability_ident);
  }, [pokemonBuild]);

  return (
    <select className="pokemon-ability-select-list" value={selectedAbilityIdent} onChange={handleAbilitySelect}>
      {pokemonBuild.pokemon.ability_idents.map((abilityIdent: string, index: number) => {
        return (
          <option key={`ability-${index}`} value={abilityIdent}>
            {toTitleCase(abilityIdent)}
          </option>
        )
      })}
    </select>
  )

}
