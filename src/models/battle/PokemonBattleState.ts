import { PokemonAbilityIdent, PokemonItemIdent } from "../pokemon/PokemonShared";
import { PokemonBuild } from "../pokemon/PokemonBuild";
import {
  BattleSide,
  PokemonBattleLocation,
  PokemonStatBoosts,
  PokemonStatusIdent,
  PokemonVolatileStatus
} from "./BattleShared";

export interface PokemonBattleState {
  pokemon_build: PokemonBuild;
  side: BattleSide;
  location: PokemonBattleLocation;
  ability_ident: PokemonAbilityIdent;
  item_ident: PokemonItemIdent | null;
  status: PokemonStatusIdent;
  volatile_statuses: PokemonVolatileStatus[];
  stat_boosts: PokemonStatBoosts;
  terastallized: boolean;
  current_hp: number;
  fainted: boolean;
}

export const createNewPokemonBattleState = (pokemonBuild: PokemonBuild, side?: BattleSide): PokemonBattleState => {

  return {
    pokemon_build: pokemonBuild,
    side: side ? side : "red",
    location: "preview",
    ability_ident: pokemonBuild.ability_ident,
    item_ident: pokemonBuild.item_ident,
    status: "healthy",
    volatile_statuses: [],
    stat_boosts: {
      attack: 0,
      defense: 0,
      special_attack: 0,
      special_defense: 0,
      speed: 0
    },
    terastallized: false,
    current_hp: pokemonBuild.stat_spread.hp,
    fainted: false
  }

}
