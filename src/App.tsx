import { useState } from 'react';
import Board from './components/Board';
import Header from './components/Header';
import type { ContentType, Platform, Priority } from './types';
import './App.css';

export interface Filters {
  search: string;
  platform: Platform | '';
  contentType: ContentType | '';
  priority: Priority | '';
}

export default function App() {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    platform: '',
    contentType: '',
    priority: '',
  });

  return (
    <div className="app">
      <Header filters={filters} onFilterChange={setFilters} />
      <Board filters={filters} />
    </div>
  );
}
