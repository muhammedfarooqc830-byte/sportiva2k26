import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { subscribeToAuth, getResults, getEvents, seedInitialData } from './services/db';
import { Result, SportsEvent } from './types';
import Layout from './components/Layout';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Celebration from './components/Celebration';
import IntroScreen from './components/IntroScreen';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<string>('home');
  const [results, setResults] = useState<Result[]>([]);
  const [events, setEvents] = useState<SportsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // Theme State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('sportiva_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply Theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sportiva_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sportiva_theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  // Initial load
  useEffect(() => {
    // 1. Auth Listener
    const unsubscribe = subscribeToAuth((u) => {
      setUser(u);
    });

    // 2. Data Load
    loadData();

    return () => unsubscribe();
  }, []);

  const loadData = async () => {
    await seedInitialData(); // Only runs if in demo mode and empty
    const resultsData = await getResults();
    const eventsData = await getEvents();
    setResults(resultsData);
    setEvents(eventsData);
    setLoading(false);
  };

  const navigate = (p: string) => {
    setPage(p);
  };

  const handleCelebrate = () => {
    setShowCelebration(true);
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  return (
    <>
      {/* Intro Screen - Fixed Overlay */}
      {showIntro && <IntroScreen onComplete={handleIntroComplete} />}
      
      {/* Main Content - Rendered behind the Intro to allow for a smooth fade-reveal */}
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <Layout 
          user={user} 
          onNavigate={navigate} 
          currentPage={page}
          darkMode={darkMode}
          toggleTheme={toggleTheme}
        >
          {page === 'home' && <Home results={results} />}
          {page === 'admin' && (
            user ? 
            <Admin results={results} events={events} refreshData={loadData} onCelebrate={handleCelebrate} /> : 
            <Login onLoginSuccess={() => navigate('admin')} />
          )}
          {page === 'login' && <Login onLoginSuccess={() => navigate('admin')} />}
          
          {showCelebration && <Celebration onClose={() => setShowCelebration(false)} />}
        </Layout>
      )}
    </>
  );
};

export default App;