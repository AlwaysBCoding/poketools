class PokemonStatBoosts():
  def __init__(self, attack=0, defense=0, special_attack=0, special_defense=0, speed=0):
    self.attack = attack
    self.defense = defense
    self.special_attack = special_attack
    self.special_defense = special_defense
    self.speed = speed

class PokemonStatSpread():
  def __init__(self, hp, attack, defense, special_attack, special_defense, speed):
    self.hp = hp
    self.attack = attack
    self.defense = defense
    self.special_attack = special_attack
    self.special_defense = special_defense
    self.speed = speed

class Pokemon():
  def __init__(self, data):
    self.data = data
    self.ident = data["ident"]
    self.national_pokedex_number = data["national_pokedex_number"]
    self.paldea_regional_pokedex_number = data["paldea_regional_pokedex_number"]
    self.evolution_line_ident = data["evolution_line_ident"]
    self.evolution_line_index = data["evolution_line_index"]
    self.primary_type_ident = data["primary_type_ident"]
    self.secondary_type_ident = data["secondary_type_ident"]
    self.weight = data["weight"]
    self.genders = data["genders"]
    self.base_stats = PokemonStatSpread(
      hp=data["base_stats"]["hp"],
      attack=data["base_stats"]["attack"],
      defense=data["base_stats"]["defense"],
      special_attack=data["base_stats"]["special_attack"],
      special_defense=data["base_stats"]["special_defense"],
      speed=data["base_stats"]["speed"]
    )
    self.ability_idents = data["ability_idents"]
    self.move_idents = data["move_idents"]

  def can_evolve(self):
    if(self.data.can_evolve and self.data.can_evolve == True):
      return True
    else:
      return False
