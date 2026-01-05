import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL + "/api/books";





export const getAllBooks = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

export const updateBookDetails = async (id, bookData) => {
  const res = await axios.put(`${BASE_URL}/${id}`, bookData);
  return res.data;
};



export const addBook = async (bookData) => {
  const res = await axios.post(BASE_URL, bookData);
  return res.data;
};

export const updateCopies = async (id, change) => {
  const res = await axios.put(`${BASE_URL}/${id}/copies`, { change });
  return res.data;
};

export const deleteBook = async (id) => {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
};
