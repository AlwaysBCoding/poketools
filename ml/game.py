from models.pokemon import Pokemon, PokemonStatSpread
from models.pokemon_build import PokemonBuild
from models.pokemon_battle_state import PokemonBattleState
from mappings import type_ident_mapping, ability_ident_mapping, item_ident_mapping, status_ident_mapping, location_ident_mapping

from models.battle import Battle

import numpy as np
from pathlib import Path
import json
import ipdb

gastrodon_f = open(Path("../src/data/pokemon/paldea/328-gastrodon/gastrodon.data.json"))
gastrodon_data = json.load(gastrodon_f)
gastrodon = Pokemon(gastrodon_data)
gastrodon_build = PokemonBuild(
  pokemon=gastrodon,
  item_ident="leftovers",
  ability_ident="storm-drain",
  level=50,
  gender="male",
  tera_type_ident="flying",
  move_idents=["clear-smog", "earth-power", "ice-beam", "hydro-pump"],
  stat_spread=PokemonStatSpread(hp=218, attack=92, defense=88, special_attack=128, special_defense=130, speed=59)
)
gastrodon_battle_state = PokemonBattleState(gastrodon_build, "blue")

garchomp_f = open(Path("../src/data/pokemon/paldea/128-garchomp/garchomp.data.json"))
garchomp_data = json.load(garchomp_f)
garchomp = Pokemon(garchomp_data)
garchomp_build = PokemonBuild(
  pokemon=garchomp,
  item_ident="life-orb",
  ability_ident="rough-skin",
  level=50,
  gender="male",
  tera_type_ident="fire",
  move_idents=["dragon-claw", "earthquake", "bite", "fire-fang"],
  stat_spread=PokemonStatSpread(hp=183, attack=200, defense=115, special_attack=90, special_defense=105, speed=154)
)
garchomp_battle_state = PokemonBattleState(garchomp_build, "red")

talonflame_f = open(Path("../src/data/pokemon/paldea/21-talonflame/talonflame.data.json"))
talonflame_data = json.load(talonflame_f)
talonflame = Pokemon(talonflame_data)
talonflame_build = PokemonBuild(
  pokemon=talonflame,
  item_ident="sharp-beak",
  ability_ident="gale-wings",
  level=50,
  gender="male",
  tera_type_ident="flying",
  move_idents=["tailwind", "brave-bird", "flare-blitz", "feint"],
  stat_spread=PokemonStatSpread(hp=153, attack=146, defense=91, special_attack=84, special_defense=89, speed=178)
)
talonflame_battle_state = PokemonBattleState(talonflame_build, "blue")

gholdengo_f = open(Path("../src/data/pokemon/paldea/392-gholdengo/gholdengo.data.json"))
gholdengo_data = json.load(gholdengo_f)
gholdengo = Pokemon(gholdengo_data)
gholdengo_build = PokemonBuild(
  pokemon=gholdengo,
  item_ident="focus-sash",
  ability_ident="good-as-gold",
  level=50,
  gender="genderless",
  tera_type_ident="flying",
  move_idents=["thunderbolt", "shadow-ball", "make-it-rain", "nasty-plot"],
  stat_spread=PokemonStatSpread(hp=162, attack=72, defense=115, special_attack=185, special_defense=112, speed=149)
)
gholdengo_battle_state = PokemonBattleState(gholdengo_build, "red")

tsareena_f = open(Path("../src/data/pokemon/paldea/83-tsareena/tsareena.data.json"))
tsareena_data = json.load(tsareena_f)
tsareena = Pokemon(tsareena_data)
tsareena_build = PokemonBuild(
  pokemon=tsareena,
  item_ident="choice-scarf",
  ability_ident="queenly-majesty",
  level=50,
  gender="female",
  tera_type_ident="grass",
  move_idents=["power-whip", "u-turn", "low-sweep", "play-rough"],
  stat_spread=PokemonStatSpread(hp=152, attack=172, defense=118, special_attack=63, special_defense=118, speed=132)
)
tsareena_battle_state = PokemonBattleState(tsareena_build, "blue")

