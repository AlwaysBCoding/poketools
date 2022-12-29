## TODO
  - train the AI against another AI that's trying to win instead of just random moves
    - or at least just trying to do damage

  - cull things the AI should never do (like setting light-screen when light-screen is still active)
    - find a way to completely disallow obviously dumb? actions

  - close combat stil lowers stats even if it hits gholdengo for 0 damage
    - can lower the stats via secondary effect of pokemon that gets knocked out on that turn (fix this)
    - need a concept of whether or not a move is successful?

  - Implement conditional behavior based on each terrain
  - Implement conditional behavior based on each weather

  - Implement Accuracy (stat stage & accuracy rolls)
  - Implement Evasiveness (stat stage & accuracy rolls)

  - Implement Protect/Detect logic

  - create a worklfow for training models on big GPU machines on AWS and synchronizing later

  - allow renaming of teams
  - figure out a way to cache sets for specific mons (hardcode?)

  - add terastallizing
  - add VGC config

  - DEX COMPLETION: (67.5%)
  - MOVE TEMPLATE COMPLETION: (27%)
  - ITEM COMPLETION: (0%)
  - ABILITY COMPLETION: (0%)

## NOTES
  - store "evolution_line" on the pokemon data structure and migrate can_evolve? to an instance method on the Pokemon class

## Damaging Moves with Custom functionality to add
  - Beat Up (haven't even added the data for this one at all (complex logic))
  - Belch (cannot use the move until the user has consumed a berry)
  - Body Slam (damage doubles and no accuracy check is performed if target used minimize)
  - Brick Break (destroys screens)
  - Bug Bite (steals the opponents berry)
  - Charge (next electric-type attack will have its power doubled)
  - Clear Smog (resets all targets stat changes)
  - Comeuppance (wtf is this attack)
  - Copycat (copies last attempted move)
  - Counter (deals damage to the last pokemon to hit this mon based on damage amount)
  - Covet (steals target's item)
  - Defog (removes hazards, terrain)
  - Destiny Bond (kills the killer if active and user faints)
  - Doodle (changes ability of user and ally to that of selected target)
  - Dragon Darts (smart targeting)
  - Dragon Rush (weird effect about countering minimize)
  - Encore (target becomes encore'd must repeat last move)
  - Entrainment (changes targets ability)
  - False Swipe (leaves the target with at least 1 HP)
  - Feint (breaks through protect, and cancels protect for the turn)
  - Fell Stinger (raises the user's attack if it knocks out target)
  - Fling (depends what item is being held, each item different)
  - Gastro Acid (nullifies target's ability)
  - Gravity (sets gravity)
  - Guard Split (changes stats by custom amounts)
  - Guard Swap (changes stat boosts)
  - Rage Fist (power is increased every time ape is hit)

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
  - Move has custom logic depending on the terrain
    - Expanding Force
  - Move has custom logic depending on the gravity
    - Grav Apple
  - Move has custom logic depending on the status of the user or status of the target
    - Barb Barrage
    - Dream Eater
    - Facade
  - Use faints by performing this move
    - Explosion
    - Final Gambit
  - Move has custom logic depending on other moves used this turn
    - Fire Pledge
    - Grass Pledge
    - Water Pledge
  - Prevents target from switching out, deals DOT damage
    - Bind
    - Fire Spin
  - Fails unless it is the user's first turn on the field
    - Fake Out
    - First Impression
  - One-Hit KO
    - Fissure
    - Guillotine
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
  - Has a multiplier effect across successive usages
    - Echoed Voice
    - Fury Cutter
  - Damage is calculated using a different aValue/dValue than you would expect
    - Body Press
    - Foul Play
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
  - why does it always go up in efficacy through 1000 epochs, reach a plateau, bounce around a lot then start rapidly declining around 3000 epochs? whats causing that?
  - how many epochs to train for?
