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
  | "analytic"
  | "anger-point"
  | "anticipation"
  | "armor-tail"
  | "aroma-veil"
  | "big-pecks"
  | "blaze"
  | "cheek-pouch"
  | "chlorophyll"
  | "clear-body"
  | "cloud-nine"
  | "commander"
  | "competitive"
  | "compound-eyes"
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
  | "early-bird"
  | "earth-eater"
  | "effect-spore"
  | "electromorphosis"
  | "flame-body"
  | "flash-fire"
  | "fluffy"
  | "forewarn"
  | "friend-guard"
  | "frisk"
  | "gale-wings"
  | "gluttony"
  | "good-as-gold"
  | "guts"
  | "harvest"
  | "healer"
  | "heatproof"
  | "honey-gather"
  | "huge-power"
  | "hustle"
  | "hydration"
  | "ice-body"
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
  | "lingering-aroma"
  | "magic-bounce"
  | "magnet-pull"
  | "marvel-scale"
  | "minus"
  | "mirror-armor"
  | "mold-breaker"
  | "moxie"
  | "multiscale"
  | "natural-cure"
  | "no-guard"
  | "oblivious"
  | "overgrow"
  | "own-tempo"
  | "pickpocket"
  | "pickup"
  | "pixilate"
  | "plus"
  | "poison-point"
  | "prankster"
  | "pressure"
  | "propeller-tail"
  | "protean"
  | "protosynthesis"
  | "psychic-surge"
  | "punk-rock"
  | "purifying-salt"
  | "queenly-majesty"
  | "quick-feet"
  | "rain-dish"
  | "rattled"
  | "reckless"
  | "regenerator"
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
  | "snow-cloak"
  | "solar-power"
  | "stakeout"
  | "stall"
  | "stamina"
  | "static"
  | "steadfast"
  | "steam-engine"
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
  | "toxic-debris"
  | "trace"
  | "truant"
  | "unaware"
  | "unnerve"
  | "vital-spirit"
  | "volt-absorb"
  | "water-absorb"
  | "water-veil"
  | "weak-armor"
  | "well-baked-body"
  | "white-smoke"
  | "wind-power";

