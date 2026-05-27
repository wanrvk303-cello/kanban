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
import './Board.css';

export default function Board() {
  const { board, dispatch } = useBoard();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Determine if dragging a card or a column
    const isCard = !!board.cards[activeId];

    if (isCard) {
      // Find which column the card is currently in
      const sourceCol = board.columns.find((col) => col.cardIds.includes(activeId));
      if (!sourceCol) return;

      // Find target — could be a column droppable or another card
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

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="board">
        {board.columnOrder.map((colId) => {
          const col = board.columns.find((c) => c.id === colId);
          if (!col) return null;
          return <Column key={col.id} column={col} />;
        })}
      </div>
    </DndContext>
  );
}
