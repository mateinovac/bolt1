export const WEBHOOK_URLS = {
  safe: 'https://host.vreausacopiez.com/webhook/677ff2ff-2a32-47ae-9f03-293270de7338v5y',
  safe_1_5: 'https://host.vreausacopiez.com/webhook/677ff2ff-2a32-47ae-9f03-293270de7338v5y',
  uncensored: 'https://host.vreausacopiez.com/webhook/da038d63-5461-4952-afb8-676d00d015f041111111115641',
  funny: 'https://host.vreausacopiez.com/webhook/da038d63-5461-4952-afb8-676d00d015f041111111115641'
} as const;

export type ChatMode = keyof typeof WEBHOOK_URLS;

// Network configuration
export const NETWORK_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  TIMEOUT: 600000, // 10 minutes
  KEEP_ALIVE_TIMEOUT: 600 // 10 minutes
} as const;

export const MODE_METADATA = {
  safe: {
    label: 'Safe Mode',
    description: 'Standard AI responses with content filtering',
    icon: 'Shield',
    bgClass: 'bg-violet-500/10',
    hoverBgClass: 'hover:bg-violet-500/20',
    textClass: 'text-violet-300'
  },
  uncensored: {
    label: 'Uncensored Mode',
    description: 'Unrestricted AI responses without filtering',
    icon: 'ShieldOff',
    bgClass: 'bg-red-500/10',
    hoverBgClass: 'hover:bg-red-500/20',
    textClass: 'text-red-300'
  },
  funny: {
    label: 'Funny Mode',
    description: 'Humorous and entertaining responses',
    icon: 'Laugh',
    bgClass: 'bg-yellow-500/10',
    hoverBgClass: 'hover:bg-yellow-500/20',
    textClass: 'text-yellow-300'
  }
} as const;
