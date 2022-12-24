## TODO
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
  - Ancient Power (all stats boosted 1 stage)
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

## OPEN AI QUESTIONS
  - what to do for imperfect knowledge games, where observation states become avaialable over time
    - i.e. which pokemon is in the back
    - i.e. what the item/spread of a pokemon is
    - how does the input data differentiate between 0 values or continuous values and unknown values
  - slicing the actions vector contingent on game state
  - randomness in different pokemon in different indicies each time (or better to explicitly sort them?)
  - model needs to be explicit about the value that is important (i.e. which mon is on the field, or one value can accomodate for that)
  - obvious questions about model architecture in general
  - why does it always go up in efficacy through 1000 epochs, reach a plateau, bounce around a lot then start rapidly declining around 3000 epochs? whats causing that?
  - how many epochs to train for?
