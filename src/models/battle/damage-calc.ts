import { PokemonMoveIdent } from "../pokemon/PokemonShared";
import { BattleState } from "./BattleState";
import { PokemonBattleState } from "./PokemonBattleState";
import { PokemonMoveSimple } from "../pokemon/PokemonMove";

import allMoves from "../../data/moves/all-moves.json";
import typeChart from "../../data/pokemon-type-effectiveness.json";

const LIFE_ORB_MODIFIER = (5324/4096);
const SPREAD_MODIFIER = (3072/4096);
const CRITICAL_HIT_MODIFIER = (3/2);
const STAB_MODIFIER = (6144/4096);
const BURN_MODIFIER = (2048/4096);

const RANDOM_ROLLS = [0.85, 0.86, 0.87, 0.88, 0.89, 0.90, 0.91, 0.92, 0.93, 0.94, 0.95, 0.96, 0.97, 0.98, 0.99, 1.00];
const CRITICAL_HIT_STAGES = [(1/24), (1/8), (1/2), 1];
const STAT_STAGE_MULTIPLIERS: Record<string, number> = {
  "-6": (2/8),
  "-5": (2/7),
  "-4": (2/6),
  "-3": (2/5),
  "-2": (2/4),
  "-1": (2/3),
  "0": (2/2),
  "1": (3/2),
  "2": (4/2),
  "3": (5/2),
  "4": (6/2),
  "5": (7/2),
  "6": (8/2)
}

const pokeRound = (x: number) => {
  if(x % 1 === 0.5) {
    return Math.floor(x);
  } else {
    return Math.round(x);
  }
}

interface DamageCalcParams {
  battleState: BattleState;
  attackingPokemon: PokemonBattleState;
  targetPokemon: PokemonBattleState;
  moveIdent: PokemonMoveIdent;
  hardcodedRandomRoll?: number;
  hardcodedCritRoll?: number;
  hardcodedTargetingValue?: string;
}

