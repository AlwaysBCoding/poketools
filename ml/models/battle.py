from models.battle_state import BattleState
from helpers import find
from damage_calculation import calculate_damage

from functools import cmp_to_key
from pathlib import Path
import json
import numpy as np

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

class Battle():
  def __init__(self, config, blue_side_pokemon, red_side_pokemon, blue_side_pokemon_order, red_side_pokemon_order):
    self.config = config
    self.turn_index = 0
    self.status = "active"
    self.battle_turns = []
    self.battle_state = BattleState(config, blue_side_pokemon, red_side_pokemon)
    self.initial_step(blue_side_pokemon_order, red_side_pokemon_order)

  def end_battle_turn(self, battle_events):
    self.turn_index += 1
    for battle_event in battle_events:
      print(battle_event)

  def initial_step(self, blue_side_pokemon_order, red_side_pokemon_order):
    battle_events = []
    battle_events.append(f"Battle Started!")
    blue_pokemon = self.battle_state.blue_side_pokemon[blue_side_pokemon_order[0]]
    blue_pokemon.location_ident = "field"
    self.battle_state.field_state["blue-field-1"] = blue_pokemon.id
    battle_events.append(f"Go {blue_pokemon.pokemon_build.pokemon.ident}!")
    red_pokemon = self.battle_state.red_side_pokemon[red_side_pokemon_order[0]]
    red_pokemon.location_ident = "field"
    self.battle_state.field_state["red-field-1"] = red_pokemon.id
    battle_events.append(f"Go {red_pokemon.pokemon_build.pokemon.ident}!")
    self.battle_turns.append(battle_events)
    self.end_battle_turn(battle_events)

  def pokemon_battle_states(self):
    return self.battle_state.blue_side_pokemon + self.battle_state.red_side_pokemon

  def pokemon_battle_state_by_id(self, pokemon_battle_state_id):
    return find(self.pokemon_battle_states(), lambda x: x.id == pokemon_battle_state_id)

  def possible_targets_for_move(self, actor_id, move_ident):
    actor_pokemon_battle_state = self.pokemon_battle_state_by_id(actor_id)
    if actor_pokemon_battle_state.location_ident != "field":
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
    else:
      return any_adjacent

  def available_actions_for_pokemon_battle_state(self, pokemon_battle_state_id):
    available_actions = []
    pokemon_battle_state = self.pokemon_battle_state_by_id(pokemon_battle_state_id)

    if not pokemon_battle_state.location_ident == "field":
      return []
    else:
      party_pokemons = []
      for move_ident in pokemon_battle_state.pokemon_build.move_idents:
        available_actions.append(
          BattleAction(
            actor=pokemon_battle_state,
            action_type="move",
            action_data={
              "move": find(all_moves_data, lambda x: x.get("ident") == move_ident),
              "move_targets": self.possible_targets_for_move(pokemon_battle_state.id, move_ident)
            }
          )
        )

      if(pokemon_battle_state.battle_side == "blue"):
        party_pokemons = filter(lambda x: x.location_ident == "party", self.battle_state.blue_side_pokemon)
      elif(pokemon_battle_state.battle_side == "red"):
        party_pokemons = filter(lambda x: x.location_ident == "party", self.battle_state.red_side_pokemon)

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
    if(battle_action_a.action_type == "switch" and battle_action_b.action_type == "move"):
      return -1
    elif(battle_action_b.action_type == "switch" and battle_action_a.action_type == "move"):
      return 1

    a_base_speed = battle_action_a.actor.pokemon_build.stat_spread.speed
    b_base_speed = battle_action_b.actor.pokemon_build.stat_spread.speed

    a_speed = a_base_speed * STAT_BOOST_MODIFIER_VALUES[f"{battle_action_a.actor.stat_boosts.speed}"]
    b_speed = b_base_speed * STAT_BOOST_MODIFIER_VALUES[f"{battle_action_b.actor.stat_boosts.speed}"]

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

  def perform_battle_action(self, battle_action):
    action_events = []
    should_end_battle = False

    if(battle_action.actor.location_ident == "graveyard"):
      return [action_events, should_end_battle]

    if(battle_action.action_type == "switch"):
      battle_action.actor.location_ident = "party"
      action_events.append(f"{battle_action.actor.pokemon_build.pokemon.ident} come back!")
      battle_action.action_data['switch_target'].location_ident = "field"
      action_events.append(f"Go {battle_action.action_data['switch_target'].pokemon_build.pokemon.ident}!")
      if(battle_action.actor.battle_side == "blue"):
        self.battle_state.field_state["blue-field-1"] = battle_action.action_data['switch_target'].id
      elif(battle_action.actor.battle_side == "red"):
        self.battle_state.field_state["red-field-1"] = battle_action.action_data['switch_target'].id
    elif(battle_action.action_type == "move"):
      action_events.append(f"{battle_action.actor.pokemon_build.pokemon.ident} used {battle_action.action_data['move']['ident']}")
      if(battle_action.action_data["move"]["category_ident"] == "non-damaging"):
        "..."
      elif(battle_action.action_data['move']['category_ident'] in ['physical', 'special']):
        target_pokemon_slot = battle_action.action_data['move_targets'][0]
        target_pokemon_id = self.battle_state.field_state[target_pokemon_slot]
        target_pokemon = find(self.pokemon_battle_states(), lambda x: x.id == target_pokemon_id)
        damage = calculate_damage(
          battle_state={},
          attacking_pokemon=battle_action.actor,
          target_pokemon=target_pokemon,
          move_ident=battle_action.action_data['move']['ident']
        )
        target_pokemon_previous_hp = target_pokemon.current_hp
        target_pokemon.current_hp = max(0, target_pokemon_previous_hp - damage)
        action_events.append(f"{target_pokemon.pokemon_build.pokemon.ident} took {damage} damage {target_pokemon_previous_hp} -> {target_pokemon.current_hp}")
        if(target_pokemon.current_hp == 0):
          target_pokemon.location_ident = "graveyard"
          self.battle_state.field_state[target_pokemon_slot] = None
          action_events.append(f"{target_pokemon.pokemon_build.pokemon.ident} fainted")
          possible_replacement_pokemons = self.party_pokemons(target_pokemon.battle_side)
          if(len(possible_replacement_pokemons) > 0):
            replacement_pokemon = np.random.choice(possible_replacement_pokemons)
            replacement_pokemon.location_ident = "field"
            self.battle_state.field_state[target_pokemon_slot] = replacement_pokemon.id
            action_events.append(f"Go {replacement_pokemon.pokemon_build.pokemon.ident}!")
          else:
            should_end_battle = True
            action_events.append("THE BATTLE IS OVER")

    return [action_events, should_end_battle]

  def step(self, blue_actions, red_actions):
    if self.status == "complete":
      print("CANNOT PERFORM STEP, BATTLE IS OVER")
    else:
      battle_events = []
      battle_actions = blue_actions + red_actions
      ordered_battle_actions = self.order_battle_actions(battle_actions)
      for battle_action in ordered_battle_actions:
        action_events, should_end_battle = self.perform_battle_action(battle_action)
        battle_events += action_events
        if(should_end_battle):
          self.status = "complete"
          break
      self.end_battle_turn(battle_events)

  # CONVENIENCE HELPERS
  # =====================
  def field_pokemon(self, side):
    if(side == "blue"):
      return find(self.battle_state.blue_side_pokemon, lambda x: x.location_ident == "field")
    elif(side == "red"):
      return find(self.battle_state.red_side_pokemon, lambda x: x.location_ident == "field")
    else:
      return None

  def party_pokemons(self, side):
    if(side == "blue"):
      return list(filter(lambda x: x.location_ident == "party", self.battle_state.blue_side_pokemon))
    elif(side == "red"):
      return list(filter(lambda x: x.location_ident == "party", self.battle_state.red_side_pokemon))
    else:
      return []
