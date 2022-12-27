## TODO
  - Implement conditional behavior based on each terrain
  - Implement conditional behavior based on each weather

  - Implement Accuracy (stat stage & accuracy rolls)
  - Implement Evasiveness (stat stage & accuracy rolls)
  - Implement crit ratio as a stat boost stage
  - Implement Protect/Detect logic

  - implement recoil damage logic
  - implement recovery damage logic

  - create a worklfow for training models on big GPU machines on AWS and synchronizing later

  - add more overall moves

  - hold off on adding abilities
  - hold off on adding items

  - figure out why fainted blue_side pokemon can perform a battle action after fainting (probably because it doesn't get cancelled after fainting, if they were acting second)

  - figure out the right calcs for assurance/avalanche power up moves
  - allow renaming of teams
  - add more items
  - add more abilities
  - figure out how to add reflect/light-screen or some other sorts of battle states
  - start coding & testing basic item functionality into the damage calculation
  - figure out a way to cache sets for specific mons (hardcode?)

## NOTES
  - store "evolution_line" on the pokemon data structure and migrate can_evolve? to an instance method on the Pokemon class

## Damaging Moves with Custom functionality to add
  - Assurance (2x base power if taret has already taken damage this turn)
  - Avalanche (2x base power if the user was hit by the target this turn)
  - Barb Barrage (2x base power if the target is poisoned)
  - Beat Up (haven't even added the data for this one at all (complex logic))
  - Belch (cannot use the move until the user has consumed a berry)
  - Bind (prevents the user from switching and traps them in a bind [DOT DAMAGE])
  - Blizzard (doesn't check accuracy in the snow)
  - Body Press (damage is calculated using the user's defense stat as their attack stat)
  - Body Slam (damage doubles and no accuracy check is performed if target used minimize)
  - Bounce (go up in the air the first turn, attack second turn)
  - Brick Break (destroys screens)
  - Brine (power doubles if target has <= 1/2 hp remaining)
  - Bug Bite (steals the opponents berry)
  - Charge (next electric-type attack will have its power doubled)
  - Chilly Reception (user sets snow and then switches out)
  - Circle Throw (target is forced to switch out)
  - Clear Smog (resets all targets stat changes)
  - Collision Course (damage is multiplied by 1.33* if move is super effective)
  - Comeuppance (wtf is this attack)
  - Copycat (copies last attempted move)
  - Counter (deals damage to the last pokemon to hit this mon based on damage amount)
  - Covet (steals target's item)
  - Curse (effect depends on user's typing)
  - Defog (removes hazards, terrain)
  - Destiny Bond (kills the killer if active and user faints)
  - Detect/Protect
  - Dig (user digs first turn, attacks second turn)
  - Dive (same as bounce / dig)
  - Doodle (changes ability of user and ally to that of selected target)
  - Double Shock (fails unless electric type, loses typing while active)
  - Dragon Darts (smart targeting)
  - Dragon Rush (weird effect about countering minimize)
  - Dragon Tail (forced target to switch out (similar to circle throw))
  - Dream Eater (target unaffected unless they are asleep)
  - Echoed Voice (has a weird multiplier across turns for consecutive usage)
  - Electro Ball (base power conditional on speed difference between pokemon)
  - Electro Drift (damage is multiplied by 1.33* if move is super effective [Collision Course])
  - Encore (target becomes encore'd must repeat last move)
  - Endeavor (damage is equal to HP difference of target and user)
  - Endure (target survives turn, same cooldown as protect)
  - Entrainment (changes targets ability)
  - Eruption (base power is conditional on user's HP)
  - Expanding Force (changes targeting to all-enemies if in psychic terrain)
  - Explosion (user faints after using move)

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
