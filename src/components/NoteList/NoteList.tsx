import css from "./NoteList.module.css";
import type { Note } from "../../types/note";
import { deleteNote } from "../../services/noteService";

interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
}

function NoteList({ notes, onDelete }: NoteListProps) {
  if (notes.length === 0) return null;
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button onClick={() => onDelete(note.id)} className={css.button}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default NoteList;
