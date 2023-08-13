import { v4 as uuidv4 } from "uuid";
import { PokemonBuild } from "./PokemonBuild";

export interface PokemonTeam {
  uuid: string;
  team_name: string;
  created_at: number;
  pokemonBuilds: PokemonBuild[];
}

export const createNewPokemonTeam = (): PokemonTeam => {
  return {
    uuid: uuidv4(),
    team_name: `TEAM ${Date.now()}`,
    created_at: Date.now(),
    pokemonBuilds: []
  }
}

// const validatePokemonTeam = (pokemonTeam: PokemonTeam, format: string): boolean => {
//   return false;
// }

// const savePokemonTeam = (pokemonTeam: PokemonTeam) => {
// }
