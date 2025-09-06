import React, { useEffect, useState } from "react";

function WarrantyList() {
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/warranties/")
      .then((res) => res.json())
      .then((data) => {
        setWarranties(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching warranties:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-gray-500">Loading warranties...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Warranty List</h2>
      {warranties.length === 0 ? (
        <p className="text-red-500">No warranties found.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Product</th>
              <th className="border p-2">Purchase Date</th>
              <th className="border p-2">Expiry Date</th>
              <th className="border p-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {warranties.map((w) => (
              <tr key={w.id} className="text-center">
                <td className="border p-2">{w.id}</td>
                <td className="border p-2">{w.product_name}</td>
                <td className="border p-2">{w.purchase_date}</td>
                <td className="border p-2">{w.expiry_date}</td>
                <td className="border p-2">{w.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default WarrantyList;
