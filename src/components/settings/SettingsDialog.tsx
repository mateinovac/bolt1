import React, { useState } from 'react';
import { X } from 'lucide-react';
import { MobileSettingsTabs } from './mobile/MobileSettingsTabs';
import { MobileSettingsView } from './mobile/MobileSettingsView';
import { TabType } from './types';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { SettingsTabs } from './SettingsTabs';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<TabType>('account');
  const [showTabContent, setShowTabContent] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (!isOpen) return null;

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setShowTabContent(true);
  };

  const handleBack = () => {
    setShowTabContent(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center md:p-4">
      <div className="bg-gray-900 w-full h-full md:h-auto md:max-h-[90vh] md:max-w-2xl md:rounded-lg shadow-lg flex flex-col animate-in fade-in duration-200">
        {isMobile ? (
          showTabContent ? (
            <MobileSettingsView
              activeTab={activeTab}
              onBack={handleBack}
              onClose={onClose}
            />
          ) : (
            <>
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <h2 className="text-xl font-semibold text-white">Settings</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <MobileSettingsTabs
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                />
              </div>
            </>
          )
        ) : (
          <>
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white">Settings</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-4">
              <SettingsTabs />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
