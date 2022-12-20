import numpy as np

class Game():
  def __init__(self):
    self.weather = np.float32(0)
    self.terrain = np.float32(0)
    self.done = np.uint8(0)

  def reset(self):
    self.weather = np.float32(np.random.randint(1, 4))
    self.terrain = np.float32(np.random.randint(0, 4))
    self.done = 0
    return [self.weather, self.terrain, np.float32(0)]

  def step(self, action):
    action = "rock" if action == 0 else action
    action = "paper" if action == 1 else action
    action = "scissors" if action == 2 else action
    opponent_action = 0
    reward = 0
    done = 1

    if(self.terrain == np.float32(1)):
      opponent_action = "rock"
    elif(self.terrain == np.float32(2)):
      opponent_action = "paper"
    elif(self.terrain == np.float32(3)):
      opponent_action = "scissors"
    elif(self.terrain == np.float32(0)):
      if(self.weather == np.float32(1)):
        opponent_action = "rock"
      elif(self.weather == np.float32(2)):
        opponent_action = "paper"
      elif(self.weather == np.float32(3)):
        opponent_action = "scissors"

    if(action == "rock" and opponent_action == "rock"):
      reward = 0
    elif(action == "rock" and opponent_action == "paper"):
      reward = -1
    elif(action == "rock" and opponent_action == "scissors"):
      reward = 1
    elif(action == "paper" and opponent_action == "rock"):
      reward = 1
    elif(action == "paper" and opponent_action == "paper"):
      reward = 0
    elif(action == "paper" and opponent_action == "scissors"):
      reward = -1
    elif(action == "scissors" and opponent_action == "rock"):
      reward = -1
    elif(action == "scissors" and opponent_action == "paper"):
      reward = 1
    elif(action == "scissors" and opponent_action == "scissors"):
      reward = 0

    opponent_action = 1 if opponent_action == "rock" else opponent_action
    opponent_action = 2 if opponent_action == "paper" else opponent_action
    opponent_action = 3 if opponent_action == "scissors" else opponent_action

    observation_ = [self.weather, self.terrain, opponent_action]

    return [observation_, reward, done]
