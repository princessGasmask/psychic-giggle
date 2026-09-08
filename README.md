# Starplay

Starplay turns a local media folder into a party-game board. Import JPG, PNG, MP4, and WebM files, assign custom tags, and land on tag spaces to play a random moment.

## Development

```bash
npm install
npm run dev
```

The Vite renderer is also usable in a browser. In browser mode the folder picker uses `webkitdirectory`; the packaged Electron app uses a restricted preload bridge for native folder access and persistent local state.

## Checks

```bash
npm test
npm run build
```
