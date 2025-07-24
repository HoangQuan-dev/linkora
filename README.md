# 🚀 Linkora - Link-in-Bio Page Builder

A modern, responsive link-in-bio page builder built with Next.js, TypeScript, and Tailwind CSS. Create beautiful, customizable profile pages to showcase all your links in one place.

![Linkora Screenshot](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Linkora+Link-in-Bio+Builder)

## ✨ Features

### 🎨 **Beautiful Design**
- Modern, responsive interface
- Mobile-first design approach
- Smooth animations with Framer Motion
- Multiple theme presets (Ocean, Sunset, Forest, Dark Mode, Minimal)

### 🛠️ **Customization**
- **Profile Customization**: Edit title, bio, and avatar
- **Theme System**: Choose from preset themes or create custom colors
- **Link Management**: Add, edit, delete, and reorder links
- **Icon Detection**: Automatic icon detection for popular platforms
- **Live Preview**: See changes in real-time

### 📱 **Responsive Experience**
- Perfect mobile and desktop layouts
- Device-specific preview modes
- Touch-friendly interface
- Fast loading and smooth interactions

### 🔗 **Link Management**
- Support for any URL (websites, social media, email, etc.)
- Smart icon detection for 25+ popular platforms
- Link visibility toggle (show/hide)
- Drag-and-drop reordering
- URL validation and formatting

### 🎯 **Creator-Focused**
- Instagram, Twitter, TikTok, YouTube support
- Portfolio and business links
- Email and contact integration
- Custom branding options

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd linkora
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Color Picker**: React Colorful
- **Storage**: localStorage (MVP)

## 📁 Project Structure

```
linkora/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Main editor page
│   │   ├── layout.tsx         # Root layout
│   │   └── profile/[id]/      # Public profile pages
│   ├── components/            # React components
│   │   ├── Editor.tsx         # Main editor interface
│   │   ├── PreviewPane.tsx    # Live preview component
│   │   ├── LinkBlock.tsx      # Individual link component
│   │   └── ThemePicker.tsx    # Theme customization
│   ├── lib/                   # Libraries and utilities
│   │   └── store.ts           # Zustand state management
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts           # Main types and interfaces
│   └── utils/                 # Utility functions
│       └── index.ts           # Helper functions
├── public/                    # Static assets
└── README.md
```

## 🎨 Theme System

Linkora includes 5 built-in theme presets:

1. **Ocean** - Light blue gradient theme
2. **Sunset** - Warm orange gradient theme  
3. **Forest** - Fresh green gradient theme
4. **Dark Mode** - Purple dark theme
5. **Minimal** - Clean, simple theme

### Custom Themes
- Custom primary colors
- Background customization
- Text color adjustment
- Card styling options

## 🔗 Supported Platforms

Auto-detected icons for 25+ platforms including:
- Social: Instagram, Twitter/X, TikTok, Facebook, LinkedIn
- Video: YouTube, Twitch, Vimeo
- Music: Spotify, SoundCloud, Apple Music
- Professional: GitHub, Behance, Dribbble
- Communication: Discord, Telegram, WhatsApp
- E-commerce: Etsy, Amazon
- Creator Economy: Patreon, Ko-fi
- And many more...

## 📱 Usage

### Creating Your Profile
1. **Set up your profile**: Add your name, bio, and avatar
2. **Add your links**: Include all your important links
3. **Customize the theme**: Choose colors that match your brand
4. **Share your page**: Copy the shareable URL

### Managing Links
- **Add Link**: Click the "Add New Link" button
- **Edit Link**: Click "Edit" on any existing link
- **Reorder Links**: Drag and drop to reorder (coming soon)
- **Hide/Show Links**: Toggle visibility without deleting

### Sharing
Your profile gets a unique URL like: `https://your-domain.com/profile/your-id`

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 🔮 Future Enhancements

- [ ] Drag-and-drop link reordering
- [ ] Custom link icons
- [ ] Avatar upload functionality
- [ ] Analytics and click tracking
- [ ] Custom domains
- [ ] Team collaboration
- [ ] Advanced customization options
- [ ] API for external integrations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Contact the development team

---

**Built with ❤️ by the Linkora team**
