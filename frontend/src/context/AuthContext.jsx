import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-detect if using dummy Firebase credentials
  const isMock = !import.meta.env.VITE_FIREBASE_API_KEY || 
                 import.meta.env.VITE_FIREBASE_API_KEY.includes('your-') || 
                 import.meta.env.VITE_FIREBASE_API_KEY === '';

  useEffect(() => {
    if (isMock) {
      const stored = localStorage.getItem('ecobot_mock_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          setUserProfile(parsed);
        } catch {
          localStorage.removeItem('ecobot_mock_user');
        }
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            const newProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || 'EcoUser',
              photoURL: firebaseUser.photoURL || null,
              language: 'en',
              greenScore: 72,
              joinedAt: new Date().toISOString(),
            };
            await setDoc(userRef, newProfile);
            setUserProfile(newProfile);
          } else {
            setUserProfile(userSnap.data());
          }
        } catch (err) {
          console.error("Firestore user profile error:", err);
          setUserProfile({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'EcoUser',
            greenScore: 72,
          });
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [isMock]);

  const loginWithEmail = async (email, password) => {
    if (isMock) {
      await new Promise(r => setTimeout(r, 600));
      const mockUser = {
        uid: 'mock-uid-' + Math.random().toString(36).substr(2, 9),
        email,
        displayName: email.split('@')[0],
        greenScore: 72,
        language: 'en',
      };
      localStorage.setItem('ecobot_mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setUserProfile(mockUser);
      return mockUser;
    }
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  };

  const registerWithEmail = async (email, password, name) => {
    if (isMock) {
      await new Promise(r => setTimeout(r, 600));
      const mockUser = {
        uid: 'mock-uid-' + Math.random().toString(36).substr(2, 9),
        email,
        displayName: name,
        greenScore: 72,
        language: 'en',
      };
      localStorage.setItem('ecobot_mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setUserProfile(mockUser);
      return mockUser;
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    try {
      const userRef = doc(db, 'users', cred.user.uid);
      const newProfile = {
        uid: cred.user.uid,
        email,
        displayName: name,
        language: 'en',
        greenScore: 72,
        joinedAt: new Date().toISOString(),
      };
      await setDoc(userRef, newProfile);
      setUserProfile(newProfile);
    } catch (err) {
      console.error("Profile set failed in Firestore:", err);
    }
    return cred.user;
  };

  const loginWithGoogle = async () => {
    if (isMock) {
      await new Promise(r => setTimeout(r, 600));
      const mockUser = {
        uid: 'mock-google-uid',
        email: 'green.hero@gmail.com',
        displayName: 'Green Hero',
        greenScore: 85,
        language: 'en',
      };
      localStorage.setItem('ecobot_mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setUserProfile(mockUser);
      return mockUser;
    }
    const cred = await signInWithPopup(auth, googleProvider);
    return cred.user;
  };

  const logout = async () => {
    if (isMock) {
      localStorage.removeItem('ecobot_mock_user');
      setUser(null);
      setUserProfile(null);
      return;
    }
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, loginWithEmail, registerWithEmail, loginWithGoogle, logout, isMock }}>
      {children}
    </AuthContext.Provider>
  );
};
