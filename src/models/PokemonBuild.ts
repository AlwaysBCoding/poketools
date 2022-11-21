import {
  PokemonAbility,
  PokemonGender,
  PokemonItem,
  PokemonMove,
  PokemonNature,
  PokemonStatSpread,
  PokemonType,
} from "./PokemonShared";

export interface PokemonBuild {
  pokemon_ident: string;
  nickname: string | null;
  item_ident: PokemonItem;
  ability_ident: PokemonAbility;
  level: number;
  shiny: boolean;
  gender: PokemonGender;
  tera_type_ident: PokemonType;
  nature_ident: PokemonNature;
  move_idents: PokemonMove[];
  iv_spread: PokemonStatSpread;
  ev_spread: PokemonStatSpread;
}

const validatePokemonBuild = ((pokemonBuild: PokemonBuild, format: string): boolean => {
  return false;
});
