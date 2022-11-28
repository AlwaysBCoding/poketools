import React, { useState, useEffect } from "react";

import { Pokemon } from "../models/pokemon/Pokemon";
import { PokemonTeam } from "../models/pokemon/PokemonTeam";
import { PokemonTypeIdent, PokemonTypeInteraction } from "../models/pokemon/PokemonShared";

import AllTypes from "../data/pokemon-types.json";
import TypeChart from "../data/pokemon-type-effectiveness.json";

export const PokemonTeamResistancesDisplay: React.FC<{team: PokemonTeam}> = ({ team }) => {
  const typeChart = TypeChart as PokemonTypeInteraction[];
  const allTypes: PokemonTypeIdent[] = AllTypes.map((typeData) => { return typeData.ident }) as PokemonTypeIdent[];

  const [teamResistanceValues, setTeamResistanceValues] = useState<number[][]>([])

  const pokemonResistanceValue = (pokemon: Pokemon, typeIdent: PokemonTypeIdent): number => {
    const primaryTypeResistance = typeChart.find((interaction) => {
      return interaction.offensive_type_ident === typeIdent && interaction.defensive_type_ident === pokemon.primary_type_ident;
    })!.effectiveness;
    const secondaryTypeResistance = pokemon.secondary_type_ident ? (
      typeChart.find((interaction) => {
        return interaction.offensive_type_ident === typeIdent && interaction.defensive_type_ident === pokemon.secondary_type_ident;
      })!.effectiveness
    ) : 1;
    return (primaryTypeResistance * secondaryTypeResistance);
  }

  // eslint-disable-next-line
  useEffect(() => {
    if(team.pokemonBuilds.length > teamResistanceValues.length) {
      const nextTeamResistanceValues = [];
      for (const pokemonBuild of team.pokemonBuilds) {
        const pokemonResistances = allTypes.map((typeIdent) => {
          return pokemonResistanceValue(pokemonBuild.pokemon, typeIdent);
        })
        nextTeamResistanceValues.push(pokemonResistances);
      }
      setTeamResistanceValues(nextTeamResistanceValues);
    }
  });

  return (
    <div className="pokemon-team-resistances-display">
      <div className="resistances-column esistance-labels">
        <p className="header-row">Attacking Type</p>
        {allTypes.map((typeIdent) => {
          return (
            <p key={`title-${typeIdent}`} className="display-row title">{typeIdent}</p>
          )
        })}
      </div>
      <div className="resistances-column slot-resistances slot-1">
        <p className="header-row">{team.pokemonBuilds[0] ? team.pokemonBuilds[0].pokemon.ident : "Slot 1"}</p>
        {allTypes.map((typeIdent, index) => {
          if(teamResistanceValues[0]) {
            const interactionValue = teamResistanceValues[0][index];
            return (<p key={`1-${typeIdent}`} className={`display-row resistance-${interactionValue}`}>{interactionValue}</p>)
          } else {
            return (<p key={`1-${typeIdent}`} className="display-row">-</p>)
          }
        })}
      </div>
      <div className="resistances-column slot-resistances slot-2">
        <p className="header-row">{team.pokemonBuilds[1] ? team.pokemonBuilds[1].pokemon.ident : "Slot 2"}</p>
        {allTypes.map((typeIdent, index) => {
          if(teamResistanceValues[1]) {
            const interactionValue = teamResistanceValues[1][index];
            return (<p key={`2-${typeIdent}`} className={`display-row resistance-${interactionValue}`}>{interactionValue}</p>)
          } else {
            return (<p key={`2-${typeIdent}`} className="display-row">-</p>)
          }
        })}
      </div>
      <div className="resistances-column slot-resistances slot-3">
        <p className="header-row">{team.pokemonBuilds[2] ? team.pokemonBuilds[2].pokemon.ident : "Slot 3"}</p>
        {allTypes.map((typeIdent, index) => {
          if(teamResistanceValues[2]) {
            const interactionValue = teamResistanceValues[2][index];
            return (<p key={`3-${typeIdent}`} className={`display-row resistance-${interactionValue}`}>{interactionValue}</p>)
          } else {
            return (<p key={`3-${typeIdent}`} className="display-row">-</p>)
          }
        })}
      </div>
      <div className="resistances-column slot-resistances slot-4">
        <p className="header-row">{team.pokemonBuilds[3] ? team.pokemonBuilds[3].pokemon.ident : "Slot 4"}</p>
        {allTypes.map((typeIdent, index) => {
          if(teamResistanceValues[3]) {
            const interactionValue = teamResistanceValues[3][index];
            return (<p key={`4-${typeIdent}`} className={`display-row resistance-${interactionValue}`}>{interactionValue}</p>)
          } else {
            return (<p key={`4-${typeIdent}`} className="display-row">-</p>)
          }
        })}
      </div>
      <div className="resistances-column slot-resistances slot-5">
        <p className="header-row">{team.pokemonBuilds[4] ? team.pokemonBuilds[4].pokemon.ident : "Slot 5"}</p>
        {allTypes.map((typeIdent, index) => {
          if(teamResistanceValues[4]) {
            const interactionValue = teamResistanceValues[4][index];
            return (<p key={`5-${typeIdent}`} className={`display-row resistance-${interactionValue}`}>{interactionValue}</p>)
          } else {
            return (<p key={`5-${typeIdent}`} className="display-row">-</p>)
          }
        })}
      </div>
      <div className="resistances-column slot-resistances slot-6">
        <p className="header-row">{team.pokemonBuilds[5] ? team.pokemonBuilds[5].pokemon.ident : "Slot 6"}</p>
        {allTypes.map((typeIdent, index) => {
          if(teamResistanceValues[5]) {
            const interactionValue = teamResistanceValues[5][index];
            return (<p key={`6-${typeIdent}`} className={`display-row resistance-${interactionValue}`}>{interactionValue}</p>)
          } else {
            return (<p key={`6-${typeIdent}`} className="display-row">-</p>)
          }
        })}
      </div>
      <div className="resistances-column team-resistances">
        <p className="header-row">TEAM</p>
        {allTypes.map((typeIdent, index) => {
          var displayRowClassName = "display-row";
          const resistances = teamResistanceValues.filter((resistanceValue) => { if(resistanceValue[index] < 1) { return true; } else { return false; }}).length;
          const weaknesses = teamResistanceValues.filter((resistanceValue) => { if(resistanceValue[index] > 1) { return true; } else { return false; }}).length;
          if(weaknesses > resistances) { displayRowClassName = "display-row overall-weak"; }
          if(resistances > weaknesses) { displayRowClassName = "display-row overall-strong"; }
          return (
            <p key={`team-${typeIdent}`} className={displayRowClassName}>{`${weaknesses} / ${resistances}`}</p>
          )
        })}
      </div>
    </div>
  )
}
