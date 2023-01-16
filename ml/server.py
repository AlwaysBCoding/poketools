from flask import Flask, request
from flask_cors import CORS
import json
import traceback
from pprint import pprint
import ipdb

from models.battle import Battle, BattleAction
from damage_calculation import calculate_damage

import numpy as np
import torch as T
from pathlib import Path
from model import Agent

app = Flask(__name__)
CORS(app)

BLUE_CHECKPOINT_PATH = Path("/Users/alwaysbcoding/Desktop/Code/poketools/ml/blue.checkpoint.pt")
RED_CHECKPOINT_PATH = Path("/Users/alwaysbcoding/Desktop/Code/poketools/ml/red.checkpoint.pt")
NUMBER_OF_AGENT_ACTIONS = 446
OBSERVATION_DIMENSIONS = 34058
EPSILON_START = 1.0
EPSILON_END = 0.0095
EPSILON_DEC = 2e-4
LEARNING_RATE = 0.002
GAMMA = 0.99
MAX_MEMORY_SIZE = 1_000_000
BATCH_SIZE = 64

blue_agent = Agent(
  gamma=GAMMA,
  epsilon=EPSILON_START,
  max_memory_size=MAX_MEMORY_SIZE,
  batch_size=BATCH_SIZE,
  n_actions=NUMBER_OF_AGENT_ACTIONS,
  epsilon_end=EPSILON_END,
  epsilon_dec=EPSILON_DEC,
  input_dimensions=[OBSERVATION_DIMENSIONS],
  learning_rate=LEARNING_RATE
)

red_agent = Agent(
  gamma=GAMMA,
  epsilon=EPSILON_START,
  max_memory_size=MAX_MEMORY_SIZE,
  batch_size=BATCH_SIZE,
  n_actions=NUMBER_OF_AGENT_ACTIONS,
  epsilon_end=EPSILON_END,
  epsilon_dec=EPSILON_DEC,
  input_dimensions=[OBSERVATION_DIMENSIONS],
  learning_rate=LEARNING_RATE
)

blue_checkpoint = T.load(BLUE_CHECKPOINT_PATH)
blue_agent.Q_eval.load_state_dict(blue_checkpoint['model_state_dict'])
blue_agent.Q_eval.optimizer.load_state_dict(blue_checkpoint['optimizer_state_dict'])

red_checkpoint = T.load(RED_CHECKPOINT_PATH)
red_agent.Q_eval.load_state_dict(red_checkpoint['model_state_dict'])
red_agent.Q_eval.optimizer.load_state_dict(red_checkpoint['optimizer_state_dict'])

@app.route("/start-battle", methods=["POST", "OPTIONS"])
def start_battle():
  try:
    data = request.get_json()
    battle = Battle.deserialize(data)
    battle.initial_step()
    battle_actions = battle.available_actions_for_battle_state(serialized=True)

    observation = battle.serialize_ml()

    blue_valid_actions = battle.ml_valid_actions_for_side('blue')
    red_valid_actions = battle.ml_valid_actions_for_side('red')

    blue_values, blue_indexes = T.topk(blue_agent.show_actions(observation, blue_valid_actions), 5)
    red_values, red_indexes = T.topk(red_agent.show_actions(observation, red_valid_actions), 5)

    all_actions = battle.ml_available_actions_for_side()
    blue_zipped_actions = [[battle.ml_action_serialize_api(all_actions[x], 'blue'), blue_values[0][index].item()] for index, x in enumerate(blue_indexes[0])]
    red_zipped_actions = [[battle.ml_action_serialize_api(all_actions[x], 'red'), red_values[0][index].item()] for index, x in enumerate(red_indexes[0])]

    return {
      'battle': battle.serialize_api(),
      'actions': battle_actions,
      'agent_actions': {
        'blue': blue_zipped_actions,
        'red': red_zipped_actions
      }
    }
  except Exception as e:
    print("GOT EXCEPTION")
    print(e)
    traceback.print_exc()
    if(type(e).__name__ != 'BadRequest'):
      ipdb.set_trace()
    return {"status": "error"}

