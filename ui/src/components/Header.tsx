import React from "react";
import { Link, useLocation } from "react-router-dom";

export const Header = () => {
  const location = useLocation();

  const NAVIGATION_LINKS = [
    {
      path: "/",
      display: "HOME"
    },
    {
      path: "/all-pokemon",
      display: "ALL POKEMON"
    },
    {
      path: "/all-teams",
      display: "ALL TEAMS"
    },
    {
      path: "/team-builder",
      display: "TEAM BUILDER"
    },
    {
      path: "/team-matchup",
      display: "TEAM MATCHUP"
    },
    {
      path: "/damage-calculation",
      display: "DAMAGE CALC"
    },
    {
      path: "/import-team",
      display: "IMPORT TEAM"
    },
    {
      path: "/battle-simulator",
      display: "BATTLE SIMULATOR"
    }
  ];

  return (
    <div className="Header">
      <div className="navigation-links">
        {NAVIGATION_LINKS.map((navigationLink) => {
          const navigationLinkClassName = location.pathname === navigationLink.path ? "navigation-link selected" : "navigation-link";
          return (
            <Link
              key={navigationLink.display}
              to={navigationLink.path}
              className={navigationLinkClassName}>
              {navigationLink.display}
            </Link>
          )
        })}
      </div>
    </div>
  )

}
