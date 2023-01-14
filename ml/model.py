import torch as T
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
import numpy as np
import ipdb

class DeepQNetwork(nn.Module):
  def __init__(self, learning_rate, input_dimensions, fc1_dimensions, fc2_dimensions, n_actions):
    super(DeepQNetwork, self).__init__()
    self.input_dimensions = input_dimensions
    self.fc1_dimensions = fc1_dimensions
    self.fc2_dimensions = fc2_dimensions
    self.n_actions = n_actions

    self.fc1 = nn.Linear(*self.input_dimensions, self.fc1_dimensions)
    self.fc2 = nn.Linear(self.fc1_dimensions, self.fc2_dimensions)
    self.fc3 = nn.Linear(self.fc2_dimensions, self.n_actions)

    self.optimizer = optim.Adam(self.parameters(), lr=learning_rate)
    self.loss = nn.MSELoss()
    self.device = T.device('cuda:0' if T.cuda.is_available() else 'cpu')
    self.to(self.device)

  def forward(self, state):
    cursor = F.relu(self.fc1(state))
    cursor = F.relu(self.fc2(cursor))
    actions = self.fc3(cursor)
    return actions

class Agent():
  def __init__(self, gamma, epsilon, learning_rate, input_dimensions, batch_size, n_actions, max_memory_size=100000, epsilon_end=0.01, epsilon_dec=5e-4):
    self.gamma = gamma
    self.epsilon = epsilon
    self.epsilon_min = epsilon_end
    self.epsilon_dec = epsilon_dec
    self.learning_rate = learning_rate
    self.action_space = [i for i in range(n_actions)]
    self.memory_size = max_memory_size
    self.batch_size = batch_size
    self.memory_counter = 0

    self.Q_eval = DeepQNetwork(
      learning_rate=self.learning_rate,
      input_dimensions=input_dimensions,
      n_actions=n_actions,
      fc1_dimensions=256,
      fc2_dimensions=256
    )

    self.state_memory = np.zeros((self.memory_size, *input_dimensions), dtype=np.float32)
    self.new_state_memory = np.zeros((self.memory_size, *input_dimensions), dtype=np.float32)
    self.action_memory = np.zeros(self.memory_size, dtype=np.int32)
    self.reward_memory = np.zeros(self.memory_size, dtype=np.float32)
    self.terminal_memory = np.zeros(self.memory_size, dtype=np.uint8)

  def store_transition(self, state, action, reward, state_, done):
    index = self.memory_counter % self.memory_size
    self.state_memory[index] = state
    self.new_state_memory[index] = state_
    self.reward_memory[index] = reward
    self.action_memory[index] = action
    self.terminal_memory[index] = done

    self.memory_counter += 1

  def show_actions(self, observation):
    state = T.tensor([observation]).to(self.Q_eval.device)
    actions = self.Q_eval.forward(state)
    return actions

  def choose_action(self, observation, valid_action_indexes):
    if np.random.random() > self.epsilon:
      state = T.tensor([observation]).to(self.Q_eval.device)
      all_actions = self.Q_eval.forward(state)
      valid_action_mask = T.tensor([1e10 if i in valid_action_indexes else -1e10 for i in range(len(all_actions[0]))])
      masked_action_values = T.min(all_actions, valid_action_mask)
      action = T.argmax(masked_action_values).item()
    else:
      action = np.random.choice(valid_action_indexes)

    return action

  def learn(self):
    if self.memory_counter < self.batch_size:
      return

    self.Q_eval.optimizer.zero_grad()

    max_memory = min(self.memory_counter, self.memory_size)
    batch = np.random.choice(max_memory, self.batch_size, replace=False)
    batch_index = np.arange(self.batch_size, dtype=np.int32)

    state_batch = T.tensor(self.state_memory[batch]).to(self.Q_eval.device)
    new_state_batch = T.tensor(self.new_state_memory[batch]).to(self.Q_eval.device)
    reward_batch = T.tensor(self.reward_memory[batch]).to(self.Q_eval.device)
    terminal_batch = T.tensor(self.terminal_memory[batch]).to(self.Q_eval.device)

    action_batch = self.action_memory[batch]

    q_eval = self.Q_eval.forward(state_batch)[batch_index, action_batch]
    q_next = self.Q_eval.forward(new_state_batch)
    q_next[terminal_batch] = 0

    q_target = reward_batch + self.gamma * T.max(q_next, dim=1)[0]

    loss = self.Q_eval.loss(q_target, q_eval).to(self.Q_eval.device)
    loss.backward()
    self.Q_eval.optimizer.step()

    self.epsilon = self.epsilon - self.epsilon_dec if self.epsilon > self.epsilon_min else self.epsilon_min
