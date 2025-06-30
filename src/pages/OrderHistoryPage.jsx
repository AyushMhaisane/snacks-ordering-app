import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { db } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore';

const OrderHistoryPage = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [sortBy, setSortBy] = useState('date');

  const fetchOrders = async () => {
    try {
      const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
      const snap = await getDocs(q);
      const orderList = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const sorted = [...orderList].sort((a, b) => {
        if (sortBy === 'price') return b.totalAmount - a.totalAmount;
        else return b.placedAt?.toDate?.() - a.placedAt?.toDate?.();
      });

      setOrders(sorted);
    } catch (err) {
      console.error('Error fetching orders:', err.message);
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user, sortBy]);

  const handleCancelOrder = async (orderId) => {
    const confirm = window.confirm('Are you sure you want to cancel this order?');
    if (!confirm) return;

    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: 'cancelled' });
      alert('Order cancelled successfully.');
      fetchOrders();
    } catch (err) {
      console.error('Error cancelling order:', err.message);
      alert('Failed to cancel order.');
    }
  };

  const handleReorder = (items) => {
    items.forEach((item) => {
      addToCart(
        {
          id: item.productId || item.id,
          name: item.name,
          price: item.price,
          image: item.image,
        },
        item.uploadedImage,
        item.quantity || 1
      );
    });
    alert('🛒 Items added to cart again!');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📄 Order History</h2>
        <select
          className="border p-2 rounded"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Sort by Date</option>
          <option value="price">Sort by Price</option>
        </select>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-600">You haven't placed any snack orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border p-4 rounded shadow relative">
              {/* 🔄 Order Header */}
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <p className="text-gray-500 text-sm">
                    📅 Ordered on: {order.placedAt?.toDate?.().toLocaleDateString() || 'Unknown'}
                  </p>
                  <p className="text-lg font-semibold mt-2">💰 Total: ₹{order.totalAmount}</p>
                </div>

                <div className="flex flex-col items-end">
                  {order.status === 'cancelled' ? (
                    <span className="text-red-600 font-semibold">❌ Cancelled</span>
                  ) : (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="text-red-600 hover:underline flex items-center gap-1 text-sm"
                    >
                      ❌ <span>Cancel Order</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 🧺 Ordered Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="border p-2 rounded shadow-sm">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-32 object-contain"
                    />
                    <p className="font-semibold mt-2">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-600">
                      Price: ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                    </p>
                    {item.uploadedImage && (
                      <img
                        src={item.uploadedImage}
                        alt="Custom"
                        className="mt-2 w-12 h-12 object-cover opacity-80"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* 🔁 Reorder Button */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => handleReorder(order.items)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                >
                  🔁 Reorder
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
