import React, { useState, useEffect, ChangeEvent } from "react";
import { BattleSide, TerrainState, WeatherState } from "../models/battle/BattleShared";
import { BattleState } from "../models/battle/BattleState";

type BooleanString = "true" | "false";

export const BattleFieldStateEditor: React.FC<{
  onBattleFieldStateChange?: (nextBattleFieldState: BattleState) => void
}> = ({
  onBattleFieldStateChange = () => undefined
}) => {
  const [blueReflectValue, setBlueReflectValue] = useState<BooleanString>("false");
  const [redReflectValue, setRedReflectValue] = useState<BooleanString>("false");
  const [blueLightScreenValue, setBlueLightScreenValue] = useState<BooleanString>("false");
  const [redLightScreenValue, setRedLightScreenValue] = useState<BooleanString>("false");
  const [blueAuroraVeilValue, setBlueAuroraVeilValue] = useState<BooleanString>("false");
  const [redAuroraVeilValue, setRedAuroraVeilValue] = useState<BooleanString>("false");
  const [blueTailwindValue, setBlueTailwindValue] = useState<BooleanString>("false");
  const [redTailwindValue, setRedTailwindValue] = useState<BooleanString>("false");

  const [globalWeatherValue, setGlobalWeatherValue] = useState<WeatherState>("none");
  const [globalTerrainValue, setGlobalTerrainValue] = useState<TerrainState>("none");

  const serializeBattleFieldState = (): BattleState => {
    return {
      global_state: {
        weather: globalWeatherValue,
        weather_counter: 0,
        terrain: globalTerrainValue,
        terrain_counter: 0,
        auras: []
      },
      blue_side_state: {
        reflect: blueReflectValue === "true" ? 1 : 0,
        light_screen: blueLightScreenValue === "true" ? 1 : 0,
        aurora_veil: blueAuroraVeilValue === "true" ? 1 : 0,
        tailwind: blueTailwindValue === "true" ? 1 : 0,
        hazards: []
      },
      red_side_state: {
        reflect: redReflectValue === "true" ? 1 : 0,
        light_screen: redLightScreenValue === "true" ? 1 : 0,
        aurora_veil: redAuroraVeilValue === "true" ? 1 : 0,
        tailwind: redTailwindValue === "true" ? 1 : 0,
        hazards: []
      },
      field_state: {},
      blue_side_pokemon: [],
      red_side_pokemon: []
    }
  }

  useEffect(() => {
    onBattleFieldStateChange(serializeBattleFieldState());
  }, [
    globalWeatherValue,
    globalTerrainValue,
    blueReflectValue,
    blueLightScreenValue,
    blueAuroraVeilValue,
    blueTailwindValue,
    redReflectValue,
    redLightScreenValue,
    redAuroraVeilValue,
    redTailwindValue
  ]);

  const handleReflectSelect = (e: ChangeEvent<HTMLSelectElement>, side: BattleSide) => {
    if(side === "blue") {
      setBlueReflectValue(e.target.value as BooleanString);
    } else if(side === "red") {
      setRedReflectValue(e.target.value as BooleanString);
    }
  }

  const handleLightScreenSelect = (e: ChangeEvent<HTMLSelectElement>, side: BattleSide) => {
    if(side === "blue") {
      setBlueLightScreenValue(e.target.value as BooleanString);
    } else if(side === "red") {
      setRedLightScreenValue(e.target.value as BooleanString);
    }
  }

  const handleAuroraVeilSelect = (e: ChangeEvent<HTMLSelectElement>, side: BattleSide) => {
    if(side === "blue") {
      setBlueAuroraVeilValue(e.target.value as BooleanString);
    } else if(side === "red") {
      setRedAuroraVeilValue(e.target.value as BooleanString);
    }
  }

  const handleTailwindSelect = (e: ChangeEvent<HTMLSelectElement>, side: BattleSide) => {
    if(side === "blue") {
      setBlueTailwindValue(e.target.value as BooleanString);
    } else if(side === "red") {
      setRedTailwindValue(e.target.value as BooleanString);
    }
  }

  const handleWeatherSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setGlobalWeatherValue(e.target.value as WeatherState);
  }

  const handleTerrainSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setGlobalTerrainValue(e.target.value as TerrainState);
  }

  return (
    <div className="battle-field-state-editor">
      <div className="battle-field-state-section blue-team-section">
        <div className="toggle-field reflect">
          <p className="toggle-field-label">Reflect</p>
          <select className="toggle-select-list" value={blueReflectValue} onChange={(e) => { handleReflectSelect(e, "blue") }}>
            <option value={"false"}>No</option>
            <option value={"true"}>Yes</option>
          </select>
        </div>
        <div className="toggle-field">
          <p className="toggle-field-label light-screen">Light Screen</p>
          <select className="toggle-select-list" value={blueLightScreenValue} onChange={(e) => { handleLightScreenSelect(e, "blue") }}>
            <option value={"false"}>No</option>
            <option value={"true"}>Yes</option>
          </select>
        </div>
        <div className="toggle-field">
          <p className="toggle-field-label aurora-veil">Aurora Veil</p>
          <select className="toggle-select-list" value={blueAuroraVeilValue} onChange={(e) => { handleAuroraVeilSelect(e, "blue") }}>
            <option value={"false"}>No</option>
            <option value={"true"}>Yes</option>
          </select>
        </div>
        <div className="toggle-field">
          <p className="toggle-field-label tailwind">Tailwind</p>
          <select className="toggle-select-list" value={blueTailwindValue} onChange={(e) => { handleTailwindSelect(e, "blue") }}>
            <option value={"false"}>No</option>
            <option value={"true"}>Yes</option>
          </select>
        </div>
      </div>
      <div className="battle-field-state-section global-section">
        <div className="toggle-field weather">
          <p className="toggle-field-label">Weather</p>
          <select className="toggle-select-list" value={globalWeatherValue} onChange={handleWeatherSelect}>
            <option value={"none"}>(none)</option>
            <option value={"rain"}>Rain</option>
            <option value={"sandstorm"}>Sandstorm</option>
            <option value={"snow"}>Snow</option>
            <option value={"sun"}>Sun</option>
          </select>
        </div>
        <div className="toggle-field terrain">
          <p className="toggle-field-label">Terrain</p>
          <select className="toggle-select-list" value={globalTerrainValue} onChange={handleTerrainSelect}>
            <option value={"none"}>(none)</option>
            <option value={"electric"}>Electric</option>
            <option value={"grassy"}>Grassy</option>
            <option value={"misty"}>Misty</option>
            <option value={"psychic"}>Psychic</option>
          </select>
        </div>
      </div>
      <div className="battle-field-state-section red-team-section">
        <div className="toggle-field reflect">
          <select className="toggle-select-list" value={redReflectValue} onChange={(e) => { handleReflectSelect(e, "red") }}>
            <option value={"false"}>No</option>
            <option value={"true"}>Yes</option>
          </select>
          <p className="toggle-field-label">Reflect</p>
        </div>
        <div className="toggle-field light-screen">
          <select className="toggle-select-list" value={redLightScreenValue} onChange={(e) => { handleLightScreenSelect(e, "red") }}>
            <option value={"false"}>No</option>
            <option value={"true"}>Yes</option>
          </select>
          <p className="toggle-field-label">Light Screen</p>
        </div>
        <div className="toggle-field aurora-veil">
          <select className="toggle-select-list" value={redAuroraVeilValue} onChange={(e) => { handleAuroraVeilSelect(e, "red") }}>
            <option value={"false"}>No</option>
            <option value={"true"}>Yes</option>
          </select>
          <p className="toggle-field-label">Aurora Veil</p>
        </div>
        <div className="toggle-field">
          <select className="toggle-select-list" value={redTailwindValue} onChange={(e) => { handleTailwindSelect(e, "red") }}>
            <option value={"false"}>No</option>
            <option value={"true"}>Yes</option>
          </select>
          <p className="toggle-field-label">Tailwind</p>
        </div>
      </div>
    </div>
  );

}
