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

  const now = Date.now();
  const day = 86400000;

  const ideaCards: Card[] = [
    sampleCard(columns[0].id, {
      title: 'Sunset timelapse at Santa Monica Pier',
      description: '**Idea:** 4K timelapse of sunset with clouds moving over the pier.\n\n**Gear needed:** Tripod, ultra-wide lens, intervalometer.\n\nScout location first for best composition.',
      contentType: 'photo',
      platform: 'instagram',
      priority: 'high',
      tags: ['landscape', 'timelapse', 'sunset'],
    }),
    sampleCard(columns[0].id, {
      title: 'Behind-the-scenes reel: new lens unboxing',
      description: 'Quick BTS style reel showing the new 85mm f/1.4.\n\n### Shot list:\n- Unboxing\n- Lens mount\n- First test shots\n- Reaction shots',
      contentType: 'reel',
      platform: 'tiktok',
      priority: 'medium',
      tags: ['gear', 'bts', 'lens'],
    }),
    sampleCard(columns[0].id, {
      title: 'YouTube: Complete color grading tutorial',
      description: 'Full walkthrough of my color grading workflow in Capture One + Photoshop.\n\nTopics:\n- White balance\n- Curves\n- Split toning\n- HSL panels',
      contentType: 'short',
      platform: 'youtube',
      priority: 'low',
      tags: ['tutorial', 'color-grading', 'education'],
    }),
  ];

  const planningCards: Card[] = [
    sampleCard(columns[1].id, {
      title: 'Client portrait session — Sarah',
      description: '**Client brief:** Headshots for LinkedIn + personal brand.\n\n**Location:** Downtown studio\n**Time:** 10am (golden hour for window light)\n**Wardrobe:** 3 changes (professional, casual, bold)',
      contentType: 'photo',
      platform: 'instagram',
      priority: 'high',
      tags: ['portrait', 'client', 'headshot'],
      dates: { createdAt: nowISO(), dueDate: new Date(now + 3 * day).toISOString() },
    }),
    sampleCard(columns[1].id, {
      title: 'Mood board: Urban street fashion',
      description: 'Collecting references for an urban fashion shoot.\n\n### References needed:\n- Street style looks\n- Lighting references\n- Location scouting shots\n- Color palette ideas',
      contentType: 'carousel',
      platform: 'instagram',
      priority: 'medium',
      tags: ['fashion', 'urban', 'moodboard'],
      dates: { createdAt: nowISO(), dueDate: new Date(now + 7 * day).toISOString() },
    }),
  ];

  const shootingCards: Card[] = [
    sampleCard(columns[2].id, {
      title: 'Product shots — new jewelry line',
      description: 'In studio shooting product photography for a jewelry brand.\n\n**Setup:** Macro lens, focus stacking, reflective surfaces.\n**Status:** 60% complete — need ring + bracelet shots.',
      contentType: 'photo',
      platform: 'instagram',
      priority: 'high',
      tags: ['product', 'studio', 'commercial'],
      dates: { createdAt: nowISO(), dueDate: new Date(now + 2 * day).toISOString() },
    }),
  ];

  const editingCards: Card[] = [
    sampleCard(columns[3].id, {
      title: 'Wedding gallery — Johnson & Maria',
      description: 'Editing 300+ photos from a weekend wedding.\n\n**Culling:** 80% done\n**Color grading:** Started\n**Retouching:** Not started\n\nDelivery due in 2 weeks.',
      contentType: 'carousel',
      platform: 'instagram',
      priority: 'high',
      tags: ['wedding', 'retouching', 'client'],
      dates: { createdAt: nowISO(), shotDate: new Date(now - 5 * day).toISOString(), dueDate: new Date(now + 14 * day).toISOString() },
    }),
  ];

  const postedCards: Card[] = [
    sampleCard(columns[4].id, {
      title: 'Golden hour at Griffith Observatory',
      description: 'Classic LA skyline shot from Griffith.\n\n**Gear:** Sony A7IV + 24-70 GM\n**Settings:** f/8, 1/250s, ISO 100',
      contentType: 'photo',
      platform: 'instagram',
      priority: 'low',
      tags: ['landscape', 'golden-hour', 'la'],
      metrics: { likes: 1247, comments: 89, views: 28400 },
      dates: { createdAt: nowISO(), publishDate: new Date(now - 1 * day).toISOString() },
    }),
    sampleCard(columns[4].id, {
      title: 'Lightroom masking tips & tricks',
      description: 'Walkthrough of all the new AI masking tools in Lightroom.\n\n**Views:** Strong first-day performance.',
      contentType: 'short',
      platform: 'youtube',
      priority: 'medium',
      tags: ['tutorial', 'lightroom', 'editing'],
      metrics: { likes: 892, comments: 134, views: 34200 },
      dates: { createdAt: nowISO(), publishDate: new Date(now - 2 * day).toISOString() },
    }),
  ];

  const archivedCards: Card[] = [
    sampleCard(columns[5].id, {
      title: 'Summer lookbook — 2025 collection',
      description: 'Seasonal lookbook shoot for a local boutique. Published and done.',
      contentType: 'carousel',
      platform: 'instagram',
      priority: 'low',
      tags: ['fashion', 'lookbook', 'archived'],
      metrics: { likes: 3421, comments: 267, views: 89200 },
      dates: { createdAt: nowISO(), publishDate: new Date(now - 90 * day).toISOString() },
    }),
  ];

  const allCards = [
    ...ideaCards, ...planningCards, ...shootingCards,
    ...editingCards, ...postedCards, ...archivedCards,
  ];
  const cards: Record<string, Card> = {};
  for (const card of allCards) {
    cards[card.id] = card;
  }

  columns[0].cardIds = ideaCards.map((c) => c.id);
  columns[1].cardIds = planningCards.map((c) => c.id);
  columns[2].cardIds = shootingCards.map((c) => c.id);
  columns[3].cardIds = editingCards.map((c) => c.id);
  columns[4].cardIds = postedCards.map((c) => c.id);
  columns[5].cardIds = archivedCards.map((c) => c.id);

  return { columns, cards, columnOrder };
}
