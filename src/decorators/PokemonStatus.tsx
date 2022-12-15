import React, { useState, ChangeEvent } from "react";
import { PokemonStatusIdent } from "../models/battle/BattleShared";

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export const PokemonStatusSelectList: React.FC<{
  pokemonStatusIdent: PokemonStatusIdent,
  onStatusSelect?: (pokemonStatusIdent: PokemonStatusIdent) => void
}> = ({
  pokemonStatusIdent,
  onStatusSelect = () => undefined
}) => {

  const [selectedStatusIdent, setSelectedStatusIdent] = useState<PokemonStatusIdent>(pokemonStatusIdent);

  const handleStatusSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatusIdent(e.target.value as PokemonStatusIdent);
    onStatusSelect(e.target.value as PokemonStatusIdent);
  }

  return (
    <select value={selectedStatusIdent} onChange={handleStatusSelect}>
      <option value={"healthy"}>Healthy</option>
      <option value={"poisoned"}>Poisoned</option>
      <option value={"badly-poisoned"}>Badly Poisoned</option>
      <option value={"burned"}>Burned</option>
      <option value={"paralyzed"}>Paralyzed</option>
      <option value={"asleep"}>Asleep</option>
      <option value={"frozen"}>Frozen</option>
    </select>
  );

}
