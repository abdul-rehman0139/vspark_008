import React, { useState } from 'react';
import { Trophy, Search, Palette, ArrowRight, Clock, Users, Tag } from 'lucide-react';
import { Competition } from '../../types';
import { resolveImageUrl, IMAGE_ASSETS } from '../../assets/imageAssets';

interface CompetitionsPageProps {
  competitions: Competition[];
  onLaunchPosterForCompetition: (comp: Competition) => void;
}

export const CompetitionsPage: React.FC<CompetitionsPageProps> = ({
  competitions,
  onLaunchPosterForCompetition
}) => {
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const categories = ['All', 'Hackathon', 'AI / Tech', 'Business', 'Design'];

  const filtered = competitions.filter(c => {
    const matchCat = selectedCat === 'All' || c.category === selectedCat;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                        c.description.toLowerCase().includes(search.toLowerCase()) ||
                        c.organizer.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
              <Trophy className="w-3.5 h-3.5" />
              <span>Campus Competitions</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Active Challenges & Hackathons
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Join leading campus teams, win grants, and design custom submission posters for your project.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search competitions, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCat === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Competition Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((comp) => (
            <div
              key={comp.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden flex flex-col sm:flex-row hover:border-slate-700 transition-all shadow-md group"
            >
              <div className="sm:w-2/5 aspect-[4/3] sm:aspect-auto bg-slate-950 relative overflow-hidden shrink-0">
                <img
                  src={resolveImageUrl(comp.image)}
                  alt={comp.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = IMAGE_ASSETS.hackathonThumb;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-slate-800">
                  {comp.prizePool}
                </div>
              </div>

              <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="text-indigo-400 font-semibold">{comp.category}</span>
                    <span className="flex items-center gap-1 font-mono text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      {comp.daysLeft}d left
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5">{comp.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {comp.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {comp.tags.map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    <strong>{comp.participants}</strong> teams joined
                  </div>

                  <button
                    onClick={() => onLaunchPosterForCompetition(comp)}
                    className="px-3.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>Design Team Poster</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
