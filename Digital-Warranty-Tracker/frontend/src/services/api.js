import axios from "axios";

// Base URL for Flask backend
const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api/warranties",
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch all warranties
export const getWarranties = async () => {
  const response = await api.get("/");
  return response.data;
};

// Add a new warranty
export const addWarranty = async (warranty) => {
  const response = await api.post("/", warranty);
  return response.data;
};

// Update an existing warranty
export const updateWarranty = async (id, warranty) => {
  const response = await api.put(`/${id}`, warranty);
  return response.data;
};

// Delete a warranty
export const deleteWarranty = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};
