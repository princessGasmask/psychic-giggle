import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, ChevronRight, Dices, FolderOpen, Gamepad2, Image, Library, Play, Plus, Settings, Sparkles, Tags, Upload, Users, Video, X } from 'lucide-react';
import { chooseTaggedMedia, generateBoard, movePlayer, resolveScore } from '../shared/game';
import type { BoardSpace, MediaItem, PersistedState, Player } from '../shared/types';

type Page = 'home' | 'library' | 'setup' | 'game';
const demoMedia: MediaItem[] = [
  { id: 'demo1', name: 'Neon city.jpg', path: '', url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80', kind: 'image', tags: ['Chill'] },
  { id: 'demo2', name: 'Mountain sunrise.jpg', path: '', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80', kind: 'image', tags: ['Adventure'] },
  { id: 'demo3', name: 'Arcade lights.jpg', path: '', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80', kind: 'image', tags: ['Hype'] },
];
const colors = ['#9b87f5', '#f779a5', '#54d6c5', '#f7c95c'];

export function App() {
  const [page, setPage] = useState<Page>('home');
  const [media, setMedia] = useState<MediaItem[]>(demoMedia);
  const [tags, setTags] = useState(['Chill', 'Adventure', 'Hype']);
  const [folderName, setFolderName] = useState('Demo collection');
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Player 1', color: colors[0], position: 0, stars: 6 },
    { id: '2', name: 'Player 2', color: colors[1], position: 0, stars: 3 },
  ]);
  const [board, setBoard] = useState<BoardSpace[]>([]);

  useEffect(() => { window.starplay?.loadState().then((state) => { if (state) { setMedia(state.media); setTags(state.tags); setFolderName(state.folderName); } }); }, []);
  const persist = (nextMedia: MediaItem[], nextTags = tags, nextFolder = folderName) => {
    setMedia(nextMedia); setTags(nextTags); setFolderName(nextFolder);
    const state: PersistedState = { media: nextMedia, tags: nextTags, folderName: nextFolder };
    void window.starplay?.saveState(state);
  };
  const startGame = () => { setBoard(generateBoard(24, tags)); setPage('game'); };

  return <div className="app-shell">
    <aside className="sidebar">
      <button className="brand" onClick={() => setPage('home')}><span className="brand-mark"><Sparkles size={22}/></span><span>STARPLAY<small>media party</small></span></button>
      <nav>
        <Nav icon={<Gamepad2/>} label="Play" active={page === 'home' || page === 'setup' || page === 'game'} onClick={() => setPage('home')}/>
        <Nav icon={<Library/>} label="Media library" active={page === 'library'} onClick={() => setPage('library')} count={media.length}/>
        <Nav icon={<Tags/>} label="Tags" onClick={() => setPage('library')} count={tags.length}/>
      </nav>
      <div className="sidebar-bottom"><Nav icon={<Settings/>} label="Settings" onClick={() => setPage('library')}/><div className="profile"><span>SP</span><div><b>Local player</b><small>Ready to play</small></div><i/></div></div>
    </aside>
    <main>{page === 'home' && <Home media={media} tags={tags} folder={folderName} onSetup={() => setPage('setup')} onLibrary={() => setPage('library')}/>} {page === 'library' && <MediaLibrary media={media} tags={tags} folderName={folderName} onChange={persist}/>} {page === 'setup' && <Setup players={players} setPlayers={setPlayers} tags={tags} onBack={() => setPage('home')} onStart={startGame}/>} {page === 'game' && <Game board={board} players={players} setPlayers={setPlayers} media={media} onExit={() => setPage('home')}/>}</main>
  </div>;
}

function Nav({ icon, label, active, onClick, count }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void; count?: number }) { return <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>{icon}<span>{label}</span>{count !== undefined && <em>{count}</em>}</button>; }

