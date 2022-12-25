from models.pokemon import Pokemon, PokemonStatSpread

class PokemonBuild():
  def __init__(
    self,
    pokemon,
    item_ident,
    ability_ident,
    level,
    gender,
    tera_type_ident,
    move_idents,
    stat_spread
  ):
    self.pokemon = pokemon
    self.ability_ident = ability_ident
    self.item_ident = item_ident
    self.level = level
    self.gender = gender
    self.tera_type_ident = tera_type_ident
    self.move_idents = move_idents
    self.stat_spread = stat_spread

  # SERIALIZERS
  # =====================
  @classmethod
  def deserialize(cls, serialized_pokemon_build):
    return cls(
      pokemon=Pokemon.deserialize(serialized_pokemon_build["pokemon"]),
      ability_ident=serialized_pokemon_build["ability_ident"],
      item_ident=serialized_pokemon_build["item_ident"],
      level=serialized_pokemon_build["level"],
      gender=serialized_pokemon_build["gender"],
      tera_type_ident=serialized_pokemon_build["tera_type_ident"],
      move_idents=serialized_pokemon_build["move_idents"],
      stat_spread=PokemonStatSpread(
        hp=serialized_pokemon_build["stat_spread"]["hp"],
        attack=serialized_pokemon_build["stat_spread"]["attack"],
        defense=serialized_pokemon_build["stat_spread"]["defense"],
        special_attack=serialized_pokemon_build["stat_spread"]["special_attack"],
        special_defense=serialized_pokemon_build["stat_spread"]["special_defense"],
        speed=serialized_pokemon_build["stat_spread"]["speed"]
      )
    )

  def serialize_api(self):
    return {
      "pokemon": self.pokemon.serialize_api(),
      "ability_ident": self.ability_ident,
      "item_ident": self.item_ident,
      "level": self.level,
      "gender": self.gender,
      "tera_type_ident": self.tera_type_ident,
      "move_idents": self.move_idents,
      "stat_spread": self.stat_spread.serialize_api()
    }
