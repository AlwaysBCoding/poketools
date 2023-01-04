import React from "react";

import { PokemonTeam } from "../models/pokemon/PokemonTeam";
import { PokemonBuild } from "../models/pokemon/PokemonBuild";

import { displayPokemonIdent } from "../decorators/Pokemon";

const effectiveSpeed = (pokemonBuild: PokemonBuild): number => {
  let speed = pokemonBuild.stat_spread.speed;

  if(pokemonBuild.item_ident === "choice-scarf") { speed *= 1.5; }
  if(pokemonBuild.item_ident === "iron-ball") { speed *= 0.5; }

  return speed;
}

const PokemonDataRow: React.FC<{
  pokemonBuildData: Record<string, any>,
}> = ({
  pokemonBuildData,
}) => {
  const pokemonImage = require(`../data/pokemon/paldea/${String(pokemonBuildData.pokemonBuild.pokemon.paldea_regional_pokedex_number).padStart(2, "0")}-${pokemonBuildData.pokemonBuild.pokemon.ident.split("-")[0]}/${pokemonBuildData.pokemonBuild.pokemon.ident}.static.png`);
  const dataRowClassName = pokemonBuildData.side === "blue" ? `data-row blue-team` : `data-row red-team`;

  return (
    <div className={dataRowClassName}>
      <div className="data-item pokemon-image-display">
        <img className="pokemon-image-asset" src={pokemonImage} alt={pokemonBuildData.pokemonBuild.pokemon.ident} />
      </div>
      <p className="data-item pokemon-ident">{displayPokemonIdent(pokemonBuildData.pokemonBuild.pokemon.ident)}</p>
      <p className="data-item pokemon-speed">{Math.floor(effectiveSpeed(pokemonBuildData.pokemonBuild))}</p>
    </div>
  )

}

export const SpeedTiersDisplay: React.FC<{blueTeam: PokemonTeam, redTeam: PokemonTeam}> = ({ blueTeam, redTeam }) => {
  const allPokemonBuildData = blueTeam.pokemonBuilds.map((pokemonBuild) => {
    return {"side": "blue", "pokemonBuild": pokemonBuild}
  }).concat(redTeam.pokemonBuilds.map((pokemonBuild) => {
    return {"side": "red", "pokemonBuild": pokemonBuild}
  }));
  const sortedPokemonBuildData = allPokemonBuildData.sort((a, b) => {
    return effectiveSpeed(b.pokemonBuild) - effectiveSpeed(a.pokemonBuild);
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
            pokemonBuildData={pokemonBuildData} />
        )
      })}
    </div>
  )
}
