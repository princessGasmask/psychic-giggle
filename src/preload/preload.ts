import { contextBridge, ipcRenderer } from 'electron';
import type { ElectronAPI, PersistedState } from '../shared/types';

const api: ElectronAPI = {
  selectMediaFolder: () => ipcRenderer.invoke('media:select-folder'),
  loadState: () => ipcRenderer.invoke('state:load'),
  saveState: (state: PersistedState) => ipcRenderer.invoke('state:save', state),
};
contextBridge.exposeInMainWorld('starplay', api);
