import { PokemonItemIdent } from "../pokemon/PokemonShared";
import { PokemonBuild } from "../pokemon/PokemonBuild";
import {
  BattleSide,
  PokemonStatBoosts,
  PokemonStatus,
  PokemonVolatileStatus
} from "./BattleShared";

export interface PokemonBattleState {
  pokemon_build: PokemonBuild;
  side: BattleSide;
  item_ident: PokemonItemIdent | null;
  status: PokemonStatus;
  volatile_statuses: PokemonVolatileStatus[];
  stat_boosts: PokemonStatBoosts;
  terastallized: boolean;
  current_hp: number;
}

export const createNewPokemonBattleState = (pokemonBuild: PokemonBuild, side: BattleSide): PokemonBattleState => {

  return {
    pokemon_build: pokemonBuild,
    side: side,
    item_ident: pokemonBuild.item_ident,
    status: "none",
    volatile_statuses: [],
    stat_boosts: {
      attack: 0,
      defense: 0,
      special_attack: 0,
      special_defense: 0,
      speed: 0
    },
    terastallized: false,
    current_hp: pokemonBuild.stat_spread.hp
  }

}
