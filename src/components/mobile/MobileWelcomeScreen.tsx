import React, { useState } from 'react';
import { Image, FileText, PenLine, Video, Music, Lightbulb, Globe, ChevronDown, ChevronUp, Presentation } from 'lucide-react';

interface MobileWelcomeScreenProps {
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

export function MobileWelcomeScreen({ onOptionClick }: MobileWelcomeScreenProps) {
  const [showAll, setShowAll] = useState(false);
  const visibleCapabilities = showAll ? CAPABILITIES : CAPABILITIES.slice(0, 4);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-start gap-6 p-4 pt-20 animate-in fade-in duration-500">
      <h1 className="text-xl font-bold text-white text-center px-4">
        How can I help you today?
      </h1>
      
      <div className="space-y-4 w-full max-w-sm">
        <div className="grid grid-cols-2 gap-3 transition-all duration-300 bg-gray-900/90 backdrop-blur-sm p-3 rounded-xl border border-gray-800/50 shadow-xl">
          {visibleCapabilities.map(({ id, icon: Icon, label, color, prompt }) => (
            <button
              key={id}
              onClick={() => onOptionClick(prompt)}
              className={`group flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm
                         hover:bg-gray-700/50 transition-all duration-300 active:scale-95
                         ${color === 'violet' ? 'hover:border-violet-500/50' : 
                          color === 'blue' ? 'hover:border-blue-500/50' : 
                           color === 'emerald' ? 'hover:border-emerald-500/50' :
                           color === 'red' ? 'hover:border-red-500/50' :
                           color === 'cyan' ? 'hover:border-cyan-500/50' :
                           color === 'pink' ? 'hover:border-pink-500/50' :
                           color === 'yellow' ? 'hover:border-yellow-500/50' :
                           'hover:border-indigo-500/50'}`}
            >
              <div className={`p-2 rounded-lg transition-colors duration-300
                             ${color === 'violet' ? 'bg-violet-500/10 group-hover:bg-violet-500/20' :
                               color === 'blue' ? 'bg-blue-500/10 group-hover:bg-blue-500/20' :
                               color === 'emerald' ? 'bg-emerald-500/10 group-hover:bg-emerald-500/20' :
                               color === 'red' ? 'bg-red-500/10 group-hover:bg-red-500/20' :
                               color === 'cyan' ? 'bg-cyan-500/10 group-hover:bg-cyan-500/20' :
                               color === 'pink' ? 'bg-pink-500/10 group-hover:bg-pink-500/20' :
                               color === 'yellow' ? 'bg-yellow-500/10 group-hover:bg-yellow-500/20' :
                               'bg-indigo-500/10 group-hover:bg-indigo-500/20'}`}>
                <Icon className={`w-5 h-5
                                ${color === 'violet' ? 'text-violet-400' :
                                  color === 'blue' ? 'text-blue-400' :
                                  color === 'emerald' ? 'text-emerald-400' :
                                  color === 'red' ? 'text-red-400' :
                                  color === 'cyan' ? 'text-cyan-400' :
                                  color === 'pink' ? 'text-pink-400' :
                                  color === 'yellow' ? 'text-yellow-400' :
                                  'text-indigo-400'}`} />
              </div>
              <span className="text-xs font-medium text-gray-200 text-center">{label}</span>
            </button>
          ))}
        </div>
        
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 mx-auto text-xs text-gray-400 hover:text-violet-400 transition-colors"
        >
          {showAll ? (
            <>
              <ChevronUp className="w-3 h-3" />
              <span>Show Less</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" />
              <span>Show More</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
