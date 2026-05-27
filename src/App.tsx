import { useState, useCallback, type MouseEvent } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Board from './components/Board';
import Header from './components/Header';
import SkillsPage from './SkillsPage';
import { useTheme } from './hooks/useTheme';
import type { ContentType, Platform, Priority } from './types';
import './App.css';

export interface Filters {
  search: string;
  platform: Platform | '';
  contentType: ContentType | '';
  priority: Priority | '';
}

function Home() {
  const { theme, toggle } = useTheme();
  const [filters, setFilters] = useState<Filters>({
    search: '',
    platform: '',
    contentType: '',
    priority: '',
  });
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  return (
    <div
      className="app"
      onMouseMove={handleMouseMove}
      style={{
        ['--mouse-x' as string]: mousePos.x,
        ['--mouse-y' as string]: mousePos.y,
      }}
    >
      <div className="app-noise" />
      <div className="app-glow" />
      <Header
        filters={filters}
        onFilterChange={setFilters}
        theme={theme}
        onToggleTheme={toggle}
      />
      <nav className="app-nav">
        <Link to="/skills" className="nav-link">Skills</Link>
      </nav>
      <Board filters={filters} />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/skills" element={<SkillsPage />} />
    </Routes>
  );
}
