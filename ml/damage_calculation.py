from helpers import find

import math
import json
from pathlib import Path
import numpy as np

all_moves_file = open(Path("../src/data/moves/all-moves.json"))
all_moves_data = json.load(all_moves_file)
type_chart_file = open(Path("../src/data/pokemon-type-effectiveness.json"))
type_chart_data = json.load(type_chart_file)

LIFE_ORB_MODIFIER = (5324/4096)
SPREAD_MODIFIER = (3072/4096)
CRITICAL_HIT_MODIFIER = (3/2)
STAB_MODIFIER = (6144/4096)
BURN_MODIFIER = (2048/4096)

RANDOM_ROLLS = [0.85, 0.86, 0.87, 0.88, 0.89, 0.90, 0.91, 0.92, 0.93, 0.94, 0.95, 0.96, 0.97, 0.98, 0.99, 1.00]
CRITICAL_HIT_STAGES = [(1/24), (1/8), (1/2), 1]
STAT_STAGE_MULTIPLIERS = {
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

def poke_round(x):
  if(x % 1 == 0.5):
    return math.floor(x)
  else:
    return round(x)

def calculate_damage(
  battle_state,
  attacking_pokemon,
  target_pokemon,
  move_ident,
  hardcoded_random_roll=None,
  hardcoded_crit_roll=None,
  hardcoded_targeting_value=None
):
  pokemon_move = find(all_moves_data, lambda x: x["ident"] == move_ident)

  a_value = 1
  d_value = 1
  stab = 1
  type_value = 1
  other = 1
  burn = 1
  spread = 1
  critical = 1

  power = 0
  if(pokemon_move):
    power = pokemon_move["base_power"]
  if(pokemon_move and pokemon_move["ident"] == "acrobatics" and attacking_pokemon["item_ident"] == None):
    power = pokemon_move["base_power"] * 2

  is_critical_hit = False
  active_crit_stage = CRITICAL_HIT_STAGES[0]
  crit_roll = (1 - hardcoded_crit_roll) if hardcoded_crit_roll else (1 - hardcoded_crit_roll) if hardcoded_crit_roll == 0 else (1 - np.random.random())
  if(crit_roll <= active_crit_stage):
    is_critical_hit = True
    critical = CRITICAL_HIT_MODIFIER

  if(pokemon_move and hardcoded_targeting_value == "spread"):
    spread = SPREAD_MODIFIER

  weather = 1
  random = hardcoded_random_roll if hardcoded_random_roll else np.random.choice(RANDOM_ROLLS)
  level = attacking_pokemon.pokemon_build.level

  total_damage = 0

  if(pokemon_move["category_ident"] == "physical"):
    a_value = attacking_pokemon.pokemon_build.stat_spread.attack * STAT_STAGE_MULTIPLIERS[f"{attacking_pokemon.stat_boosts.attack}"]
    d_value = target_pokemon.pokemon_build.stat_spread.defense * STAT_STAGE_MULTIPLIERS[f"{target_pokemon.stat_boosts.attack}"]
  elif(pokemon_move["category_ident"] == "special"):
    a_value = attacking_pokemon.pokemon_build.stat_spread.special_attack * STAT_STAGE_MULTIPLIERS[f"{attacking_pokemon.stat_boosts.special_attack}"]
    d_value = target_pokemon.pokemon_build.stat_spread.special_defense * STAT_STAGE_MULTIPLIERS[f"{target_pokemon.stat_boosts.special_defense}"]

  if(attacking_pokemon.primary_type_ident == pokemon_move["type_ident"]):
    stab = STAB_MODIFIER

  primary_type_effectiveness = find(type_chart_data, lambda x: x["offensive_type_ident"] == pokemon_move["type_ident"] and x["defensive_type_ident"] == target_pokemon.primary_type_ident)
  secondary_type_effectiveness = find(type_chart_data, lambda x: x["offensive_type_ident"] == pokemon_move["type_ident"] and x["defensive_type_ident"] == target_pokemon.secondary_type_ident)
  if(primary_type_effectiveness and secondary_type_effectiveness):
    type_value = primary_type_effectiveness["effectiveness"] * secondary_type_effectiveness["effectiveness"]
  elif(primary_type_effectiveness):
    type_value = primary_type_effectiveness["effectiveness"]

  if(attacking_pokemon.status == "burned" and pokemon_move["category_ident"] == "physical"):
    burn = BURN_MODIFIER

  if(attacking_pokemon.item_ident == "life-orb"):
    other = LIFE_ORB_MODIFIER

  if(power):
    base_damage = math.floor(math.floor((math.floor(((2 * level) / 5) + 2) * power * a_value) / d_value) / 50) + 2
    targets_modifier = poke_round(base_damage * spread)
    weather_modifier = poke_round(targets_modifier * weather)
    critical_hit_modifier = poke_round(weather_modifier * critical)
    random_modifier = math.floor(critical_hit_modifier * random)
    stab_modifier = poke_round(random_modifier * stab)
    type_modifier = math.floor(stab_modifier * type_value)
    burn_modifier = poke_round(type_modifier * burn)
    other_modifier = poke_round(burn_modifier * other)
    total_damage = other_modifier
  else:
    total_damage = 0

  return total_damage
