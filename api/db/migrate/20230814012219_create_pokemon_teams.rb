class CreatePokemonTeams < ActiveRecord::Migration[7.0]
  def change
    create_table :pokemon_teams do |t|
      t.string :uuid, null: false
      t.string :team_name
      t.integer :pokemon_build_ids, array: true, default: []

      t.timestamps
    end
  end
end
