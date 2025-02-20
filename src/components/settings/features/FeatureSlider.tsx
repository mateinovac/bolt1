import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { features } from './FeatureData';
import { FeatureCard } from './FeatureCard';

export function FeatureSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const totalFeatures = features.length;

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % totalFeatures);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + totalFeatures) % totalFeatures);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <div className="relative px-12">
      <div className="overflow-hidden">
        <div
          className={`transition-all duration-500 ease-in-out ${
            isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          <FeatureCard feature={features[currentIndex]} />
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        disabled={isAnimating}
        className="absolute left-0 top-1/2 -translate-y-1/2 p-3 bg-violet-500 text-white rounded-full shadow-lg hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        aria-label="Previous feature"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        disabled={isAnimating}
        className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-violet-500 text-white rounded-full shadow-lg hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        aria-label="Next feature"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-violet-500 w-6'
                : 'bg-gray-600 hover:bg-violet-400'
            }`}
            aria-label={`Go to feature ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
