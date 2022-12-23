from flask import Flask, request
from flask_cors import CORS
import json
import traceback

from models.battle import Battle

app = Flask(__name__)
CORS(app)

@app.route("/start-battle", methods=["POST", "OPTIONS"])
def home():
  try:
    data = request.get_json()
    battle = Battle.deserialize(data)
    battle.initial_step([0,1,2], [0,1,2])
    return battle.serialize_api()
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
