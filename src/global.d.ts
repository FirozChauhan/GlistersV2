/* ─── Global ambient types for GlistersV2 ─── */

/* ─── Settings ─── */
interface Settings {
  iconSize: number;
  colGap: number;
  rowGap: number;
  cols: number;
  rows: number;
  labels: boolean;
  labelOp: number;
  labelColor: string;
  bkWidth: number;
  drWidth: number;
  mono: boolean;
  wallMono: boolean;
  blur: number;
}

/* ─── Site ─── */
interface Site {
  id: string;
  name: string;
  url: string;
  icon?: string;
}

/* ─── SaveDoc ─── */
interface SaveDoc {
  version: number;
  updatedAt: number;
  sites: Site[];
  settings: Settings;
  bookmarks?: unknown;
  walls?: unknown;
}

/* ─── Config ─── */
interface Config {
  gistId: string;
  githubToken: string;
  wallhavenKey: string;
  generatedAt: string;
}

/* ─── CommitOptions ─── */
interface CommitOptions {
  noRender?: boolean;
  noCloud?: boolean;
}

/* ─── IconCandidate ─── */
interface IconCandidate {
  src: string;
  preferred: boolean;
  chip?: boolean;
}

/* ─── MetaInfo ─── */
interface MetaInfo {
  title: string;
  icons: string[];
}

/* ─── SyncClient ─── */
interface SyncClient {
  cfg: { enabled: boolean };
  push(data: SaveDoc): Promise<boolean>;
  pull(): Promise<SaveDoc | null>;
}

/* ─── WallsClient ─── */
interface WallsClient {
  bind(cb: () => void): void;
  forDoc(): unknown;
  restore(d: unknown): void;
  next(): Promise<boolean>;
  refresh(): Promise<boolean>;
  reload(): Promise<boolean>;
  filter(type: string, value: string): Promise<boolean>;
  key(v: string): Promise<boolean>;
  fav(): boolean;
  favPool(): boolean;
  setSafe(): boolean;
  applySafe(): boolean;
  download(): Promise<boolean>;
}

/* ─── BookmarksClient ─── */
interface BookmarksClient {
  bind(cb?: () => void): void;
  forDoc(): null;
  restore(d?: unknown): void;
  refreshFromChrome(): Promise<boolean>;
}

/* ─── Wallhaven API ─── */
interface WhMeta {
  last_page: number;
}

interface WhData {
  path: string;
  dimension_x: number;
  dimension_y: number;
}

interface WhResponse {
  meta?: WhMeta;
  data?: WhData[];
}

/* ─── Bookmarks ─── */
interface BkNode {
  id: string;
  name: string;
  url?: string;
  parent: string | null;
  index: number;
}

interface BkTree {
  folders: BkNode[];
  items: BkNode[];
}

interface BkVisible {
  type: 'folder' | 'link';
  node: BkNode;
  depth: number;
}

interface BkEditor {
  parent: string | null;
  type: 'link' | 'folder';
  node: BkNode | null;
}

interface BkUI {
  open: boolean;
  folder: string | null;
  focusedId: string | null;
  armedId: string | null;
  armTimer: ReturnType<typeof setTimeout> | null;
  editor: BkEditor | null;
  visible: BkVisible[];
  dragId?: string | null;
}

/* ─── Walls ─── */
interface WallsState {
  key: string | null;
  list: string[];
  lastRefresh: number;
  purity: string;
  category: string;
  apikey: string;
  favs: string[];
  safe: string;
}

interface WallsDoc {
  v: number;
  key: string | null;
  list: string[];
  lastRefresh: number;
  purity: string;
  category: string;
  apikey: string;
  favs: string[];
  safe: string;
}

/* ─── Drag UI ─── */
interface DragUi {
  from: number;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  moved: boolean;
  ghost: HTMLElement | null;
  page: number;
  geom: GridMeasure | null;
  orig: Element[] | null;
  lastSlot: number;
  lastInGrid: boolean;
  pageChangedAt: number;
}

interface GridMeasure {
  originX: number;
  originY: number;
  strideX: number;
  strideY: number;
  cols: number;
  rows: number;
}

/* ─── Window globals ─── */
interface Window {
  CONFIG: Config;
  SYNC: SyncClient;
  WALLS: WallsClient;
  BOOKMARKS: BookmarksClient;
}