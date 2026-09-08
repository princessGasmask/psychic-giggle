import { describe, expect, it } from 'vitest';
import { chooseTaggedMedia, generateBoard, movePlayer, resolveScore } from './game';
import type { MediaItem, Player } from './types';
const player: Player = { id: '1', name: 'Player', color: '#fff', position: 22, stars: 2 };
describe('game engine', () => {
  it('generates a reproducible board with every tag', () => { const first = generateBoard(24, ['Chill', 'Hype'], 42); expect(first).toEqual(generateBoard(24, ['Chill', 'Hype'], 42)); expect(first[0].kind).toBe('start'); expect(first.filter(space => space.kind === 'tag').map(space => space.tag)).toEqual(expect.arrayContaining(['Chill', 'Hype'])); });
  it('wraps movement and prevents negative stars', () => { expect(movePlayer(player, 4, 24).position).toBe(2); expect(resolveScore(player, { id: 1, kind: 'red' }).stars).toBe(0); expect(resolveScore(player, { id: 1, kind: 'blue' }).stars).toBe(5); });
  it('chooses only matching tagged media', () => { const items: MediaItem[] = [{ id:'1', name:'one.jpg', path:'', url:'', kind:'image', tags:['Chill'] }, { id:'2', name:'two.jpg', path:'', url:'', kind:'image', tags:['Hype'] }]; expect(chooseTaggedMedia(items, 'Chill', () => 0)?.id).toBe('1'); expect(chooseTaggedMedia(items, 'Missing')).toBeNull(); });
});
