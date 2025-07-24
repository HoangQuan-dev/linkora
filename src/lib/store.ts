import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Profile, LinkItem, Theme, THEME_PRESETS, User, Analytics, SUBSCRIPTION_PLANS } from '@/types';

interface ProfileStore {
  // State
  user: User | null;
  currentProfile: Profile | null;
  profiles: Profile[];
  analytics: Analytics | null;
  isLoading: boolean;
  
  // User actions
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  
  // Profile actions
  setCurrentProfile: (profile: Profile) => void;
  updateProfile: (updates: Partial<Pick<Profile, 'title' | 'bio' | 'avatarUrl' | 'username' | 'customDomain'>>) => void;
  updateTheme: (theme: Partial<Theme>) => void;
  setThemePreset: (presetName: string) => void;
  createProfile: (profileData: Partial<Profile>) => void;
  deleteProfile: (profileId: string) => void;
  switchProfile: (profileId: string) => void;
  
  // Link actions
  addLink: (link: Omit<LinkItem, 'id' | 'order'>) => void;
  updateLink: (id: string, updates: Partial<LinkItem>) => void;
  deleteLink: (id: string) => void;
  reorderLinks: (startIndex: number, endIndex: number) => void;
  toggleLinkActive: (id: string) => void;
  
  // Analytics actions
  setAnalytics: (analytics: Analytics) => void;
  trackView: (profileId: string) => void;
  trackClick: (profileId: string, linkId: string) => void;
  
  // Utility actions
  resetStore: () => void;
  generateShareableUrl: () => string;
  generateUsernameUrl: () => string;
  canUseFeature: (feature: 'premiumThemes' | 'analytics' | 'qrCodes' | 'customDomains' | 'unlimitedLinks' | 'multipleProfiles') => boolean;
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
  isPublic: true,
  subscriptionTier: 'free'
};

