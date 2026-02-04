

export interface ArtMeta {
  ratio: number;
  orientation: 'portrait' | 'landscape' | 'square';
  palette: string[];
  accent_color: string;
}

export interface ArtUrls {
  originals: string;
  '1450': string;
  '580': string;
  '290': string;
}

export interface ArtItem {
  id: string;
  category: string;
  path_id: string;
  urls: ArtUrls;
  meta: ArtMeta;
}

export enum AppMode {
  GRID = 'GRID',
  PLAYGROUND = 'PLAYGROUND',
  REEL = 'REEL',
  DECK = 'DECK',
  OVERVIEW = 'OVERVIEW'
}