require "open-uri"
require "nokogiri"
require "json"

uri = ARGV[0]
doc = Nokogiri::HTML.parse(URI.open(uri))

team = []

doc.css("article").each do |pokemon_build_html|

  pbt = {}

  pbd = pokemon_build_html.at_css("pre").text.split(/\n/).map(&:strip)

  pbt[:pokemon_ident] = pbd[0].split("@").map(&:strip)[0].gsub(/\(.*\)/, "").strip().downcase.split(/\s/).join("-")
  pbt[:nickname] = nil
  pbt[:item_ident] = pbd[0].split("@").map(&:strip)[1].downcase.split(/\s/).join("-")
  pbt[:shiny] = false

  if pbd.detect { |r| r.start_with?("Level:") } then
    pbt[:level] = pbd.detect { |r| r.start_with?("Level:") }.split(":").map(&:strip)[1].to_i
  end

  if pbd.detect { |r| r.start_with?("Ability:") } then
    pbt[:ability_ident] = pbd.detect { |r| r.start_with?("Ability:") }.split(":").map(&:strip)[1].downcase.split(/\s/).join("-")
  end

  if pbd.detect { |r| r.start_with?("Tera Type:") } then
    pbt[:tera_type_ident] = pbd.detect { |r| r.start_with?("Tera Type:") }.split(":").map(&:strip)[1].downcase
  end

  if pbd.detect { |r| r.include?("Nature") } then
    pbt[:nature_ident] = pbd.detect { |r| r.include?("Nature") }.split(/\s/).map(&:strip)[0].downcase
  end

  pbt[:move_idents] = pbd.last(4).map { |s| x = s.split(/\s/); x.shift(); x.map(&:downcase).join("-") }

  iv_spread = {
    hp: 31,
    attack: 31,
    defense: 31,
    special_attack: 31,
    special_defense: 31,
    speed: 31
  }

  if pbd.detect { |r| r.start_with?("IVs:") } then
    ivs = pbd.detect { |r| r.start_with?("IVs:") }.split(":")[1].split("/").map(&:strip).map { |s| s.split(/\s/) }
    if ivs.detect { |r| r[1] == "HP" } then
      iv_spread[:hp] = ivs.detect { |r| r[1] == "HP" }[0].to_i
    end
    if ivs.detect { |r| r[1] == "Atk" } then
      iv_spread[:attack] = ivs.detect { |r| r[1] == "Atk" }[0].to_i
    end
    if ivs.detect { |r| r[1] == "Def" } then
      iv_spread[:defense] = ivs.detect { |r| r[1] == "Def" }[0].to_i
    end
    if ivs.detect { |r| r[1] == "SpA" } then
      iv_spread[:special_attack] = ivs.detect { |r| r[1] == "SpA" }[0].to_i
    end
    if ivs.detect { |r| r[1] == "SpD" } then
      iv_spread[:special_defense] = ivs.detect { |r| r[1] == "SpD" }[0].to_i
    end
    if ivs.detect { |r| r[1] == "Spe" } then
      iv_spread[:speed] = ivs.detect { |r| r[1] == "Spe" }[0].to_i
    end
  end

  pbt[:iv_spread] = iv_spread

  ev_spread = {
    hp: 0,
    attack: 0,
    defense: 0,
    special_attack: 0,
    special_defense: 0,
    speed: 0
  }

  if pbd.detect { |r| r.start_with?("EVs:") } then
    evs = pbd.detect { |r| r.start_with?("EVs:") }.split(":")[1].split("/").map(&:strip).map { |s| s.split(/\s/) }
    if evs.detect { |r| r[1] == "HP" } then
      ev_spread[:hp] = evs.detect { |r| r[1] == "HP" }[0].to_i
    end
    if evs.detect { |r| r[1] == "Atk" } then
      ev_spread[:attack] = evs.detect { |r| r[1] == "Atk" }[0].to_i
    end
    if evs.detect { |r| r[1] == "Def" } then
      ev_spread[:defense] = evs.detect { |r| r[1] == "Def" }[0].to_i
    end
    if evs.detect { |r| r[1] == "SpA" } then
      ev_spread[:special_attack] = evs.detect { |r| r[1] == "SpA" }[0].to_i
    end
    if evs.detect { |r| r[1] == "SpD" } then
      ev_spread[:special_defense] = evs.detect { |r| r[1] == "SpD" }[0].to_i
    end
    if evs.detect { |r| r[1] == "Spe" } then
      ev_spread[:speed] = evs.detect { |r| r[1] == "Spe" }[0].to_i
    end
  end

  pbt[:ev_spread] = ev_spread

  team.push(pbt)

end

puts JSON.generate(team)
