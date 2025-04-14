import { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import toast from "react-hot-toast";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${apiUrl}/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Erreur fetch commandes", err);
      toast.error("Impossible de charger les commandes");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const deleteOrder = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/orders/${id}`, { method: "DELETE" });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== id));
        toast.success("Commande supprimée !");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur suppression");
    }
  };

  const deleteAllOrders = async () => {
    const confirm = window.confirm("Supprimer toutes les commandes ?");
    if (!confirm) return;

    try {
      const res = await fetch(`${apiUrl}/orders`, { method: "DELETE" });
      if (res.ok) {
        setOrders([]);
        toast.success("Toutes les commandes supprimées !");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur suppression globale");
    }
  };

  return (
    <PageWrapper>
      <div className="p-4 text-gray-800 dark:text-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">📦 Commandes</h1>
          <button
            onClick={deleteAllOrders}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow text-sm transition"
          >
            Tout supprimer
          </button>
        </div>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
            Aucune commande 💤
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 flex justify-between items-center w-full"
              >
                <div>
                  <p className="font-semibold text-purple-700 dark:text-purple-400">
                    {order.customerName}
                  </p>
                  <p className="text-gray-700 dark:text-gray-100">
                    {order.cocktail.name}
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteOrder(order.id)}
                  className="text-red-500 text-xl hover:text-red-700 dark:hover:text-red-400 transition"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
