import React, { useState, useCallback } from 'react';
import { Phone, TabletSmartphone } from 'lucide-react';
import { ImagePreviewModal } from '../../ImagePreviewModal';

type DeviceType = 'iphone' | 'android';

export function InstallAppTab() {
  const [activeDevice, setActiveDevice] = useState<DeviceType>('iphone');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageClick = useCallback((imageUrl: string, e: React.MouseEvent) => {
    e.preventDefault();
    setPreviewImage(imageUrl);
  }, []);

  const deviceContent = {
    iphone: {
      title: 'Install on iPhone',
      steps: [
        'Open the website in Safari',
        'Tap the Share button (square with an arrow)',
        'Scroll down and select "Add to Home Screen"',
        'Edit the name (optional) and tap Add'
      ],
      image: 'https://www.lifewire.com/thmb/8_COeDD7THpmO9QtShBSv7PvuFc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/MakeSafariBookmark-9eff4fc5264546418637785165ae8541.jpg'
    },
    android: {
      title: 'Install on Android',
      steps: [
        'Open the website in Chrome',
        'Tap the three dots menu (top-right corner)',
        'Select "Add to Home Screen"',
        'Confirm by clicking Add'
      ],
      image: 'https://www.slashgear.com/img/gallery/how-to-add-website-shortcuts-to-your-android-phones-home-screen/add-website-shortcuts-to-your-android-home-screen-1695804341.jpg'
    },
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Install App</h3>
        <p className="text-gray-400 mb-6">
          Install Cheat Copy on your device for quick access and a better experience.
        </p>
      </div>

      {/* Device Selection Tabs */}
      <div className="flex gap-2 p-1 bg-gray-800/50 rounded-lg backdrop-blur-sm">
        {[
          { type: 'iphone', icon: Phone, label: 'iPhone' },
          { type: 'android', icon: TabletSmartphone, label: 'Android' }
        ].map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => setActiveDevice(type as DeviceType)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeDevice === type
                ? 'bg-violet-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Tutorial Content */}
      <div className="bg-gray-800/50 rounded-lg p-6 space-y-6 backdrop-blur-sm border border-gray-700/50">
        <h4 className="text-xl font-semibold text-white">
          {deviceContent[activeDevice].title}
        </h4>
        
        <ol className="space-y-4">
          {deviceContent[activeDevice].steps.map((step, index) => (
            <li key={index} className="flex gap-3 text-gray-300">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-sm">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        {/* Tutorial Image */}
        <div className="mt-6">
          <div className="relative group">
            <img
              src={deviceContent[activeDevice].image}
              alt={`${deviceContent[activeDevice].title} tutorial`}
              className="w-full rounded-lg shadow-lg cursor-zoom-in transition-all duration-300 group-hover:brightness-90"
              onClick={(e) => handleImageClick(deviceContent[activeDevice].image, e)}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2 text-center">
            Click image to view full size
          </p>
        </div>
      </div>
      
      {previewImage && (
        <ImagePreviewModal
          imageUrl={previewImage}
          alt={`${deviceContent[activeDevice].title} tutorial`}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </div>
  );
}
