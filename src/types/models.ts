export type ModelType = 
  | 'cheat-copy-1.5'
  | 'cheat-copy-2.0'
  | 'cheat-copy-uncensored'
  | 'cheat-copy-funny';

export interface Model {
  id: ModelType;
  name: string;
  description: string;
  icon: string;
  mode: 'safe' | 'uncensored' | 'funny';
}

export const MODELS: Record<ModelType, Model> = {
  'cheat-copy-1.5': {
    id: 'cheat-copy-1.5',
    name: 'Cheat Copy 4.0 Basic',
    description: 'Balanced performance and speed',
    icon: 'Cpu',
    mode: 'safe'
  },
  'cheat-copy-2.0': {
    id: 'cheat-copy-2.0',
    name: 'Cheat Copy 4.0 Thinking',
    description: 'Advanced reasoning and understanding (Free)',
    icon: 'Circuit',
    mode: 'safe'
  },
  'cheat-copy-uncensored': {
    id: 'cheat-copy-uncensored',
    name: 'Cheat Copy Uncensored',
    description: 'Unrestricted responses',
    icon: 'ShieldOff',
    mode: 'uncensored'
  },
  'cheat-copy-funny': {
    id: 'cheat-copy-funny',
    name: 'Cheat Copy Funny',
    description: 'Humorous and entertaining responses',
    icon: 'PartyPopper',
    mode: 'funny'
  }
};
