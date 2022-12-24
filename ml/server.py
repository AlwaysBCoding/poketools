from flask import Flask, request
from flask_cors import CORS
import json
import traceback
from pprint import pprint
import ipdb

from models.battle import Battle, BattleAction

import numpy as np
import torch as T
from pathlib import Path
from model import Agent

app = Flask(__name__)
CORS(app)

CHECKPOINT_PATH = Path("/Users/alwaysbcoding/Desktop/Code/poketools/ml/checkpoint.pt")
NUMBER_OF_AGENT_ACTIONS = 6
OBSERVATION_DIMENSIONS = 414
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
    battle.initial_step([0,1,2], [0,1,2])
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
    data = request.get_json()
    battle = Battle.deserialize(data["battle"])
    blue_actions = [BattleAction.deserialize(data["battle_action"])]
    red_actions = [np.random.choice(battle.available_actions_for_pokemon_battle_state(battle.field_pokemon("red").battle_id))]

    battle.step(blue_actions, red_actions)

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

@app.route("/get-battle-actions")
def path1():
  return "/get-battle-actions"

@app.route("/predict-battle-action")
def path2():
  return "/predict-battle-action"

@app.route("/transition-battle-state")
def path3():
  return "/transition-battle-state"

if __name__ == "__main__":
  app.run(host="0.0.0.0", port=8000, debug=True)
