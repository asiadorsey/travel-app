# GitHub Codespaces Configuration

This directory contains the configuration for running the Travel App Vite project in GitHub Codespaces.

## Quick Start

1. **Open in Codespaces**: Click the "Code" button on your GitHub repository and select "Open with Codespaces"
2. **Wait for Setup**: The container will automatically:
   - Install Node.js 18 and npm
   - Install project dependencies (`npm install`)
   - Start the Vite development server (`npm run dev`)
3. **Access Your App**: The Vite dev server will be available at port 5173

## Port Forwarding

- **Port 5173**: Vite development server (auto-opens in preview)
- **Port 3000**: Alternative development port

## Included Extensions

- Tailwind CSS IntelliSense
- Prettier code formatter
- TypeScript support
- ESLint integration
- React development tools
- Path intellisense
- Auto rename tag

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Environment Features

- **Node.js 18**: Latest LTS version
- **npm**: Latest version
- **Git**: Version control
- **GitHub CLI**: GitHub integration
- **Development Tools**: ESLint, Prettier, TypeScript globally installed

## Troubleshooting

If you encounter issues:

1. **Rebuild Container**: Use Command Palette → "Codespaces: Rebuild Container"
2. **Check Ports**: Ensure ports 5173 and 3000 are forwarded
3. **Restart Dev Server**: Run `npm run dev` manually if needed
4. **Clear npm Cache**: Run `npm cache clean --force` if dependency issues occur

## Benefits

- ✅ Stable cloud environment (no local network issues)
- ✅ Consistent setup across sessions
- ✅ Reliable port forwarding
- ✅ No more "connection refused" errors
- ✅ Better performance for npm installs
- ✅ Pre-configured development tools
