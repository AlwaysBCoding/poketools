from models.pokemon import PokemonStatBoosts
import uuid

class PokemonBattleState():
  def __init__(self, pokemon_build, battle_side):
    self.id = uuid.uuid4().hex

    self.pokemon_build = pokemon_build
    self.primary_type_ident = pokemon_build.pokemon.primary_type_ident
    self.secondary_type_ident = pokemon_build.pokemon.secondary_type_ident
    self.ability_ident = pokemon_build.ability_ident
    self.item_ident = pokemon_build.item_ident
    self.stat_boosts = PokemonStatBoosts()
    self.status = "healthy"
    self.volatile_statuses = []
    self.current_hp = pokemon_build.stat_spread.hp
    self.location_ident = "party"
    self.battle_side = battle_side
    self.current_slot = None
    self.terastallized = False
