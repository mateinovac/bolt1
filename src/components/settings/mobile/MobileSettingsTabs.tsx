import React from 'react';
import { TabType } from '../types';
import { 
  User, Activity, CreditCard, Info,
  ChevronRight, Download
} from 'lucide-react';

interface MobileSettingsTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function MobileSettingsTabs({ activeTab, onTabChange }: MobileSettingsTabsProps) {
  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'plan', label: 'Plan', icon: CreditCard },
    { id: 'install', label: 'Install App', icon: Download }
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-2">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
            activeTab === id
              ? 'bg-violet-500/20 text-violet-300'
              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      ))}
    </div>
  );
}
