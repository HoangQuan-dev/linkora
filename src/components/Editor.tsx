'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Link as LinkIcon, 
  Plus, 
  Save, 
  Share2, 
  Copy,
  Check,
  X,
  ExternalLink
} from 'lucide-react';
import { useProfileStore } from '@/lib/store';
import { ThemePicker } from './ThemePicker';
import { LinkItem, LinkFormData } from '@/types';
import { cn, isValidUrl, formatUrl, getIconForUrl, copyToClipboard } from '@/utils';

interface LinkFormProps {
  link?: LinkItem;
  onSave: (data: LinkFormData) => void;
  onCancel: () => void;
}

function LinkForm({ link, onSave, onCancel }: LinkFormProps) {
  const [formData, setFormData] = useState<LinkFormData>({
    title: link?.title || '',
    url: link?.url || '',
    icon: link?.icon || '',
  });
  const [errors, setErrors] = useState<Partial<LinkFormData>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Partial<LinkFormData> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!isValidUrl(formatUrl(formData.url))) {
      newErrors.url = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      const finalUrl = formatUrl(formData.url);
      onSave({
        ...formData,
        url: finalUrl,
        icon: formData.icon || getIconForUrl(finalUrl),
      });
    }
  };

  const handleUrlChange = (url: string) => {
    setFormData(prev => ({
      ...prev,
      url,
      icon: url ? getIconForUrl(formatUrl(url)) : '',
    }));
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">
          {link ? 'Edit Link' : 'Add New Link'}
        </h4>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="My awesome link"
          className={cn(
            'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'dark:bg-gray-700 dark:border-gray-600 dark:text-white',
            errors.title && 'border-red-500'
          )}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          URL
        </label>
        <input
          type="text"
          value={formData.url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://example.com or email@domain.com"
          className={cn(
            'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'dark:bg-gray-700 dark:border-gray-600 dark:text-white',
            errors.url && 'border-red-500'
          )}
        />
        {errors.url && (
          <p className="text-red-500 text-sm mt-1">{errors.url}</p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          {link ? 'Update' : 'Add'} Link
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.form>
  );
}

export function Editor() {
  const { 
    profile, 
    updateProfile, 
    updateTheme, 
    setThemePreset,
    addLink, 
    updateLink, 
    deleteLink, 
    toggleLinkActive,
    generateShareableUrl 
  } = useProfileStore();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'links' | 'theme'>('profile');
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [showAddLink, setShowAddLink] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleProfileUpdate = (field: 'title' | 'bio' | 'avatarUrl', value: string) => {
    updateProfile({ [field]: value });
  };

  const handleLinkSave = (data: LinkFormData) => {
    if (editingLink) {
      updateLink(editingLink.id, data);
      setEditingLink(null);
    } else {
      addLink({ ...data, isActive: true });
      setShowAddLink(false);
    }
  };

  const handleShare = async () => {
    const url = generateShareableUrl();
    setShareUrl(url);
    const success = await copyToClipboard(url);
    setCopied(success);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'links' as const, label: 'Links', icon: LinkIcon },
    { id: 'theme' as const, label: 'Theme', icon: ExternalLink },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex-shrink-0 p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Edit Your Page</h2>
          <button
            onClick={handleShare}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Share'}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'hover:bg-gray-200/50 dark:hover:bg-gray-600/50'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium mb-2">
                  Page Title
                </label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => handleProfileUpdate('title', e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                  placeholder="Tell people about yourself..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Avatar URL
                </label>
                <input
                  type="url"
                  value={profile.avatarUrl}
                  onChange={(e) => handleProfileUpdate('avatarUrl', e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Leave empty for a generated avatar
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'links' && (
            <motion.div
              key="links"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Add Link Button */}
              {!showAddLink && !editingLink && (
                <button
                  onClick={() => setShowAddLink(true)}
                  className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500"
                >
                  <Plus className="w-5 h-5" />
                  Add New Link
                </button>
              )}

              {/* Add/Edit Link Form */}
              <AnimatePresence>
                {(showAddLink || editingLink) && (
                  <LinkForm
                    link={editingLink || undefined}
                    onSave={handleLinkSave}
                    onCancel={() => {
                      setShowAddLink(false);
                      setEditingLink(null);
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Links List */}
              <div className="space-y-3">
                {profile.links
                  .sort((a, b) => a.order - b.order)
                  .map((link) => (
                    <div
                      key={link.id}
                      className={cn(
                        'p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700',
                        !link.isActive && 'opacity-50'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{link.title}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {link.url}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleLinkActive(link.id)}
                            className={cn(
                              'px-3 py-1 text-xs rounded-full transition-colors',
                              link.isActive
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            )}
                          >
                            {link.isActive ? 'Active' : 'Hidden'}
                          </button>
                          <button
                            onClick={() => setEditingLink(link)}
                            className="text-blue-500 hover:text-blue-700 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteLink(link.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {profile.links.length === 0 && !showAddLink && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <LinkIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No links yet. Add your first link to get started!</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'theme' && (
            <motion.div
              key="theme"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <ThemePicker
                currentTheme={profile.theme}
                onThemeChange={updateTheme}
                onPresetSelect={setThemePreset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Share URL Display */}
      <AnimatePresence>
        {shareUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-4 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-center gap-2">
              <Copy className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Your shareable link:
              </span>
              <code className="flex-1 text-sm bg-white dark:bg-gray-800 px-2 py-1 rounded border text-gray-700 dark:text-gray-300">
                {shareUrl}
              </code>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 