from models.pokemon import PokemonStatBoosts

class PokemonBattleState():
  def __init__(self, pokemon_build):
    self.pokemon_build = pokemon_build
    self.primary_type_ident = pokemon_build.pokemon.primary_type_ident
    self.secondary_type_ident = pokemon_build.pokemon.secondary_type_ident
    self.ability_ident = pokemon_build.ability_ident
    self.item_ident = pokemon_build.item_ident
    self.stat_boosts = PokemonStatBoosts()
    self.status = "healthy"

# self.location = ""
# self.side = ""
# self.volatile_statuses = ""

# side: BattleSide
# location: PokemonBattleLocation
# status: PokemonStatusIdent
# volatile_statuses: PokemonVolatileStatus[]
# stat_boosts: PokemonStatBoosts
# terastallized: boolean
# current_hp: number
