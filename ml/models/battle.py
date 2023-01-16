from models.pokemon_battle_state import PokemonBattleState, PokemonStatBoosts
from models.battle_state import BattleState
from helpers import find, flatten
from mappings import battle_status_mapping, battle_side_mapping
from damage_calculation import calculate_damage

from functools import cmp_to_key
from pathlib import Path
import json
import traceback
from pprint import pprint
import numpy as np
import math
import ipdb

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
  def __init__(self, slot, action_type, action_data):
    self.slot = slot
    self.action_type = action_type
    self.action_data = action_data

  @classmethod
  def deserialize(cls, serialized_battle_action):
    return cls(
      slot=serialized_battle_action.get('slot'),
      action_type=serialized_battle_action.get('action_type'),
      action_data=serialized_battle_action.get('action_data')
    )

  def serialize_api(self):
    action_data = {}
    if(self.action_type == 'move'):
      action_data = {
        'move': self.action_data.get('move'),
        'move_targets': self.action_data.get('move_targets'),
        'selected_targets': self.action_data.get('selected_targets')
      }
    elif(self.action_type == 'switch'):
      action_data = {
        'switch_target_battle_id': self.action_data.get('switch_target_battle_id'),
        'switch_target_pokemon_ident': self.action_data.get('switch_target_pokemon_ident')
      }
    elif(self.action_type == 'replace'):
      action_data = {
        'replace_target_battle_id': self.action_data.get('replace_target_battle_id'),
        'replace_target_pokemon_ident': self.action_data.get('replace_target_pokemon_ident')
      }

    return {
      'slot': self.slot,
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
    battle_state,
    active_prompt_slot,
    pending_battle_actions
  ):
    self.config = config
    self.turn_index = turn_index
    self.status = status
    self.winner = winner
    self.battle_turns = battle_turns
    self.battle_state = battle_state
    self.active_prompt_slot = active_prompt_slot
    self.pending_battle_actions = pending_battle_actions

    self.ml_turns = []

  @classmethod
  def create(cls, config, blue_side_pokemon, red_side_pokemon):
    return cls(
      config=config,
      turn_index=0,
      status="active",
      winner=None,
      battle_turns=[],
      battle_state=BattleState.create(config, blue_side_pokemon, red_side_pokemon),
      active_prompt_slot=None,
      pending_battle_actions=[]
    )

  def end_battle_turn(self, battle_events):
    self.turn_index += 1
    self.pending_battle_actions = []

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

    if(self.config.get('variant') == 'doubles'):

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

    elif(self.config.get('variant') == 'singles'):
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
    actor_slot = self.current_pokemon_slot(actor_id)
    if actor_pokemon_battle_state.location != "field":
      return []
    move_data = find(all_moves_data, lambda x: x.get("ident") == move_ident)
    move_target = move_data.get("target")

    ALL_SLOTS = ['blue-field-1', 'blue-field-2', 'red-field-1', 'red-field-2']

    self_ = [actor_slot]
    any_adjacent = [slot for slot in ALL_SLOTS if slot not in [actor_slot]]
    all_enemies = []
    all_adjacent = [slot for slot in ALL_SLOTS if slot not in [actor_slot]]
    self_and_allies = []

    if actor_pokemon_battle_state.battle_side == "blue":
      all_enemies = ["red-field-1", "red-field-2"]
      self_and_allies = ["blue-field-1", "blue-field-2"]
    elif actor_pokemon_battle_state.battle_side == "red":
      all_enemies = ["blue-field-1", "blue-field-2"]
      self_and_allies = ["red-field-1", "red-field-2"]

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
    elif move_target == "team":
      return ["team"]
    else:
      return any_adjacent

  def ml_valid_actions_for_slot(self, slot):
    pokemon_battle_state = self.pokemon_battle_state_at_slot(slot)
    valid_actions = []

    if(self.active_prompt_slot):
      if(slot == self.active_prompt_slot):
        if(slot in ['blue-field-1', 'blue-field-2']):
          for i in [0, 1, 2, 3]:
            if(self.battle_state.blue_side_pokemon[i].location == 'party'):
              valid_actions.append(17 + i)
        elif(slot in ['red-field-1', 'red-field-2']):
          for i in [0, 1, 2, 3]:
            if(self.battle_state.red_side_pokemon[i].location == 'party'):
              valid_actions.append(17 + i)
      else:
        valid_actions = [0]
    elif(not pokemon_battle_state):
      valid_actions = [0]
    else:
      for index, move_ident in enumerate(pokemon_battle_state.pokemon_build.move_idents):
        move_data = find(all_moves_data, lambda x: x.get('ident') == move_ident)
        if(move_data):
          move_target = move_data.get('target')
          if(move_target == 'any-adjacent'):
            valid_actions.append(2 + (index * 4))
            valid_actions.append(3 + (index * 4))
            valid_actions.append(4 + (index * 4))
          else:
            valid_actions.append(1 + (index * 4))
        else:
          continue
      if(slot in ['blue-field-1', 'blue-field-2']):
        for i in [0, 1, 2, 3]:
          if(self.battle_state.blue_side_pokemon[i].location == 'party'):
            valid_actions.append(17 + i)
      elif(slot in ['red-field-1', 'red-field-2']):
        for i in [0, 1, 2, 3]:
          if(self.battle_state.red_side_pokemon[i].location == 'party'):
            valid_actions.append(17 + i)

    return valid_actions

  def ml_valid_actions_for_side(self, side):
    field_slots = ['blue-field-1', 'blue-field-2'] if side == 'blue' else ['red-field-1', 'red-field-2']
    slot_1_valid_actions = self.ml_valid_actions_for_slot(field_slots[0])
    slot_2_valid_actions = self.ml_valid_actions_for_slot(field_slots[1])
    side_valid_actions = []

    all_slot_actions = self.ml_available_actions_for_slot()
    for index_1, slot_action_1 in enumerate(all_slot_actions):
      if(index_1 in slot_1_valid_actions):
        for index_2, slot_action_2 in enumerate(all_slot_actions):
          if(index_2 in slot_2_valid_actions):
            side_valid_actions.append(index_2 + (index_1 * len(all_slot_actions)))
      else:
        continue

    side_valid_actions = list(filter(lambda x: x not in [374, 396, 418, 440], side_valid_actions))
    return side_valid_actions

  def ml_available_actions_for_side(self):
    side_actions = []
    slot_actions = self.ml_available_actions_for_slot()
    for slot_action in slot_actions:
      for slot_action2 in slot_actions:
        composite_action = [slot_action, slot_action2]
        side_actions.append(composite_action)
    return side_actions

  def ml_available_actions_for_slot(self):
    return [
      ["NO-OP", None],
      ["move1", "no-targeting"],
      ["move1", "target-ally"],
      ["move1", "target-enemy-1"],
      ["move1", "target-enemy-2"],
      ["move2", "no-targeting"],
      ["move2", "target-ally"],
      ["move2", "target-enemy-1"],
      ["move2", "target-enemy-2"],
      ["move3", "no-targeting"],
      ["move3", "target-ally"],
      ["move3", "target-enemy-1"],
      ["move3", "target-enemy-2"],
      ["move4", "no-targeting"],
      ["move4", "target-ally"],
      ["move4", "target-enemy-1"],
      ["move4", "target-enemy-2"],
      ["switch", "pokemon1"],
      ["switch", "pokemon2"],
      ["switch", "pokemon3"],
      ["switch", "pokemon4"]
    ]

  def ml_action_to_battle_action(self, slot, ml_action):
    pokemon_battle_state = self.pokemon_battle_state_at_slot(slot)

    if(ml_action[0] == 'NO-OP'):
      return None
    elif(ml_action[0] in ['move1', 'move2', 'move3', 'move4']):
      move_index = 0
      if(ml_action[0] == 'move1'):
        move_index = 0
      if(ml_action[0] == 'move2'):
        move_index = 1
      if(ml_action[0] == 'move3'):
        move_index = 2
      if(ml_action[0] == 'move4'):
        move_index = 3
      move_ident = pokemon_battle_state.pokemon_build.move_idents[move_index]
      move_data = find(all_moves_data, lambda x: x.get("ident") == move_ident)
      selected_targets = []
      if(ml_action[1] == 'target-ally'):
        selected_targets.append(self.adjacent_side_slot(slot))
      elif(ml_action[1] == 'target-enemy-1'):
        if(slot in ['blue-field-1', 'blue-field-2']):
          selected_targets.append('red-field-1')
        elif(slot in ['red-field-1', 'red-field-2']):
          selected_targets.append('blue-field-1')
      elif(ml_action[1] == 'target-enemy-2'):
        if(slot in ['blue-field-1', 'blue-field-2']):
          selected_targets.append('red-field-2')
        elif(slot in ['red-field-1', 'red-field-2']):
          selected_targets.append('blue-field-2')

      return BattleAction(
        slot=slot,
        action_type='move',
        action_data={
          'move': move_data,
          'selected_targets': selected_targets
        }
      )
    elif(ml_action[0] == 'switch'):
      target_switch_index = 0
      if(ml_action[1] == 'pokemon1'):
        target_switch_index = 0
      if(ml_action[1] == 'pokemon2'):
        target_switch_index = 1
      if(ml_action[1] == 'pokemon3'):
        target_switch_index = 2
      if(ml_action[1] == 'pokemon4'):
        target_switch_index = 3

      target_switch_pokemon = self.battle_state.blue_side_pokemon[target_switch_index] if slot in ['blue-field-1', 'blue-field-2'] else self.battle_state.red_side_pokemon[target_switch_index]

      if(self.active_prompt_slot):
        return BattleAction(
          slot=slot,
          action_type='replace',
          action_data={
            'replace_target_battle_id': target_switch_pokemon.battle_id,
            'switch_target_pokemon_ident': target_switch_pokemon.pokemon_build.pokemon.ident
          }
        )
      else:
        return BattleAction(
          slot=slot,
          action_type='switch',
          action_data={
            'switch_target_battle_id': target_switch_pokemon.battle_id,
            'switch_target_pokemon_ident': target_switch_pokemon.pokemon_build.pokemon.ident
          }
        )

  def available_actions_for_battle_state(self, serialized=False):
    available_actions = {}

    for slot in ['blue-field-1', 'blue-field-2', 'red-field-1', 'red-field-2']:
      available_actions_at_slot = self.available_actions_for_slot(slot)
      if(serialized):
        available_actions[slot] = list(map(lambda x: x.serialize_api(), available_actions_at_slot))
      else:
        available_actions[slot] = available_actions_at_slot

    return available_actions

  def available_actions_for_slot(self, slot):
    available_actions = []

    if (self.active_prompt_slot):
      if(self.active_prompt_slot == slot):
        party_pokemons = self.party_pokemons('blue') if self.active_prompt_slot in ['blue-field-1', 'blue-field-2'] else self.party_pokemons('red')
        for party_pokemon in party_pokemons:
          available_actions.append(
            BattleAction(
              slot=slot,
              action_type='replace',
              action_data={
                'replace_target_battle_id': party_pokemon.battle_id,
                'replace_target_pokemon_ident': party_pokemon.pokemon_build.pokemon.ident
              }
            )
          )
      else:
        available_actions = []
    else:
      pokemon_battle_state = self.pokemon_battle_state_at_slot(slot)
      if(not pokemon_battle_state or not pokemon_battle_state.location == 'field'):
        available_actions = []
      else:
        for move_ident in pokemon_battle_state.pokemon_build.move_idents:
          available_actions.append(
            BattleAction(
              slot=slot,
              action_type='move',
              action_data={
                'move': find(all_moves_data, lambda x: x.get('ident') == move_ident),
                'move_targets': self.possible_targets_for_move(pokemon_battle_state.battle_id, move_ident),
                'selected_targets': []
              }
            )
          )

        party_pokemons = self.party_pokemons(pokemon_battle_state.battle_side)
        for party_pokemon in party_pokemons:
          available_actions.append(
            BattleAction(
              slot=slot,
              action_type='switch',
              action_data={
                'switch_target_battle_id': party_pokemon.battle_id,
                'switch_target_pokemon_ident': party_pokemon.pokemon_build.pokemon.ident
              }
            )
          )

    return available_actions

  def compare_battle_actions(self, battle_action_a, battle_action_b):
    pokemon_battle_state_a = self.pokemon_battle_state_at_slot(battle_action_a.slot)
    pokemon_battle_state_b = self.pokemon_battle_state_at_slot(battle_action_b.slot)

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

  def roll_stat_boosts_for_target(self, target_stat_change, target_boost_pokemon, action_events, hardcoded_stat_change_frequency_roll=None):
    STAT_CHANGE_FREQUENCY_ROLL = (1 - hardcoded_stat_change_frequency_roll) if hardcoded_stat_change_frequency_roll else np.random.random()
    if((target_stat_change.get('frequency') >= STAT_CHANGE_FREQUENCY_ROLL)):
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

    return action_events

  def perform_replace_pokemon_action(self, battle_action):
    replacement_pokemon = self.pokemon_battle_state_by_id(battle_action.action_data.get('replace_target_battle_id'))
    replacement_pokemon.location = "field"
    self.battle_state.field_state[battle_action.slot] = replacement_pokemon.battle_id
    self.battle_turns[-1].append(f"Go {replacement_pokemon.pokemon_build.pokemon.ident}!")

  def perform_battle_action(self, battle_action, hardcoded_stat_change_frequency_roll=None, hardcoded_random_roll=None, hardcoded_crit_roll=None):
    action_events = []
    should_end_battle = False
    replace_pokemon_action_slot = None

    actor_slot = battle_action.slot
    actor_pokemon = self.pokemon_battle_state_at_slot(actor_slot)

    if(not actor_pokemon):
      return [action_events, should_end_battle, replace_pokemon_action_slot]

    if(battle_action.action_type == 'switch'):
      target_pokemon = self.pokemon_battle_state_by_id(battle_action.action_data.get('switch_target_battle_id'))
      actor_pokemon.location = 'party'
      actor_pokemon.stat_boosts = PokemonStatBoosts()
      action_events.append(f"{actor_pokemon.pokemon_build.pokemon.ident} come back!")
      target_pokemon.location = 'field'
      action_events.append(f"Go {target_pokemon.pokemon_build.pokemon.ident}!")
      self.battle_state.field_state[actor_slot] = target_pokemon.battle_id

    elif(battle_action.action_type == 'move'):
      move_ident = battle_action.action_data['move']['ident']
      action_events.append(f"{actor_pokemon.pokemon_build.pokemon.ident} used {move_ident}")

      target_slots = battle_action.action_data.get('selected_targets') if battle_action.action_data['move'].get('target') == 'any-adjacent' else self.possible_targets_for_move(actor_pokemon.battle_id, move_ident)
      targeting_value = 'spread' if len(target_slots) > 1 else 'single'

      for target_slot in target_slots:
        active_target_slot = target_slot

        if(active_target_slot == 'field'):
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

        if(active_target_slot == 'team'):
          if(move_ident == 'reflect'):
            if(actor_pokemon.battle_side == 'blue' and self.battle_state.blue_side_state.reflect == 0):
              self.battle_state.blue_side_state.reflect = 5
            elif(actor_pokemon.battle_side == 'red' and self.battle_state.red_side_state.reflect == 0):
              self.battle_state.red_side_state.reflect = 5
          if(move_ident == 'light-screen'):
            if(actor_pokemon.battle_side == 'blue' and self.battle_state.blue_side_state.light_screen == 0):
              self.battle_state.blue_side_state.light_screen = 5
            elif(actor_pokemon.battle_side == 'red' and self.battle_state.red_side_state.light_screen == 0):
              self.battle_state.red_side_state.light_screen = 5
          if(move_ident == 'tailwind'):
            if(actor_pokemon.battle_side == 'blue' and self.battle_state.blue_side_state.tailwind == 0):
              self.battle_state.blue_side_state.tailwind = 4
            elif(actor_pokemon.battle_side == 'red' and self.battle_state.red_side_state.tailwind == 0):
              self.battle_state.red_side_state.tailwind = 4

        else:
          target_pokemon_id = self.battle_state.field_state.get(active_target_slot)
          target_pokemon = self.pokemon_battle_state_by_id(target_pokemon_id)
          if(not target_pokemon and targeting_value == 'single'):
            active_target_slot = self.adjacent_side_slot(target_slot)
            target_pokemon_id = self.battle_state.field_state.get(active_target_slot)
            target_pokemon = self.pokemon_battle_state_by_id(target_pokemon_id)

          if(battle_action.action_data['move']['category_ident'] == 'non-damaging'):
            continue

          elif(battle_action.action_data['move']['category_ident'] in ['physical', 'special']):
            if(not target_pokemon):
              continue

            # DEFAULT MOVE BEHAVIOR
            # =====================
            damage = calculate_damage(
              battle_state=self.battle_state,
              attacking_pokemon=actor_pokemon,
              target_pokemon=target_pokemon,
              move_ident=battle_action.action_data['move']['ident'],
              hardcoded_random_roll=hardcoded_random_roll,
              hardcoded_crit_roll=hardcoded_crit_roll,
              hardcoded_targeting_value=targeting_value
            )
            target_pokemon_previous_hp = target_pokemon.current_hp
            damage_taken = target_pokemon.take_damage(damage)
            action_events.append(f"{target_pokemon.pokemon_build.pokemon.ident} took {math.floor(round(damage_taken / target_pokemon.max_hp(), 2) * 100)}% damage")

            # RECOIL
            # =====================
            if(battle_action.action_data['move'].get('recoil')):
              if(battle_action.action_data['move']['recoil'].get('percentage_of_damage')):
                recoil_amount = np.round(damage_taken * battle_action.action_data['move']['recoil'].get('percentage_of_damage'))
                actor_pokemon_previous_hp = actor_pokemon.current_hp
                recoil_damage_taken = actor_pokemon.take_damage(recoil_amount)
                action_events.append(f"{actor_pokemon.pokemon_build.pokemon.ident} took {math.floor(round(recoil_damage_taken / actor_pokemon.max_hp(), 2) * 100)}% damage in recoil")

            # RECOVERY
            # =====================
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
            if(battle_action.action_data['move'].get('should_switch_out_user') and len(self.party_pokemons(actor_pokemon.battle_side)) > 0):
              actor_pokemon.location = "party"
              self.battle_state.field_state[battle_action.slot] = None
              replace_pokemon_action_slot = battle_action.slot

            # POKEMON FAINTS
            # =====================
            if(target_pokemon.current_hp == 0):
              target_pokemon.location = "graveyard"
              self.battle_state.field_state[active_target_slot] = None
              action_events.append(f"{target_pokemon.pokemon_build.pokemon.ident} fainted")
              possible_replacement_pokemons = self.party_pokemons(target_pokemon.battle_side)
              if(self.pokemon_battle_state_at_slot(self.adjacent_side_slot(active_target_slot))):
                possible_replacement_pokemons += [self.pokemon_battle_state_at_slot(self.adjacent_side_slot(active_target_slot))]
              if(len(possible_replacement_pokemons) == 0):
                should_end_battle = True
                action_events.append("THE BATTLE IS OVER")
            if(actor_pokemon.current_hp == 0):
              actor_pokemon.location = "graveyard"
              self.battle_state.field_state[actor_slot] = None
              action_events.append(f"{actor_pokemon.pokemon_build.pokemon.ident} fainted")
              possible_replacement_pokemons = self.party_pokemons(actor_pokemon.battle_side)
              if(self.pokemon_battle_state_at_slot(self.adjacent_side_slot(battle_action.slot))):
                possible_replacement_pokemons += [self.pokemon_battle_state_at_slot(self.adjacent_side_slot(battle_action.slot))]
              if(len(possible_replacement_pokemons) == 0 and not should_end_battle):
                should_end_battle = True
                action_events.append("THE BATTLE IS OVER")

        # TARGET STAT BOOSTS
        # =====================
        if(battle_action.action_data['move'].get('stat_changes')):
          target_stat_change = battle_action.action_data['move']['stat_changes'][0]
          target_boost_pokemon = target_pokemon
          if((not target_stat_change.get('target') == 'self') and (not target_boost_pokemon.fainted()) and (not should_end_battle)):
            action_events = self.roll_stat_boosts_for_target(target_stat_change, target_boost_pokemon, action_events, hardcoded_stat_change_frequency_roll)

      # SELF STAT BOOSTS
      # =====================
      if(battle_action.action_data['move'].get('stat_changes')):
        target_stat_change = battle_action.action_data['move']['stat_changes'][0]
        target_boost_pokemon = actor_pokemon
        if(target_stat_change.get('target') == 'self' and (not target_boost_pokemon.fainted()) and (not should_end_battle)):
          action_events = self.roll_stat_boosts_for_target(target_stat_change, target_boost_pokemon, action_events, hardcoded_stat_change_frequency_roll)

    return [action_events, should_end_battle, replace_pokemon_action_slot]

  def ml_step(self, blue_action_index, red_action_index):
    blue_chosen_action = self.ml_available_actions_for_side()[blue_action_index]
    red_chosen_action = self.ml_available_actions_for_side()[red_action_index]

    self.ml_turns.append({"blue": blue_chosen_action, "red": red_chosen_action})

    blue_battle_actions = [self.ml_action_to_battle_action('blue-field-1', blue_chosen_action[0]), self.ml_action_to_battle_action('blue-field-2', blue_chosen_action[1])]
    red_battle_actions = [self.ml_action_to_battle_action('red-field-1', red_chosen_action[0]), self.ml_action_to_battle_action('red-field-2', red_chosen_action[1])]

    if(self.active_prompt_slot):
      if(self.active_prompt_slot == 'blue-field-1'):
        self.replace_pokemon_step(blue_battle_actions[0])
      elif(self.active_prompt_slot == 'blue-field-2'):
        self.replace_pokemon_step(blue_battle_actions[1])
      elif(self.active_prompt_slot == 'red-field-1'):
        self.replace_pokemon_step(red_battle_actions[0])
      elif(self.active_prompt_slot == 'red-field-2'):
        self.replace_pokemon_step(red_battle_actions[1])
    else:
      blue_battle_actions = [i for i in blue_battle_actions if i is not None]
      red_battle_actions = [i for i in red_battle_actions if i is not None]
      self.step(blue_battle_actions, red_battle_actions)

  def step(self, blue_actions, red_actions):
    turn_events = []
    battle_actions = blue_actions + red_actions
    ordered_battle_actions = self.order_battle_actions(battle_actions)
    for index, battle_action in enumerate(ordered_battle_actions):
      action_events, should_end_battle, replace_pokemon_action_slot = self.perform_battle_action(battle_action)
      turn_events += action_events
      if(should_end_battle):
        self.status = 'complete'
        self.winner = 'blue' if battle_action.slot in ['blue-field-1', 'blue-field-2'] else 'red'
        break
      if(replace_pokemon_action_slot):
        self.active_prompt_slot = replace_pokemon_action_slot
        self.pending_battle_actions = ordered_battle_actions[(index+1):]
        break

    self.battle_turns.append(turn_events)

    for slot in ['blue-field-1', 'blue-field-2', 'red-field-1', 'red-field-2']:
      if(not self.battle_state.field_state.get(slot) and not self.active_prompt_slot and len(self.party_pokemons(self.slot_side(slot))) > 0):
        self.active_prompt_slot = slot

    if(not self.active_prompt_slot):
      self.end_battle_turn(turn_events)

  def replace_pokemon_step(self, battle_action):
    turn_events = []
    self.active_prompt_slot = None
    self.perform_replace_pokemon_action(battle_action)
    for index, battle_action in enumerate(self.pending_battle_actions):
      action_events, should_end_battle, replace_pokemon_action_slot = self.perform_battle_action(battle_action)
      turn_events += action_events
      if(should_end_battle):
        self.status = 'complete'
        self.winner = 'blue' if battle_action.slot in ['blue-field-1', 'blue-field-2'] else 'red'
        break
      if(replace_pokemon_action_slot):
        self.active_prompt_slot = replace_pokemon_action_slot
        self.pending_battle_actions = self.pending_battle_actions[(index+1):]
        break

    for turn_event in turn_events:
      self.battle_turns[-1].append(turn_event)

    for slot in ['blue-field-1', 'blue-field-2', 'red-field-1', 'red-field-2']:
      if(not self.battle_state.field_state.get(slot) and not self.active_prompt_slot and len(self.party_pokemons(self.slot_side(slot))) > 0):
        self.active_prompt_slot = slot

    if(not self.active_prompt_slot):
      self.end_battle_turn(self.battle_turns[-1])

  # CONVENIENCE HELPERS
  # =====================
  def field_pokemon(self, side):
    return self.battle_state.field_pokemon(side)

  def alive_pokemons(self, side):
    return self.battle_state.alive_pokemons(side)

  def party_pokemons(self, side):
    return self.battle_state.party_pokemons(side)

  def current_pokemon_slot(self, pokemon_battle_id):
    if(self.battle_state.field_state.get('blue-field-1') == pokemon_battle_id):
      return 'blue-field-1'
    elif(self.battle_state.field_state.get('blue-field-2') == pokemon_battle_id):
      return 'blue-field-2'
    elif(self.battle_state.field_state.get('red-field-1') == pokemon_battle_id):
      return 'red-field-1'
    elif(self.battle_state.field_state.get('red-field-2') == pokemon_battle_id):
      return 'red-field-2'

  def pokemon_battle_state_at_slot(self, slot):
    pokemon_battle_id = self.battle_state.field_state.get(slot)
    return self.pokemon_battle_state_by_id(pokemon_battle_id)

  def slot_side(self, slot):
    if(slot in ['blue-field-1', 'blue-field-2']):
      return 'blue'
    elif(slot in ['red-field-1', 'red-field-2']):
      return 'red'

  def enemy_side_slots(self, slot):
    if(slot in ['blue-field-1', 'blue-field-2']):
      return ['red-field-1', 'red-field-2']
    elif(slot in ['red-field-1', 'red-field-2']):
      return ['blue-field-1', 'blue-field-2']

  def adjacent_side_slot(self, slot):
    if(slot == 'blue-field-1'):
      return 'blue-field-2'
    elif(slot == 'blue-field-2'):
      return 'blue-field-1'
    elif(slot == 'red-field-1'):
      return 'red-field-2'
    elif(slot == 'red-field-2'):
      return 'red-field-1'
    else:
      return None

  # SERIALIZERS
  # =====================
  @classmethod
  def deserialize(cls, serialized_battle):
    return cls(
      config=serialized_battle.get('config'),
      turn_index=serialized_battle.get('turn_index'),
      status=serialized_battle.get('status'),
      winner=serialized_battle.get('winner'),
      battle_turns=serialized_battle.get('battle_turns'),
      battle_state=BattleState.deserialize(serialized_battle.get('battle_state')),
      active_prompt_slot=serialized_battle.get('active_prompt_slot'),
      pending_battle_actions=list(map(lambda x: BattleAction.deserialize(x), serialized_battle.get('pending_battle_actions')))
    )

  def serialize_api(self):
    return {
      "config": self.config,
      "turn_index": self.turn_index,
      "status": self.status,
      "winner": self.winner,
      "battle_turns": self.battle_turns,
      "battle_state": self.battle_state.serialize_api(),
      "active_prompt_slot": self.active_prompt_slot,
      "pending_battle_actions": list(map(lambda x: x.serialize_api(), self.pending_battle_actions))
    }
  def serialize_ml(self):
    return flatten([
      battle_status_mapping(self.status),
      battle_side_mapping(self.winner),
      np.float32(self.turn_index),
      self.battle_state.serialize_ml(),
      1
    ])

  def ml_slot_action_serialize_api(self, slot, ml_action):
    # return ml_action
    pokemon_battle_state = self.pokemon_battle_state_at_slot(slot)
    if(self.active_prompt_slot and self.active_prompt_slot != slot):
      return ''
    if(not pokemon_battle_state and ml_action[0] != 'switch'):
      return ''
    target_pokemon = None
    if(ml_action[1] == 'target-ally'):
      target_pokemon = self.pokemon_battle_state_at_slot(self.adjacent_side_slot(slot))
    elif(ml_action[1] == 'target-enemy-1'):
      target_pokemon = self.pokemon_battle_state_at_slot(self.enemy_side_slots(slot)[0])
    elif(ml_action[1] == 'target-enemy-2'):
      target_pokemon = self.pokemon_battle_state_at_slot(self.enemy_side_slots(slot)[1])
    elif(ml_action[1] == 'pokemon1'):
      if(self.slot_side(slot) == 'blue'):
        target_pokemon = self.battle_state.blue_side_pokemon[0]
      elif(self.slot_side(slot) == 'red'):
        target_pokemon = self.battle_state.red_side_pokemon[0]
    elif(ml_action[1] == 'pokemon2'):
      if(self.slot_side(slot) == 'blue'):
        target_pokemon = self.battle_state.blue_side_pokemon[1]
      elif(self.slot_side(slot) == 'red'):
        target_pokemon = self.battle_state.red_side_pokemon[1]
    elif(ml_action[1] == 'pokemon3'):
      if(self.slot_side(slot) == 'blue'):
        target_pokemon = self.battle_state.blue_side_pokemon[2]
      elif(self.slot_side(slot) == 'red'):
        target_pokemon = self.battle_state.red_side_pokemon[2]
    elif(ml_action[1] == 'pokemon4'):
      if(self.slot_side(slot) == 'blue'):
        target_pokemon = self.battle_state.blue_side_pokemon[3]
      elif(self.slot_side(slot) == 'red'):
        target_pokemon = self.battle_state.red_side_pokemon[3]

    if ml_action[0] == 'NO-OP':
      return ''
    elif ml_action[0] == 'move1':
      if(target_pokemon):
        return f"{pokemon_battle_state.pokemon_build.move_idents[0]} -> {target_pokemon.pokemon_build.pokemon.ident}"
      else:
        return f"{pokemon_battle_state.pokemon_build.move_idents[0]}"
    elif ml_action[0] == 'move2':
      if(target_pokemon):
        return f"{pokemon_battle_state.pokemon_build.move_idents[1]} -> {target_pokemon.pokemon_build.pokemon.ident}"
      else:
        return f"{pokemon_battle_state.pokemon_build.move_idents[1]}"
    elif ml_action[0] == 'move3':
      if(target_pokemon):
        return f"{pokemon_battle_state.pokemon_build.move_idents[2]} -> {target_pokemon.pokemon_build.pokemon.ident}"
      else:
        return f"{pokemon_battle_state.pokemon_build.move_idents[2]}"
    elif ml_action[0] == 'move4':
      if(target_pokemon):
        return f"{pokemon_battle_state.pokemon_build.move_idents[3]} -> {target_pokemon.pokemon_build.pokemon.ident}"
      else:
        return f"{pokemon_battle_state.pokemon_build.move_idents[3]}"
    elif ml_action[0] == 'switch':
      return f"switch -> {target_pokemon.pokemon_build.pokemon.ident}"

  def ml_action_serialize_api(self, ml_action, side):
    slot_1_action = ml_action[0]
    slot_2_action = ml_action[1]
    slot_1 = 'blue-field-1' if side == 'blue' else 'red-field-1'
    slot_2 = 'blue-field-2' if side == 'blue' else 'red-field-2'

    return [self.ml_slot_action_serialize_api(slot_1, ml_action[0]), self.ml_slot_action_serialize_api(slot_2, ml_action[1])]
