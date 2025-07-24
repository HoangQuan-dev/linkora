'use client';

import { motion } from 'framer-motion';
import { 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff,
  GripVertical,
  Github,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Music,
  Facebook,
  MessageCircle,
  Send,
  Camera,
  Play,
  ShoppingBag,
  ShoppingCart,
  CreditCard,
  Coffee,
  Heart,
  User,
  Mail,
  BookOpen,
  Code,
  HelpCircle,
  MessageSquare,
  Image,
  Palette,
  Link as LinkIcon,
} from 'lucide-react';
import { LinkItem } from '@/types';
import { cn, getDomainFromUrl } from '@/utils';

interface LinkBlockProps {
  link: LinkItem;
  isEditMode?: boolean;
  theme: {
    primaryColor: string;
    cardColor: string;
    textColor: string;
  };
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleActive?: () => void;
  onClick?: () => void;
  isDragging?: boolean;
}

const iconMap = {
  github: Github,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  music: Music,
  facebook: Facebook,
  'message-circle': MessageCircle,
  send: Send,
  camera: Camera,
  play: Play,
  'shopping-bag': ShoppingBag,
  'shopping-cart': ShoppingCart,
  'credit-card': CreditCard,
  coffee: Coffee,
  heart: Heart,
  user: User,
  mail: Mail,
  'book-open': BookOpen,
  code: Code,
  'help-circle': HelpCircle,
  'message-square': MessageSquare,
  image: Image,
  palette: Palette,
  link: LinkIcon,
  twitch: Play, // Using Play as fallback for Twitch
};

export function LinkBlock({ 
  link, 
  isEditMode = false, 
  theme, 
  onEdit, 
  onDelete, 
  onToggleActive, 
  onClick,
  isDragging = false 
}: LinkBlockProps) {
  const IconComponent = iconMap[link.icon as keyof typeof iconMap] || LinkIcon;
  const domain = getDomainFromUrl(link.url);

  const handleClick = () => {
    if (isEditMode) {
      return; // Don't navigate in edit mode
    }
    
    if (onClick) {
      onClick();
    } else {
      window.open(link.url, '_blank', 'noopener,noreferrer');
    }
  };

  const linkContent = (
    <div
      className={cn(
        'relative group rounded-xl p-4 transition-all duration-200 cursor-pointer',
        'border border-gray-200/20 backdrop-blur-sm',
        !link.isActive && isEditMode && 'opacity-50',
        isDragging && 'rotate-3 scale-105 shadow-xl',
        !isEditMode && 'hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]'
      )}
      style={{ 
        backgroundColor: theme.cardColor,
        color: theme.textColor,
      }}
      onClick={handleClick}
    >
      {/* Drag handle (only in edit mode) */}
      {isEditMode && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
      )}

      {/* Link content */}
      <div className={cn('flex items-center gap-4', isEditMode && 'ml-4')}>
        {/* Icon */}
        <div 
          className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${theme.primaryColor}20` }}
        >
          <IconComponent 
            className="w-6 h-6" 
            style={{ color: theme.primaryColor }} 
          />
        </div>

        {/* Text content */}
        <div className="flex-grow min-w-0">
          <h3 className="font-semibold text-lg truncate">
            {link.title}
          </h3>
          <p className="text-sm opacity-70 truncate">
            {domain}
          </p>
        </div>

        {/* Edit mode actions */}
        {isEditMode && (
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleActive?.();
              }}
              className="p-2 rounded-lg hover:bg-gray-100/10 transition-colors"
              title={link.isActive ? 'Hide link' : 'Show link'}
            >
              {link.isActive ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="p-2 rounded-lg hover:bg-gray-100/10 transition-colors"
              title="Edit link"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="p-2 rounded-lg hover:bg-red-500/20 transition-colors text-red-500"
              title="Delete link"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* External link icon (preview mode) */}
        {!isEditMode && (
          <ExternalLink className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
        )}
      </div>

      {/* Hover effect overlay */}
      {!isEditMode && (
        <div 
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"
          style={{ backgroundColor: theme.primaryColor }}
        />
      )}
    </div>
  );

  if (isEditMode) {
    return linkContent;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {linkContent}
    </motion.div>
  );
} 