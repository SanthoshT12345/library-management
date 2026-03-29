import axios from "axios";

const API = axios.create({
  baseURL: "https://library-backend-bn1m.onrender.com/api/books"
});

export default API;
