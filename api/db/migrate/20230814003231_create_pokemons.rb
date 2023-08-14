class CreatePokemons < ActiveRecord::Migration[7.0]
  def change
    create_table :pokemons do |t|
      t.string :uuid, null: false
      t.string :ident, null: false
      t.string :forme_root_ident
      t.integer :national_pokedex_number
      t.integer :regional_pokedex_number
      t.integer :pokedex_region, default: 0
      t.string :evolution_line_ident
      t.integer :evolution_line_index
      t.boolean :can_evolve
      t.integer :primary_type, null: false, default: 0
      t.string :secondary_type
      t.integer :weight
      t.string :genders, array: true, default: []
      t.string :ability_idents, array: true, default: []
      t.string :move_idents, array: true, default: []
      t.integer :base_stat_hp
      t.integer :base_stat_attack
      t.integer :base_stat_defense
      t.integer :base_stat_special_attack
      t.integer :base_stat_special_defense
      t.integer :base_stat_speed

      t.timestamps
    end
  end
end
