from model import Agent
from game import Game

import numpy as np
import ipdb

if __name__ == '__main__':
  env = Game()

  agent = Agent(
    gamma=0.99,
    epsilon=1.0,
    batch_size=64,
    n_actions=3,
    epsilon_end=0.001,
    epsilon_dec=5e-4,
    input_dimensions=[3],
    learning_rate=0.0003
  )

  n_games = 4000

  scores, epsilon_history = [], []

  for i in range(n_games):
    score = 0
    done = 0
    observation = env.reset()

    while not done == 1:
      action = agent.choose_action(observation)
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

  observation = env.reset()
  print("\n\n")
  print("FINAL OBSERVATION")
  print(observation)

  agent.show_actions(observation)
  action = agent.choose_action(observation)

  print("CHOSEN ACTION...")
  print(action)
