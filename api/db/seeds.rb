file_path = Rails.root.join('..', 'shared', 'data', 'all-pokemon.json')
file_content = File.read(file_path)
data = JSON.parse(file_content)

data.each do |pokemon_data|

  Pokemon.create!({
    ident: pokemon_data['ident'],
    forme_root_ident: pokemon_data['forme_root_ident'] ? pokemon_data['forme_root_ident'] : pokemon_data['ident'],
    national_pokedex_number: pokemon_data['national_pokedex_number'],
    regional_pokedex_number: pokemon_data['regional_pokedex_number'],
    pokedex_region: pokemon_data['pokedex_region'],
    evolution_line_ident: pokemon_data['evolution_line_ident'],
    evolution_line_index: pokemon_data['evolution_line_index'],
    can_evolve: pokemon_data['can_evolve'] ? pokemon_data['can_evolve'] : false,
    primary_type: pokemon_data['primary_type_ident'],
    secondary_type: pokemon_data['secondary_type_ident'],
    weight: pokemon_data['weight'],
    genders: pokemon_data['genders'],
    ability_idents: pokemon_data['ability_idents'],
    move_idents: pokemon_data['move_idents'],
    base_stat_hp: pokemon_data['base_stats']['hp'],
    base_stat_attack: pokemon_data['base_stats']['attack'],
    base_stat_defense: pokemon_data['base_stats']['defense'],
    base_stat_special_attack: pokemon_data['base_stats']['special_attack'],
    base_stat_special_defense: pokemon_data['base_stats']['special_defense'],
    base_stat_speed: pokemon_data['base_stats']['speed'],
  })

  puts "CREATED: #{pokemon_data['ident']}"

end
