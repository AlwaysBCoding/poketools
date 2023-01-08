from models.pokemon_battle_state import PokemonBattleState, PokemonStatBoosts
from models.battle_state import BattleState
from helpers import find, flatten
from mappings import variant_mapping
from damage_calculation import calculate_damage

from functools import cmp_to_key
from pathlib import Path
import json
from pprint import pprint
import numpy as np
import math

all_moves_f = open(Path("../src/data/moves/all-moves.json"))
all_moves_data = json.load(all_moves_f)

STAT_BOOST_MODIFIER_VALUES = {
  "-6": 0.25,
  "-5": 0.285,
  "-4": 0.333,
  "-3": 0.4,
  "-2": 0.5,
  "-1": 0.666,
  "0": 1,
  "1": 1.5,
  "2": 2,
  "3": 2.5,
  "4": 4,
  "5": 3.5,
  "6": 4
}

class BattleAction():
  def __init__(self, actor, action_type, action_data):
    self.actor = actor
    self.action_type = action_type
    self.action_data = action_data

  @classmethod
  def deserialize(cls, serialized_battle_action):
    action_data = {}
    if(serialized_battle_action["action_type"] == "move"):
      action_data = serialized_battle_action["action_data"]
    elif(serialized_battle_action["action_type"] == "switch"):
      action_data = {
        "switch_target": PokemonBattleState.deserialize(serialized_battle_action["action_data"]["switch_target"])
      }
    return cls(
      actor=PokemonBattleState.deserialize(serialized_battle_action["actor"]),
      action_type=serialized_battle_action["action_type"],
      action_data=action_data
    )

  def serialize_api(self):
    action_data = {}
    if(self.action_type == 'move'):
      action_data = {
        'move': self.action_data['move'],
        'move_targets': self.action_data['move_targets']
      }
    elif(self.action_type == 'switch'):
      action_data = {
        'switch_target': self.action_data['switch_target'].serialize_api()
      }

    return {
      'actor': self.actor.serialize_api(),
      'action_type': self.action_type,
      'action_data': action_data
    }

