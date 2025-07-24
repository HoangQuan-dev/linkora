'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit3, Smartphone, Monitor, User, QrCode, BarChart3, Crown, Tablet } from 'lucide-react';
import { Editor } from '@/components/Editor';
import { PreviewPane } from '@/components/PreviewPane';
import { AuthModal } from '@/components/AuthModal';
import { QRCodeGenerator } from '@/components/QRCodeGenerator';
import { Analytics } from '@/components/Analytics';
import { useProfileStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import { cn } from '@/utils';

export default function Home() {
  const { 
    currentProfile, 
    deleteLink, 
    toggleLinkActive,
    canUseFeature,
    analytics 
  } = useProfileStore();
  
  const { user, signOut } = useAuth();
  
  const [previewMode, setPreviewMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'analytics'>('editor');

  const handleLinkClick = (linkId: string) => {
    // Track click analytics
    if (currentProfile) {
      // In a real app, this would be an API call
      console.log('Link clicked:', linkId);
    }
  };

  const getSubscriptionBadge = () => {
    if (!user) return null;
    
    const badges = {
      free: { color: 'bg-gray-100 text-gray-700', label: 'Free' },
      pro: { color: 'bg-blue-100 text-blue-700', label: 'Pro' },
      business: { color: 'bg-purple-100 text-purple-700', label: 'Business' }
    };
    
    const badge = badges[user.subscriptionTier];
    return (
      <div className={cn('px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1', badge.color)}>
        <Crown className="w-3 h-3" />
        {badge.label}
      </div>
    );
  };

  const getPreviewFrame = () => {
    switch (previewMode) {
      case 'mobile':
        return {
          container: 'w-full max-w-sm h-full max-h-[812px] rounded-[3rem] border-[14px] border-gray-900 shadow-2xl',
          screen: 'rounded-[2.5rem]',
          header: (
            <div className="bg-gray-900 h-8 flex items-center justify-center relative">
              {/* iPhone notch */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl flex items-center justify-center">
                <div className="w-16 h-1 bg-gray-700 rounded-full"></div>
              </div>
              {/* Status bar indicators */}
              <div className="absolute top-2 right-4 flex items-center gap-1">
                <div className="w-4 h-2 bg-gray-700 rounded-sm"></div>
                <div className="w-6 h-2 bg-gray-700 rounded-sm"></div>
              </div>
            </div>
          )
        };
      case 'tablet':
        return {
          container: 'w-full max-w-md h-full max-h-[1024px] rounded-[2rem] border-[12px] border-gray-800 shadow-2xl',
          screen: 'rounded-[1.5rem]',
          header: (
            <div className="bg-gray-800 h-6 flex items-center justify-center relative">
              {/* Tablet camera */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-600 rounded-full"></div>
              {/* Status bar */}
              <div className="absolute top-2 right-4 flex items-center gap-1">
                <div className="w-6 h-2 bg-gray-600 rounded-sm"></div>
                <div className="w-8 h-2 bg-gray-600 rounded-sm"></div>
              </div>
            </div>
          )
        };
      case 'desktop':
        return {
          container: 'w-full h-full rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg',
          screen: 'rounded-lg',
          header: null
        };
      default:
        return {
          container: 'w-full h-full rounded-lg border border-gray-200 dark:border-gray-700',
          screen: 'rounded-lg',
          header: null
        };
    }
  };

  const previewFrame = getPreviewFrame();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
              L
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Linkora
            </h1>
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">
              Link-in-Bio Page Builder
            </span>
          </div>
          
          {/* Right side controls */}
          <div className="flex items-center gap-3">
            {/* User/Auth Section */}
            {user ? (
              <div className="flex items-center gap-3">
                {getSubscriptionBadge()}
                <div className="flex items-center gap-2">
                  {user.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={user.fullName || user.email}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user.fullName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium">{user.fullName || user.email}</p>
                    <p className="text-xs text-gray-500">{user.subscriptionTier} plan</p>
                  </div>
                </div>
                <button
                  onClick={signOut}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
              >
                <User className="w-4 h-4" />
                Sign In
              </button>
            )}

            {/* QR Code Button (Premium Feature) */}
            {user && canUseFeature('qrCodes') && (
              <button
                onClick={() => setShowQRModal(true)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer"
                title="Generate QR Code"
              >
                <QrCode className="w-4 h-4" />
                <span className="hidden sm:inline">QR Code</span>
              </button>
            )}

            {/* Analytics Tab Toggle (Premium Feature) */}
            {user && canUseFeature('analytics') && (
              <button
                onClick={() => setActiveTab(activeTab === 'editor' ? 'analytics' : 'editor')}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-pointer',
                  activeTab === 'analytics'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                )}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </button>
            )}
            
            {/* Mobile preview toggle (for smaller screens) */}
            <div className="lg:hidden">
              <button
                onClick={() => setShowMobilePreview(!showMobilePreview)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-pointer',
                  showMobilePreview 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                )}
              >
                {showMobilePreview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showMobilePreview ? 'Edit' : 'Preview'}
              </button>
            </div>
            
            {/* Desktop preview mode toggle */}
            <div className="hidden lg:flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setPreviewMode('mobile')}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer',
                  previewMode === 'mobile'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                <Smartphone className="w-4 h-4" />
                Mobile
              </button>
              <button
                onClick={() => setPreviewMode('tablet')}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer',
                  previewMode === 'tablet'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                <Tablet className="w-4 h-4" />
                Tablet
              </button>
              <button
                onClick={() => setPreviewMode('desktop')}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer',
                  previewMode === 'desktop'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                <Monitor className="w-4 h-4" />
                Desktop
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Editor/Analytics Panel */}
        <div className={cn(
          'flex-1 border-r border-gray-200 dark:border-gray-700',
          'lg:flex lg:max-w-md xl:max-w-lg 2xl:max-w-xl',
          showMobilePreview && 'hidden lg:flex'
        )}>
          {activeTab === 'editor' ? (
            <Editor />
          ) : (
            <div className="h-full overflow-y-auto p-6 w-full">
              {currentProfile && (
                <Analytics 
                  profile={currentProfile} 
                  analytics={analytics || undefined}
                />
              )}
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <div className={cn(
          'flex-1 relative',
          !showMobilePreview && 'hidden lg:block'
        )}>
          {/* Preview Container */}
          <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 p-4">
            <motion.div
              key={previewMode}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={cn(
                'bg-white dark:bg-gray-900 overflow-hidden',
                previewFrame.container
              )}
            >
              {/* Device header */}
              {previewFrame.header}

              {/* Preview Content */}
              <div className={cn('h-full overflow-hidden', previewFrame.screen)}>
                {currentProfile && (
                  <PreviewPane
                    profile={currentProfile}
                    isEditMode={true}
                    onLinkEdit={(linkId) => {
                      // This could trigger a modal or navigate to edit mode
                      console.log('Edit link:', linkId);
                    }}
                    onLinkDelete={deleteLink}
                    onLinkToggleActive={toggleLinkActive}
                    className="h-full"
                  />
                )}
              </div>
            </motion.div>
          </div>

          {/* Preview Mode Label */}
          <div className="absolute top-4 right-4 hidden lg:block">
            <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              {previewMode === 'mobile' ? 'Mobile Preview' : 
               previewMode === 'tablet' ? 'Tablet Preview' : 'Desktop Preview'}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Floating action button to switch between edit/preview */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setShowMobilePreview(!showMobilePreview)}
          className="w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {showMobilePreview ? (
            <Edit3 className="w-6 h-6" />
          ) : (
            <Eye className="w-6 h-6" />
          )}
        </motion.button>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

      {/* QR Code Modal */}
      {showQRModal && currentProfile && (
        <QRCodeGenerator
          url={currentProfile.username 
            ? `${window.location.origin}/u/${currentProfile.username}`
            : `${window.location.origin}/profile/${currentProfile.id}`
          }
          onClose={() => setShowQRModal(false)}
        />
      )}
    </div>
  );
}
