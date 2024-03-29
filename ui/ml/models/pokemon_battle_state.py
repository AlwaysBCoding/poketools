from models.pokemon_build import PokemonBuild
from mappings import type_ident_mapping, ability_ident_mapping, item_ident_mapping, status_ident_mapping, location_mapping
from helpers import flatten
import uuid
import numpy as np

class PokemonStatBoosts():
  def __init__(self, attack=0, defense=0, special_attack=0, special_defense=0, speed=0, accuracy=0, evasiveness=0, critical_hit=0):
    self.attack = attack
    self.defense = defense
    self.special_attack = special_attack
    self.special_defense = special_defense
    self.speed = speed
    self.accuracy = accuracy
    self.evasiveness = evasiveness
    self.critical_hit = critical_hit

  def serialize_api(self):
    return {
      "attack": self.attack,
      "defense": self.defense,
      "special_attack": self.special_attack,
      "special_defense": self.special_defense,
      "speed": self.speed,
      "accuracy": self.accuracy,
      "evasiveness": self.evasiveness,
      "critical_hit": self.critical_hit
    }

  def serialize_ml(self):
    return [
      np.float32(self.attack / 6),
      np.float32(self.defense / 6),
      np.float32(self.special_attack / 6),
      np.float32(self.special_defense / 6),
      np.float32(self.speed / 6),
      np.float32(self.accuracy / 6),
      np.float32(self.evasiveness / 6),
      np.float32(self.critical_hit / 3)
    ]

class PokemonBattleState():
  def __init__(
    self,
    battle_id,
    pokemon_build,
    battle_side,
    primary_type_ident,
    secondary_type_ident,
    ability_ident,
    item_ident,
    stat_boosts,
    status,
    volatile_statuses,
    current_hp,
    location,
    terastallized,
    current_slot
  ):
    self.battle_id = battle_id
    self.pokemon_build = pokemon_build
    self.battle_side = battle_side
    self.primary_type_ident = primary_type_ident
    self.secondary_type_ident = secondary_type_ident
    self.ability_ident = ability_ident
    self.item_ident = item_ident
    self.stat_boosts = stat_boosts
    self.status = status
    self.volatile_statuses = volatile_statuses
    self.current_hp = current_hp
    self.location = location
    self.terastallized = terastallized
    self.current_slot = current_slot

  @classmethod
  def create_from_pokemon_build(cls, pokemon_build, battle_side):
    return cls(
      battle_id=uuid.uuid4(),
      pokemon_build=pokemon_build,
      battle_side=battle_side,
      primary_type_ident=pokemon_build.pokemon.primary_type_ident,
      secondary_type_ident=pokemon_build.pokemon.secondary_type_ident,
      ability_ident=pokemon_build.ability_ident,
      item_ident=pokemon_build.item_ident,
      stat_boosts=PokemonStatBoosts(),
      status="healthy",
      volatile_statuses=[],
      current_hp=pokemon_build.stat_spread.hp,
      location="preview",
      terastallized=False,
      current_slot=None
    )

  def take_damage(self, damage_amount):
    damage_taken = min(self.current_hp, damage_amount)
    self.current_hp -= damage_taken
    return damage_taken

  def recover_hp(self, recovery_amount):
    hp_missing = self.max_hp() - self.current_hp
    recovery_taken = min(hp_missing, recovery_amount)
    self.current_hp += recovery_taken
    return recovery_taken

  def max_hp(self):
    return self.pokemon_build.stat_spread.hp

  def hp_percentage(self):
    return self.current_hp / self.max_hp()

  def fainted(self):
    if self.current_hp == 0:
      return True
    else:
      return False

  def reset(self):
    self.primary_type_ident = self.pokemon_build.pokemon.primary_type_ident
    self.secondary_type_ident = self.pokemon_build.pokemon.secondary_type_ident
    self.ability_ident = self.pokemon_build.ability_ident
    self.item_ident = self.pokemon_build.item_ident
    self.stat_boosts = PokemonStatBoosts()
    self.status = "healthy"
    self.volatile_statuses = []
    self.current_hp = self.pokemon_build.stat_spread.hp
    self.location = "party"
    self.current_slot = None
    self.terastallized = False

  # SERIALIZERS
  # =====================
  @classmethod
  def deserialize(cls, serialized_pokemon_battle_state):
    return cls(
      battle_id=serialized_pokemon_battle_state["battle_id"],
      pokemon_build=PokemonBuild.deserialize(serialized_pokemon_battle_state["pokemon_build"]),
      battle_side=serialized_pokemon_battle_state["battle_side"],
      location=serialized_pokemon_battle_state["location"],
      primary_type_ident=serialized_pokemon_battle_state["primary_type_ident"],
      secondary_type_ident=serialized_pokemon_battle_state["secondary_type_ident"],
      ability_ident=serialized_pokemon_battle_state["ability_ident"],
      item_ident=serialized_pokemon_battle_state["item_ident"],
      status=serialized_pokemon_battle_state["status"],
      volatile_statuses=serialized_pokemon_battle_state["volatile_statuses"],
      stat_boosts=PokemonStatBoosts(
        attack=serialized_pokemon_battle_state["stat_boosts"]["attack"],
        defense=serialized_pokemon_battle_state["stat_boosts"]["defense"],
        special_attack=serialized_pokemon_battle_state["stat_boosts"]["special_attack"],
        special_defense=serialized_pokemon_battle_state["stat_boosts"]["special_defense"],
        speed=serialized_pokemon_battle_state["stat_boosts"]["speed"]
      ),
      terastallized=serialized_pokemon_battle_state["terastallized"],
      current_hp=serialized_pokemon_battle_state["current_hp"],
      current_slot=serialized_pokemon_battle_state["current_slot"]
    )

  def serialize_api(self):
    return {
      "battle_id": self.battle_id,
      "pokemon_build": self.pokemon_build.serialize_api(),
      "battle_side": self.battle_side,
      "primary_type_ident": self.primary_type_ident,
      "secondary_type_ident": self.secondary_type_ident,
      "ability_ident": self.ability_ident,
      "item_ident": self.item_ident,
      "stat_boosts": self.stat_boosts.serialize_api(),
      "status": self.status,
      "volatile_statuses": self.volatile_statuses,
      "current_hp": self.current_hp,
      "location": self.location,
      "terastallized": self.terastallized,
      "current_slot": self.current_slot
    }

  def serialize_ml(self):
    return flatten([
      flatten(type_ident_mapping(self.primary_type_ident)),
      flatten(type_ident_mapping(self.secondary_type_ident)),
      flatten(type_ident_mapping(self.pokemon_build.tera_type_ident)),
      flatten(ability_ident_mapping(self.ability_ident)),
      flatten(item_ident_mapping(self.item_ident)),
      flatten(status_ident_mapping(self.status)),
      flatten(self.stat_boosts.serialize_ml()),
      np.float32(self.current_hp / self.max_hp()),
      flatten(location_mapping(self.location)),
      flatten(self.pokemon_build.serialize_ml())
    ])
