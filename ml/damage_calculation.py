from helpers import find
from pprint import pprint

import math
import json
from pathlib import Path
import numpy as np

all_moves_file = open(Path("../src/data/moves/all-moves.json"))
all_moves_data = json.load(all_moves_file)
type_chart_file = open(Path("../src/data/pokemon-type-effectiveness.json"))
type_chart_data = json.load(type_chart_file)

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
  pokemon_move = find(all_moves_data, lambda x: x['ident'] == move_ident)

  LIFE_ORB_MODIFIER = (5324/4096)
  SPREAD_MODIFIER = (3072/4096)
  CRITICAL_HIT_MODIFIER = (3/2)
  STAB_MODIFIER = (6144/4096)
  TERA_STAB_MODIFIER = (8192/4096)
  BURN_MODIFIER = (2048/4096)

  RANDOM_ROLLS = [0.85, 0.86, 0.87, 0.88, 0.89, 0.90, 0.91, 0.92, 0.93, 0.94, 0.95, 0.96, 0.97, 0.98, 0.99, 1.00]
  CRITICAL_HIT_STAGES = [(1/24), (1/8), (1/2), 1]
  STAT_STAGE_MULTIPLIERS = {
    '-6': (2/8),
    '-5': (2/7),
    '-4': (2/6),
    '-3': (2/5),
    '-2': (2/4),
    '-1': (2/3),
    '0': (2/2),
    '1': (3/2),
    '2': (4/2),
    '3': (5/2),
    '4': (6/2),
    '5': (7/2),
    '6': (8/2)
  }

  TYPE_ENHANCEMENT_ITEMS = [
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
  ]

  # DAMAGE CALC VALUES
  # =====================
  a_value = 1
  d_value = 1
  stab = 1
  type_value = 1
  other = 1
  burn = 1
  spread = 1
  critical = 1
  weather = 1

  level = attacking_pokemon.pokemon_build.level
  total_damage = 0

  # BASE POWER
  # =====================
  power = 0
  if(pokemon_move):
    power = pokemon_move['base_power']

    if(pokemon_move['ident'] == 'acrobatics' and attacking_pokemon.item_ident == None):
      power *= 2
    if(pokemon_move['ident'] == 'knock-off' and target_pokemon.item_ident != None):
      power *= 1.5

  for type_enhancement_item in TYPE_ENHANCEMENT_ITEMS:
    if(attacking_pokemon.item_ident == type_enhancement_item[0] and pokemon_move['type_ident'] == type_enhancement_item[1]):
      power *= 1.2

  # CRITICAL
  # =====================
  is_critical_hit = False
  crit_stage_index = attacking_pokemon.stat_boosts.critical_hit
  if(pokemon_move.get('critical_hit_stage_index')):
    crit_stage_index = min(crit_stage_index + pokemon_move.get('critical_hit_stage_index'), 3)
  active_crit_stage = CRITICAL_HIT_STAGES[crit_stage_index]
  crit_roll = (1 - hardcoded_crit_roll) if hardcoded_crit_roll else (1 - hardcoded_crit_roll) if hardcoded_crit_roll == 0 else (1 - np.random.random())
  if(crit_roll <= active_crit_stage):
    is_critical_hit = True
    critical = CRITICAL_HIT_MODIFIER

  # SPREAD
  # =====================
  if(pokemon_move and hardcoded_targeting_value == "spread"):
    spread = SPREAD_MODIFIER

  # WEATHER
  # =====================
  if(battle_state.global_state.weather == "sun"):
    if(pokemon_move['type_ident'] == "fire"):
      weather = 1.5
    elif(pokemon_move['type_ident'] == "water"):
      weather = 0.5

  # RANDOM
  # =====================
  random = hardcoded_random_roll if hardcoded_random_roll else np.random.choice(RANDOM_ROLLS)

  # BASE
  # =====================
  attack_stat = attacking_pokemon.pokemon_build.stat_spread.attack
  attack_multipliers = STAT_STAGE_MULTIPLIERS[f"{attacking_pokemon.stat_boosts.attack}"]
  if(pokemon_move['ident'] == 'body-press'):
    attack_stat = attacking_pokemon.pokemon_build.stat_spread.defense
    attack_multipliers = STAT_STAGE_MULTIPLIERS[f"{attacking_pokemon.stat_boosts.defense}"]
  if(pokemon_move['ident'] == 'foul-play'):
    attack_stat = target_pokemon.pokemon_build.stat_spread.attack
    attack_multipliers = STAT_STAGE_MULTIPLIERS[f"{target_pokemon.stat_boosts.attack}"]
  if(attacking_pokemon.ability_ident == 'huge-power'):
    attack_stat *= 2

  if(pokemon_move['category_ident'] == 'physical'):
    a_value = attack_stat * attack_multipliers
    d_value = target_pokemon.pokemon_build.stat_spread.defense * STAT_STAGE_MULTIPLIERS[f"{target_pokemon.stat_boosts.attack}"]
  elif(pokemon_move['category_ident'] == 'special'):
    a_value = attacking_pokemon.pokemon_build.stat_spread.special_attack * STAT_STAGE_MULTIPLIERS[f"{attacking_pokemon.stat_boosts.special_attack}"]
    d_value = target_pokemon.pokemon_build.stat_spread.special_defense * STAT_STAGE_MULTIPLIERS[f"{target_pokemon.stat_boosts.special_defense}"]
    if(target_pokemon.item_ident == 'assault-vest' or (target_pokemon.item_ident == 'eviolite' and target_pokemon.pokemon_build.pokemon.can_evolve())):
      d_value *= 1.5

  if(attacking_pokemon.ability_ident == 'blaze' and pokemon_move['type_ident'] == 'fire' and attacking_pokemon.hp_percentage() <= (1/3)):
    a_value *= 1.5
  if(attacking_pokemon.ability_ident == 'overgrow' and pokemon_move['type_ident'] == 'grass' and attacking_pokemon.hp_percentage() <= (1/3)):
    a_value *= 1.5
  if(attacking_pokemon.ability_ident == 'torrent' and pokemon_move['type_ident'] == 'water' and attacking_pokemon.hp_percentage() <= (1/3)):
    a_value *= 1.5

  # STAB
  # =====================
  if(attacking_pokemon.ability_ident == 'adaptability'):
    STAB_MODIFIER = 2
    TERA_STAB_MODIFIER = 2.25

  if(attacking_pokemon.terastallized):
    if(attacking_pokemon.pokemon_build.tera_type_ident == pokemon_move['type_ident']):
      if(pokemon_move['type_ident'] in [attacking_pokemon.primary_type_ident, attacking_pokemon.secondary_type_ident]):
        stab = TERA_STAB_MODIFIER
      else:
        stab = STAB_MODIFIER
    else:
      if(pokemon_move['type_ident'] in [attacking_pokemon.primary_type_ident, attacking_pokemon.secondary_type_ident]):
        stab = STAB_MODIFIER
  else:
    if(pokemon_move['type_ident'] in [attacking_pokemon.primary_type_ident, attacking_pokemon.secondary_type_ident]):
      stab = STAB_MODIFIER

  # TYPE
  # =====================
  primary_type_effectiveness = find(type_chart_data, lambda x: x["offensive_type_ident"] == pokemon_move["type_ident"] and x["defensive_type_ident"] == target_pokemon.primary_type_ident)
  secondary_type_effectiveness = find(type_chart_data, lambda x: x["offensive_type_ident"] == pokemon_move["type_ident"] and x["defensive_type_ident"] == target_pokemon.secondary_type_ident)
  if(target_pokemon.item_ident == 'iron-ball' and 'flying' in [target_pokemon.primary_type_ident, target_pokemon.secondary_type_ident] and pokemon_move['type_ident'] == 'ground'):
    type_value = 1
  elif(primary_type_effectiveness and secondary_type_effectiveness):
    type_value = primary_type_effectiveness["effectiveness"] * secondary_type_effectiveness["effectiveness"]
  elif(primary_type_effectiveness):
    type_value = primary_type_effectiveness["effectiveness"]

  # BURN
  # =====================
  if(attacking_pokemon.status == "burned" and pokemon_move["category_ident"] == "physical"):
    burn = BURN_MODIFIER

  # OTHER
  # =====================
  if(attacking_pokemon.item_ident == "life-orb"):
    other *= LIFE_ORB_MODIFIER

  if(target_pokemon.battle_side == "blue"):
    if(battle_state.blue_side_state.reflect > 0 and pokemon_move['category_ident'] == 'physical' and not is_critical_hit):
      other *= 0.5
    if(battle_state.blue_side_state.light_screen > 0 and pokemon_move['category_ident'] == 'special' and not is_critical_hit):
      other *= 0.5
  elif(target_pokemon.battle_side == "red"):
    if(battle_state.red_side_state.reflect > 0 and pokemon_move['category_ident'] == 'physical' and not is_critical_hit):
      other *= 0.5
    if(battle_state.red_side_state.light_screen > 0 and pokemon_move['category_ident'] == 'special' and not is_critical_hit):
      other *= 0.5

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
