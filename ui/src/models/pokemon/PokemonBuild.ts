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
import vgcUsageData from "../../data/stats/2022-12-vgc-series1-usage.json";

import { calculateStatSpreadFromBuildTemplate } from "./stat-calc";
import { PokemonBuildTemplate } from "./PokemonBuildTemplate";
import { smogonIdentReverseMapping } from "../../decorators/Pokemon";

export interface PokemonBuild {
  nickname: string | null;
  pokemon: Pokemon;
  ability_ident: PokemonAbilityIdent;
  item_ident: PokemonItemIdent | null;
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

  const statSpread = calculateStatSpreadFromBuildTemplate(pokemonBuildTemplate);

  const pokemonData: Pokemon = (allPokemon.find((pokemon: any) => {
    let adjustedIdent = pokemonBuildTemplate.pokemon_ident;
    if(adjustedIdent === "maushold-four") { adjustedIdent = "maushold-family-of-four" }
    if(adjustedIdent === "maushold-three") { adjustedIdent = "maushold-family-of-three" }
    // return pokemon.ident.includes(adjustedIdent);
    return pokemon.ident === adjustedIdent;
  }) as Pokemon);

  pokemonBuild.pokemon = pokemonData;
  pokemonBuild.stat_spread = statSpread;

  if(!pokemonBuild.gender) { pokemonBuild.gender = pokemonData.genders[0] }
  if(!pokemonBuild.tera_type_ident) { pokemonBuild.tera_type_ident = pokemonBuild.pokemon.primary_type_ident; }

  return pokemonBuild as PokemonBuild;
};

export const createDefaultPokemonBuildForPokemon = (pokemon: Pokemon): PokemonBuild => {
  const randomMoveIdents = pokemon.move_idents
    .map(x => ({ x, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map(a => a.x)
    .slice(0, 4);

  const defaultEVSpread: PokemonStatSpread = {
    hp: 0,
    attack: 0,
    defense: 0,
    special_attack: 0,
    special_defense: 0,
    speed: 0
  };

  const pokemonUsageData = vgcUsageData.find((usageData: any) => {
    return smogonIdentReverseMapping(usageData.ident) == pokemon.ident
  });

  let usageItemIdent: PokemonItemIdent | null = null;
  let usageAbilityIdent: PokemonAbilityIdent | null = null;
  let usageNatureIdent: PokemonNatureIdent | null = null;
  let usageMoveIdents: PokemonMoveIdent[] | null = null;
  let usageEVSpread: PokemonStatSpread | null = null;

  if(pokemonUsageData) {
    usageItemIdent = pokemonUsageData.items[0][0] as PokemonItemIdent;
    usageAbilityIdent = pokemonUsageData.abilities[0][0] as PokemonAbilityIdent;
    usageNatureIdent = pokemonUsageData.spreads[0][0] as PokemonNatureIdent;
    usageMoveIdents = [
      pokemonUsageData.moves[0][0] as PokemonMoveIdent,
      pokemonUsageData.moves[1][0] as PokemonMoveIdent,
      pokemonUsageData.moves[2][0] as PokemonMoveIdent,
      pokemonUsageData.moves[3][0] as PokemonMoveIdent
    ];
    const usageEVSpreadData = pokemonUsageData.spreads[0][1] as number[];
    usageEVSpread = {
      hp: usageEVSpreadData[0],
      attack: usageEVSpreadData[1],
      defense: usageEVSpreadData[2],
      special_attack: usageEVSpreadData[3],
      special_defense: usageEVSpreadData[4],
      speed: usageEVSpreadData[5],
    } as PokemonStatSpread;
  }

  const pokemonBuildTemplate: PokemonBuildTemplate = {
    pokemon_ident: pokemon.ident,
    nickname: null,
    item_ident: usageItemIdent ? usageItemIdent : null,
    ability_ident: usageAbilityIdent ? usageAbilityIdent : pokemon.ability_idents[0],
    level: 50,
    shiny: false,
    gender: pokemon.genders[0],
    tera_type_ident: pokemon.primary_type_ident,
    nature_ident: usageNatureIdent ? usageNatureIdent : "hardy",
    move_idents: usageMoveIdents ? usageMoveIdents : randomMoveIdents,
    iv_spread: {
      hp: 31,
      attack: 31,
      defense: 31,
      special_attack: 31,
      special_defense: 31,
      speed: 31
    },
    ev_spread: usageEVSpread ? usageEVSpread : defaultEVSpread
  }

  return pokemonBuildTemplateToPokemonBuild(pokemonBuildTemplate);
}

export const createDefaultPokemonBuildForPokemonIdent = (pokemonIdent: string): PokemonBuild => {
  const pokemonData: Pokemon = (allPokemon.find((pokemon: any) => { return pokemon.ident === pokemonIdent }) as Pokemon);
  return createDefaultPokemonBuildForPokemon(pokemonData);
}

export const pokemonBuildSerializeAPI = (pokemonBuild: PokemonBuild): Record<string, any> => {
  return {
    pokemon_ident: pokemonBuild.pokemon.ident,
    ability_ident: pokemonBuild.ability_ident,
    item_ident: pokemonBuild.item_ident,
    level: pokemonBuild.level,
    gender: pokemonBuild.gender,
    tera_type_ident: pokemonBuild.tera_type_ident,
    move_idents: pokemonBuild.move_idents,
    stat_spread: pokemonBuild.stat_spread
  }
}
