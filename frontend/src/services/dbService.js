import { db } from '../firebase';
import {
  collection, addDoc, getDocs, query, where, orderBy, limit,
  serverTimestamp, doc, updateDoc, deleteDoc
} from 'firebase/firestore';

// Chat History
export const saveChatMessage = async (userId, message, role) => {
  try {
    await addDoc(collection(db, 'chatHistory'), {
      userId,
      message,
      role, // 'user' | 'assistant'
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error saving chat message:', error);
  }
};

export const getChatHistory = async (userId, limitCount = 50) => {
  try {
    const q = query(
      collection(db, 'chatHistory'),
      where('userId', '==', userId),
      orderBy('timestamp', 'asc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
};

// Waste Reports
export const saveWasteReport = async (userId, report) => {
  try {
    const docRef = await addDoc(collection(db, 'wasteReports'), {
      userId,
      ...report,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving waste report:', error);
    return null;
  }
};

export const getWasteReports = async (userId) => {
  try {
    const q = query(
      collection(db, 'wasteReports'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(20)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching waste reports:', error);
    return [];
  }
};

// Sustainability Reports
export const saveSustainabilityReport = async (userId, data) => {
  try {
    const docRef = await addDoc(collection(db, 'sustainabilityReports'), {
      userId,
      ...data,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving sustainability report:', error);
    return null;
  }
};

export const getSustainabilityReports = async (userId) => {
  try {
    const q = query(
      collection(db, 'sustainabilityReports'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(30)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching sustainability reports:', error);
    return [];
  }
};

// Analytics
export const getUserAnalytics = async (userId) => {
  try {
    const analyticsRef = doc(db, 'analytics', userId);
    return analyticsRef;
  } catch (error) {
    console.error('Error accessing analytics:', error);
    return null;
  }
};
