import React, { useState, ChangeEvent } from "react";
import { PokemonNatureIdent } from "../models/pokemon/PokemonShared";

export const PokemonNatureSelectList: React.FC<{
  natureIdent: PokemonNatureIdent,
  onNatureSelect?: (pokemonNatureIdent: PokemonNatureIdent) => void
}> = ({
  natureIdent,
  onNatureSelect = () => undefined
}) => {

  const [selectedNaureIdent, setSelectedNatureIdent] = useState<PokemonNatureIdent>(natureIdent);

  const handleNatureSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedNatureIdent(e.target.value as PokemonNatureIdent);
    onNatureSelect(e.target.value as PokemonNatureIdent);
  }

  return (
    <select onChange={handleNatureSelect} value={selectedNaureIdent}>
      <option value={"adamant"}>Adamant (+Atk, -SpA)</option>
      <option value={"bashful"}>Bashful</option>
      <option value={"bold"}>Bold (+Def, -Atk)</option>
      <option value={"brave"}>Brave (+Atk, -Spe)</option>
      <option value={"calm"}>Calm (+SpD, -Atk)</option>
      <option value={"careful"}>Careful (+SpD, -SpA)</option>
      <option value={"docile"}>Docile</option>
      <option value={"gentle"}>Gentle (+SpD, -Def)</option>
      <option value={"hardy"}>Hardy</option>
      <option value={"hasty"}>Hasty (+Spe, -Def)</option>
      <option value={"impish"}>Impish (+Def, -SpA)</option>
      <option value={"jolly"}>Jolly (+Spe, -SpA)</option>
      <option value={"lax"}>Lax (+Def, -SpD)</option>
      <option value={"lonely"}>Lonely (+Atk, -Def)</option>
      <option value={"mild"}>Mild (+SpA, -Def)</option>
      <option value={"modest"}>Modest (+SpA, -Atk)</option>
      <option value={"naive"}>Naive (+Spe, -SpD)</option>
      <option value={"naughty"}>Naughty (+Atk, -SpD)</option>
      <option value={"quiet"}>Quiet (+SpA, -Spe)</option>
      <option value={"quirky"}>Quirky</option>
      <option value={"rash"}>Rash (+SpA, -SpD)</option>
      <option value={"relaxed"}>Relaxed (+Def, -Spe)</option>
      <option value={"sassy"}>Sassy (+SpD, -Spe)</option>
      <option value={"serious"}>Serious</option>
      <option value={"timid"}>Timid (+Spe, -Atk)</option>
    </select>
  );
}
