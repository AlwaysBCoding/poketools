def type_ident_mapping(type_ident):
  if type_ident == None:
    return 0
  if type_ident == "normal":
    return 1
  if type_ident == "fighting":
    return 2
  if type_ident == "flying":
    return 3
  if type_ident == "poison":
    return 4
  if type_ident == "ground":
    return 5
  if type_ident == "rock":
    return 6
  if type_ident == "bug":
    return 7
  if type_ident == "ghost":
    return 8
  if type_ident == "steel":
    return 9
  if type_ident == "fire":
    return 10
  if type_ident == "water":
    return 11
  if type_ident == "grass":
    return 12
  if type_ident == "electric":
    return 13
  if type_ident == "psychic":
    return 14
  if type_ident == "ice":
    return 15
  if type_ident == "dragon":
    return 16
  if type_ident == "dark":
    return 17
  if type_ident == "fairy":
    return 18

def ability_ident_mapping(ability_ident):
  if ability_ident == None:
    return 0
  if ability_ident == "storm-drain":
    return 1
  if ability_ident == "rough-skin":
    return 2
  if ability_ident == "gale-wings":
    return 3
  if ability_ident == "good-as-gold":
    return 4
  if ability_ident == "queenly-majesty":
    return 5
  if ability_ident == "prankster":
    return 6

def item_ident_mapping(item_ident):
  if item_ident == None:
    return 0
  if item_ident == "leftovers":
    return 1
  if item_ident == "life-orb":
    return 2
  if item_ident == "sharp-beak":
    return 3
  if item_ident == "focus-sash":
    return 4
  if item_ident == "choice-scarf":
    return 5
  if item_ident == "iron-ball":
    return 6

def status_ident_mapping(status_ident):
  if status_ident == "healthy":
    return 0
  if status_ident == "poisoned":
    return 1
  if status_ident == "badly-poisoned":
    return 2
  if status_ident == "burned":
    return 3
  if status_ident == "paralyzed":
    return 4
  if status_ident == "asleep":
    return 5
  if status_ident == "frozen":
    return 6

def location_ident_mapping(location_ident):
  if location_ident == "field":
    return 0
  if location_ident == "party":
    return 1
  if location_ident == "graveyard":
    return 2
