import React from 'react';
import { 
  Trophy, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  Palette, 
  Users, 
  Clock, 
  CheckCircle2, 
  Zap,
  Layers,
  Award
} from 'lucide-react';
import { Competition, CampusEvent, PageView, PosterTemplate } from '../../types';
import { IMAGE_ASSETS } from '../../assets/imageAssets';

interface VSparkHomeProps {
  competitions: Competition[];
  events: CampusEvent[];
  featuredTemplates: PosterTemplate[];
  onNavigate: (page: PageView) => void;
  onLaunchPosterForCompetition: (comp: Competition) => void;
  onSelectTemplate: (template: PosterTemplate) => void;
  onOpenCreateModal: () => void;
}

export const VSparkHome: React.FC<VSparkHomeProps> = ({
  competitions,
  events,
  featuredTemplates,
  onNavigate,
  onLaunchPosterForCompetition,
  onSelectTemplate,
  onOpenCreateModal
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-900 bg-gradient-to-b from-indigo-950/20 via-slate-950 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text & Primary Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-800/50 px-3 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Premier Student Competition & Design Ecosystem</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-balance">
                Compete. Innovate. Design. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-200">Shine.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl">
                Discover university hackathons, research symposiums, and pitch competitions. Now featuring <strong className="text-slate-200 font-semibold">VSpark Poster Studio</strong>: design and export print-quality event posters in minutes.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('poster-studio')}
                  className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <Palette className="w-4 h-4" />
                  <span>Launch Poster Studio</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  onClick={() => onNavigate('competitions')}
                  className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 font-semibold rounded-xl text-sm transition-all cursor-pointer"
                >
                  Explore Competitions
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-900 max-w-lg">
                <div>
                  <p className="text-2xl font-black text-white font-mono">$45,000+</p>
                  <p className="text-xs text-slate-400 mt-0.5">Active Prize Pool</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white font-mono">1,200+</p>
                  <p className="text-xs text-slate-400 mt-0.5">Student Innovators</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white font-mono">100% Free</p>
                  <p className="text-xs text-slate-400 mt-0.5">Built-in Studio</p>
                </div>
              </div>
            </div>

            {/* Poster Studio Hero Showcase Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/80 shadow-2xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono text-slate-400 ml-2">VSpark Poster Studio</span>
                  </div>
                  <span className="text-[10px] text-indigo-400 font-medium">New Feature</span>
                </div>

                <div className="aspect-[16/10] rounded-xl overflow-hidden relative group cursor-pointer" onClick={() => onNavigate('poster-studio')}>
                  <img
                    src={IMAGE_ASSETS.heroMockup}
                    alt="Poster Studio Preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold shadow">
                      Open Poster Studio →
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <h4 className="text-sm font-bold text-white">Need a poster for your team?</h4>
                    <p className="text-xs text-slate-400">Design submission flyers & team badges effortlessly</p>
                  </div>
                  <button
                    onClick={onOpenCreateModal}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVE COMPETITIONS STRIP */}
      <section className="py-16 border-b border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
                <Trophy className="w-3.5 h-3.5" />
                <span>Featured Competitions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Top Campus Hackathons & Contests
              </h2>
            </div>
            <button
              onClick={() => onNavigate('competitions')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View all competitions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {competitions.slice(0, 4).map((comp) => (
              <div
                key={comp.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden flex flex-col hover:border-slate-700 transition-all duration-300 shadow-sm"
              >
                <div className="aspect-[16/10] w-full bg-slate-950 relative overflow-hidden">
                  <img
                    src={comp.image}
                    alt={comp.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-slate-800">
                    {comp.prizePool}
                  </div>
                  <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] text-slate-300 border border-slate-800">
                    {comp.daysLeft} days left
                  </div>
                </div>

                <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                  <div>
                    <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
                      {comp.category}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1 line-clamp-1">{comp.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {comp.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">{comp.participants} registered</span>
                    <button
                      onClick={() => onLaunchPosterForCompetition(comp)}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer hover:underline"
                      title="Launch Poster Studio with pre-made theme"
                    >
                      <Palette className="w-3 h-3" />
                      <span>Design Poster</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POSTER STUDIO DEDICATED BANNER */}
      <section className="py-16 bg-gradient-to-r from-indigo-950/30 via-slate-900 to-indigo-950/30 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl border border-indigo-800/40 bg-slate-900/90 p-8 sm:p-12 relative overflow-hidden shadow-2xl">
            <div className="max-w-2xl relative z-10 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-300 bg-indigo-900/50 border border-indigo-700/50 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Integrated Creative Workspace</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Empower Your Campus Events with Professional Posters.
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                No graphic design experience required. Pick a pre-configured template, adjust typography, insert your sponsor logos, and download vector print PDFs or web PNGs in seconds.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('poster-studio')}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Palette className="w-4 h-4" />
                  <span>Open Poster Studio</span>
                </button>
                <button
                  onClick={onOpenCreateModal}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer"
                >
                  Create from Blank
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Campus Calendar</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Upcoming Workshops & Gatherings
              </h2>
            </div>
            <button
              onClick={() => onNavigate('events')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View all events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold text-indigo-400">{evt.type}</span>
                    <span className="font-mono">{evt.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{evt.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="truncate max-w-[150px]">{evt.location}</span>
                  <button
                    onClick={() => onNavigate('poster-studio')}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                  >
                    Make Flyer →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
