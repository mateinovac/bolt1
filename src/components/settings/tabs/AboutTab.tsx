import React from 'react';
import { FeatureSlider } from '../features/FeatureSlider';

export function AboutTab() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Cheat Copy Features</h2>
        <p className="text-gray-400">Discover our powerful AI capabilities</p>
      </div>

      <FeatureSlider />
    </div>
  );
}
