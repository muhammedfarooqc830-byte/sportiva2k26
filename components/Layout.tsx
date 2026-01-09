import React from 'react';
import { User } from 'firebase/auth';
import { logoutAdmin } from '../services/db';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onNavigate: (page: string) => void;
  currentPage: string;
  darkMode: boolean;
  toggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onNavigate, currentPage, darkMode, toggleTheme }) => {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      {/* Header */}
      <header className="bg-indigo-900 dark:bg-gray-900 text-white shadow-lg sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Sportiva 2K26</h1>
            <p className="text-xs sm:text-sm text-indigo-200">Jamia Islamiya Arts and Science College</p>
          </div>
          <nav className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('home')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${currentPage === 'home' ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-800'}`}
            >
              Results
            </button>
            {user ? (
               <button 
               onClick={() => onNavigate('admin')}
               className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${currentPage === 'admin' ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-800'}`}
             >
               Admin
             </button>
            ) : (
              <button 
                onClick={() => onNavigate('login')}
                className="text-xs sm:text-sm text-indigo-200 hover:text-white"
              >
                Admin Login
              </button>
            )}
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-indigo-800 dark:hover:bg-gray-700 transition-colors text-indigo-200 hover:text-white"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                // Sun Icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                // Moon Icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {user && (
              <button 
                onClick={logoutAdmin}
                className="text-xs bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-white ml-2"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© 2026 Jamia Islamiya Arts and Science College.</p>
          <p className="mt-1">Designed for Annual Sports Meet.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;