export const calculateDamage = ({
  battleState,
  attackingPokemon,
  targetPokemon,
  moveIdent,
  hardcodedRandomRoll,
  hardcodedCritRoll,
  hardcodedTargetingValue,
}: DamageCalcParams): number => {

  const pokemonMove: PokemonMoveSimple = (allMoves.find((move: any) => { return move.ident === moveIdent }) as PokemonMoveSimple);
  let aValue = 1;
  let dValue = 1;
  let stab = 1;
  let type = 1;
  let other = 1;
  let burn = 1;
  let spread = 1;
  let critical = 1;
  let weather = 1;

  let power = 0;
  if(pokemonMove && pokemonMove.base_power) { power = pokemonMove.base_power; }
  if(pokemonMove && pokemonMove.ident === "acrobatics" && attackingPokemon.item_ident === null) { power = pokemonMove.base_power! * 2; }

  let isCriticalHit = false;
  let activeCritStage = CRITICAL_HIT_STAGES[0];
  const critRoll = hardcodedCritRoll || hardcodedCritRoll === 0 ? (1 - hardcodedCritRoll) : (1 - Math.random());
  if(critRoll <= activeCritStage) {
    isCriticalHit = true;
    critical = CRITICAL_HIT_MODIFIER;
  }

  if(pokemonMove && ["all-adjacent", "all-enemies"].includes(`${pokemonMove.target}`) && hardcodedTargetingValue === "spread") {
    spread = SPREAD_MODIFIER;
  }

  // WEATHER
  // =====================
  if(pokemonMove) {
    if(battleState.global_state.weather === "sun") {
      if(pokemonMove.type_ident === "fire") {
        weather = 1.5
      } else if(pokemonMove.type_ident === "water") {
        weather = 0.5
      }
    }
  }

  const random = hardcodedRandomRoll ? hardcodedRandomRoll : RANDOM_ROLLS[Math.floor(Math.random() * 16)];
  const level = attackingPokemon.pokemon_build.level;

  let totalDamage = 0;

  if(pokemonMove && pokemonMove.category_ident) {
    if(pokemonMove.category_ident === "physical") {
      aValue = attackingPokemon.pokemon_build.stat_spread.attack * STAT_STAGE_MULTIPLIERS[`${attackingPokemon.stat_boosts["attack"]}`];
      if(targetPokemon.item_ident === "eviolite" && targetPokemon.pokemon_build.pokemon.can_evolve) {
        dValue = targetPokemon.pokemon_build.stat_spread.defense * 1.5 * STAT_STAGE_MULTIPLIERS[`${targetPokemon.stat_boosts["defense"]}`];
      } else {
        dValue = targetPokemon.pokemon_build.stat_spread.defense * STAT_STAGE_MULTIPLIERS[`${targetPokemon.stat_boosts["defense"]}`];
      }
    } else if(pokemonMove.category_ident === "special") {
      aValue = attackingPokemon.pokemon_build.stat_spread.special_attack * STAT_STAGE_MULTIPLIERS[`${attackingPokemon.stat_boosts["special_attack"]}`];
      if(targetPokemon.item_ident === "assault-vest" || (targetPokemon.item_ident === "eviolite" && targetPokemon.pokemon_build.pokemon.can_evolve)) {
        dValue = targetPokemon.pokemon_build.stat_spread.special_defense * 1.5 * STAT_STAGE_MULTIPLIERS[`${targetPokemon.stat_boosts["special_defense"]}`];
      } else {
        dValue = targetPokemon.pokemon_build.stat_spread.special_defense * STAT_STAGE_MULTIPLIERS[`${targetPokemon.stat_boosts["special_defense"]}`];
      }
    }
  }

  if(pokemonMove && pokemonMove.type_ident) {

    if(attackingPokemon.terastallized) {
      if(attackingPokemon.pokemon_build.tera_type_ident === pokemonMove.type_ident) {
        if([attackingPokemon.pokemon_build.pokemon.primary_type_ident, attackingPokemon.pokemon_build.pokemon.secondary_type_ident].includes(pokemonMove.type_ident)) {
          stab = 2;
        } else {
          stab = STAB_MODIFIER;
        }
      } else {
        if([attackingPokemon.pokemon_build.pokemon.primary_type_ident, attackingPokemon.pokemon_build.pokemon.secondary_type_ident].includes(pokemonMove.type_ident)) {
          stab = STAB_MODIFIER;
        }
      }
    } else {
      if([attackingPokemon.pokemon_build.pokemon.primary_type_ident, attackingPokemon.pokemon_build.pokemon.secondary_type_ident].includes(pokemonMove.type_ident)) {
        stab = STAB_MODIFIER;
      }
    }

    if(targetPokemon.terastallized) {
      let typeEffectiveness = typeChart.find((interaction) => { return interaction.offensive_type_ident === pokemonMove.type_ident && interaction.defensive_type_ident === targetPokemon.pokemon_build.tera_type_ident });
      if(targetPokemon.item_ident === "iron-ball" && targetPokemon.pokemon_build.tera_type_ident === "flying" && pokemonMove.type_ident === "ground" ) {
        type = 1;
      } else if(typeEffectiveness) { type = typeEffectiveness.effectiveness; }
    } else {
      let primaryTypeEffectiveness = typeChart.find((interaction) => { return interaction.offensive_type_ident === pokemonMove.type_ident && interaction.defensive_type_ident === targetPokemon.pokemon_build.pokemon.primary_type_ident });
      let secondaryTypeEffectiveness = typeChart.find((interaction) => { return interaction.offensive_type_ident === pokemonMove.type_ident && interaction.defensive_type_ident === targetPokemon.pokemon_build.pokemon.secondary_type_ident });

      if(targetPokemon.item_ident === "iron-ball" && [targetPokemon.pokemon_build.pokemon.primary_type_ident, targetPokemon.pokemon_build.pokemon.secondary_type_ident].includes("flying") && pokemonMove.type_ident === "ground") {
        type = 1;
      } else if(primaryTypeEffectiveness && secondaryTypeEffectiveness) {
        type = primaryTypeEffectiveness.effectiveness * secondaryTypeEffectiveness.effectiveness;
      } else if(primaryTypeEffectiveness) {
        type = primaryTypeEffectiveness.effectiveness;
      }
    }

  }

  // STATUS
  if(attackingPokemon.status === "burned" && pokemonMove.category_ident === "physical") {
    burn = BURN_MODIFIER;
  }

  // ITEMS
  if(attackingPokemon.item_ident === "life-orb") {
    other = LIFE_ORB_MODIFIER;
  }
  // 1.2x type enhancement items
  const typeEnhancementItems = [
    ["black-belt", "fighting"],
    ["black-glasses", "dark"],
    ["charcoal", "fire"],
    ["dragon-fang", "dragon"],
    ["hard-stone", "rock"],
    ["magnet", "electric"],
    ["metal-coat", "steel"],
    ["miracle-seed", "grass"],
    ["mystic-water", "water"],
    ["never-melt-ice", "ice"],
    ["poison-barb", "poison"],
    ["sharp-beak", "flying"],
    ["silk-scarf", "normal"],
    ["silver-powder", "bug"],
    ["soft-sand", "ground"],
    ["spell-tag", "ghost"],
    ["twisted-spoon", "psychic"]
  ];
  for (const typeEnhancementItem of typeEnhancementItems) {
    if(attackingPokemon.item_ident === typeEnhancementItem[0] && pokemonMove.type_ident === typeEnhancementItem[1]) {
      power = power * 1.2;
    }
  }

  if(power) {
    const baseDamage = Math.floor(Math.floor((Math.floor(((2 * level) / 5) + 2) * power * aValue) / dValue) / 50) + 2;
    const targetsModifier = pokeRound(baseDamage * spread);
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

};
