class BattleState():
  def __init__(self, config, blue_side_pokemon, red_side_pokemon):
    self.config = config
    self.turn_index = 0
    self.global_state = {}
    self.blue_side_state = {}
    self.red_side_state = {}
    self.blue_side_pokemon = blue_side_pokemon
    self.red_side_pokemon = red_side_pokemon
