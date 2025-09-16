import { useEffect, useState } from "react";
import {
  getWarranties,
  addWarranty,
  updateWarranty,
  deleteWarranty,
} from "./services/api";
import { format, differenceInDays } from "date-fns";
import { requestForToken, onMessageListener } from "./firebase";
import "./App.css";

/* -------------------------------
   📦 Main App Component
--------------------------------*/
function App() {
  const [warranties, setWarranties] = useState([]);
  const [newWarranty, setNewWarranty] = useState({
    product_name: "",
    purchase_date: "",
    expiry_date: "",
    vendor: "",
  });
  const [editingId, setEditingId] = useState(null);

  /* -------------------------------
     🔔 Notification Setup
  --------------------------------*/
  useEffect(() => {
    // Ask browser notification permission
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        console.log("📢 Notification permission:", permission);
      });
    }

    // Request Firebase token
    requestForToken()
      .then((token) => {
        if (token) {
          console.log("✅ FCM Token:", token);
          // 👉 Save token to backend for push notifications
        }
      })
      .catch((err) => console.error("❌ Error getting token:", err));

    // Listen for foreground messages
    onMessageListener()
      .then((payload) => {
        console.log("📩 Foreground message received:", payload);
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: "/icon.png",
        });
      })
      .catch((err) => console.error("❌ onMessageListener error:", err));

    loadWarranties();
  }, []);

  /* -------------------------------
     📂 Data Handling
  --------------------------------*/
  const loadWarranties = async () => {
    const data = await getWarranties();
    setWarranties(data);
  };

  const handleAddOrUpdateWarranty = async () => {
    if (!newWarranty.product_name || !newWarranty.expiry_date) {
      alert("⚠️ Please fill in product name and expiry date.");
      return;
    }

    if (editingId) {
      await updateWarranty(editingId, newWarranty);
    } else {
      await addWarranty(newWarranty);
    }
    resetForm();
    loadWarranties();
  };

  const handleEdit = (warranty) => {
    setNewWarranty({
      product_name: warranty.product_name,
      purchase_date: warranty.purchase_date,
      expiry_date: warranty.expiry_date,
      vendor: warranty.vendor,
    });
    setEditingId(warranty.id);
  };

  const handleDelete = async (id) => {
    await deleteWarranty(id);
    loadWarranties();
  };

  const resetForm = () => {
    setNewWarranty({
      product_name: "",
      purchase_date: "",
      expiry_date: "",
      vendor: "",
    });
    setEditingId(null);
  };

  const getExpiryStatus = (expiryDate) => {
    const today = new Date();
    const exp = new Date(expiryDate);
    const daysLeft = differenceInDays(exp, today);

    if (daysLeft < 0) return { label: "Expired", color: "expired" };
    if (daysLeft <= 7)
      return { label: `Expiring in ${daysLeft} days`, color: "urgent" };
    if (daysLeft <= 30)
      return { label: `Expires in ${daysLeft} days`, color: "warning" };
    return { label: `Valid (${daysLeft} days left)`, color: "active" };
  };

  /* -------------------------------
     🎨 UI
  --------------------------------*/
  return (
    <div className="app-container">
      <h1 className="app-title">Digital Warranty Tracker</h1>

      {/* Warranty Form */}
      <div className="card form-card">
        <h2 className="section-title">
          {editingId ? "✏️ Update Warranty" : "➕ Add New Warranty"}
        </h2>

        <div className="form-grid">
          <input
            type="text"
            placeholder="Product Name (Ex: iPhone 15)"
            value={newWarranty.product_name}
            onChange={(e) =>
              setNewWarranty({ ...newWarranty, product_name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Vendor (Ex: Amazon)"
            value={newWarranty.vendor}
            onChange={(e) =>
              setNewWarranty({ ...newWarranty, vendor: e.target.value })
            }
          />
          <input
            type="date"
            value={newWarranty.purchase_date}
            onChange={(e) =>
              setNewWarranty({ ...newWarranty, purchase_date: e.target.value })
            }
          />
          <input
            type="date"
            value={newWarranty.expiry_date}
            onChange={(e) =>
              setNewWarranty({ ...newWarranty, expiry_date: e.target.value })
            }
          />
        </div>

        <button className="btn primary" onClick={handleAddOrUpdateWarranty}>
          {editingId ? "Update Warranty" : "Add Warranty"}
        </button>
      </div>

      {/* Dashboard Reminders */}
      <div className="card reminder-card">
        <h2 className="section-title">🔔 Warranty Reminders</h2>

        {/* Expiring Soon */}
        <div>
          <h3>⏳ Expiring Soon</h3>
          {warranties.filter((w) => {
            const diff = differenceInDays(new Date(w.expiry_date), new Date());
            return diff > 0 && diff <= 7;
          }).length > 0 ? (
            warranties
              .filter((w) => {
                const diff = differenceInDays(
                  new Date(w.expiry_date),
                  new Date()
                );
                return diff > 0 && diff <= 7;
              })
              .map((w) => (
                <p key={w.id}>
                  ⚠️ {w.product_name} (expires{" "}
                  {format(new Date(w.expiry_date), "dd MMM yyyy")})
                </p>
              ))
          ) : (
            <p>No warranties expiring soon 🎉</p>
          )}
        </div>

        <hr />

        {/* Expired */}
        <div>
          <h3>❌ Expired</h3>
          {warranties.filter((w) => new Date(w.expiry_date) < new Date())
            .length > 0 ? (
            warranties
              .filter((w) => new Date(w.expiry_date) < new Date())
              .map((w) => (
                <p key={w.id}>
                  ❌ {w.product_name} (expired{" "}
                  {format(new Date(w.expiry_date), "dd MMM yyyy")})
                </p>
              ))
          ) : (
            <p>All warranties are valid ✅</p>
          )}
        </div>
      </div>

      {/* All Warranties */}
      <h2 className="section-title">📑 All Warranties</h2>
      <div className="warranty-list">
        {warranties.map((warranty) => {
          const status = getExpiryStatus(warranty.expiry_date);

          return (
            <div className="card warranty-card" key={warranty.id}>
              <div className="card-header">
                <h3>{warranty.product_name}</h3>
                <span className={`badge ${status.color}`}>{status.label}</span>
              </div>

              <div className="card-body">
                <p>
                  <strong>Vendor:</strong> {warranty.vendor}
                </p>
                <p>
                  <strong>Purchase:</strong>{" "}
                  {format(new Date(warranty.purchase_date), "dd MMM yyyy")}
                </p>
                <p>
                  <strong>Expiry:</strong>{" "}
                  {format(new Date(warranty.expiry_date), "dd MMM yyyy")}
                </p>
              </div>

              <div className="btn-group">
                <button
                  className="btn secondary"
                  onClick={() => handleEdit(warranty)}
                >
                  Edit
                </button>
                <button
                  className="btn danger"
                  onClick={() => handleDelete(warranty.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
