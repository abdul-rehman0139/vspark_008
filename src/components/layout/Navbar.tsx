import React, { useState } from 'react';
import { Sparkles, Shield, User, Palette, Menu, X, ChevronRight, Plus } from 'lucide-react';
import { PageView, UserProfile } from '../../types';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  currentUser: UserProfile;
  onToggleRole: () => void;
  onOpenCreateModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  onToggleRole,
  onOpenCreateModal
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (page: PageView) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 h-16">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 group text-left cursor-pointer shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/30 group-hover:bg-indigo-500 transition-colors">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap">
            VSpark
          </span>
        </button>

        {/* Zone 2: Desktop Navigation Links (hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-medium">
          <button
            onClick={() => handleNavClick('home')}
            className={`whitespace-nowrap transition-colors cursor-pointer ${
              currentPage === 'home'
                ? 'text-indigo-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNavClick('competitions')}
            className={`whitespace-nowrap transition-colors cursor-pointer ${
              currentPage === 'competitions'
                ? 'text-indigo-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Competitions
          </button>

          <button
            onClick={() => handleNavClick('events')}
            className={`whitespace-nowrap transition-colors cursor-pointer ${
              currentPage === 'events'
                ? 'text-indigo-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Events
          </button>

          <button
            onClick={() => handleNavClick('poster-studio')}
            className={`flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
              currentPage === 'poster-studio'
                ? 'text-indigo-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            <span>Poster Studio</span>
          </button>

          <button
            onClick={() => handleNavClick('poster-dashboard')}
            className={`whitespace-nowrap transition-colors cursor-pointer ${
              currentPage === 'poster-dashboard'
                ? 'text-indigo-400 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Dashboard
          </button>

          {currentUser.role === 'admin' && (
            <button
              onClick={() => handleNavClick('poster-admin')}
              className={`whitespace-nowrap transition-colors cursor-pointer ${
                currentPage === 'poster-admin'
                  ? 'text-amber-400 font-semibold'
                  : 'text-amber-300/80 hover:text-amber-300'
              }`}
            >
              Admin Studio
            </button>
          )}
        </nav>

        {/* Zone 3: Actions + Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* User Role Switcher (desktop) */}
          <button
            onClick={onToggleRole}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 transition-colors cursor-pointer"
            title={`Current: ${currentUser.role}. Click to switch role.`}
          >
            {currentUser.role === 'admin' ? (
              <Shield className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <User className="w-3.5 h-3.5 text-indigo-400" />
            )}
            <span className="capitalize font-medium">{currentUser.role}</span>
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenCreateModal}
            className="px-3 sm:px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-600/30 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5 sm:hidden" />
            <span className="hidden sm:inline">Create Poster</span>
            <span className="sm:hidden">Design</span>
          </button>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 py-4 space-y-2 animate-fade-in shadow-2xl">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors ${
              currentPage === 'home'
                ? 'bg-indigo-950/60 text-indigo-400 border border-indigo-500/30 font-semibold'
                : 'text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span>Home</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            onClick={() => handleNavClick('competitions')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors ${
              currentPage === 'competitions'
                ? 'bg-indigo-950/60 text-indigo-400 border border-indigo-500/30 font-semibold'
                : 'text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span>Competitions</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            onClick={() => handleNavClick('events')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors ${
              currentPage === 'events'
                ? 'bg-indigo-950/60 text-indigo-400 border border-indigo-500/30 font-semibold'
                : 'text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span>Events</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            onClick={() => handleNavClick('poster-studio')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors ${
              currentPage === 'poster-studio'
                ? 'bg-indigo-950/60 text-indigo-400 border border-indigo-500/30 font-semibold'
                : 'text-slate-200 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-400" />
              <span>Poster Studio</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            onClick={() => handleNavClick('poster-dashboard')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors ${
              currentPage === 'poster-dashboard'
                ? 'bg-indigo-950/60 text-indigo-400 border border-indigo-500/30 font-semibold'
                : 'text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span>My Posters & Drafts</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          {currentUser.role === 'admin' && (
            <button
              onClick={() => handleNavClick('poster-admin')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors ${
                currentPage === 'poster-admin'
                  ? 'bg-amber-950/60 text-amber-400 border border-amber-500/30 font-semibold'
                  : 'text-amber-300 hover:bg-slate-900'
              }`}
            >
              <span>Admin Studio Console</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          )}

          {/* Role switcher for mobile */}
          <div className="pt-3 mt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Current Role</span>
            <button
              onClick={onToggleRole}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-slate-900 border border-slate-800 text-slate-200 hover:border-slate-700 transition-colors"
            >
              {currentUser.role === 'admin' ? (
                <Shield className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <User className="w-3.5 h-3.5 text-indigo-400" />
              )}
              <span className="capitalize font-semibold">{currentUser.role} Mode</span>
              <span className="text-[10px] text-indigo-400 ml-1">(Switch)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
