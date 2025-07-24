export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  isActive: boolean;
  order: number;
  // Analytics
  clickCount?: number;
  lastClicked?: string;
  // Monetization
  isPaid?: boolean;
  price?: number;
  isAffiliate?: boolean;
  affiliateCode?: string;
}

export interface Profile {
  id: string;
  userId?: string; // For authenticated users
  username?: string; // For custom URLs
  title: string;
  bio: string;
  avatarUrl: string;
  theme: Theme;
  links: LinkItem[];
  createdAt: string;
  updatedAt: string;
  // Analytics
  totalViews?: number;
  totalClicks?: number;
  // Customization
  customDomain?: string;
  isPublic: boolean;
  // Monetization
  isPremium?: boolean;
  subscriptionTier?: 'free' | 'pro' | 'business';
}

export interface Theme {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  cardColor: string;
  isDarkMode: boolean;
  backgroundGradient?: {
    from: string;
    to: string;
    direction: 'to-r' | 'to-br' | 'to-b' | 'to-bl' | 'to-l' | 'to-tl' | 'to-t' | 'to-tr';
  };
}

export interface ProfileFormData {
  title: string;
  bio: string;
  avatarUrl: string;
  username?: string;
  customDomain?: string;
}

export interface LinkFormData {
  title: string;
  url: string;
  icon?: string;
  isPaid?: boolean;
  price?: number;
  isAffiliate?: boolean;
  affiliateCode?: string;
}

export type ThemePreset = {
  name: string;
  theme: Theme;
  category?: 'free' | 'premium';
};

// User authentication types
export interface User {
  id: string;
  email: string;
  username?: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  subscriptionTier: 'free' | 'pro' | 'business';
  subscriptionStatus: 'active' | 'inactive' | 'cancelled';
  profiles: Profile[];
}

// Analytics types
export interface Analytics {
  profileId: string;
  totalViews: number;
  totalClicks: number;
  linkStats: {
    [linkId: string]: {
      clicks: number;
      lastClicked?: string;
    };
  };
  dailyStats: {
    [date: string]: {
      views: number;
      clicks: number;
    };
  };
}

// Payment types
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  maxProfiles: number;
  maxLinks: number;
  customDomains: boolean;
  analytics: boolean;
  premiumThemes: boolean;
}

// QR Code types
export interface QRCodeData {
  url: string;
  size: number;
  color: string;
  backgroundColor: string;
}

// Predefined theme presets
export const THEME_PRESETS: ThemePreset[] = [
  {
    name: 'Ocean',
    category: 'free',
    theme: {
      primaryColor: '#0ea5e9',
      backgroundColor: '#f0f9ff',
      textColor: '#0f172a',
      cardColor: '#ffffff',
      isDarkMode: false,
      backgroundGradient: {
        from: '#f0f9ff',
        to: '#e0f2fe',
        direction: 'to-br'
      }
    }
  },
  {
    name: 'Sunset',
    category: 'free',
    theme: {
      primaryColor: '#f59e0b',
      backgroundColor: '#fef3c7',
      textColor: '#0f172a',
      cardColor: '#ffffff',
      isDarkMode: false,
      backgroundGradient: {
        from: '#fef3c7',
        to: '#fed7aa',
        direction: 'to-br'
      }
    }
  },
  {
    name: 'Forest',
    category: 'free',
    theme: {
      primaryColor: '#10b981',
      backgroundColor: '#ecfdf5',
      textColor: '#0f172a',
      cardColor: '#ffffff',
      isDarkMode: false,
      backgroundGradient: {
        from: '#ecfdf5',
        to: '#d1fae5',
        direction: 'to-br'
      }
    }
  },
  {
    name: 'Dark Mode',
    category: 'free',
    theme: {
      primaryColor: '#8b5cf6',
      backgroundColor: '#0f0f23',
      textColor: '#f8fafc',
      cardColor: '#1e1e2e',
      isDarkMode: true,
      backgroundGradient: {
        from: '#0f0f23',
        to: '#1a1a2e',
        direction: 'to-br'
      }
    }
  },
  {
    name: 'Minimal',
    category: 'free',
    theme: {
      primaryColor: '#6b7280',
      backgroundColor: '#ffffff',
      textColor: '#111827',
      cardColor: '#f9fafb',
      isDarkMode: false
    }
  },
  // Premium themes
  {
    name: 'Neon',
    category: 'premium',
    theme: {
      primaryColor: '#00ff88',
      backgroundColor: '#0a0a0a',
      textColor: '#ffffff',
      cardColor: '#1a1a1a',
      isDarkMode: true,
      backgroundGradient: {
        from: '#0a0a0a',
        to: '#1a1a1a',
        direction: 'to-br'
      }
    }
  },
  {
    name: 'Aurora',
    category: 'premium',
    theme: {
      primaryColor: '#ff6b9d',
      backgroundColor: '#667eea',
      textColor: '#ffffff',
      cardColor: '#ffffff',
      isDarkMode: false,
      backgroundGradient: {
        from: '#667eea',
        to: '#764ba2',
        direction: 'to-br'
      }
    }
  },
  {
    name: 'Midnight',
    category: 'premium',
    theme: {
      primaryColor: '#6366f1',
      backgroundColor: '#0f172a',
      textColor: '#f8fafc',
      cardColor: '#1e293b',
      isDarkMode: true,
      backgroundGradient: {
        from: '#0f172a',
        to: '#1e293b',
        direction: 'to-br'
      }
    }
  }
];

// Subscription plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      '1 profile',
      '10 links',
      'Basic themes',
      'Basic analytics'
    ],
    maxProfiles: 1,
    maxLinks: 10,
    customDomains: false,
    analytics: false,
    premiumThemes: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    interval: 'month',
    features: [
      '5 profiles',
      'Unlimited links',
      'Premium themes',
      'Advanced analytics',
      'QR codes',
      'Custom domains'
    ],
    maxProfiles: 5,
    maxLinks: -1, // Unlimited
    customDomains: true,
    analytics: true,
    premiumThemes: true
  },
  {
    id: 'business',
    name: 'Business',
    price: 29.99,
    interval: 'month',
    features: [
      'Unlimited profiles',
      'Unlimited links',
      'All themes',
      'Advanced analytics',
      'QR codes',
      'Custom domains',
      'Team collaboration',
      'Priority support'
    ],
    maxProfiles: -1, // Unlimited
    maxLinks: -1, // Unlimited
    customDomains: true,
    analytics: true,
    premiumThemes: true
  }
]; 