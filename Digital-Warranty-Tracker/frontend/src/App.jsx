import { useEffect, useState } from "react";
import {
  getWarranties,
  addWarranty,
  updateWarranty,
  deleteWarranty,
} from "./services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

function App() {
  const [warranties, setWarranties] = useState([]);
  const [form, setForm] = useState({
    product_name: "",
    purchase_date: "",
    expiry_date: "",
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
      setError("❌ Failed to fetch warranties. Please try again.");
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
        expiry_date: "",
        vendor: "",
      });
      fetchWarranties();
    } catch (err) {
      console.error("Error saving warranty:", err);
      setError("❌ Failed to save warranty.");
    }
  };

  const handleEdit = (w) => {
    setForm({
      product_name: w.product_name,
      purchase_date: w.purchase_date,
      expiry_date: w.expiry_date,
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
      setError("❌ Failed to delete warranty.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-blue-100 p-6">
      <motion.h1
        className="text-4xl font-bold text-center mb-8 text-purple-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        📦 Digital Warranty Tracker
      </motion.h1>

      {/* Error Message */}
      {error && (
        <p className="text-center text-red-500 font-semibold mb-4">{error}</p>
      )}

      {/* Warranty Form */}
      <Card className="max-w-3xl mx-auto shadow-xl rounded-2xl mb-8">
        <CardContent className="p-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Input
              type="text"
              placeholder="Product Name"
              value={form.product_name}
              onChange={(e) =>
                setForm({ ...form, product_name: e.target.value })
              }
              required
            />
            <Input
              type="date"
              value={form.purchase_date}
              onChange={(e) =>
                setForm({ ...form, purchase_date: e.target.value })
              }
              required
            />
            <Input
              type="date"
              value={form.expiry_date}
              onChange={(e) =>
                setForm({ ...form, expiry_date: e.target.value })
              }
              required
            />
            <Input
              type="text"
              placeholder="Vendor"
              value={form.vendor}
              onChange={(e) => setForm({ ...form, vendor: e.target.value })}
              required
            />
            <div className="flex gap-3 col-span-2 justify-center mt-4">
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
              >
                {editingId ? "✏️ Update Warranty" : "➕ Add Warranty"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setForm({
                      product_name: "",
                      purchase_date: "",
                      expiry_date: "",
                      vendor: "",
                    });
                    setEditingId(null);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Warranty List */}
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">
        📑 All Warranties
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading warranties...</p>
      ) : warranties.length === 0 ? (
        <p className="text-center text-gray-600">No warranties found.</p>
      ) : (
        <div className="overflow-x-auto max-w-5xl mx-auto">
          <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-purple-200 text-gray-800">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Product</th>
                <th className="p-3">Purchase Date</th>
                <th className="p-3">Expiry Date</th>
                <th className="p-3">Vendor</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {warranties.map((w, index) => (
                <motion.tr
                  key={w.id}
                  className={`text-center ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td className="p-3">{w.id}</td>
                  <td className="p-3 font-medium">{w.product_name}</td>
                  <td className="p-3">{w.purchase_date}</td>
                  <td className="p-3">{w.expiry_date}</td>
                  <td className="p-3">{w.vendor}</td>
                  <td className="p-3 flex gap-2 justify-center">
                    <Button
                      size="sm"
                      onClick={() => handleEdit(w)}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(w.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
