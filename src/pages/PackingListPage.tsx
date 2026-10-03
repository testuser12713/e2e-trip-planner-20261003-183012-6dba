import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useParams } from 'react-router-dom';
import { computePackingProgress } from '../domain/packing';
import ProgressBar from '../components/ProgressBar';
import ConfirmDialog from '../components/ConfirmDialog';
import { useStore } from '../store/store';
import type { PackingItem } from '../types';

const SUGGESTED_ITEMS = ['Reisepass', 'Ladegerät', 'Toilettenartikel'];

export default function PackingListPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const { state, actions } = useStore();

  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<PackingItem | null>(null);
  const cancelRenameRef = useRef(false);

  if (!tripId) {
    return null;
  }

  const currentTripId = tripId;
  const items = state.packingItems.filter((item) => item.tripId === currentTripId);
  const progress = computePackingProgress(items);
  const progressLabel = `${progress.checked} von ${progress.total} · ${progress.percent} %`;

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newName.trim();
    if (!name) {
      return;
    }
    actions.addPackingItem(currentTripId, name);
    setNewName('');
  }

  function startRename(item: PackingItem) {
    cancelRenameRef.current = false;
    setEditingId(item.id);
    setDraft(item.name);
  }

  function finishRename() {
    if (editingId === null) {
      return;
    }
    const name = draft.trim();
    if (name) {
      actions.updatePackingItem(editingId, name);
    }
    setEditingId(null);
    setDraft('');
  }

  function handleRenameKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      finishRename();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      cancelRenameRef.current = true;
      event.currentTarget.blur();
    }
  }

  function handleRenameBlur() {
    if (cancelRenameRef.current) {
      cancelRenameRef.current = false;
      setEditingId(null);
      setDraft('');
      return;
    }
    finishRename();
  }

  function confirmDelete() {
    if (deleteTarget) {
      actions.deletePackingItem(deleteTarget.id);
    }
    setDeleteTarget(null);
  }

  return (
    <section aria-label="Packliste">
      <h1 className="page-title">Packliste</h1>

      <div className="card packliste-card">
        <div className="packlist-progress">
          <ProgressBar value={progress.percent} label={progressLabel} />
        </div>

        <ul className="packlist">
          {items.map((item) => (
            <li key={item.id} className="packlist__item">
              <input
                type="checkbox"
                className="packlist__check"
                checked={item.checked}
                onChange={() => actions.togglePackingItem(item.id)}
                aria-label={`${item.name} abhaken`}
              />
              {editingId === item.id ? (
                <input
                  type="text"
                  className="form-control packlist__rename"
                  value={draft}
                  autoFocus
                  onFocus={(event) => event.currentTarget.select()}
                  onChange={(event) => setDraft(event.target.value)}
                  onBlur={handleRenameBlur}
                  onKeyDown={handleRenameKeyDown}
                  aria-label="Eintrag umbenennen"
                />
              ) : (
                <span
                  className={`packlist__label${item.checked ? ' is-done' : ''}`}
                  onDoubleClick={() => startRename(item)}
                >
                  {item.name}
                </span>
              )}
              <button
                type="button"
                className="button button--ghost button--sm"
                onClick={() => startRename(item)}
                aria-label={`${item.name} umbenennen`}
              >
                ✎
              </button>
              <button
                type="button"
                className="button button--ghost button--sm button--icon"
                onClick={() => setDeleteTarget(item)}
                aria-label={`${item.name} löschen`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        <form className="packlist__add" onSubmit={handleAdd}>
          <label className="sr-only" htmlFor="pack-new-item">
            Neuer Eintrag
          </label>
          <input
            id="pack-new-item"
            className="form-control"
            type="text"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="Neuer Eintrag …"
            autoComplete="off"
          />
          <button type="submit" className="button">
            Hinzufügen
          </button>
        </form>

        <div className="packlist__suggestions">
          <span className="packlist__suggestions-label">Vorschläge:</span>
          {SUGGESTED_ITEMS.map((name) => (
            <button
              key={name}
              type="button"
              className="suggestion"
              onClick={() => actions.addPackingItem(currentTripId, name)}
              aria-label={`${name} hinzufügen`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Eintrag löschen"
        message={
          deleteTarget
            ? `„${deleteTarget.name}“ wirklich aus der Packliste löschen?`
            : ''
        }
        confirmLabel="Löschen"
        cancelLabel="Abbrechen"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  );
}
