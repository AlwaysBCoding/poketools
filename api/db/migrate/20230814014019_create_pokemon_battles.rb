class CreatePokemonBattles < ActiveRecord::Migration[7.0]
  def change
    create_table :pokemon_battles do |t|
      t.string :uuid, null: false
      t.references :user_team, foreign_key: { to_table: :pokemon_teams }, index: true, null: false
      t.string :opponent_username
      t.integer :opponent_pokemon_ids, array: true, default: []
      t.integer :opponent_rating
      t.integer :result
      t.integer :user_lead_pokemon_ids, array: true, default: []
      t.integer :user_back_pokemon_ids, array: true, default: []
      t.integer :opponent_lead_pokemon_ids, array: true, default: []
      t.integer :opponent_back_pokemon_ids, array: true, default: []

      t.timestamps
    end
  end
end
