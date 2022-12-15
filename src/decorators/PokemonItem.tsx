import React, { useState, ChangeEvent } from "react";
import { PokemonItemIdent } from "../models/pokemon/PokemonShared";
import { ALL_ITEM_IDENTS } from "../models/pokemon/PokemonItem";

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export const PokemonItemSelectList: React.FC<{
  itemIdent: PokemonItemIdent | null,
  onItemSelect?: (pokemonItemIdent: PokemonItemIdent) => void
}> = ({
  itemIdent,
  onItemSelect = () => undefined
}) => {

  const [selectedItemIdent, setSelectedItemIdent] = useState<PokemonItemIdent | null>(itemIdent);

  const handleItemSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedItemIdent(e.target.value as PokemonItemIdent);
    onItemSelect(e.target.value as PokemonItemIdent);
  }

  return (
    <select value={`${selectedItemIdent}`} onChange={handleItemSelect}>
      <option value={""}>(none)</option>
      {ALL_ITEM_IDENTS.map((itemIdent: string, index: number) => {
        return (
          <option key={`item-${index}`} value={itemIdent}>
            {toTitleCase(itemIdent.split("-").join(" "))}
          </option>
        )
      })}
    </select>
  )

}
