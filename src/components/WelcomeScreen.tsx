import React, { useState } from 'react';
import { Image, FileText, PenLine, Video, Music, Lightbulb, Globe, ChevronDown, ChevronUp, Presentation } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { MobileWelcomeScreen } from './mobile/MobileWelcomeScreen';

interface WelcomeScreenProps {
  onOptionClick: (text: string) => void;
}

const CAPABILITIES = [
  { id: 'image', icon: Image, label: 'Generate Image', color: 'violet', prompt: 'Generate an image about' },
  { id: 'pptx', icon: Presentation, label: 'Create PPTX', color: 'blue', prompt: 'Generate a PPTX about' },
  { id: 'essay', icon: PenLine, label: 'Write Essay', color: 'emerald', prompt: 'Generate an essay about' },
  { id: 'video', icon: Video, label: 'Generate Video', color: 'red', prompt: 'Generate a video about' },
  { id: 'doc', icon: FileText, label: 'Generate Doc', color: 'cyan', prompt: 'Generate a document about' },
  { id: 'music', icon: Music, label: 'Generate Music', color: 'pink', prompt: 'Generate music about' },
  { id: 'ideas', icon: Lightbulb, label: 'Brainstorm Ideas', color: 'yellow', prompt: 'Brainstorm ideas about' },
  { id: 'browse', icon: Globe, label: 'Browse the Net', color: 'indigo', prompt: 'Search the web for' }
];

export function WelcomeScreen({ onOptionClick }: WelcomeScreenProps) {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const [showAll, setShowAll] = useState(false);
  const visibleCapabilities = showAll ? CAPABILITIES : CAPABILITIES.slice(0, 3);

  if (isMobile) {
    return <MobileWelcomeScreen onOptionClick={onOptionClick} />;
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-start gap-8 p-4 pt-32 animate-in fade-in duration-500">
      <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">
        How can I help you today?
      </h1>
      
      <div className="space-y-6 max-w-3xl w-full">
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 transition-all duration-300 ${
          showAll ? 'md:grid-cols-4' : ''
        } bg-gray-900/90 backdrop-blur-sm p-4 rounded-xl border border-gray-800/50 shadow-xl max-w-3xl mx-auto`}>
          {visibleCapabilities.map(({ id, icon: Icon, label, color, prompt }) => (
          <button
            key={id}
            onClick={() => onOptionClick(prompt)}
            className={`group flex flex-col items-center gap-3 p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm cursor-pointer
                       hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105
                       ${color === 'violet' ? 'hover:border-violet-500/50' : 
                         color === 'blue' ? 'hover:border-blue-500/50' : 
                          color === 'emerald' ? 'hover:border-emerald-500/50' :
                          color === 'red' ? 'hover:border-red-500/50' :
                          color === 'cyan' ? 'hover:border-cyan-500/50' :
                          color === 'pink' ? 'hover:border-pink-500/50' :
                          color === 'yellow' ? 'hover:border-yellow-500/50' :
                          'hover:border-indigo-500/50'}`}
          >
            <div className={`p-4 rounded-lg transition-colors duration-300
                           ${color === 'violet' ? 'bg-violet-500/10 group-hover:bg-violet-500/20' :
                             color === 'blue' ? 'bg-blue-500/10 group-hover:bg-blue-500/20' :
                              color === 'emerald' ? 'bg-emerald-500/10 group-hover:bg-emerald-500/20' :
                              color === 'red' ? 'bg-red-500/10 group-hover:bg-red-500/20' :
                              color === 'cyan' ? 'bg-cyan-500/10 group-hover:bg-cyan-500/20' :
                              color === 'pink' ? 'bg-pink-500/10 group-hover:bg-pink-500/20' :
                              color === 'yellow' ? 'bg-yellow-500/10 group-hover:bg-yellow-500/20' :
                              'bg-indigo-500/10 group-hover:bg-indigo-500/20'}`}>
              <Icon className={`w-8 h-8
                              ${color === 'violet' ? 'text-violet-400' :
                                color === 'blue' ? 'text-blue-400' :
                                 color === 'emerald' ? 'text-emerald-400' :
                                 color === 'red' ? 'text-red-400' :
                                 color === 'cyan' ? 'text-cyan-400' :
                                 color === 'pink' ? 'text-pink-400' :
                                 color === 'yellow' ? 'text-yellow-400' :
                                 'text-indigo-400'}`} />
            </div>
            <span className="text-sm font-medium text-gray-200 text-center">{label}</span>
          </button>
          ))}
        </div>
        
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center justify-center gap-2 px-4 py-2 mx-auto text-sm text-gray-400 hover:text-violet-400 transition-colors"
        >
          {showAll ? (
            <>
              <ChevronUp className="w-4 h-4" />
              <span>Show Less</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              <span>Show More Capabilities</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