const defaultUser: User = {
  id: '',
  email: '',
  username: '',
  fullName: '',
  avatarUrl: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  subscriptionTier: 'free',
  subscriptionStatus: 'active',
  profiles: []
};

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      user: null,
      currentProfile: defaultProfile,
      profiles: [defaultProfile],
      analytics: null,
      isLoading: false,
      
      setUser: (user) => set({ user }),
      
      updateUser: (updates) => 
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null
        })),
      
      setCurrentProfile: (profile) => set({ currentProfile: profile }),
      
      updateProfile: (updates) => 
        set((state) => ({
          currentProfile: state.currentProfile ? {
            ...state.currentProfile,
            ...updates,
            updatedAt: new Date().toISOString(),
          } : null,
          profiles: state.profiles.map(profile => 
            profile.id === state.currentProfile?.id 
              ? { ...profile, ...updates, updatedAt: new Date().toISOString() }
              : profile
          )
        })),
      
      updateTheme: (theme) =>
        set((state) => ({
          currentProfile: state.currentProfile ? {
            ...state.currentProfile,
            theme: { ...state.currentProfile.theme, ...theme },
            updatedAt: new Date().toISOString(),
          } : null,
          profiles: state.profiles.map(profile => 
            profile.id === state.currentProfile?.id 
              ? { ...profile, theme: { ...profile.theme, ...theme }, updatedAt: new Date().toISOString() }
              : profile
          )
        })),
      
      setThemePreset: (presetName) => {
        const preset = THEME_PRESETS.find(p => p.name === presetName);
        if (preset) {
          set((state) => ({
            currentProfile: state.currentProfile ? {
              ...state.currentProfile,
              theme: preset.theme,
              updatedAt: new Date().toISOString(),
            } : null,
            profiles: state.profiles.map(profile => 
              profile.id === state.currentProfile?.id 
                ? { ...profile, theme: preset.theme, updatedAt: new Date().toISOString() }
                : profile
            )
          }));
        }
      },
      
      createProfile: (profileData) => {
        const newProfile: Profile = {
          ...defaultProfile,
          ...profileData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          profiles: [...state.profiles, newProfile],
          currentProfile: newProfile
        }));
      },
      
      deleteProfile: (profileId) => {
        set((state) => {
          const filteredProfiles = state.profiles.filter(p => p.id !== profileId);
          const newCurrentProfile = state.currentProfile?.id === profileId 
            ? (filteredProfiles[0] || null)
            : state.currentProfile;
          
          return {
            profiles: filteredProfiles,
            currentProfile: newCurrentProfile
          };
        });
      },
      
      switchProfile: (profileId) => {
        set((state) => {
          const profile = state.profiles.find(p => p.id === profileId);
          return {
            currentProfile: profile || null
          };
        });
      },
      
      addLink: (linkData) => {
        const newLink: LinkItem = {
          ...linkData,
          id: crypto.randomUUID(),
          order: get().currentProfile?.links.length || 0,
          isActive: true,
        };
        
        set((state) => ({
          currentProfile: state.currentProfile ? {
            ...state.currentProfile,
            links: [...state.currentProfile.links, newLink],
            updatedAt: new Date().toISOString(),
          } : null,
          profiles: state.profiles.map(profile => 
            profile.id === state.currentProfile?.id 
              ? { ...profile, links: [...profile.links, newLink], updatedAt: new Date().toISOString() }
              : profile
          )
        }));
      },
      
      updateLink: (id, updates) =>
        set((state) => ({
          currentProfile: state.currentProfile ? {
            ...state.currentProfile,
            links: state.currentProfile.links.map((link) =>
              link.id === id ? { ...link, ...updates } : link
            ),
            updatedAt: new Date().toISOString(),
          } : null,
          profiles: state.profiles.map(profile => 
            profile.id === state.currentProfile?.id 
              ? { ...profile, links: profile.links.map(link => link.id === id ? { ...link, ...updates } : link), updatedAt: new Date().toISOString() }
              : profile
          )
        })),
      
      deleteLink: (id) =>
        set((state) => ({
          currentProfile: state.currentProfile ? {
            ...state.currentProfile,
            links: state.currentProfile.links
              .filter((link) => link.id !== id)
              .map((link, index) => ({ ...link, order: index })),
            updatedAt: new Date().toISOString(),
          } : null,
          profiles: state.profiles.map(profile => 
            profile.id === state.currentProfile?.id 
              ? { ...profile, links: profile.links.filter(link => link.id !== id).map((link, index) => ({ ...link, order: index })), updatedAt: new Date().toISOString() }
              : profile
          )
        })),
      
      reorderLinks: (startIndex, endIndex) => {
        const { currentProfile } = get();
        if (!currentProfile) return;
        
        const result = Array.from(currentProfile.links);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        
        const reorderedLinks = result.map((link, index) => ({
          ...link,
          order: index,
        }));
        
        set((state) => ({
          currentProfile: state.currentProfile ? {
            ...state.currentProfile,
            links: reorderedLinks,
            updatedAt: new Date().toISOString(),
          } : null,
          profiles: state.profiles.map(profile => 
            profile.id === state.currentProfile?.id 
              ? { ...profile, links: reorderedLinks, updatedAt: new Date().toISOString() }
              : profile
          )
        }));
      },
      
      toggleLinkActive: (id) =>
        set((state) => ({
          currentProfile: state.currentProfile ? {
            ...state.currentProfile,
            links: state.currentProfile.links.map((link) =>
              link.id === id ? { ...link, isActive: !link.isActive } : link
            ),
            updatedAt: new Date().toISOString(),
          } : null,
          profiles: state.profiles.map(profile => 
            profile.id === state.currentProfile?.id 
              ? { ...profile, links: profile.links.map(link => link.id === id ? { ...link, isActive: !link.isActive } : link), updatedAt: new Date().toISOString() }
              : profile
          )
        })),
      
      setAnalytics: (analytics) => set({ analytics }),
      
      trackView: (profileId) => {
        set((state) => ({
          analytics: state.analytics ? {
            ...state.analytics,
            totalViews: state.analytics.totalViews + 1,
            dailyStats: {
              ...state.analytics.dailyStats,
              [new Date().toISOString().split('T')[0]]: {
                views: (state.analytics.dailyStats[new Date().toISOString().split('T')[0]]?.views || 0) + 1,
                clicks: state.analytics.dailyStats[new Date().toISOString().split('T')[0]]?.clicks || 0
              }
            }
          } : null
        }));
      },
      
      trackClick: (profileId, linkId) => {
        set((state) => ({
          analytics: state.analytics ? {
            ...state.analytics,
            totalClicks: state.analytics.totalClicks + 1,
            linkStats: {
              ...state.analytics.linkStats,
              [linkId]: {
                clicks: (state.analytics.linkStats[linkId]?.clicks || 0) + 1,
                lastClicked: new Date().toISOString()
              }
            },
            dailyStats: {
              ...state.analytics.dailyStats,
              [new Date().toISOString().split('T')[0]]: {
                views: state.analytics.dailyStats[new Date().toISOString().split('T')[0]]?.views || 0,
                clicks: (state.analytics.dailyStats[new Date().toISOString().split('T')[0]]?.clicks || 0) + 1
              }
            }
          } : null
        }));
      },
      
      resetStore: () => set({ 
        user: null, 
        currentProfile: defaultProfile, 
        profiles: [defaultProfile], 
        analytics: null 
      }),
      
      generateShareableUrl: () => {
        if (typeof window !== 'undefined') {
          const baseUrl = window.location.origin;
          const { currentProfile } = get();
          if (currentProfile?.username) {
            return `${baseUrl}/u/${currentProfile.username}`;
          }
          return `${baseUrl}/profile/${currentProfile?.id || ''}`;
        }
        return '';
      },
      
      generateUsernameUrl: () => {
        if (typeof window !== 'undefined') {
          const baseUrl = window.location.origin;
          const { currentProfile } = get();
          return `${baseUrl}/u/${currentProfile?.username || 'username'}`;
        }
        return '';
      },
      
      canUseFeature: (feature) => {
        const { user } = get();
        if (!user) return false;
        
        const plan = SUBSCRIPTION_PLANS.find(p => p.id === user.subscriptionTier);
        if (!plan) return false;
        
        switch (feature) {
          case 'premiumThemes':
            return plan.premiumThemes;
          case 'analytics':
            return plan.analytics;
          case 'qrCodes':
            return user.subscriptionTier !== 'free';
          case 'customDomains':
            return plan.customDomains;
          case 'unlimitedLinks':
            return plan.maxLinks === -1;
          case 'multipleProfiles':
            return plan.maxProfiles === -1 || plan.maxProfiles > 1;
          default:
            return false;
        }
      }
    }),
    {
      name: 'linkora-store',
      partialize: (state) => ({
        user: state.user,
        currentProfile: state.currentProfile,
        profiles: state.profiles,
        analytics: state.analytics
      })
    }
  )
); 