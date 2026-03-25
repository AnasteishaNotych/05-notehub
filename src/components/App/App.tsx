import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote, deleteNote, fetchNotes } from "../../services/noteService";
import { useState } from "react";
import SearchBox from "../SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
  const createMutation = useMutation({
    mutationFn: (newNote: { title: string; content: string; tag: string }) =>
      createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
  });

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 1000);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    debouncedSearch(value);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(page, 12, search),
  });
  if (isLoading) return <p>Loading is proceed, please wait</p>;
  if (isError)
    return (
      <p>
        Ooops, something went wrong. Plaese try again later:{" "}
        {error instanceof Error ? error.message : "Unknown failure"};
      </p>
    );

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={input} onChange={handleOnChange} />
        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            forcePage={page}
            onPageChange={(selectedItem) => setPage(selectedItem.selected + 1)}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm
          onSubmit={(values) => createMutation.mutate(values as any)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
      {data && (
        <NoteList
          notes={data?.notes}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      )}
    </div>
  );
}

export default App;
