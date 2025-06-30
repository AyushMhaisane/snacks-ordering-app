import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
      const snap = await getDocs(q);
      const orderList = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(orderList);
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">🧾 Order History</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border p-4 rounded shadow">
              <p className="text-gray-500 text-sm">
                📅 Ordered on: {order.placedAt ? new Date(order.placedAt).toLocaleDateString() : "Unknown"}

              </p>
              <p className="text-lg font-semibold mt-2">💰 Total: ₹{order.total}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="border p-2 rounded">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-32 object-contain"
                    />
                    <p className="text-sm mt-2">{item.name}</p>
                    {item.uploadedImage && (
                      <img
                        src={item.uploadedImage}
                        alt="Custom"
                        className="mt-1 w-12 h-12 object-cover opacity-80"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
