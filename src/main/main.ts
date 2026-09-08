import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import type { MediaItem, PersistedState } from '../shared/types';

const supported: Record<string, 'image' | 'video'> = { '.jpg': 'image', '.jpeg': 'image', '.png': 'image', '.mp4': 'video', '.webm': 'video' };
const statePath = () => path.join(app.getPath('userData'), 'starplay-library.json');

async function scan(folder: string): Promise<MediaItem[]> {
  const output: MediaItem[] = [];
  async function visit(directory: string) {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(absolute);
      else {
        const kind = supported[path.extname(entry.name).toLowerCase()];
        if (kind) output.push({ id: Buffer.from(absolute).toString('base64url'), name: entry.name, path: absolute, url: pathToFileURL(absolute).href, kind, tags: [] });
      }
    }
  }
  await visit(folder);
  return output;
}

function createWindow() {
  const win = new BrowserWindow({ width: 1440, height: 940, minWidth: 980, minHeight: 720, backgroundColor: '#090b13', titleBarStyle: 'hiddenInset', webPreferences: { preload: path.join(__dirname, '../preload/preload.js'), contextIsolation: true, nodeIntegration: false } });
  if (process.env.VITE_DEV_SERVER_URL) void win.loadURL(process.env.VITE_DEV_SERVER_URL);
  else void win.loadFile(path.join(__dirname, '../../dist/index.html'));
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

ipcMain.handle('media:select-folder', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  if (result.canceled || !result.filePaths[0]) return null;
  const folder = result.filePaths[0];
  return { folderName: path.basename(folder), media: await scan(folder) };
});
ipcMain.handle('state:load', async () => { try { return JSON.parse(await fs.readFile(statePath(), 'utf8')) as PersistedState; } catch { return null; } });
ipcMain.handle('state:save', async (_event, state: PersistedState) => { await fs.writeFile(statePath(), JSON.stringify(state, null, 2)); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
