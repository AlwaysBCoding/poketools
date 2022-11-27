import { PokemonMoveIdent } from "../pokemon/PokemonShared";
import { BattleState } from "./BattleState";
import { PokemonBattleState } from "./PokemonBattleState";
import { PokemonMove } from "../pokemon/PokemonMove";

import allMoves from "../../data/moves/all-moves.json";
import typeChart from "../pokemon/pokemon-type-effectiveness.json";

const LIFE_ORB_MODIFIER = (5324/4096);
const SPREAD_MODIFIER = (3072/4096);
const CRITICAL_HIT_MODIFIER = (3/2);
const STAB_MODIFIER = (6144/4096);
const BURN_MODIFIER = (2048/4096);

const RANDOM_ROLLS = [0.85, 0.86, 0.87, 0.88, 0.89, 0.90, 0.91, 0.92, 0.93, 0.94, 0.95, 0.96, 0.97, 0.98, 0.99, 1.00];

const pokeRound = (x: number) => {
  if(x % 1 === 0.5) {
    return Math.floor(x);
  } else {
    return Math.round(x);
  }
}

export const calculateDamage = ((
  battleState: BattleState,
  attackingPokemon: PokemonBattleState,
  targetPokemon: PokemonBattleState,
  moveIdent: PokemonMoveIdent
): number => {

  const pokemonMove: PokemonMove = (allMoves.find((move: any) => { return move.ident === moveIdent }) as PokemonMove);
  var aValue = 1;
  var dValue = 1;
  var stab = 1;
  var type = 1;
  var other = 1;
  var burn = 1;

  var totalDamage = 0;

  const level = attackingPokemon.pokemon_build.level;

  if(pokemonMove.category_ident === "physical") {
    aValue = attackingPokemon.pokemon_build.stat_spread.attack;
    dValue = targetPokemon.pokemon_build.stat_spread.defense;
  } else if(pokemonMove.category_ident === "special") {
    aValue = attackingPokemon.pokemon_build.stat_spread.special_attack;
    if(targetPokemon.item_ident === "assault-vest") {
      dValue = targetPokemon.pokemon_build.stat_spread.special_defense * 1.5;
    } else {
      dValue = targetPokemon.pokemon_build.stat_spread.special_defense;
    }
  }

  if([attackingPokemon.pokemon_build.pokemon.primary_type_ident, attackingPokemon.pokemon_build.pokemon.secondary_type_ident].includes(pokemonMove.type_ident)) {
    stab = 1.5;
  }

  var primaryTypeEffectiveness = typeChart.find((interaction) => { return interaction.offensive_type_ident === pokemonMove.type_ident && interaction.defensive_type_ident === targetPokemon.pokemon_build.pokemon.primary_type_ident });
  var secondaryTypeEffectiveness = typeChart.find((interaction) => { return interaction.offensive_type_ident === pokemonMove.type_ident && interaction.defensive_type_ident === targetPokemon.pokemon_build.pokemon.secondary_type_ident });

  if(primaryTypeEffectiveness && secondaryTypeEffectiveness) {
    type = primaryTypeEffectiveness.effectiveness * secondaryTypeEffectiveness.effectiveness;
  } else if(primaryTypeEffectiveness) {
    type = primaryTypeEffectiveness.effectiveness;
  }

  const power = pokemonMove.base_power;
  const targets = 1;
  const weather = 1;
  const critical = 1;
  const random = RANDOM_ROLLS[Math.floor(Math.random() * 16)];

  if(attackingPokemon.status === "burned" && pokemonMove.category_ident === "physical") {
    burn = BURN_MODIFIER;
  }

  if(attackingPokemon.item_ident === "life-orb") {
    other = LIFE_ORB_MODIFIER;
  }

  // const damageRolls = randomRolls.map((randomRoll) => {
  //   const baseDamage = (Math.floor(Math.floor(Math.floor(((2 * level) / 5) + 2) * power * (aValue / dValue)) / 50) + 2);
  //   return Math.floor(Math.floor(Math.floor(Math.floor(Math.floor(Math.floor(Math.floor(Math.floor(baseDamage * targets) * weather) * critical) * randomRoll) * stab) * type) * burn) * other);
  // });

  if(power) {
    const baseDamage = Math.floor(Math.floor((Math.floor(((2 * level) / 5) + 2) * power * aValue) / dValue) / 50) + 2;
    const targetsModifier = pokeRound(baseDamage * targets);
    const weatherModifier = pokeRound(targetsModifier * weather);
    const criticalHitModifier = pokeRound(weatherModifier * critical);
    const randomModifier = Math.floor(criticalHitModifier * random);
    const stabModifier = pokeRound(randomModifier * stab);
    const typeModifier = Math.floor(stabModifier * type);
    const burnModifier = pokeRound(typeModifier * burn);
    const otherModifier = pokeRound(burnModifier * other);
    totalDamage = otherModifier;
  } else {
    totalDamage = 0;
  }

  return totalDamage;

});
