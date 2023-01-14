from models.pokemon_battle_state import PokemonBattleState
from pprint import pprint

from mappings import terrain_mapping, weather_mapping
from helpers import find, flatten
import numpy as np

class SideBattleState():
  def __init__(self, reflect, light_screen, aurora_veil, tailwind, hazards):
    self.reflect = reflect
    self.light_screen = light_screen
    self.aurora_veil = aurora_veil
    self.tailwind = tailwind
    self.hazards = hazards

  @classmethod
  def create_empty(cls):
    return cls(reflect=0, light_screen=0, aurora_veil=0, tailwind=0, hazards=[])

  def serialize_api(self):
    return {
      "reflect": self.reflect,
      "light_screen": self.light_screen,
      "aurora_veil": self.aurora_veil,
      "tailwind": self.tailwind,
      "hazards": self.hazards
    }

  def serialize_ml(self):
    return [
      np.float32(self.reflect),
      np.float32(self.light_screen),
      np.float32(self.aurora_veil),
      np.float32(self.tailwind)
    ]

class GlobalBattleState():
  def __init__(self, terrain, terrain_counter, weather, weather_counter, auras):
    self.terrain = terrain
    self.terrain_counter = terrain_counter
    self.weather = weather
    self.weather_counter = weather_counter
    self.auras = auras

  def set_terrain(self, terrain):
    if(not self.terrain or (self.terrain and self.terrain != terrain)):
      self.terrain = terrain
      self.terrain_counter = 5
      return True
    else:
      return False

  def set_weather(self, weather):
    if(not self.weather or (self.weather and self.weather != weather)):
      self.weather = weather
      self.weather_counter = 5
      return True
    else:
      return False

  @classmethod
  def create_empty(cls):
    return cls(terrain=None, terrain_counter=0, weather=None, weather_counter=0, auras=[])

  def serialize_api(self):
    return {
      "terrain": self.terrain,
      "terrain_counter": self.terrain_counter,
      "weather": self.weather,
      "weather_counter": self.weather_counter,
      "auras": self.auras
    }

  def serialize_ml(self):
    return flatten([
      terrain_mapping(self.terrain),
      np.float32(self.terrain_counter),
      weather_mapping(self.weather),
      np.float32(self.weather_counter)
    ])

