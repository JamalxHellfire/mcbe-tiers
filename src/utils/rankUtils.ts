
// Utility functions for player ranks based on points

export interface RankTier {
  title: string;
  minPoints: number;
  maxPoints: number | null;
  color: string;
  gradient: string;
  icon: string;
  borderColor: string;
}

// Updated rank tiers based on new rank system
export const rankTiers: RankTier[] = [
  {
    title: "Rookie",
    minPoints: 0,
    maxPoints: 9,
    color: "text-gray-400",
    gradient: "from-gray-500 to-gray-600",
    icon: "🥉",
    borderColor: "border-gray-400"
  },
  {
    title: "Combat Novice",
    minPoints: 10,
    maxPoints: 19,
    color: "text-slate-400",
    gradient: "from-slate-500 to-slate-600",
    icon: "🏅",
    borderColor: "border-slate-400"
  },
  {
    title: "Combat Cadet",
    minPoints: 20,
    maxPoints: 49,
    color: "text-orange-400",
    gradient: "from-orange-500 to-orange-600",
    icon: "⚔️",
    borderColor: "border-orange-400"
  },
  {
    title: "Combat Specialist",
    minPoints: 50,
    maxPoints: 99,
    color: "text-green-400",
    gradient: "from-green-500 to-green-600",
    icon: "🛡️",
    borderColor: "border-green-400"
  },
  {
    title: "Combat Ace",
    minPoints: 100,
    maxPoints: 249,
    color: "text-blue-400",
    gradient: "from-blue-500 to-blue-600",
    icon: "⭐",
    borderColor: "border-blue-400"
  },
  {
    title: "Combat Master",
    minPoints: 250,
    maxPoints: 399,
    color: "text-yellow-400",
    gradient: "from-yellow-500 to-yellow-600",
    icon: "👑",
    borderColor: "border-yellow-400"
  },
  {
    title: "Combat Grandmaster",
    minPoints: 400,
    maxPoints: null,
    color: "text-purple-400",
    gradient: "from-purple-500 to-purple-600",
    icon: "💎",
    borderColor: "border-purple-400"
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
