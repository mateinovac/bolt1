import React from 'react';
import { Feature } from './FeatureData';

interface FeatureCardProps {
  feature: Feature;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  const Icon = feature.icon;
  
  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700/50 hover:border-violet-500/50 transition-all transform hover:scale-105">
      <div className="p-6 bg-violet-500/20 rounded-xl group-hover:bg-violet-500/30 transition-colors">
        <Icon className="w-12 h-12 text-violet-400" />
      </div>
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-white mb-4">
          {feature.title}
        </h3>
        <p className="text-lg text-gray-400 max-w-md mx-auto">
          {feature.description}
        </p>
      </div>
    </div>
  );
}
