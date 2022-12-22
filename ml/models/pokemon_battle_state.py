from models.pokemon import PokemonStatBoosts
import uuid

class PokemonBattleState():
  def __init__(self, pokemon_build, battle_side):
    self.id = uuid.uuid4().hex
    self.pokemon_build = pokemon_build
    self.battle_side = battle_side
    self.reset()

  def max_hp(self):
    return self.pokemon_build.stat_spread.hp

  def reset(self):
    self.primary_type_ident = self.pokemon_build.pokemon.primary_type_ident
    self.secondary_type_ident = self.pokemon_build.pokemon.secondary_type_ident
    self.ability_ident = self.pokemon_build.ability_ident
    self.item_ident = self.pokemon_build.item_ident
    self.stat_boosts = PokemonStatBoosts()
    self.status = "healthy"
    self.volatile_statuses = []
    self.current_hp = self.pokemon_build.stat_spread.hp
    self.location_ident = "party"
    self.current_slot = None
    self.terastallized = False
