import { useState } from 'react';
import { useBoard } from '../data/store';
import './Header.css';

export default function Header() {
  const { board, dispatch } = useBoard();
  const [search, setSearch] = useState('');

  function handleExport() {
    const blob = new Blob([JSON.stringify(board, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kanban-board.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result as string);
          if (parsed.columns && parsed.cards && parsed.columnOrder) {
            dispatch({ type: 'IMPORT_BOARD', board: parsed });
          } else {
            alert('Invalid board file');
          }
        } catch {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
    localStorage.setItem('kanban-theme', current === 'dark' ? 'light' : 'dark');
  }

  return (
    <header className="header">
      <h1 className="header-title">📷 Content Kanban</h1>
      <div className="header-actions">
        <input
          className="header-search"
          type="text"
          placeholder="Search cards..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="header-btn" onClick={handleExport} title="Export board">📥 Export</button>
        <button className="header-btn" onClick={handleImport} title="Import board">📤 Import</button>
        <button className="header-btn" onClick={toggleTheme} title="Toggle dark mode">🌙</button>
      </div>
    </header>
  );
}
