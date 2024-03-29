import React, { useState, useEffect } from "react";

import { Pokemon } from "../models/pokemon/Pokemon";
import { PokemonBuild, createDefaultPokemonBuildForPokemonIdent } from "../models/pokemon/PokemonBuild";
import { PokemonItem } from "../models/pokemon/PokemonItem";

import { PokemonBuildDisplay } from "../components/PokemonBuildDisplay";
import { PokemonDataTable } from "../components/PokemonDataTable";
import { PokemonAbilityIdent, PokemonTypeIdent, PokemonMoveIdent } from "../models/pokemon/PokemonShared";

import AllPokemon from "../data/pokemon/all-pokemon.json";
import AllItems from "../data/items/all-items.json";
import AllTypes from "../data/pokemon-types.json";

const AllPokemonSelectList: React.FC<{
  currentInputValue: string,
  onPokemonSelect: (pokemon: Pokemon) => void
}> = ({
  currentInputValue,
  onPokemonSelect
}) => {
  const allPokemon = AllPokemon as Pokemon[];
  const filteredPokemon = allPokemon.filter((pokemon) => {
    return pokemon.ident.includes(currentInputValue);
  });

  return (
    <div className="data-select-list all-pokemon-select-list">
      <PokemonDataTable
        pokemonList={filteredPokemon}
        clickable={true}
        onPokemonClick={onPokemonSelect} />
    </div>
  )
}

