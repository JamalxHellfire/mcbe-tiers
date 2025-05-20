
import React from 'react';
import { LucideIcon, Diamond, Sword, Axe, Skull, Users, Bed, Flask, Trophy } from "lucide-react";

type GameMode = "crystal" | "sword" | "smp" | "uhc" | "axe" | "nethpot" | "bedwars" | "mace" | "overall";

interface GameModeIconProps {
  mode: GameMode;
  size?: "sm" | "md" | "lg";
}

interface IconSizeClasses {
  sm: string;
  md: string;
  lg: string;
}

const iconSizeClasses: IconSizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export const GameModeIcon = ({ mode, size = "md" }: GameModeIconProps) => {
  const iconClass = iconSizeClasses[size];
  
  const renderIcon = () => {
    switch (mode.toLowerCase()) {
      case "crystal":
        return <Diamond className={iconClass} />;
      case "sword":
        return <Sword className={iconClass} />;
      case "axe":
        return <Axe className={iconClass} />;
      case "smp":
        return <Users className={iconClass} />;
      case "uhc":
        return <Skull className={iconClass} />;
      case "nethpot":
        return <Flask className={iconClass} />; // Replaced Potion with Flask
      case "bedwars":
        return <Bed className={iconClass} />;
      case "mace":
        return <Skull className={iconClass} />;
      case "overall":
        return <Trophy className={iconClass} />;
      default:
        return null;
    }
  };

  return (
    <>
      {renderIcon()}
    </>
  );
};

export default GameModeIcon;
