import axios from "axios";

const API_BASE = "http://127.0.0.1:5000/api/warranties";

export const getWarranties = async () => {
  const response = await axios.get(API_BASE + "/"); // must end with /
  return response.data;
};

export const addWarranty = async (warranty) => {
  const response = await axios.post("http://127.0.0.1:5000/api/warranties/", warranty, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  return response.data;
};


export const updateWarranty = async (id, warranty) => {
  const response = await axios.put(`${API_BASE}/${id}`, warranty, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  return response.data;
};

export const deleteWarranty = async (id) => {
  const response = await axios.delete(`${API_BASE}/${id}`);
  return response.data;
};
