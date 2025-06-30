import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Navigate } from 'react-router-dom';

const VerifiedProfileRoute = ({ children }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return;
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      const data = snap.data();

      const complete =
        data &&
        data.fullName &&
        data.mobile &&
        data.address &&
        data.gender &&
        data.age;

      setIsComplete(!!complete);
      setLoading(false);
    };

    checkProfile();
  }, [user]);

  if (loading) return <p className="text-center mt-10">Verifying profile...</p>;

  if (!isComplete) {
    return <Navigate to="/profile" />;
  }

  return children;
};

export default VerifiedProfileRoute;
