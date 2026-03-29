import API from "../api/axios";

const BASE_URL = "/borrows";

// 📚 BORROW BOOK
export const borrowBook = async ({ bookId, studentId, email }) => {
  const res = await API.post(`${BASE_URL}/borrow`, {
    bookId,
    studentId,
    email
  });
  return res.data;
};

// 📋 GET ACTIVE BORROWS (Dashboard)
export const getActiveBorrows = async () => {
  const res = await API.get(BASE_URL);
  return res.data;
};

// 🔁 RETURN BOOK
export const returnBook = async (borrowId) => {
  const res = await API.put(`${BASE_URL}/return/${borrowId}`);
  return res.data;
};
