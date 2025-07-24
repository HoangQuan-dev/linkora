import { type ClassValue, clsx } from 'clsx';

// Utility for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// URL validation
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Auto-detect icon based on URL
export function getIconForUrl(url: string): string {
  const domain = new URL(url).hostname.toLowerCase();
  
  const iconMap: Record<string, string> = {
    'github.com': 'github',
    'twitter.com': 'twitter',
    'x.com': 'twitter',
    'instagram.com': 'instagram',
    'linkedin.com': 'linkedin',
    'youtube.com': 'youtube',
    'tiktok.com': 'music',
    'facebook.com': 'facebook',
    'discord.com': 'message-circle',
    'twitch.tv': 'twitch',
    'spotify.com': 'music',
    'apple.com': 'music',
    'soundcloud.com': 'music',
    'pinterest.com': 'image',
    'behance.net': 'palette',
    'dribbble.com': 'palette',
    'medium.com': 'book-open',
    'dev.to': 'code',
    'stackoverflow.com': 'help-circle',
    'reddit.com': 'message-square',
    'telegram.org': 'send',
    'whatsapp.com': 'message-circle',
    'snapchat.com': 'camera',
    'vimeo.com': 'play',
    'etsy.com': 'shopping-bag',
    'amazon.com': 'shopping-cart',
    'paypal.com': 'credit-card',
    'ko-fi.com': 'coffee',
    'patreon.com': 'heart',
    'onlyfans.com': 'user',
    'substack.com': 'mail',
    'newsletter': 'mail',
    'email': 'mail',
    'mailto:': 'mail',
  };
  
  // Check for exact domain matches
  for (const [key, icon] of Object.entries(iconMap)) {
    if (domain.includes(key)) {
      return icon;
    }
  }
  
  // Check for email
  if (url.startsWith('mailto:') || url.includes('@')) {
    return 'mail';
  }
  
  // Default icon
  return 'link';
}

// Format URL to ensure it has protocol
export function formatUrl(url: string): string {
  if (!url) return '';
  
  // Handle email addresses
  if (url.includes('@') && !url.startsWith('mailto:')) {
    return `mailto:${url}`;
  }
  
  // Add https:// if no protocol
  if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('mailto:')) {
    return `https://${url}`;
  }
  
  return url;
}

// Extract domain from URL for display
export function getDomainFromUrl(url: string): string {
  try {
    if (url.startsWith('mailto:')) {
      return url.replace('mailto:', '');
    }
    const domain = new URL(url).hostname;
    return domain.startsWith('www.') ? domain.slice(4) : domain;
  } catch {
    return url;
  }
}

// Generate a slug from text
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

// Debounce function for performance
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Format date for display
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
} 