import React, { useState, ChangeEvent } from "react";
import { PokemonItemIdent } from "../models/pokemon/PokemonShared";
import { ALL_ITEM_IDENTS } from "../models/pokemon/PokemonItem";
import { toTitleCase } from "./DecoratorsShared";

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
            {toTitleCase(itemIdent)}
          </option>
        )
      })}
    </select>
  )

}
