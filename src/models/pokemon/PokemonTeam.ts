import { PokemonBuild } from "./PokemonBuild";

export interface PokemonTeam {
  team_name: string;
  created_at: number;
  pokemonBuilds: PokemonBuild[]
}

export const createNewPokemonTeam = (): PokemonTeam => {
  return {
    team_name: "Default Team",
    created_at: Date.now(),
    pokemonBuilds: []
  }
}

// const validatePokemonTeam = (pokemonTeam: PokemonTeam, format: string): boolean => {
//   return false;
// }

// const savePokemonTeam = (pokemonTeam: PokemonTeam) => {
// }
