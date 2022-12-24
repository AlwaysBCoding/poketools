from models.pokemon import Pokemon, PokemonStatSpread
from models.pokemon_build import PokemonBuild
from models.pokemon_battle_state import PokemonBattleState
from mappings import type_ident_mapping, ability_ident_mapping, item_ident_mapping, status_ident_mapping, location_mapping
from models.battle import Battle

from helpers import find

import numpy as np
from pathlib import Path
from functools import reduce
import json
import ipdb
from pprint import pprint

all_pokemon_f = open(Path("../src/data/pokemon/all-pokemon.json"))
all_pokemon_data = json.load(all_pokemon_f)

gastrodon_data = find(all_pokemon_data, lambda x: x["ident"] == "gastrodon-east")
gastrodon = Pokemon.deserialize(gastrodon_data)
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

garchomp_data = find(all_pokemon_data, lambda x: x["ident"] == "garchomp")
garchomp = Pokemon.deserialize(garchomp_data)
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

talonflame_data = find(all_pokemon_data, lambda x: x["ident"] == "talonflame")
talonflame = Pokemon.deserialize(talonflame_data)
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

gholdengo_data = find(all_pokemon_data, lambda x: x["ident"] == "gholdengo")
gholdengo = Pokemon.deserialize(gholdengo_data)
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

tsareena_data = find(all_pokemon_data, lambda x: x["ident"] == "tsareena")
tsareena = Pokemon.deserialize(tsareena_data)
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

grimmsnarl_data = find(all_pokemon_data, lambda x: x["ident"] == "grimmsnarl")
grimmsnarl = Pokemon.deserialize(grimmsnarl_data)
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

class Game():
  def __init__(self):
    self.reward = 0
    self.done = 0

  def reset(self):
    self.reward = 0
    self.done = 0

    talonflame_battle_state = PokemonBattleState.create_from_pokemon_build(talonflame_build, "blue")
    tsareena_battle_state = PokemonBattleState.create_from_pokemon_build(tsareena_build, "blue")
    gastrodon_battle_state = PokemonBattleState.create_from_pokemon_build(gastrodon_build, "blue")

    garchomp_battle_state = PokemonBattleState.create_from_pokemon_build(garchomp_build, "red")
    grimmsnarl_battle_state = PokemonBattleState.create_from_pokemon_build(grimmsnarl_build, "red")
    gholdengo_battle_state = PokemonBattleState.create_from_pokemon_build(gholdengo_build, "red")

    blue_side_pokemon = [talonflame_battle_state, tsareena_battle_state, gastrodon_battle_state]
    red_side_pokemon = [garchomp_battle_state, grimmsnarl_battle_state, gholdengo_battle_state]

    battle_config = {"variant": "singles"}
    self.battle = Battle.create(battle_config, blue_side_pokemon, red_side_pokemon)

    blue_side_pokemon_order = [0, 1, 2]
    np.random.shuffle(blue_side_pokemon_order)
    red_side_pokemon_order = [0, 1, 2]
    np.random.shuffle(red_side_pokemon_order)

    self.battle.initial_step(blue_side_pokemon_order, red_side_pokemon_order)

    return self.battle.serialize_ml()

  def possible_actions(self):
    return self.battle.available_actions_for_pokemon_battle_state(self.battle.field_pokemon("blue").battle_id)

  def step(self, action):
    blue_field_pokemon = self.battle.field_pokemon("blue")
    red_field_pokemon = self.battle.field_pokemon("red")

    blue_pokemon_actions = self.battle.available_actions_for_pokemon_battle_state(blue_field_pokemon.battle_id)
    red_pokemon_actions = self.battle.available_actions_for_pokemon_battle_state(red_field_pokemon.battle_id)

    red_pokemon_action = np.random.choice(red_pokemon_actions)

    self.battle.step([blue_pokemon_actions[action]], [red_pokemon_action])

    if(self.battle.status == "complete"):
      self.done = 1
      if(self.battle.winner == "blue"):
        # total_team_hp = 523
        # remaining_hp = reduce(lambda memo, i: memo + i.current_hp, self.battle.alive_pokemons("blue"), 0)
        # self.reward = np.round((remaining_hp / total_team_hp) * 100, 2)
        self.reward = 1
      elif(self.battle.winner == "red"):
        # total_team_hp = 540
        # remaining_hp = reduce(lambda memo, i: memo + i.current_hp, self.battle.alive_pokemons("red"), 0)
        # self.reward = np.round((remaining_hp / total_team_hp) * 100, 2) * -1
        self.reward = -1

    observation_ = self.battle.serialize_ml()

    return [observation_, self.reward, self.done]
