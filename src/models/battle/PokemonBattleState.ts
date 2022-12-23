import { v4 as uuidv4 } from 'uuid';
import { PokemonIdent, PokemonTypeIdent, PokemonAbilityIdent, PokemonItemIdent } from "../pokemon/PokemonShared";
import { PokemonBuild, createDefaultPokemonBuildForPokemonIdent } from "../pokemon/PokemonBuild";
import {
  BattleSide,
  BattleSlot,
  PokemonBattleLocation,
  PokemonStatBoosts,
  PokemonStatusIdent,
  PokemonVolatileStatus
} from "./BattleShared";

export interface PokemonBattleState {
  battle_id: string;
  pokemon_build: PokemonBuild;
  battle_side: BattleSide;
  location: PokemonBattleLocation;
  primary_type_ident: PokemonTypeIdent;
  secondary_type_ident: PokemonTypeIdent | null;
  ability_ident: PokemonAbilityIdent;
  item_ident: PokemonItemIdent | null;
  status: PokemonStatusIdent;
  volatile_statuses: PokemonVolatileStatus[];
  stat_boosts: PokemonStatBoosts;
  terastallized: boolean;
  current_hp: number;
  current_slot: BattleSlot | null;
}

export const createNewPokemonBattleState = (pokemonBuild: PokemonBuild, side?: BattleSide): PokemonBattleState => {

  return {
    battle_id: uuidv4(),
    pokemon_build: pokemonBuild,
    battle_side: side ? side : "red",
    location: "preview",
    primary_type_ident: pokemonBuild.pokemon.primary_type_ident,
    secondary_type_ident: pokemonBuild.pokemon.secondary_type_ident,
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
    current_slot: null
  }

}

export const createDefaultPokemonBattleStateForPokemonIdent = (pokemonIdent: PokemonIdent): PokemonBattleState => {
  const pokemonBuild = createDefaultPokemonBuildForPokemonIdent(pokemonIdent);
  return createNewPokemonBattleState(pokemonBuild);
}
