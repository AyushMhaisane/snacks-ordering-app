import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AddProductPage = () => {
  const [productData, setProductData] = useState({
    productId: '',
    price: '',
    description: '',
    units: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Please upload an image");
      return;
    }

    try {
      setUploading(true);

      // Upload image to Firebase Storage
      const imageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);

      // Add product to Firestore
      await addDoc(collection(db, 'products'), {
        ...productData,
        price: parseFloat(productData.price),
        units: parseInt(productData.units),
        image: imageUrl,
      });

      alert('✅ Product added successfully!');
      setProductData({
        productId: '',
        price: '',
        description: '',
        units: ''
      });
      setImageFile(null);
      setUploading(false);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('❌ Failed to add product');
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">➕ Add New Snack</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['productId', 'price', 'description', 'units'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium capitalize">{field}</label>
            <input
              type={field === 'price' || field === 'units' ? 'number' : 'text'}
              name={field}
              value={productData[field]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
        ))}

        {/* 📷 Image upload field */}
        <div>
          <label className="block text-sm font-medium mb-1">Upload Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} required />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Save Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;
