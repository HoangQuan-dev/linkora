'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Eye, 
  MousePointer, 
  TrendingUp, 
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import type { Analytics, Profile } from '@/types';
import { cn } from '@/utils';

interface AnalyticsProps {
  profile: Profile;
  analytics?: Analytics;
}

export function Analytics({ profile, analytics }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  const mockAnalytics: Analytics = {
    profileId: profile.id,
    totalViews: 1247,
    totalClicks: 892,
    linkStats: {
      'link-1': { clicks: 234, lastClicked: '2024-01-15T10:30:00Z' },
      'link-2': { clicks: 156, lastClicked: '2024-01-14T15:45:00Z' },
      'link-3': { clicks: 89, lastClicked: '2024-01-13T09:20:00Z' },
    },
    dailyStats: {
      '2024-01-15': { views: 45, clicks: 32 },
      '2024-01-14': { views: 38, clicks: 28 },
      '2024-01-13': { views: 42, clicks: 31 },
      '2024-01-12': { views: 35, clicks: 25 },
      '2024-01-11': { views: 29, clicks: 22 },
      '2024-01-10': { views: 33, clicks: 26 },
      '2024-01-09': { views: 41, clicks: 30 },
    }
  };

  const data = analytics || mockAnalytics;
  const activeLinks = profile.links.filter(link => link.isActive);

  const getTopLinks = () => {
    return activeLinks
      .map(link => ({
        ...link,
        clicks: data.linkStats[link.id]?.clicks || 0
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5);
  };

  const getDailyStats = () => {
    const dates = Object.keys(data.dailyStats).sort();
    return dates.map(date => ({
      date,
      ...data.dailyStats[date]
    }));
  };

  const calculateGrowth = () => {
    const dailyStats = getDailyStats();
    if (dailyStats.length < 2) return { views: 0, clicks: 0 };

    const recent = dailyStats.slice(-3);
    const previous = dailyStats.slice(-6, -3);

    const recentViews = recent.reduce((sum, day) => sum + day.views, 0);
    const previousViews = previous.reduce((sum, day) => sum + day.views, 0);
    const recentClicks = recent.reduce((sum, day) => sum + day.clicks, 0);
    const previousClicks = previous.reduce((sum, day) => sum + day.clicks, 0);

    return {
      views: previousViews > 0 ? ((recentViews - previousViews) / previousViews) * 100 : 0,
      clicks: previousClicks > 0 ? ((recentClicks - previousClicks) / previousClicks) * 100 : 0
    };
  };

  const growth = calculateGrowth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-blue-500" />
          <h3 className="text-xl font-semibold">Analytics</h3>
        </div>
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                'px-3 py-1 rounded-md text-sm transition-colors',
                timeRange === range
                  ? 'bg-white dark:bg-gray-600 shadow-sm'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-600'
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
              <p className="text-2xl font-bold">{data.totalViews.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Eye className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {growth.views > 0 ? (
              <ArrowUp className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowDown className="w-4 h-4 text-red-500" />
            )}
            <span className={cn(
              'text-sm font-medium',
              growth.views > 0 ? 'text-green-500' : 'text-red-500'
            )}>
              {Math.abs(growth.views).toFixed(1)}%
            </span>
            <span className="text-sm text-gray-500">vs last period</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Clicks</p>
              <p className="text-2xl font-bold">{data.totalClicks.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <MousePointer className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {growth.clicks > 0 ? (
              <ArrowUp className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowDown className="w-4 h-4 text-red-500" />
            )}
            <span className={cn(
              'text-sm font-medium',
              growth.clicks > 0 ? 'text-green-500' : 'text-red-500'
            )}>
              {Math.abs(growth.clicks).toFixed(1)}%
            </span>
            <span className="text-sm text-gray-500">vs last period</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Click Rate</p>
              <p className="text-2xl font-bold">
                {data.totalViews > 0 ? ((data.totalClicks / data.totalViews) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {data.totalClicks} clicks / {data.totalViews} views
          </p>
        </motion.div>
      </div>

      {/* Top Performing Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        <h4 className="text-lg font-semibold mb-4">Top Performing Links</h4>
        <div className="space-y-3">
          {getTopLinks().map((link, index) => (
            <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium">{link.title}</p>
                  <p className="text-sm text-gray-500">{link.url}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{link.clicks}</p>
                <p className="text-sm text-gray-500">clicks</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Daily Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        <h4 className="text-lg font-semibold mb-4">Daily Performance</h4>
        <div className="space-y-3">
          {getDailyStats().slice(-7).map((day) => (
            <div key={day.date} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">
                  {new Date(day.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{day.views}</p>
                  <p className="text-xs text-gray-500">views</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{day.clicks}</p>
                  <p className="text-xs text-gray-500">clicks</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
} 