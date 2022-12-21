## TODO
  - figure out how to port the battle sim logic to Python? to train the AI on it
  - primary_type_ident and secondary_type_ident in the damage calc should be on the PokemonBattleState, not on the pokemon_build
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
  - does the input_dimensions always have to be a flattened array of single float values?
