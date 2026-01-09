import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { Result, SportsEvent } from '../types';

// --- CONFIGURATION ---
// Safely access environment variables using optional chaining
// This prevents crashes if import.meta.env is undefined in certain environments
const getEnv = (key: string) => {
  try {
    return (import.meta as any).env?.[key];
  } catch (e) {
    return undefined;
  }
};

const firebaseConfig = {
  apiKey: getEnv("VITE_FIREBASE_API_KEY") || "demo-key",
  authDomain: getEnv("VITE_FIREBASE_AUTH_DOMAIN") || "demo.firebaseapp.com",
  projectId: getEnv("VITE_FIREBASE_PROJECT_ID") || "demo-project",
  storageBucket: getEnv("VITE_FIREBASE_STORAGE_BUCKET") || "demo.appspot.com",
  messagingSenderId: getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID") || "12345",
  appId: getEnv("VITE_FIREBASE_APP_ID") || "1:12345:web:12345"
};

const isDemoMode = firebaseConfig.apiKey === "demo-key";

// --- FIREBASE INIT ---
let auth: any;
let db: any;

if (!isDemoMode) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (e) {
    console.error("Firebase init failed, falling back to local mode", e);
  }
}

// Event name for local auth changes
const AUTH_EVENT = 'sportiva-auth-change';

// --- API ---

// 1. AUTHENTICATION
export const subscribeToAuth = (callback: (user: User | null) => void) => {
  if (isDemoMode) {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('demo_user');
        callback(storedUser ? JSON.parse(storedUser) : null);
      } catch (e) {
        callback(null);
      }
    };

    // Initial check
    checkAuth();

    // Listen for local custom event (same tab)
    const handleLocalAuth = () => checkAuth();
    window.addEventListener(AUTH_EVENT, handleLocalAuth);

    // Listen for storage event (cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'demo_user') {
        checkAuth();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(AUTH_EVENT, handleLocalAuth);
      window.removeEventListener('storage', handleStorageChange);
    };
  }
  
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
};

export const loginAdmin = async (email: string, pass: string) => {
  if (isDemoMode) {
    if (email === 'admin@college.edu' && pass === 'admin123') {
      const mockUser = { 
        uid: 'demo-admin', 
        email,
        displayName: 'Admin User',
        emailVerified: true
      } as unknown as User;
      
      localStorage.setItem('demo_user', JSON.stringify(mockUser));
      // Dispatch event to update UI immediately without reload
      window.dispatchEvent(new Event(AUTH_EVENT));
      return mockUser;
    }
    throw new Error('Invalid demo credentials. Use admin@college.edu / admin123');
  }
  return signInWithEmailAndPassword(auth, email, pass);
};

export const logoutAdmin = async () => {
  if (isDemoMode) {
    localStorage.removeItem('demo_user');
    // Dispatch event to update UI immediately without reload
    window.dispatchEvent(new Event(AUTH_EVENT));
    return;
  }
  return signOut(auth);
};

// 2. DATA (RESULTS)
const RESULTS_STORAGE_KEY = 'sportiva_results';
const EVENTS_STORAGE_KEY = 'sportiva_events';

export const getResults = async (): Promise<Result[]> => {
  if (isDemoMode) {
    const data = localStorage.getItem(RESULTS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
  
  const q = query(collection(db, "results"), orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Result));
};

export const addResult = async (result: Omit<Result, 'id'>) => {
  if (isDemoMode) {
    const currentResults = await getResults();
    const newResult = { ...result, id: Date.now().toString() + Math.random() };
    localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify([newResult, ...currentResults]));
    return newResult;
  }
  
  return addDoc(collection(db, "results"), result);
};

export const deleteResult = async (id: string) => {
  if (isDemoMode) {
    const currentResults = await getResults();
    const filtered = currentResults.filter(r => r.id !== id);
    localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(filtered));
    return;
  }
  
  return deleteDoc(doc(db, "results", id));
};

export const deleteResultsBatch = async (ids: string[]) => {
  if (isDemoMode) {
    const currentResults = await getResults();
    const filtered = currentResults.filter(r => !ids.includes(r.id));
    localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(filtered));
    return;
  }

  const batch = writeBatch(db);
  ids.forEach(id => {
    const docRef = doc(db, "results", id);
    batch.delete(docRef);
  });
  await batch.commit();
};


// 3. DATA (EVENTS)

export const getEvents = async (): Promise<SportsEvent[]> => {
  if (isDemoMode) {
    const data = localStorage.getItem(EVENTS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
  
  const querySnapshot = await getDocs(collection(db, "events"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SportsEvent));
};

export const addEvent = async (event: Omit<SportsEvent, 'id'>) => {
  if (isDemoMode) {
    const currentEvents = await getEvents();
    const newEvent = { ...event, id: Date.now().toString() };
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify([...currentEvents, newEvent]));
    return newEvent;
  }
  return addDoc(collection(db, "events"), event);
};

export const deleteEvent = async (id: string) => {
  if (isDemoMode) {
    const currentEvents = await getEvents();
    const filtered = currentEvents.filter(e => e.id !== id);
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(filtered));
    return;
  }
  return deleteDoc(doc(db, "events", id));
};

// Helper for initial data if empty
export const seedInitialData = async () => {
  if (!isDemoMode) return;
  
  // Seed Events
  const currentEvents = await getEvents();
  if (currentEvents.length === 0) {
    const demoEvents: SportsEvent[] = [
      { id: '1', name: '100m Dash', type: 'Athletics' },
      { id: '2', name: '200m Sprint', type: 'Athletics' },
      { id: '3', name: 'Long Jump', type: 'Athletics' },
      { id: '4', name: 'Shot Put', type: 'Athletics' },
      { id: '5', name: 'Chess', type: 'Games' },
      { id: '6', name: 'Football', type: 'Games' },
      { id: '7', name: 'Badminton', type: 'Games' },
    ];
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(demoEvents));
  }
};