import { useState, useCallback } from 'react';
import { ChatMode } from '../utils/config';

export function useChatMode() {
  const [mode, setMode] = useState<ChatMode>('safe');

  const handleModeChange = useCallback((newMode: ChatMode) => {
    setMode(newMode);
  }, []);

  return {
    mode,
    handleModeChange
  };
}
