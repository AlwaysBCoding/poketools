import React, { useState, useEffect } from "react";
import useForceUpdate from "use-force-update";

import AllPokemon from "../data/pokemon/all-pokemon.json";
import AllTypes from "../data/pokemon-types.json";
import TypeChart from "../data/pokemon-type-effectiveness.json";
import { Pokemon } from "../models/pokemon/Pokemon";
import { PokemonBuild, createDefaultPokemonBuildForPokemon } from "../models/pokemon/PokemonBuild";
import {
  calculatePokemonTotalStats,
  PokemonTypeInteraction,
  PokemonTypeIdent
} from "../models/pokemon/PokemonShared";

import { PokemonDataTable } from "../components/PokemonDataTable";

const PokemonSlotDisplay: React.FC<{pokemonBuild: PokemonBuild}> = ({ pokemonBuild }) => {
  const pokemonImage = require(`../data/pokemon/paldea/${String(pokemonBuild.pokemon.paldea_regional_pokedex_number).padStart(2, "0")}-${pokemonBuild.pokemon.ident.split("-")[0]}/${pokemonBuild.pokemon.ident}.static.png`);
  return (
    <div className="slot-content">
      <h4 className="slot-title pokemon-ident">{pokemonBuild.pokemon.ident}</h4>
      <img className="pokemon-image" src={pokemonImage} />
      <p className="level">{`LEVEL: ${pokemonBuild.level}`}</p>
      <p className="gender">{`GENDER: ${pokemonBuild.gender}`}</p>
      <p className="shiny">{`SHINY: ${pokemonBuild.shiny}`}</p>
      <hr />
      <p className="tera-type">{`TERA TYPE: ${pokemonBuild.tera_type_ident}`}</p>
      <p className="ability">{`ABILITY: ${pokemonBuild.ability_ident}`}</p>
      <p className="item">{`ITEM: ${pokemonBuild.item_ident}`}</p>
      <hr />
      <p className="move move-1">{`MOVE 1:`}</p>
      <p className="move move-2">{`MOVE 2:`}</p>
      <p className="move move-3">{`MOVE 3:`}</p>
      <p className="move move-4">{`MOVE 4:`}</p>
      <hr />
      <p className="stat hp">{`HP: ${pokemonBuild.stat_spread.hp}`}</p>
      <p className="stat attack">{`ATTACK: ${pokemonBuild.stat_spread.attack}`}</p>
      <p className="stat defense">{`DEFENSE: ${pokemonBuild.stat_spread.defense}`}</p>
      <p className="stat special-attack">{`SP. ATT: ${pokemonBuild.stat_spread.special_attack}`}</p>
      <p className="stat special-defense">{`SP. DEF: ${pokemonBuild.stat_spread.special_defense}`}</p>
      <p className="stat speed">{`SPEED: ${pokemonBuild.stat_spread.speed}`}</p>
      <p className="nature">{`NATURE: ${pokemonBuild.nature_ident}`}</p>
    </div>
  )
}

const PokemonTeamDisplay: React.FC<{team: PokemonBuild[]}> = ({ team }) => {
  return (
    <div className="pokemon-team-display">
      <div className="slots">
        <div className="slot slot-1">
          {team[0] ? (<PokemonSlotDisplay pokemonBuild={team[0]} />) : (<h4 className="slot-title">SLOT 1</h4>)}
        </div>
        <div className="slot slot-2">
          {team[1] ? (<PokemonSlotDisplay pokemonBuild={team[1]} />) : (<h4 className="slot-title">SLOT 2</h4>)}
        </div>
        <div className="slot slot-3">
          {team[2] ? (<PokemonSlotDisplay pokemonBuild={team[2]} />) : (<h4 className="slot-title">SLOT 3</h4>)}
        </div>
        <div className="slot slot-4">
          {team[3] ? (<PokemonSlotDisplay pokemonBuild={team[3]} />) : (<h4 className="slot-title">SLOT 4</h4>)}
        </div>
        <div className="slot slot-5">
          {team[4] ? (<PokemonSlotDisplay pokemonBuild={team[4]} />) : (<h4 className="slot-title">SLOT 5</h4>)}
        </div>
        <div className="slot slot-6">
          {team[5] ? (<PokemonSlotDisplay pokemonBuild={team[5]} />) : (<h4 className="slot-title">SLOT 6</h4>)}
        </div>
      </div>
    </div>
  )
}

export const PokemonTeamResistancesDisplay: React.FC<{team: PokemonBuild[]}> = ({ team }) => {
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

  useEffect(() => {
    if(team.length > teamResistanceValues.length) {
      const nextTeamResistanceValues = [];
      for (const pokemonBuild of team) {
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
        <p className="header-row">{team[0] ? team[0].pokemon.ident : "Slot 1"}</p>
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
        <p className="header-row">{team[1] ? team[1].pokemon.ident : "Slot 2"}</p>
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
        <p className="header-row">{team[2] ? team[2].pokemon.ident : "Slot 3"}</p>
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
        <p className="header-row">{team[3] ? team[3].pokemon.ident : "Slot 4"}</p>
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
        <p className="header-row">{team[4] ? team[4].pokemon.ident : "Slot 5"}</p>
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
        <p className="header-row">{team[5] ? team[5].pokemon.ident : "Slot 6"}</p>
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
          const resistances = teamResistanceValues.filter((resistanceValue) => { if(resistanceValue[index] < 1) { return true; }}).length;
          const weaknesses = teamResistanceValues.filter((resistanceValue) => { if(resistanceValue[index] > 1) { return true; }}).length;
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

export const TeamBuilderScreen = () => {
  const forceUpdate = useForceUpdate();
  const allPokemon = AllPokemon as Pokemon[];

  const [searchString, setSearchString] = useState<string>("");
  const [team, setTeam] = useState<PokemonBuild[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>(allPokemon);

  useEffect(() => {
    const nextFilteredPokemon = allPokemon.filter((pokemon) => {
      return pokemon.ident.includes(searchString);
    });
    nextFilteredPokemon.sort((pokemonA, pokemonB) => { return calculatePokemonTotalStats(pokemonB.base_stats) - calculatePokemonTotalStats(pokemonA.base_stats) });
    setFilteredPokemon(nextFilteredPokemon);
  }, [searchString]);

  const selectPokemon = (pokemon: Pokemon) => {
    let nextTeam = team;
    nextTeam.push(createDefaultPokemonBuildForPokemon(pokemon));
    setTeam(nextTeam);
    setSearchString("");
    forceUpdate();
  }

  return (
    <div className="screen team-builder-screen">
      <h1>TEAM BUILDER</h1>
      <div className="pokemon-select">
        <input
          className="pokemon-select-input"
          placeholder="SEARCH POKEMON"
          value={searchString}
          onChange={(e) => { setSearchString(e.target.value) }} />
        <div className="pokemon-data-table-container">
          <PokemonDataTable
            pokemonList={filteredPokemon.slice(0, 5)}
            clickable={true}
            onPokemonClick={(pokemon: Pokemon) => { selectPokemon(pokemon); }}
            displayBaseStats={false} />
        </div>
      </div>
      <div className="team-display-container">
        <PokemonTeamDisplay team={team} />
      </div>
      <div className="team-resistances-container">
        <PokemonTeamResistancesDisplay team={team} />
      </div>
    </div>
  )

}
