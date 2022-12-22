from model import Agent
from game import Game

import numpy as np
import ipdb

if __name__ == "__main__":
  # GAME LOOP
  # =====================
  env = Game()
  initial_observation = env.reset()
  # NUMBER_OF_AGENT_ACTIONS = 7
  # OBSERVATION_DIMENSIONS = 84

  # agent = Agent(
  #   gamma=0.99,
  #   epsilon=1.0,
  #   max_memory_size=1000000,
  #   batch_size=64,
  #   n_actions=NUMBER_OF_AGENT_ACTIONS,
  #   epsilon_end=0.001,
  #   epsilon_dec=5e-4,
  #   input_dimensions=[OBSERVATION_DIMENSIONS],
  #   learning_rate=0.003
  # )

  # n_games = 2000

  # scores, epsilon_history = [], []

  # for i in range(n_games):
  #   score = 0
  #   done = 0
  #   episode_actions = []
  #   observation = env.reset()

  #   while not done == 1:
  #     actions = agent.show_actions(observation)
  #     action = agent.choose_action(observation)
  #     episode_actions.append([actions, action])
  #     observation_, reward, done = env.step(action)
  #     score += reward
  #     agent.store_transition(observation, action, reward, observation_, done)
  #     agent.learn()
  #     observation = observation_

  #   scores.append(score)
  #   epsilon_history.append(agent.epsilon)
  #   average_score = np.mean(scores[-100:])

  #   print(
  #     'episode ',
  #     i,
  #     'score %.2f' % score,
  #     'average score %.2f' % average_score,
  #     'epsilon %.2f' % agent.epsilon
  #   )
