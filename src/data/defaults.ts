import type { Board, Card } from '../types';
import { generateId } from '../utils/id';
import { nowISO } from '../utils/date';

const columnDefinitions = [
  { id: generateId(), title: 'Idea' },
  { id: generateId(), title: 'Planning' },
  { id: generateId(), title: 'Shooting' },
  { id: generateId(), title: 'Editing' },
  { id: generateId(), title: 'Posted' },
  { id: generateId(), title: 'Archived' },
];

function sampleCard(
  _columnId: string,
  overrides: Partial<Card> = {},
): Card {
  return {
    id: generateId(),
    title: 'Untitled',
    description: '',
    contentType: 'photo',
    platform: 'instagram',
    tags: [],
    priority: 'medium',
    metrics: { likes: 0, comments: 0, views: 0 },
    attachments: [],
    ...overrides,
    dates: { createdAt: nowISO(), ...overrides.dates },
  };
}

export function createDefaultBoard(): Board {
  const columns = columnDefinitions.map((col) => ({ ...col, cardIds: [] as string[] }));
  const columnOrder = columns.map((c) => c.id);

  const ideaCards: Card[] = [
    sampleCard(columns[0].id, {
      title: 'Sunset timelapse at the pier',
      contentType: 'photo',
      platform: 'instagram',
      priority: 'high',
      tags: ['landscape', 'timelapse'],
    }),
    sampleCard(columns[0].id, {
      title: 'Behind-the-scenes reel for new lens',
      contentType: 'reel',
      platform: 'tiktok',
      priority: 'medium',
      tags: ['gear', 'bts'],
    }),
  ];

  const planningCards: Card[] = [
    sampleCard(columns[1].id, {
      title: 'Client portrait session brief',
      contentType: 'photo',
      platform: 'instagram',
      priority: 'high',
      tags: ['portrait', 'client'],
      dates: { createdAt: nowISO(), dueDate: new Date(Date.now() + 604800000).toISOString() },
    }),
  ];

  const postedCards: Card[] = [
    sampleCard(columns[4].id, {
      title: 'Golden hour cityscape',
      contentType: 'photo',
      platform: 'instagram',
      priority: 'low',
      tags: ['cityscape', 'golden-hour'],
      metrics: { likes: 234, comments: 18, views: 5400 },
      dates: { createdAt: nowISO(), publishDate: new Date(Date.now() - 86400000).toISOString() },
    }),
    sampleCard(columns[4].id, {
      title: 'Lightroom editing tutorial',
      contentType: 'short',
      platform: 'youtube',
      priority: 'medium',
      tags: ['tutorial', 'editing'],
      metrics: { likes: 89, comments: 12, views: 3200 },
      dates: { createdAt: nowISO(), publishDate: new Date(Date.now() - 172800000).toISOString() },
    }),
  ];

  const allCards = [...ideaCards, ...planningCards, ...postedCards];
  const cards: Record<string, Card> = {};
  for (const card of allCards) {
    cards[card.id] = card;
  }

  columns[0].cardIds = ideaCards.map((c) => c.id);
  columns[1].cardIds = planningCards.map((c) => c.id);
  columns[4].cardIds = postedCards.map((c) => c.id);

  return { columns, cards, columnOrder };
}
