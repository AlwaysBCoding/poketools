from models.pokemon_battle_state import PokemonBattleState

class SideBattleState():
  def __init__(self, reflect, light_screen, aurora_veil, tailwind, hazards):
    self.reflect = reflect
    self.light_screen = light_screen
    self.aurora_veil = aurora_veil
    self.tailwind = tailwind
    self.hazards = hazards

  @classmethod
  def create_empty(cls):
    cls(reflect=0, light_screen=0, aurora_veil=0, tailwind=0, hazards=[])

  def serialize_api(self):
    return {
      "reflect": self.reflect,
      "light_screen": self.light_screen,
      "aurora_veil": self.aurora_veil,
      "tailwind": self.tailwind,
      "hazards": self.hazards
    }

class GlobalBattleState():
  def __init__(self, terrain, weather, auras):
    self.terrain = terrain
    self.weather = weather
    self.auras = auras

  @classmethod
  def create_empty(cls):
    cls(terrain=None, weather=None, auras=[])

  def serialize_api(self):
    return {
      "terrain": self.terrain,
      "weather": self.weather,
      "auras": self.auras
    }

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

  # SERIALIZERS
  # =====================
  @classmethod
  def deserialize(cls, serialized_battle_state):
    return cls(
      global_state=GlobalBattleState(
        terrain=serialized_battle_state["global_state"]["terrain"],
        weather=serialized_battle_state["global_state"]["weather"],
        auras=serialized_battle_state["global_state"]["auras"]
      ),
      field_state=serialized_battle_state["field_state"],
      blue_side_state=SideBattleState(
        reflect=serialized_battle_state["blue_side_state"]["reflect"],
        light_screen=serialized_battle_state["blue_side_state"]["light_screen"],
        aurora_veil=serialized_battle_state["blue_side_state"]["aurora_veil"],
        tailwind=serialized_battle_state["blue_side_state"]["tailwind"],
        hazards=serialized_battle_state["blue_side_state"]["hazards"]
      ),
      red_side_state=SideBattleState(
        reflect=serialized_battle_state["red_side_state"]["reflect"],
        light_screen=serialized_battle_state["red_side_state"]["light_screen"],
        aurora_veil=serialized_battle_state["red_side_state"]["aurora_veil"],
        tailwind=serialized_battle_state["red_side_state"]["tailwind"],
        hazards=serialized_battle_state["red_side_state"]["hazards"]
      ),
      blue_side_pokemon=list(map(lambda x: PokemonBattleState.deserialize(x), serialized_battle_state["blue_side_pokemon"])),
      red_side_pokemon=list(map(lambda x: PokemonBattleState.deserialize(x), serialized_battle_state["red_side_pokemon"])),
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
    "..."
