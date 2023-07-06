require "open-uri"

region = ARGV[0]
dex = ARGV[1]
pokemon = ARGV[2]

front_url = "https://play.pokemonshowdown.com/sprites/ani/#{pokemon}.gif"
back_url = "https://play.pokemonshowdown.com/sprites/ani-back/#{pokemon}.gif"
shiny_front_url = "https://play.pokemonshowdown.com/sprites/ani-shiny/#{pokemon}.gif"
shiny_back_url = "https://play.pokemonshowdown.com/sprites/ani-back-shiny/#{pokemon}.gif"

front_file_path = "/Users/jordanleigh/Desktop/poketools/src/data/pokemon/#{region}/#{dex}-#{pokemon}/#{pokemon}.motion.front.gif"
back_file_path = "/Users/jordanleigh/Desktop/poketools/src/data/pokemon/#{region}/#{dex}-#{pokemon}/#{pokemon}.motion.back.gif"
shiny_front_file_path = "/Users/jordanleigh/Desktop/poketools/src/data/pokemon/#{region}/#{dex}-#{pokemon}/#{pokemon}.shiny.motion.front.gif"
shiny_back_file_path = "/Users/jordanleigh/Desktop/poketools/src/data/pokemon/#{region}/#{dex}-#{pokemon}/#{pokemon}.shiny.motion.back.gif"

open(front_file_path, "wb") do |file|
  file << URI.open(front_url).read
end

open(back_file_path, "wb") do |file|
  file << URI.open(back_url).read
end

open(shiny_front_file_path, "wb") do |file|
  file << URI.open(shiny_front_url).read
end

open(shiny_back_file_path, "wb") do |file|
  file << URI.open(shiny_back_url).read
end
