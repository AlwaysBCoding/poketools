import React, { useState, useEffect } from "react";

import { PokemonTeam } from "../models/pokemon/PokemonTeam";
import { PokemonBuild } from "../models/pokemon/PokemonBuild";
import { BattleState } from "../models/battle/BattleState";
import { BattleSide } from "../models/battle/BattleShared";

import { displayPokemonIdent } from "../decorators/Pokemon";

const effectiveSpeed = (pokemonBuild: PokemonBuild, battleState: BattleState, battleSide: BattleSide): number => {
  let speed = pokemonBuild.stat_spread.speed;

  if(pokemonBuild.item_ident === "choice-scarf") { speed *= 1.5; }
  if(pokemonBuild.item_ident === "iron-ball") { speed *= 0.5; }

  if(battleSide === "blue" && battleState.blue_side_state.tailwind > 0) { speed *= 2; }
  if(battleSide === "red" && battleState.red_side_state.tailwind > 0) { speed *= 2; }

  if(battleState.global_state.weather === "sun" && pokemonBuild.ability_ident === "chlorophyll") { speed *= 2; }
  if(battleState.global_state.weather === "rain" && pokemonBuild.ability_ident === "swift-swim") { speed *= 2; }
  if(battleState.global_state.weather === "sandstorm" && pokemonBuild.ability_ident === "sand-rush") { speed *= 2; }
  if(battleState.global_state.weather === "snow" && pokemonBuild.ability_ident === "slush-rush") { speed *= 2; }

  return speed;
}

const PokemonDataRow: React.FC<{
  battleState: BattleState,
  pokemonBuildData: Record<string, any>,
}> = ({
  battleState,
  pokemonBuildData,
}) => {
  const pokemonImage = require(`../data/pokemon/${pokemonBuildData.pokemonBuild.pokemon.pokedex_region}/${String(pokemonBuildData.pokemonBuild.pokemon.regional_pokedex_number).padStart(2, "0")}-${pokemonBuildData.pokemonBuild.pokemon.ident.split("-")[0]}/${pokemonBuildData.pokemonBuild.pokemon.ident}.static.png`);
  const dataRowClassName = pokemonBuildData.side === "blue" ? `data-row blue-team` : `data-row red-team`;

  return (
    <div className={dataRowClassName}>
      <div className="data-item pokemon-image-display">
        <img className="pokemon-image-asset" src={pokemonImage} alt={pokemonBuildData.pokemonBuild.pokemon.ident} />
      </div>
      <p className="data-item pokemon-ident">{displayPokemonIdent(pokemonBuildData.pokemonBuild.pokemon.ident)}</p>
      <p className="data-item pokemon-speed">{Math.floor(effectiveSpeed(pokemonBuildData.pokemonBuild, battleState, pokemonBuildData.side as BattleSide))}</p>
    </div>
  )

}

export const SpeedTiersDisplay: React.FC<{
  battleState: BattleState,
  blueTeam: PokemonTeam,
  redTeam: PokemonTeam
}> = ({
  battleState,
  blueTeam,
  redTeam
}) => {
  const [activeBattleState, setActiveBattleState] = useState<BattleState>(battleState);

  useEffect(() => {
    setActiveBattleState(battleState);
  }, [battleState]);

  const allPokemonBuildData = blueTeam.pokemonBuilds.map((pokemonBuild) => {
    return {"side": "blue", "pokemonBuild": pokemonBuild}
  }).concat(redTeam.pokemonBuilds.map((pokemonBuild) => {
    return {"side": "red", "pokemonBuild": pokemonBuild}
  }));
  const sortedPokemonBuildData = allPokemonBuildData.sort((a, b) => {
    return effectiveSpeed(b.pokemonBuild, activeBattleState, b.side as BattleSide) - effectiveSpeed(a.pokemonBuild, activeBattleState, a.side as BattleSide);
  });

  return (
    <div className="pokemon-speed-tiers-display">
      <div className="header-row">
        <p className="header-item pokemon-image">Pic</p>
        <p className="header-item pokemon-ident">Ident</p>
        <p className="header-item pokemon-speed">Speed</p>
      </div>
      {sortedPokemonBuildData.map((pokemonBuildData, index) => {
        return (
          <PokemonDataRow
            key={`pokemon-build-${index}`}
            pokemonBuildData={pokemonBuildData}
            battleState={activeBattleState} />
        )
      })}
    </div>
  )
}
