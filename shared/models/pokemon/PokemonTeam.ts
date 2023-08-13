import { PokemonBuild } from './PokemonBuild';

export interface PokemonTeam {
  uuid: string;
  team_name: string;
  created_at: number;
  pokemonBuilds: PokemonBuild[];
}
