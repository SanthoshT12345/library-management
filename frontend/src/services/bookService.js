import axios from "axios";


const BASE_URL = "https://library-backend-bnlm.onrender.com/api/books";




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
