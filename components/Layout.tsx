import React from 'react';
import { User } from 'firebase/auth';
import { logoutAdmin } from '../services/db';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onNavigate, currentPage }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-indigo-900 text-white shadow-lg sticky top-0 z-50">
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
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>© 2026 Jamia Islamiya Arts and Science College.</p>
          <p className="mt-1">Designed for Annual Sports Meet.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;