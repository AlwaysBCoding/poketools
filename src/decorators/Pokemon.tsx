import React, { useState, useEffect, ChangeEvent } from "react";
import { PokemonIdent, PokemonGender } from "../models/pokemon/PokemonShared";
import { Pokemon } from "../models/pokemon/Pokemon";

import { toTitleCase } from "./DecoratorsShared";

import AllPokemon from "../data/pokemon/all-pokemon.json";
const ALL_POKEMON = AllPokemon as Pokemon[];
const ALL_UNIQUE_POKEMON: Pokemon[] = [];

ALL_POKEMON.forEach((pokemon) => {
  let formes = [];
  if(pokemon.forme_root_ident) {
    formes = ALL_POKEMON.filter((x) => { return x.ident === pokemon.forme_root_ident || x.forme_root_ident === pokemon.forme_root_ident })
  } else {
    formes = ALL_POKEMON.filter((x) => { return x.ident === pokemon.ident || x.forme_root_ident === pokemon.ident })
  }
  
  if(pokemon.forme_root_ident || formes.length > 1) {
    if(!pokemon.forme_root_ident) { pokemon.forme_root_ident = pokemon.ident }
    if(pokemon.ident === formes[0].ident) {
      ALL_UNIQUE_POKEMON.push(pokemon)
    }
  } else {
    ALL_UNIQUE_POKEMON.push(pokemon)
  }
 
})

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
  const REGION_NAMES = ["alola", "hisui", "galar", "paldea"];
  REGION_NAMES.forEach((regionName) => {
    if(pokemonIdent.includes(`-${regionName}`)) {
      pokemonIdent = pokemonIdent.replace(regionName, ` (${regionName})`);
    }
  })

  if(pokemonIdent === "brute_bonnet") { return "Brute Bonnet" }
  else if(pokemonIdent === "chi_yu" ) { return "Chi-Yu" }
  else if(pokemonIdent === "chien_pao") { return "Chien-Pao" }
  else if(pokemonIdent === "deerling-spring") { return "Deerling (Spring)" }
  else if(pokemonIdent === "deerling-summer") { return "Deerling (Summer)" }
  else if(pokemonIdent === "deerling-autumn") { return "Deerling (Autumn)" }
  else if(pokemonIdent === "deerling-winter") { return "Deerling (Winter)" }
  else if(pokemonIdent === "flutter_mane") { return "Flutter Mane" }
  else if(pokemonIdent === "gastrodon-east") { return "Gastrodon (East)"}
  else if(pokemonIdent === "gastrodon-west") { return "Gastrodon (West)"}
  else if(pokemonIdent === "great_tusk") { return "Great Tusk" }
  else if(pokemonIdent === "indeedee-female") { return "Indeedee-F" }
  else if(pokemonIdent === "indeedee-male") { return "Indeedee-M" }
  else if(pokemonIdent === "iron_bundle") { return "Iron Bundle" }
  else if(pokemonIdent === "iron_hands") { return "Iron Hands" }
  else if(pokemonIdent === "iron_jugulis") { return "Iron Jugulis" }
  else if(pokemonIdent === "iron_moth") { return "Iron Moth" }
  else if(pokemonIdent === "iron_thorns") { return "Iron Thorns" }
  else if(pokemonIdent === "iron_treads") { return "Iron Treads" }
  else if(pokemonIdent === "iron_valiant") { return "Iron Valiant" }
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
  else if(pokemonIdent === "roaring_moon") { return "Roaring Moon" }
  else if(pokemonIdent === "rotom-base") { return "Rotom (Base)" }
  else if(pokemonIdent === "rotom-mow") { return "Rotom (Mow)" }
  else if(pokemonIdent === "rotom-heat") { return "Rotom (Heat)" }
  else if(pokemonIdent === "rotom-wash") { return "Rotom (Wash)" }
  else if(pokemonIdent === "rotom-fan") { return "Rotom (Fan)" }
  else if(pokemonIdent === "rotom-frost") { return "Rotom (Frost)" }
  else if(pokemonIdent === "sandy_shocks") { return "Sandy Shocks" }
  else if(pokemonIdent === "sawsbuck-spring") { return "Sawsbuck (Spring)" }
  else if(pokemonIdent === "sawsbuck-summer") { return "Sawsbuck (Summer)" }
  else if(pokemonIdent === "sawsbuck-autumn") { return "Sawsbuck (Autumn)" }
  else if(pokemonIdent === "sawsbuck-winter") { return "Sawsbuck (Winter)" }
  else if(pokemonIdent === "scream_tail") { return "Scream Tail" }
  else if(pokemonIdent === "shellos-east") { return "Shellos (East)" }
  else if(pokemonIdent === "shellos-west") { return "Shellos (West)" }
  else if(pokemonIdent === "slither_wing") { return "Slither Wing" }
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
  else { return toTitleCase(pokemonIdent); }
}

export const displayFormeIdent = (formeIdent: PokemonIdent): string => {
  let formeSegments = formeIdent.split("-");
  if(formeSegments.length > 1) {
    formeSegments.shift();
    return toTitleCase(formeSegments.join("-"));
  } else {
    return "Base";
  }
}

export const PokemonSelectList: React.FC<{
  pokemonIdent: PokemonIdent,
  formeRootIdent?: PokemonIdent,
  onPokemonSelect?: (pokemonIdent: PokemonIdent) => void
}> = ({
  pokemonIdent,
  formeRootIdent,
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

  const selectedRootPokemon = formeRootIdent ? ALL_UNIQUE_POKEMON.find((pokemon) => { return formeRootIdent === pokemon.ident || formeRootIdent === pokemon.forme_root_ident }) : undefined;

  return (
    <select className="pokemon-select-list" onChange={handlePokemonSelect} value={selectedRootPokemon ? selectedRootPokemon.ident : selectedPokemonIdent}>
      <option value={""} disabled={true}>
        --Select a Pokemon--
      </option>
      {ALL_UNIQUE_POKEMON.sort(alphabeticalComp).map((pokemon: Pokemon, index: number) => {
        const displayIdent = pokemon.forme_root_ident ? displayPokemonIdent(pokemon.forme_root_ident) : displayPokemonIdent(pokemon.ident)
        return (
          <option key={`pokemon-${index}`} value={pokemon.ident}>{displayIdent}</option>
        )
      })}
    </select>
  )

}

export const PokemonFormeSelectList: React.FC<{
  formeIdent: PokemonIdent,
  formeRootIdent: PokemonIdent,
  onFormeSelect?: (pokemonIdent: PokemonIdent) => void 
}> = ({
  formeIdent,
  formeRootIdent,
  onFormeSelect = () => undefined
}) => {
  
  const [selectedFormeIdent, setSelectedFormeIdent] = useState<PokemonIdent>(formeIdent);

  const handleFormeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedFormeIdent(e.target.value as PokemonIdent);
    onFormeSelect(e.target.value as PokemonIdent);
  }

  useEffect(() => {
    setSelectedFormeIdent(formeIdent);
  }, [formeIdent]);
  
  const ALL_FORMES = ALL_POKEMON.filter((pokemon) => { return pokemon.ident === formeRootIdent || pokemon.forme_root_ident === formeRootIdent});
  
  return (
    <select className="pokemon-select-list" onChange={handleFormeSelect} value={selectedFormeIdent}>
      <option value={""} disabled={true}>
        --Select a Forme--
      </option>
      {ALL_FORMES.map((pokemon: Pokemon, index: number) => {
        return (
          <option key={`pokemon-${index}`} value={pokemon.ident}>{displayFormeIdent(pokemon.ident)}</option>
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
