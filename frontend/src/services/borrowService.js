import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL + "/api/borrows";

// 📚 BORROW BOOK
export const borrowBook = async ({ bookId, studentId, email }) => {
  const res = await axios.post(`${BASE_URL}/borrow`, {
    bookId,
    studentId,
    email
  });
  return res.data;
};

// 📋 GET ACTIVE BORROWS (Dashboard)
export const getActiveBorrows = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

// 🔁 RETURN BOOK
export const returnBook = async (borrowId) => {
  const res = await axios.put(`${BASE_URL}/return/${borrowId}`);
  return res.data;
};
