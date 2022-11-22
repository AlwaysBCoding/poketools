import { PokemonBuild } from "./PokemonBuild";
import { PokemonStatSpread } from "./PokemonShared";

export const calculateStats = (pokemonBuild: PokemonBuild): PokemonStatSpread => {

  const attack = Math.floor(Math.floor((((2 * 110) + 31 + Math.floor(252 / 4)) * 50) / 100) + 5);
  const defense = Math.floor(Math.floor((((2 * 70) + 31 + Math.floor(0 / 4)) * 50) / 100) + 5);
  const special_attack = Math.floor((Math.floor((((2 * 81) + 31 + Math.floor(0 / 4)) * 50) / 100) + 5) * 0.90);
  const special_defense = Math.floor(Math.floor((((2 * 70) + 31 + Math.floor(4 / 4)) * 50) / 100) + 5);
  const speed = Math.floor((Math.floor((((2 * 123) + 31 + Math.floor(252 / 4)) * 50) / 100) + 5) * 1.10);

  const hp = (Math.floor(Math.floor(((((2 * 76) + 31) + (0 / 4)) * 50) / 100) + 50) + 10);

  return {
    hp: hp,
    attack: attack,
    defense: defense,
    special_attack: special_attack,
    special_defense: special_defense,
    speed: speed
  };
};
