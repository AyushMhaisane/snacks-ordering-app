// pages/CartPage.jsx
import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const [profileComplete, setProfileComplete] = useState(false);
  const navigate = useNavigate();

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return;
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      const data = snap.data();

      const complete =
        data?.fullName &&
        data?.mobile &&
        data?.address &&
        data?.gender &&
        data?.age;

      setProfileComplete(!!complete);
    };

    checkProfile();
  }, [user]);

  const handlePlaceOrder = async () => {
    if (!profileComplete) {
      alert("Please complete your profile before placing the order.");
      navigate('/profile');
      return;
    }

    try {
      const orderData = {
        userId: user.uid,
        items: cart.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          uploadedImage: item.uploadedImage || null
        })),
        totalAmount: totalPrice,
        placedAt: new Date(),
        status: "active"
      };

      await addDoc(collection(db, 'orders'), orderData);
      alert("✅ Order placed successfully!");
      clearCart();
      navigate('/success');
    } catch (error) {
      console.error("Error placing order:", error);
      alert("❌ Something went wrong while placing your order.");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center mt-10 text-lg text-gray-600">
        🛒 Your cart is empty.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">🛍 Your Cart</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {cart.map((item, index) => (
          <div key={item.cartId} className="border p-4 rounded shadow-sm">
            <div className="relative">
              <img src={item.image} alt={item.name} className="w-full h-48 object-contain" />
              {item.uploadedImage && (
                <img
                  src={item.uploadedImage}
                  alt="Uploaded Design"
                  className="absolute top-1/3 left-1/3 w-20 opacity-75"
                />
              )}
            </div>
            <h3 className="mt-4 text-lg font-semibold">{item.name}</h3>
            <p className="text-gray-600 mb-1">₹{item.price}</p>
            <p className="text-sm text-gray-500 mb-2">Quantity: {item.quantity}</p>
            <button
              onClick={() => removeFromCart(item.cartId)}
              className="text-red-600 hover:underline"
            >
              🗑 Remove
            </button>
          </div>
        ))}
      </div>

      <p className="text-right font-semibold mt-6 text-xl">Total: ₹{totalPrice}</p>

      <button
        onClick={handlePlaceOrder}
        className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 float-right"
      >
        ✅ Place Order
      </button>
    </div>
  );
};

export default CartPage;
