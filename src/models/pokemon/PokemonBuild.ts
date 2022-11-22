import {
  PokemonAbilityIdent,
  PokemonGender,
  PokemonItemIdent,
  PokemonMoveIdent,
  PokemonNatureIdent,
  PokemonStatSpread,
  PokemonTypeIdent,
} from "./PokemonShared";

import { Pokemon } from "./Pokemon";

import allPokemon from "../../data/pokemon/all-pokemon.json";

import { calculateStatSpread } from "./stat-calc";
import { PokemonBuildTemplate } from "./PokemonBuildTemplate";

export interface PokemonBuild {
  pokemon: Pokemon;
  nickname: string | null;
  item_ident: PokemonItemIdent;
  ability_ident: PokemonAbilityIdent;
  level: number;
  shiny: boolean;
  gender: PokemonGender;
  tera_type_ident: PokemonTypeIdent;
  nature_ident: PokemonNatureIdent;
  move_idents: PokemonMoveIdent[];
  iv_spread: PokemonStatSpread;
  ev_spread: PokemonStatSpread;
  stat_spread: PokemonStatSpread;
}

export const pokemonBuildTemplateToPokemonBuild = (pokemonBuildTemplate: PokemonBuildTemplate): PokemonBuild => {
  var pokemonBuild: any = Object.assign(pokemonBuildTemplate, {});

  const statSpread = calculateStatSpread(pokemonBuildTemplate);
  const pokemonData: Pokemon | undefined = allPokemon.find((pokemon: any) => { return pokemon.ident === pokemonBuildTemplate.pokemon_ident; });

  if(pokemonData) {
    pokemonBuild.pokemon = pokemonData;
    pokemonBuild.stat_spread = statSpread;
  } else {
    pokemonBuild.pokemon = {};
    pokemonBuild.stat_spread = {};
  }

  return pokemonBuild as PokemonBuild;
};