const AllItemsSelectList: React.FC<{
  currentInputValue: string,
  onItemSelect: (item: PokemonItem) => void
}> = ({
  currentInputValue,
  onItemSelect = () => undefined
}) => {
  const allItems = AllItems as PokemonItem[];
  const filteredItems = allItems.filter((item) => {
    return item.ident.includes(currentInputValue);
  })
  return (
    <div className="data-select-list all-items-select-list">
      <div className="generic-data-table">
        <div className="generic-header-row">
          <p className="generic-header-item">Item Name</p>
        </div>
        {filteredItems.map((item, index) => {
          return (
            <div
              key={`item-index-${index}`}
              className="generic-data-row clickable"
              onClick={() => { onItemSelect(item); }}>
              <p className="item-ident">{item.ident}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const PokemonAbilitySelectList: React.FC<{
  pokemon: Pokemon,
  onAbilitySelect: (abilityIdent: PokemonAbilityIdent) => void
}> = ({
  pokemon,
  onAbilitySelect = () => undefined
}) => {
  return (
    <div className="all-abilities-select-list">
      <div className="generic-data-table">
        <div className="generic-header-row">
          <p className="generic-header-item">Ability Name</p>
        </div>
        {pokemon.ability_idents.map((abilityIdent, index) => {
          return (
            <div
              key={`ability-index-${index}`}
              className="generic-data-row clickable"
              onClick={() => { onAbilitySelect(abilityIdent); }}>
              <p className="ability-ident">{abilityIdent}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const PokemonMoveSelectList: React.FC<{
  pokemon: Pokemon,
  currentInputValue: string,
  onMoveSelect: (moveIdent: PokemonMoveIdent) => void
}> = ({
  pokemon,
  currentInputValue,
  onMoveSelect = () => undefined
}) => {
  return (
    <div className="all-moves-select-list">
      <div className="generic-data-table">
        <div className="generic-header-row">
          <p className="generic-header-item">Move Name</p>
        </div>
        {pokemon.move_idents
          .filter((moveIdent) => { return moveIdent.includes(currentInputValue) })
          .map((moveIdent, index) => {
            return (
              <div
                key={`move-index-${index}`}
                className="generic-data-row clickable"
                onClick={() => { onMoveSelect(moveIdent); }}>
                <p className="move-ident">{moveIdent}</p>
              </div>
            );
        })}
      </div>
    </div>
  )
}

const AllTypesSelectList: React.FC<{
  onTypeSelect: (typeIdent: PokemonTypeIdent) => void
}> = ({
  onTypeSelect = () => undefined
}) => {
  const allTypes: PokemonTypeIdent[] = AllTypes.map((typeData) => { return typeData.ident as PokemonTypeIdent });

  return (
    <div className="data-select-list all-types-select-list">
      <div className="generic-data-table">
        <div className="generic-header-row">
          <p className="generic-header-item">Type Ident</p>
        </div>
        {allTypes.map((typeIdent, index) => {
          return (
            <div
              key={`type-index-${index}`}
              className="generic-data-row clickable"
              onClick={() => { onTypeSelect(typeIdent); }}>
              <p className="type-ident">{typeIdent}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const PokemonStatsSection: React.FC<{
}> = ({}) => {
  return (
    <div className="pokemon-stats-section">
      <p>HELLO</p>
    </div>
  )
}

export const PokemonBuilderScreen = () => {
  const [activeSectionIdent, setactiveSectionIdent] = useState<string>("");
  const [activeSectionInputValue, setActiveSectionInputValue] = useState<string>("");
  const [pokemonBuildData, setPokemonBuildData] = useState<PokemonBuild>(createDefaultPokemonBuildForPokemonIdent("arboliva"));

  const onSectionClick = (sectionName: string): void => {
    if(activeSectionIdent === "nickname" && sectionName === "") {
      const nextPokemonBuildData = Object.assign(pokemonBuildData, {nickname: activeSectionInputValue});
      setPokemonBuildData(nextPokemonBuildData);
      setactiveSectionIdent(sectionName);
      setActiveSectionInputValue("");
    } else if(sectionName !== activeSectionIdent) {
      setactiveSectionIdent(sectionName);
      setActiveSectionInputValue("");
    }
  }

  const onSectionInputChange = (inputValue: string): void => {
    setActiveSectionInputValue(inputValue);
  }

  const onPokemonSelect = (pokemon: Pokemon): void => {
    if(pokemon.ident !== pokemonBuildData.pokemon.ident) {
      setPokemonBuildData(
        createDefaultPokemonBuildForPokemonIdent(pokemon.ident)
      );
    }
    setactiveSectionIdent("");
    setActiveSectionInputValue("");
  }

  const onItemSelect = (item: PokemonItem): void => {
    if(item.ident !== pokemonBuildData.item_ident) {
      const nextPokemonBuildData = Object.assign(pokemonBuildData, {item_ident: item.ident});
      setPokemonBuildData(nextPokemonBuildData);
    }
    setactiveSectionIdent("");
    setActiveSectionInputValue("");
  }

  const onAbilitySelect = (abilityIdent: PokemonAbilityIdent): void => {
    if(abilityIdent !== pokemonBuildData.ability_ident) {
      const nextPokemonBuildData = Object.assign(pokemonBuildData, {ability_ident: abilityIdent});
      setPokemonBuildData(nextPokemonBuildData);
    }
    setactiveSectionIdent("");
    setActiveSectionInputValue("");
  }

  const onMoveSelect = (moveIdent: PokemonMoveIdent): void => {
    let moveSlotIndex = 0;
    if(activeSectionIdent === "move1") { moveSlotIndex = 0; }
    if(activeSectionIdent === "move2") { moveSlotIndex = 1; }
    if(activeSectionIdent === "move3") { moveSlotIndex = 2; }
    if(activeSectionIdent === "move4") { moveSlotIndex = 3; }
    const nextMoveIdents = pokemonBuildData.move_idents;
    nextMoveIdents[moveSlotIndex] = moveIdent;
    const nextPokemonBuildData = Object.assign(pokemonBuildData, {move_idents: nextMoveIdents});
    setPokemonBuildData(nextPokemonBuildData);
    setactiveSectionIdent("");
    setActiveSectionInputValue("");
  }

  const onTypeSelect = (teraTypeIdent: PokemonTypeIdent): void => {
    if(teraTypeIdent !== pokemonBuildData.tera_type_ident) {
      const nextPokemonBuildData = Object.assign(pokemonBuildData, {tera_type_ident: teraTypeIdent});
      setPokemonBuildData(nextPokemonBuildData);
    }
    setactiveSectionIdent("");
    setActiveSectionInputValue("");
  }

  return (
    <div
      className="screen pokemon-builder-screen">
      <PokemonBuildDisplay
        pokemonBuild={pokemonBuildData}
        activeSectionIdent={activeSectionIdent}
        onSectionClick={onSectionClick}
        onSectionInputChange={onSectionInputChange} />
      {activeSectionIdent === "pokemon" ? (
        <AllPokemonSelectList
          currentInputValue={activeSectionInputValue}
          onPokemonSelect={onPokemonSelect}/>
      ) : (<></>)}
      {activeSectionIdent === "item" ? (
        <AllItemsSelectList
          currentInputValue={activeSectionInputValue}
          onItemSelect={onItemSelect} />
      ) : (<></>)}
      {activeSectionIdent === "ability" ? (
        <PokemonAbilitySelectList
          pokemon={pokemonBuildData.pokemon}
          onAbilitySelect={onAbilitySelect} />
      ) : (<></>)}
      {activeSectionIdent === "tera-type" ? (
        <AllTypesSelectList
          onTypeSelect={onTypeSelect} />
      ) : (<></>)}
      {["move1", "move2", "move3", "move4"].includes(activeSectionIdent) ? (
        <PokemonMoveSelectList
          pokemon={pokemonBuildData.pokemon}
          currentInputValue={activeSectionInputValue}
          onMoveSelect={onMoveSelect} />
      ) : (<></>)}
      {activeSectionIdent === "stats" ? (
        <PokemonStatsSection />
      ) : (<></>)}
    </div>
  )

}
