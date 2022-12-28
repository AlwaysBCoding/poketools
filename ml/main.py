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
  CHECKPOINT_PATH = Path("/Users/alwaysbcoding/Desktop/Code/poketools/ml/checkpoint.pt")

  env = Game()

  NUMBER_OF_AGENT_ACTIONS = 6
  OBSERVATION_DIMENSIONS = 485
  EPSILON_START = 1.0
  EPSILON_END = 0.01
  EPSILON_DEC = 2e-4
  LEARNING_RATE = 0.002
  BATCH_SIZE = 64

  epoch = 0

  if(RESTORE_FROM_CHECKPOINT):
    EPSILON_START = EPSILON_END

  agent = Agent(
    gamma=0.99,
    epsilon=EPSILON_START,
    max_memory_size=1000000,
    batch_size=BATCH_SIZE,
    n_actions=NUMBER_OF_AGENT_ACTIONS,
    epsilon_end=EPSILON_END,
    epsilon_dec=EPSILON_DEC,
    input_dimensions=[OBSERVATION_DIMENSIONS],
    learning_rate=LEARNING_RATE
  )

  if(RESTORE_FROM_CHECKPOINT):
    checkpoint = T.load(CHECKPOINT_PATH)
    agent.Q_eval.load_state_dict(checkpoint['model_state_dict'])
    agent.Q_eval.optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
    epoch = checkpoint['epoch']

  n_games = 10_000_000
  checkpoint_interval = 5_000

  scores, epsilon_history = [], []

  for i in range(n_games):
    epoch += 1
    score = 0
    done = 0
    observation = env.reset()
    # episode_actions = []

    while not done == 1:
      # actions = agent.show_actions(observation)
      n_possible_actions = len(env.possible_actions())
      action = agent.choose_action(observation, n_possible_actions)
      # episode_actions.append([actions, action])
      observation_, reward, done = env.step(action)
      score += reward
      agent.store_transition(observation, action, reward, observation_, done)
      agent.learn()
      observation = observation_

    scores.append(score)
    epsilon_history.append(agent.epsilon)
    average_score = np.mean(scores[-100:])

    print(
      'episode ',
      epoch,
      'score %.2f' % score,
      'average score %.2f' % average_score,
      'epsilon %.2f' % agent.epsilon
    )

    if(SAVE_CHECKPOINT and (i % checkpoint_interval == 0)):
      checkpoint_params = {}
      checkpoint_params['epoch'] = epoch
      checkpoint_params['model_state_dict'] = agent.Q_eval.state_dict()
      checkpoint_params['optimizer_state_dict'] = agent.Q_eval.optimizer.state_dict()
      checkpoint_params['average_score'] = np.mean(scores[-1000:])
      T.save(checkpoint_params, CHECKPOINT_PATH)
      scores = scores[-1000:]
      epsilon_history = epsilon_history[-1000:]
      print("CHECKPOINT SAVED")
