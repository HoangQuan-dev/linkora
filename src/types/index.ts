export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  isActive: boolean;
  order: number;
}

export interface Profile {
  id: string;
  title: string;
  bio: string;
  avatarUrl: string;
  theme: Theme;
  links: LinkItem[];
  createdAt: string;
  updatedAt: string;
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
}

export interface LinkFormData {
  title: string;
  url: string;
  icon?: string;
}

export type ThemePreset = {
  name: string;
  theme: Theme;
};

// Predefined theme presets
export const THEME_PRESETS: ThemePreset[] = [
  {
    name: 'Ocean',
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
    theme: {
      primaryColor: '#6b7280',
      backgroundColor: '#ffffff',
      textColor: '#111827',
      cardColor: '#f9fafb',
      isDarkMode: false
    }
  }
]; 