export type PokemonEvolutionLine =
  | "arrokuda"
  | "azurill"
  | "bonsly"
  | "bounsweet"
  | "buizel"
  | "charcadet"
  | "chewtle"
  | "combee"
  | "deino"
  | "dondozo"
  | "dratini"
  | "dreepy"
  | "drowzee"
  | "eevee"
  | "fidough"
  | "finizen"
  | "fletchling"
  | "flutter_mane"
  | "foongus"
  | "frigibax"
  | "fuecoco"
  | "gastly"
  | "gible"
  | "gimmighoul"
  | "girafarig"
  | "glimmet"
  | "gothita"
  | "greavard"
  | "growlithe"
  | "happiny"
  | "hatenna"
  | "hoppip"
  | "houndour"
  | "igglybuff"
  | "impidimp"
  | "indeedee"
  | "kricketot"
  | "larvesta"
  | "larvitar"
  | "lechonk"
  | "magikarp"
  | "magnemite"
  | "makuhita"
  | "mankey"
  | "mareep"
  | "mudbray"
  | "murkrow"
  | "nacli"
  | "nymble"
  | "oranguru"
  | "oricorio"
  | "orthworm"
  | "pawmi"
  | "pawniard"
  | "petilil"
  | "pichu"
  | "psyduck"
  | "quaxly"
  | "ralts"
  | "rockruff"
  | "rolycoly"
  | "rookidee"
  | "rotom"
  | "sableye"
  | "scatterbug"
  | "shellos"
  | "shinx"
  | "skwovet"
  | "slakoth"
  | "smoliv"
  | "sneasel"
  | "sprigatito"
  | "starly"
  | "sunkern"
  | "surskit"
  | "tadbulb"
  | "tandemaus"
  | "tarountula"
  | "tatsugiri"
  | "tauros"
  | "tinkatink"
  | "torkoal"
  | "toxel"
  | "wattrel"
  | "wingull"
  | "wooper"
  | "yungoos";

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

  // Pain Split
  // Parabolic Charge
  // Parting Shot
  // Payback
  // Pay Day
  // Peck
  // Perish Song
  // Petal Blizzard
  // Petal Dance
  // Phantom Force
  // Photon Geyser
  // Pin Missile
  // Plasma Fists
  // Play Nice
  // Play Rough
  // Pluck
  // Poison Fang
  // Poison Gas
  // Poison Jab
  // Poison Powder
  // Poison Sting
  // Poison Tail
  // Pollen Puff
  // Poltergeist
  // Population Bomb
  // Pounce
  // Pound
  // Powder Snow
  // Power Gem
  // Power Shift
  // Power Split
  // Power Swap
  // Power Trick
  // Power Trip
  // Power Whip
  // Precipice Blades
  // Present
  // Prismatic Laser
  // Protect
  // Psybeam
  // Psychic
  // Psychic Fangs
  // Psychic Terrain
  // Psycho Cut
  // Psych Up
  // Psyshield Bash
  // Psyshock
  // Psystrike
  // Purify
  // Pyro Ball
  // Moves – Q

  // Quash
  // Quick Attack
  // Quick Guard
  // Quiver Dance
  // Moves – R

  // Rage Fist
  // Rage Powder
  // Raging Bull
  // Raging Fury
  // Rain Dance
  // Rapid Spin
  // Razor Leaf
  // Razor Shell
  // Recover
  // Recycle
  // Reflect
  // Reflect Type
  // Relic Song
  // Rest
  // Retaliate
  // Revelation Dance
  // Reversal
  // Revival Blessing
  // Rising Voltage
  // Roar
  // Roar of Time
  // Rock Blast
  // Rock Polish
  // Rock Slide
  // Rock Smash
  // Rock Throw
  // Rock Tomb
  // Rock Wrecker
  // Role Play
  // Rollout
  // Roost
  // Round
  // Ruination
  // Moves – S

  // Sacred Fire
  // Sacred Sword
  // Safeguard
  // Salt Cure
  // Sand Attack
  // Sandsear Storm
  // Sandstorm
  // Sand Tomb
  // Savage Spin-Out
  // Scald
  // Scale Shot
  // Scary Face
  // Scorching Sands
  // Scratch
  // Screech
  // Searing Shot
  // Secret Sword
  // Seed Bomb
  // Seed Flare
  // Seismic Toss
  // Self-Destruct
  // Shadow Ball
  // Shadow Bone
  // Shadow Claw
  // Shadow Force
  // Shadow Punch
  // Shadow Sneak
  // Shattered Psyche
  // Shed Tail
  // Sheer Cold
  // Shell Side Arm
  // Shell Smash
  // Shell Trap
  // Shelter
  // Shift Gear
  // Shock Wave
  // Shore Up
  // Silk Trap
  // Simple Beam
  // Sing
  // Sketch
  // Skill Swap
  // Skitter Smack
  // Sky Attack
  // Slack Off
  // Slam
  // Slash
  // Sleep Powder
  // Sleep Talk
  // Sludge
  // Sludge Bomb
  // Sludge Wave
  // Smack Down
  // Smart Strike
  // Smog
  // Smokescreen
  // Snap Trap
  // Snarl
  // Snipe Shot
  // Snore
  // Snowscape
  // Soak
  // Soft-Boiled
  // Solar Beam
  // Solar Blade
  // Spacial Rend
  // Spark
  // Sparkling Aria
  // Spectral Thief
  // Speed Swap
  // Spicy Extract
  // Spikes
  // Spiky Shield
  // Spin Out
  // Spirit Break
  // Spirit Shackle
  // Spite
  // Spit Up
  // Splash
  // Spore
  // Springtide Storm
  // Stealth Rock
  // Steam Eruption
  // Steel Beam
  // Steel Roller
  // Steel Wing
  // Sticky Web
  // Stockpile
  // Stomp
  // Stomping Tantrum
  // Stone Axe
  // Stone Edge
  // Stored Power
  // Storm Throw
  // Strange Steam
  // Strength
  // Strength Sap
  // String Shot
  // Struggle
  // Struggle Bug
  // Stuff Cheeks
  // Stun Spore
  // Substitute
  // Subzero Slammer
  // Sucker Punch
  // Sunny Day
  // Sunsteel Strike
  // Super Fang
  // Superpower
  // Supersonic
  // Supersonic Skystrike
  // Surf
  // Surging Strikes
  // Swagger
  // Swallow
  // Sweet Kiss
  // Sweet Scent
  // Swift
  // Switcheroo
  // Swords Dance
  // Synthesis
  // Moves – T

  // Tackle
  // Tail Slap
  // Tail Whip
  // Tailwind
  // Take Down
  // Take Heart
  // Tar Shot
  // Taunt
  // Tearful Look
  // Teatime
  // Techno Blast
  // Tectonic Rage
  // Teeter Dance
  // Teleport
  // Tera Blast
  // Terrain Pulse
  // Thief
  // Thousand Arrows
  // Thousand Waves
  // Thrash
  // Throat Chop
  // Thunder
  // Thunderbolt
  // Thunder Cage
  // Thunder Fang
  // Thunderous Kick
  // Thunder Punch
  // Thunder Shock
  // Thunder Wave
  // Tickle
  // Tidy Up
  // Topsy-Turvy
  // Torch Song
  // Torment
  // Toxic
  // Toxic Spikes
  // Toxic Thread
  // Trailblaze
  // Transform
  // Tri Attack
  // Trick
  // Trick-or-Treat
  // Trick Room
  // Triple Arrows
  // Triple Axel
  // Triple Dive
  // Triple Kick
  // Trop Kick
  // Twin Beam
  // Twinkle Tackle
  // Twister
  // Moves – U

  // U-turn
  // Uproar
  // Moves – V

  // V-create
  // Vacuum Wave
  // Venoshock
  // Victory Dance
  // Vine Whip
  // Vise Grip
  // Volt Switch
  // Volt Tackle
  // Moves – W

  // Waterfall
  // Water Gun
  // Water Pledge
  // Water Pulse
  // Water Shuriken
  // Water Spout
  // Wave Crash
  // Weather Ball
  // Whirlpool
  // Whirlwind
  // Wicked Blow
  // Wicked Torque
  // Wide Guard
  // Wildbolt Storm
  // Wild Charge
  // Will-O-Wisp
  // Wing Attack
  // Wish
  // Withdraw
  // Wonder Room
  // Wood Hammer
  // Work Up
  // Worry Seed
  // Wrap
  // Moves – X

  // X-Scissor
  // Moves – Y

  // Yawn
  // Moves – Z

  // Zap Cannon
  // Zen Headbutt
  // Zing Zap

