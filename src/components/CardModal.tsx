import { useState, useEffect, type FormEvent } from 'react';
import type { Card, ContentType, Platform, Priority } from '../types';
import { useBoard } from '../data/store';
import { generateId } from '../utils/id';
import { nowISO } from '../utils/date';
import './CardModal.css';

interface Props {
  card?: Card;
  columnId?: string;
  onClose: () => void;
}

const CONTENT_TYPES: ContentType[] = [
  'photo', 'reel', 'short', 'blog', 'carousel', 'story', 'other',
];

const PLATFORMS: Platform[] = [
  'instagram', 'youtube', 'tiktok', 'blog', 'print', 'other',
];

const PRIORITIES: Priority[] = ['low', 'medium', 'high'];

export default function CardModal({ card, columnId, onClose }: Props) {
  const { dispatch } = useBoard();
  const isNew = !card;

  const [title, setTitle] = useState(card?.title ?? '');
  const [description, setDescription] = useState(card?.description ?? '');
  const [contentType, setContentType] = useState<ContentType>(card?.contentType ?? 'photo');
  const [platform, setPlatform] = useState<Platform>(card?.platform ?? 'instagram');
  const [tagsStr, setTagsStr] = useState(card?.tags.join(', ') ?? '');
  const [priority, setPriority] = useState<Priority>(card?.priority ?? 'medium');
  const [likes, setLikes] = useState(card?.metrics.likes?.toString() ?? '0');
  const [comments, setComments] = useState(card?.metrics.comments?.toString() ?? '0');
  const [views, setViews] = useState(card?.metrics.views?.toString() ?? '0');
  const [coverImage, setCoverImage] = useState(card?.coverImage ?? '');
  const [dueDate, setDueDate] = useState(card?.dates.dueDate?.split('T')[0] ?? '');
  const [shotDate, setShotDate] = useState(card?.dates.shotDate?.split('T')[0] ?? '');
  const [publishDate, setPublishDate] = useState(card?.dates.publishDate?.split('T')[0] ?? '');

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const parsedLikes = parseInt(likes) || 0;
    const parsedComments = parseInt(comments) || 0;
    const parsedViews = parseInt(views) || 0;

    function toISO(dateStr: string): string | undefined {
      return dateStr ? new Date(dateStr + 'T12:00:00').toISOString() : undefined;
    }

    const cardData: Card = {
      id: card?.id ?? generateId(),
      title: title.trim(),
      description,
      contentType,
      platform,
      tags,
      priority,
      metrics: {
        likes: parsedLikes,
        comments: parsedComments,
        views: parsedViews,
      },
      dates: {
        createdAt: card?.dates.createdAt ?? nowISO(),
        dueDate: toISO(dueDate),
        shotDate: toISO(shotDate),
        publishDate: toISO(publishDate),
      },
      coverImage: coverImage || undefined,
      attachments: card?.attachments ?? [],
    };

    if (isNew) {
      const targetColId = columnId ?? '';
      dispatch({ type: 'ADD_CARD', columnId: targetColId, card: cardData });
    } else {
      dispatch({ type: 'UPDATE_CARD', card: cardData });
    }

    onClose();
  }

  function handleDelete() {
    if (card && window.confirm('Delete this card?')) {
      dispatch({ type: 'DELETE_CARD', cardId: card.id });
      onClose();
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isNew ? 'New Card' : 'Edit Card'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <label className="field">
            <span>Title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} autoFocus required />
          </label>

          <label className="field">
            <span>Description</span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </label>

          <div className="field-row">
            <label className="field">
              <span>Content Type</span>
              <select value={contentType} onChange={(e) => setContentType(e.target.value as ContentType)}>
                {CONTENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Platform</span>
              <select value={platform} onChange={(e) => setPlatform(e.target.value as Platform)}>
                {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
          </div>

          <label className="field">
            <span>Tags (comma separated)</span>
            <input value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} placeholder="e.g. portrait, client" />
          </label>

          <label className="field">
            <span>Priority</span>
            <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>

          <fieldset className="fieldset">
            <legend>Metrics</legend>
            <div className="field-row">
              <label className="field">
                <span>Likes</span>
                <input type="number" min="0" value={likes} onChange={(e) => setLikes(e.target.value)} />
              </label>
              <label className="field">
                <span>Comments</span>
                <input type="number" min="0" value={comments} onChange={(e) => setComments(e.target.value)} />
              </label>
              <label className="field">
                <span>Views</span>
                <input type="number" min="0" value={views} onChange={(e) => setViews(e.target.value)} />
              </label>
            </div>
          </fieldset>

          <label className="field">
            <span>Cover Image URL</span>
            <input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." />
          </label>

          <fieldset className="fieldset">
            <legend>Dates</legend>
            <div className="field-row">
              <label className="field">
                <span>Due Date</span>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </label>
              <label className="field">
                <span>Shot Date</span>
                <input type="date" value={shotDate} onChange={(e) => setShotDate(e.target.value)} />
              </label>
              <label className="field">
                <span>Publish Date</span>
                <input type="date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} />
              </label>
            </div>
          </fieldset>

          <div className="modal-actions">
            {!isNew && (
              <button type="button" className="btn btn-danger" onClick={handleDelete}>
                Delete
              </button>
            )}
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {isNew ? 'Create' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
