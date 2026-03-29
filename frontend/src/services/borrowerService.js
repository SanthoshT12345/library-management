import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL + "/api/borrowers";

export const getBorrowers = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

export const addBorrower = async (borrowerData) => {
  const res = await axios.post(BASE_URL, borrowerData);
  return res.data;
};