grimmsnarl_f = open(Path("../src/data/pokemon/paldea/287-grimmsnarl/grimmsnarl.data.json"))
grimmsnarl_data = json.load(grimmsnarl_f)
grimmsnarl = Pokemon(grimmsnarl_data)
grimmsnarl_build = PokemonBuild(
  pokemon=grimmsnarl,
  item_ident="iron-ball",
  ability_ident="prankster",
  level=50,
  gender="male",
  tera_type_ident="steel",
  move_idents=["fake-out", "sucker-punch", "spirit-break", "ice-punch"],
  stat_spread=PokemonStatSpread(hp=195, attack=171, defense=85, special_attack=103, special_defense=111, speed=80)
)
grimmsnarl_battle_state = PokemonBattleState(grimmsnarl_build, "red")

class Game():
  def __init__(self):
    self.reward = 0
    self.done = 0

  def reset(self):
    self.reward = 0
    self.done = 0

    blue_side_pokemon = [talonflame_battle_state, tsareena_battle_state, gastrodon_battle_state]
    blue_side_pokemon_order = [0, 1, 2]
    np.random.shuffle(blue_side_pokemon_order)
    red_side_pokemon = [garchomp_battle_state, grimmsnarl_battle_state, gholdengo_battle_state]
    red_side_pokemon_order = [0, 1, 2]
    np.random.shuffle(red_side_pokemon_order)

    self.battle_config = {
      "variant": "singles"
    }
    self.battle = Battle(self.battle_config, blue_side_pokemon, red_side_pokemon, blue_side_pokemon_order, red_side_pokemon_order)

    try:
      for x in range(100):
        if(self.battle.status == "complete"):
          break
        print(f"TURN {x + 1}")
        blue_field_pokemon = self.battle.field_pokemon("blue")
        red_field_pokemon = self.battle.field_pokemon("red")
        blue_pokemon_actions = self.battle.available_actions_for_pokemon_battle_state(blue_field_pokemon.id)
        red_pokemon_actions = self.battle.available_actions_for_pokemon_battle_state(red_field_pokemon.id)

        self.battle.step([np.random.choice(blue_pokemon_actions)], [np.random.choice(red_pokemon_actions)])
    except Exception as e:
      ipdb.set_trace()

    return [
      np.float32(self.battle.battle_state.blue_side_pokemon[0].pokemon_build.pokemon.paldea_regional_pokedex_number),
      np.float32(type_ident_mapping(self.battle.battle_state.blue_side_pokemon[0].primary_type_ident)),
      np.float32(type_ident_mapping(self.battle.battle_state.blue_side_pokemon[0].secondary_type_ident)),
      np.float32(ability_ident_mapping(self.battle.battle_state.blue_side_pokemon[0].ability_ident)),
      np.float32(item_ident_mapping(self.battle.battle_state.blue_side_pokemon[0].item_ident)),
      np.float32(status_ident_mapping(self.battle.battle_state.blue_side_pokemon[0].status)),
      np.float32(self.battle.battle_state.blue_side_pokemon[0].stat_boosts.attack),
      np.float32(self.battle.battle_state.blue_side_pokemon[0].stat_boosts.defense),
      np.float32(self.battle.battle_state.blue_side_pokemon[0].stat_boosts.special_attack),
      np.float32(self.battle.battle_state.blue_side_pokemon[0].stat_boosts.special_defense),
      np.float32(self.battle.battle_state.blue_side_pokemon[0].stat_boosts.speed),
      np.float32(self.battle.battle_state.blue_side_pokemon[0].current_hp),
      np.float32(self.battle.battle_state.blue_side_pokemon[0].pokemon_build.stat_spread.hp),
      np.float32(location_ident_mapping(self.battle.battle_state.blue_side_pokemon[0].location_ident)),
      np.float32(self.battle.battle_state.blue_side_pokemon[1].pokemon_build.pokemon.paldea_regional_pokedex_number),
      np.float32(type_ident_mapping(self.battle.battle_state.blue_side_pokemon[1].primary_type_ident)),
      np.float32(type_ident_mapping(self.battle.battle_state.blue_side_pokemon[1].secondary_type_ident)),
      np.float32(ability_ident_mapping(self.battle.battle_state.blue_side_pokemon[1].ability_ident)),
      np.float32(item_ident_mapping(self.battle.battle_state.blue_side_pokemon[1].item_ident)),
      np.float32(status_ident_mapping(self.battle.battle_state.blue_side_pokemon[1].status)),
      np.float32(self.battle.battle_state.blue_side_pokemon[1].stat_boosts.attack),
      np.float32(self.battle.battle_state.blue_side_pokemon[1].stat_boosts.defense),
      np.float32(self.battle.battle_state.blue_side_pokemon[1].stat_boosts.special_attack),
      np.float32(self.battle.battle_state.blue_side_pokemon[1].stat_boosts.special_defense),
      np.float32(self.battle.battle_state.blue_side_pokemon[1].stat_boosts.speed),
      np.float32(self.battle.battle_state.blue_side_pokemon[1].current_hp),
      np.float32(self.battle.battle_state.blue_side_pokemon[1].pokemon_build.stat_spread.hp),
      np.float32(location_ident_mapping(self.battle.battle_state.blue_side_pokemon[1].location_ident)),
      np.float32(self.battle.battle_state.blue_side_pokemon[2].pokemon_build.pokemon.paldea_regional_pokedex_number),
      np.float32(type_ident_mapping(self.battle.battle_state.blue_side_pokemon[2].primary_type_ident)),
      np.float32(type_ident_mapping(self.battle.battle_state.blue_side_pokemon[2].secondary_type_ident)),
      np.float32(ability_ident_mapping(self.battle.battle_state.blue_side_pokemon[2].ability_ident)),
      np.float32(item_ident_mapping(self.battle.battle_state.blue_side_pokemon[2].item_ident)),
      np.float32(status_ident_mapping(self.battle.battle_state.blue_side_pokemon[2].status)),
      np.float32(self.battle.battle_state.blue_side_pokemon[2].stat_boosts.attack),
      np.float32(self.battle.battle_state.blue_side_pokemon[2].stat_boosts.defense),
      np.float32(self.battle.battle_state.blue_side_pokemon[2].stat_boosts.special_attack),
      np.float32(self.battle.battle_state.blue_side_pokemon[2].stat_boosts.special_defense),
      np.float32(self.battle.battle_state.blue_side_pokemon[2].stat_boosts.speed),
      np.float32(self.battle.battle_state.blue_side_pokemon[2].current_hp),
      np.float32(self.battle.battle_state.blue_side_pokemon[2].pokemon_build.stat_spread.hp),
      np.float32(location_ident_mapping(self.battle.battle_state.blue_side_pokemon[2].location_ident)),
      np.float32(self.battle.battle_state.red_side_pokemon[0].pokemon_build.pokemon.paldea_regional_pokedex_number),
      np.float32(type_ident_mapping(self.battle.battle_state.red_side_pokemon[0].primary_type_ident)),
      np.float32(type_ident_mapping(self.battle.battle_state.red_side_pokemon[0].secondary_type_ident)),
      np.float32(ability_ident_mapping(self.battle.battle_state.red_side_pokemon[0].ability_ident)),
      np.float32(item_ident_mapping(self.battle.battle_state.red_side_pokemon[0].item_ident)),
      np.float32(status_ident_mapping(self.battle.battle_state.red_side_pokemon[0].status)),
      np.float32(self.battle.battle_state.red_side_pokemon[0].stat_boosts.attack),
      np.float32(self.battle.battle_state.red_side_pokemon[0].stat_boosts.defense),
      np.float32(self.battle.battle_state.red_side_pokemon[0].stat_boosts.special_attack),
      np.float32(self.battle.battle_state.red_side_pokemon[0].stat_boosts.special_defense),
      np.float32(self.battle.battle_state.red_side_pokemon[0].stat_boosts.speed),
      np.float32(self.battle.battle_state.red_side_pokemon[0].current_hp),
      np.float32(self.battle.battle_state.red_side_pokemon[0].pokemon_build.stat_spread.hp),
      np.float32(location_ident_mapping(self.battle.battle_state.red_side_pokemon[0].location_ident)),
      np.float32(self.battle.battle_state.red_side_pokemon[1].pokemon_build.pokemon.paldea_regional_pokedex_number),
      np.float32(type_ident_mapping(self.battle.battle_state.red_side_pokemon[1].primary_type_ident)),
      np.float32(type_ident_mapping(self.battle.battle_state.red_side_pokemon[1].secondary_type_ident)),
      np.float32(ability_ident_mapping(self.battle.battle_state.red_side_pokemon[1].ability_ident)),
      np.float32(item_ident_mapping(self.battle.battle_state.red_side_pokemon[1].item_ident)),
      np.float32(status_ident_mapping(self.battle.battle_state.red_side_pokemon[1].status)),
      np.float32(self.battle.battle_state.red_side_pokemon[1].stat_boosts.attack),
      np.float32(self.battle.battle_state.red_side_pokemon[1].stat_boosts.defense),
      np.float32(self.battle.battle_state.red_side_pokemon[1].stat_boosts.special_attack),
      np.float32(self.battle.battle_state.red_side_pokemon[1].stat_boosts.special_defense),
      np.float32(self.battle.battle_state.red_side_pokemon[1].stat_boosts.speed),
      np.float32(self.battle.battle_state.red_side_pokemon[1].current_hp),
      np.float32(self.battle.battle_state.red_side_pokemon[1].pokemon_build.stat_spread.hp),
      np.float32(location_ident_mapping(self.battle.battle_state.red_side_pokemon[1].location_ident)),
      np.float32(self.battle.battle_state.red_side_pokemon[2].pokemon_build.pokemon.paldea_regional_pokedex_number),
      np.float32(type_ident_mapping(self.battle.battle_state.red_side_pokemon[2].primary_type_ident)),
      np.float32(type_ident_mapping(self.battle.battle_state.red_side_pokemon[2].secondary_type_ident)),
      np.float32(ability_ident_mapping(self.battle.battle_state.red_side_pokemon[2].ability_ident)),
      np.float32(item_ident_mapping(self.battle.battle_state.red_side_pokemon[2].item_ident)),
      np.float32(status_ident_mapping(self.battle.battle_state.red_side_pokemon[2].status)),
      np.float32(self.battle.battle_state.red_side_pokemon[2].stat_boosts.attack),
      np.float32(self.battle.battle_state.red_side_pokemon[2].stat_boosts.defense),
      np.float32(self.battle.battle_state.red_side_pokemon[2].stat_boosts.special_attack),
      np.float32(self.battle.battle_state.red_side_pokemon[2].stat_boosts.special_defense),
      np.float32(self.battle.battle_state.red_side_pokemon[2].stat_boosts.speed),
      np.float32(self.battle.battle_state.red_side_pokemon[2].current_hp),
      np.float32(self.battle.battle_state.red_side_pokemon[2].pokemon_build.stat_spread.hp),
      np.float32(location_ident_mapping(self.battle.battle_state.red_side_pokemon[2].location_ident))
    ]

  def step(self, action):

    observation_ = [
      np.float32(self.battle.battle_state.blue_side_pokemon[0].pokemon_build.pokemon.paldea_regional_pokedex_number),
      np.float32(type_ident_mapping(self.battle.battle_state.blue_side_pokemon[0].primary_type_ident)),
      np.float32(type_ident_mapping(self.battle.battle_state.blue_side_pokemon[0].secondary_type_ident)),
      np.float32(ability_ident_mapping(self.battle.battle_state.blue_side_pokemon[0].ability_ident)),
      np.float32(item_ident_mapping(self.battle.battle_state.blue_side_pokemon[0].item_ident)),
      np.float32(status_ident_mapping(self.battle.battle_state.blue_side_pokemon[0].status)),
      np.float32(self.battle.battle_state.blue_side_pokemon[0].stat_boosts.attack),
      np.float32(self.battle.battle_state.blue_side_pokemon[0].stat_boosts.defense),
      np.float32(self.battle.battle_state.blue_side_pokemon[0].stat_boosts.special_attack),
      np.float32(self.battle.battle_state.blue_side_pokemon[0].stat_boosts.special_defense),
      np.float32(self.battle.battle_state.blue_side_pokemon[0].stat_boosts.speed),
      np.float32(self.battle.battle_state.blue_side_pokemon[0].current_hp),
      np.float32(self.battle.battle_state.blue_side_pokemon[0].pokemon_build.stat_spread.hp),
      np.float32(location_ident_mapping(self.battle.battle_state.blue_side_pokemon[0].location_ident)),
      np.float32(self.battle.battle_state.blue_side_pokemon[1].pokemon_build.pokemon.paldea_regional_pokedex_number),
      np.float32(type_ident_mapping(self.battle.battle_state.blue_side_pokemon[1].primary_type_ident)),
      np.float32(type_ident_mapping(self.battle.battle_state.blue_side_pokemon[1].secondary_type_ident)),
      np.float32(ability_ident_mapping(self.battle.battle_state.blue_side_pokemon[1].ability_ident)),
      np.float32(item_ident_mapping(self.battle.battle_state.blue_side_pokemon[1].item_ident)),
      np.float32(status_ident_mapping(self.battle.battle_state.blue_side_pokemon[1].status)),
      np.float32(self.battle.battle_state.blue_side_pokemon[1].stat_boosts.attack),
      np.float32(self.battle.battle_state.blue_side_pokemon[1].stat_boosts.defense),
      np.float32(self.battle.battle_state.blue_side_pokemon[1].stat_boosts.special_attack),
      np.float32(self.battle.battle_state.blue_side_pokemon[1].stat_boosts.special_defense),
      np.float32(self.battle.battle_state.blue_side_pokemon[1].stat_boosts.speed),
      np.float32(self.battle.battle_state.blue_side_pokemon[1].current_hp),
      np.float32(self.battle.battle_state.blue_side_pokemon[1].pokemon_build.stat_spread.hp),
      np.float32(location_ident_mapping(self.battle.battle_state.blue_side_pokemon[1].location_ident)),
      np.float32(self.battle.battle_state.blue_side_pokemon[2].pokemon_build.pokemon.paldea_regional_pokedex_number),
      np.float32(type_ident_mapping(self.battle.battle_state.blue_side_pokemon[2].primary_type_ident)),
      np.float32(type_ident_mapping(self.battle.battle_state.blue_side_pokemon[2].secondary_type_ident)),
      np.float32(ability_ident_mapping(self.battle.battle_state.blue_side_pokemon[2].ability_ident)),
      np.float32(item_ident_mapping(self.battle.battle_state.blue_side_pokemon[2].item_ident)),
      np.float32(status_ident_mapping(self.battle.battle_state.blue_side_pokemon[2].status)),
      np.float32(self.battle.battle_state.blue_side_pokemon[2].stat_boosts.attack),
      np.float32(self.battle.battle_state.blue_side_pokemon[2].stat_boosts.defense),
      np.float32(self.battle.battle_state.blue_side_pokemon[2].stat_boosts.special_attack),
      np.float32(self.battle.battle_state.blue_side_pokemon[2].stat_boosts.special_defense),
      np.float32(self.battle.battle_state.blue_side_pokemon[2].stat_boosts.speed),
      np.float32(self.battle.battle_state.blue_side_pokemon[2].current_hp),
      np.float32(self.battle.battle_state.blue_side_pokemon[2].pokemon_build.stat_spread.hp),
      np.float32(location_ident_mapping(self.battle.battle_state.blue_side_pokemon[2].location_ident)),
      np.float32(self.battle.battle_state.red_side_pokemon[0].pokemon_build.pokemon.paldea_regional_pokedex_number),
      np.float32(type_ident_mapping(self.battle.battle_state.red_side_pokemon[0].primary_type_ident)),
      np.float32(type_ident_mapping(self.battle.battle_state.red_side_pokemon[0].secondary_type_ident)),
      np.float32(ability_ident_mapping(self.battle.battle_state.red_side_pokemon[0].ability_ident)),
      np.float32(item_ident_mapping(self.battle.battle_state.red_side_pokemon[0].item_ident)),
      np.float32(status_ident_mapping(self.battle.battle_state.red_side_pokemon[0].status)),
      np.float32(self.battle.battle_state.red_side_pokemon[0].stat_boosts.attack),
      np.float32(self.battle.battle_state.red_side_pokemon[0].stat_boosts.defense),
      np.float32(self.battle.battle_state.red_side_pokemon[0].stat_boosts.special_attack),
      np.float32(self.battle.battle_state.red_side_pokemon[0].stat_boosts.special_defense),
      np.float32(self.battle.battle_state.red_side_pokemon[0].stat_boosts.speed),
      np.float32(self.battle.battle_state.red_side_pokemon[0].current_hp),
      np.float32(self.battle.battle_state.red_side_pokemon[0].pokemon_build.stat_spread.hp),
      np.float32(location_ident_mapping(self.battle.battle_state.red_side_pokemon[0].location_ident)),
      np.float32(self.battle.battle_state.red_side_pokemon[1].pokemon_build.pokemon.paldea_regional_pokedex_number),
      np.float32(type_ident_mapping(self.battle.battle_state.red_side_pokemon[1].primary_type_ident)),
      np.float32(type_ident_mapping(self.battle.battle_state.red_side_pokemon[1].secondary_type_ident)),
      np.float32(ability_ident_mapping(self.battle.battle_state.red_side_pokemon[1].ability_ident)),
      np.float32(item_ident_mapping(self.battle.battle_state.red_side_pokemon[1].item_ident)),
      np.float32(status_ident_mapping(self.battle.battle_state.red_side_pokemon[1].status)),
      np.float32(self.battle.battle_state.red_side_pokemon[1].stat_boosts.attack),
      np.float32(self.battle.battle_state.red_side_pokemon[1].stat_boosts.defense),
      np.float32(self.battle.battle_state.red_side_pokemon[1].stat_boosts.special_attack),
      np.float32(self.battle.battle_state.red_side_pokemon[1].stat_boosts.special_defense),
      np.float32(self.battle.battle_state.red_side_pokemon[1].stat_boosts.speed),
      np.float32(self.battle.battle_state.red_side_pokemon[1].current_hp),
      np.float32(self.battle.battle_state.red_side_pokemon[1].pokemon_build.stat_spread.hp),
      np.float32(location_ident_mapping(self.battle.battle_state.red_side_pokemon[1].location_ident)),
      np.float32(self.battle.battle_state.red_side_pokemon[2].pokemon_build.pokemon.paldea_regional_pokedex_number),
      np.float32(type_ident_mapping(self.battle.battle_state.red_side_pokemon[2].primary_type_ident)),
      np.float32(type_ident_mapping(self.battle.battle_state.red_side_pokemon[2].secondary_type_ident)),
      np.float32(ability_ident_mapping(self.battle.battle_state.red_side_pokemon[2].ability_ident)),
      np.float32(item_ident_mapping(self.battle.battle_state.red_side_pokemon[2].item_ident)),
      np.float32(status_ident_mapping(self.battle.battle_state.red_side_pokemon[2].status)),
      np.float32(self.battle.battle_state.red_side_pokemon[2].stat_boosts.attack),
      np.float32(self.battle.battle_state.red_side_pokemon[2].stat_boosts.defense),
      np.float32(self.battle.battle_state.red_side_pokemon[2].stat_boosts.special_attack),
      np.float32(self.battle.battle_state.red_side_pokemon[2].stat_boosts.special_defense),
      np.float32(self.battle.battle_state.red_side_pokemon[2].stat_boosts.speed),
      np.float32(self.battle.battle_state.red_side_pokemon[2].current_hp),
      np.float32(self.battle.battle_state.red_side_pokemon[2].pokemon_build.stat_spread.hp),
      np.float32(location_ident_mapping(self.battle.battle_state.red_side_pokemon[2].location_ident))
    ]

    return [observation_, reward, done]

