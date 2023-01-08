export interface PokemonStatSpread {
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
};

export const calculatePokemonTotalStats = (statSpread: PokemonStatSpread): number => {
  return (statSpread.hp + statSpread.attack + statSpread.defense + statSpread.special_attack + statSpread.special_defense + statSpread.speed);
}

export interface PokemonTypeInteraction {
  offensive_type_ident: PokemonTypeIdent;
  defensive_type_ident: PokemonTypeIdent;
  effectiveness: number;
}

export type PokemonGender =
  | "male"
  | "female"
  | "genderless";

export type PokemonMoveCategory =
  | "physical"
  | "special"
  | "non-damaging"

export type PokemonTypeIdent =
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

export type PokemonNatureIdent =
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

export type PokemonAbilityIdent =
  | "adaptability"
  | "aftermath"
  | "analytic"
  | "anger-point"
  | "anger-shell"
  | "anticipation"
  | "arena-trap"
  | "armor-tail"
  | "aroma-veil"
  | "big-pecks"
  | "blaze"
  | "bulletproof"
  | "cheek-pouch"
  | "chlorophyll"
  | "clear-body"
  | "cloud-nine"
  | "commander"
  | "competitive"
  | "compound-eyes"
  | "contrary"
  | "corrosion"
  | "cud-chew"
  | "cursed-body"
  | "cute-charm"
  | "damp"
  | "dancer"
  | "defiant"
  | "disguise"
  | "drizzle"
  | "drought"
  | "dry-skin"
  | "early-bird"
  | "earth-eater"
  | "effect-spore"
  | "electromorphosis"
  | "flame-body"
  | "flare-boost"
  | "flash-fire"
  | "flower-veil"
  | "fluffy"
  | "forewarn"
  | "friend-guard"
  | "frisk"
  | "gale-wings"
  | "gluttony"
  | "gooey"
  | "good-as-gold"
  | "grass-pelt"
  | "guard-dog"
  | "guts"
  | "harvest"
  | "healer"
  | "heatproof"
  | "heavy-metal"
  | "honey-gather"
  | "huge-power"
  | "hustle"
  | "hydration"
  | "hyper-cutter"
  | "ice-body"
  | "illusion"
  | "immunity"
  | "imposter"
  | "infiltrator"
  | "inner-focus"
  | "insomnia"
  | "intimidate"
  | "iron-fist"
  | "justified"
  | "keen-eye"
  | "klutz"
  | "leaf-guard"
  | "levitate"
  | "lightning-rod"
  | "limber"
  | "lingering-aroma"
  | "liquid-ooze"
  | "magic-bounce"
  | "magician"
  | "magma-armor"
  | "magnet-pull"
  | "marvel-scale"
  | "minus"
  | "mirror-armor"
  | "mold-breaker"
  | "moody"
  | "moxie"
  | "multiscale"
  | "mycelium-might"
  | "natural-cure"
  | "no-guard"
  | "oblivious"
  | "overgrow"
  | "own-tempo"
  | "pickpocket"
  | "pickup"
  | "pixilate"
  | "plus"
  | "poison-heal"
  | "poison-point"
  | "poison-touch"
  | "prankster"
  | "pressure"
  | "propeller-tail"
  | "protean"
  | "protosynthesis"
  | "psychic-surge"
  | "punk-rock"
  | "pure-power"
  | "purifying-salt"
  | "queenly-majesty"
  | "quick-feet"
  | "rain-dish"
  | "rattled"
  | "reckless"
  | "regenerator"
  | "ripen"
  | "rivalry"
  | "rock-head"
  | "rough-skin"
  | "run-away"
  | "sand-force"
  | "sand-rush"
  | "sand-stream"
  | "sand-veil"
  | "sap-sipper"
  | "seed-sower"
  | "serene-grace"
  | "shadow-tag"
  | "shed-skin"
  | "sheer-force"
  | "shell-armor"
  | "shield-dust"
  | "simple"
  | "slush-rush"
  | "snow-cloak"
  | "solar-power"
  | "solid-rock"
  | "soundproof"
  | "stakeout"
  | "stall"
  | "stamina"
  | "static"
  | "steadfast"
  | "steam-engine"
  | "stench"
  | "sticky-hold"
  | "storm-drain"
  | "strong-jaw"
  | "sturdy"
  | "super-luck"
  | "supreme-overlord"
  | "swarm"
  | "sweet-veil"
  | "swift-swim"
  | "symbiosis"
  | "synchronize"
  | "technician"
  | "telepathy"
  | "thermal-exchange"
  | "thick-fat"
  | "tinted-lens"
  | "torrent"
  | "tough-claws"
  | "toxic-boost"
  | "toxic-debris"
  | "trace"
  | "truant"
  | "unaware"
  | "unburden"
  | "unnerve"
  | "vital-spirit"
  | "volt-absorb"
  | "water-absorb"
  | "water-veil"
  | "weak-armor"
  | "well-baked-body"
  | "white-smoke"
  | "wind-power"
  | "wind-rider";

