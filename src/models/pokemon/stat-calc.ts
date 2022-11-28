import { Pokemon } from "./Pokemon";
import { PokemonBuildTemplate } from "./PokemonBuildTemplate";
import { PokemonStatSpread } from "./PokemonShared";
import allPokemon from "../../data/pokemon/all-pokemon.json";


export const calculateStatSpread = (pokemonBuildTemplate: PokemonBuildTemplate): PokemonStatSpread => {

  const pokemonData: Pokemon = (allPokemon.find((pokemon: any) => { return pokemon.ident === pokemonBuildTemplate.pokemon_ident; }) as Pokemon);

  const attack = Math.floor((((2 * pokemonData.base_stats.attack) + pokemonBuildTemplate.iv_spread.attack + Math.floor(pokemonBuildTemplate.ev_spread.attack / 4)) * pokemonBuildTemplate.level) / 100) + 5;
  const defense = Math.floor((((2 * pokemonData.base_stats.defense) + pokemonBuildTemplate.iv_spread.defense + Math.floor(pokemonBuildTemplate.ev_spread.defense / 4)) * pokemonBuildTemplate.level) / 100) + 5;
  const special_attack = Math.floor((((2 * pokemonData.base_stats.special_attack) + pokemonBuildTemplate.iv_spread.special_attack + Math.floor(pokemonBuildTemplate.ev_spread.special_attack / 4)) * pokemonBuildTemplate.level) / 100) + 5;
  const special_defense = Math.floor((((2 * pokemonData.base_stats.special_defense) + pokemonBuildTemplate.iv_spread.special_defense + Math.floor(pokemonBuildTemplate.ev_spread.special_defense / 4)) * pokemonBuildTemplate.level) / 100) + 5;
  const speed = Math.floor((((2 * pokemonData.base_stats.speed) + pokemonBuildTemplate.iv_spread.speed + Math.floor(pokemonBuildTemplate.ev_spread.speed / 4)) * pokemonBuildTemplate.level) / 100) + 5;
  const hp = Math.floor(((((2 * pokemonData.base_stats.hp) + pokemonBuildTemplate.iv_spread.hp) + Math.floor(pokemonBuildTemplate.ev_spread.hp / 4)) * pokemonBuildTemplate.level) / 100) + pokemonBuildTemplate.level + 10;

  const statSpread = {
    hp: hp,
    attack: attack,
    defense: defense,
    special_attack: special_attack,
    special_defense: special_defense,
    speed: speed
  };

  switch(pokemonBuildTemplate.nature_ident) {
    case "adamant":
      statSpread.attack = Math.floor(statSpread.attack * 1.10);
      statSpread.special_attack = Math.floor(statSpread.special_attack * 0.90);
      break;
    case "bashful":
      break;
    case "bold":
      statSpread.defense = Math.floor(statSpread.defense * 1.10);
      statSpread.attack = Math.floor(statSpread.attack * 0.90);
      break;
    case "brave":
      statSpread.attack = Math.floor(statSpread.attack * 1.10);
      statSpread.speed = Math.floor(statSpread.speed * 0.90);
      break;
    case "calm":
      statSpread.special_defense = Math.floor(statSpread.special_defense * 1.10);
      statSpread.attack = Math.floor(statSpread.attack * 0.90);
      break;
    case "careful":
      statSpread.special_defense = Math.floor(statSpread.special_defense * 1.10);
      statSpread.special_attack = Math.floor(statSpread.special_attack * 0.90);
      break;
    case "docile":
      break;
    case "gentle":
      statSpread.special_defense = Math.floor(statSpread.special_defense * 1.10);
      statSpread.defense = Math.floor(statSpread.defense * 0.90);
      break;
    case "hardy":
      break;
    case "hasty":
      statSpread.speed = Math.floor(statSpread.speed * 1.10);
      statSpread.defense = Math.floor(statSpread.defense * 0.90);
      break;
    case "impish":
      statSpread.defense = Math.floor(statSpread.defense * 1.10);
      statSpread.special_attack = Math.floor(statSpread.special_attack * 0.90);
      break;
    case "jolly":
      statSpread.speed = Math.floor(statSpread.speed * 1.10);
      statSpread.special_attack = Math.floor(statSpread.special_attack * 0.90);
      break;
    case "lax":
      statSpread.defense = Math.floor(statSpread.defense * 1.10);
      statSpread.special_defense = Math.floor(statSpread.special_defense * 0.90);
      break;
    case "lonely":
      statSpread.attack = Math.floor(statSpread.attack * 1.10);
      statSpread.defense = Math.floor(statSpread.defense * 0.90);
      break;
    case "mild":
      statSpread.special_attack = Math.floor(statSpread.special_attack * 1.10);
      statSpread.defense = Math.floor(statSpread.defense * 0.90);
      break;
    case "modest":
      statSpread.special_attack = Math.floor(statSpread.special_attack * 1.10);
      statSpread.attack = Math.floor(statSpread.attack * 0.90);
      break;
    case "naive":
      statSpread.speed = Math.floor(statSpread.speed * 1.10);
      statSpread.special_defense = Math.floor(statSpread.special_defense * 0.90);
      break;
    case "naughty":
      statSpread.attack = Math.floor(statSpread.attack * 1.10);
      statSpread.special_defense = Math.floor(statSpread.special_defense * 0.90);
      break;
    case "quiet":
      statSpread.special_attack = Math.floor(statSpread.special_attack * 1.10);
      statSpread.speed = Math.floor(statSpread.speed * 0.90);
      break;
    case "quirky":
      break;
    case "rash":
      statSpread.special_attack = Math.floor(statSpread.special_attack * 1.10);
      statSpread.special_defense = Math.floor(statSpread.special_defense * 0.90);
      break;
    case "relaxed":
      statSpread.defense = Math.floor(statSpread.defense * 1.10);
      statSpread.speed = Math.floor(statSpread.speed * 0.90);
      break;
    case "sassy":
      statSpread.special_defense = Math.floor(statSpread.special_defense * 1.10);
      statSpread.speed = Math.floor(statSpread.speed * 0.90);
      break;
    case "serious":
      break;
    case "timid":
      statSpread.speed = Math.floor(statSpread.speed * 1.10);
      statSpread.attack = Math.floor(statSpread.attack * 0.90);
      break;
    default:
      break;
  }

  return statSpread;
};
