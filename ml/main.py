from model import Agent
from game import Game

import numpy as np
import ipdb

if __name__ == "__main__":
  # GAME LOOP
  # =====================
  env = Game()
  NUMBER_OF_AGENT_ACTIONS = 6
  OBSERVATION_DIMENSIONS = 84

  agent = Agent(
    gamma=0.99,
    epsilon=1.0,
    max_memory_size=1000000,
    batch_size=64,
    n_actions=NUMBER_OF_AGENT_ACTIONS,
    epsilon_end=0.01,
    epsilon_dec=1e-4,
    input_dimensions=[OBSERVATION_DIMENSIONS],
    learning_rate=0.001
  )

  n_games = 3000

  scores, epsilon_history = [], []

  for i in range(n_games):
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
      i,
      'score %.2f' % score,
      'average score %.2f' % average_score,
      'epsilon %.2f' % agent.epsilon
    )

  ipdb.set_trace()
