import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ReviewForm = ({ productId }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please login to leave a review.');
      return;
    }

    await addDoc(collection(db, 'products', productId, 'reviews'), {
      userId: user.uid,
      userName: user.email,
      rating,
      comment,
      timestamp: serverTimestamp(),
    });

    setRating(5);
    setComment('');
    alert('Review submitted!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <h3 className="text-lg font-semibold">Leave a Review</h3>
      <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="p-2 border rounded">
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>{r} Star{r !== 1 && 's'}</option>
        ))}
      </select>
      <textarea
        placeholder="Write your comment..."
        className="w-full p-2 border rounded"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
