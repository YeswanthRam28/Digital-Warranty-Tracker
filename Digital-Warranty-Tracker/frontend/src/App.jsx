import { useEffect, useState } from "react";
import {
  getWarranties,
  addWarranty,
  updateWarranty,
  deleteWarranty,
} from "./services/api";

function App() {
  const [warranties, setWarranties] = useState([]);
  const [form, setForm] = useState({
    product_name: "",
    purchase_date: "",
    expiry_date: "",
    warranty_period: "",
    vendor: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWarranties();
  }, []);

  const fetchWarranties = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getWarranties();
      setWarranties(data);
    } catch (err) {
      console.error("Error fetching warranties:", err);
      setError("Failed to fetch warranties. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateWarranty(editingId, form);
        setEditingId(null);
      } else {
        await addWarranty(form);
      }
      setForm({
        product_name: "",
        purchase_date: "",
        warranty_period: "",
        vendor: "",
      });
      fetchWarranties();
    } catch (err) {
      console.error("Error saving warranty:", err);
      setError("Failed to save warranty.");
    }
  };

  const handleEdit = (w) => {
    setForm({
      product_name: w.product_name,
      purchase_date: w.purchase_date,
      warranty_period: w.warranty_period,
      vendor: w.vendor,
    });
    setEditingId(w.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteWarranty(id);
      fetchWarranties();
    } catch (err) {
      console.error("Error deleting warranty:", err);
      setError("Failed to delete warranty.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>📦 Digital Warranty Tracker</h1>

      {/* Error Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Warranty Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Product Name"
          value={form.product_name}
          onChange={(e) => setForm({ ...form, product_name: e.target.value })}
          required
        />
        <input
          type="date"
          placeholder="Purchase Date"
          value={form.purchase_date}
          onChange={(e) => setForm({ ...form, purchase_date: e.target.value })}
          required
        />
        <input
        type="date"
        placeholder="Expiry Date"
        value={form.expiry_date}
        onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
        required
        />
        <input
          type="text"
          placeholder="Vendor"
          value={form.vendor}
          onChange={(e) => setForm({ ...form, vendor: e.target.value })}
          required
        />
        <button type="submit">
          {editingId ? "✏️ Update Warranty" : "➕ Add Warranty"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setForm({
                product_name: "",
                purchase_date: "",
                warranty_period: "",
                vendor: "",
              });
              setEditingId(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Warranty List */}
      <h2>📑 All Warranties</h2>
      {loading ? (
        <p>Loading warranties...</p>
      ) : warranties.length === 0 ? (
        <p>No warranties found.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Purchase Date</th>
              <th>Vendor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {warranties.map((w) => (
              <tr key={w.id}>
                <td>{w.id}</td>
                <td>{w.product_name}</td>
                <td>{w.purchase_date}</td>
                <td>{w.vendor}</td>
                <td>
                  <button onClick={() => handleEdit(w)}>Edit</button>
                  <button
                    onClick={() => handleDelete(w.id)}
                    style={{ marginLeft: "5px", color: "red" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