export type PokemonEvolutionLine =
  | "applin"
  | "arrokuda"
  | "axew"
  | "azurill"
  | "barboach"
  | "basculin"
  | "bonsly"
  | "bounsweet"
  | "bramblin"
  | "bronzor"
  | "buizel"
  | "capsakid"
  | "charcadet"
  | "chewtle"
  | "combee"
  | "crabrawler"
  | "croagunk"
  | "cufant"
  | "dedenne"
  | "deerling"
  | "deino"
  | "diglett"
  | "ditto"
  | "dondozo"
  | "dratini"
  | "dreepy"
  | "drifloon"
  | "drowzee"
  | "dunsparce"
  | "eevee"
  | "fidough"
  | "finizen"
  | "flabebe"
  | "fletchling"
  | "flutter_mane"
  | "fomantis"
  | "foongus"
  | "frigibax"
  | "fuecoco"
  | "gastly"
  | "gible"
  | "gimmighoul"
  | "girafarig"
  | "glimmet"
  | "goomy"
  | "gothita"
  | "greavard"
  | "grimer"
  | "growlithe"
  | "gulpin"
  | "happiny"
  | "hatenna"
  | "hoppip"
  | "houndour"
  | "igglybuff"
  | "impidimp"
  | "indeedee"
  | "klawf"
  | "klefki"
  | "kricketot"
  | "larvesta"
  | "larvitar"
  | "lechonk"
  | "litleo"
  | "magikarp"
  | "magnemite"
  | "makuhita"
  | "mankey"
  | "mareep"
  | "maschiff"
  | "meditite"
  | "meowth"
  | "misdreavus"
  | "mudbray"
  | "murkrow"
  | "nacli"
  | "numel"
  | "nymble"
  | "oranguru"
  | "oricorio"
  | "orthworm"
  | "pachirisu"
  | "pawmi"
  | "pawniard"
  | "petilil"
  | "phanpy"
  | "pichu"
  | "psyduck"
  | "quaxly"
  | "ralts"
  | "riolu"
  | "rockruff"
  | "rolycoly"
  | "rookidee"
  | "rotom"
  | "sableye"
  | "salandit"
  | "scatterbug"
  | "seviper"
  | "shellos"
  | "shinx"
  | "shroodle"
  | "shroomish"
  | "sinistea"
  | "skiddo"
  | "skwovet"
  | "slakoth"
  | "smoliv"
  | "sneasel"
  | "spoink"
  | "sprigatito"
  | "squawkabilly"
  | "stantler"
  | "starly"
  | "stunky"
  | "sunkern"
  | "surskit"
  | "swablu"
  | "tadbulb"
  | "tandemaus"
  | "tarountula"
  | "tatsugiri"
  | "tauros"
  | "teddiursa"
  | "tinkatink"
  | "toedscool"
  | "torkoal"
  | "toxel"
  | "tropius"
  | "voltorb"
  | "wattrel"
  | "wingull"
  | "wooper"
  | "yungoos"
  | "zangoose"
  | "zorua";

