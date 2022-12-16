import React, { useState, ChangeEvent } from "react";
import { PokemonMoveIdent } from "../models/pokemon/PokemonShared";
import { toTitleCase } from "./DecoratorsShared";

export const displayPokemonMove = (moveIdent: PokemonMoveIdent): string => {
  if(moveIdent === "u-turn") { return "U-Turn" }
  else { return toTitleCase(moveIdent); }
}
