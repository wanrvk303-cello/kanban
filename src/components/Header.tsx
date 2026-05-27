import { useState } from 'react';
import { useBoard } from '../data/store';
import { createDefaultBoard } from '../data/defaults';
import FilterBar from './FilterBar';
import { useTheme } from '../hooks/useTheme';
import type { Filters } from '../App';
import './Header.css';

interface Props {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export default function Header({ filters, onFilterChange }: Props) {
  const { board, dispatch } = useBoard();
  const { theme, toggle } = useTheme();
  const [showReset, setShowReset] = useState(false);

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

  function handleReset() {
    dispatch({ type: 'IMPORT_BOARD', board: createDefaultBoard() });
    setShowReset(false);
  }

  return (
    <header className="header">
      <h1 className="header-title">📷 Content Kanban</h1>
      <FilterBar filters={filters} onChange={onFilterChange} />
      <div className="header-actions">
        <button className="header-btn" onClick={handleExport} title="Export board">📥 Export</button>
        <button className="header-btn" onClick={handleImport} title="Import board">📤 Import</button>
        <button className="header-btn header-btn-danger" onClick={() => setShowReset(true)} title="Reset to defaults">🔄 Reset</button>
        <button className="header-btn" onClick={toggle} title="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
      {showReset && (
        <div className="confirm-overlay" onClick={() => setShowReset(false)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <p>Reset board to default sample data?</p>
            <p className="confirm-warning">This will delete all your current cards and columns.</p>
            <div className="confirm-actions">
              <button className="btn" onClick={() => setShowReset(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleReset}>Reset</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
