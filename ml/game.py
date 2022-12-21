import numpy as np

class Game():
  def __init__(self):
    self.thunderbolt_damage_rolls = [
      [42, 42, 42, 43, 43, 44, 45, 45, 45, 46, 46, 47, 48, 48, 48, 49],
      [62, 63, 63, 64, 65, 66, 66, 67, 68, 69, 69, 70, 71, 72, 72, 73],
      [82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97],
      [102, 104, 105, 106, 108, 108, 110, 111, 112, 114, 114, 116, 117, 118, 120, 121],
      [123, 124, 126, 127, 129, 130, 132, 133, 135, 136, 138, 139, 141, 142, 144, 145],
      [144, 145, 147, 148, 150, 152, 153, 155, 157, 159, 160, 162, 164, 165, 167, 169],
      [165, 166, 168, 170, 172, 174, 176, 178, 180, 182, 184, 186, 188, 189, 192, 194]
    ]
    self.charge_beam_damage_rolls = [
      [23, 23, 24, 24, 24, 24, 24, 25, 25, 25, 26, 26, 26, 27, 27, 27],
      [34, 35, 35, 36, 36, 36, 37, 37, 38, 38, 39, 39, 39, 39, 40, 41],
      [46, 46, 47, 48, 48, 48, 49, 50, 50, 51, 51, 52, 52, 53, 54, 54],
      [57, 58, 59, 60, 60, 60, 61, 62, 63, 63, 64, 65, 66, 66, 67, 68],
      [69, 69, 70, 71, 72, 73, 74, 75, 75, 76, 77, 78, 78, 79, 80, 81],
      [80, 81, 81, 82, 84, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94],
      [91, 92, 93, 94, 96, 96, 98, 99, 99, 101, 102, 103, 104, 105, 106, 108]
    ]
    self.ice_punch_damage_rolls = [39, 40, 40, 41, 42, 42, 42, 42, 43, 44, 44, 45, 45, 45, 46, 47]
    self.sucker_punch_damage_rolls = [39, 40, 40, 41, 42, 42, 42, 42, 43, 44, 44, 45, 45, 45, 46, 47]

  def reset(self):
    self.rotom_hp = 25
    self.rotom_special_attack_stage = 0
    self.abomasnow_hp = 29
    self.abomasnow_special_attack_stage = 0
    self.psychic_terrain_active = 1
    self.psychic_terrain_turns = 2
    self.rotom_consecutive_protect_counter = 0
    return [
      np.float32(self.rotom_hp),
      np.float32(self.rotom_special_attack_stage),
      np.float32(self.abomasnow_hp),
      np.float32(self.abomasnow_special_attack_stage),
      np.float32(self.psychic_terrain_active),
      np.float32(self.psychic_terrain_turns),
      np.float32(self.rotom_consecutive_protect_counter)
    ]

  def step(self, action):
    action = "thunderbolt" if action == 0 else action
    action = "charge-beam" if action == 1 else action
    action = "sucker-punch" if action == 2 else action
    action = "protect" if action == 3 else action

    abomasnow_action = "ice-punch"

    reward = 0
    done = 0

    if action == "protect":
      if self.rotom_consecutive_protect_counter >= 2:
        ice_punch_damage_roll = np.random.choice(self.ice_punch_damage_rolls)
        self.rotom_hp = max(0, (self.rotom_hp - ice_punch_damage_roll))
        self.rotom_consecutive_protect_counter = 0
      else:
        self.rotom_consecutive_protect_counter += 1
    else:
      if action == "sucker-punch":
        if self.psychic_terrain_active == 0:
          sucker_punch_damage_roll = np.random.choice(self.sucker_punch_damage_rolls)
          self.abomasnow_hp = max(0, (self.abomasnow_hp - sucker_punch_damage_roll))
        else:
          ice_punch_damage_roll = np.random.choice(self.ice_punch_damage_rolls)
          self.rotom_hp = max(0, (self.rotom_hp - ice_punch_damage_roll))
      else:
        ice_punch_damage_roll = np.random.choice(self.ice_punch_damage_rolls)
        self.rotom_hp = max(0, (self.rotom_hp - ice_punch_damage_roll))

    if self.abomasnow_hp == 0:
      reward = 1
      done = 1
    elif self.rotom_hp == 0:
      reward = -1
      done = 1

    self.psychic_terrain_turns = max(0, self.psychic_terrain_turns - 1)
    if(self.psychic_terrain_turns == 0):
      self.psychic_terrain_active = 0

    observation_ = [
      np.float32(self.rotom_hp),
      np.float32(self.rotom_special_attack_stage),
      np.float32(self.abomasnow_hp),
      np.float32(self.abomasnow_special_attack_stage),
      np.float32(self.psychic_terrain_active),
      np.float32(self.psychic_terrain_turns),
      np.float32(self.rotom_consecutive_protect_counter)
    ]

    return [observation_, reward, done]
