import React, { useState } from 'react';
import { Settings, ChevronDown, Shield, ShieldOff, History, Laugh, PlusCircle, Bot } from 'lucide-react';
import { ChatMode, MODE_METADATA } from '../utils/config';
import { ModelSelector } from './ModelSelector';
import { ModelType } from '../types/models';
import { SettingsDialog } from './settings/SettingsDialog';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { MODELS } from '../types/models';

export interface TopBarProps {
  currentMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
  onSidebarToggle: () => void;
  onNewChat: () => void;
}

export function TopBar({ 
  currentMode, 
  onModeChange, 
  selectedModel,
  onModelChange,
  onSidebarToggle,
  onNewChat
}: TopBarProps) {
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const metadata = MODE_METADATA[currentMode];
  const Icon = metadata.icon === 'Shield' ? Shield : 
               metadata.icon === 'ShieldOff' ? ShieldOff : 
               Laugh;

  const currentModelData = MODELS[selectedModel];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-14 px-3 sm:px-6 flex items-center justify-between z-[85]">
        <div className="flex items-center gap-2">
          <button
            onClick={onSidebarToggle}
            className="p-2 text-gray-400 hover:text-violet-400 transition-all duration-200 rounded-lg hover:bg-violet-500/10 hover:scale-105 active:scale-95"
            title="View chat history"
          >
            <History className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {isMobile ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShowModelDropdown(!showModelDropdown);
                  setShowModeDropdown(false);
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-300 hover:text-violet-400 transition-all duration-200 rounded-lg hover:bg-violet-500/10 hover:scale-105 active:scale-95"
              >
                <Bot className="w-4 h-4" />
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setShowModeDropdown(!showModeDropdown);
                  setShowModelDropdown(false);
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-300 hover:text-violet-400 transition-all duration-200 rounded-lg hover:bg-violet-500/10 hover:scale-105 active:scale-95"
              >
                <Icon className="w-4 h-4" />
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <ModelSelector
                currentMode={currentMode}
                selectedModel={selectedModel}
                onModelChange={onModelChange}
              />
              <button
                onClick={() => setShowModeDropdown(!showModeDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 hover:text-violet-400 transition-all duration-200 rounded-lg hover:bg-violet-500/10 relative group min-w-[120px] justify-between hover:scale-105 active:scale-95"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="capitalize truncate">{metadata.label}</span>
                </div>
                <ChevronDown className="w-4 h-4" />
                <div className={`absolute inset-0 rounded-md transition-colors duration-300 ${metadata.bgClass} group-hover:${metadata.hoverBgClass} -z-10`} />
              </button>
            </>
          )}

          <button
            onClick={onNewChat}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-300 hover:text-violet-400 transition-all duration-200 rounded-lg hover:bg-violet-500/10 hover:scale-105 active:scale-95"
            title="New Chat"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">New Chat</span>
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-gray-400 hover:text-violet-400 transition-all duration-200 rounded-lg hover:bg-violet-500/10 hover:scale-105 active:scale-95"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Model Dropdown for Mobile */}
        {showModelDropdown && isMobile && (
          <>
            <div 
              className="fixed inset-0 z-10"
              onClick={() => setShowModelDropdown(false)}
            />
            <div className="absolute right-0 top-full mt-1 w-64 bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 z-50">
              {Object.values(MODELS)
                .filter(model => model.mode === currentMode)
                .map(model => (
                  <button
                    key={model.id}
                    onClick={() => {
                      onModelChange(model.id);
                      setShowModelDropdown(false);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-violet-500/10 transition-all duration-200 ${
                      model.id === selectedModel
                        ? 'bg-violet-500/10 text-violet-300'
                        : 'text-gray-300'
                    }`}
                  >
                    <Bot className="w-4 h-4 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-medium truncate">{model.name}</div>
                      <div className="text-xs text-gray-400 truncate">
                        {model.description}
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </>
        )}

        {/* Mode Dropdown */}
        {showModeDropdown && (
          <>
            <div 
              className="fixed inset-0 z-10"
              onClick={() => setShowModeDropdown(false)}
            />
            <div className="absolute right-0 top-full mt-1 w-64 bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 z-50">
              {Object.entries(MODE_METADATA).map(([mode, data]) => {
                const ModeIcon = data.icon === 'Shield' ? Shield : 
                               data.icon === 'ShieldOff' ? ShieldOff : 
                               Laugh;
                return (
                  <button
                    key={mode}
                    onClick={() => {
                      onModeChange(mode as ChatMode);
                      setShowModeDropdown(false);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-violet-500/10 transition-all duration-200 ${
                      mode === currentMode
                        ? 'bg-violet-500/10 text-violet-300'
                        : 'text-gray-300'
                    }`}
                  >
                    <ModeIcon className="w-4 h-4 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-medium truncate">{data.label}</div>
                      <div className="text-xs text-gray-400 truncate">
                        {data.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      <SettingsDialog 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
}
