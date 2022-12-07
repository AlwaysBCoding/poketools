import React, { useState, useEffect } from "react";

import { PokemonTeam } from "../models/pokemon/PokemonTeam";
import { PokemonBuild } from "../models/pokemon/PokemonBuild";

const PokemonSlotDisplay: React.FC<{pokemonBuild: PokemonBuild}> = ({ pokemonBuild }) => {
  const pokemonImage = require(`../data/pokemon/paldea/${String(pokemonBuild.pokemon.paldea_regional_pokedex_number).padStart(2, "0")}-${pokemonBuild.pokemon.ident.split("-")[0]}/${pokemonBuild.pokemon.ident}.static.png`);
  return (
    <div className="slot-content">
      <h4 className="slot-title pokemon-ident">{pokemonBuild.pokemon.ident}</h4>
      <img className="pokemon-image" src={pokemonImage} alt={pokemonBuild.pokemon.ident} />
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

interface PokemonTeamDisplayProps {
  team: PokemonTeam,
  config: Record<string, any>,
  mode: "index" | "show"
}

export const PokemonTeamDisplay: React.FC<PokemonTeamDisplayProps> = ({ team, config, mode }) => {
  const [teamNameString, setTeamNameString] = useState<string>(team.team_name);

  useEffect(() => {
    team.team_name = teamNameString;
  }, [teamNameString]);

  const savePokemonTeam = () => {
    let nextSavedTeams: Record<string, PokemonTeam> = {};
    const savedTeams: Record<string, PokemonTeam> = JSON.parse(`${localStorage.getItem("savedTeams")}`);
    if(!savedTeams) {
      nextSavedTeams[team.team_name] = team;
    } else {
      nextSavedTeams = savedTeams;
      nextSavedTeams[team.team_name] = team;
    }
    localStorage.setItem("savedTeams", JSON.stringify(nextSavedTeams));
  }

  const deletePokemonTeam = () => {
    let nextSavedTeams: Record<string, PokemonTeam> = {};
    const savedTeams: Record<string, PokemonTeam> = JSON.parse(`${localStorage.getItem("savedTeams")}`);
    if(savedTeams) {
      nextSavedTeams = savedTeams;
      delete nextSavedTeams[team.team_name];
    }
    localStorage.setItem("savedTeams", JSON.stringify(nextSavedTeams));
  }

  return (
    <div className="pokemon-team-display mode-show">
      <div className="team-actions">
        {config.editable ? (
          <input
            className="team-name"
            placeholder={team.team_name}
            value={teamNameString}
            onChange={(e) => { setTeamNameString(e.target.value) }} />
        ) : (
          <p className="team-name">{team.team_name}</p>
        )}
        {config.editable ? (
          <div className="button" onClick={savePokemonTeam}>
            <p>SAVE</p>
          </div>
        ) : (<></>)}
        {config.deleteable ? (
          <div className="button" onClick={deletePokemonTeam}>
            <p>DELETE</p>
          </div>
        ) : (<></>)}
      </div>
      <div className="slots">
        <div className="slot slot-1">
          {team.pokemonBuilds[0] ? (<PokemonSlotDisplay pokemonBuild={team.pokemonBuilds[0]} />) : (<h4 className="slot-title">SLOT 1</h4>)}
        </div>
        <div className="slot slot-2">
          {team.pokemonBuilds[1] ? (<PokemonSlotDisplay pokemonBuild={team.pokemonBuilds[1]} />) : (<h4 className="slot-title">SLOT 2</h4>)}
        </div>
        <div className="slot slot-3">
          {team.pokemonBuilds[2] ? (<PokemonSlotDisplay pokemonBuild={team.pokemonBuilds[2]} />) : (<h4 className="slot-title">SLOT 3</h4>)}
        </div>
        <div className="slot slot-4">
          {team.pokemonBuilds[3] ? (<PokemonSlotDisplay pokemonBuild={team.pokemonBuilds[3]} />) : (<h4 className="slot-title">SLOT 4</h4>)}
        </div>
        <div className="slot slot-5">
          {team.pokemonBuilds[4] ? (<PokemonSlotDisplay pokemonBuild={team.pokemonBuilds[4]} />) : (<h4 className="slot-title">SLOT 5</h4>)}
        </div>
        <div className="slot slot-6">
          {team.pokemonBuilds[5] ? (<PokemonSlotDisplay pokemonBuild={team.pokemonBuilds[5]} />) : (<h4 className="slot-title">SLOT 6</h4>)}
        </div>
      </div>
    </div>
  )
}
