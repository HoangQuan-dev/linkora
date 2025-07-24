'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { PreviewPane } from '@/components/PreviewPane';
import { Profile } from '@/types';
import { copyToClipboard } from '@/utils';

interface UsernameProfilePageProps {
  params: Promise<{ username: string }>;
}

export default function UsernameProfilePage({ params }: UsernameProfilePageProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params;
      setUsername(resolvedParams.username);
    }
    getParams();
  }, [params]);

  useEffect(() => {
    if (!username) return;

    // For MVP, we'll try to load from localStorage
    // In a real app, this would be a database query by username
    const loadProfile = () => {
      try {
        const stored = localStorage.getItem('linkora-profile');
        if (stored) {
          const data = JSON.parse(stored);
          if (data.profile && data.profile.username === username) {
            setProfile(data.profile);
          } else {
            // Profile not found or username doesn't match
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [username]);

  const handleShare = async () => {
    const url = window.location.href;
    const success = await copyToClipboard(url);
    setCopied(success);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
        <div className="text-center max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">😕</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Profile Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The profile <strong>@{username}</strong> doesn&apos;t exist or may have been removed.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Create Your Own
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Navigation Bar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50"
      >
        <div className="max-w-md mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Create Your Own
          </Link>
          
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Share'}
          </button>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="pt-16">
        <PreviewPane
          profile={profile}
          isEditMode={false}
        />
      </div>

      {/* Powered by Linkora Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
      >
        <Link
          href="/"
          className="flex items-center gap-2 bg-black/80 text-white px-4 py-2 rounded-full text-sm hover:bg-black transition-colors backdrop-blur-sm"
        >
          <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-sm flex items-center justify-center text-xs font-bold">
            L
          </div>
          Powered by Linkora
        </Link>
      </motion.div>
    </div>
  );
} 