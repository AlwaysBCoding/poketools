class Pokemon < ApplicationRecord
  enum pokedex_region: { kanto: 0, johto: 1, hoenn: 2, sinnoh: 3, unova: 4, kalos: 5, alola: 6, galar: 7, hisui: 8, paldea: 9 }
  enum primary_type: { normal: 0, fighting: 1, flying: 2, poison: 3, ground: 4, rock: 5, bug: 6, ghost: 7, steel: 8, fire: 9, water: 10, grass: 11, electric: 12, psychic: 13, ice: 14, dragon: 15, dark: 16, fairy: 17 }, _prefix: :primary
  enum secondary_type: { normal: 0, fighting: 1, flying: 2, poison: 3, ground: 4, rock: 5, bug: 6, ghost: 7, steel: 8, fire: 9, water: 10, grass: 11, electric: 12, psychic: 13, ice: 14, dragon: 15, dark: 16, fairy: 17 }, _prefix: :secondary
  validates :uuid, :ident, :primary_type, presence: true

  before_validation :generate_uuid, on: :create

  # Class Methods
  # =====================

  # Instance Methods
  # =====================
  def base_stats
    {
      hp: self.base_stat_hp,
      attack: self.base_stat_attack,
      defense: self.base_stat_defense,
      special_attack: self.base_stat_special_attack,
      special_defense: self.base_stat_special_defense,
      speed: self.base_stat_speed
    }
  end

  # Callbacks
  # =====================
  def generate_uuid
    self.uuid ||= SecureRandom.uuid
  end

  # Serializers
  # =====================


end
