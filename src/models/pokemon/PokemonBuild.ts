import {
  PokemonAbility,
  PokemonGender,
  PokemonItem,
  PokemonMove,
  PokemonNature,
  PokemonStatSpread,
  PokemonType,
} from "./PokemonShared";

import { calculateStatSpread } from "./stat-calc";
import { PokemonBuildTemplate } from "./PokemonBuildTemplate";

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
  stat_spread: PokemonStatSpread;
}

export const pokemonBuildTemplateToPokemonBuild = (pokemonBuildTemplate: PokemonBuildTemplate): PokemonBuild => {

  const statSpread = calculateStatSpread(pokemonBuildTemplate);
  return Object.assign(pokemonBuildTemplate, {stat_spread: statSpread});

};
