import axios from "axios";
import type { Note } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api/notes";
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
  tag: string;
}

export async function fetchNotes(
  page = 1,
  perPage = 12,
  search = "",
): Promise<FetchNotesResponse> {
  const response = await instance.get<FetchNotesResponse>("", {
    params: { page, perPage, search },
  });
  return response.data;
}
export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const response = await instance.post<Note>("", payload);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await instance.delete<Note>(`/${id}`);
  return response.data;
}
