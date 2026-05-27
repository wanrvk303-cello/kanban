export type ContentType = 'photo' | 'reel' | 'short' | 'blog' | 'carousel' | 'story' | 'other';

export type Platform = 'instagram' | 'youtube' | 'tiktok' | 'blog' | 'print' | 'other';

export type Priority = 'low' | 'medium' | 'high';

export interface CardMetrics {
  likes: number;
  comments: number;
  views: number;
}

export interface CardDates {
  createdAt: string;
  dueDate?: string;
  shotDate?: string;
  publishDate?: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
}

export interface Card {
  id: string;
  title: string;
  description: string;
  contentType: ContentType;
  platform: Platform;
  tags: string[];
  priority: Priority;
  metrics: CardMetrics;
  dates: CardDates;
  attachments: Attachment[];
  coverImage?: string;
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
}

export interface Board {
  columns: Column[];
  cards: Record<string, Card>;
  columnOrder: string[];
}

export type BoardAction =
  | { type: 'ADD_COLUMN'; title: string }
  | { type: 'RENAME_COLUMN'; columnId: string; title: string }
  | { type: 'DELETE_COLUMN'; columnId: string }
  | { type: 'REORDER_COLUMNS'; columnOrder: string[] }
  | { type: 'ADD_CARD'; columnId: string; card: Card }
  | { type: 'UPDATE_CARD'; card: Card }
  | { type: 'DELETE_CARD'; cardId: string }
  | { type: 'MOVE_CARD'; cardId: string; toColumnId: string; index: number }
  | { type: 'REORDER_CARDS_IN_COLUMN'; columnId: string; cardIds: string[] }
  | { type: 'IMPORT_BOARD'; board: Board };
