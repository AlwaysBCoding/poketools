export interface PokemonStatSpread {
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
};

export type PokemonGender =
  | "male"
  | "female"
  | "genderless";

export type PokemonMoveCategory =
  | "physical"
  | "special"
  | "non-damaging"

export type PokemonType =
  | "normal"
  | "fighting"
  | "flying"
  | "poison"
  | "ground"
  | "rock"
  | "bug"
  | "ghost"
  | "steel"
  | "fire"
  | "water"
  | "grass"
  | "electric"
  | "psychic"
  | "ice"
  | "dragon"
  | "dark"
  | "fairy";

export type PokemonNature =
  | "adamant"
  | "bashful"
  | "bold"
  | "brave"
  | "calm"
  | "careful"
  | "docile"
  | "gentle"
  | "hardy"
  | "hasty"
  | "impish"
  | "jolly"
  | "lax"
  | "lonely"
  | "mild"
  | "modest"
  | "naive"
  | "naughty"
  | "quiet"
  | "quirky"
  | "rash"
  | "relaxed"
  | "sassy"
  | "serious"
  | "timid";

export type PokemonAbility =
  | "adaptability"
  | "aroma-veil"
  | "big-pecks"
  | "blaze"
  | "cheek-pouch"
  | "chlorophyll"
  | "compound-eyes"
  | "early-bird"
  | "flame-body"
  | "flash-fire"
  | "friend-guard"
  | "gale-wings"
  | "gluttony"
  | "infiltrator"
  | "insomnia"
  | "iron-fist"
  | "leaf-guard"
  | "lingering-aroma"
  | "moxie"
  | "natural-cure"
  | "overgrow"
  | "protean"
  | "run-away"
  | "shed-skin"
  | "shield-dust"
  | "solar-power"
  | "stakeout"
  | "static"
  | "strong-jaw"
  | "swarm"
  | "technician"
  | "tinted-lens"
  | "torrent"
  | "unaware"
  | "unnerve";

export type PokemonEvolutionLine =
  | "fletchling"
  | "fuecoco"
  | "hoppip"
  | "houndour"
  | "kricketot"
  | "lechonk"
  | "nymble"
  | "pawmi"
  | "quaxly"
  | "scatterbug"
  | "skwovet"
  | "sprigatito"
  | "sunkern"
  | "tarountula"
  | "yungoos";

export type PokemonItem =
  | "ability-shield"
  | "absorb-bulb"
  | "adrenaline-orb"
  | "aguav-berry"
  | "air-balloon"
  | "apicot-berry"
  | "assault-vest"
  | "auspicious-armor"
  | "babiri-berry"
  | "berry-juice"
  | "black-belt"
  | "black-glasses"
  | "black-sludge"
  | "blunder-policy"
  | "booster-energy"
  | "bright-powder"
  | "cell-battery"
  | "charcoal"
  | "charti-berry"
  | "chesto-berry"
  | "chilian-berry"
  | "choice-band"
  | "choice-scarf"
  | "choice-specs"
  | "chople-berry"
  | "clear-amulet"
  | "coba-berry"
  | "colbur-berry"
  | "covert-cloak"
  | "custap-berry"
  | "damp-rock"
  | "dragon-fang"
  | "eject-button"
  | "eject-pack"
  | "electric-seed"
  | "eviolite"
  | "expert-belt"
  | "figy-berry"
  | "flame-orb"
  | "focus-sash"
  | "full-incense"
  | "ganlon-berry"
  | "grassy-seed"
  | "grepa-berry"
  | "grip-claw"
  | "haban-berry"
  | "hard-stone"
  | "heat-rock"
  | "heavy-duty-boots"
  | "iapapa-berry"
  | "icy-rock"
  | "kasib-berry"
  | "kebia-berry"
  | "kee-berry"
  | "kelpsy-berry"
  | "kings-rock"
  | "lagging-tail"
  | "lansat-berry"
  | "lax-incense"
  | "leftovers"
  | "leppa-berry"
  | "liechi-berry"
  | "life-orb"
  | "light-clay"
  | "loaded-dice"
  | "lum-berry"
  | "luminous-moss"
  | "magnet"
  | "mago-berry"
  | "malicious-armor"
  | "maranga-berry"
  | "mental-herb"
  | "metal-coat"
  | "metronome"
  | "micle-berry"
  | "miracle-seed"
  | "mirror-herb"
  | "misty-seed"
  | "muscle-band"
  | "mystic-water"
  | "never-melt-ice"
  | "normal-gem"
  | "occa-berry"
  | "odd-incense"
  | "passho-berry"
  | "payapa-berry"
  | "petaya-berry"
  | "pixie-plate"
  | "poison-barb"
  | "power-herb"
  | "protective-pads"
  | "psychic-seed"
  | "punching-glove"
  | "quick-claw"
  | "razor-claw"
  | "red-card"
  | "rindo-berry"
  | "rock-incense"
  | "rocky-helmet"
  | "room-service"
  | "rose-incense"
  | "roseli-berry"
  | "safety-goggles"
  | "salac-berry"
  | "scope-lens"
  | "sea-incense"
  | "sharp-beak"
  | "shed-shell"
  | "shell-bell"
  | "shuca-berry"
  | "silk-scarf"
  | "silver-powder"
  | "sitrus-berry"
  | "smooth-rock"
  | "snowball"
  | "soft-sand"
  | "spell-tag"
  | "starf-berry"
  | "sticky-barb"
  | "tanga-berry"
  | "terrain-extender"
  | "throat-spray"
  | "toxic-orb"
  | "twisted-spoon"
  | "utility-umbrella"
  | "wacan-berry"
  | "wave-incense"
  | "weakness-policy"
  | "white-herb"
  | "wide-lens"
  | "wiki-berry"
  | "wise-glasses"
  | "yache-berry"
  | "zoom-lens";

export type PokemonMove =
  | "acrobatics"
  | "agility"
  | "ally-switch"
  | "bite"
  | "bullet-seed"
  | "charm"
  | "disarming-voice"
  | "endure"
  | "energy-ball"
  | "facade"
  | "fake-tears"
  | "giga-drain"

export type PokemonStat =
  | "hp"
  | "attack"
  | "defense"
  | "special_attack"
  | "special_defense"
  | "speed"

export type PokemonMoveTarget =
  | "self"
  | "ally"
  | "own-side"
  | "target"
  | "target-side"
  | "enemy"
  | "enemy-side"
  | "all-adjacent"

export type PokemonStatus =
  | "flinch"
  | "survival"
