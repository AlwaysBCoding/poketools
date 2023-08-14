class CreatePokemonBuilds < ActiveRecord::Migration[7.0]
  def change
    create_table :pokemon_builds do |t|
      t.string :uuid, null: false
      t.string :nickname
      t.belongs_to :pokemon, null: false, foreign_key: true
      t.string :ability_ident
      t.string :item_ident
      t.integer :level
      t.boolean :shiny
      t.string :gender
      t.integer :tera_type, null: false, default: 0
      t.integer :nature, null: false, default: 0
      t.string :move_idents, array: true, default: []
      t.integer :iv_hp
      t.integer :iv_attack
      t.integer :iv_defense
      t.integer :iv_special_attack
      t.integer :iv_special_defense
      t.integer :iv_speed
      t.integer :ev_hp
      t.integer :ev_attack
      t.integer :ev_defense
      t.integer :ev_special_attack
      t.integer :ev_special_defense
      t.integer :ev_speed
      t.integer :stat_hp
      t.integer :stat_attack
      t.integer :stat_defense
      t.integer :stat_special_attack
      t.integer :stat_special_defense
      t.integer :stat_speed

      t.timestamps
    end
  end
end
