import React, { useState, useEffect } from "react";

import { PokemonBattleState } from "../models/battle/PokemonBattleState";
import { displayPokemonIdent } from "../decorators/Pokemon";

export const PokemonBattleTeamDisplayIndex: React.FC<{
  pokemonBattleStates: PokemonBattleState[],
  arrange?: "horizontal" | "vertical";
  onPokemonBattleStateClick?: (pokemonBattleState: PokemonBattleState, teamIndex: number) => void;
}> = ({
  pokemonBattleStates,
  arrange = "vertical",
  onPokemonBattleStateClick = () => undefined
}) => {
  const modeClassName = arrange === "vertical" ? "mode-index vertical" : "mode-index horizontal";

  return (
    <div className={`pokemon-team-display ${modeClassName}`}>
      {pokemonBattleStates.map((pokemonBattleState, index) => {
        const pokemonImage = require(`../data/pokemon/${pokemonBattleState.pokemon_build.pokemon.pokedex_region}/${String(pokemonBattleState.pokemon_build.pokemon.regional_pokedex_number).padStart(2, "0")}-${pokemonBattleState.pokemon_build.pokemon.ident.split("-")[0]}/${pokemonBattleState.pokemon_build.pokemon.ident}.static.png`);
        return (
          <div
            key={`pokemon-index-item-${index}`}
            className={`pokemon-index-item ${pokemonBattleState.location}`}
            onClick={() => { onPokemonBattleStateClick(pokemonBattleState, index); }}>
            <img className="pokemon-image" src={pokemonImage} alt={pokemonBattleState.pokemon_build.pokemon.ident} />
            <p className="pokemon-ident">{displayPokemonIdent(pokemonBattleState.pokemon_build.pokemon.ident)}</p>
            {pokemonBattleState.location === "party" ? (
              <div className="hp-bar-container">
                <div className="current-hp" style={{width: `${(pokemonBattleState.current_hp / pokemonBattleState.pokemon_build.stat_spread.hp) * 100}%`}}></div>
              </div>
            ) : (<></>)}
          </div>
        )
      })}
    </div>
  )
}
