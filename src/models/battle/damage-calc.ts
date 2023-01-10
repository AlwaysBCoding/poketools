import { PokemonMoveIdent } from "../pokemon/PokemonShared";
import { BattleState } from "./BattleState";
import { PokemonBattleState, createDefaultPokemonBattleStateForPokemonIdent } from "./PokemonBattleState";
import { PokemonMoveSimple } from "../pokemon/PokemonMove";

import allMoves from "../../data/moves/all-moves.json";
import typeChart from "../../data/pokemon-type-effectiveness.json";

  const LIFE_ORB_MODIFIER = (5324/4096);
  const SPREAD_MODIFIER = (3072/4096);
  const CRITICAL_HIT_MODIFIER = (3/2);
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

const TYPE_ENHANCEMENT_ITEMS = [
  ['black-belt', 'fighting'],
  ['black-glasses', 'dark'],
  ['charcoal', 'fire'],
  ['dragon-fang', 'dragon'],
  ['hard-stone', 'rock'],
  ['magnet', 'electric'],
  ['metal-coat', 'steel'],
  ['miracle-seed', 'grass'],
  ['mystic-water', 'water'],
  ['never-melt-ice', 'ice'],
  ['poison-barb', 'poison'],
  ['sharp-beak', 'flying'],
  ['silk-scarf', 'normal'],
  ['silver-powder', 'bug'],
  ['soft-sand', 'ground'],
  ['spell-tag', 'ghost'],
  ['twisted-spoon', 'psychic']
];

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
  if(!pokemonMove) { return 0; }

  // DAMAGE CALC VALUES
  // =====================
  let STAB_MODIFIER = (6144/4096);
  let TERA_STAB_MODIFIER = (8192/4096);

  let aValue = 1;
  let dValue = 1;
  let stab = 1;
  let type = 1;
  let other = 1;
  let burn = 1;
  let spread = 1;
  let critical = 1;
  let weather = 1;

  const level = attackingPokemon.pokemon_build.level;
  let totalDamage = 0;

  // BASE POWER
  // =====================
  let power = 0;
  power = pokemonMove.base_power!;
  if(pokemonMove.ident === "acrobatics" && attackingPokemon.item_ident === null) { power = pokemonMove.base_power! * 2; }
  if(pokemonMove.ident === "knock-off" && targetPokemon.item_ident !== null) { power = pokemonMove.base_power! * 1.5; }

  for (const typeEnhancementItem of TYPE_ENHANCEMENT_ITEMS) {
    if(attackingPokemon.item_ident === typeEnhancementItem[0] && pokemonMove.type_ident === typeEnhancementItem[1]) {
      power = power * 1.2;
    }
  }

  // CRITICAL
  // =====================
  let isCriticalHit = false;
  let critStageIndex = attackingPokemon.stat_boosts.critical_hit;
  if(pokemonMove["critical_hit_stage_index"]) {
    critStageIndex = Math.min(critStageIndex + pokemonMove["critical_hit_stage_index"], 3);
  }
  const activeCritStage = CRITICAL_HIT_STAGES[critStageIndex];
  const critRoll = hardcodedCritRoll || hardcodedCritRoll === 0 ? (1 - hardcodedCritRoll) : (1 - Math.random());
  if(critRoll <= activeCritStage) {
    isCriticalHit = true;
    critical = CRITICAL_HIT_MODIFIER;
  }

  // SPREAD
  // =====================
  if(["all-adjacent", "all-enemies"].includes(`${pokemonMove.target}`) && hardcodedTargetingValue === "spread") {
    spread = SPREAD_MODIFIER;
  }

  // WEATHER
  // =====================
  if(battleState.global_state.weather === "sun") {
    if(pokemonMove.type_ident === "fire") {
      weather = 1.5
    } else if(pokemonMove.type_ident === "water") {
      weather = 0.5
    }
  } else if(battleState.global_state.weather === "rain") {
    if(pokemonMove.type_ident === "fire") {
      weather = 0.5
    } else if(pokemonMove.type_ident === "water") {
      weather = 1.5
    }
  }

  // RANDOM
  // =====================
  const random = hardcodedRandomRoll ? hardcodedRandomRoll : RANDOM_ROLLS[Math.floor(Math.random() * 16)];

  // BASE
  // =====================
  let attackStat = attackingPokemon.pokemon_build.stat_spread.attack;
  let attackMultipliers = STAT_STAGE_MULTIPLIERS[`${attackingPokemon.stat_boosts.attack}`];
  let defenseStat = targetPokemon.pokemon_build.stat_spread.defense;
  let defenseMultipliers = STAT_STAGE_MULTIPLIERS[`${targetPokemon.stat_boosts.defense}`];
  let specialAttackStat = attackingPokemon.pokemon_build.stat_spread.special_attack;
  let specialAttackMultipliers = STAT_STAGE_MULTIPLIERS[`${attackingPokemon.stat_boosts.special_attack}`];
  let specialDefenseStat = targetPokemon.pokemon_build.stat_spread.special_defense;
  let specialDefenseMultipliers = STAT_STAGE_MULTIPLIERS[`${targetPokemon.stat_boosts.special_defense}`];

  if(pokemonMove.ident === "body-press") {
    attackStat = attackingPokemon.pokemon_build.stat_spread.defense;
    attackMultipliers = STAT_STAGE_MULTIPLIERS[`${attackingPokemon.stat_boosts.defense}`];
  }
  if(pokemonMove.ident === "foul-play") {
    attackStat = targetPokemon.pokemon_build.stat_spread.attack;
    attackMultipliers = STAT_STAGE_MULTIPLIERS[`${targetPokemon.stat_boosts.attack}`];
  }
  if(pokemonMove.ident === "psyshock") {
    specialDefenseStat = targetPokemon.pokemon_build.stat_spread.defense;
    specialDefenseMultipliers = STAT_STAGE_MULTIPLIERS[`${targetPokemon.stat_boosts.defense}`];
  }

  if(attackingPokemon.ability_ident === "huge-power") {
    attackStat *= 2;
  }

  if(pokemonMove.category_ident === "physical") {
    aValue = attackStat * attackMultipliers;
    if(targetPokemon.item_ident === "eviolite" && targetPokemon.pokemon_build.pokemon.can_evolve) {
      dValue = defenseStat * defenseMultipliers * 1.5;
    } else {
      dValue = defenseStat * defenseMultipliers;
    }
  } else if(pokemonMove.category_ident === "special") {
    aValue = specialAttackStat * specialAttackMultipliers;
    if(targetPokemon.item_ident === "assault-vest" || (targetPokemon.item_ident === "eviolite" && targetPokemon.pokemon_build.pokemon.can_evolve)) {
      dValue = specialDefenseStat * specialDefenseMultipliers * 1.5;
    } else {
      dValue = specialDefenseStat * specialDefenseMultipliers;
    }
  }

  if(attackingPokemon.ability_ident === "blaze" && pokemonMove.type_ident === "fire" && (attackingPokemon.current_hp / attackingPokemon.pokemon_build.stat_spread.hp) <= (1/3)) {
    aValue *= 1.5;
  }
  if(attackingPokemon.ability_ident === "overgrow" && pokemonMove.type_ident === "grass" && (attackingPokemon.current_hp / attackingPokemon.pokemon_build.stat_spread.hp) <= (1/3)) {
    aValue *= 1.5;
  }
  if(attackingPokemon.ability_ident === "torrent" && pokemonMove.type_ident === "water" && (attackingPokemon.current_hp / attackingPokemon.pokemon_build.stat_spread.hp) <= (1/3)) {
    aValue *= 1.5;
  }

  // STAB
  // =====================
  if(attackingPokemon.ability_ident === "adaptability") {
    STAB_MODIFIER = 2;
    TERA_STAB_MODIFIER = 2.25;
  }
  if(attackingPokemon.terastallized) {
    if(attackingPokemon.pokemon_build.tera_type_ident === pokemonMove.type_ident) {
      if([attackingPokemon.pokemon_build.pokemon.primary_type_ident, attackingPokemon.pokemon_build.pokemon.secondary_type_ident].includes(pokemonMove.type_ident)) {
        stab = TERA_STAB_MODIFIER;
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

  // TYPE
  // =====================
  if(targetPokemon.terastallized) {
    let typeEffectiveness = typeChart.find((interaction) => { return interaction.offensive_type_ident === pokemonMove.type_ident && interaction.defensive_type_ident === targetPokemon.pokemon_build.tera_type_ident });
    if(pokemonMove.ident === "freeze-dry" && targetPokemon.pokemon_build.tera_type_ident === "water") {
      type = 2;
    } else if(targetPokemon.item_ident === "iron-ball" && targetPokemon.pokemon_build.tera_type_ident === "flying" && pokemonMove.type_ident === "ground" ) {
      type = 1;
    } else if(typeEffectiveness) { type = typeEffectiveness.effectiveness; }
  } else {
    let primaryTypeEffectiveness = typeChart.find((interaction) => { return interaction.offensive_type_ident === pokemonMove.type_ident && interaction.defensive_type_ident === targetPokemon.pokemon_build.pokemon.primary_type_ident });
    let secondaryTypeEffectiveness = typeChart.find((interaction) => { return interaction.offensive_type_ident === pokemonMove.type_ident && interaction.defensive_type_ident === targetPokemon.pokemon_build.pokemon.secondary_type_ident });

    if(pokemonMove.ident === "freeze-dry" && [targetPokemon.pokemon_build.pokemon.primary_type_ident, targetPokemon.pokemon_build.pokemon.secondary_type_ident].includes("water")) {
      if(targetPokemon.primary_type_ident === "water") {
        type = 2 * (secondaryTypeEffectiveness ? secondaryTypeEffectiveness.effectiveness : 1);
      } else if(targetPokemon.secondary_type_ident === "water") {
        type = 2 * (primaryTypeEffectiveness ? primaryTypeEffectiveness.effectiveness : 1);
      }
    } else if(targetPokemon.item_ident === "iron-ball" && [targetPokemon.pokemon_build.pokemon.primary_type_ident, targetPokemon.pokemon_build.pokemon.secondary_type_ident].includes("flying") && pokemonMove.type_ident === "ground") {
      type = 1;
    } else if(primaryTypeEffectiveness && secondaryTypeEffectiveness) {
      type = primaryTypeEffectiveness.effectiveness * secondaryTypeEffectiveness.effectiveness;
    } else if(primaryTypeEffectiveness) {
      type = primaryTypeEffectiveness.effectiveness;
    }
  }

  // BURN
  // =====================
  if(attackingPokemon.status === "burned" && pokemonMove.category_ident === "physical") {
    burn = BURN_MODIFIER;
  }

  // OTHER
  // =====================
  if(attackingPokemon.item_ident === "life-orb") {
    other = LIFE_ORB_MODIFIER;
  }

  if(targetPokemon.battle_side === "blue") {
    if(battleState.blue_side_state.reflect > 0 && pokemonMove.category_ident === "physical" && !isCriticalHit) {
      other *= 0.5;
    }
    if(battleState.blue_side_state.light_screen > 0 && pokemonMove.category_ident === "special" && !isCriticalHit) {
      other *= 0.5;
    }
  } else if(targetPokemon.battle_side === "red") {
    if(battleState.red_side_state.reflect > 0 && pokemonMove.category_ident === "physical" && !isCriticalHit) {
      other *= 0.5;
    }
    if(battleState.red_side_state.light_screen > 0 && pokemonMove.category_ident === "special" && !isCriticalHit) {
      other *= 0.5;
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
