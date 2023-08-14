class PokemonTeam < ApplicationRecord
  validates :uuid, presence: true

  before_validation :generate_uuid, on: :create

  # Class Methods
  # =====================

  # Instance Methods
  # =====================
  def pokemon_builds
    PokemonBuild.where(id: self.pokemon_build_ids)
  end

  # Callbacks
  # =====================
  def generate_uuid
    self.uuid ||= SecureRandom.uuid
  end

  # Serializers
  # =====================

end
