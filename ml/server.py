from flask import Flask, request
from flask_cors import CORS
import json
import traceback
from pprint import pprint

from models.battle import Battle, BattleAction

app = Flask(__name__)
CORS(app)

@app.route("/start-battle", methods=["POST", "OPTIONS"])
def startBattle():
  try:
    data = request.get_json()
    battle = Battle.deserialize(data)
    battle.initial_step([0,1,2], [0,1,2])
    battle_actions = battle.available_actions_for_pokemon_battle_state(battle.field_pokemon("blue").battle_id)
    serialized_battle_actions = list(map(lambda x: x.serialize_api(), battle_actions))
    return {
      "battle": battle.serialize_api(),
      "actions": serialized_battle_actions
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
    red_actions = [battle.available_actions_for_pokemon_battle_state(battle.field_pokemon("red").battle_id)[0]]

    battle.step(blue_actions, red_actions)

    next_battle_actions = battle.available_actions_for_pokemon_battle_state(battle.field_pokemon("blue").battle_id)
    serialized_next_battle_actions = list(map(lambda x: x.serialize_api(), next_battle_actions))
    return {
      "battle": battle.serialize_api(),
      "actions": serialized_next_battle_actions
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
