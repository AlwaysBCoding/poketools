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

CHECKPOINT_PATH = Path("/Users/alwaysbcoding/Desktop/Code/poketools/ml/checkpoint.pt")
NUMBER_OF_AGENT_ACTIONS = 6
OBSERVATION_DIMENSIONS = 485
EPSILON_START = 1.0
EPSILON_END = 0.01
EPSILON_DEC = 2e-4
LEARNING_RATE = 0.002

agent = Agent(
  gamma=0.99,
  epsilon=EPSILON_START,
  max_memory_size=1000000,
  batch_size=64,
  n_actions=NUMBER_OF_AGENT_ACTIONS,
  epsilon_end=EPSILON_END,
  epsilon_dec=EPSILON_DEC,
  input_dimensions=[OBSERVATION_DIMENSIONS],
  learning_rate=LEARNING_RATE
)

checkpoint = T.load(CHECKPOINT_PATH)
agent.Q_eval.load_state_dict(checkpoint['model_state_dict'])
agent.Q_eval.optimizer.load_state_dict(checkpoint['optimizer_state_dict'])

@app.route("/start-battle", methods=["POST", "OPTIONS"])
def startBattle():
  try:
    data = request.get_json()
    battle = Battle.deserialize(data)
    blue_side_pokemon_order = [0, 1, 2]
    np.random.shuffle(blue_side_pokemon_order)
    red_side_pokemon_order = [0, 1, 2]
    np.random.shuffle(red_side_pokemon_order)
    battle.initial_step(blue_side_pokemon_order, red_side_pokemon_order)
    battle_actions = battle.available_actions_for_pokemon_battle_state(battle.field_pokemon("blue").battle_id)
    serialized_battle_actions = list(map(lambda x: x.serialize_api(), battle_actions))
    observation = battle.serialize_ml()
    agent_actions = agent.show_actions(observation)
    return {
      "battle": battle.serialize_api(),
      "actions": serialized_battle_actions,
      "agent_actions": agent_actions.tolist()[0]
    }
  except Exception as e:
    print("GOT EXCEPTION")
    print(e)
    traceback.print_exc()
    return {"status": "error"}

@app.route("/send-battle-action", methods=["POST", "OPTIONS"])
def sendBattleAction():
  try:
    serialized_next_battle_actions = []

    data = request.get_json()
    battle = Battle.deserialize(data["battle"])
    blue_actions = [BattleAction.deserialize(data["battle_action"])]
    red_actions = [np.random.choice(battle.available_actions_for_pokemon_battle_state(battle.field_pokemon("red").battle_id))]

    battle.step(blue_actions, red_actions)

    if(battle.field_pokemon("blue")):
      next_battle_actions = battle.available_actions_for_pokemon_battle_state(battle.field_pokemon("blue").battle_id)
      serialized_next_battle_actions = list(map(lambda x: x.serialize_api(), next_battle_actions))

    observation = battle.serialize_ml()
    agent_actions = agent.show_actions(observation)
    return {
      "battle": battle.serialize_api(),
      "actions": serialized_next_battle_actions,
      "agent_actions": agent_actions.tolist()[0]
    }
  except Exception as e:
    print("GOT EXCEPTION")
    print(e)
    traceback.print_exc()
    return {"status": "error"}

@app.route("/test/perform-battle-action", methods=["POST", "OPTIONS"])
def testPerformBattleAction():
  try:
    data = request.get_json()
    battle = Battle.deserialize(data['battle'])
    battle_action = BattleAction.deserialize(data['battle_action'])
    hardcoded_stat_change_frequency_roll = data.get('hardcoded_stat_change_frequency_roll')
    hardcoded_random_roll = data.get("random_roll")
    hardcoded_crit_roll = data.get("crit_roll")

    action_events, should_end_battle = battle.perform_battle_action(
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
def testCalculateDamage():
  try:
    data = request.get_json()
    battle = Battle.deserialize(data["battle"])
    battle_action = BattleAction.deserialize(data["battle_action"])
    target_slot = battle_action.action_data["move_targets"][0]
    target_pokemon_battle_id = battle.battle_state.field_state[target_slot]
    target_pokemon = battle.pokemon_battle_state_by_id(target_pokemon_battle_id)

    random_roll = data.get("random_roll")
    crit_roll = data.get("crit_roll")
    targeting_value = data.get("targeting_value")

    damage = calculate_damage(
      battle_state=battle.battle_state,
      attacking_pokemon=battle_action.actor,
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
def testBattleStep():
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
def testOrderActions():
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
