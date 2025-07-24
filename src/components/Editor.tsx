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
  ExternalLink,
  Crown,
  Lock,
  Edit3,
  Eye
} from 'lucide-react';
import { useProfileStore } from '@/lib/store';
import { ThemePicker } from './ThemePicker';
import { LinkItem, LinkFormData, THEME_PRESETS } from '@/types';
import { cn, isValidUrl, formatUrl, getIconForUrl, copyToClipboard } from '@/utils';

interface LinkFormProps {
  link?: LinkItem;
  onSave: (data: LinkFormData) => void;
  onCancel: () => void;
}

function LinkForm({ link, onSave, onCancel }: LinkFormProps) {
  const [data, setData] = useState<LinkFormData>({
    title: link?.title || '',
    url: link?.url || '',
    icon: link?.icon || '',
    isPaid: link?.isPaid || false,
    price: link?.price || 0,
    isAffiliate: link?.isAffiliate || false,
    affiliateCode: link?.affiliateCode || ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!data.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!data.url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!isValidUrl(data.url)) {
      newErrors.url = 'Please enter a valid URL';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formattedData = {
      ...data,
      url: formatUrl(data.url),
      icon: data.icon || getIconForUrl(data.url)
    };

    onSave(formattedData);
  };

  const handleUrlChange = (url: string) => {
    setData(prev => ({ ...prev, url }));
    if (url && !data.icon) {
      setData(prev => ({ ...prev, icon: getIconForUrl(url) }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2">Link Title</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => setData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="My Awesome Link"
            className={cn(
              "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors",
              errors.title ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            )}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">URL</label>
          <input
            type="url"
            value={data.url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://example.com"
            className={cn(
              "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors",
              errors.url ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            )}
          />
          {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Icon</label>
          <select
            value={data.icon}
            onChange={(e) => setData(prev => ({ ...prev, icon: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors cursor-pointer"
          >
            <option value="">Auto-detect</option>
            <option value="github">GitHub</option>
            <option value="twitter">Twitter</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="youtube">YouTube</option>
            <option value="facebook">Facebook</option>
            <option value="mail">Email</option>
            <option value="link">Generic Link</option>
          </select>
        </div>

        {/* Premium Features */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPaid"
              checked={data.isPaid}
              onChange={(e) => setData(prev => ({ ...prev, isPaid: e.target.checked }))}
              className="rounded border-gray-300 cursor-pointer"
            />
            <label htmlFor="isPaid" className="flex items-center gap-2 text-sm cursor-pointer">
              <Crown className="w-4 h-4 text-yellow-500" />
              Paid Link
            </label>
          </div>

          {data.isPaid && (
            <div>
              <label className="block text-sm font-medium mb-2">Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={data.price}
                onChange={(e) => setData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                placeholder="9.99"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isAffiliate"
              checked={data.isAffiliate}
              onChange={(e) => setData(prev => ({ ...prev, isAffiliate: e.target.checked }))}
              className="rounded border-gray-300 cursor-pointer"
            />
            <label htmlFor="isAffiliate" className="flex items-center gap-2 text-sm cursor-pointer">
              <ExternalLink className="w-4 h-4 text-green-500" />
              Affiliate Link
            </label>
          </div>

          {data.isAffiliate && (
            <div>
              <label className="block text-sm font-medium mb-2">Affiliate Code</label>
              <input
                type="text"
                value={data.affiliateCode}
                onChange={(e) => setData(prev => ({ ...prev, affiliateCode: e.target.value }))}
                placeholder="AFFILIATE123"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {link ? 'Update' : 'Add'} Link
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export function Editor() {
  const { 
    currentProfile, 
    updateProfile, 
    updateTheme, 
    setThemePreset,
    addLink, 
    updateLink, 
    deleteLink, 
    toggleLinkActive,
    generateShareableUrl,
    canUseFeature
  } = useProfileStore();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'links' | 'theme'>('profile');
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [showAddLink, setShowAddLink] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  if (!currentProfile) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No profile selected</p>
      </div>
    );
  }

  const handleProfileUpdate = (field: 'title' | 'bio' | 'avatarUrl' | 'username' | 'customDomain', value: string) => {
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

  const getPremiumIndicator = (feature: string) => (
    <div className="flex items-center gap-1 text-xs text-gray-500">
      <Lock className="w-3 h-3" />
      {feature}
    </div>
  );

  return (
    <div className="h-full flex flex-col w-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors cursor-pointer',
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6 w-full">
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6 w-full"
            >
              <div>
                <label className="block text-sm font-medium mb-2">
                  Page Title
                </label>
                <input
                  type="text"
                  value={currentProfile.title}
                  onChange={(e) => handleProfileUpdate('title', e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Bio
                </label>
                <textarea
                  value={currentProfile.bio}
                  onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                  placeholder="Tell people about yourself..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Avatar URL
                </label>
                <input
                  type="url"
                  value={currentProfile.avatarUrl}
                  onChange={(e) => handleProfileUpdate('avatarUrl', e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                />
              </div>

              {/* Username Field (Premium Feature) */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Username
                  {!canUseFeature('customDomains') && getPremiumIndicator('Pro')}
                </label>
                <input
                  type="text"
                  value={currentProfile.username || ''}
                  onChange={(e) => handleProfileUpdate('username', e.target.value)}
                  placeholder="your-username"
                  disabled={!canUseFeature('customDomains')}
                  className={cn(
                    "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors",
                    !canUseFeature('customDomains') && "opacity-50 cursor-not-allowed"
                  )}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your profile will be available at: yourdomain.com/u/{currentProfile.username || 'username'}
                </p>
              </div>

              {/* Custom Domain Field (Premium Feature) */}
              {canUseFeature('customDomains') && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Custom Domain
                  </label>
                  <input
                    type="text"
                    value={currentProfile.customDomain || ''}
                    onChange={(e) => handleProfileUpdate('customDomain', e.target.value)}
                    placeholder="mylinks.com"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  />
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'links' && (
            <motion.div
              key="links"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6 w-full"
            >
              {/* Add Link Button */}
              <button
                onClick={() => setShowAddLink(true)}
                disabled={!canUseFeature('unlimitedLinks') && currentProfile.links.length >= 10}
                className={cn(
                  "w-full flex items-center justify-center gap-3 py-4 border-2 border-dashed rounded-lg transition-colors cursor-pointer",
                  canUseFeature('unlimitedLinks') || currentProfile.links.length < 10
                    ? "border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                    : "border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed"
                )}
              >
                <Plus className="w-5 h-5" />
                Add New Link
                {!canUseFeature('unlimitedLinks') && currentProfile.links.length >= 10 && (
                  <span className="text-xs text-gray-500">(Limit: 10 links)</span>
                )}
              </button>

              {/* Add Link Form */}
              <AnimatePresence>
                {showAddLink && (
                  <LinkForm
                    onSave={handleLinkSave}
                    onCancel={() => setShowAddLink(false)}
                  />
                )}
              </AnimatePresence>

              {/* Links List */}
              <div className="space-y-4">
                {currentProfile.links
                  .sort((a, b) => a.order - b.order)
                  .map((link) => (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium text-gray-900 dark:text-white">{link.title}</h4>
                          {link.isPaid && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              ${link.price}
                            </span>
                          )}
                          {link.isAffiliate && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Affiliate
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingLink(link);
                            }}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLinkActive(link.id);
                            }}
                            className={cn(
                              "p-2 rounded-lg transition-colors cursor-pointer",
                              link.isActive
                                ? "hover:bg-gray-100 dark:hover:bg-gray-700"
                                : "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                            )}
                          >
                            {link.isActive ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteLink(link.id);
                            }}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
                        {link.url}
                      </p>
                    </motion.div>
                  ))}
              </div>

              {/* Edit Link Form */}
              <AnimatePresence>
                {editingLink && (
                  <LinkForm
                    link={editingLink}
                    onSave={handleLinkSave}
                    onCancel={() => setEditingLink(null)}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {activeTab === 'theme' && (
            <motion.div
              key="theme"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full"
            >
              <ThemePicker
                currentTheme={currentProfile.theme}
                onThemeChange={updateTheme}
                onPresetSelect={setThemePreset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Share Button */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleShare}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Share Profile'}
        </button>
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