# class Game():
#   def __init__(self):
#     self.thunderbolt_damage_rolls = [
#       [42, 42, 42, 43, 43, 44, 45, 45, 45, 46, 46, 47, 48, 48, 48, 49],
#       [62, 63, 63, 64, 65, 66, 66, 67, 68, 69, 69, 70, 71, 72, 72, 73],
#       [82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97],
#       [102, 104, 105, 106, 108, 108, 110, 111, 112, 114, 114, 116, 117, 118, 120, 121],
#       [123, 124, 126, 127, 129, 130, 132, 133, 135, 136, 138, 139, 141, 142, 144, 145],
#       [144, 145, 147, 148, 150, 152, 153, 155, 157, 159, 160, 162, 164, 165, 167, 169],
#       [165, 166, 168, 170, 172, 174, 176, 178, 180, 182, 184, 186, 188, 189, 192, 194]
#     ]
#     self.charge_beam_damage_rolls = [
#       [23, 23, 24, 24, 24, 24, 24, 25, 25, 25, 26, 26, 26, 27, 27, 27],
#       [34, 35, 35, 36, 36, 36, 37, 37, 38, 38, 39, 39, 39, 39, 40, 41],
#       [46, 46, 47, 48, 48, 48, 49, 50, 50, 51, 51, 52, 52, 53, 54, 54],
#       [57, 58, 59, 60, 60, 60, 61, 62, 63, 63, 64, 65, 66, 66, 67, 68],
#       [69, 69, 70, 71, 72, 73, 74, 75, 75, 76, 77, 78, 78, 79, 80, 81],
#       [80, 81, 81, 82, 84, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94],
#       [91, 92, 93, 94, 96, 96, 98, 99, 99, 101, 102, 103, 104, 105, 106, 108]
#     ]
#     self.ice_punch_damage_rolls = [39, 40, 40, 41, 42, 42, 42, 42, 43, 44, 44, 45, 45, 45, 46, 47]
#     self.sucker_punch_damage_rolls = [39, 40, 40, 41, 42, 42, 42, 42, 43, 44, 44, 45, 45, 45, 46, 47]

