'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit3, Smartphone, Monitor } from 'lucide-react';
import { Editor } from '@/components/Editor';
import { PreviewPane } from '@/components/PreviewPane';
import { useProfileStore } from '@/lib/store';
import { cn } from '@/utils';

export default function Home() {
  const { profile, deleteLink, toggleLinkActive } = useProfileStore();
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [showMobilePreview, setShowMobilePreview] = useState(false);

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
          
          {/* Mobile preview toggle (for smaller screens) */}
          <div className="flex items-center gap-2">
            <div className="lg:hidden">
              <button
                onClick={() => setShowMobilePreview(!showMobilePreview)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
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
                  'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
                  previewMode === 'mobile'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                <Smartphone className="w-4 h-4" />
                Mobile
              </button>
              <button
                onClick={() => setPreviewMode('desktop')}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
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
        {/* Editor Panel */}
        <div className={cn(
          'flex-1 border-r border-gray-200 dark:border-gray-700',
          'lg:flex lg:max-w-md xl:max-w-lg',
          showMobilePreview && 'hidden lg:flex'
        )}>
          <Editor />
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
                'bg-white dark:bg-gray-900 shadow-2xl overflow-hidden',
                previewMode === 'mobile' 
                  ? 'w-full max-w-sm h-full max-h-[812px] rounded-3xl border-8 border-gray-800'
                  : 'w-full h-full rounded-lg border border-gray-200 dark:border-gray-700'
              )}
            >
              {/* Phone-style header (mobile preview only) */}
              {previewMode === 'mobile' && (
                <div className="bg-gray-800 h-6 flex items-center justify-center">
                  <div className="w-16 h-1 bg-gray-600 rounded-full"></div>
                </div>
              )}
              
              {/* Preview Content */}
              <div className="h-full overflow-hidden">
                <PreviewPane
                  profile={profile}
                  isEditMode={true}
                  onLinkEdit={(linkId) => {
                    // This could trigger a modal or navigate to edit mode
                    console.log('Edit link:', linkId);
                  }}
                  onLinkDelete={deleteLink}
                  onLinkToggleActive={toggleLinkActive}
                  className={previewMode === 'mobile' ? 'h-full' : 'h-full'}
                />
              </div>
            </motion.div>
          </div>

          {/* Preview Mode Label */}
          <div className="absolute top-4 right-4 hidden lg:block">
            <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              {previewMode === 'mobile' ? 'Mobile Preview' : 'Desktop Preview'}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Floating action button to switch between edit/preview */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setShowMobilePreview(!showMobilePreview)}
          className="w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center"
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
    </div>
  );
}
