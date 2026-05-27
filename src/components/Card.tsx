import { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBoard } from '../data/store';
import './Card.css';

interface Props {
  cardId: string;
  onClick: (cardId: string) => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  low: '#4caf50',
  medium: '#ff9800',
  high: '#f44336',
};

const PLATFORM_COLORS: Record<string, string> = {
  instagram: '#e4405f',
  youtube: '#ff0000',
  tiktok: '#000000',
  blog: '#1a73e8',
  print: '#7b1fa2',
  other: '#757575',
};

function Card({ cardId, onClick }: Props) {
  const { board } = useBoard();
  const card = board.cards[cardId];
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cardId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  if (!card) return null;

  const hasMetrics = card.metrics.likes > 0 || card.metrics.comments > 0 || card.metrics.views > 0;

  function getDueStatus(): { label: string; className: string } | null {
    if (!card.dates.dueDate) return null;
    const now = Date.now();
    const due = new Date(card.dates.dueDate).getTime();
    const diff = due - now;
    if (diff < 0) return { label: 'Overdue', className: 'due-overdue' };
    if (diff < 86400000) return { label: 'Due soon', className: 'due-soon' };
    if (diff < 604800000) return { label: 'Due this week', className: 'due-week' };
    return null;
  }

  const dueStatus = getDueStatus();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="card"
      role="button"
      tabIndex={0}
      aria-label={`Card: ${card.title}`}
      onClick={() => onClick(cardId)}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(cardId); }}
    >
      {card.coverImage && (
        <div className="card-cover">
          <img src={card.coverImage} alt="" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
        </div>
      )}
      <div className="card-top">
        <span
          className="card-priority"
          style={{ background: PRIORITY_COLORS[card.priority] }}
        />
        <span
          className="card-platform"
          style={{ background: PLATFORM_COLORS[card.platform], color: '#fff' }}
        >
          {card.platform}
        </span>
      </div>
      <div className="card-title">{card.title}</div>
      {card.tags.length > 0 && (
        <div className="card-tags">
          {card.tags.map((tag) => (
            <span key={tag} className="card-tag">{tag}</span>
          ))}
        </div>
      )}
      {dueStatus && (
        <div className={`card-due ${dueStatus.className}`}>{dueStatus.label}</div>
      )}
      {hasMetrics && (
        <div className="card-metrics">
          <span>❤️ {card.metrics.likes}</span>
          <span>💬 {card.metrics.comments}</span>
          <span>👁️ {card.metrics.views}</span>
        </div>
      )}
    </div>
  );
}

export default memo(Card);
