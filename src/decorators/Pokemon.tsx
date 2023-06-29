import React, { useState, useEffect, ChangeEvent } from "react";
import { PokemonIdent, PokemonGender } from "../models/pokemon/PokemonShared";
import { Pokemon } from "../models/pokemon/Pokemon";

import { toTitleCase } from "./DecoratorsShared";

import AllPokemon from "../data/pokemon/all-pokemon.json";
const ALL_POKEMON = AllPokemon as Pokemon[];

const alphabeticalComp = (a: Pokemon, b: Pokemon): number => {
  if(a.ident > b.ident) { return 1; }
  if(b.ident > a.ident) { return -1; }
  if(a.ident === b.ident) { return 0; }
  return 0;
}

export const displayPokemonGender = (gender: PokemonGender): string => {
  if(gender === "male") { return "Male" }
  else if(gender === "female") { return "Female" }
  else if(gender === "genderless") { return "-" }
  return toTitleCase(gender);
}

export const displayPokemonIdent = (pokemonIdent: PokemonIdent): string => {
  if(pokemonIdent === "chi_yu" ) { return "Chi-Yu" }
  else if(pokemonIdent === "chien_pao") { return "Chien-Pao" }
  else if(pokemonIdent === "deerling-spring") { return "Deerling (Spring)" }
  else if(pokemonIdent === "deerling-summer") { return "Deerling (Summer)" }
  else if(pokemonIdent === "deerling-autumn") { return "Deerling (Autumn)" }
  else if(pokemonIdent === "deerling-winter") { return "Deerling (Winter)" }
  else if(pokemonIdent === "flutter_mane") { return "Flutter Mane" }
  else if(pokemonIdent === "gastrodon-east") { return "Gastrodon (East)"}
  else if(pokemonIdent === "gastrodon-west") { return "Gastrodon (West)"}
  else if(pokemonIdent === "indeedee-female") { return "Indeedee-F" }
  else if(pokemonIdent === "indeedee-male") { return "Indeedee-M" }
  else if(pokemonIdent === "lycanroc-dusk") { return "Lycanroc (Dusk)" }
  else if(pokemonIdent === "lycanroc-midday") { return "Lycanroc (Midday)" }
  else if(pokemonIdent === "lycanroc-midnight") { return "Lycanroc (Midnight)" }
  else if(pokemonIdent === "maushold-family-of-three") { return "Maushold (Three)" }
  else if(pokemonIdent === "maushold-family-of-four") { return "Maushold (Four)" }
  else if(pokemonIdent === "oinkologne-female") { return "Oinkologne-F" }
  else if(pokemonIdent === "oinkologne-male") { return "Oinkologne-M" }
  else if(pokemonIdent === "oricorio-pom-pom") { return "Oricorio Pom-Pom" }
  else if(pokemonIdent === "palafin-zero") { return "Palafin (Zero)" }
  else if(pokemonIdent === "palafin-hero") { return "Palafin (Hero)" }
  else if(pokemonIdent === "rotom-base") { return "Rotom (Base)" }
  else if(pokemonIdent === "rotom-mow") { return "Rotom (Mow)" }
  else if(pokemonIdent === "rotom-heat") { return "Rotom (Heat)" }
  else if(pokemonIdent === "rotom-wash") { return "Rotom (Wash)" }
  else if(pokemonIdent === "rotom-fan") { return "Rotom (Fan)" }
  else if(pokemonIdent === "rotom-frost") { return "Rotom (Frost)" }
  else if(pokemonIdent === "sawsbuck-spring") { return "Sawsbuck (Spring)" }
  else if(pokemonIdent === "sawsbuck-summer") { return "Sawsbuck (Summer)" }
  else if(pokemonIdent === "sawsbuck-autumn") { return "Sawsbuck (Autumn)" }
  else if(pokemonIdent === "sawsbuck-winter") { return "Sawsbuck (Winter)" }
  else if(pokemonIdent === "shellos-east") { return "Shellos (East)" }
  else if(pokemonIdent === "shellos-west") { return "Shellos (West)" }
  else if(pokemonIdent === "tatsugiri-curly") { return "Tatsugiri (Curly)" }
  else if(pokemonIdent === "tatsugiri-droopy") { return "Tatsugiri (Droopy)" }
  else if(pokemonIdent === "tatsugiri-stretchy") { return "Tatsugiri (Stretchy)" }
  else if(pokemonIdent === "tauros-aqua") { return "Tauros (Aqua)" }
  else if(pokemonIdent === "tauros-blaze") { return "Tauros (Blaze)" }
  else if(pokemonIdent === "tauros-combat") { return "Tauros (Combat)" }
  else if(pokemonIdent === "ting_lu") { return "Ting-Lu" }
  else if(pokemonIdent === "toxtricity-amped") { return "Toxtricity (Amped)" }
  else if(pokemonIdent === "toxtricity-low-key") { return "Toxtricity (Low-Key)" }
  else if(pokemonIdent === "wo_chien") { return "Wo-Chien" }
  else if(pokemonIdent === "wooper-paldea") { return "Wooper (Paldea)" }
  else { return toTitleCase(pokemonIdent); }
}

export const PokemonSelectList: React.FC<{
  pokemonIdent: PokemonIdent,
  onPokemonSelect?: (pokemonIdent: PokemonIdent) => void
}> = ({
  pokemonIdent,
  onPokemonSelect = () => undefined
}) => {

  const [selectedPokemonIdent, setSelectedPokemonIdent] = useState<PokemonIdent>(pokemonIdent);

  const handlePokemonSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPokemonIdent(e.target.value as PokemonIdent);
    onPokemonSelect(e.target.value as PokemonIdent);
  }

  useEffect(() => {
    setSelectedPokemonIdent(pokemonIdent);
  }, [pokemonIdent]);

  return (
    <select className="pokemon-select-list" onChange={handlePokemonSelect} value={selectedPokemonIdent}>
      <option value={""} disabled={true}>
        --Select a Pokemon--
      </option>
      {ALL_POKEMON.sort(alphabeticalComp).map((pokemon: Pokemon, index: number) => {
        return (
          <option key={`pokemon-${index}`} value={pokemon.ident}>{displayPokemonIdent(pokemon.ident)}</option>
        )
      })}
    </select>
  )

}

export const smogonIdentReverseMapping = (smogonIdent: string): PokemonIdent => {
  if(smogonIdent === "maushold") { return "maushold-family-of-four" }
  else if(smogonIdent === "gastrodon") { return "gastrodon-east" }
  else if(smogonIdent === "tauros-paldea") { return "tauros-combat" }
  else if(smogonIdent === "tauros-paldea-fire") { return "tauros-blaze" }
  else if(smogonIdent === "tauros-paldea-water") { return "tauros-aqua" }
  else { return smogonIdent }
}
