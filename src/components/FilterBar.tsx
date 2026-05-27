import { useState } from 'react';
import type { ContentType, Platform, Priority } from '../types';
import './FilterBar.css';

export interface Filters {
  search: string;
  platform: Platform | '';
  contentType: ContentType | '';
  priority: Priority | '';
}

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const CONTENT_TYPES: ContentType[] = ['photo', 'reel', 'short', 'blog', 'carousel', 'story', 'other'];
const PLATFORMS: Platform[] = ['instagram', 'youtube', 'tiktok', 'blog', 'print', 'other'];
const PRIORITIES: Priority[] = ['low', 'medium', 'high'];

export default function FilterBar({ filters, onChange }: Props) {
  function update(partial: Partial<Filters>) {
    onChange({ ...filters, ...partial });
  }

  return (
    <div className="filterbar">
      <input
        className="filterbar-search"
        type="text"
        placeholder="Search cards..."
        value={filters.search}
        onChange={(e) => update({ search: e.target.value })}
      />
      <select
        className="filterbar-select"
        value={filters.contentType}
        onChange={(e) => update({ contentType: e.target.value as ContentType | '' })}
      >
        <option value="">All types</option>
        {CONTENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <select
        className="filterbar-select"
        value={filters.platform}
        onChange={(e) => update({ platform: e.target.value as Platform | '' })}
      >
        <option value="">All platforms</option>
        {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>
      <select
        className="filterbar-select"
        value={filters.priority}
        onChange={(e) => update({ priority: e.target.value as Priority | '' })}
      >
        <option value="">All priorities</option>
        {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>
    </div>
  );
}
