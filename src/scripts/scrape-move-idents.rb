require "nokogiri"
require "watir"

pokemon = "tsareena"
url = "https://www.smogon.com/dex/sv/pokemon/#{pokemon}/"

browser = Watir::Browser.new :chrome, headless: true
browser.goto("url")

sleep 3

doc = Nokogiri::HTML.parse(browser.html)
puts doc.css(".DexTable .MoveRow")
