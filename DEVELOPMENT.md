# Alchemist Platform - Development Guide

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (recommend using [nvm](https://github.com/nvm-sh/nvm))
- **npm** 8+ or **yarn** 1.22+
- **Git** for version control
- **Gemini API Key** from [Google AI Studio](https://makersuite.google.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JoyaTech/Alchemist.git
   cd Alchemist
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Navigate to `http://localhost:5173`
   - The app supports both Hebrew and English

## 🏗️ Project Structure

```
alchemist/
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 alchemist/      # Core Alchemist components
│   │   ├── 📁 adhd/           # ADHD-friendly components  
│   │   ├── 📁 music/          # Music & creativity tools
│   │   ├── 📁 hebrew/         # Hebrew language components
│   │   └── 📁 common/         # Shared components
│   ├── 📁 services/
│   │   ├── 📁 integrations/   # External API integrations
│   │   ├── 📄 geminiService.ts # Gemini API client
│   │   └── 📄 dataService.ts   # Local data management
│   ├── 📁 locales/            # Internationalization
│   │   ├── 📄 en.json         # English translations
│   │   ├── 📄 he.json         # Hebrew translations
│   │   └── 📄 i18n.ts         # i18n configuration
│   ├── 📁 types/              # TypeScript definitions
│   ├── 📁 utils/              # Utility functions
│   └── 📄 App.tsx             # Main application component
├── 📁 public/                 # Static assets
├── 📁 docs/                   # Documentation
└── 📄 package.json           # Dependencies and scripts
```

## 🧪 Core Features Development

### 1. Alchemist Core Components

The heart of the platform is the Alchemist system for prompt engineering:

- **AlchemistPage**: Main hub for prompt management
- **AlchemistWorkbench**: Interactive prompt creation
- **AlchemistLibrary**: Community prompt collection

### 2. ADHD-Friendly Features

Located in `src/components/adhd/`:

- **FocusMode**: Distraction-free environment with timer
- **TaskBreakdown**: Automatic task decomposition
- **ProgressTracker**: Visual progress monitoring

**Key Features:**
- Pomodoro timer integration
- Visual progress indicators
- Step-by-step task guidance
- Reduced motion options
- Distraction filtering

### 3. Music & Creativity Tools

Located in `src/components/music/`:

- **MusicProductionHub**: DAW-inspired prompt management
- **CreativeWorkflows**: Structured creative processes
- **CollaborationTools**: Team-based creative work

**Supported Workflows:**
- Beat creation and production
- Songwriting and lyrics
- Mixing and mastering guidance
- Creative collaboration planning

### 4. Hebrew & Israeli Market Support

- **RTL Layout Engine**: Automatic right-to-left layout
- **Hebrew Translations**: Complete UI in Hebrew
- **Cultural Context**: Israeli business and startup focus
- **Local Integrations**: Hebrew prompt libraries

## 🔧 Development Workflows

### Adding New Components

1. **Create component file**
   ```bash
   # For general components
   touch src/components/common/MyComponent.tsx
   
   # For ADHD-specific components  
   touch src/components/adhd/MyADHDComponent.tsx
   
   # For music-specific components
   touch src/components/music/MyMusicComponent.tsx
   ```

2. **Component template**
   ```typescript
   import React from 'react';
   import { useTranslation } from 'react-i18next';

   interface MyComponentProps {
     // Define props
   }

   const MyComponent: React.FC<MyComponentProps> = ({ }) => {
     const { t } = useTranslation();
     
     return (
       <div>
         <h2>{t('my_component_title')}</h2>
         {/* Component content */}
       </div>
     );
   };

   export default MyComponent;
   ```

3. **Add translations**
   ```json
   // src/locales/en.json
   {
     "my_component_title": "My Component"
   }

   // src/locales/he.json  
   {
     "my_component_title": "הרכיב שלי"
   }
   ```

### Adding External Integrations

1. **Create integration service**
   ```typescript
   // src/services/integrations/myService.ts
   export class MyServiceIntegrator {
     async syncData() {
       // Implementation
     }
   }
   ```

2. **Register in PromptLibraryIntegrator**
   ```typescript
   // Add to src/services/integrations/promptLibraryIntegrator.ts
   ```

3. **Add environment variables**
   ```bash
   # .env.example and .env.local
   MY_SERVICE_API_KEY=your_api_key
   ```

### Internationalization (i18n)

1. **Add translation keys**
   ```typescript
   // Use the t() function in components
   const { t } = useTranslation();
   return <span>{t('translation_key')}</span>;
   ```

2. **Extract translations**
   ```bash
   npm run i18n:extract  # (Future script)
   ```

3. **RTL Support**
   - Components automatically support RTL in Hebrew
   - Use `isRTL()` utility for conditional styling
   - CSS automatically flips for RTL languages

## 🎨 Styling and Theming

### CSS Architecture

- **CSS Variables**: Theme-based color system
- **Utility Classes**: Tailwind-inspired utilities
- **Component Styles**: Scoped styles in components
- **RTL Support**: Automatic layout direction switching

### Theme Customization

```typescript
// Themes are managed in ThemeContext
const themes = {
  light: {
    primary: '#6366f1',
    background: '#ffffff',
    // ... more colors
  },
  dark: {
    primary: '#818cf8', 
    background: '#0f172a',
    // ... more colors
  }
};
```

### ADHD-Friendly Styling

- Reduced animations for focus
- High contrast options
- Clear visual hierarchy
- Consistent interaction patterns

## 🧪 Testing Strategy

### Unit Tests (Future)
```bash
npm run test           # Run all tests
npm run test:unit      # Unit tests only
npm run test:watch     # Watch mode
```

### Integration Tests (Future)
```bash
npm run test:integration
```

### Accessibility Testing
- Screen reader compatibility
- Keyboard navigation
- Color contrast validation
- ADHD-friendly features

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Mobile Considerations
- Collapsible sidebar
- Touch-friendly interfaces
- Simplified ADHD features
- Hebrew mobile keyboard support

## 🚀 Building and Deployment

### Development Build
```bash
npm run dev          # Development server with hot reload
```

### Production Build  
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

### Environment Configuration
```bash
# Development
NODE_ENV=development

# Production  
NODE_ENV=production
VITE_API_BASE_URL=https://api.alchemist.ai
```

## 🔍 Debugging

### Development Tools
- React Developer Tools
- Browser DevTools
- Network tab for API calls
- Console logging for state changes

### Common Issues

1. **API Key Issues**
   ```bash
   # Check environment variables
   echo $GEMINI_API_KEY
   ```

2. **Translation Missing**
   - Check translation files in `src/locales/`
   - Ensure key exists in both `en.json` and `he.json`

3. **RTL Layout Issues**
   - Verify `dir="rtl"` is set correctly
   - Check CSS RTL overrides

## 🤝 Contributing Guidelines

### Git Workflow
1. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat: add amazing feature for Hebrew users"
   ```

3. **Push and create PR**
   ```bash
   git push origin feature/amazing-feature
   ```

### Code Standards
- **TypeScript**: Strict type checking
- **React**: Functional components with hooks
- **i18n**: All user-facing text must be translatable
- **Accessibility**: WCAG 2.1 AA compliance

### Commit Messages
Follow [Conventional Commits](https://conventionalcommits.org/):
- `feat:` New features
- `fix:` Bug fixes  
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes

## 📞 Support and Resources

### Getting Help
- 📧 **Email**: dev-support@alchemist.ai
- 💬 **Discord**: [Join our community](https://discord.gg/alchemist)
- 🐛 **Issues**: [GitHub Issues](https://github.com/JoyaTech/Alchemist/issues)

### Documentation
- 📖 **API Docs**: [docs.alchemist.ai/api](https://docs.alchemist.ai/api)
- 🎯 **User Guide**: [docs.alchemist.ai/guide](https://docs.alchemist.ai/guide)
- 🏗️ **Architecture**: [docs.alchemist.ai/architecture](https://docs.alchemist.ai/architecture)

### External Resources
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [i18next Documentation](https://www.i18next.com/)
- [Gemini API Reference](https://ai.google.dev/docs)

---

**Happy coding! 🧪✨**

Made with ❤️ for the Israeli tech community and creators worldwide.