class BattleState():
  def __init__(self, global_state, field_state, blue_side_state, red_side_state, blue_side_pokemon, red_side_pokemon):
    self.global_state = global_state
    self.field_state = field_state
    self.blue_side_state = blue_side_state
    self.red_side_state = red_side_state
    self.blue_side_pokemon = blue_side_pokemon
    self.red_side_pokemon = red_side_pokemon

  @classmethod
  def create(cls, config, blue_side_pokemon, red_side_pokemon):
    field_state = {}
    if(config.get("variant") == "singles"):
      field_state = {
        "blue-field-1": None,
        "red-field-1": None
      }
    elif(config.get("variant") == "doubles"):
      field_state = {
        "blue-field-1": None,
        "blue-field-2": None,
        "red-field-1": None,
        "red-field-2": None
      }

    return cls(
      global_state=GlobalBattleState.create_empty(),
      field_state=field_state,
      blue_side_state=SideBattleState.create_empty(),
      red_side_state=SideBattleState.create_empty(),
      blue_side_pokemon=blue_side_pokemon,
      red_side_pokemon=red_side_pokemon
    )

  def create_empty(self):
    self.global_state = GlobalBattleState.create_empty()
    self.blue_side_state = SideBattleState.create_empty()
    self.red_side_state = SideBattleState.create_empty()

  # CONVENIENCE HELPERS
  # =====================
  def field_pokemon(self, side):
    if(side == "blue"):
      return find(self.blue_side_pokemon, lambda x: x.location == "field")
    elif(side == "red"):
      return find(self.red_side_pokemon, lambda x: x.location == "field")
    else:
      return None

  def alive_pokemons(self, side):
    if(side == "blue"):
      return list(filter(lambda x: x.location != "graveyard", self.blue_side_pokemon))
    elif(side == "red"):
      return list(filter(lambda x: x.location != "graveyard", self.red_side_pokemon))

  def party_pokemons(self, side):
    if(side == "blue"):
      return list(filter(lambda x: x.location == "party", self.blue_side_pokemon))
    elif(side == "red"):
      return list(filter(lambda x: x.location == "party", self.red_side_pokemon))
    else:
      return []

  # SERIALIZERS
  # =====================
  @classmethod
  def deserialize(cls, serialized_battle_state):
    return cls(
      global_state=GlobalBattleState(
        terrain=serialized_battle_state['global_state']['terrain'],
        terrain_counter=serialized_battle_state['global_state']['terrain_counter'],
        weather=serialized_battle_state['global_state']['weather'],
        weather_counter=serialized_battle_state['global_state']['weather_counter'],
        auras=serialized_battle_state['global_state']['auras']
      ),
      field_state=serialized_battle_state['field_state'],
      blue_side_state=SideBattleState(
        reflect=serialized_battle_state['blue_side_state']['reflect'],
        light_screen=serialized_battle_state['blue_side_state']['light_screen'],
        aurora_veil=serialized_battle_state['blue_side_state']['aurora_veil'],
        tailwind=serialized_battle_state['blue_side_state']['tailwind'],
        hazards=serialized_battle_state['blue_side_state']['hazards']
      ),
      red_side_state=SideBattleState(
        reflect=serialized_battle_state['red_side_state']['reflect'],
        light_screen=serialized_battle_state['red_side_state']['light_screen'],
        aurora_veil=serialized_battle_state['red_side_state']['aurora_veil'],
        tailwind=serialized_battle_state['red_side_state']['tailwind'],
        hazards=serialized_battle_state['red_side_state']['hazards']
      ),
      blue_side_pokemon=list(map(lambda x: PokemonBattleState.deserialize(x), serialized_battle_state['blue_side_pokemon'])),
      red_side_pokemon=list(map(lambda x: PokemonBattleState.deserialize(x), serialized_battle_state['red_side_pokemon'])),
    )

  def serialize_api(self):
    return {
      "global_state": self.global_state.serialize_api(),
      "blue_side_state": self.blue_side_state.serialize_api(),
      "red_side_state": self.red_side_state.serialize_api(),
      "field_state": self.field_state,
      "blue_side_pokemon": list(map(lambda x: x.serialize_api(), self.blue_side_pokemon)),
      "red_side_pokemon": list(map(lambda x: x.serialize_api(), self.red_side_pokemon))
    }

  def serialize_ml(self):
    POKEMON_BATTLE_STATE_EMPTY_ML = np.zeros(2836, dtype=np.float32)

    blue_side_pokemon_1 = self.blue_side_pokemon[0]
    blue_side_pokemon_2 = self.blue_side_pokemon[1]
    blue_side_pokemon_3 = self.blue_side_pokemon[2]
    blue_side_pokemon_4 = self.blue_side_pokemon[3]
    red_side_pokemon_1 = self.red_side_pokemon[0]
    red_side_pokemon_2 = self.red_side_pokemon[1]
    red_side_pokemon_3 = self.red_side_pokemon[2]
    red_side_pokemon_4 = self.red_side_pokemon[3]

    blue_field_pokemon_1_battle_id = self.field_state['blue-field-1']
    blue_field_pokemon_2_battle_id = self.field_state['blue-field-2']
    blue_field_pokemon_1 = find(self.blue_side_pokemon, lambda x: x.battle_id == blue_field_pokemon_1_battle_id)
    blue_field_pokemon_2 = find(self.blue_side_pokemon, lambda x: x.battle_id == blue_field_pokemon_2_battle_id)
    red_field_pokemon_1_battle_id = self.field_state['red-field-1']
    red_field_pokemon_2_battle_id = self.field_state['red-field-2']
    red_field_pokemon_1 = find(self.red_side_pokemon, lambda x: x.battle_id == red_field_pokemon_1_battle_id)
    red_field_pokemon_2 = find(self.red_side_pokemon, lambda x: x.battle_id == red_field_pokemon_2_battle_id)

    return flatten([
      self.global_state.serialize_ml(),
      self.blue_side_state.serialize_ml(),
      self.red_side_state.serialize_ml(),
      flatten(blue_field_pokemon_1.serialize_ml() if blue_field_pokemon_1 else POKEMON_BATTLE_STATE_EMPTY_ML),
      flatten(blue_field_pokemon_2.serialize_ml() if blue_field_pokemon_2 else POKEMON_BATTLE_STATE_EMPTY_ML),
      flatten(blue_side_pokemon_1.serialize_ml()),
      flatten(blue_side_pokemon_2.serialize_ml()),
      flatten(blue_side_pokemon_3.serialize_ml()),
      flatten(blue_side_pokemon_4.serialize_ml()),
      flatten(red_field_pokemon_1.serialize_ml() if red_field_pokemon_1 else POKEMON_BATTLE_STATE_EMPTY_ML),
      flatten(red_field_pokemon_2.serialize_ml() if red_field_pokemon_2 else POKEMON_BATTLE_STATE_EMPTY_ML),
      flatten(red_side_pokemon_1.serialize_ml()),
      flatten(red_side_pokemon_2.serialize_ml()),
      flatten(red_side_pokemon_3.serialize_ml()),
      flatten(red_side_pokemon_4.serialize_ml())
    ])
