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

export default function Card({ cardId, onClick }: Props) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="card"
      onClick={() => onClick(cardId)}
    >
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
