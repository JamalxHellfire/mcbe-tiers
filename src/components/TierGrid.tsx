
import React from 'react';

export function TierGrid() {
  // Array of 5 tiers
  const tiers = [1, 2, 3, 4, 5];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
        {tiers.map((tier, index) => (
          <div
            key={tier}
            className={`tier-container tier-${tier} border rounded-lg p-4 bg-dark-surface animate-fade-in`}
            style={{ animationDelay: `${0.2 + index * 0.1}s` }}
          >
            <h2 className="tier-header text-center relative">
              Tier {tier}
              <div className={`absolute -bottom-2 left-0 w-full h-px bg-tier-${tier}/50`}></div>
            </h2>

            {/* High Tier Section */}
            <div className="mb-4">
              <h3 className="text-sm uppercase text-white/60 font-semibold mb-2">
                High Tier {tier}
              </h3>
              <div className="tier-section">
                <p className="tier-placeholder">No players yet</p>
              </div>
            </div>

            {/* Low Tier Section */}
            <div>
              <h3 className="text-sm uppercase text-white/60 font-semibold mb-2">
                Low Tier {tier}
              </h3>
              <div className="tier-section">
                <p className="tier-placeholder">No players yet</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
