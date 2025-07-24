'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LinkBlock } from './LinkBlock';
import { Profile } from '@/types';
import { cn } from '@/utils';

interface PreviewPaneProps {
  profile: Profile;
  className?: string;
  isEditMode?: boolean;
  onLinkEdit?: (linkId: string) => void;
  onLinkDelete?: (linkId: string) => void;
  onLinkToggleActive?: (linkId: string) => void;
}

export function PreviewPane({ 
  profile, 
  className,
  isEditMode = false,
  onLinkEdit,
  onLinkDelete,
  onLinkToggleActive
}: PreviewPaneProps) {
  const { theme } = profile;
  const activeLinks = profile.links
    .filter(link => isEditMode || link.isActive)
    .sort((a, b) => a.order - b.order);

  const backgroundStyle = theme.backgroundGradient 
    ? {
        background: `linear-gradient(${theme.backgroundGradient.direction}, ${theme.backgroundGradient.from}, ${theme.backgroundGradient.to})`,
        color: theme.textColor,
      }
    : {
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
      };

  return (
    <div 
      className={cn(
        'min-h-screen w-full relative overflow-hidden',
        className
      )}
      style={backgroundStyle}
    >
      {/* Background pattern/effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full blur-3xl"
             style={{ backgroundColor: theme.primaryColor }} />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full blur-3xl"
             style={{ backgroundColor: theme.primaryColor }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-md mx-auto px-6 py-12">
        {/* Profile Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Avatar */}
          <motion.div 
            className="relative mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.title}
                className="w-32 h-32 rounded-full mx-auto object-cover shadow-xl border-4 border-white/20"
                onError={(e) => {
                  // Fallback to default avatar on error
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.title)}&size=128&background=${theme.primaryColor.slice(1)}&color=ffffff`;
                }}
              />
            ) : (
              <div 
                className="w-32 h-32 rounded-full mx-auto flex items-center justify-center text-4xl font-bold shadow-xl border-4 border-white/20"
                style={{ backgroundColor: theme.primaryColor, color: 'white' }}
              >
                {profile.title.charAt(0).toUpperCase()}
              </div>
            )}
          </motion.div>

          {/* Name/Title */}
          <motion.h1 
            className="text-3xl font-bold mb-4"
            style={{ color: theme.textColor }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {profile.title}
          </motion.h1>

          {/* Bio */}
          {profile.bio && (
            <motion.p 
              className="text-lg opacity-80 leading-relaxed max-w-sm mx-auto"
              style={{ color: theme.textColor }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {profile.bio}
            </motion.p>
          )}
        </motion.div>

        {/* Links Section */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <AnimatePresence mode="popLayout">
            {activeLinks.length > 0 ? (
              activeLinks.map((link, index) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  layout
                >
                  <LinkBlock
                    link={link}
                    isEditMode={isEditMode}
                    theme={{
                      primaryColor: theme.primaryColor,
                      cardColor: theme.cardColor,
                      textColor: theme.textColor,
                    }}
                    onEdit={() => onLinkEdit?.(link.id)}
                    onDelete={() => onLinkDelete?.(link.id)}
                    onToggleActive={() => onLinkToggleActive?.(link.id)}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${theme.primaryColor}20` }}
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    📎
                  </motion.div>
                </div>
                <p 
                  className="text-lg opacity-60"
                  style={{ color: theme.textColor }}
                >
                  {isEditMode ? 'Add your first link to get started!' : 'No links available'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        {!isEditMode && (
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <p 
              className="text-sm opacity-40"
              style={{ color: theme.textColor }}
            >
              Created with{' '}
              <span className="inline-block animate-pulse">❤️</span>
              {' '}using Linkora
            </p>
          </motion.div>
        )}
      </div>

      {/* Mobile-first responsive adjustments */}
      <style jsx>{`
        @media (max-width: 640px) {
          .max-w-md {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
} 