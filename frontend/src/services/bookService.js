import API from "../api/axios";

// Since axios baseURL is already '/api', we just append '/books'
const BASE_URL = "/books";

export const getAllBooks = async () => {
  const res = await API.get(BASE_URL);
  return res.data;
};

export const updateBookDetails = async (id, bookData) => {
  const res = await API.put(`${BASE_URL}/${id}`, bookData);
  return res.data;
};

export const addBook = async (bookData) => {
  const res = await API.post(BASE_URL, bookData);
  return res.data;
};

export const updateCopies = async (id, change) => {
  const res = await API.put(`${BASE_URL}/${id}/copies`, { change });
  return res.data;
};

export const deleteBook = async (id) => {
  const res = await API.delete(`${BASE_URL}/${id}`);
  return res.data;
};
