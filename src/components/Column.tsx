import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useBoard } from '../data/store';
import type { Column as ColumnType } from '../types';
import Card from './Card';
import CardModal from './CardModal';
import './Column.css';

interface Props {
  column: ColumnType;
}

export default function Column({ column }: Props) {
  const { board, dispatch } = useBoard();
  const { setNodeRef } = useDroppable({ id: column.id });
  const [modalCardId, setModalCardId] = useState<string | null>(null);
  const [showNewCard, setShowNewCard] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameTitle, setRenameTitle] = useState(column.title);

  function handleRename() {
    if (renameTitle.trim() && renameTitle.trim() !== column.title) {
      dispatch({ type: 'RENAME_COLUMN', columnId: column.id, title: renameTitle.trim() });
    }
    setRenaming(false);
  }

  function handleDelete() {
    if (window.confirm(`Delete column "${column.title}" and all its cards?`)) {
      dispatch({ type: 'DELETE_COLUMN', columnId: column.id });
    }
    setShowMenu(false);
  }

  return (
    <>
      <div className="column">
        <div className="column-header">
          {renaming ? (
            <input
              className="column-rename-input"
              value={renameTitle}
              onChange={(e) => setRenameTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename();
                if (e.key === 'Escape') setRenaming(false);
              }}
              onBlur={handleRename}
              autoFocus
            />
          ) : (
            <h2 className="column-title">{column.title}</h2>
          )}
          <div className="column-header-right">
            <span className="column-count">{column.cardIds.length}</span>
            <div className="column-menu-wrap">
              <button className="column-menu-btn" onClick={() => setShowMenu(!showMenu)}>⋮</button>
              {showMenu && (
                <div className="column-menu">
                  <button onClick={() => { setRenaming(true); setRenameTitle(column.title); setShowMenu(false); }}>
                    Rename
                  </button>
                  <button className="menu-danger" onClick={handleDelete}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div ref={setNodeRef} className="column-cards">
          <SortableContext
            items={column.cardIds}
            strategy={verticalListSortingStrategy}
          >
            {column.cardIds.length === 0 && (
              <div className="column-empty">Drop cards here</div>
            )}
            {column.cardIds.map((cardId) => (
              <Card key={cardId} cardId={cardId} onClick={setModalCardId} />
            ))}
          </SortableContext>
        </div>
        <button className="column-add-btn" onClick={() => setShowNewCard(true)}>
          + Add Card
        </button>
      </div>
      {modalCardId && board.cards[modalCardId] && (
        <CardModal
          card={board.cards[modalCardId]}
          onClose={() => setModalCardId(null)}
        />
      )}
      {showNewCard && (
        <CardModal
          columnId={column.id}
          onClose={() => setShowNewCard(false)}
        />
      )}
      {showMenu && <div className="menu-backdrop" onClick={() => setShowMenu(false)} />}
    </>
  );
}
