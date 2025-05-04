
import React from 'react';
import { Grid2x2, LayoutList } from 'lucide-react';

export function TierGrid() {
  // Array of 5 tiers
  const tiers = [1, 2, 3, 4, 5];

  // Animation class for staggered tier appearance
  const getStaggeredAnimationClass = (index: number) => {
    return `animate-staggered-fade-${index + 1}`;
  };

  return (
    <div className="content-container">
      <div className="grid grid-cols-1 gap-8">
        {tiers.map((tier, index) => (
          <div
            key={tier}
            className={`tier-row tier-${tier} ${getStaggeredAnimationClass(index)}`}
          >
            <h2 className="tier-header text-2xl md:text-3xl relative mb-6">
              Tier {tier}
              <div className={`absolute -bottom-3 left-0 w-full h-1 bg-tier-${tier}`}></div>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* High Tier Section */}
              <div className="tier-section-container">
                <h3 className="text-sm uppercase tracking-widest text-white/70 font-semibold mb-3 flex items-center">
                  <Grid2x2 className="mr-2 opacity-70" size={16} />
                  High Tier {tier}
                </h3>
                <div className="tier-section h-full animate-glow-pulse">
                  <p className="tier-placeholder">No players yet</p>
                </div>
              </div>

              {/* Low Tier Section */}
              <div className="tier-section-container">
                <h3 className="text-sm uppercase tracking-widest text-white/70 font-semibold mb-3 flex items-center">
                  <LayoutList className="mr-2 opacity-70" size={16} />
                  Low Tier {tier}
                </h3>
                <div className="tier-section h-full animate-glow-pulse">
                  <p className="tier-placeholder">No players yet</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
