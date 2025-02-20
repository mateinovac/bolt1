import React, { useState } from 'react';
import { Brain, BrainCircuit as Circuit, Cpu, ShieldOff, PartyPopper, ChevronDown } from 'lucide-react';
import { Model, MODELS, ModelType } from '../types/models';
import { ChatMode } from '../utils/config';
import { usePremiumStatus } from '../hooks/usePremiumStatus';
import { toast } from '../utils/toast';

interface ModelSelectorProps {
  currentMode: ChatMode;
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
}

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Brain':
      return Brain;
    case 'Circuit':
      return Circuit;
    case 'Cpu':
      return Cpu;
    case 'ShieldOff':
      return ShieldOff;
    case 'PartyPopper':
      return PartyPopper;
    default:
      return Cpu;
  }
};

export function ModelSelector({ currentMode, selectedModel, onModelChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isPremium, loading: premiumLoading } = usePremiumStatus();

  const availableModels = Object.values(MODELS).filter(
    model => model.mode === currentMode
  );

  const selectedModelData = MODELS[selectedModel];
  const IconComponent = getIconComponent(selectedModelData.icon);

  const handleModelSelect = (model: ModelType) => {
    onModelChange(model);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-all duration-300 rounded-md hover:bg-gray-800 relative group"
      >
        <IconComponent className="w-4 h-4" />
        <span className="hidden sm:inline">{selectedModelData.name}</span>
        <ChevronDown className="w-4 h-4" />
        <div className="absolute inset-0 rounded-md transition-colors duration-300 bg-violet-500/10 group-hover:bg-violet-500/20 -z-10" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1 w-64 bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 z-50">
            {availableModels.map((model) => {
              const Icon = getIconComponent(model.icon);
              return (
                <button
                  key={model.id}
                  onClick={() => handleModelSelect(model.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-left transition-colors ${
                    model.id === selectedModel
                      ? 'bg-violet-500/10 text-violet-300'
                      : 'text-gray-300 hover:bg-violet-500/10'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-medium truncate">{model.name}</div>
                    <div className="text-xs text-gray-400 truncate flex items-center gap-1">
                      {model.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
