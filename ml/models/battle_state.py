class SideBattleState():
  def __init__(self):
    self.state = {
      "reflect": None,
      "light_screen": None,
      "aurora_veil": None,
      "tailwind": None,
      "hazards": {}
    }

class GlobalBattleState():
  def __init__(self):
    self.state = {
      "terrain": None,
      "weather": None,
      "auras": []
    }

class BattleState():
  def __init__(self, config, blue_side_pokemon, red_side_pokemon):
    self.global_state = GlobalBattleState()
    self.blue_side_state = SideBattleState()
    self.red_side_state = SideBattleState()
    self.blue_side_pokemon = blue_side_pokemon
    self.red_side_pokemon = red_side_pokemon

    if(config.get("variant") == "singles"):
      self.field_state = {
        "blue-field-1": None,
        "red-field-1": None
      }
    elif(config.get("variant") == "doubles"):
      self.field_state = {
        "blue-field-1": None,
        "blue-field-2": None,
        "red-field-1": None,
        "red-field-2": None
      }