@app.route("/send-battle-actions", methods=["POST", "OPTIONS"])
def send_battle_action():
  try:
    serialized_next_battle_actions = []

    data = request.get_json()
    battle = Battle.deserialize(data["battle"])

    observation = battle.serialize_ml()

    blue_actions = list(map(lambda x: BattleAction.deserialize(x), data["blue_actions"]))
    # red_actions = list(map(lambda x: BattleAction.deserialize(x), data["red_actions"]))
    all_actions = battle.ml_available_actions_for_side()
    red_valid_actions = battle.ml_valid_actions_for_side('red')
    red_action = red_agent.choose_action(observation, red_valid_actions)
    red_actions = [battle.ml_action_to_battle_action('red-field-1', all_actions[red_action][0]), battle.ml_action_to_battle_action('red-field-2', all_actions[red_action][1])]
    red_actions = [i for i in red_actions if i is not None]

    battle.step(blue_actions, red_actions)
    battle_actions = battle.available_actions_for_battle_state(serialized=True)

    observation_ = battle.serialize_ml()

    blue_valid_actions = battle.ml_valid_actions_for_side('blue')
    red_valid_actions = battle.ml_valid_actions_for_side('red')

    blue_values, blue_indexes = T.topk(blue_agent.show_actions(observation_, blue_valid_actions), 5)
    red_values, red_indexes = T.topk(red_agent.show_actions(observation_, red_valid_actions), 5)

    all_actions = battle.ml_available_actions_for_side()
    blue_zipped_actions = [[battle.ml_action_serialize_api(all_actions[x], 'blue'), blue_values[0][index].item()] for index, x in enumerate(blue_indexes[0])]
    red_zipped_actions = [[battle.ml_action_serialize_api(all_actions[x], 'red'), red_values[0][index].item()] for index, x in enumerate(red_indexes[0])]

    return {
      'battle': battle.serialize_api(),
      'actions': battle_actions,
      'agent_actions': {
        'blue': blue_zipped_actions,
        'red': red_zipped_actions
      }
    }
  except Exception as e:
    if(type(e).__name__ != 'BadRequest'):
      print("GOT EXCEPTION")
      print(e)
      traceback.print_exc()
      ipdb.set_trace()
    return {"status": "error"}

@app.route("/send-replace-pokemon-action", methods=["POST", "OPTIONS"])
def send_replace_pokemon_action():
  try:
    data = request.get_json()
    battle = Battle.deserialize(data.get('battle'))
    observation = battle.serialize_ml()

    if(battle.active_prompt_slot in ['red-field-1', 'red-field-2']):
      all_actions = battle.ml_available_actions_for_side()
      red_valid_actions = battle.ml_valid_actions_for_side('red')
      red_action = red_agent.choose_action(observation, red_valid_actions)
      red_actions = [battle.ml_action_to_battle_action('red-field-1', all_actions[red_action][0]), battle.ml_action_to_battle_action('red-field-2', all_actions[red_action][1])]
      red_actions = [i for i in red_actions if i is not None]
      battle_action = red_actions[0]
      battle.replace_pokemon_step(battle_action)
    else:
      battle_action = BattleAction.deserialize(data.get('battle_action'))
      battle.replace_pokemon_step(battle_action)

    battle_actions = battle.available_actions_for_battle_state(serialized=True)
    observation_ = battle.serialize_ml()

    blue_valid_actions = battle.ml_valid_actions_for_side('blue')
    red_valid_actions = battle.ml_valid_actions_for_side('red')

    blue_values, blue_indexes = T.topk(blue_agent.show_actions(observation_, blue_valid_actions), 5)
    red_values, red_indexes = T.topk(red_agent.show_actions(observation_, red_valid_actions), 5)

    all_actions = battle.ml_available_actions_for_side()
    blue_zipped_actions = [[battle.ml_action_serialize_api(all_actions[x], 'blue'), blue_values[0][index].item()] for index, x in enumerate(blue_indexes[0])]
    red_zipped_actions = [[battle.ml_action_serialize_api(all_actions[x], 'red'), red_values[0][index].item()] for index, x in enumerate(red_indexes[0])]

    return {
      'battle': battle.serialize_api(),
      'actions': battle_actions,
      'agent_actions': {
        'blue': blue_zipped_actions,
        'red': red_zipped_actions
      }
    }
  except Exception as e:
    if(type(e).__name__ != 'BadRequest'):
      print("GOT EXCEPTION")
      print(e)
      traceback.print_exc()
      ipdb.set_trace()
    return {"status": "error"}

