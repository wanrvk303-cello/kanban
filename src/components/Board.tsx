import { useState } from 'react';
import {
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DndContext,
  closestCorners,
  type DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useBoard } from '../data/store';
import Column from './Column';
import type { Filters } from '../App';
import './Board.css';

interface Props {
  filters: Filters;
}

export default function Board({ filters }: Props) {
  const { board, dispatch } = useBoard();
  const [addingCol, setAddingCol] = useState(false);
  const [newColTitle, setNewColTitle] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function cardMatches(cardId: string): boolean {
    const card = board.cards[cardId];
    if (!card) return true;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (
        !card.title.toLowerCase().includes(q) &&
        !card.description.toLowerCase().includes(q) &&
        !card.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        return false;
      }
    }
    if (filters.contentType && card.contentType !== filters.contentType) return false;
    if (filters.platform && card.platform !== filters.platform) return false;
    if (filters.priority && card.priority !== filters.priority) return false;
    return true;
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const isCard = !!board.cards[activeId];

    if (isCard) {
      const sourceCol = board.columns.find((col) => col.cardIds.includes(activeId));
      if (!sourceCol) return;

      let targetColId: string;
      let insertIndex = 0;

      if (board.columns.some((col) => col.id === overId)) {
        targetColId = overId;
        insertIndex = board.columns.find((c) => c.id === overId)!.cardIds.length;
      } else if (board.cards[overId]) {
        const overCol = board.columns.find((col) => col.cardIds.includes(overId));
        if (!overCol) return;
        targetColId = overCol.id;
        insertIndex = overCol.cardIds.indexOf(overId);
      } else {
        return;
      }

      if (sourceCol.id === targetColId && sourceCol.cardIds.indexOf(activeId) === insertIndex) return;
      if (sourceCol.id === targetColId && insertIndex > sourceCol.cardIds.indexOf(activeId)) {
        insertIndex = Math.max(0, insertIndex - 1);
      }

      dispatch({
        type: 'MOVE_CARD',
        cardId: activeId,
        toColumnId: targetColId,
        index: insertIndex,
      });
    }
  }

  function handleAddColumn() {
    if (!newColTitle.trim()) return;
    dispatch({ type: 'ADD_COLUMN', title: newColTitle.trim() });
    setNewColTitle('');
    setAddingCol(false);
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="board">
        {board.columnOrder.map((colId) => {
          const col = board.columns.find((c) => c.id === colId);
          if (!col) return null;
          return (
            <Column
              key={col.id}
              column={col}
              cardMatches={cardMatches}
            />
          );
        })}
        <div className="add-column">
          {addingCol ? (
            <div className="add-column-form">
              <input
                autoFocus
                value={newColTitle}
                onChange={(e) => setNewColTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddColumn();
                  if (e.key === 'Escape') { setAddingCol(false); setNewColTitle(''); }
                }}
                placeholder="Column name..."
                className="add-column-input"
              />
              <div className="add-column-actions">
                <button className="btn btn-primary" onClick={handleAddColumn}>Add</button>
                <button className="btn" onClick={() => { setAddingCol(false); setNewColTitle(''); }}>Cancel</button>
              </div>
            </div>
          ) : (
            <button className="add-column-btn" onClick={() => setAddingCol(true)}>
              + Add Column
            </button>
          )}
        </div>
      </div>
      <div className="board-footer">
        <span>{Object.keys(board.cards).length} total cards</span>
        <span>{board.columns.length} columns</span>
        <span>Local storage — data stays on this device</span>
      </div>
    </DndContext>
  );
}
