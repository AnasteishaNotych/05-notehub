import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api/";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const instance = axios.create({
  baseURL: BASE_URL,
  headers: { Authorization: `Bearer ${TOKEN}` },
});

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export async function fetchNotes(
  page = 1,
  perPage = 12,
  search = "",
): Promise<FetchNotesResponse> {
  const response = await instance.get<FetchNotesResponse>("/notes", {
    params: { page, perPage, search },
  });
  return response.data;
}
export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const response = await instance.post<Note>("/notes", payload);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await instance.delete<Note>(`/notes/${id}`);
  return response.data;
}
