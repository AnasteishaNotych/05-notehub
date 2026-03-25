import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { createNote, fetchNotes } from "../../services/noteService";
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

  const createMutation = useMutation({
    mutationFn: createNote,
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

  const { data, isLoading, isError, error, isPlaceholderData } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(page, 12, search),
    placeholderData: keepPreviousData,
  });
  if (isLoading && !isPlaceholderData)
    return <p>Loading is proceed, please wait</p>;
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
            forcePage={page - 1}
            onPageChange={(selectedItem) => setPage(selectedItem.selected + 1)}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm
          onSubmit={(values, actions) =>
            createMutation.mutate(values, {
              onSuccess: () => {
                actions.resetForm();
              },
            })
          }
          onCancel={() => setIsModalOpen(false)}
          isLoading={createMutation.isPending}
        />
      </Modal>
      {data && <NoteList notes={data?.notes} />}
    </div>
  );
}

export default App;
