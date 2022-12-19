## TODO
  - add acrobatics custom logic to damage calc + test
  - figure out the right calcs for earthquake / spread moves
  - change the pokepaste import to just copying & pasting the data into the import box
  - add stat boosts to the battlestate calc screen

  - add more moves (A)
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
