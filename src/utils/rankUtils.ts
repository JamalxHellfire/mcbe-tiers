
// Utility functions for player ranks based on points

export interface RankTier {
  title: string;
  minPoints: number;
  maxPoints: number | null; // null means no upper limit
  color: string;
}

// Define the rank tiers
export const rankTiers: RankTier[] = [
  {
    title: "Combat Rookie",
    minPoints: 0,
    maxPoints: 499,
    color: "text-green-400"
  },
  {
    title: "Combat Cadet",
    minPoints: 500,
    maxPoints: 999,
    color: "text-blue-400"
  },
  {
    title: "Combat Elite",
    minPoints: 1000,
    maxPoints: 1499,
    color: "text-purple-400"
  },
  {
    title: "Combat Master",
    minPoints: 1500,
    maxPoints: 1999,
    color: "text-yellow-400" 
  },
  {
    title: "Combat Legend",
    minPoints: 2000,
    maxPoints: null, // No upper limit
    color: "text-red-400"
  }
];

/**
 * Get the rank tier based on points
 * @param points The player's total points
 * @returns The rank tier object with title, points range, and color
 */
export function getPlayerRank(points: number): RankTier {
  // Find the appropriate rank tier based on points
  const rank = rankTiers.find(tier => 
    points >= tier.minPoints && 
    (tier.maxPoints === null || points <= tier.maxPoints)
  );
  
  // Default to first tier if no match (shouldn't happen unless points are negative)
  return rank || rankTiers[0];
}

/**
 * Format a range of points for display
 * @param minPoints Minimum points
 * @param maxPoints Maximum points or null if no upper limit
 * @returns Formatted string representing the points range
 */
export function formatPointsRange(minPoints: number, maxPoints: number | null): string {
  if (maxPoints === null) {
    return `${minPoints}+`;
  }
  return `${minPoints} – ${maxPoints}`;
}

/**
 * Get the next rank tier a player is working towards
 * @param points The player's current points
 * @returns The next rank tier or null if at max rank
 */
export function getNextRank(points: number): RankTier | null {
  const currentRankIndex = rankTiers.findIndex(tier => 
    points >= tier.minPoints && 
    (tier.maxPoints === null || points <= tier.maxPoints)
  );
  
  // If at the highest rank or not found, return null
  if (currentRankIndex === -1 || currentRankIndex === rankTiers.length - 1) {
    return null;
  }
  
  // Return the next rank tier
  return rankTiers[currentRankIndex + 1];
}
