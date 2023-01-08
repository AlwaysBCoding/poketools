## TODO

  - implement UI for selecting a move target
  - fix serialize_ml() functions to use 0-1 values and normalize large ranges better

  - add mons (251-271)
  - add moves P

  - save flow charts with teams
  - search teams for specific combinations/leads
    - practice against leads on various teams
  - train VGC AI

  ---------------------

  - synchronize typescript damage calc function in tandem with the python one
    - way to run the damage calc tests from typescript

  - * BLITZ THROUGH ADDING DAMAGE ONLY ABILITIES/ITEMS *
  - * SHIP THE DAMAGE CALCULATOR AS THE FIRST GOAL *

  - implement choice items in damage/speed calcs

  - add field state such as reflect, terrain, weather etc... to damage calcs and matchup screen
    - started doing this -- not completed yet
    - Implement conditional behavior based on each terrain
    - implement conditional defense buffs on snow/sandstorm

  - implement status conditions

  ---------------------

  - allow dynamic changes of pokemon_build_state while looking at move coverage table in matchup screen

  - AI to find best item / ability / nature / spread / moves for a pokemon against specific teams?
    - Can add 1 of X pokemon, figure out which one.

  - implement a database to save teams (from VGC paste spreadsheet on wolfe screen)

  - add contact (boolean) to move templates
    - aftermath ability implementation
  - add okho (boolean) to move templates
    - not affected by accuracy / evasion modifiers
  - add punching to move templates (iron fist)
  - add bite to move templates (strong jaw)
  - add sound to move templates (soundproof)
  - add ballistic? to move templates (bulletproof)
  - add wind? to move templates (wind-rider)

  - add some sort of concept of move lock-in (Outrage, Encore that gets ticked [choice items ...])

  - add switch-in hook logic
    - drizzle, drought, sandstorm, snow-warning ability implementation

  - better battle rendering
    - party pokemon + HP
    - stat boosts
    - tailwind/reflect turns

  - close combat stil lowers stats even if it hits gholdengo for 0 damage
    - need a concept of whether or not a move is successful?

  - implement secondary effects of moves being able to create status conditions

  - implement prankster thunder wave failing against a dark type and the general idea of moves failing.

  - cull things the AI should never do (like setting light-screen when light-screen is still active)
    - find a way to completely disallow obviously dumb? actions

  - Implement Accuracy (stat stage & accuracy rolls)
  - Implement Evasiveness (stat stage & accuracy rolls)

  - Implement Protect/Detect logic

  - add more pokemon builds to the training set
  - play 6v6 singles -- (moar fun)

  - allow renaming of teams
  - figure out a way to cache sets for specific mons (hardcode?)

  - add terastallizing
  - add VGC config

  - DEX COMPLETION: (332/400) | 83.00%
  - MOVE TEMPLATE COMPLETION: (15/26) | 57.70%
  - ITEM COMPLETION: (21/136) | 15.44%
  - ABILITY COMPLETION: (8/167) | 4.80%

## NOTES
  - store "evolution_line" on the pokemon data structure and migrate can_evolve? to an instance method on the Pokemon class
    - implement correct pokemon can_evolve logic on pokemon.py

