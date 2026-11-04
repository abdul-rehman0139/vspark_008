import React from 'react';
import { Sparkles } from 'lucide-react';
import { PageView } from '../../types';

interface FooterProps {
  onNavigate: (page: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 py-10 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-200 text-sm">VSpark</span>
          <span className="text-slate-600">·</span>
          <span>Campus Competitions & Poster Studio</span>
        </div>

        <div className="flex items-center gap-6 text-slate-400">
          <button onClick={() => onNavigate('home')} className="hover:text-slate-200 transition-colors cursor-pointer">
            Home
          </button>
          <button onClick={() => onNavigate('competitions')} className="hover:text-slate-200 transition-colors cursor-pointer">
            Competitions
          </button>
          <button onClick={() => onNavigate('events')} className="hover:text-slate-200 transition-colors cursor-pointer">
            Events
          </button>
          <button onClick={() => onNavigate('poster-studio')} className="hover:text-slate-200 transition-colors cursor-pointer">
            Poster Studio
          </button>
          <button onClick={() => onNavigate('pdf-editor')} className="hover:text-purple-300 text-purple-400 font-semibold transition-colors cursor-pointer">
            PDF Editor
          </button>
          <button onClick={() => onNavigate('poster-dashboard')} className="hover:text-slate-200 transition-colors cursor-pointer">
            My Designs
          </button>
        </div>

        <div className="text-slate-500 text-right">
          © {new Date().getFullYear()} VSpark Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
