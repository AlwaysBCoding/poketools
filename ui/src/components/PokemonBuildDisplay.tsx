import React, { useState, KeyboardEvent } from "react";
import { PokemonBuild } from "../models/pokemon/PokemonBuild";

export const PokemonBuildDisplay: React.FC<{
  pokemonBuild: PokemonBuild,
  activeSectionIdent?: string,
  onSectionClick?: (sectionName: string) => void,
  onSectionInputChange?: (inputValue: string) => void,
  onEnterPress?: () => void
}> = ({
  pokemonBuild,
  activeSectionIdent = "",
  onSectionClick = () => undefined,
  onSectionInputChange = () => undefined,
  onEnterPress = () => undefined
}) => {
  const pokemonImage = require(`../data/pokemon/${pokemonBuild.pokemon.pokedex_region}/${String(pokemonBuild.pokemon.regional_pokedex_number).padStart(2, "0")}-${pokemonBuild.pokemon.ident.split("-")[0]}/${pokemonBuild.pokemon.ident}.static.png`);

  const keyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if(event.key === "Enter") {
      onEnterPress();
    }
  }

  return (
    <div className="pokemon-build-display">
      <div className="build-section section-meta">
        <div className="row row-1">
          <div className="section-nickname" onClick={() => { onSectionClick("nickname"); }}>
            <p className="input-label">Nickname</p>
            {activeSectionIdent === "nickname" ? (
              <input
                className="nickname-input"
                autoFocus={true}
                onKeyPress={keyPressHandler}
                onChange={(e) => { onSectionInputChange(e.currentTarget.value) }}
                onBlur={() => { onSectionClick("") }} />
            ) : (
              <p className="input-data pokemon-data">
                {pokemonBuild.nickname}
              </p>
            )}
          </div>
          <div className="section-details">
            <div className="section-level">
              <p>LEVEL</p>
            </div>
            <div className="section-gender">
              <p>GENDER</p>
            </div>
            <div className="section-shiny">
              <p>SHINY</p>
            </div>
          </div>
        </div>
        <div className="row row-2">
          <img className="section-image" src={pokemonImage} />
          <div className="section-types">
            <div className="primary-type">
              <p>{pokemonBuild.pokemon.primary_type_ident}</p>
            </div>
            <div className="secondary-type">
              <p>{pokemonBuild.pokemon.secondary_type_ident}</p>
            </div>
            <div className="tera-type" onClick={() => { onSectionClick("tera-type"); }}>
              <p className="input-label">Tera Type</p>
              {activeSectionIdent === "tera-type" ? (
                <input
                  className="tera-type-input"
                  autoFocus={true}
                  onKeyPress={keyPressHandler}
                  onChange={(e) => { onSectionInputChange(e.currentTarget.value) }} />
              ) : (
                <p className="input-data tera-type-data">
                  {pokemonBuild.tera_type_ident}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="row row-3">
          <div className="section section-pokemon" onClick={() => { onSectionClick("pokemon"); }}>
            <p className="input-label">Pokemon</p>
            {activeSectionIdent === "pokemon" ? (
            <input
              className="pokemon-input"
              autoFocus={true}
              onKeyPress={keyPressHandler}
              onChange={(e) => { onSectionInputChange(e.currentTarget.value) }}/>
            ) : (
              <p className="input-data pokemon-data">
                {pokemonBuild.pokemon.ident}
              </p>
            )}
          </div>
          <div className="section section-item" onClick={() => { onSectionClick("item"); }}>
            <p className="input-label">Item</p>
            {activeSectionIdent === "item" ? (
              <input
                className="item-input"
                autoFocus={true}
                onKeyPress={keyPressHandler}
                onChange={(e) => { onSectionInputChange(e.currentTarget.value) }} />
            ) : (
              <p className="input-data item-data">
                {pokemonBuild.item_ident}
              </p>
            )}
          </div>
          <div className="section section-ability" onClick={() => { onSectionClick("ability"); }}>
            <p className="input-label">Ability</p>
            {activeSectionIdent === "ability" ? (
              <input
                className="ability-input"
                autoFocus={true}
                onKeyPress={keyPressHandler}
                onChange={(e) => { onSectionInputChange(e.currentTarget.value) }} />
            ) : (
              <p className="input-data ability-data">
                {pokemonBuild.ability_ident}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="build-section section-moves">
        <p className="input-label">Moves</p>
        {activeSectionIdent === "move1" ? (
          <input
            className="move-input move-1-input"
            autoFocus={true}
            onKeyPress={keyPressHandler}
            onChange={(e) => { onSectionInputChange(e.currentTarget.value) }} />
        ) : (
          <p className="input-data move-data move-1-data" onClick={() => { onSectionClick("move1") }}>
            {pokemonBuild.move_idents[0]}
          </p>
        )}
        {activeSectionIdent === "move2" ? (
          <input
            className="move-input move-2-input"
            autoFocus={true}
            onKeyPress={keyPressHandler}
            onChange={(e) => { onSectionInputChange(e.currentTarget.value) }} />
        ) : (
          <p className="input-data move-data move-2-data" onClick={() => { onSectionClick("move2") }}>
            {pokemonBuild.move_idents[1]}
          </p>
        )}
        {activeSectionIdent === "move3" ? (
          <input
            className="move-input move-3-input"
            autoFocus={true}
            onKeyPress={keyPressHandler}
            onChange={(e) => { onSectionInputChange(e.currentTarget.value) }} />
        ) : (
          <p className="input-data move-data move-3-data" onClick={() => { onSectionClick("move3") }}>
            {pokemonBuild.move_idents[2]}
          </p>
        )}
        {activeSectionIdent === "move4" ? (
          <input
            className="move-input move-4-input"
            autoFocus={true}
            onKeyPress={keyPressHandler}
            onChange={(e) => { onSectionInputChange(e.currentTarget.value) }} />
        ) : (
          <p className="input-data move-data move-4-data" onClick={() => { onSectionClick("move4") }}>
            {pokemonBuild.move_idents[3]}
          </p>
        )}
      </div>
      <div className="build-section section-stats" onClick={() => { onSectionClick("stats") }}>
        <p className="input-label">Stats</p>
      </div>
      {/* <div className="build-section section-actions">
        <p className="input-label">Actions</p>
        <p className="action-text">COPY</p>
        <p className="action-text">IMPORT/EXPORT</p>
        <p className="action-text">MOVE</p>
        <p className="action-text">DELETE</p>
      </div> */}
    </div>
  )

}
