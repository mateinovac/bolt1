import React from 'react';
import { TabType } from '../types';
import { X, ArrowLeft } from 'lucide-react';
import { AccountTab } from '../tabs/AccountTab';
import { PlanTab } from '../tabs/PlanTab';
import { InstallAppTab } from '../tabs/InstallAppTab';
import { AboutTab } from '../tabs/AboutTab';

interface MobileSettingsViewProps {
  activeTab: TabType;
  onBack: () => void;
  onClose: () => void;
}

export function MobileSettingsView({ activeTab, onBack, onClose }: MobileSettingsViewProps) {
  const getTabContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountTab />;
      case 'plan':
        return <PlanTab />;
      case 'install':
        return <InstallAppTab />;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'account':
        return 'Account';
      case 'plan':
        return 'Plan';
      case 'install':
        return 'Install App';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold text-white">{getTabTitle()}</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {getTabContent()}
      </div>
    </div>
  );
}
