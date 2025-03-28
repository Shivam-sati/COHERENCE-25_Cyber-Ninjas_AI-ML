# Next.js 14 Project

A modern Next.js 14 project with TypeScript, TailwindCSS, and a custom design system.

## Features

- Next.js 14 with App Router
- TypeScript with strict type checking
- TailwindCSS with custom design system
- Dark/Light mode support
- ESLint and Prettier configuration
- Modern component architecture
- Type-safe utilities

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── app/              # App router pages and layouts
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   └── ...          # Feature-specific components
├── lib/             # Utility functions and shared logic
└── styles/          # Global styles and TailwindCSS configuration
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Environment Variables

Copy `.env.example` to `.env` and update the values as needed:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## License

MIT
