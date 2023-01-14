from model import Agent
from game import Game

import torch as T
from pathlib import Path
from pprint import pprint
import numpy as np
import ipdb

if __name__ == "__main__":
  # GAME LOOP
  # =====================
  RESTORE_FROM_CHECKPOINT = False
  SAVE_CHECKPOINT = True
  BLUE_CHECKPOINT_PATH = Path("/Users/alwaysbcoding/Desktop/Code/poketools/ml/blue.checkpoint.pt")
  RED_CHECKPOINT_PATH = Path("/Users/alwaysbcoding/Desktop/Code/poketools/ml/red.checkpoint.pt")

  env = Game()

  NUMBER_OF_AGENT_ACTIONS = 446
  OBSERVATION_DIMENSIONS = 34058
  GAMMA = 0.99
  EPSILON_START = 1.0
  EPSILON_END = 0.0095
  EPSILON_DEC = 2e-4
  LEARNING_RATE = 0.002
  BATCH_SIZE = 64
  MAX_MEMORY_SIZE = 1_000_000

  epoch = 0

  if(RESTORE_FROM_CHECKPOINT):
    EPSILON_START = EPSILON_END

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

  if(RESTORE_FROM_CHECKPOINT):
    checkpoint = T.load(CHECKPOINT_PATH)
    blue_agent.Q_eval.load_state_dict(blue_checkpoint['model_state_dict'])
    blue_agent.Q_eval.optimizer.load_state_dict(blue_checkpoint['optimizer_state_dict'])
    red_agent.Q_eval.load_state_dict(red_checkpoint['model_state_dict'])
    red_agent.Q_eval.optimizer.load_state_dict(red_checkpoint['optimizer_state_dict'])
    epoch = blue_checkpoint['epoch']

  n_games = 10_000_000
  checkpoint_interval = 2_500

  scores, epsilon_history = [], []

  for i in range(n_games):
    epoch += 1
    score = 0
    done = 0
    observation = env.reset()

    while not done == 1:
      blue_valid_actions = env.battle.ml_valid_actions_for_side('blue')
      red_valid_actions = env.battle.ml_valid_actions_for_side('red')

      blue_action = blue_agent.choose_action(observation, blue_valid_actions)
      red_action = red_agent.choose_action(observation, red_valid_actions)

      observation_, blue_reward, red_reward, done = env.ml_step(blue_action, red_action)
      score += blue_reward

      blue_agent.store_transition(observation, blue_action, blue_reward, observation_, done)
      blue_agent.learn()
      red_agent.store_transition(observation, red_action, red_reward, observation_, done)
      red_agent.learn()

      observation = observation_

    scores.append(score)
    epsilon_history.append(blue_agent.epsilon)
    average_score = np.mean(scores[-1000:])

    print(
      'episode ',
      epoch,
      'score %.2f' % score,
      'average score %.2f' % average_score,
      'epsilon %.2f' % blue_agent.epsilon
    )

    if(SAVE_CHECKPOINT and (i % checkpoint_interval == 0)):
      blue_checkpoint_params = {}
      blue_checkpoint_params['epoch'] = epoch
      blue_checkpoint_params['model_state_dict'] = blue_agent.Q_eval.state_dict()
      blue_checkpoint_params['optimizer_state_dict'] = blue_agent.Q_eval.optimizer.state_dict()
      blue_checkpoint_params['average_score'] = np.mean(scores[-1000:])
      T.save(blue_checkpoint_params, BLUE_CHECKPOINT_PATH)

      red_checkpoint_params = {}
      red_checkpoint_params['model_state_dict'] = red_agent.Q_eval.state_dict()
      red_checkpoint_params['optimizer_state_dict'] = red_agent.Q_eval.optimizer.state_dict()
      T.save(red_checkpoint_params, RED_CHECKPOINT_PATH)

      scores = scores[-1000:]
      epsilon_history = epsilon_history[-1000:]
      print("CHECKPOINT SAVED")
