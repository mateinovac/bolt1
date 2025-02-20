import { useState, useEffect } from 'react';

const THINKING_PHRASES = [
  'Initializing',
  'Calculating Probabilities',
  'Searching',
  'Thinking',
  'Generating',
  'Working on Details',
  'Analyzing Data',
  'Processing Information',
  'Evaluating Results',
  'Finalizing',
  'Compiling Results',
  'Formulating Response',
  'Constructing Ideas'
];

export function ThinkingAnimation() {
  const [currentPhrase, setCurrentPhrase] = useState(THINKING_PHRASES[0]);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % THINKING_PHRASES.length;
      setCurrentPhrase(THINKING_PHRASES[currentIndex]);
    }, 2000); // Change phrase every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 p-4">
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce-1" />
        <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce-2" />
        <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce-3" />
      </div>
      <div className="min-w-[140px]">
        <div className="text-sm text-violet-400 transition-all duration-300 animate-fade-in">
          {currentPhrase}
        </div>
      </div>
    </div>
  );
}
