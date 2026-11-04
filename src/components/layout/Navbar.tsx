import React, { useState } from 'react';
import { 
  Sparkles, 
  Shield, 
  User, 
  Palette, 
  FileText, 
  Menu, 
  X, 
  ChevronRight, 
  Plus, 
  LogIn, 
  LogOut, 
  CheckCircle2 
} from 'lucide-react';
import { PageView, UserProfile } from '../../types';
import { FirebaseService } from '../../services/firebase';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  currentUser: UserProfile;
  onToggleRole: () => void;
  onOpenCreateModal: () => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  onToggleRole,
  onOpenCreateModal,
  onOpenAuthModal,
  onLogout
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleNavClick = (page: PageView) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  };

  const isGuest = currentUser.id.startsWith('guest_') || currentUser.id === 'user_1';

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-6 px-4 sm:px-6 h-16">
        {/* Brand */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 group text-left cursor-pointer shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-all">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-white leading-none">
              VSpark
            </span>
            <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">
              Studio & Hub
            </span>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium">
          <button
            onClick={() => handleNavClick('home')}
            className={`transition-colors cursor-pointer ${
              currentPage === 'home'
                ? 'text-indigo-400 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNavClick('competitions')}
            className={`transition-colors cursor-pointer ${
              currentPage === 'competitions'
                ? 'text-indigo-400 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Competitions
          </button>

          <button
            onClick={() => handleNavClick('events')}
            className={`transition-colors cursor-pointer ${
              currentPage === 'events'
                ? 'text-indigo-400 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Events
          </button>

          <button
            onClick={() => handleNavClick('poster-studio')}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              currentPage === 'poster-studio'
                ? 'text-indigo-400 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4 text-indigo-400" />
            <span>Poster Studio</span>
          </button>

          {/* New PDF Editor Navigation Tab */}
          <button
            onClick={() => handleNavClick('pdf-editor')}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer relative ${
              currentPage === 'pdf-editor'
                ? 'text-purple-400 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-purple-400" />
            <span>PDF Editor</span>
            <span className="px-1.5 py-0.2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-extrabold rounded-full shadow-sm">
              NEW
            </span>
          </button>

          <button
            onClick={() => handleNavClick('poster-dashboard')}
            className={`transition-colors cursor-pointer ${
              currentPage === 'poster-dashboard'
                ? 'text-indigo-400 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Dashboard
          </button>

          {currentUser.role === 'admin' && (
            <button
              onClick={() => handleNavClick('poster-admin')}
              className={`flex items-center gap-1 transition-colors cursor-pointer ${
                currentPage === 'poster-admin'
                  ? 'text-amber-400 font-bold'
                  : 'text-amber-300/80 hover:text-amber-300'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Console</span>
            </button>
          )}
        </nav>

        {/* Zone 3: User Auth & CTA */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick PDF button */}
          <button
            onClick={() => handleNavClick('pdf-editor')}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-950/50 hover:bg-purple-900/60 text-purple-300 border border-purple-500/30 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            <span>Edit PDF</span>
          </button>

          {/* Create Poster Button */}
          <button
            onClick={onOpenCreateModal}
            className="px-3 sm:px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-600/30 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Poster</span>
          </button>

          {/* User Auth Profile / Login */}
          <div className="relative">
            {isGuest ? (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sign In / Admin</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full bg-slate-900 border border-slate-700/80 hover:border-slate-600 transition-all text-xs text-slate-200"
                >
                  <img
                    src={currentUser.avatar || currentUser.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full ring-1 ring-indigo-500/50 object-cover"
                  />
                  <span className="font-semibold max-w-[90px] truncate hidden sm:inline">
                    {currentUser.name}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                    currentUser.role === 'admin' 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}>
                    {currentUser.role}
                  </span>
                </button>

                {/* Dropdown menu */}
                {showUserMenu && (
                  <div className="absolute right-0 top-11 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Cloud Database Synced</span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => { handleNavClick('poster-dashboard'); setShowUserMenu(false); }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-between"
                      >
                        <span>My Designs</span>
                      </button>
                      
                      <button
                        onClick={() => { handleNavClick('pdf-editor'); setShowUserMenu(false); }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-between"
                      >
                        <span>PDF Editor & Watermark Tool</span>
                      </button>

                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => { handleNavClick('poster-admin'); setShowUserMenu(false); }}
                          className="w-full text-left px-3 py-2 text-xs text-amber-300 hover:bg-amber-950/40 rounded-lg transition-colors flex items-center justify-between font-semibold"
                        >
                          <span>Admin Console</span>
                        </button>
                      )}

                      <button
                        onClick={() => { onToggleRole(); setShowUserMenu(false); }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        Switch Role ({currentUser.role === 'admin' ? 'Student' : 'Admin'})
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-800">
                      <button
                        onClick={() => { onLogout(); setShowUserMenu(false); }}
                        className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-950/30 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/98 px-4 py-4 space-y-2 animate-in fade-in shadow-2xl">
          <button
            onClick={() => handleNavClick('home')}
            className="w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-900"
          >
            <span>Home</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            onClick={() => handleNavClick('competitions')}
            className="w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-900"
          >
            <span>Competitions</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            onClick={() => handleNavClick('events')}
            className="w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-900"
          >
            <span>Events</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            onClick={() => handleNavClick('poster-studio')}
            className="w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-900"
          >
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-400" />
              <span>Poster Studio</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          {/* Mobile PDF Editor Link */}
          <button
            onClick={() => handleNavClick('pdf-editor')}
            className="w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium bg-purple-950/40 text-purple-300 border border-purple-500/30"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <span>PDF Editor & Watermark Tool</span>
            </div>
            <span className="px-1.5 py-0.5 bg-purple-500 text-white text-[10px] font-bold rounded-full">
              NEW
            </span>
          </button>

          <button
            onClick={() => handleNavClick('poster-dashboard')}
            className="w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-900"
          >
            <span>My Posters & Drafts</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          {currentUser.role === 'admin' && (
            <button
              onClick={() => handleNavClick('poster-admin')}
              className="w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold text-amber-300 bg-amber-950/40 border border-amber-500/30"
            >
              <span>Admin Console</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          )}

          {/* Mobile Auth action */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Account</span>
            {isGuest ? (
              <button
                onClick={() => { setIsMobileMenuOpen(false); onOpenAuthModal(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Admin</span>
              </button>
            ) : (
              <button
                onClick={() => { setIsMobileMenuOpen(false); onLogout(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600/20 text-red-300 border border-red-500/30"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out ({currentUser.name})</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
