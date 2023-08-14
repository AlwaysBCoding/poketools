# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_08_14_003231) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "pokemons", force: :cascade do |t|
    t.string "uuid", null: false
    t.string "ident", null: false
    t.string "forme_root_ident"
    t.integer "national_pokedex_number"
    t.integer "regional_pokedex_number"
    t.integer "pokedex_region", default: 0
    t.string "evolution_line_ident"
    t.string "evolution_line_index"
    t.boolean "can_evolve"
    t.integer "primary_type", default: 0, null: false
    t.string "secondary_type"
    t.integer "weight"
    t.string "genders", default: [], array: true
    t.string "ability_idents", default: [], array: true
    t.string "move_idents", default: [], array: true
    t.integer "base_stat_hp"
    t.integer "base_stat_attack"
    t.integer "base_stat_defense"
    t.integer "base_stat_special_attack"
    t.integer "base_stat_special_defense"
    t.integer "base_stat_speed"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
