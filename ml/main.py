from models.pokemon import Pokemon, PokemonStatSpread
from models.pokemon_build import PokemonBuild
from models.pokemon_battle_state import PokemonBattleState

from model import Agent
from game import Game
from damage_calculation import calculate_damage

import numpy as np
import ipdb
from pathlib import Path
import json

if __name__ == "__main__":
  gastrodon_f = open(Path("../src/data/pokemon/paldea/328-gastrodon/gastrodon.data.json"))
  gastrodon_data = json.load(gastrodon_f)
  gastrodon = Pokemon(gastrodon_data)
  gastrodon_build = PokemonBuild(
    pokemon=gastrodon,
    item_ident="leftovers",
    ability_ident="storm-drain",
    level=50,
    gender="male",
    tera_type_ident="flying",
    move_idents=["clear-smog", "earth-power", "ice-beam", "hydro-pump"],
    stat_spread=PokemonStatSpread(hp=218, attack=92, defense=88, special_attack=128, special_defense=130, speed=59)
  )
  gastrodon_battle_state = PokemonBattleState(gastrodon_build)

  garchomp_f = open(Path("../src/data/pokemon/paldea/128-garchomp/garchomp.data.json"))
  garchomp_data = json.load(garchomp_f)
  garchomp = Pokemon(garchomp_data)
  garchomp_build = PokemonBuild(
    pokemon=garchomp,
    item_ident="life-orb",
    ability_ident="rough-skin",
    level=50,
    gender="male",
    tera_type_ident="fire",
    move_idents=["dragon-claw", "earthquake", "bite", "fire-fang"],
    stat_spread=PokemonStatSpread(hp=183, attack=200, defense=115, special_attack=90, special_defense=105, speed=154)
  )
  garchomp_battle_state = PokemonBattleState(garchomp_build)

  talonflame_f = open(Path("../src/data/pokemon/paldea/21-talonflame/talonflame.data.json"))
  talonflame_data = json.load(talonflame_f)
  talonflame = Pokemon(talonflame_data)
  talonflame_build = PokemonBuild(
    pokemon=talonflame,
    item_ident="sharp-beak",
    ability_ident="gale-wings",
    level=50,
    gender="male",
    tera_type_ident="flying",
    move_idents=["tailwind", "brave-bird", "flare-blitz", "feint"],
    stat_spread=PokemonStatSpread(hp=153, attack=146, defense=91, special_attack=84, special_defense=89, speed=178)
  )
  talonflame_battle_state = PokemonBattleState(talonflame_build)

  gholdengo_f = open(Path("../src/data/pokemon/paldea/392-gholdengo/gholdengo.data.json"))
  gholdengo_data = json.load(gholdengo_f)
  gholdengo = Pokemon(gholdengo_data)
  gholdengo_build = PokemonBuild(
    pokemon=gholdengo,
    item_ident="focus-sash",
    ability_ident="good-as-gold",
    level=50,
    gender="genderless",
    tera_type_ident="flying",
    move_idents=["thunderbolt", "shadow-ball", "make-it-rain", "nasty-plot"],
    stat_spread=PokemonStatSpread(hp=162, attack=72, defense=115, special_attack=185, special_defense=112, speed=149)
  )
  gholdengo_battle_state = PokemonBattleState(gholdengo_build)

  tsareena_f = open(Path("../src/data/pokemon/paldea/83-tsareena/tsareena.data.json"))
  tsareena_data = json.load(tsareena_f)
  tsareena = Pokemon(tsareena_data)
  tsareena_build = PokemonBuild(
    pokemon=tsareena,
    item_ident="choice-scarf",
    ability_ident="queenly-majesty",
    level=50,
    gender="female",
    tera_type_ident="grass",
    move_idents=["power-whip", "u-turn", "low-sweep", "play-rough"],
    stat_spread=PokemonStatSpread(hp=152, attack=172, defense=118, special_attack=63, special_defense=118, speed=132)
  )
  tsareena_battle_state = PokemonBattleState(tsareena_build)

  grimmsnarl_f = open(Path("../src/data/pokemon/paldea/287-grimmsnarl/grimmsnarl.data.json"))
  grimmsnarl_data = json.load(grimmsnarl_f)
  grimmsnarl = Pokemon(grimmsnarl_data)
  grimmsnarl_build = PokemonBuild(
    pokemon=grimmsnarl,
    item_ident="iron-ball",
    ability_ident="prankster",
    level=50,
    gender="male",
    tera_type_ident="steel",
    move_idents=["fake-out", "sucker-punch", "spirit-break", "ice-punch"],
    stat_spread=PokemonStatSpread(hp=195, attack=171, defense=85, special_attack=103, special_defense=111, speed=80)
  )
  grimmsnarl_battle_state = PokemonBattleState(grimmsnarl_build)

# if __name__ == '__main__':
#   env = Game()
#   NUMBER_OF_AGENT_ACTIONS = 4
#   OBSERVATION_DIMENSIONS = 7

#   agent = Agent(
#     gamma=0.99,
#     epsilon=1.0,
#     max_memory_size=1000000,
#     batch_size=64,
#     n_actions=NUMBER_OF_AGENT_ACTIONS,
#     epsilon_end=0.001,
#     epsilon_dec=5e-4,
#     input_dimensions=[OBSERVATION_DIMENSIONS],
#     learning_rate=0.0003
#   )

#   n_games = 2000

#   scores, epsilon_history = [], []

#   for i in range(n_games):
#     score = 0
#     done = 0
#     episode_actions = []
#     observation = env.reset()

#     while not done == 1:
#       actions = agent.show_actions(observation)
#       action = agent.choose_action(observation)
#       episode_actions.append([actions, action])
#       observation_, reward, done = env.step(action)
#       score += reward
#       agent.store_transition(observation, action, reward, observation_, done)
#       agent.learn()
#       observation = observation_

#     scores.append(score)
#     epsilon_history.append(agent.epsilon)
#     average_score = np.mean(scores[-100:])

#     print(
#       'episode ',
#       i,
#       'score %.2f' % score,
#       'average score %.2f' % average_score,
#       'epsilon %.2f' % agent.epsilon
#     )

#     if(i == 1999):
#       print("ACTION DEBUGGER...")
#       print(episode_actions)


  # observation = env.reset()
  # print("\n\n")
  # print("FINAL OBSERVATION")
  # print(observation)

  # agent.show_actions(observation)
  # action = agent.choose_action(observation)

  # print("CHOSEN ACTION...")
  # print(action)
