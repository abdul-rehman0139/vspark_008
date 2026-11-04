import React, { useState } from 'react';
import { Calendar, MapPin, Users, Palette, Search } from 'lucide-react';
import { CampusEvent } from '../../types';
import { resolveImageUrl, IMAGE_ASSETS } from '../../assets/imageAssets';

interface EventsPageProps {
  events: CampusEvent[];
  onLaunchPosterForEvent: (event: CampusEvent) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({
  events,
  onLaunchPosterForEvent
}) => {
  const [filterType, setFilterType] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const types = ['All', 'Workshop', 'Cultural Fest', 'Exhibition'];

  const filtered = events.filter(e => {
    const matchType = filterType === 'All' || e.type === filterType;
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
                        e.description.toLowerCase().includes(search.toLowerCase()) ||
                        e.location.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Campus Calendar</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              University Events & Gatherings
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Participate in guest keynotes, technical workshops, and campus cultural festivals.
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search events, locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterType === t
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((evt) => (
            <div
              key={evt.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all shadow-md group"
            >
              <div className="aspect-[16/10] bg-slate-950 relative overflow-hidden">
                <img
                  src={resolveImageUrl(evt.image)}
                  alt={evt.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = IMAGE_ASSETS.festThumb;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-semibold text-indigo-400 border border-slate-800">
                  {evt.type}
                </div>
              </div>

              <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{evt.date} · {evt.time}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{evt.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {evt.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-4">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{evt.location}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">
                    {evt.attendeesCount} RSVP'd
                  </span>
                  <button
                    onClick={() => onLaunchPosterForEvent(evt)}
                    className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>Design Flyer</span>
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
