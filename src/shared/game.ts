import type { BoardSpace, MediaItem, Player } from './types';

export function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => ((value = Math.imul(value ^ (value >>> 15), 1 | value) + 0x6d2b79f5 | 0), ((value ^ value >>> 14) >>> 0) / 4294967296);
}

export function generateBoard(size: number, tags: string[], seed = Date.now()): BoardSpace[] {
  const random = seededRandom(seed);
  const board: BoardSpace[] = [{ id: 0, kind: 'start' }];
  const guaranteed = [...tags].sort(() => random() - 0.5);
  for (let id = 1; id < Math.max(8, size); id += 1) {
    if (guaranteed.length) board.push({ id, kind: 'tag', tag: guaranteed.shift() });
    else {
      const roll = random();
      board.push({ id, kind: roll < 0.42 ? 'blue' : roll < 0.67 ? 'red' : roll < 0.82 && tags.length ? 'tag' : 'neutral', tag: roll >= 0.67 && roll < 0.82 && tags.length ? tags[Math.floor(random() * tags.length)] : undefined });
    }
  }
  return board;
}

export function movePlayer(player: Player, roll: number, boardSize: number): Player {
  return { ...player, position: (player.position + roll) % boardSize };
}

export function resolveScore(player: Player, space: BoardSpace): Player {
  if (space.kind === 'blue') return { ...player, stars: player.stars + 3 };
  if (space.kind === 'red') return { ...player, stars: Math.max(0, player.stars - 3) };
  return player;
}

export function chooseTaggedMedia(media: MediaItem[], tag: string, random = Math.random) {
  const matching = media.filter((item) => item.tags.includes(tag));
  return matching.length ? matching[Math.floor(random() * matching.length)] : null;
}