function Home({ media, tags, folder, onSetup, onLibrary }: { media: MediaItem[]; tags: string[]; folder: string; onSetup: () => void; onLibrary: () => void }) {
  return <div className="page home"><header><div><span className="eyebrow">WELCOME BACK, PLAYER</span><h1>Ready for another round?</h1><p>Your media. Your board. A different game every time.</p></div><button className="icon-button"><Settings size={20}/></button></header>
    <section className="hero-card"><div className="hero-copy"><span className="pill"><Sparkles size={14}/> PARTY MODE</span><h2>Turn your media<br/>into an <i>adventure.</i></h2><p>Roll the dice, race around the board, and discover moments from your collection along the way.</p><button className="primary large" onClick={onSetup}><Play fill="currentColor" size={18}/> Start a new game <ChevronRight size={18}/></button></div><div className="board-preview"><MiniBoard/><div className="floating-card fc-one">+3 <span>★</span></div><div className="floating-card fc-two"><Dices size={26}/> 5</div></div></section>
    <section className="stats"><article><div className="stat-icon purple"><Image/></div><div><span>MEDIA READY</span><strong>{media.length}</strong><small>photos & videos</small></div><button onClick={onLibrary}><ChevronRight/></button></article><article><div className="stat-icon pink"><Tags/></div><div><span>ACTIVE TAGS</span><strong>{tags.length}</strong><small>across your library</small></div><button onClick={onLibrary}><ChevronRight/></button></article><article><div className="stat-icon teal"><FolderOpen/></div><div><span>MEDIA FOLDER</span><strong className="folder-stat">{folder}</strong><small>currently selected</small></div><button onClick={onLibrary}><ChevronRight/></button></article></section>
    <div className="section-title"><div><span className="eyebrow">HOW IT WORKS</span><h3>Three steps to play</h3></div></div><section className="steps"><article><b>01</b><div className="step-orb"><FolderOpen/></div><h4>Pick your media</h4><p>Choose a folder full of photos and videos you love.</p></article><i/><article><b>02</b><div className="step-orb"><Tags/></div><h4>Tag the moments</h4><p>Organize your library with tags that become board spaces.</p></article><i/><article><b>03</b><div className="step-orb"><Dices/></div><h4>Roll & discover</h4><p>Land on a tag to reveal a random moment from your collection.</p></article></section>
  </div>;
}

function MiniBoard() { const spaces = ['blue','tag','red','blue','neutral','tag','blue','red','blue','tag','neutral','blue']; return <div className="mini-board">{spaces.map((s,i)=><div key={i} className={`mini-space ${s}`} style={{'--i':i} as React.CSSProperties}>{s === 'tag' ? <Image/> : s === 'blue' ? '+3' : s === 'red' ? '−3' : '★'}</div>)}<div className="mini-center"><Sparkles/><b>STAR<br/>PLAY</b></div></div>; }

