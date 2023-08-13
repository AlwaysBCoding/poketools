import React, { useState, useEffect } from "react";

import { PokemonBuild } from "../models/pokemon/PokemonBuild";

import { displayPokemonIdent, smogonIdentReverseMapping } from "../decorators/Pokemon";
import { displayPokemonAbility } from "../decorators/PokemonAbility";
import { displayPokemonItem } from "../decorators/PokemonItem";
import { displayPokemonMove } from "../decorators/PokemonMove";
import { displayPercentage } from "../decorators/DecoratorsShared";

import vgcUsageData from "../data/stats/2022-12-vgc-series1-usage.json";

export const PokemonBuildUsageData: React.FC<{pokemonBuild: PokemonBuild}> = ({ pokemonBuild }) => {
  const [activePokemonBuild, setActivePokemonBuild] = useState<PokemonBuild>(pokemonBuild);
  const [activePokemonUsageData, setActivePokemonUsageData] = useState<Record<string, any> | undefined>(undefined);

  useEffect(() => {
    setActivePokemonBuild(pokemonBuild);
    const pokemonUsageData = vgcUsageData.find((usageData: any) => {
      return smogonIdentReverseMapping(usageData.ident) == pokemonBuild.pokemon.ident
    });
    setActivePokemonUsageData(pokemonUsageData);
  }, [pokemonBuild]);

  return (
    <div className="pokemon-build-usage-data">
      {activePokemonUsageData ? (
        <>
          <div className="section abilities">
            <h4>ABILITIES</h4>
            {activePokemonUsageData.abilities.map((ability_data: any, index: number) => {
              return (
                <div className="usage-stat ability" key={`ability-${index}`}>
                  <p className="usage-text ability-text">{displayPokemonAbility(ability_data[0])}</p>
                  <p className="usage-percentage">{displayPercentage(ability_data[1] / 100)}</p>
                </div>
              )
            })}
          </div>
          <div className="section items">
            <h4>ITEMS</h4>
            {activePokemonUsageData.items.map((item_data: any, index: number) => {
              return (
                <div className="usage-stat item" key={`item-${index}`}>
                  <p className="usage-text item-text">{displayPokemonItem(item_data[0])}</p>
                  <p className="usage-percentage">{displayPercentage(item_data[1] / 100)}</p>
                </div>
              )
            })}
          </div>
          <div className="section moves">
            <h4>MOVES</h4>
            {activePokemonUsageData.moves.map((move_data: any, index: number) => {
              return (
                <div className="usage-stat move" key={`move-${index}`}>
                  <p className="usage-text move-text">{displayPokemonMove(move_data[0])}</p>
                  <p className="usage-percentage">{displayPercentage(move_data[1] / 100)}</p>
                </div>
              )
            })}
          </div>
          <div className="section spreads">
            <h4>SPREADS</h4>
            {activePokemonUsageData.spreads.map((spread_data: any, index: number) => {
              return (
                <div className="usage-stat spread" key={`spread-${index}`}>
                  <p className="usage-text spread-text">{`${spread_data[0]}:${spread_data[1].join("/")}`}</p>
                  <p className="usage-percentage">{displayPercentage(spread_data[2] / 100)}</p>
                </div>
              )
            })}
          </div>
          <div className="section teammates">
            <h4>TEAMMATES</h4>
            {activePokemonUsageData.teammates.map((teammate_data: any, index: number) => {
              return (
                <div className="usage-stat teammate" key={`teammate-${index}`}>
                  <p className="usage-text teammate-text">{displayPokemonIdent(teammate_data[0])}</p>
                  <p className="usage-percentage">{displayPercentage(teammate_data[1] / 100)}</p>
                </div>
              )
            })}
          </div>
        </>
      ) : (<h1>No Usage Data</h1>)}
    </div>
  )
}