@app.route("/test/perform-battle-action", methods=["POST", "OPTIONS"])
def test_perform_battle_action():
  try:
    data = request.get_json()
    battle = Battle.deserialize(data['battle'])
    battle_action = BattleAction.deserialize(data['battle_action'])
    hardcoded_stat_change_frequency_roll = data.get('hardcoded_stat_change_frequency_roll')
    hardcoded_random_roll = data.get("random_roll")
    hardcoded_crit_roll = data.get("crit_roll")

    action_events, should_end_battle, replace_pokemon_action_slot = battle.perform_battle_action(
      battle_action,
      hardcoded_stat_change_frequency_roll,
      hardcoded_random_roll,
      hardcoded_crit_roll
    )
    return {
      "battle": battle.serialize_api(),
      "action_events": action_events
    }
  except Exception as e:
    print("GOT EXCEPTION")
    print(e)
    traceback.print_exc()
    return {"status": "error"}

@app.route("/test/calculate-damage", methods=["POST", "OPTIONS"])
def test_calculate_damage():
  try:
    data = request.get_json()
    battle = Battle.deserialize(data.get('battle'))
    battle_action = BattleAction.deserialize(data.get('battle_action'))
    target_slot = battle_action.action_data.get("move_targets")[0]
    attacking_pokemon = battle.pokemon_battle_state_at_slot(battle_action.slot)
    target_pokemon_battle_id = battle.battle_state.field_state[target_slot]
    target_pokemon = battle.pokemon_battle_state_by_id(target_pokemon_battle_id)

    random_roll = data.get("random_roll")
    crit_roll = data.get("crit_roll")
    targeting_value = data.get("targeting_value")

    damage = calculate_damage(
      battle_state=battle.battle_state,
      attacking_pokemon=attacking_pokemon,
      target_pokemon=target_pokemon,
      move_ident=battle_action.action_data["move"]["ident"],
      hardcoded_random_roll=random_roll,
      hardcoded_crit_roll=crit_roll,
      hardcoded_targeting_value=targeting_value
    )
    return {
      "damage": damage
    }
  except Exception as e:
    print("GOT EXCEPTION")
    print(e)
    traceback.print_exc()
    return {"status": "error"}

@app.route("/test/battle-step", methods=["POST", "OPTIONS"])
def test_battle_step():
  try:
    data = request.get_json()
    battle = Battle.deserialize(data["battle"])
    blue_actions = list(map(lambda x: BattleAction.deserialize(x), data['blue_battle_actions']))
    red_actions = list(map(lambda x: BattleAction.deserialize(x), data['red_battle_actions']))
    battle.step(blue_actions, red_actions)
    return {
      "battle": battle.serialize_api()
    }
  except Exception as e:
    print("GOT EXCEPTION")
    print(e)
    traceback.print_exc()
    return {"status": "error"}

@app.route("/test/order-actions", methods=["POST", "OPTIONS"])
def test_order_actions():
  try:
    data = request.get_json()
    battle = Battle.deserialize(data["battle"])
    battle_actions = list(map(lambda x: BattleAction.deserialize(x), data['battle_actions']))
    ordered_battle_actions = battle.order_battle_actions(battle_actions)
    return {
      "battle_actions": list(map(lambda x: x.serialize_api(), ordered_battle_actions))
    }
  except Exception as e:
    print("GOT EXCEPTION")
    print(e)
    traceback.print_exc()
    return {"status": "error"}

if __name__ == "__main__":
  app.run(host="0.0.0.0", port=8000, debug=True)
