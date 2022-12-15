import React, { useState, ChangeEvent } from "react";
import { PokemonBuild } from "../models/pokemon/PokemonBuild";
import { PokemonAbilityIdent } from "../models/pokemon/PokemonShared";

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

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

  return (
    <select value={selectedAbilityIdent} onChange={handleAbilitySelect}>
      {pokemonBuild.pokemon.ability_idents.map((abilityIdent: string, index: number) => {
        return (
          <option key={`ability-${index}`} value={abilityIdent}>
            {toTitleCase(abilityIdent.split("-").join(" "))}
          </option>
        )
      })}
    </select>
  )

}
