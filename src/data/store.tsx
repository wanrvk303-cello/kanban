import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Board, BoardAction } from '../types';
import { createDefaultBoard } from './defaults';

const STORAGE_KEY = 'photographer-kanban-board';

function boardReducer(state: Board, action: BoardAction): Board {
  switch (action.type) {
    case 'ADD_COLUMN': {
      const newCol = { id: crypto.randomUUID(), title: action.title, cardIds: [] as string[] };
      return {
        ...state,
        columns: [...state.columns, newCol],
        columnOrder: [...state.columnOrder, newCol.id],
      };
    }
    case 'RENAME_COLUMN':
      return {
        ...state,
        columns: state.columns.map((c) =>
          c.id === action.columnId ? { ...c, title: action.title } : c,
        ),
      };
    case 'DELETE_COLUMN': {
      const remaining = state.columns.filter((c) => c.id !== action.columnId);
      const cardsCopy = { ...state.cards };
      const col = state.columns.find((c) => c.id === action.columnId);
      if (col) for (const id of col.cardIds) delete cardsCopy[id];
      return {
        columns: remaining,
        cards: cardsCopy,
        columnOrder: state.columnOrder.filter((id) => id !== action.columnId),
      };
    }
    case 'REORDER_COLUMNS':
      return { ...state, columnOrder: action.columnOrder };
    case 'ADD_CARD': {
      const card = action.card;
      return {
        ...state,
        cards: { ...state.cards, [card.id]: card },
        columns: state.columns.map((c) =>
          c.id === action.columnId ? { ...c, cardIds: [...c.cardIds, card.id] } : c,
        ),
      };
    }
    case 'UPDATE_CARD':
      return {
        ...state,
        cards: { ...state.cards, [action.card.id]: action.card },
      };
    case 'DELETE_CARD': {
      const next = { ...state.cards };
      delete next[action.cardId];
      return {
        ...state,
        cards: next,
        columns: state.columns.map((c) => ({
          ...c,
          cardIds: c.cardIds.filter((id) => id !== action.cardId),
        })),
      };
    }
    case 'MOVE_CARD': {
      const { cardId, toColumnId, index } = action;
      const newColumns = state.columns.map((col) => {
        if (col.cardIds.includes(cardId)) {
          return { ...col, cardIds: col.cardIds.filter((id) => id !== cardId) };
        }
        return col;
      });
      return {
        ...state,
        columns: newColumns.map((col) =>
          col.id === toColumnId
            ? {
                ...col,
                cardIds: [
                  ...col.cardIds.slice(0, index),
                  cardId,
                  ...col.cardIds.slice(index),
                ],
              }
            : col,
        ),
      };
    }
    case 'REORDER_CARDS_IN_COLUMN':
      return {
        ...state,
        columns: state.columns.map((c) =>
          c.id === action.columnId ? { ...c, cardIds: action.cardIds } : c,
        ),
      };
    case 'IMPORT_BOARD':
      return action.board;
    default:
      return state;
  }
}

function loadBoard(): Board {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.columns && parsed.cards && parsed.columnOrder) return parsed;
    }
  } catch { /* ignore */ }
  return createDefaultBoard();
}

interface BoardContextValue {
  board: Board;
  dispatch: React.Dispatch<BoardAction>;
}

const BoardContext = createContext<BoardContextValue | null>(null);

export function BoardProvider({ children }: { children: ReactNode }) {
  const [board, dispatch] = useReducer(boardReducer, null, loadBoard);

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
    }, 500);
    return () => clearTimeout(timeout);
  }, [board]);

  return (
    <BoardContext.Provider value={{ board, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard(): BoardContextValue {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error('useBoard must be used within BoardProvider');
  return ctx;
}