#   def reset(self):
#     self.rotom_hp = 25
#     self.rotom_special_attack_stage = 0
#     self.abomasnow_hp = 29
#     self.abomasnow_special_attack_stage = 0
#     self.psychic_terrain_active = 1
#     self.psychic_terrain_turns = 2
#     self.rotom_consecutive_protect_counter = 0
#     return [
#       np.float32(self.rotom_hp),
#       np.float32(self.rotom_special_attack_stage),
#       np.float32(self.abomasnow_hp),
#       np.float32(self.abomasnow_special_attack_stage),
#       np.float32(self.psychic_terrain_active),
#       np.float32(self.psychic_terrain_turns),
#       np.float32(self.rotom_consecutive_protect_counter)
#     ]

#   def step(self, action):
#     action = "thunderbolt" if action == 0 else action
#     action = "charge-beam" if action == 1 else action
#     action = "sucker-punch" if action == 2 else action
#     action = "protect" if action == 3 else action

#     abomasnow_action = "ice-punch"

#     reward = 0
#     done = 0

#     if action == "protect":
#       if self.rotom_consecutive_protect_counter >= 2:
#         ice_punch_damage_roll = np.random.choice(self.ice_punch_damage_rolls)
#         self.rotom_hp = max(0, (self.rotom_hp - ice_punch_damage_roll))
#         self.rotom_consecutive_protect_counter = 0
#       else:
#         self.rotom_consecutive_protect_counter += 1
#     else:
#       if action == "sucker-punch":
#         if self.psychic_terrain_active == 0:
#           sucker_punch_damage_roll = np.random.choice(self.sucker_punch_damage_rolls)
#           self.abomasnow_hp = max(0, (self.abomasnow_hp - sucker_punch_damage_roll))
#         else:
#           ice_punch_damage_roll = np.random.choice(self.ice_punch_damage_rolls)
#           self.rotom_hp = max(0, (self.rotom_hp - ice_punch_damage_roll))
#       else:
#         ice_punch_damage_roll = np.random.choice(self.ice_punch_damage_rolls)
#         self.rotom_hp = max(0, (self.rotom_hp - ice_punch_damage_roll))

#     if self.abomasnow_hp == 0:
#       reward = 1
#       done = 1
#     elif self.rotom_hp == 0:
#       reward = -1
#       done = 1

#     self.psychic_terrain_turns = max(0, self.psychic_terrain_turns - 1)
#     if(self.psychic_terrain_turns == 0):
#       self.psychic_terrain_active = 0

#     observation_ = [
#       np.float32(self.rotom_hp),
#       np.float32(self.rotom_special_attack_stage),
#       np.float32(self.abomasnow_hp),
#       np.float32(self.abomasnow_special_attack_stage),
#       np.float32(self.psychic_terrain_active),
#       np.float32(self.psychic_terrain_turns),
#       np.float32(self.rotom_consecutive_protect_counter)
#     ]

#     return [observation_, reward, done]
