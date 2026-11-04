import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { VSparkHome } from './components/home/VSparkHome';
import { CompetitionsPage } from './components/competitions/CompetitionsPage';
import { EventsPage } from './components/events/EventsPage';
import { PosterStudioLanding } from './components/poster-studio/landing/PosterStudioLanding';
import { PosterDashboard } from './components/poster-studio/dashboard/PosterDashboard';
import { PosterAdmin } from './components/poster-studio/admin/PosterAdmin';
import { PosterEditor } from './components/poster-studio/editor/PosterEditor';
import { DimensionPickerModal } from './components/poster-studio/DimensionPickerModal';
import { PdfEditor } from './components/pdf-editor/PdfEditor';
import { AuthModal } from './components/auth/AuthModal';
import { 
  PageView, 
  UserProfile, 
  PosterDesign, 
  PosterTemplate, 
  Competition, 
  CampusEvent 
} from './types';
import { 
  INITIAL_COMPETITIONS, 
  INITIAL_EVENTS, 
  buildTemplateJson 
} from './data/sampleData';
import { StorageService } from './services/storage';
import { auth, FirebaseService } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('poster-studio');
  const [currentUser, setCurrentUser] = useState<UserProfile>(StorageService.getUser());
  const [templates, setTemplates] = useState<PosterTemplate[]>(StorageService.getTemplates());
  const [designs, setDesigns] = useState<PosterDesign[]>(StorageService.getDesigns());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Editor states
  const [activeEditorDesign, setActiveEditorDesign] = useState<PosterDesign | null>(null);
  const [activeEditorTemplate, setActiveEditorTemplate] = useState<PosterTemplate | null>(null);
  const [isDimensionModalOpen, setIsDimensionModalOpen] = useState(false);

  // Sync state and Firebase Auth on mount
  useEffect(() => {
    setTemplates(StorageService.getTemplates());
    setDesigns(StorageService.getDesigns());

    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const profile = await FirebaseService.syncUserProfile(fbUser);
          setCurrentUser(profile);
          const cloudDesigns = await FirebaseService.getDesigns(profile.id);
          if (cloudDesigns && cloudDesigns.length > 0) {
            setDesigns(cloudDesigns);
          }
        } catch (err) {
          console.warn('Auth sync error:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await FirebaseService.logout();
    setCurrentUser(StorageService.getUser());
  };

  // Role toggle
  const handleToggleRole = () => {
    const nextRole = currentUser.role === 'admin' ? 'student' : 'admin';
    const updated = StorageService.switchRole(nextRole);
    setCurrentUser(updated);
  };

  // Launch Blank Canvas
  const handleStartBlank = (width: number, height: number, dimensionName: string, title?: string) => {
    const blankDesign: PosterDesign = {
      id: 'design_' + Date.now(),
      userId: currentUser.id,
      title: title || 'Untitled Poster',
      thumbnailUrl: '',
      canvasWidth: width,
      canvasHeight: height,
      dimensionName: dimensionName,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      designJson: {
        version: '5.3.0',
        objects: [],
        background: '#0f172a'
      }
    };
    setActiveEditorDesign(blankDesign);
    setActiveEditorTemplate(null);
    setCurrentPage('poster-editor');
  };

  // Launch with Template
  const handleSelectTemplate = (template: PosterTemplate) => {
    StorageService.incrementStat('totalDesignsCreated', template.id);
    setActiveEditorTemplate(template);
    setActiveEditorDesign(null);
    setCurrentPage('poster-editor');
  };

  // Launch with Existing Design
  const handleEditDesign = (design: PosterDesign) => {
    setActiveEditorDesign(design);
    setActiveEditorTemplate(null);
    setCurrentPage('poster-editor');
  };

  // Launch Poster for Competition
  const handleLaunchPosterForCompetition = (comp: Competition) => {
    const compTemplate: PosterTemplate = {
      id: 'tpl_comp_' + comp.id,
      name: `${comp.title} - Official Team Poster`,
      category: 'Competition',
      thumbnailUrl: comp.image,
      canvasWidth: 794,
      canvasHeight: 1123,
      dimensionName: 'A4 Portrait',
      description: `Official team poster for ${comp.title}`,
      tags: comp.tags,
      isActive: true,
      createdAt: new Date().toISOString(),
      designJson: buildTemplateJson({
        width: 794,
        height: 1123,
        bgColor: '#090d16',
        elements: [
          {
            type: 'rect',
            left: 50,
            top: 50,
            width: 694,
            height: 1023,
            fill: '#0f172a',
            stroke: '#6366f1',
            strokeWidth: 2,
            rx: 16,
            ry: 16
          },
          {
            type: 'textbox',
            left: 80,
            top: 100,
            width: 634,
            text: comp.organizer.toUpperCase(),
            fontSize: 13,
            fontFamily: 'Space Mono',
            fontWeight: 'bold',
            fill: '#818cf8',
            textAlign: 'center',
            charSpacing: 150
          },
          {
            type: 'textbox',
            left: 80,
            top: 150,
            width: 634,
            text: comp.title,
            fontSize: 44,
            fontFamily: 'Montserrat',
            fontWeight: '900',
            fill: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.1
          },
          {
            type: 'rect',
            left: 120,
            top: 320,
            width: 554,
            height: 100,
            fill: '#1e1b4b',
            stroke: '#a855f7',
            strokeWidth: 1.5,
            rx: 12,
            ry: 12
          },
          {
            type: 'textbox',
            left: 140,
            top: 345,
            width: 514,
            text: `PRIZE POOL: ${comp.prizePool}`,
            fontSize: 26,
            fontFamily: 'Montserrat',
            fontWeight: 'bold',
            fill: '#facc15',
            textAlign: 'center'
          },
          {
            type: 'textbox',
            left: 100,
            top: 480,
            width: 594,
            text: comp.description,
            fontSize: 16,
            fontFamily: 'Outfit',
            fill: '#cbd5e1',
            textAlign: 'center',
            lineHeight: 1.6
          },
          {
            type: 'textbox',
            left: 100,
            top: 680,
            width: 594,
            text: 'TEAM ROSTER & TECH STACK',
            fontSize: 18,
            fontFamily: 'Montserrat',
            fontWeight: 'bold',
            fill: '#38bdf8',
            textAlign: 'center'
          },
          {
            type: 'textbox',
            left: 100,
            top: 730,
            width: 594,
            text: 'Lead Engineer: Alex Rivera\nUI/UX Designer: Campus Innovator\nTracks: ' + comp.tags.join(' · '),
            fontSize: 16,
            fontFamily: 'Plus Jakarta Sans',
            fill: '#f1f5f9',
            textAlign: 'center',
            lineHeight: 1.8
          },
          {
            type: 'rect',
            left: 100,
            top: 920,
            width: 594,
            height: 90,
            fill: '#1e293b',
            rx: 10,
            ry: 10
          },
          {
            type: 'textbox',
            left: 120,
            top: 950,
            width: 554,
            text: `REGISTRATION DEADLINE: ${comp.deadline}`,
            fontSize: 16,
            fontFamily: 'Montserrat',
            fontWeight: 'bold',
            fill: '#ffffff',
            textAlign: 'center'
          }
        ]
      })
    };

    handleSelectTemplate(compTemplate);
  };

  // Launch Poster for Campus Event
  const handleLaunchPosterForEvent = (event: CampusEvent) => {
    const evtTemplate: PosterTemplate = {
      id: 'tpl_evt_' + event.id,
      name: `${event.title} - Official Flyer`,
      category: 'University Event',
      thumbnailUrl: event.image,
      canvasWidth: 794,
      canvasHeight: 1123,
      dimensionName: 'A4 Portrait',
      description: `Event announcement flyer for ${event.title}`,
      tags: event.tags,
      isActive: true,
      createdAt: new Date().toISOString(),
      designJson: buildTemplateJson({
        width: 794,
        height: 1123,
        bgColor: '#0f172a',
        elements: [
          {
            type: 'textbox',
            left: 80,
            top: 100,
            width: 634,
            text: 'CAMPUS LIFE PRESENTS',
            fontSize: 14,
            fontFamily: 'Outfit',
            fontWeight: 'bold',
            fill: '#38bdf8',
            textAlign: 'center',
            charSpacing: 200
          },
          {
            type: 'textbox',
            left: 80,
            top: 160,
            width: 634,
            text: event.title,
            fontSize: 48,
            fontFamily: 'Montserrat',
            fontWeight: '900',
            fill: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.15
          },
          {
            type: 'textbox',
            left: 100,
            top: 320,
            width: 594,
            text: `Hosted by: ${event.speakerOrHost}`,
            fontSize: 18,
            fontFamily: 'Outfit',
            fontStyle: 'italic',
            fill: '#facc15',
            textAlign: 'center'
          },
          {
            type: 'rect',
            left: 100,
            top: 400,
            width: 594,
            height: 140,
            fill: '#1e293b',
            rx: 12,
            ry: 12
          },
          {
            type: 'textbox',
            left: 120,
            top: 430,
            width: 554,
            text: `${event.date} · ${event.time}`,
            fontSize: 22,
            fontFamily: 'Montserrat',
            fontWeight: 'bold',
            fill: '#ffffff',
            textAlign: 'center'
          },
          {
            type: 'textbox',
            left: 120,
            top: 480,
            width: 554,
            text: event.location,
            fontSize: 16,
            fontFamily: 'Outfit',
            fill: '#94a3b8',
            textAlign: 'center'
          },
          {
            type: 'textbox',
            left: 100,
            top: 600,
            width: 594,
            text: event.description,
            fontSize: 16,
            fontFamily: 'Plus Jakarta Sans',
            fill: '#cbd5e1',
            textAlign: 'center',
            lineHeight: 1.6
          }
        ]
      })
    };

    handleSelectTemplate(evtTemplate);
  };

  // If in PDF editor mode, render full screen PDF studio
  if (currentPage === 'pdf-editor') {
    return (
      <PdfEditor
        currentUser={currentUser}
        onBackToStudio={() => setCurrentPage('poster-studio')}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />
    );
  }

  // If in poster editor mode, render full screen editor
  if (currentPage === 'poster-editor') {
    return (
      <PosterEditor
        initialDesign={activeEditorDesign}
        initialTemplate={activeEditorTemplate}
        onBack={() => setCurrentPage('poster-studio')}
        onDesignSaved={(saved) => {
          setDesigns(StorageService.getDesigns());
          FirebaseService.saveDesign(saved).catch(console.warn);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        currentUser={currentUser}
        onToggleRole={handleToggleRole}
        onOpenCreateModal={() => setIsDimensionModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Pages */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <VSparkHome
            competitions={INITIAL_COMPETITIONS}
            events={INITIAL_EVENTS}
            featuredTemplates={templates.filter(t => t.isFeatured)}
            onNavigate={setCurrentPage}
            onLaunchPosterForCompetition={handleLaunchPosterForCompetition}
            onSelectTemplate={handleSelectTemplate}
            onOpenCreateModal={() => setIsDimensionModalOpen(true)}
          />
        )}

        {currentPage === 'competitions' && (
          <CompetitionsPage
            competitions={INITIAL_COMPETITIONS}
            onLaunchPosterForCompetition={handleLaunchPosterForCompetition}
          />
        )}

        {currentPage === 'events' && (
          <EventsPage
            events={INITIAL_EVENTS}
            onLaunchPosterForEvent={handleLaunchPosterForEvent}
          />
        )}

        {currentPage === 'poster-studio' && (
          <PosterStudioLanding
            templates={templates.filter(t => t.isActive)}
            onOpenCreateModal={() => setIsDimensionModalOpen(true)}
            onSelectTemplate={handleSelectTemplate}
            onOpenDashboard={() => setCurrentPage('poster-dashboard')}
            onOpenPdfEditor={() => setCurrentPage('pdf-editor')}
          />
        )}

        {currentPage === 'poster-dashboard' && (
          <PosterDashboard
            user={currentUser}
            designs={designs}
            templates={templates}
            onOpenCreateModal={() => setIsDimensionModalOpen(true)}
            onEditDesign={handleEditDesign}
            onSelectTemplate={handleSelectTemplate}
            onRefreshDesigns={() => setDesigns(StorageService.getDesigns())}
          />
        )}

        {currentPage === 'poster-admin' && (
          <PosterAdmin
            templates={templates}
            onRefreshTemplates={() => setTemplates(StorageService.getTemplates())}
            onEditTemplateInCanvas={handleSelectTemplate}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={setCurrentPage} />

      {/* Auth Modal with Google & Email Sign-In */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

      {/* Dimension Picker Modal */}
      <DimensionPickerModal
        isOpen={isDimensionModalOpen}
        onClose={() => setIsDimensionModalOpen(false)}
        onStartBlank={handleStartBlank}
        onBrowseTemplates={() => {
          setCurrentPage('poster-studio');
          setTimeout(() => {
            const el = document.getElementById('template-library-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      />
    </div>
  );
}
