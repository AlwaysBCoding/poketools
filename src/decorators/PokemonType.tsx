import React, { useState, useEffect, ChangeEvent } from "react";
import { PokemonTypeIdent } from "../models/pokemon/PokemonShared";
import { Pokemon } from "../models/pokemon/Pokemon";

export const PokemonTypeSelectList: React.FC<{
  typeIdent: PokemonTypeIdent,
  onTypeSelect?: (pokemonTypeIdent: PokemonTypeIdent) => void
}> = ({
  typeIdent,
  onTypeSelect = () => undefined
}) => {

  const [selectedTypeIdent, setSelectedTypeIdent] = useState<PokemonTypeIdent>(typeIdent);

  const handleTypeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedTypeIdent(e.target.value as PokemonTypeIdent);
    onTypeSelect(e.target.value as PokemonTypeIdent);
  }

  useEffect(() => {
    setSelectedTypeIdent(typeIdent);
  }, [typeIdent]);

  return (
    <select onChange={handleTypeSelect} value={selectedTypeIdent}>
      <option value={`bug`}>Bug</option>
      <option value={`dark`}>Dark</option>
      <option value={`dragon`}>Dragon</option>
      <option value={`electric`}>Electric</option>
      <option value={`fairy`}>Fairy</option>
      <option value={`fighting`}>Fighting</option>
      <option value={`fire`}>Fire</option>
      <option value={`flying`}>Flying</option>
      <option value={`ghost`}>Ghost</option>
      <option value={`grass`}>Grass</option>
      <option value={`ground`}>Ground</option>
      <option value={`ice`}>Ice</option>
      <option value={`normal`}>Normal</option>
      <option value={`poison`}>Poison</option>
      <option value={`psychic`}>Psychic</option>
      <option value={`rock`}>Rock</option>
      <option value={`steel`}>Steel</option>
      <option value={`water`}>Water</option>
    </select>
  );

}

export const PokemonTypeBadge: React.FC<{typeIdent: PokemonTypeIdent}> = ({ typeIdent }) => {
  const typeSpriteImage = require(`./type-sprites/${typeIdent}.type-sprite.png`);

  return (
    <div className="pokemon-type-badge">
      <img src={typeSpriteImage} alt={typeIdent} />
    </div>
  )
}
