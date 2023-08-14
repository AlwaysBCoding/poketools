class PokemonBuild < ApplicationRecord
  enum tera_type: { normal: 0, fighting: 1, flying: 2, poison: 3, ground: 4, rock: 5, bug: 6, ghost: 7, steel: 8, fire: 9, water: 10, grass: 11, electric: 12, psychic: 13, ice: 14, dragon: 15, dark: 16, fairy: 17 }, _prefix: :tera
  enum nature: { adamant: 0, bashful: 1, bold: 2, brave: 3, calm: 4, careful: 5, docile: 6, gentle: 7, hardy: 8, hasty: 9, impish: 10, jolly: 11, lax: 12, lonely: 13, mild: 14, modest: 15, naive: 16, naughty: 17, quiet: 18, quirky: 19, rash: 20, relaxed: 21, sassy: 22, serious: 23, timid: 24 }

  validates :uuid, presence: true

  belongs_to :pokemon

  before_validation :generate_uuid, on: :create

  # Class Methods
  # =====================

  # Instance Methods
  # =====================
  def iv_spread
    {
      hp: self.iv_hp,
      attack: self.iv_attack,
      defense: self.iv_defense,
      special_attack: self.iv_special_attack,
      special_defense: self.iv_special_defense,
      speed: self.iv_speed
    }
  end

  def ev_spread
    {
      hp: self.ev_hp,
      attack: self.ev_attack,
      defense: self.ev_defense,
      special_attack: self.ev_special_attack,
      special_defense: self.ev_special_defense,
      speed: self.ev_speed
    }
  end

  def stat_spread
    {
      hp: self.stat_hp,
      attack: self.stat_attack,
      defense: self.stat_defense,
      special_attack: self.stat_special_attack,
      special_defense: self.stat_special_defense,
      speed: self.stat_speed
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
