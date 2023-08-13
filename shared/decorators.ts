import { PokemonIdent } from './models/pokemon/PokemonShared';

export const smogonIdentReverseMapping = (smogonIdent: string): PokemonIdent => {
  if(smogonIdent === "brute-bonnet") { return "brute_bonnet" }
  else if(smogonIdent === "chi-yu") { return "chi_yu" }
  else if(smogonIdent === "chien-pao") { return "chien_pao" }
  else if(smogonIdent === "flutter-mane") { return "flutter_mane" }
  else if(smogonIdent === "iron-bundle") { return "iron_bundle" }
  else if(smogonIdent === "iron-hands") { return "iron_hands" }
  else if(smogonIdent === "iron-jugulis") { return "iron_jugulis" }
  else if(smogonIdent === "iron-moth") { return "iron_moth" }
  else if(smogonIdent === "iron-thorns") { return "iron_thorns" }
  else if(smogonIdent === "iron-treads") { return "iron_treads" }
  else if(smogonIdent === "iron-valiant") { return "iron_valiant" }
  else if(smogonIdent === "maushold") { return "maushold-family-of-four" }
  else if(smogonIdent === "maushold-four") { return "maushold-family-of-four" }
  else if(smogonIdent === "maushold-three") { return "maushold-family-of-three" }
  else if(smogonIdent === "gastrodon") { return "gastrodon-east" }
  else if(smogonIdent === "great-tusk") { return "great_tusk" }
  else if(smogonIdent === "palafin") { return "palafin-hero" }
  else if(smogonIdent === "roaring-moon") { return "roaring_moon" }
  else if(smogonIdent === "sandy-shocks") { return "sandy_shocks" }
  else if(smogonIdent === "scream-tail") { return "scream_tail" }
  else if(smogonIdent === "slither-wing") { return "slither_wing" }
  else if(smogonIdent === "tauros-paldea") { return "tauros-combat" }
  else if(smogonIdent === "tauros-paldea-fire") { return "tauros-blaze" }
  else if(smogonIdent === "tauros-paldea-water") { return "tauros-aqua" }
  else if(smogonIdent === "ting-lu") { return "ting_lu" }
  else if(smogonIdent === "wo-chien") { return "wo_chien" }
  else { return smogonIdent }
}
