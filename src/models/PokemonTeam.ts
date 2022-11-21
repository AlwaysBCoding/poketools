import { PokemonBuild } from "./PokemonBuild";

export interface PokemonTeam {
  team_name: string;
  slot_1: PokemonBuild;
  slot_2: PokemonBuild;
  slot_3: PokemonBuild;
  slot_4: PokemonBuild;
  slot_5: PokemonBuild;
  slot_6: PokemonBuild;
}

const validatePokemonTeam = ((pokemonTeam: PokemonTeam, format: string): boolean => {
  return false;
})
