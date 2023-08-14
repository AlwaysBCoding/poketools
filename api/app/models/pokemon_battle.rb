class PokemonBattle < ApplicationRecord
  enum :result, { loss: 0, win: 1 }
  validates :uuid, presence: true

  belongs_to :user_team, class_name: 'PokemonTeam'

  before_validation :generate_uuid, on: :create

  # Class Methods
  # =====================

  # Instance Methods
  # =====================
  def opponent_pokemon
    Pokemon.where(id: self.opponent_pokemon_ids)
  end

  def user_lead_pokemon
    Pokemon.where(id: self.user_lead_pokemon_ids)
  end

  def user_back_pokemon
    Pokemon.where(id: self.user_back_pokemon_ids)
  end

  def user_pokemon
    self.user_lead_pokemon + self.user_back_pokemon
  end

  def opponent_lead_pokemon
    Pokemon.where(id: self.opponent_lead_pokemon_ids)
  end

  def opponent_back_pokemon
    Pokemon.where(id: self.opponent_back_pokemon_ids)
  end

  def opponent_pokemon
    self.opponent_lead_pokemon + self.opponent_back_pokemon
  end

  # Callbacks
  # =====================
  def generate_uuid
    self.uuid ||= SecureRandom.uuid
  end

  # Serializers
  # =====================

end
