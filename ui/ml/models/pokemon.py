class PokemonStatSpread():
  def __init__(self, hp, attack, defense, special_attack, special_defense, speed):
    self.hp = hp
    self.attack = attack
    self.defense = defense
    self.special_attack = special_attack
    self.special_defense = special_defense
    self.speed = speed

  def serialize_api(self):
    return {
      "hp": self.hp,
      "attack": self.attack,
      "defense": self.defense,
      "special_attack": self.special_attack,
      "special_defense": self.special_defense,
      "speed": self.speed
    }

class Pokemon():
  def __init__(
    self,
    ident,
    national_pokedex_number,
    pokedex_region,
    regional_pokedex_number,
    evolution_line_ident,
    evolution_line_index,
    primary_type_ident,
    secondary_type_ident,
    weight,
    genders,
    base_stats,
    ability_idents,
    move_idents
  ):
    self.ident = ident
    self.national_pokedex_number = national_pokedex_number
    self.pokedex_region = pokedex_region
    self.regional_pokedex_number = regional_pokedex_number
    self.evolution_line_ident = evolution_line_ident
    self.evolution_line_index = evolution_line_index
    self.primary_type_ident = primary_type_ident
    self.secondary_type_ident = secondary_type_ident
    self.weight = weight
    self.genders = genders
    self.base_stats = base_stats
    self.ability_idents = ability_idents
    self.move_idents = move_idents

  def can_evolve(self):
    if self.evolution_line_index != 2:
      return True
    else:
      return False

  # SERIALIZERS
  # =====================
  @classmethod
  def deserialize(cls, serialized_pokemon):
    return cls(
      ident=serialized_pokemon["ident"],
      national_pokedex_number=serialized_pokemon["national_pokedex_number"],
      pokedex_region=serialized_pokemon["pokedex_region"],
      regional_pokedex_number=serialized_pokemon["regional_pokedex_number"],
      evolution_line_ident=serialized_pokemon["evolution_line_ident"],
      evolution_line_index=serialized_pokemon["evolution_line_index"],
      primary_type_ident=serialized_pokemon["primary_type_ident"],
      secondary_type_ident=serialized_pokemon["secondary_type_ident"],
      weight=serialized_pokemon["weight"],
      genders=serialized_pokemon["genders"],
      base_stats=PokemonStatSpread(
        hp=serialized_pokemon["base_stats"]["hp"],
        attack=serialized_pokemon["base_stats"]["attack"],
        defense=serialized_pokemon["base_stats"]["defense"],
        special_attack=serialized_pokemon["base_stats"]["special_attack"],
        special_defense=serialized_pokemon["base_stats"]["special_defense"],
        speed=serialized_pokemon["base_stats"]["speed"]
      ),
      ability_idents=serialized_pokemon["ability_idents"],
      move_idents=serialized_pokemon["move_idents"]
    )

  def serialize_api(self):
    return {
      "ident": self.ident,
      "national_pokedex_number": self.national_pokedex_number,
      "pokedex_region": self.pokedex_region,
      "regional_pokedex_number": self.regional_pokedex_number,
      "evolution_line_ident": self.evolution_line_ident,
      "evolution_line_index": self.evolution_line_index,
      "primary_type_ident": self.primary_type_ident,
      "secondary_type_ident": self.secondary_type_ident,
      "weight": self.weight,
      "genders": self.genders,
      "base_stats": self.base_stats.serialize_api(),
      "ability_idents": self.ability_idents,
      "move_idents": self.move_idents
    }
