import { useEffect, useState } from "react"
import {
  getWarranties,
  addWarranty,
  updateWarranty,
  deleteWarranty,
} from "./services/api"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import "./index.css"
import "./App.css"

function App() {
  const [warranties, setWarranties] = useState([])
  const [form, setForm] = useState({
    product_name: "",
    purchase_date: "",
    expiry_date: "",
    vendor: "",
  })
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchWarranties()
  }, [])

  const fetchWarranties = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await getWarranties()
      setWarranties(data)
    } catch (err) {
      console.error("Error fetching warranties:", err)
      setError("❌ Failed to fetch warranties. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateWarranty(editingId, form)
        setEditingId(null)
      } else {
        await addWarranty(form)
      }
      setForm({
        product_name: "",
        purchase_date: "",
        expiry_date: "",
        vendor: "",
      })
      fetchWarranties()
    } catch (err) {
      console.error("Error saving warranty:", err)
      setError("❌ Failed to save warranty.")
    }
  }

  const handleEdit = (w) => {
    setForm({
      product_name: w.product_name,
      purchase_date: w.purchase_date,
      expiry_date: w.expiry_date,
      vendor: w.vendor,
    })
    setEditingId(w.id)
  }

  const handleDelete = async (id) => {
    try {
      await deleteWarranty(id)
      fetchWarranties()
    } catch (err) {
      console.error("Error deleting warranty:", err)
      setError("❌ Failed to delete warranty.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background text-foreground p-6">
      <motion.h1
        className="text-4xl font-extrabold text-center mb-10 tracking-tight"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        📦 Digital Warranty Tracker
      </motion.h1>

      {/* Error Message */}
      {error && (
        <p className="text-center text-destructive font-semibold mb-6">
          {error}
        </p>
      )}

      {/* Warranty Form */}
      <Card className="max-w-3xl mx-auto shadow-xl border rounded-2xl mb-10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {editingId ? "✏️ Edit Warranty" : "➕ Add New Warranty"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <label className="block mb-1 text-sm font-medium">
                Product Name
              </label>
              <Input
                type="text"
                placeholder="Ex: iPhone 15"
                value={form.product_name}
                onChange={(e) =>
                  setForm({ ...form, product_name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Purchase Date
              </label>
              <Input
                type="date"
                value={form.purchase_date}
                onChange={(e) =>
                  setForm({ ...form, purchase_date: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Expiry Date
              </label>
              <Input
                type="date"
                value={form.expiry_date}
                onChange={(e) =>
                  setForm({ ...form, expiry_date: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Vendor
              </label>
              <Input
                type="text"
                placeholder="Ex: Amazon"
                value={form.vendor}
                onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-3 col-span-2 justify-center mt-4">
              <Button type="submit" className="rounded-xl px-6">
                {editingId ? "Update Warranty" : "Add Warranty"}
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
                    })
                    setEditingId(null)
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
      <h2 className="text-2xl font-bold text-center mb-6">
        📑 All Warranties
      </h2>

      {loading ? (
        <p className="text-center text-muted-foreground">
          Loading warranties...
        </p>
      ) : warranties.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No warranties found.
        </p>
      ) : (
        <div className="overflow-x-auto max-w-6xl mx-auto rounded-xl border border-border shadow-md">
          <table className="w-full text-sm">
            <thead className="bg-muted sticky top-0 z-10">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Purchase Date</th>
                <th className="p-3 text-left">Expiry Date</th>
                <th className="p-3 text-left">Vendor</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {warranties.map((w, index) => (
                <motion.tr
                  key={w.id}
                  className={`transition-colors ${
                    index % 2 === 0 ? "bg-background" : "bg-muted/30"
                  } hover:bg-accent hover:text-accent-foreground`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td className="p-3">{w.id}</td>
                  <td className="p-3 font-medium">{w.product_name}</td>
                  <td className="p-3">{w.purchase_date}</td>
                  <td className="p-3">{w.expiry_date}</td>
                  <td className="p-3">{w.vendor}</td>
                  <td className="p-3 flex gap-2 justify-center">
                    <Button size="sm" onClick={() => handleEdit(w)}>
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
  )
}

export default App
