import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    fullName: '',
    mobile: '',
    address: '',
    gender: '',
    age: ''
  });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setProfile({
          fullName: data.fullName || '',
          mobile: data.mobile || '',
          address: data.address || '',
          gender: data.gender || '',
          age: data.age || ''
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    const ref = doc(db, 'users', user.uid);
    await setDoc(ref, {
      uid: user.uid,
      email: user.email,
      ...profile,
      updatedAt: serverTimestamp()
    }, { merge: true });

    setStatus('✅ Profile saved!');
    setTimeout(() => setStatus(''), 2000);
  };

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 border p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">👤 Your Profile</h2>
      {status && <p className="text-green-600 text-sm mb-4 text-center">{status}</p>}
      <form onSubmit={handleSave} className="space-y-4">
        <input name="fullName" placeholder="Full Name" value={profile.fullName} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="mobile" placeholder="Mobile Number" value={profile.mobile} onChange={handleChange} className="w-full p-2 border rounded" required />
        <textarea name="address" placeholder="Address" value={profile.address} onChange={handleChange} className="w-full p-2 border rounded" required />
        <select name="gender" value={profile.gender} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <input name="age" type="number" placeholder="Age" value={profile.age} onChange={handleChange} className="w-full p-2 border rounded" required />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full">
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