export type PokemonMoveIdent =
  | "absorb"
  | "accelerock"
  | "acid"
  | "acid-armor"
  | "acid-downpour"
  | "acid-spray"
  | "acrobatics"
  | "acupressure"
  | "aerial-ace"
  | "aeroblast"
  | "after-you"
  | "agility"
  | "air-cutter"
  | "air-slash"
  | "all-out-pummeling"
  | "ally-switch"
  | "amnesia"
  | "anchor-shot"
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
  | "astral-barrage"
  | "attack-order"
  | "attract"
  | "aura-sphere"
  | "aura-wheel"
  | "aurora-beam"
  | "aurora-veil"
  | "avalanche"
  | "axe-kick"
  | "baby-doll-eyes"
  | "baneful-bunker"
  | "barb-barrage"
  | "baton-pass"
  | "beak-blast"
  | "beat-up"
  | "behemoth-bash"
  | "behemoth-blade"
  | "belch"
  | "belly-drum"
  | "bind"
  | "bite"
  | "bitter-blade"
  | "bitter-malice"
  | "black-hole-eclipse"
  | "blast-burn"
  | "blaze-kick"
  | "blazing-torque"
  | "bleakwind-storm"
  | "blizzard"
  | "block"
  | "bloom-doom"
  | "blue-flare"
  | "body-press"
  | "body-slam"
  | "bolt-beak"
  | "bolt-strike"
  | "bonemerang"
  | "bone-rush"
  | "boomburst"
  | "bounce"
  | "branch-poke"
  | "brave-bird"
  | "breaking-swipe"
  | "breakneck-blitz"
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
  | "burning-jealousy"
  | "burn-up"
  | "calm-mind"
  | "catastropika"
  | "ceaseless-edge"
  | "celebrate"
  | "charge"
  | "charge-beam"
  | "charm"
  | "chatter"
  | "chilling-water"
  | "chilly-reception"
  | "chloroblast"
  | "circle-throw"
  | "clanging-scales"
  | "clangorous-soul"
  | "clear-smog"
  | "close-combat"
  | "coaching"
  | "coil"
  | "collision-course"
  | "combat-torque"
  | "comeuppance"
  | "confide"
  | "confuse-ray"
  | "confusion"
  | "continental-crush"
  | "conversion"
  | "conversion-2"
  | "copycat"
  | "core-enforcer"
  | "corkscrew-crash"
  | "corrosive-gas"
  | "cosmic-power"
  | "cotton-guard"
  | "cotton-spore"
  | "counter"
  | "court-change"
  | "covet"
  | "crabhammer"
  | "cross-chop"
  | "cross-poison"
  | "crunch"
  | "crush-claw"
  | "crush-grip"
  | "curse"
  | "cut"
  | "darkest-lariat"
  | "dark-pulse"
  | "dark-void"
  | "dazzling-gleam"
  | "decorate"
  | "defend-order"
  | "defense-curl"
  | "defog"
  | "destiny-bond"
  | "detect"
  | "devastating-drake"
  | "diamond-storm"
  | "dig"
  | "dire-claw"
  | "disarming-voice"
  | "discharge"
  | "dive"
  | "doodle"
  | "double-edge"
  | "double-hit"
  | "double-iron-bash"
  | "double-kick"
  | "double-shock"
  | "double-team"
  | "draco-meteor"
  | "dragon-ascent"
  | "dragon-breath"
  | "dragon-claw"
  | "dragon-dance"
  | "dragon-darts"
  | "dragon-energy"
  | "dragon-pulse"
  | "dragon-rush"
  | "dragon-tail"
  | "draining-kiss"
  | "drain-punch"
  | "dream-eater"
  | "drill-peck"
  | "drill-run"
  | "drum-beating"
  | "dual-wingbeat"
  | "dynamax-cannon"
  | "dynamic-punch"
  | "earth-power"
  | "earthquake"
  | "echoed-voice"
  | "eerie-impulse"
  | "eerie-spell"
  | "electric-terrain"
  | "electrify"
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
  | "esper-wing"
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
  | "fiery-wrath"
  | "fillet-away"
  | "final-gambit"
  | "fire-blast"
  | "fire-fang"
  | "fire-lash"
  | "fire-pledge"
  | "fire-punch"
  | "fire-spin"
  | "first-impression"
  | "fishious-rend"
  | "fissure"
  | "flail"
  | "flame-charge"
  | "flamethrower"
  | "flame-wheel"
  | "flare-blitz"
  | "flash-cannon"
  | "flatter"
  | "fleur-cannon"
  | "fling"
  | "flip-turn"
  | "floral-healing"
  | "flower-trick"
  | "fly"
  | "flying-press"
  | "focus-blast"
  | "focus-energy"
  | "focus-punch"
  | "follow-me"
  | "force-palm"
  | "forests-curse"
  | "foul-play"
  | "freeze-dry"
  | "freeze-shock"
  | "freezing-glare"
  | "frenzy-plant"
  | "frost-breath"
  | "fury-attack"
  | "fury-cutter"
  | "fury-swipes"
  | "fusion-bolt"
  | "fusion-flare"
  | "future-sight"
  | "gastro-acid"
  | "gear-grind"
  | "geomancy"
  | "giga-drain"
  | "giga-impact"
  | "gigaton-hammer"
  | "gigavolt-havoc"
  | "glacial-lance"
  | "glaciate"
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
  | "happy-hour"
  | "harden"
  | "haze"
  | "headbutt"
  | "head-charge"
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
  | "hold-back"
  | "hold-hands"
  | "hone-claws"
  | "horn-attack"
  | "horn-drill"
  | "horn-leech"
  | "howl"
  | "hurricane"
  | "hydro-cannon"
  | "hydro-pump"
  | "hydro-vortex"
  | "hyper-beam"
  | "hyper-drill"
  | "hyperspace-fury"
  | "hyperspace-hole"
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
  | "infernal-parade"
  | "inferno"
  | "inferno-overdrive"
  | "infestation"
  | "ingrain"
  | "instruct"
  | "iron-defense"
  | "iron-head"
  | "iron-tail"
  | "jaw-lock"
  | "jet-punch"
  | "judgment"
  | "jungle-healing"
  | "kinesis"
  | "kings-shield"
  | "knock-off"
  | "kowtow-cleave"
  | "lands-wrath"
  | "lash-out"
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
  | "light-of-ruin"
  | "light-screen"
  | "liquidation"
  | "lock-on"
  | "lovely-kiss"
  | "low-kick"
  | "low-sweep"
  | "lumina-crash"
  | "lunar-blessing"
  | "lunar-dance"
  | "lunge"
  | "luster-purge"
  | "mach-punch"
  | "magical-leaf"
  | "magical-torque"
  | "magic-powder"
  | "magic-room"
  | "magma-storm"
  | "magnetic-flux"
  | "magnet-rise"
  | "make-it-rain"
  | "mean-look"
  | "mega-drain"
  | "megahorn"
  | "mega-kick"
  | "mega-punch"
  | "memento"
  | "metal-burst"
  | "metal-claw"
  | "metal-sound"
  | "meteor-assault"
  | "meteor-beam"
  | "meteor-mash"
  | "metronome"
  | "milk-drink"
  | "mimic"
  | "mind-blown"
  | "minimize"
  | "mirror-coat"
  | "mist"
  | "mist-ball"
  | "misty-explosion"
  | "misty-terrain"
  | "moonblast"
  | "moongeist-beam"
  | "moonlight"
  | "morning-sun"
  | "mortal-spin"
  | "mountain-gale"
  | "mud-slap"
  | "muddy-water"
  | "mud-shot"
  | "multi-attack"
  | "mystical-fire"
  | "mystical-power"
  | "nasty-plot"
  | "natures-madness"
  | "never-ending-nightmare"
  | "night-daze"
  | "night-shade"
  | "night-slash"
  | "noble-roar"
  | "no-retreat"
  | "noxious-torque"
  | "nuzzle"
  | "oblivion-wing"
  | "obstruct"
  | "octazooka"
  | "order-up"
  | "origin-pulse"
  | "outrage"
  | "overdrive"
  | "overheat"
  | "sucker-punch"
  | "swords-dance"
  | "tera-blast"
  | "u-turn"

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

// TODO: Change the name of this because it's conflicting with something in BattleShared
export type PokemonStatus =
  | "flinch"
  | "survival"
