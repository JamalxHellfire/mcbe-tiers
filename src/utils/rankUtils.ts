
// Utility functions for player ranks based on points

export interface RankTier {
  title: string;
  minPoints: number;
  maxPoints: number | null;
  color: string;
  gradient: string;
  icon: string;
}

// Updated rank tiers based on your requirements
export const rankTiers: RankTier[] = [
  {
    title: "Combat Rookie",
    minPoints: 0,
    maxPoints: 69,
    color: "text-green-400",
    gradient: "from-green-500 to-green-600",
    icon: "🥉"
  },
  {
    title: "Combat Sargent",
    minPoints: 70,
    maxPoints: 119,
    color: "text-blue-400",
    gradient: "from-blue-500 to-blue-600",
    icon: "🥈"
  },
  {
    title: "Combat Ace",
    minPoints: 120,
    maxPoints: 149,
    color: "text-purple-400",
    gradient: "from-purple-500 to-purple-600",
    icon: "🏅"
  },
  {
    title: "Combat Marshal",
    minPoints: 150,
    maxPoints: 199,
    color: "text-yellow-400",
    gradient: "from-yellow-500 to-yellow-600",
    icon: "🥇"
  },
  {
    title: "Combat General",
    minPoints: 200,
    maxPoints: null,
    color: "text-red-400",
    gradient: "from-red-500 to-red-600",
    icon: "👑"
  }
];

/**
 * Get the rank tier based on points
 */
export function getPlayerRank(points: number): RankTier {
  const rank = rankTiers.find(tier => 
    points >= tier.minPoints && 
    (tier.maxPoints === null || points <= tier.maxPoints)
  );
  
  return rank || rankTiers[0];
}

/**
 * Format a range of points for display
 */
export function formatPointsRange(minPoints: number, maxPoints: number | null): string {
  if (maxPoints === null) {
    return `${minPoints}+`;
  }
  return `${minPoints} – ${maxPoints}`;
}

/**
 * Get the next rank tier a player is working towards
 */
export function getNextRank(points: number): RankTier | null {
  const currentRankIndex = rankTiers.findIndex(tier => 
    points >= tier.minPoints && 
    (tier.maxPoints === null || points <= tier.maxPoints)
  );
  
  if (currentRankIndex === -1 || currentRankIndex === rankTiers.length - 1) {
    return null;
  }
  
  return rankTiers[currentRankIndex + 1];
}