class Battle():
  def __init__(
    self,
    config,
    turn_index,
    status,
    winner,
    battle_turns,
    battle_state
  ):
    self.config = config
    self.turn_index = turn_index
    self.status = status
    self.winner = winner
    self.battle_turns = battle_turns
    self.battle_state = battle_state

  @classmethod
  def create(cls, config, blue_side_pokemon, red_side_pokemon):
    return cls(
      config=config,
      turn_index=0,
      status="active",
      winner=None,
      battle_turns=[],
      battle_state=BattleState.create(config, blue_side_pokemon, red_side_pokemon)
    )

  def end_battle_turn(self, battle_events):
    self.turn_index += 1

    if(self.battle_state.blue_side_state.reflect > 0):
      self.battle_state.blue_side_state.reflect -= 1
    if(self.battle_state.red_side_state.reflect > 0):
      self.battle_state.red_side_state.reflect -= 1

    if(self.battle_state.blue_side_state.light_screen > 0):
      self.battle_state.blue_side_state.light_screen -= 1
    if(self.battle_state.red_side_state.light_screen > 0):
      self.battle_state.red_side_state.light_screen -= 1

    if(self.battle_state.blue_side_state.tailwind > 0):
      self.battle_state.blue_side_state.tailwind -= 1
    if(self.battle_state.red_side_state.tailwind > 0):
      self.battle_state.red_side_state.tailwind -= 1

    if(self.battle_state.global_state.terrain_counter > 0):
      self.battle_state.global_state.terrain_counter -= 1

    if(self.battle_state.global_state.weather_counter > 0):
      self.battle_state.global_state.weather_counter -= 1

    for battle_event in battle_events:
      # print(battle_event)
      continue

  def initial_step(self):
    turn_events = []
    turn_events.append(f"Battle Started!")

    if(battle.config.variant == 'doubles'):

      self.battle_state.blue_side_pokemon[0].location = 'field'
      self.battle_state.blue_side_pokemon[1].location = 'field'
      self.battle_state.blue_side_pokemon[2].location = 'party'
      self.battle_state.blue_side_pokemon[3].location = 'party'
      self.battle_state.red_side_pokemon[0].location = 'field'
      self.battle_state.red_side_pokemon[1].location = 'field'
      self.battle_state.red_side_pokemon[2].location = 'party'
      self.battle_state.red_side_pokemon[3].location = 'party'
      self.battle_state.field_state['blue-field-1'] = self.battle_state.blue_side_pokemon[0].battle_id
      self.battle_state.field_state['blue-field-2'] = self.battle_state.blue_side_pokemon[1].battle_id
      self.battle_state.field_state['red-field-1'] = self.battle_state.red_side_pokemon[0].battle_id
      self.battle_state.field_state['red-field-2'] = self.battle_state.red_side_pokemon[1].battle_id

      turn_events.append(f"Go {self.battle_state.blue_side_pokemon[0].pokemon_build.pokemon.ident}!")
      turn_events.append(f"Go {self.battle_state.blue_side_pokemon[1].pokemon_build.pokemon.ident}!")
      turn_events.append(f"Go {self.battle_state.red_side_pokemon[0].pokemon_build.pokemon.ident}!")
      turn_events.append(f"Go {self.battle_state.red_side_pokemon[1].pokemon_build.pokemon.ident}!")

    elif(battle.config.variant == 'singles'):
      self.battle_state.blue_side_pokemon[0].location = 'field'
      self.battle_state.red_side_pokemon[0].location = 'field'
      self.battle_state.field_state['blue-field-1'] = self.battle_state.blue_side_pokemon[0].battle_id
      self.battle_state.field_state['blue-field-2'] = self.battle_state.blue_side_pokemon[1].battle_id

      turn_events.append(f"Go {self.battle_state.blue_side_pokemon[0].pokemon_build.pokemon.ident}!")
      turn_events.append(f"Go {self.battle_state.red_side_pokemon[0].pokemon_build.pokemon.ident}!")

    self.battle_turns.append(turn_events)
    self.end_battle_turn(turn_events)

  def pokemon_battle_states(self):
    return self.battle_state.blue_side_pokemon + self.battle_state.red_side_pokemon

  def pokemon_battle_state_by_id(self, pokemon_battle_state_id):
    return find(self.pokemon_battle_states(), lambda x: x.battle_id == pokemon_battle_state_id)

  def possible_targets_for_move(self, actor_id, move_ident):
    actor_pokemon_battle_state = self.pokemon_battle_state_by_id(actor_id)
    if actor_pokemon_battle_state.location != "field":
      return []
    move_data = find(all_moves_data, lambda x: x.get("ident") == move_ident)
    move_target = move_data.get("target")

    self_ = []
    any_adjacent = []
    all_enemies = []
    all_adjacent = []
    self_and_allies = []

    if actor_pokemon_battle_state.battle_side == "blue":
      self_ = ["blue-field-1"]
      any_adjacent = ["red-field-1"]
      all_enemies = ["red-field-1"]
      all_adjacent = ["red-field-1"]
      self_and_allies = ["blue-field-1"]
    elif actor_pokemon_battle_state.battle_side == "red":
      self_ = ["red-field-1"]
      any_adjacent = ["blue-field-1"]
      all_enemies = ["blue-field-1"]
      all_adjacent = ["blue-field-1"]
      self_and_allies = ["red-field-1"]

    if move_target == "self":
      return self_
    elif move_target == "all-adjacent":
      return all_adjacent
    elif move_target == "all-enemies":
      return all_enemies
    elif move_target == "self-and-allies":
      return self_and_allies
    elif move_target == "field":
      return ["field"]
    else:
      return any_adjacent

  def available_actions_for_pokemon_battle_state(self, pokemon_battle_state_id):
    available_actions = []
    pokemon_battle_state = self.pokemon_battle_state_by_id(pokemon_battle_state_id)

    if not pokemon_battle_state.location == "field":
      return []
    else:
      for move_ident in pokemon_battle_state.pokemon_build.move_idents:
        available_actions.append(
          BattleAction(
            actor=pokemon_battle_state,
            action_type="move",
            action_data={
              "move": find(all_moves_data, lambda x: x.get("ident") == move_ident),
              "move_targets": self.possible_targets_for_move(pokemon_battle_state.battle_id, move_ident)
            }
          )
        )

      party_pokemons = self.party_pokemons(pokemon_battle_state.battle_side)
      for party_pokemon in party_pokemons:
        available_actions.append(
          BattleAction(
            actor=pokemon_battle_state,
            action_type="switch",
            action_data={
              "switch_target": party_pokemon
            }
          )
        )

      return available_actions

  def compare_battle_actions(self, battle_action_a, battle_action_b):
    pokemon_battle_state_a = self.pokemon_battle_state_by_id(battle_action_a.actor.battle_id)
    pokemon_battle_state_b = self.pokemon_battle_state_by_id(battle_action_b.actor.battle_id)

    if(battle_action_a.action_type == 'switch' and battle_action_b.action_type == 'move'):
      return -1
    elif(battle_action_b.action_type == 'switch' and battle_action_a.action_type == 'move'):
      return 1

    if(battle_action_a.action_type == 'move' and battle_action_b.action_type == 'move'):
      a_priority = battle_action_a.action_data['move'].get('priority')
      b_priority = battle_action_b.action_data['move'].get('priority')

      if(pokemon_battle_state_a.ability_ident == 'gale-wings' and battle_action_a.action_data['move'].get('type_ident') == 'flying' and pokemon_battle_state_a.current_hp == pokemon_battle_state_a.max_hp()):
        a_priority += 1
      if(pokemon_battle_state_b.ability_ident == 'gale-wings' and battle_action_b.action_data['move'].get('type_ident') == 'flying' and pokemon_battle_state_b.current_hp == pokemon_battle_state_b.max_hp()):
        b_priority += 1

      if(pokemon_battle_state_a.ability_ident == 'prankster' and battle_action_a.action_data['move'].get('category_ident') == 'non-damaging'):
        a_priority += 1
      if(pokemon_battle_state_b.ability_ident == 'prankster' and battle_action_b.action_data['move'].get('category_ident') == 'non-damaging'):
        b_priority += 1

      if(a_priority > b_priority):
        return -1
      if(b_priority > a_priority):
        return 1

    a_base_speed = pokemon_battle_state_a.pokemon_build.stat_spread.speed
    b_base_speed = pokemon_battle_state_b.pokemon_build.stat_spread.speed

    a_speed = a_base_speed * STAT_BOOST_MODIFIER_VALUES[f"{pokemon_battle_state_a.stat_boosts.speed}"]
    b_speed = b_base_speed * STAT_BOOST_MODIFIER_VALUES[f"{pokemon_battle_state_b.stat_boosts.speed}"]

    if((pokemon_battle_state_a.battle_side == "blue" and self.battle_state.blue_side_state.tailwind > 0) or (pokemon_battle_state_a.battle_side == "red" and self.battle_state.red_side_state.tailwind > 0)):
      a_speed *= 2
    if((pokemon_battle_state_b.battle_side == "blue" and self.battle_state.blue_side_state.tailwind > 0) or (pokemon_battle_state_b.battle_side == "red" and self.battle_state.red_side_state.tailwind > 0)):
      b_speed *= 2

    if(a_speed > b_speed):
      return -1
    elif(b_speed > a_speed):
      return 1
    elif(a_speed == b_speed):
      speed_tiebreak_value = np.random.random()
      if(speed_tiebreak_value > 0.5):
        return -1
      else:
        return 1

    return 0

  def order_battle_actions(self, battle_actions):
    return sorted(battle_actions, key=cmp_to_key(self.compare_battle_actions))

  def perform_battle_action(self, battle_action, hardcoded_stat_change_frequency_roll=None, hardcoded_random_roll=None, hardcoded_crit_roll=None):
    action_events = []
    should_end_battle = False
    STAT_CHANGE_FREQUENCY_ROLL = (1 - hardcoded_stat_change_frequency_roll) if hardcoded_stat_change_frequency_roll else np.random.random()

    actor_pokemon_id = battle_action.actor.battle_id
    actor_pokemon = find(self.pokemon_battle_states(), lambda x: x.battle_id == actor_pokemon_id)
    actor_slot = 'blue-field-1' if actor_pokemon.battle_side == 'blue' else 'red-field-1'

    if(actor_pokemon.location == 'graveyard'):
      return [action_events, should_end_battle]

    if(battle_action.action_type == 'switch'):
      actor = self.pokemon_battle_state_by_id(actor_pokemon.battle_id)
      target = self.pokemon_battle_state_by_id(battle_action.action_data['switch_target'].battle_id)
      actor.location = 'party'
      actor.stat_boosts = PokemonStatBoosts()
      action_events.append(f"{actor.pokemon_build.pokemon.ident} come back!")
      target.location = 'field'
      action_events.append(f"Go {target.pokemon_build.pokemon.ident}!")
      if(actor.battle_side == 'blue'):
        self.battle_state.field_state['blue-field-1'] = target.battle_id
      elif(actor_pokemon.battle_side == 'red'):
        self.battle_state.field_state['red-field-1'] = target.battle_id

    elif(battle_action.action_type == 'move'):
      move_ident = battle_action.action_data['move']['ident']
      action_events.append(f"{actor_pokemon.pokemon_build.pokemon.ident} used {move_ident}")
      target_slot = battle_action.action_data['move_targets'][0]

      if(target_slot == 'field'):

        if(move_ident == 'electric-terrain'):
          self.battle_state.global_state.set_terrain('electric')
        elif(move_ident == 'grassy-terrain'):
          self.battle_state.global_state.set_terrain('grassy')
        elif(move_ident == 'misty-terrain'):
          self.battle_state.global_state.set_terrain('misty')
        elif(move_ident == 'psychic-terrain'):
          self.battle_state.global_state.set_terrain('psychic')

        if(move_ident == 'rain-dance'):
          self.battle_state.global_state.set_weather('rain')
        elif(move_ident == 'sandstorm'):
          self.battle_state.global_state.set_weather('sandstorm')
        elif(move_ident == 'snowscape'):
          self.battle_state.global_state.set_weather('snow')
        elif(move_ident == 'sunny-day'):
          self.battle_state.global_state.set_weather('sun')

      else:
        target_pokemon_id = self.battle_state.field_state[target_slot]
        target_pokemon = find(self.pokemon_battle_states(), lambda x: x.battle_id == target_pokemon_id)

        if(battle_action.action_data["move"]["category_ident"] == "non-damaging"):
          if(move_ident == "reflect"):
            if(actor_pokemon.battle_side == "blue" and self.battle_state.blue_side_state.reflect == 0):
              self.battle_state.blue_side_state.reflect = 5
            elif(actor_pokemon.battle_side == "red" and self.battle_state.red_side_state.reflect == 0):
              self.battle_state.red_side_state.reflect = 5
          if(move_ident == "light-screen"):
            if(actor_pokemon.battle_side == "blue" and self.battle_state.blue_side_state.light_screen == 0):
              self.battle_state.blue_side_state.light_screen = 5
            elif(actor_pokemon.battle_side == "red" and self.battle_state.red_side_state.light_screen == 0):
              self.battle_state.red_side_state.light_screen = 5
          if(move_ident == "tailwind"):
            if(actor_pokemon.battle_side == "blue" and self.battle_state.blue_side_state.tailwind == 0):
              self.battle_state.blue_side_state.tailwind = 4
            elif(actor_pokemon.battle_side == "red" and self.battle_state.red_side_state.tailwind == 0):
              self.battle_state.red_side_state.tailwind = 4

        elif(battle_action.action_data['move']['category_ident'] in ['physical', 'special']):

          # DEFAULT MOVE BEHAVIOR
          # =====================
          damage = calculate_damage(
            battle_state=self.battle_state,
            attacking_pokemon=actor_pokemon,
            target_pokemon=target_pokemon,
            move_ident=battle_action.action_data['move']['ident'],
            hardcoded_random_roll=hardcoded_random_roll,
            hardcoded_crit_roll=hardcoded_crit_roll
          )
          target_pokemon_previous_hp = target_pokemon.current_hp
          damage_taken = target_pokemon.take_damage(damage)
          action_events.append(f"{target_pokemon.pokemon_build.pokemon.ident} took {math.floor(round(damage_taken / target_pokemon.max_hp(), 2) * 100)}% damage")

          if(battle_action.action_data['move'].get('recoil')):
            if(battle_action.action_data['move']['recoil'].get('percentage_of_damage')):
              recoil_amount = np.round(damage_taken * battle_action.action_data['move']['recoil'].get('percentage_of_damage'))
              actor_pokemon_previous_hp = actor_pokemon.current_hp
              recoil_damage_taken = actor_pokemon.take_damage(recoil_amount)
              action_events.append(f"{actor_pokemon.pokemon_build.pokemon.ident} took {math.floor(round(recoil_damage_taken / actor_pokemon.max_hp(), 2) * 100)}% damage in recoil")

          if(battle_action.action_data['move'].get('recovery')):
            if(battle_action.action_data['move']['recovery'].get('percentage_of_damage')):
              recovery_amount = np.round(damage_taken * battle_action.action_data['move']['recovery'].get('percentage_of_damage'))
              actor_pokemon_previous_hp = actor_pokemon.current_hp
              recovery_taken = actor_pokemon.recover_hp(recovery_amount)
              action_events.append(f"{actor_pokemon.pokemon_build.pokemon.ident} recovered {math.floor(round(recovery_taken / actor_pokemon.max_hp(), 2) * 100)}% hp")

          # CUSTOM MOVE BEHAVIOR
          # =====================
          if(battle_action.action_data['move']['ident'] == 'knock-off' and target_pokemon.item_ident != None):
            knocked_off_item_ident = target_pokemon.item_ident
            target_pokemon.item_ident = None
            action_events.append(f"{target_pokemon.pokemon_build.pokemon.ident} had {knocked_off_item_ident} knocked off!")

          # POKEMON FAINTS
          # =====================
          if(target_pokemon.current_hp == 0):
            target_pokemon.location = "graveyard"
            self.battle_state.field_state[target_slot] = None
            action_events.append(f"{target_pokemon.pokemon_build.pokemon.ident} fainted")
            possible_replacement_pokemons = self.party_pokemons(target_pokemon.battle_side)
            if(len(possible_replacement_pokemons) > 0):
              replacement_pokemon = np.random.choice(possible_replacement_pokemons)
              replacement_pokemon.location = "field"
              self.battle_state.field_state[target_slot] = replacement_pokemon.battle_id
              action_events.append(f"Go {replacement_pokemon.pokemon_build.pokemon.ident}!")
            else:
              should_end_battle = True
              action_events.append("THE BATTLE IS OVER")
          if(actor_pokemon.current_hp == 0):
            actor_pokemon.location = "graveyard"
            self.battle_state.field_state[actor_slot] = None
            action_events.append(f"{actor_pokemon.pokemon_build.pokemon.ident} fainted")
            possible_replacement_pokemons = self.party_pokemons(actor_pokemon.battle_side)
            if(len(possible_replacement_pokemons) > 0):
              replacement_pokemon = np.random.choice(possible_replacement_pokemons)
              replacement_pokemon.location = "field"
              self.battle_state.field_state[actor_slot] = replacement_pokemon.battle_id
              action_events.append(f"Go {replacement_pokemon.pokemon_build.pokemon.ident}!")
            elif not should_end_battle:
              should_end_battle = True
              action_events.append("THE BATTLE IS OVER")

      # STAT BOOSTS
      # =====================
      if(battle_action.action_data['move'].get('stat_changes')):
        target_stat_change = battle_action.action_data['move']['stat_changes'][0]
        target_boost_pokemon = actor_pokemon if target_stat_change.get('target') == 'self' else target_pokemon
        if((not target_boost_pokemon.fainted()) and (not should_end_battle) and (target_stat_change['frequency'] >= STAT_CHANGE_FREQUENCY_ROLL)):
          if(target_stat_change.get('attack')):
            next_stat_value = max(min(target_boost_pokemon.stat_boosts.attack + target_stat_change.get('attack'), 6), -6)
            target_boost_pokemon.stat_boosts.attack = next_stat_value
            action_events.append(f"{target_boost_pokemon.pokemon_build.pokemon.ident} attack now {next_stat_value}")
          if(target_stat_change.get('defense')):
            next_stat_value = max(min(target_boost_pokemon.stat_boosts.defense + target_stat_change.get('defense'), 6), -6)
            target_boost_pokemon.stat_boosts.defense = next_stat_value
            action_events.append(f"{target_boost_pokemon.pokemon_build.pokemon.ident} defense now {next_stat_value}")
          if(target_stat_change.get('special_attack')):
            next_stat_value = max(min(target_boost_pokemon.stat_boosts.special_attack + target_stat_change.get('special_attack'), 6), -6)
            target_boost_pokemon.stat_boosts.special_attack = next_stat_value
            action_events.append(f"{target_boost_pokemon.pokemon_build.pokemon.ident} special attack now {next_stat_value}")
          if(target_stat_change.get('special_defense')):
            next_stat_value = max(min(target_boost_pokemon.stat_boosts.special_defense + target_stat_change.get('special_defense'), 6), -6)
            target_boost_pokemon.stat_boosts.special_defense = next_stat_value
            action_events.append(f"{target_boost_pokemon.pokemon_build.pokemon.ident} special defense now {next_stat_value}")
          if(target_stat_change.get('speed')):
            next_stat_value = max(min(target_boost_pokemon.stat_boosts.speed + target_stat_change.get('speed'), 6), -6)
            target_boost_pokemon.stat_boosts.speed = next_stat_value
            action_events.append(f"{target_boost_pokemon.pokemon_build.pokemon.ident} speed now {next_stat_value}")
          if(target_stat_change.get('critical_hit')):
            next_stat_value = max(min(target_boost_pokemon.stat_boosts.critical_hit + target_stat_change.get('critical_hit'), 3), 0)
            target_boost_pokemon.stat_boosts.critical_hit = next_stat_value
            action_events.append(f"{target_boost_pokemon.pokemon_build.pokemon.ident} critical hit stage now {next_stat_value}")
          if(target_stat_change.get('all')):
            next_attack_value = max(min(target_boost_pokemon.stat_boosts.attack + target_stat_change.get('all'), 6), -6)
            next_defense_value = max(min(target_boost_pokemon.stat_boosts.defense + target_stat_change.get('all'), 6), -6)
            next_special_attack_value = max(min(target_boost_pokemon.stat_boosts.special_attack + target_stat_change.get('all'), 6), -6)
            next_special_defense_value = max(min(target_boost_pokemon.stat_boosts.special_defense + target_stat_change.get('all'), 6), -6)
            next_speed_value = max(min(target_boost_pokemon.stat_boosts.speed + target_stat_change.get('all'), 6), -6)
            target_boost_pokemon.stat_boosts.attack = next_attack_value
            target_boost_pokemon.stat_boosts.defense = next_defense_value
            target_boost_pokemon.stat_boosts.special_attack = next_special_attack_value
            target_boost_pokemon.stat_boosts.special_defense = next_special_defense_value
            target_boost_pokemon.stat_boosts.speed = next_speed_value
            action_events.append(f"{target_boost_pokemon.pokemon_build.pokemon.ident} attack now {next_attack_value}")
            action_events.append(f"{target_boost_pokemon.pokemon_build.pokemon.ident} defense now {next_defense_value}")
            action_events.append(f"{target_boost_pokemon.pokemon_build.pokemon.ident} special attack now {next_special_attack_value}")
            action_events.append(f"{target_boost_pokemon.pokemon_build.pokemon.ident} special defense now {next_special_defense_value}")
            action_events.append(f"{target_boost_pokemon.pokemon_build.pokemon.ident} speed now {next_speed_value}")

    return [action_events, should_end_battle]

  def step(self, blue_actions, red_actions):
    turn_events = []
    battle_actions = blue_actions + red_actions
    ordered_battle_actions = self.order_battle_actions(battle_actions)
    for battle_action in ordered_battle_actions:
      action_events, should_end_battle = self.perform_battle_action(battle_action)
      turn_events += action_events
      if(should_end_battle):
        self.status = "complete"
        self.winner = battle_action.actor.battle_side
        break
    self.battle_turns.append(turn_events)
    self.end_battle_turn(turn_events)

  # CONVENIENCE HELPERS
  # =====================
  def field_pokemon(self, side):
    return self.battle_state.field_pokemon(side)

  def alive_pokemons(self, side):
    return self.battle_state.alive_pokemons(side)

  def party_pokemons(self, side):
    return self.battle_state.party_pokemons(side)

  # SERIALIZERS
  # =====================
  @classmethod
  def deserialize(cls, serialized_battle):
    return cls(
      config=serialized_battle["config"],
      turn_index=serialized_battle["turn_index"],
      status=serialized_battle["status"],
      winner=serialized_battle["winner"],
      battle_turns=serialized_battle["battle_turns"],
      battle_state=BattleState.deserialize(serialized_battle["battle_state"])
    )

  def serialize_api(self):
    return {
      "config": self.config,
      "turn_index": self.turn_index,
      "status": self.status,
      "winner": self.winner,
      "battle_turns": self.battle_turns,
      "battle_state": self.battle_state.serialize_api()
    }
  def serialize_ml(self):
    return flatten([
      variant_mapping(self.config.get('variant')),
      np.float32(self.turn_index),
      self.battle_state.serialize_ml()
    ])
