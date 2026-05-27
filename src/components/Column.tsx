import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Column as ColumnType } from '../types';
import Card from './Card';
import './Column.css';

interface Props {
  column: ColumnType;
}

export default function Column({ column }: Props) {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div className="column">
      <div className="column-header">
        <h2 className="column-title">{column.title}</h2>
        <span className="column-count">{column.cardIds.length}</span>
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
            <Card key={cardId} cardId={cardId} columnId={column.id} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