export type PokemonIdent = string;

export type PokemonItemIdent =
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
  | "iron-ball"
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

export type PokemonMoveIdent =
  | "absorb"
  | "accelerock"
  | "acid"
  | "acid-armor"
  | "acid-spray"
  | "acrobatics"
  | "acupressure"
  | "aerial-ace"
  | "after-you"
  | "agility"
  | "air-cutter"
  | "air-slash"
  | "ally-switch"
  | "amnesia"
  | "ancient-power"
  | "apple-acid"
  | "aqua-cutter"
  | "aqua-jet"
  | "aqua-ring"
  | "aqua-step"
  | "aqua-tail"
  | "armor-cannon"
  | "arm-thrust"
  | "aromatic-mist"
  | "assurance"
  | "astonish"
  | "attack-order"
  | "attract"
  | "aura-sphere"
  | "aurora-beam"
  | "aurora-veil"
  | "avalanche"
  | "axe-kick"
  | "baby-doll-eyes"
  | "baneful-bunker"
  | "barb-barrage"
  | "baton-pass"
  | "beat-up"
  | "belch"
  | "belly-drum"
  | "bind"
  | "bite"
  | "bitter-blade"
  | "blast-burn"
  | "blizzard"
  | "block"
  | "body-press"
  | "body-slam"
  | "bone-rush"
  | "boomburst"
  | "bounce"
  | "brave-bird"
  | "breaking-swipe"
  | "brick-break"
  | "brine"
  | "brutal-swing"
  | "bubble-beam"
  | "bug-bite"
  | "bug-buzz"
  | "bulk-up"
  | "bulldoze"
  | "bullet-punch"
  | "bullet-seed"
  | "calm-mind"
  | "charge"
  | "charge-beam"
  | "charm"
  | "chilling-water"
  | "chilly-reception"
  | "circle-throw"
  | "clear-smog"
  | "close-combat"
  | "coil"
  | "collision-course"
  | "comeuppance"
  | "confide"
  | "confuse-ray"
  | "confusion"
  | "copycat"
  | "cosmic-power"
  | "cotton-guard"
  | "cotton-spore"
  | "counter"
  | "covet"
  | "crabhammer"
  | "cross-chop"
  | "cross-poison"
  | "crunch"
  | "crush-claw"
  | "curse"
  | "dark-pulse"
  | "dazzling-gleam"
  | "defend-order"
  | "defense-curl"
  | "defog"
  | "destiny-bond"
  | "detect"
  | "dig"
  | "disable"
  | "disarming-voice"
  | "discharge"
  | "dive"
  | "doodle"
  | "double-edge"
  | "double-hit"
  | "double-kick"
  | "double-shock"
  | "double-team"
  | "draco-meteor"
  | "dragon-breath"
  | "dragon-claw"
  | "dragon-dance"
  | "dragon-darts"
  | "dragon-pulse"
  | "dragon-rush"
  | "dragon-tail"
  | "draining-kiss"
  | "drain-punch"
  | "dream-eater"
  | "drill-peck"
  | "drill-run"
  | "dual-wingbeat"
  | "dynamic-punch"
  | "earth-power"
  | "earthquake"
  | "echoed-voice"
  | "eerie-impulse"
  | "electric-terrain"
  | "electro-ball"
  | "electro-drift"
  | "electroweb"
  | "ember"
  | "encore"
  | "endeavor"
  | "endure"
  | "energy-ball"
  | "entrainment"
  | "eruption"
  | "expanding-force"
  | "explosion"
  | "extrasensory"
  | "extreme-speed"
  | "facade"
  | "fairy-wind"
  | "fake-out"
  | "fake-tears"
  | "false-surrender"
  | "false-swipe"
  | "feather-dance"
  | "feint"
  | "fell-stinger"
  | "fiery-dance"
  | "fillet-away"
  | "final-gambit"
  | "fire-blast"
  | "fire-fang"
  | "fire-lash"
  | "fire-pledge"
  | "fire-punch"
  | "fire-spin"
  | "first-impression"
  | "fissure"
  | "flail"
  | "flame-charge"
  | "flamethrower"
  | "flame-wheel"
  | "flare-blitz"
  | "flash-cannon"
  | "flatter"
  | "fling"
  | "flip-turn"
  | "flower-trick"
  | "fly"
  | "flying-press"
  | "focus-blast"
  | "focus-energy"
  | "focus-punch"
  | "follow-me"
  | "force-palm"
  | "foul-play"
  | "freeze-dry"
  | "frenzy-plant"
  | "frost-breath"
  | "fury-attack"
  | "fury-cutter"
  | "fury-swipes"
  | "future-sight"
  | "gastro-acid"
  | "giga-drain"
  | "giga-impact"
  | "gigaton-hammer"
  | "glaive-rush"
  | "glare"
  | "grass-knot"
  | "grass-pledge"
  | "grassy-glide"
  | "grassy-terrain"
  | "grav-apple"
  | "gravity"
  | "growl"
  | "growth"
  | "guard-split"
  | "guard-swap"
  | "guillotine"
  | "gunk-shot"
  | "gust"
  | "gyro-ball"
  | "hammer-arm"
  | "harden"
  | "haze"
  | "headbutt"
  | "headlong-rush"
  | "head-smash"
  | "heal-bell"
  | "healing-wish"
  | "heal-pulse"
  | "heat-crash"
  | "heat-wave"
  | "heavy-slam"
  | "helping-hand"
  | "hex"
  | "high-horsepower"
  | "high-jump-kick"
  | "hone-claws"
  | "horn-attack"
  | "horn-drill"
  | "horn-leech"
  | "howl"
  | "hurricane"
  | "hydro-cannon"
  | "hydro-pump"
  | "hyper-beam"
  | "hyper-drill"
  | "hyper-voice"
  | "hypnosis"
  | "ice-beam"
  | "ice-burn"
  | "ice-fang"
  | "ice-hammer"
  | "ice-punch"
  | "ice-shard"
  | "ice-spinner"
  | "icicle-crash"
  | "icicle-spear"
  | "icy-wind"
  | "imprison"
  | "incinerate"
  | "inferno"
  | "infestation"
  | "ingrain"
  | "instruct"
  | "iron-defense"
  | "iron-head"
  | "iron-tail"
  | "jaw-lock"
  | "jet-punch"
  | "knock-off"
  | "kowtow-cleave"
  | "last-resort"
  | "last-respects"
  | "lava-plume"
  | "leafage"
  | "leaf-blade"
  | "leaf-storm"
  | "leech-life"
  | "leech-seed"
  | "leer"
  | "lick"
  | "life-dew"
  | "light-screen"
  | "liquidation"
  | "lock-on"
  | "low-kick"
  | "low-sweep"
  | "lumina-crash"
  | "lunge"
  | "mach-punch"
  | "magical-leaf"
  | "magic-powder"
  | "magic-room"
  | "magnetic-flux"
  | "magnet-rise"
  | "make-it-rain"
  | "mean-look"
  | "mega-drain"
  | "megahorn"
  | "mega-kick"
  | "memento"
  | "metal-burst"
  | "metal-claw"
  | "metal-sound"
  | "meteor-mash"
  | "metronome"
  | "milk-drink"
  | "mimic"
  | "minimize"
  | "mirror-coat"
  | "mist"
  | "misty-terrain"
  | "moonblast"
  | "moonlight"
  | "morning-sun"
  | "mortal-spin"
  | "mud-slap"
  | "muddy-water"
  | "mud-shot"
  | "mystical-fire"
  | "nasty-plot"
  | "night-daze"
  | "night-shade"
  | "night-slash"
  | "noble-roar"
  | "no-retreat"
  | "nuzzle"
  | "order-up"
  | "origin-pulse"
  | "outrage"
  | "overdrive"
  | "overheat"
  | "pain-split"
  | "parabolic-charge"
  | "parting-shot"
  | "payback"
  | "pay-day"
  | "peck"
  | "perish-song"
  | "petal-blizzard"
  | "petal-dance"
  | "phantom-force"
  | "photon-geyser"
  | "pin-missile"
  | "plasma-fists"
  | "play-nice"
  | "pluck"
  | "poison-fang"
  | "poison-gas"
  | "poison-jab"
  | "poison-powder"
  | "poison-sting"
  | "poison-tail"
  | "pollen-puff"
  | "poltergeist"
  | "population-bomb"
  | "pounce"
  | "pound"
  | "powder-snow"
  | "power-gem"
  | "power-shift"
  | "power-split"
  | "power-swap"
  | "power-trick"
  | "power-trip"
  | "power-whip"
  | "precipice-blades"
  | "present"
  | "prismatic-laser"
  | "protect"
  | "psybeam"
  | "psychic"
  | "psychic-fangs"
  | "psychic-terrain"
  | "psycho-cut"
  | "psych-up"
  | "psyshield-bash"
  | "psyshock"
  | "psystrike"
  | "purify"
  | "pyro-ball"
  | "quash"
  | "quick-attack"
  | "quick-guard"
  | "quiver-dance"
  | "rage-fist"
  | "rage-powder"
  | "raging-bull"
  | "raging-fury"
  | "rain-dance"
  | "rapid-spin"
  | "razor-leaf"
  | "razor-shell"
  | "recover"
  | "recycle"
  | "reflect"
  | "reflect-type"
  | "relic-song"
  | "rest"
  | "retaliate"
  | "revelation-dance"
  | "reversal"
  | "revival-blessing"
  | "rising-voltage"
  | "roar"
  | "roar-of-time"
  | "rock-blast"
  | "rock-polish"
  | "rock-slide"
  | "rock-smash"
  | "rock-throw"
  | "rock-tomb"
  | "rock-wrecker"
  | "role-play"
  | "rollout"
  | "roost"
  | "round"
  | "ruination"
  | "sacred-fire"
  | "sacred-sword"
  | "safeguard"
  | "salt-cure"
  | "sand-attack"
  | "sandsear-storm"
  | "sandstorm"
  | "sand-tomb"
  | "savage-spin-out"
  | "scald"
  | "scale-shot"
  | "scary-face"
  | "scorching-sands"
  | "scratch"
  | "screech"
  | "searing-shot"
  | "secret-sword"
  | "seed-bomb"
  | "seed-flare"
  | "seismic-toss"
  | "self-destruct"
  | "shadow-ball"
  | "shadow-bone"
  | "shadow-claw"
  | "shadow-force"
  | "shadow-punch"
  | "shadow-sneak"
  | "shattered-psyche"
  | "shed-tail"
  | "sheer-cold"
  | "shell-side-arm"
  | "shell-smash"
  | "shell-trap"
  | "shelter"
  | "shift-gear"
  | "shock-wave"
  | "shore-up"
  | "silk-trap"
  | "simple-beam"
  | "sing"
  | "sketch"
  | "skill-swap"
  | "skitter-smack"
  | "sky-attack"
  | "slack-off"
  | "slam"
  | "slash"
  | "sleep-powder"
  | "sleep-talk"
  | "sludge"
  | "sludge-bomb"
  | "sludge-wave"
  | "smack-down"
  | "smart-strike"
  | "smog"
  | "smokescreen"
  | "snap-trap"
  | "snarl"
  | "snipe-shot"
  | "snore"
  | "snowscape"
  | "soak"
  | "soft-boiled"
  | "solar-beam"
  | "solar-blade"
  | "spacial-rend"
  | "spark"
  | "sparkling-aria"
  | "spectral-thief"
  | "speed-swap"
  | "spicy-extract"
  | "spikes"
  | "spiky-shield"
  | "spin-out"
  | "spirit-break"
  | "spirit-shackle"
  | "spite"
  | "spit-up"
  | "splash"
  | "spore"
  | "springtide-storm"
  | "stealth-rock"
  | "steam-eruption"
  | "steel-beam"
  | "steel-roller"
  | "steel-wing"
  | "sticky-web"
  | "stockpile"
  | "stomp"
  | "stomping-tantrum"
  | "stone-axe"
  | "stone-edge"
  | "stored-power"
  | "storm-throw"
  | "strange-steam"
  | "strength"
  | "strength-sap"
  | "string-shot"
  | "struggle"
  | "struggle-bug"
  | "stuff-cheeks"
  | "stun-spore"
  | "substitute"
  | "subzero-slammer"
  | "sucker-punch"
  | "sunny-day"
  | "sunsteel-strike"
  | "super-fang"
  | "superpower"
  | "supersonic"
  | "supersonic-sky-strike"
  | "surf"
  | "surging-strikes"
  | "swagger"
  | "swallow"
  | "sweet-kiss"
  | "sweet-scent"
  | "swift"
  | "switcheroo"
  | "swords-dance"
  | "synthesis"
  | "tackle"
  | "tail-slap"
  | "tail-whip"
  | "tailwind"
  | "take-down"
  | "take-heart"
  | "tar-shot"
  | "taunt"
  | "tearful-look"
  | "teatime"
  | "techno-blast"
  | "tectonic-rage"
  | "teleport"
  | "tera-blast"
  | "terrain-pulse"
  | "thief"
  | "thousand-arrows"
  | "thousand-waves"
  | "thrash"
  | "throat-chop"
  | "thunder"
  | "thunderbolt"
  | "thunder-cage"
  | "thunder-fang"
  | "thunderous-kick"
  | "thunder-punch"
  | "thunder-shock"
  | "thunder-wave"
  | "tickle"
  | "tidy-up"
  | "topsy-turvy"
  | "torch-song"
  | "torment"
  | "toxic"
  | "toxic-spikes"
  | "toxic-thread"
  | "trailblaze"
  | "transform"
  | "tri-attack"
  | "trick"
  | "trick-or-treat"
  | "trick-room"
  | "triple-arrows"
  | "triple-axel"
  | "triple-dive"
  | "triple-kick"
  | "trop-kick"
  | "twin-beam"
  | "twinkle-tackle"
  | "twister"
  | "u-turn"
  | "uproar"
  | "v-create"
  | "vacuum-wave"
  | "venoshock"
  | "victory-dance"
  | "vine-whip"
  | "vise-grip"
  | "volt-switch"
  | "volt-tackle"
  | "waterfall"
  | "water-gun"
  | "water-pledge"
  | "water-pulse"
  | "water-shuriken"
  | "water-spout"
  | "wave-crash"
  | "weather-ball"
  | "whirlpool"
  | "whirlwind"
  | "wicked-blow"
  | "wicked-torque"
  | "wide-guard"
  | "wildbolt-storm"
  | "wild-charge"
  | "will-o-wisp"
  | "wing-attack"
  | "wish"
  | "withdraw"
  | "wonder-room"
  | "wood-hammer"
  | "work-up"
  | "worry-seed"
  | "wrap"
  | "x-scissor"
  | "yawn"
  | "zap-cannon"
  | "zen-headbutt"
  | "zing-zap"

export type PokemonStat =
  | "hp"
  | "attack"
  | "defense"
  | "special_attack"
  | "special_defense"
  | "speed"

export type PokemonMoveTarget =
  | "any-adjacent"
  | "any-enemy"
  | "any-ally"
  | "all-adjacent"
  | "all-enemies"
  | "all-allies"
  | "field"
  | "self"
  | "self-or-ally"
  | "self-and-allies"
  | "team"

// TODO: Change the name of this because it's conflicting with something in BattleShared
export type PokemonStatus =
  | "flinch"
  | "survival"
