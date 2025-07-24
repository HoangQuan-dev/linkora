import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (these would match your Supabase schema)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          subscription_tier: 'free' | 'pro' | 'business';
          subscription_status: 'active' | 'inactive' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: 'free' | 'pro' | 'business';
          subscription_status?: 'active' | 'inactive' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: 'free' | 'pro' | 'business';
          subscription_status?: 'active' | 'inactive' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          username: string | null;
          title: string;
          bio: string;
          avatar_url: string;
          theme: unknown; // JSON
          links: unknown; // JSON array
          custom_domain: string | null;
          is_public: boolean;
          is_premium: boolean;
          subscription_tier: 'free' | 'pro' | 'business';
          total_views: number;
          total_clicks: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          username?: string | null;
          title: string;
          bio: string;
          avatar_url: string;
          theme: unknown;
          links: unknown;
          custom_domain?: string | null;
          is_public?: boolean;
          is_premium?: boolean;
          subscription_tier?: 'free' | 'pro' | 'business';
          total_views?: number;
          total_clicks?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          username?: string | null;
          title?: string;
          bio?: string;
          avatar_url?: string;
          theme?: unknown;
          links?: unknown;
          custom_domain?: string | null;
          is_public?: boolean;
          is_premium?: boolean;
          subscription_tier?: 'free' | 'pro' | 'business';
          total_views?: number;
          total_clicks?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      analytics: {
        Row: {
          id: string;
          profile_id: string;
          link_id: string | null;
          event_type: 'view' | 'click';
          user_agent: string | null;
          ip_address: string | null;
          referrer: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          link_id?: string | null;
          event_type: 'view' | 'click';
          user_agent?: string | null;
          ip_address?: string | null;
          referrer?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          link_id?: string | null;
          event_type?: 'view' | 'click';
          user_agent?: string | null;
          ip_address?: string | null;
          referrer?: string | null;
          created_at?: string;
        };
      };
    };
  };
} 