import React, { useState } from 'react';
import { AccountTab } from './tabs/AccountTab';
import { UsageTab } from './tabs/UsageTab';
import { PlanTab } from './tabs/PlanTab';
import { InstallAppTab } from './tabs/InstallAppTab';
import { AboutTab } from './tabs/AboutTab';

type TabId = 'account' | 'usage' | 'plan' | 'install' | 'about';

const TABS = [
  { id: 'account' as TabId, label: 'Account' },
  { id: 'plan' as TabId, label: 'Plan' },
  { id: 'install' as TabId, label: 'Install App' },
  { id: 'about' as TabId, label: 'About' }
];

export function SettingsTabs() {
  const [activeTab, setActiveTab] = useState<TabId>('account');

  return (
    <div>
      <div className="border-b border-gray-800">
        <nav className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent pb-2">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors relative whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-violet-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-400" />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="py-4 overflow-y-auto max-h-[calc(90vh-8rem)] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {activeTab === 'account' && <AccountTab />}
        {activeTab === 'plan' && <PlanTab />}
        {activeTab === 'install' && <InstallAppTab />}
        {activeTab === 'about' && <AboutTab />}
      </div>
    </div>
  );
}
