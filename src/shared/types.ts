export type MediaKind = 'image' | 'video';
export interface MediaItem { id: string; name: string; path: string; url: string; kind: MediaKind; tags: string[] }
export type SpaceKind = 'start' | 'blue' | 'red' | 'tag' | 'neutral';
export interface BoardSpace { id: number; kind: SpaceKind; tag?: string }
export interface Player { id: string; name: string; color: string; position: number; stars: number }
export interface PersistedState { media: MediaItem[]; tags: string[]; folderName: string }
export interface ElectronAPI {
  selectMediaFolder: () => Promise<{ folderName: string; media: MediaItem[] } | null>;
  loadState: () => Promise<PersistedState | null>;
  saveState: (state: PersistedState) => Promise<void>;
}