function MediaLibrary({ media, tags, folderName, onChange }: { media: MediaItem[]; tags: string[]; folderName: string; onChange: (m: MediaItem[], t?: string[], f?: string) => void }) {
  const input = useRef<HTMLInputElement>(null); const [selected, setSelected] = useState<string | null>(media[0]?.id ?? null); const [newTag, setNewTag] = useState('');
  const chooseFolder = async () => { if (window.starplay) { const result = await window.starplay.selectMediaFolder(); if (result) onChange(result.media, tags, result.folderName); } else input.current?.click(); };
  const browserFiles = (files: FileList | null) => { if (!files) return; const accepted = Array.from(files).filter(f => /\.(jpe?g|png|mp4|webm)$/i.test(f.name)).map((f, i): MediaItem => ({ id: `${f.name}-${f.size}-${i}`, name: f.name, path: f.webkitRelativePath, url: URL.createObjectURL(f), kind: /\.(mp4|webm)$/i.test(f.name) ? 'video' : 'image', tags: [] })); onChange(accepted, tags, files[0]?.webkitRelativePath.split('/')[0] || 'Selected folder'); };
  const addTag = () => { const clean = newTag.trim(); if (clean && !tags.includes(clean)) { onChange(media, [...tags, clean]); setNewTag(''); } };
  const toggleTag = (id: string, tag: string) => onChange(media.map(m => m.id === id ? { ...m, tags: m.tags.includes(tag) ? m.tags.filter(t => t !== tag) : [...m.tags, tag] } : m));
  return <div className="page library-page"><header><div><span className="eyebrow">YOUR COLLECTION</span><h1>Media library</h1><p>Choose a folder, preview files, and tag moments for the board.</p></div><button className="primary" onClick={chooseFolder}><Upload size={18}/> Choose folder</button><input ref={input} hidden type="file" multiple {...({ webkitdirectory: '' } as object)} onChange={e => browserFiles(e.target.files)}/></header><div className="folder-banner"><FolderOpen/><div><small>CURRENT FOLDER</small><b>{folderName}</b></div><span>{media.length} supported files</span></div>
    <div className="library-layout"><section><div className="toolbar"><h3>All media <span>{media.length}</span></h3><div><button className="filter active">All</button><button className="filter">Images</button><button className="filter">Videos</button></div></div>{media.length ? <div className="media-grid">{media.map(item => <button key={item.id} className={`media-tile ${selected === item.id ? 'selected' : ''}`} onClick={() => setSelected(item.id)}>{item.kind === 'video' ? <video src={item.url}/> : <img src={item.url} alt=""/>}<span className="kind">{item.kind === 'video' ? <Video/> : <Image/>}</span><div><b>{item.name}</b><small>{item.tags.join(' · ') || 'Untagged'}</small></div>{selected === item.id && <i><Check/></i>}</button>)}</div> : <div className="empty"><FolderOpen/><h3>No media yet</h3><p>Choose a folder containing JPG, PNG, MP4, or WebM files.</p></div>}</section><aside className="tag-panel"><span className="eyebrow">TAG EDITOR</span><h3>{selected ? 'Tag selected media' : 'Select a media item'}</h3><p>Tagged moments can appear as special spaces on your board.</p><div className="tag-create"><input placeholder="New tag name" value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()}/><button onClick={addTag}><Plus/></button></div><div className="tag-list">{tags.map((tag, i) => { const active = media.find(m => m.id === selected)?.tags.includes(tag); return <button key={tag} className={active ? 'active' : ''} onClick={() => selected && toggleTag(selected, tag)}><span style={{background: colors[i % colors.length]}}/><b>{tag}</b>{active && <Check/>}</button>; })}</div></aside></div>
  </div>;
}

function Setup({ players, setPlayers, tags, onBack, onStart }: { players: Player[]; setPlayers: (p: Player[]) => void; tags: string[]; onBack: () => void; onStart: () => void }) {
  const add = () => players.length < 4 && setPlayers([...players, { id: crypto.randomUUID(), name: `Player ${players.length + 1}`, color: colors[players.length], position: 0, stars: 0 }]);
  return <div className="page setup-page"><button className="back" onClick={onBack}><ArrowLeft/> Back</button><div className="setup-head"><span className="eyebrow">GAME SETUP</span><h1>Gather your players</h1><p>Choose who is playing. The board will be freshly generated from your tags.</p></div><section className="setup-card"><div className="setup-label"><Users/><div><h3>Players</h3><p>Two to four local players</p></div><span>{players.length}/4</span></div><div className="players-list">{players.map((player, i) => <div className="player-row" key={player.id}><span className="player-token" style={{background: player.color}}>{i + 1}</span><input value={player.name} onChange={e => setPlayers(players.map(p => p.id === player.id ? {...p, name: e.target.value} : p))}/>{players.length > 2 && <button onClick={() => setPlayers(players.filter(p => p.id !== player.id))}><X/></button>}</div>)}{players.length < 4 && <button className="add-player" onClick={add}><Plus/> Add player</button>}</div></section><section className="setup-card board-config"><div className="setup-label"><Sparkles/><div><h3>Your board</h3><p>A new route every game</p></div></div><div className="config-grid"><div><small>SPACES</small><b>24</b></div><div><small>MEDIA TAGS</small><b>{tags.length}</b></div><div><small>PLAY STYLE</small><b>Classic</b></div></div><p className="hint"><Sparkles/> Every active tag is guaranteed a space on the board.</p></section><button className="primary launch" disabled={players.length < 2} onClick={onStart}><Dices/> Generate board & play</button></div>;
}

