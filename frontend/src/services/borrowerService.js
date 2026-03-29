import API from "../api/axios";

const BASE_URL = "/borrowers";

export const getBorrowers = async () => {
  const res = await API.get(BASE_URL);
  return res.data;
};

export const addBorrower = async (borrowerData) => {
  const res = await API.post(BASE_URL, borrowerData);
  return res.data;
};
