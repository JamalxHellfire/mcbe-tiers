
import React from 'react';

export function TierGrid() {
  // Array of 5 tiers
  const tiers = [1, 2, 3, 4, 5];

  // Animation class for staggered tier appearance
  const getStaggeredAnimationClass = (index: number) => {
    return `animate-staggered-fade-${index + 1}`;
  };

  return (
    <div className="content-container">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {tiers.map((tier, index) => (
          <div
            key={tier}
            className={`tier-container tier-${tier} ${getStaggeredAnimationClass(index)}`}
          >
            <h2 className="tier-header text-center relative">
              Tier {tier}
              <div className={`absolute -bottom-2 left-0 w-full h-px bg-tier-${tier}/50`}></div>
            </h2>

            {/* High Tier Section */}
            <div className="mb-6">
              <h3 className="text-sm uppercase tracking-widest text-white/60 font-semibold mb-2">
                High Tier {tier}
              </h3>
              <div className="tier-section animate-glow-pulse">
                <p className="tier-placeholder">No players yet</p>
              </div>
            </div>

            {/* Low Tier Section */}
            <div>
              <h3 className="text-sm uppercase tracking-widest text-white/60 font-semibold mb-2">
                Low Tier {tier}
              </h3>
              <div className="tier-section animate-glow-pulse">
                <p className="tier-placeholder">No players yet</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