function Game({ board, players, setPlayers, media, onExit }: { board: BoardSpace[]; players: Player[]; setPlayers: (p: Player[]) => void; media: MediaItem[]; onExit: () => void }) {
  const [turn, setTurn] = useState(0); const [roll, setRoll] = useState<number | null>(null); const [rolling, setRolling] = useState(false); const [event, setEvent] = useState<{item: MediaItem; seconds: number} | null>(null);
  const current = players[turn];
  const doRoll = () => { if (rolling) return; setRolling(true); setRoll(null); window.setTimeout(() => { const value = Math.floor(Math.random() * 6) + 1; setRoll(value); const moved = movePlayer(current, value, board.length); const space = board[moved.position]; const scored = resolveScore(moved, space); setPlayers(players.map((p, i) => i === turn ? scored : p)); if (space.kind === 'tag' && space.tag) { const item = chooseTaggedMedia(media, space.tag); if (item) setEvent({ item, seconds: Math.floor(Math.random() * 26) + 5 }); } setRolling(false); }, 750); };
  const next = () => { setRoll(null); setTurn((turn + 1) % players.length); };
  return <div className="game-page"><header className="game-top"><button className="back" onClick={onExit}><X/> Exit game</button><div><Sparkles/> ROUND 1</div><button className="icon-button"><Settings/></button></header><div className="game-layout"><section className="game-board-wrap"><div className="game-board">{board.map((space, i) => { const angle = (i / board.length) * Math.PI * 2 - Math.PI / 2; const x = 50 + 41 * Math.cos(angle); const y = 50 + 41 * Math.sin(angle); return <div key={space.id} className={`board-space ${space.kind}`} style={{left:`${x}%`,top:`${y}%`}}><span>{space.kind === 'blue' ? '+3' : space.kind === 'red' ? '−3' : space.kind === 'tag' ? <Image/> : space.kind === 'start' ? 'GO' : '★'}</span>{players.filter(p => p.position === i).map(p => <i key={p.id} style={{background:p.color}}/> )}</div>; })}<div className="board-core"><span>TURN {turn + 1}</span><b>{current.name}</b><div className={rolling ? 'die rolling' : 'die'}>{roll ?? <Dices/>}</div><button className="primary" onClick={roll ? next : doRoll}>{roll ? 'End turn' : 'Roll the dice'}</button></div></div></section><aside className="score-panel"><span className="eyebrow">SCOREBOARD</span>{players.map((p, i) => <article className={i === turn ? 'current' : ''} key={p.id}><span style={{background:p.color}}>{i + 1}</span><div><b>{p.name}</b><small>{i === turn ? 'Playing now' : `Space ${p.position}`}</small></div><strong>{p.stars} ★</strong></article>)}<div className="legend"><h4>BOARD SPACES</h4><p><i className="blue"/> Gain 3 stars</p><p><i className="red"/> Lose 3 stars</p><p><i className="tag"/> Play tagged media</p></div></aside></div>{event && <MediaEvent event={event} onClose={() => setEvent(null)}/>}</div>;
}

function MediaEvent({ event, onClose }: { event: {item: MediaItem; seconds: number}; onClose: () => void }) {
  const [left, setLeft] = useState(event.seconds); const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => { const timer = window.setInterval(() => setLeft(v => { if (v <= 1) { window.clearInterval(timer); onClose(); return 0; } return v - 1; }), 1000); return () => window.clearInterval(timer); }, [onClose]);
  const loaded = () => { const video = videoRef.current; if (video?.duration && Number.isFinite(video.duration)) { video.currentTime = Math.random() * Math.max(0, video.duration - Math.min(event.seconds, video.duration)); void video.play(); } };
  return <div className="event-overlay"><div className="event-modal"><div className="event-meta"><span><Sparkles/> MEDIA MOMENT</span><b>{left}s</b></div>{event.item.kind === 'video' ? <video ref={videoRef} src={event.item.url} onLoadedMetadata={loaded} autoPlay muted/> : <img src={event.item.url} alt={event.item.name}/>}<div className="event-footer"><div><small>NOW PLAYING</small><h3>{event.item.name}</h3><p>{event.item.tags.join(' · ')}</p></div><button onClick={onClose}>Skip <ChevronRight/></button></div></div></div>;
}