## Damaging Moves with Custom functionality to add
  - Beat Up (haven't even added the data for this one at all (complex logic))
  - Body Slam (damage doubles and no accuracy check is performed if target used minimize)
  - Brick Break (destroys screens)
  - Charge (next electric-type attack will have its power doubled)
  - Clear Smog (resets all targets stat changes)
  - Comeuppance (wtf is this attack)
  - Copycat (copies last attempted move)
  - Defog (removes hazards, terrain)
  - Destiny Bond (kills the killer if active and user faints)
  - Doodle (changes ability of user and ally to that of selected target)
  - Dragon Darts (smart targeting)
  - Dragon Rush (weird effect about countering minimize)
  - Encore (target becomes encore'd must repeat last move)
  - Entrainment (changes targets ability)
  - False Swipe (leaves the target with at least 1 HP)
  - Fell Stinger (raises the user's attack if it knocks out target)
  - Fling (depends what item is being held, each item different)
  - Gastro Acid (nullifies target's ability)
  - Gravity (sets gravity)
  - Guard Split (changes stats by custom amounts)
  - Guard Swap (changes stat boosts)
  - Haze (removes all stat changes from the field)
  - Heal Bell (removes status conditions from entire team)
  - Heal Pulse (target restores HP)
  - Helping Hand (increases ally's damage)
  - Ingrain (user cannot switch out, recovers 1/16th HP at end of each turn)
  - Instruct (target uses last used move)
  - Leech Seed (custom DOT on specific slot)
  - Life Dew (self-and-allies recovery targeting)
  - Lock-On (makes the target unable to avoid the next-turn user move)
  - Magnetic Flux (contingently boosts stats based on ability)
  - Magnet Rise (causes user to be in a hover state for 5 turns)
  - Metal Burst (wtf is this attack?! -- targeting listed as: special on serebii)
  - Mortal Spin (removes hazards from user's side while dealing damage)
  - Night Shade (deals damage equal to the user's level)
  - Order Up (stat change is contingent on the tatsugiri form that Dondozo has in it's mouth)
  - Outrage (everything about the move... random targeting, move lock-in, confusion at the end)

## Custom Move Behavior Grouping
  - User loses percentage of maximum HP in exchange for stat boosts
    - Belly Drum
    - Fillet Away
  - Damage is multiplied extra if attack is super effective
    - Collision Course
    - Electro Drift
  - Target is forced to switch out if attack is successful
    - Circle Throw
    - Dragon Tail
  - User is forced to switch out if attack is successful
    - Chilly Reception
    - Flip Turn
    - Parting Shot
    - U-Turn
  - Attack Takes place over multiple turns where first turn hides user
    - Bounce
    - Dig
    - Dive
    - Fly
  - User is protected from damage with custom decay on repeated uses
    - Detect
    - Endure
    - Protect
  - Damage is conditional on stats of user, target, or ratio of the two
    - Electro Ball
    - Grass Knot
    - Gyro Ball
    - Heat Crash
    - Heavy Slam
    - Low Kick
  - Damage is conditional on the HP of the user
    - Brine
    - Endeavor
    - Eruption
    - Flail
  - Move has custom logic depending on the current typing of the user
    - Curse
    - Double Shock
  - Move has custom logic depending on the weather
    - Blizzard
    - Growth
    - Hurricane
    - Moonlight
    - Morning Sun
  - Move has custom logic depending on the terrain
    - Expanding Force
  - Move has custom logic depending on the gravity
    - Grav Apple
  - Move has custom logic depending on the status of the user or status of the target
    - Barb Barrage
    - Dream Eater
    - Facade
    - Hex
  - Use faints by performing this move (simple faint on success flag on move data?)
    - Explosion
    - Final Gambit
    - Healing Wish
    - Memento
  - Move has custom logic depending on other moves used this turn
    - Fire Pledge
    - Grass Pledge
    - Water Pledge
  - Prevents target from switching out, potentially deals DOT damage [BINDING]
    - Bind (YES DOT)
    - Fire Spin (YES DOT)
    - Infestation (YES DOT)
    - Jaw Lock (NO DOT, prevents user switch-out)
    - Mean Look (NO DOT)
    - No Retreat (NO DOT)
  - Fails unless it is the user's first turn on the field
    - Fake Out
    - First Impression
  - One-Hit KO
    - Fissure
    - Guillotine
    - Horn Drill
  - Damage contingent on if user has already been hit or damaged this turn
    - Assurance
    - Avalanche
    - Focus Punch
  - Redirects attacks
    - Follow Me
    - Rage Powder
  - Custom type effectiveness logic
    - Flying Press (combines flying in it's type effectiveness calc, weird minimize logic)
    - Freeze Dry (type effectiveness against water is changed to super effective)
  - User must recharge next turn
    - Blast Burn
    - Frenzy Plant
    - Giga Impact
    - Hydro Cannon
    - Hyper Beam
  - Multi-hit
    - Arm Thrust
    - Bone Rush
    - Bullet Seed
    - Double Hit
    - Double Kick
    - Dragon Darts
    - Dual Wingbeat
    - Fury Attack
    - Fury Swipes
    - Icicle Spear
  - Has a multiplier effect across successive usages
    - Echoed Voice
    - Fury Cutter
  - Damage is calculated using a different aValue/dValue than you would expect
    [IMPLEMENTED]
  - Move takes effect in future turns
    - Future Sight
    - Wish
  - Ends the effect of terrain
    - Ice Spinner
    - Steel Roller
  - Cannot be used twice in a row
    - Gigaton Hammer
  - Cause double damage on the user until end next turn
    - Glaive Rush
  - User takes damage if the attack is not successful
    - High Jump Kick
  - Bypasses Protection
    - Feint
    - Hyper Drill
  - Disables enemy moves
    - Disable
    - Imprison
  - Steals or Destroys target's held item
    - Bug Bite
    - Covet
    - Incinerate
  - Move cannot be used until a condition has been met
    - Belch
    - Last Resort
  - Base Power increases according to custom counters
    - Last Respects
    - Rage Fist
  - Changes the target's typing
    - Magic Powder
  - Move delegated to a different move
    - Metronome
    - Mimic
  - Deals damage based on how much damage it took as a counter
    - Counter
    - Mirror Coat
  - More obscure field changes with 5 turn counters
    - Magic Room
    - Mist
  - Sets Terrain
    - Electric Terrain
    - Grassy Terrain
    - Misty Terrain
    - Psychic Terrain

## OPEN AI QUESTIONS
  - what to do for imperfect knowledge games, where observation states become avaialable over time
    - i.e. which pokemon is in the back
    - i.e. what the item/spread of a pokemon is
    - how does the input data differentiate between 0 values or continuous values and unknown values
  - how do some of the actions have values > 1 at the end of the game? when 1 is the highest possible reward that you can ever get?
  - slicing the actions vector contingent on game state
  - randomness in different pokemon in different indicies each time (or better to explicitly sort them?)
  - model needs to be explicit about the value that is important (i.e. which mon is on the field, or one value can accomodate for that)
  - obvious questions about model architecture in general
  - how many epochs to train for?
  - would it be better to just have the pokemon ID and let the AI figure it out, or generalize the pokemon to it's stats and input that into the neural net?
  - How fast can you ad-hoc train a model?
