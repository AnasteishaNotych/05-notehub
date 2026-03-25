import css from "./NoteList.module.css";
import type { Note } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService";

interface CacheData {
  notes: Note[];
  totalPages: number;
}

interface NoteListProps {
  notes: Note[];
}

function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onMutate: async (noteId: string) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousData = queryClient.getQueryData<CacheData>(["notes"]);
      queryClient.setQueriesData<CacheData>({ queryKey: ["notes"] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          notes: old.notes.filter((n) => n.id !== noteId),
        };
      });
      return { previousData };
    },
    onError: (_err, _noteId, context) => {
      if (context?.previousData) {
        queryClient.setQueriesData(
          { queryKey: ["notes"] },
          context.previousData,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
  if (notes.length === 0) return null;
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              onClick={() => mutation.mutate(note.id)}
              className={css.button}
              disabled={mutation.isPending && mutation.variables === note.id}
            >
              {mutation.isPending && mutation.variables === note.id
                ? "Deleting..."
                : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default NoteList;
