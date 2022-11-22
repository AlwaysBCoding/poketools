import { PokemonMoveIdent } from "../pokemon/PokemonShared";
import { BattleState } from "./BattleState";
import { PokemonBattleState } from "./PokemonBattleState";
import { PokemonMove } from "../pokemon/PokemonMove";

import allMoves from "../../data/moves/all-moves.json";
import typeChart from "../pokemon/pokemon-type-effectiveness.json";

const RANDOM_ROLLS = [0.85, 0.86, 0.87, 0.88, 0.89, 0.90, 0.91, 0.92, 0.93, 0.94, 0.95, 0.96, 0.97, 0.98, 0.99, 1.00];

export const calculateDamage = ((
  battleState: BattleState,
  attackingPokemon: PokemonBattleState,
  targetPokemon: PokemonBattleState,
  moveIdent: PokemonMoveIdent
): number => {

  const pokemonMove: PokemonMove = allMoves.find((move: any) => { return move.ident === moveIdent });
  var aValue;
  var dValue;
  var stab;
  var type;

  const level = attackingPokemon.pokemon_build.level;
  const power = pokemonMove.base_power;

  if(pokemonMove.category_ident === "physical") {
    aValue = attackingPokemon.pokemon_build.stat_spread.attack;
    dValue = targetPokemon.pokemon_build.stat_spread.defense;
  } else if(pokemonMove.category_ident === "special") {
    aValue = attackingPokemon.pokemon_build.stat_spread.special_attack;
    dValue = targetPokemon.pokemon_build.stat_spread.special_defense;
  }

  if([attackingPokemon.pokemon_build.pokemon.primary_type_ident, attackingPokemon.pokemon_build.pokemon.secondary_type_ident].includes(pokemonMove.type_ident)) {
    stab = 1.5;
  } else {
    stab = 1;
  }

  var primaryTypeEffectiveness = typeChart.find((interaction) => { return interaction.offensive_type_ident === pokemonMove.type_ident && interaction.defensive_type_ident === targetPokemon.pokemon_build.pokemon.primary_type_ident });
  var secondaryTypeEffectiveness = typeChart.find((interaction) => { return interaction.offensive_type_ident === pokemonMove.type_ident && interaction.defensive_type_ident === targetPokemon.pokemon_build.pokemon.secondary_type_ident });

  if(primaryTypeEffectiveness && secondaryTypeEffectiveness) {
    type = primaryTypeEffectiveness.effectiveness * secondaryTypeEffectiveness.effectiveness;
  } else if(primaryTypeEffectiveness) {
    type = primaryTypeEffectiveness.effectiveness;
  }

  const targets = 1;
  const weather = 1;
  const critical = 1;
  const random = RANDOM_ROLLS[Math.floor(Math.random() * 16)];
  const burn = 1;
  const other = 1;

  // const damageRolls = randomRolls.map((randomRoll) => {
  //   const baseDamage = (Math.floor(Math.floor(Math.floor(((2 * level) / 5) + 2) * power * (aValue / dValue)) / 50) + 2);
  //   return Math.floor(Math.floor(Math.floor(Math.floor(Math.floor(Math.floor(Math.floor(Math.floor(baseDamage * targets) * weather) * critical) * randomRoll) * stab) * type) * burn) * other);
  // });

  const baseDamage = (Math.floor(Math.floor(Math.floor(((2 * level) / 5) + 2) * power * (aValue / dValue)) / 50) + 2);
  return Math.floor(Math.floor(Math.floor(Math.floor(Math.floor(Math.floor(Math.floor(Math.floor(baseDamage * targets) * weather) * critical) * random) * stab) * type) * burn) * other);

});
