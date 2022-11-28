require "nokogiri"
require "watir"

pokemon = ARGV[0]
url = "https://www.smogon.com/dex/sv/pokemon/#{pokemon}/"

browser = Watir::Browser.new :chrome, headless: true
browser.goto(url)

sleep 2

doc = Nokogiri::HTML.parse(browser.html)
move_rows = doc.css(".DexTable .MoveRow")

move_rows.each do |move_row|
  move = move_row.at_css(".MoveRow-name").text
  p move.downcase.split(/\s+/).join("-")
end
