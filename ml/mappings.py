def type_ident_mapping(type_ident):
  if type_ident == None:
    return [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  if type_ident == "normal":
    return [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  if type_ident == "fighting":
    return [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  if type_ident == "flying":
    return [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  if type_ident == "poison":
    return [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  if type_ident == "ground":
    return [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  if type_ident == "rock":
    return [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  if type_ident == "bug":
    return [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  if type_ident == "ghost":
    return [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  if type_ident == "steel":
    return [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  if type_ident == "fire":
    return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]
  if type_ident == "water":
    return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
  if type_ident == "grass":
    return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]
  if type_ident == "electric":
    return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]
  if type_ident == "psychic":
    return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0]
  if type_ident == "ice":
    return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
  if type_ident == "dragon":
    return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0]
  if type_ident == "dark":
    return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]
  if type_ident == "fairy":
    return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]

def ability_ident_mapping(ability_ident):
  if ability_ident == None:
    return [1, 0, 0, 0, 0, 0, 0]
  if ability_ident == "storm-drain":
    return [0, 1, 0, 0, 0, 0, 0]
  if ability_ident == "rough-skin":
    return [0, 0, 1, 0, 0, 0, 0]
  if ability_ident == "gale-wings":
    return [0, 0, 0, 1, 0, 0, 0]
  if ability_ident == "good-as-gold":
    return [0, 0, 0, 0, 1, 0, 0]
  if ability_ident == "queenly-majesty":
    return [0, 0, 0, 0, 0, 1, 0]
  if ability_ident == "prankster":
    return [0, 0, 0, 0, 0, 0, 1]

def item_ident_mapping(item_ident):
  if item_ident == None:
    return [1, 0, 0, 0, 0, 0, 0]
  if item_ident == "leftovers":
    return [0, 1, 0, 0, 0, 0, 0]
  if item_ident == "life-orb":
    return [0, 0, 1, 0, 0, 0, 0]
  if item_ident == "sharp-beak":
    return [0, 0, 0, 1, 0, 0, 0]
  if item_ident == "focus-sash":
    return [0, 0, 0, 0, 1, 0, 0]
  if item_ident == "choice-scarf":
    return [0, 0, 0, 0, 0, 1, 0]
  if item_ident == "iron-ball":
    return [0, 0, 0, 0, 0, 0, 1]

def status_ident_mapping(status_ident):
  if status_ident == "healthy":
    return [1, 0, 0, 0, 0, 0, 0]
  if status_ident == "poisoned":
    return [0, 1, 0, 0, 0, 0, 0]
  if status_ident == "badly-poisoned":
    return [0, 0, 1, 0, 0, 0, 0]
  if status_ident == "burned":
    return [0, 0, 0, 1, 0, 0, 0]
  if status_ident == "paralyzed":
    return [0, 0, 0, 0, 1, 0, 0]
  if status_ident == "asleep":
    return [0, 0, 0, 0, 0, 1, 0]
  if status_ident == "frozen":
    return [0, 0, 0, 0, 0, 0, 1]

def location_mapping(location):
  if location == "field":
    return [1, 0, 0]
  if location == "party":
    return [0, 1, 0]
  if location == "graveyard":
    return [0, 0, 1]
