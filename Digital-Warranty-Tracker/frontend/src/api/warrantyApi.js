import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api/warranties", // your Flask backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// ➤ Get all warranties
export const getWarranties = () => API.get("/");

// ➤ Add a new warranty
export const addWarranty = (warrantyData) => API.post("/", warrantyData);

// ➤ Update a warranty
export const updateWarranty = (id, updatedData) => API.put(`/${id}`, updatedData);

// ➤ Delete a warranty
export const deleteWarranty = (id) => API.delete(`/${id}`);

export default API;
