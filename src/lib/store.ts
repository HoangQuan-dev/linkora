import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Profile, LinkItem, Theme, THEME_PRESETS } from '@/types';

interface ProfileStore {
  // State
  profile: Profile;
  isLoading: boolean;
  
  // Profile actions
  updateProfile: (updates: Partial<Pick<Profile, 'title' | 'bio' | 'avatarUrl'>>) => void;
  updateTheme: (theme: Partial<Theme>) => void;
  setThemePreset: (presetName: string) => void;
  
  // Link actions
  addLink: (link: Omit<LinkItem, 'id' | 'order'>) => void;
  updateLink: (id: string, updates: Partial<LinkItem>) => void;
  deleteLink: (id: string) => void;
  reorderLinks: (startIndex: number, endIndex: number) => void;
  toggleLinkActive: (id: string) => void;
  
  // Utility actions
  resetProfile: () => void;
  generateShareableUrl: () => string;
}

const defaultProfile: Profile = {
  id: crypto.randomUUID(),
  title: 'Your Name',
  bio: 'Welcome to my link in bio page!',
  avatarUrl: '',
  theme: THEME_PRESETS[0].theme, // Ocean theme by default
  links: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      isLoading: false,
      
      updateProfile: (updates) => 
        set((state) => ({
          profile: {
            ...state.profile,
            ...updates,
            updatedAt: new Date().toISOString(),
          },
        })),
      
      updateTheme: (theme) =>
        set((state) => ({
          profile: {
            ...state.profile,
            theme: { ...state.profile.theme, ...theme },
            updatedAt: new Date().toISOString(),
          },
        })),
      
      setThemePreset: (presetName) => {
        const preset = THEME_PRESETS.find(p => p.name === presetName);
        if (preset) {
          set((state) => ({
            profile: {
              ...state.profile,
              theme: preset.theme,
              updatedAt: new Date().toISOString(),
            },
          }));
        }
      },
      
      addLink: (linkData) => {
        const newLink: LinkItem = {
          ...linkData,
          id: crypto.randomUUID(),
          order: get().profile.links.length,
          isActive: true,
        };
        
        set((state) => ({
          profile: {
            ...state.profile,
            links: [...state.profile.links, newLink],
            updatedAt: new Date().toISOString(),
          },
        }));
      },
      
      updateLink: (id, updates) =>
        set((state) => ({
          profile: {
            ...state.profile,
            links: state.profile.links.map((link) =>
              link.id === id ? { ...link, ...updates } : link
            ),
            updatedAt: new Date().toISOString(),
          },
        })),
      
      deleteLink: (id) =>
        set((state) => ({
          profile: {
            ...state.profile,
            links: state.profile.links
              .filter((link) => link.id !== id)
              .map((link, index) => ({ ...link, order: index })),
            updatedAt: new Date().toISOString(),
          },
        })),
      
      reorderLinks: (startIndex, endIndex) => {
        const { links } = get().profile;
        const result = Array.from(links);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        
        // Update order property
        const reorderedLinks = result.map((link, index) => ({
          ...link,
          order: index,
        }));
        
        set((state) => ({
          profile: {
            ...state.profile,
            links: reorderedLinks,
            updatedAt: new Date().toISOString(),
          },
        }));
      },
      
      toggleLinkActive: (id) =>
        set((state) => ({
          profile: {
            ...state.profile,
            links: state.profile.links.map((link) =>
              link.id === id ? { ...link, isActive: !link.isActive } : link
            ),
            updatedAt: new Date().toISOString(),
          },
        })),
      
      resetProfile: () => set({ profile: { ...defaultProfile, id: crypto.randomUUID() } }),
      
      generateShareableUrl: () => {
        if (typeof window !== 'undefined') {
          const baseUrl = window.location.origin;
          return `${baseUrl}/profile/${get().profile.id}`;
        }
        return '';
      },
    }),
    {
      name: 'linkora-profile',
      partialize: (state) => ({ profile: state.profile }),
    }
  )
); 