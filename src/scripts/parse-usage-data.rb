require 'json'

f = File.open(File.join(File.dirname(__FILE__), "../data/stats/2022-12-vgc-series1-usage.txt"))
data = f.readlines
data = data.map!(&:chomp)

usage_data = []

sections = ["pokemon", "usage", "abilities", "items", "spreads", "moves", "teammates", "counters"]
section_cursor = -1
next_pokemon_data = {}

data.each do |line|

  if line == " +----------------------------------------+"
    if section_cursor == 7
      section_cursor = -1
      usage_data << next_pokemon_data
      next_pokemon_data = {}
    else
      section_cursor += 1
    end
  elsif section_cursor == 0
    pokemon_ident = line.gsub("|", "").strip.downcase
    next_pokemon_data["ident"] = pokemon_ident
    next_pokemon_data["abilities"] = []
    next_pokemon_data["items"] = []
    next_pokemon_data["spreads"] = []
    next_pokemon_data["moves"] = []
    next_pokemon_data["teammates"] = []
  elsif section_cursor == 1
  elsif section_cursor == 2
    next if line.gsub("|", "").strip == "Abilities"
    line_data = line.gsub("|", "").strip.split(" ")
    usage_percentage = line_data.pop().to_f
    ability_ident = line_data.join("-").downcase
    next if ability_ident == "other"
    ability_data = [ability_ident, usage_percentage]
    next_pokemon_data["abilities"] << ability_data
  elsif section_cursor == 3
    next if line.gsub("|", "").strip == "Items"
    line_data = line.gsub("|", "").strip.split(" ")
    usage_percentage = line_data.pop().to_f
    item_ident = line_data.join("-").downcase
    next if item_ident == "other"
    item_data = [item_ident, usage_percentage]
    next_pokemon_data["items"] << item_data
  elsif section_cursor == 4
    next if line.gsub("|", "").strip == "Spreads"
    line_data = line.gsub("|", "").strip.split(" ")
    next if line_data[0] == "Other"
    usage_percentage = line_data.pop().to_f
    ev_data = line_data[0].split(":")
    nature = ev_data[0].downcase
    evs = ev_data[1].split("/").map(&:to_i)
    spread_data = [nature, evs, usage_percentage]
    next_pokemon_data["spreads"] << spread_data
  elsif section_cursor == 5
    next if line.gsub("|", "").strip == "Moves"
    line_data = line.gsub("|", "").strip.split(" ")
    next if line_data[0] == "Other"
    usage_percentage = line_data.pop().to_f
    move_ident = line_data.join("-").downcase
    move_data = [move_ident, usage_percentage]
    next_pokemon_data["moves"] << move_data
  elsif section_cursor == 6
    next if line.gsub("|", "").strip == "Teammates"
    line_data = line.gsub("|", "").strip.split(" ")
    next if line_data[0] == "Other"
    usage_percentage = line_data.pop().to_f
    teammate_ident = line_data.join("-").downcase
    teammate_data = [teammate_ident, usage_percentage]
    next_pokemon_data["teammates"] << teammate_data
  elsif section_cursor == 7
  end

end

File.write(File.join(File.dirname(__FILE__), "../data/stats/2022-12-vgc-series1-usage.json"), JSON.dump(usage_data))
