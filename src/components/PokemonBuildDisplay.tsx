import React, { useState } from "react";
import { PokemonBuild } from "../models/pokemon/PokemonBuild";

export const PokemonBuildDisplay: React.FC<{
  pokemonBuild: PokemonBuild,
  activeSectionIdent?: string;
  onSectionClick?: (sectionName: string) => void,
  onSectionInputChange?: (inputValue: string) => void
}> = ({
  pokemonBuild,
  activeSectionIdent = "",
  onSectionClick = () => undefined,
  onSectionInputChange = () => undefined
}) => {
  const pokemonImage = require(`../data/pokemon/paldea/${String(pokemonBuild.pokemon.paldea_regional_pokedex_number).padStart(2, "0")}-${pokemonBuild.pokemon.ident.split("-")[0]}/${pokemonBuild.pokemon.ident}.static.png`);

  return (
    <div className="pokemon-build-display">
      <div className="build-section section-meta">
        <div className="row row-1">
          <div className="section-nickname">
            <p>NICKNAME</p>
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
              <p>GRASS</p>
            </div>
            <div className="secondary-type">
              <p>NORMAL</p>
            </div>
            <div className="tera-type">
              <p>TERA</p>
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

      </div>
      <div className="build-section section-stats">

      </div>
    </div>
  )

}

{/* <div className="pokemon-build-display">
<div className="data-row nickname">
  <p className="row-label">Nickname:</p>
  <p className="row-value">{pokemonBuildData.nickname}</p>
</div>
<div className="data-row pokemon-ident">
  <p className="row-label">Ident:</p>
  <p className="row-value">{pokemonBuildData.pokemon.ident}</p>
</div>
<div className="data-row pokemon-level">
  <p className="row-label">Level:</p>
  <p className="row-value">{pokemonBuildData.level}</p>
</div>
<div className="data-row pokemon-gender">
  <p className="row-label">Gender:</p>
  <p className="row-value">{pokemonBuildData.gender}</p>
</div>
<div className="data-row pokemon-shiny">
  <p className="row-label">Shiny:</p>
  <p className="row-value">{`${pokemonBuildData.shiny}`}</p>
</div>
<div className="data-row pokemon-primary-type-ident">
  <p className="row-label">Primary Type:</p>
  <p className="row-value">{`${pokemonBuildData.pokemon.primary_type_ident}`}</p>
</div>
<div className="data-row pokemon-secondary-type-ident">
  <p className="row-label">Secondary Type:</p>
  <p className="row-value">{`${pokemonBuildData.pokemon.secondary_type_ident}`}</p>
</div>
<div className="data-row pokemon-tera-type-ident">
  <p className="row-label">Tera Type:</p>
  <p className="row-value">{`${pokemonBuildData.tera_type_ident}`}</p>
</div>
<div className="data-row pokemon-item-ident">
  <p className="row-label">Item:</p>
  <p className="row-value">{`${pokemonBuildData.item_ident}`}</p>
</div>
<div className="data-row pokemon-ability-ident">
  <p className="row-label">Ability:</p>
  <p className="row-value">{`${pokemonBuildData.ability_ident}`}</p>
</div>
<div className="data-row pokemon-move-ident move-1">
  <p className="row-label">Move 1:</p>
  <p className="row-value">{`${pokemonBuildData.move_idents[0]}`}</p>
</div>
<div className="data-row pokemon-move-ident move-2">
  <p className="row-label">Move 1:</p>
  <p className="row-value">{`${pokemonBuildData.move_idents[0]}`}</p>
</div>
<div className="data-row pokemon-move-ident move-3">
  <p className="row-label">Move 1:</p>
  <p className="row-value">{`${pokemonBuildData.move_idents[0]}`}</p>
</div>
<div className="data-row pokemon-move-ident move-4">
  <p className="row-label">Move 1:</p>
  <p className="row-value">{`${pokemonBuildData.move_idents[0]}`}</p>
</div>
</div> */}
