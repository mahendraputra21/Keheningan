# Keheningan

A quiet, contemplative exploration experience inspired by Zen, Wabi-sabi, Ma, and Enso. The player explores a small village, meets villagers and Nan In, and moves through simple moments of reflection.

## Concept

Keheningan is intentionally not a conventional RPG:

- no combat
- no XP
- no coins
- no leaderboard
- no competition
- no quest clutter

The focus is on atmosphere, exploration, dialogue, and reflection.

## Features

- Responsive web experience
- 5 contemplative scenes/screens
- Village exploration
- Villager interaction
- Nan In dialogue
- Reflection moments
- Indonesian / English language switching
- Offline-first PWA
- Local autosave using IndexedDB with localStorage fallback
- Ambient nature sound system
- No login
- No backend dependency

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Zustand
- IndexedDB / localStorage
- Web Audio API
- PWA / Service Worker

## Routes

- `/` — Landing page
- `/game` — Main game

## Audio

Nature sounds are used as the primary atmosphere, with scene-based transitions and gentle volume fading between village, river, and interior moments.

## Design

- Stitch-designed visual system
- Watercolor / washi / sumi-e inspired aesthetic
- Enso as the central visual symbol
- Minimal UI
- Responsive / mobile-first

## Offline & Privacy

- No account required
- No backend required for gameplay
- Game state stored locally
- Designed to work offline after assets are cached

## Development

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Deployment

Designed for Vercel deployment using the standard Next.js configuration. No custom `vercel.json` required.

## Project Status

MVP — active project. This README describes only currently implemented features.

## License

License: Not specified.
