import { Competition, CampusEvent, PosterTemplate, UserProfile } from '../types';
import { IMAGE_ASSETS } from '../assets/imageAssets';

export const CURRENT_USER: UserProfile = {
  id: 'usr_student_01',
  name: 'Alex Rivera',
  email: 'alex.rivera@campus.edu',
  avatarUrl: IMAGE_ASSETS.studentAvatar,
  role: 'student',
  institution: 'Metropolitan Tech University'
};

export const ADMIN_USER: UserProfile = {
  id: 'usr_admin_01',
  name: 'Dr. Sarah Mitchell',
  email: 'admin.poster@vspark.edu',
  avatarUrl: IMAGE_ASSETS.adminAvatar,
  role: 'admin',
  institution: 'VSpark Campus Council'
};

export const INITIAL_COMPETITIONS: Competition[] = [
  {
    id: 'comp-1',
    title: 'CodeFest 2026: Campus AI Hackathon',
    organizer: 'ACM Student Chapter & CS Dept',
    category: 'Hackathon',
    prizePool: '$10,000',
    deadline: 'Nov 18, 2026',
    daysLeft: 14,
    participants: 342,
    image: IMAGE_ASSETS.hackathonThumb,
    tags: ['AI & ML', 'Full-Stack', 'Open Source', 'Cash Prize'],
    description: 'Build breakthrough applications using generative AI, robotics, or distributed computing over 36 electrifying hours.'
  },
  {
    id: 'comp-2',
    title: 'Global Academic Symposium on Climate',
    organizer: 'Institute for Environmental Sciences',
    category: 'AI / Tech',
    prizePool: '$5,000 + Publication',
    deadline: 'Dec 02, 2026',
    daysLeft: 28,
    participants: 180,
    image: IMAGE_ASSETS.symposiumThumb,
    tags: ['Research Papers', 'Sustainability', 'Keynote Sessions'],
    description: 'Present original research on renewable energy grids, climate modeling, and smart eco-cities to international faculty.'
  },
  {
    id: 'comp-3',
    title: 'Venture Sprint: Student Startup Pitch',
    organizer: 'Entrepreneurship & Innovation Center',
    category: 'Business',
    prizePool: '$25,000 Seed Fund',
    deadline: 'Nov 25, 2026',
    daysLeft: 21,
    participants: 215,
    image: IMAGE_ASSETS.startupThumb,
    tags: ['Pitch Deck', 'Seed Funding', 'Angel Investors'],
    description: 'Pitch your early-stage venture directly to Silicon Valley partners, alumni angels, and venture capital syndicates.'
  },
  {
    id: 'comp-4',
    title: 'Spring Unity Fest 2026: Design & Battle',
    organizer: 'Campus Arts & Culture Union',
    category: 'Design',
    prizePool: '$3,500',
    deadline: 'Nov 30, 2026',
    daysLeft: 26,
    participants: 410,
    image: IMAGE_ASSETS.festThumb,
    tags: ['Live Beats', 'Visual Arts', 'Band Showcase'],
    description: 'The premier annual cultural festival featuring live stage performances, visual art installations, and design battles.'
  }
];

export const INITIAL_EVENTS: CampusEvent[] = [
  {
    id: 'evt-1',
    title: 'NextGen Generative AI & Agents Masterclass',
    type: 'Workshop',
    date: 'Nov 12, 2026',
    time: '4:00 PM - 6:30 PM',
    location: 'Auditorium Hall B & Virtual Stream',
    speakerOrHost: 'Marcus Vance, Staff AI Engineer',
    attendeesCount: 290,
    image: IMAGE_ASSETS.hackathonThumb,
    tags: ['Generative AI', 'Agentic Systems', 'Hands-on Code'],
    description: 'Deep dive into LLM tool-calling, multimodal interactions, and agent architectures with live interactive notebooks.'
  },
  {
    id: 'evt-2',
    title: 'Annual Campus Startup Showcase & Mixer',
    type: 'Exhibition',
    date: 'Nov 20, 2026',
    time: '5:00 PM - 8:00 PM',
    location: 'Student Innovation Quadrangle',
    speakerOrHost: 'E-Club & Campus Ventures',
    attendeesCount: 450,
    image: IMAGE_ASSETS.startupThumb,
    tags: ['Networking', 'Demo Day', 'Free Food & Swag'],
    description: 'Explore 30+ student-led hardware and software demos, network with founders, and vote for the Peoples Choice award.'
  },
  {
    id: 'evt-3',
    title: 'Unity Fest Main Stage: Live Music & Arts',
    type: 'Cultural Fest',
    date: 'Dec 05, 2026',
    time: '6:00 PM - 11:00 PM',
    location: 'Main Campus Amphitheater',
    speakerOrHost: 'Student Life Committee',
    attendeesCount: 1200,
    image: IMAGE_ASSETS.festThumb,
    tags: ['Live Concert', 'Food Stalls', 'Light Show'],
    description: 'An unforgettable night featuring 5 student indie bands, guest DJ set, laser mapping, and food truck alley.'
  }
];

// Helper to create valid Fabric.js JSON designs for templates
export function buildTemplateJson(options: {
  width: number;
  height: number;
  bgColor?: string;
  elements: any[];
}) {
  const sanitized = (options.elements || []).map((el) => {
    if (el && (el.type === 'textbox' || el.type === 'text' || el.type === 'i-text')) {
      return {
        ...el,
        styles: el.styles || {}
      };
    }
    return el;
  });

  return {
    version: '5.3.0',
    objects: sanitized,
    background: options.bgColor || '#0f172a'
  };
}

// 8 Rich original templates pre-configured with Fabric.js objects
export const INITIAL_TEMPLATES: PosterTemplate[] = [
  {
    id: 'tpl-hackathon',
    name: 'Cyber Pulse Hackathon 2026',
    category: 'Hackathon',
    thumbnailUrl: IMAGE_ASSETS.hackathonThumb,
    canvasWidth: 794,
    canvasHeight: 1123,
    dimensionName: 'A4 Portrait',
    description: 'High-octane neon cyber aesthetic for university hackathons, coding contests, and technical dev fests.',
    tags: ['Tech', 'Coding', 'Cyberpunk', 'Competition'],
    isFeatured: true,
    isActive: true,
    createdAt: '2026-10-15',
    designJson: buildTemplateJson({
      width: 794,
      height: 1123,
      bgColor: '#090d16',
      elements: [
        // Background banner shape
        {
          type: 'rect',
          left: 40,
          top: 40,
          width: 714,
          height: 1043,
          fill: '#0f172a',
          stroke: '#6366f1',
          strokeWidth: 2,
          rx: 16,
          ry: 16,
          opacity: 0.85
        },
        // Decorative top pill badge
        {
          type: 'rect',
          left: 247,
          top: 80,
          width: 300,
          height: 38,
          fill: '#4338ca',
          rx: 19,
          ry: 19
        },
        {
          type: 'textbox',
          left: 260,
          top: 88,
          width: 274,
          text: 'VSPARK ANNUAL HACKATHON',
          fontSize: 14,
          fontFamily: 'Space Mono',
          fontWeight: 'bold',
          fill: '#c7d2fe',
          textAlign: 'center'
        },
        // Main headline
        {
          type: 'textbox',
          left: 80,
          top: 160,
          width: 634,
          text: 'CODE FEST\n2026',
          fontSize: 76,
          fontFamily: 'Montserrat',
          fontWeight: '900',
          fill: '#f8fafc',
          lineHeight: 0.95,
          textAlign: 'center',
          shadow: { color: 'rgba(99, 102, 241, 0.6)', blur: 25, offsetX: 0, offsetY: 0 }
        },
        // Tagline
        {
          type: 'textbox',
          left: 80,
          top: 350,
          width: 634,
          text: 'INNOVATE · BUILD · DEPLOY IN 36 HOURS',
          fontSize: 18,
          fontFamily: 'Outfit',
          fontWeight: '600',
          fill: '#38bdf8',
          textAlign: 'center',
          charSpacing: 100
        },
        // Prize Highlight Card
        {
          type: 'rect',
          left: 120,
          top: 420,
          width: 554,
          height: 140,
          fill: '#1e1b4b',
          stroke: '#818cf8',
          strokeWidth: 1.5,
          rx: 12,
          ry: 12
        },
        {
          type: 'textbox',
          left: 140,
          top: 445,
          width: 514,
          text: '🏆 $10,000 TOTAL PRIZE POOL',
          fontSize: 26,
          fontFamily: 'Montserrat',
          fontWeight: 'bold',
          fill: '#facc15',
          textAlign: 'center'
        },
        {
          type: 'textbox',
          left: 140,
          top: 495,
          width: 514,
          text: 'Top Tier Mentorship · Cloud Credits · VC Fast-Track',
          fontSize: 16,
          fontFamily: 'Outfit',
          fill: '#e0e7ff',
          textAlign: 'center'
        },
        // Tracks header
        {
          type: 'textbox',
          left: 100,
          top: 600,
          width: 594,
          text: 'FOUR DYNAMIC COMPETITION TRACKS',
          fontSize: 18,
          fontFamily: 'Montserrat',
          fontWeight: 'bold',
          fill: '#a5b4fc',
          textAlign: 'center'
        },
        // Track 1 & 2
        {
          type: 'rect',
          left: 120,
          top: 650,
          width: 260,
          height: 100,
          fill: '#1e293b',
          rx: 8,
          ry: 8
        },
        {
          type: 'textbox',
          left: 135,
          top: 670,
          width: 230,
          text: '🤖 Agentic AI & LLMs\nAutonomous workflows & tools',
          fontSize: 15,
          fontFamily: 'Outfit',
          fontWeight: 'bold',
          fill: '#f1f5f9',
          textAlign: 'center'
        },
        {
          type: 'rect',
          left: 414,
          top: 650,
          width: 260,
          height: 100,
          fill: '#1e293b',
          rx: 8,
          ry: 8
        },
        {
          type: 'textbox',
          left: 429,
          top: 670,
          width: 230,
          text: '🌐 Web3 & Fintech\nDecentralized finance & protocols',
          fontSize: 15,
          fontFamily: 'Outfit',
          fontWeight: 'bold',
          fill: '#f1f5f9',
          textAlign: 'center'
        },
        // Event Date & Location footer
        {
          type: 'rect',
          left: 80,
          top: 890,
          width: 634,
          height: 120,
          fill: '#111827',
          stroke: '#374151',
          strokeWidth: 1,
          rx: 12,
          ry: 12
        },
        {
          type: 'textbox',
          left: 100,
          top: 915,
          width: 594,
          text: 'NOVEMBER 15 - 17, 2026',
          fontSize: 22,
          fontFamily: 'Montserrat',
          fontWeight: '800',
          fill: '#ffffff',
          textAlign: 'center'
        },
        {
          type: 'textbox',
          left: 100,
          top: 955,
          width: 594,
          text: 'Campus Innovation Hub · Register at vspark.edu/codefest',
          fontSize: 16,
          fontFamily: 'Outfit',
          fill: '#94a3b8',
          textAlign: 'center'
        }
      ]
    })
  },
  {
    id: 'tpl-symposium',
    name: 'Global Academic Symposium',
    category: 'University Event',
    thumbnailUrl: IMAGE_ASSETS.symposiumThumb,
    canvasWidth: 794,
    canvasHeight: 1123,
    dimensionName: 'A4 Portrait',
    description: 'Distinguished, scholarly layout in deep royal navy and warm gold typography for research conferences.',
    tags: ['Academic', 'Conference', 'Research', 'Editorial'],
    isFeatured: true,
    isActive: true,
    createdAt: '2026-10-18',
    designJson: buildTemplateJson({
      width: 794,
      height: 1123,
      bgColor: '#0a1428',
      elements: [
        {
          type: 'rect',
          left: 45,
          top: 45,
          width: 704,
          height: 1033,
          fill: 'transparent',
          stroke: '#d4af37',
          strokeWidth: 2
        },
        {
          type: 'rect',
          left: 55,
          top: 55,
          width: 684,
          height: 1013,
          fill: 'transparent',
          stroke: '#d4af37',
          strokeWidth: 0.75
        },
        {
          type: 'textbox',
          left: 90,
          top: 110,
          width: 614,
          text: 'INTERNATIONAL FORUM FOR ADVANCED RESEARCH',
          fontSize: 13,
          fontFamily: 'Outfit',
          fontWeight: '600',
          fill: '#d4af37',
          textAlign: 'center',
          charSpacing: 250
        },
        {
          type: 'textbox',
          left: 90,
          top: 170,
          width: 614,
          text: 'GLOBAL ACADEMIC\nSYMPOSIUM 2026',
          fontSize: 48,
          fontFamily: 'Playfair Display',
          fontWeight: 'bold',
          fill: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.15
        },
        {
          type: 'textbox',
          left: 120,
          top: 310,
          width: 554,
          text: '“Innovations in Sustainability, Machine Intelligence & Ethics”',
          fontSize: 18,
          fontStyle: 'italic',
          fontFamily: 'Playfair Display',
          fill: '#fde047',
          textAlign: 'center'
        },
        {
          type: 'line',
          left: 247,
          top: 380,
          width: 300,
          height: 0,
          stroke: '#d4af37',
          strokeWidth: 1
        },
        {
          type: 'textbox',
          left: 100,
          top: 420,
          width: 594,
          text: 'DISTINGUISHED KEYNOTE SPEAKERS',
          fontSize: 16,
          fontFamily: 'Outfit',
          fontWeight: 'bold',
          fill: '#d4af37',
          textAlign: 'center',
          charSpacing: 150
        },
        {
          type: 'textbox',
          left: 100,
          top: 470,
          width: 594,
          text: 'Prof. Evelyn Reed · Cambridge Institute\nProf. Kenji Tanaka · Tokyo Advanced Tech\nDame Sarah Jenkins · Oxford Chair of Data Policy',
          fontSize: 18,
          fontFamily: 'Plus Jakarta Sans',
          fill: '#f8fafc',
          textAlign: 'center',
          lineHeight: 1.8
        },
        {
          type: 'rect',
          left: 120,
          top: 660,
          width: 554,
          height: 180,
          fill: '#101c38',
          stroke: '#223869',
          strokeWidth: 1,
          rx: 8,
          ry: 8
        },
        {
          type: 'textbox',
          left: 140,
          top: 690,
          width: 514,
          text: 'CALL FOR PAPERS & RESEARCH POSTERS',
          fontSize: 17,
          fontFamily: 'Playfair Display',
          fontWeight: 'bold',
          fill: '#ffffff',
          textAlign: 'center'
        },
        {
          type: 'textbox',
          left: 140,
          top: 730,
          width: 514,
          text: 'Abstract Submission Deadline: October 30, 2026\nAccepted papers will be indexed in IEEE & Springer Digital Libraries.',
          fontSize: 14,
          fontFamily: 'Outfit',
          fill: '#cbd5e1',
          textAlign: 'center',
          lineHeight: 1.6
        },
        {
          type: 'textbox',
          left: 90,
          top: 920,
          width: 614,
          text: 'OCTOBER 14 - 16, 2026 · UNIVERSITY AUDITORIUM',
          fontSize: 16,
          fontFamily: 'Outfit',
          fontWeight: 'bold',
          fill: '#d4af37',
          textAlign: 'center'
        },
        {
          type: 'textbox',
          left: 90,
          top: 960,
          width: 614,
          text: 'Inquiries & Registration: symposium.vspark.edu',
          fontSize: 14,
          fontFamily: 'Outfit',
          fill: '#94a3b8',
          textAlign: 'center'
        }
      ]
    })
  },
  {
    id: 'tpl-cultural-fest',
    name: 'Unity Fest 2026 Cultural Gala',
    category: 'University Event',
    thumbnailUrl: IMAGE_ASSETS.festThumb,
    canvasWidth: 794,
    canvasHeight: 1123,
    dimensionName: 'A4 Portrait',
    description: 'Vibrant magenta, electric violet, and warm amber theme for college spring festivals and concerts.',
    tags: ['Festival', 'Music', 'Arts', 'Campus'],
    isFeatured: true,
    isActive: true,
    createdAt: '2026-10-20',
    designJson: buildTemplateJson({
      width: 794,
      height: 1123,
      bgColor: '#180728',
      elements: [
        {
          type: 'circle',
          left: 197,
          top: 150,
          radius: 200,
          fill: '#ec4899',
          opacity: 0.15
        },
        {
          type: 'textbox',
          left: 70,
          top: 100,
          width: 654,
          text: 'CAMPUS STUDENT COUNCIL PRESENTS',
          fontSize: 14,
          fontFamily: 'Montserrat',
          fontWeight: 'bold',
          fill: '#f472b6',
          textAlign: 'center',
          charSpacing: 200
        },
        {
          type: 'textbox',
          left: 70,
          top: 180,
          width: 654,
          text: 'UNITY FEST\n2026',
          fontSize: 78,
          fontFamily: 'Anton',
          fill: '#fbbf24',
          textAlign: 'center',
          lineHeight: 0.95,
          shadow: { color: '#ec4899', blur: 30, offsetX: 0, offsetY: 0 }
        },
        {
          type: 'textbox',
          left: 70,
          top: 370,
          width: 654,
          text: 'MUSIC · DANCE · VISUAL ARTS · STREET FOOD',
          fontSize: 17,
          fontFamily: 'Montserrat',
          fontWeight: 'bold',
          fill: '#ffffff',
          textAlign: 'center',
          charSpacing: 100
        },
        {
          type: 'rect',
          left: 100,
          top: 440,
          width: 594,
          height: 190,
          fill: '#2b1055',
          stroke: '#d946ef',
          strokeWidth: 2,
          rx: 16,
          ry: 16
        },
        {
          type: 'textbox',
          left: 120,
          top: 465,
          width: 554,
          text: 'FEATURED HEADLINERS',
          fontSize: 16,
          fontFamily: 'Montserrat',
          fontWeight: '800',
          fill: '#f472b6',
          textAlign: 'center'
        },
        {
          type: 'textbox',
          left: 120,
          top: 505,
          width: 554,
          text: '⚡ THE ELEKTRIX (LIVE DJ SET)\n🎸 THE INDIE COLLECTIVE\n🥁 CAMPUS BATTLE OF THE BANDS FINALS',
          fontSize: 18,
          fontFamily: 'Outfit',
          fontWeight: '600',
          fill: '#fef08a',
          textAlign: 'center',
          lineHeight: 1.6
        },
        {
          type: 'textbox',
          left: 80,
          top: 700,
          width: 634,
          text: 'APRIL 19 - 21 · MAIN CAMPUS QUAD',
          fontSize: 24,
          fontFamily: 'Montserrat',
          fontWeight: 'bold',
          fill: '#38bdf8',
          textAlign: 'center'
        },
        {
          type: 'textbox',
          left: 80,
          top: 750,
          width: 634,
          text: 'Gates Open: 4:00 PM Daily · Free Admission for Students with ID',
          fontSize: 16,
          fontFamily: 'Outfit',
          fill: '#cbd5e1',
          textAlign: 'center'
        }
      ]
    })
  },
  {
    id: 'tpl-startup-pitch',
    name: 'Venture Sprint: Student Startup Pitch',
    category: 'Business',
    thumbnailUrl: IMAGE_ASSETS.startupThumb,
    canvasWidth: 794,
    canvasHeight: 1123,
    dimensionName: 'A4 Portrait',
    description: 'Clean, bold, venture capital pitch competition flyer for student innovators and founders.',
    tags: ['Startup', 'Pitch', 'Business', 'Seed Fund'],
    isFeatured: true,
    isActive: true,
    createdAt: '2026-10-22',
    designJson: buildTemplateJson({
      width: 794,
      height: 1123,
      bgColor: '#0f172a',
      elements: [
        {
          type: 'rect',
          left: 60,
          top: 60,
          width: 674,
          height: 1003,
          fill: '#1e293b',
          rx: 20,
          ry: 20
        },
        {
          type: 'textbox',
          left: 90,
          top: 120,
          width: 614,
          text: 'VSPARK ENTREPRENEURSHIP CELL',
          fontSize: 14,
          fontFamily: 'Outfit',
          fontWeight: 'bold',
          fill: '#10b981',
          charSpacing: 200
        },
        {
          type: 'textbox',
          left: 90,
          top: 170,
          width: 614,
          text: 'VENTURE\nSPRINT 2026',
          fontSize: 64,
          fontFamily: 'Montserrat',
          fontWeight: '900',
          fill: '#ffffff',
          lineHeight: 1.0
        },
        {
          type: 'textbox',
          left: 90,
          top: 330,
          width: 614,
          text: 'Fast-Track Your Idea From Campus To Market',
          fontSize: 22,
          fontFamily: 'Outfit',
          fontWeight: '600',
          fill: '#94a3b8'
        },
        {
          type: 'rect',
          left: 90,
          top: 400,
          width: 614,
          height: 140,
          fill: '#064e3b',
          rx: 12,
          ry: 12
        },
        {
          type: 'textbox',
          left: 120,
          top: 430,
          width: 554,
          text: '💰 $25,000 SEED CAPITAL GRANT',
          fontSize: 28,
          fontFamily: 'Montserrat',
          fontWeight: 'bold',
          fill: '#34d399'
        },
        {
          type: 'textbox',
          left: 120,
          top: 480,
          width: 554,
          text: 'Zero equity taken · Mentorship from Top Tier Founders & Angel Syndicates',
          fontSize: 15,
          fontFamily: 'Outfit',
          fill: '#a7f3d0'
        },
        {
          type: 'textbox',
          left: 90,
          top: 590,
          width: 614,
          text: 'APPLICATION TRACKS:\n· B2B SaaS & Enterprise AI\n· ClimateTech & Clean Energy\n· HealthTech & BioInformatics\n· Consumer Apps & FinTech',
          fontSize: 18,
          fontFamily: 'Outfit',
          fill: '#f1f5f9',
          lineHeight: 1.8
        },
        {
          type: 'rect',
          left: 90,
          top: 860,
          width: 614,
          height: 140,
          fill: '#0f172a',
          rx: 12,
          ry: 12
        },
        {
          type: 'textbox',
          left: 120,
          top: 890,
          width: 554,
          text: 'DEADLINE TO SUBMIT: NOVEMBER 25, 2026',
          fontSize: 18,
          fontFamily: 'Montserrat',
          fontWeight: 'bold',
          fill: '#f59e0b'
        },
        {
          type: 'textbox',
          left: 120,
          top: 935,
          width: 554,
          text: 'Submit 5-Slide Deck at venturesprint.vspark.edu',
          fontSize: 15,
          fontFamily: 'Outfit',
          fill: '#cbd5e1'
        }
      ]
    })
  },
  {
    id: 'tpl-workshop',
    name: 'AI & Robotics Hands-on Workshop',
    category: 'Workshop',
    thumbnailUrl: IMAGE_ASSETS.hackathonThumb,
    canvasWidth: 794,
    canvasHeight: 1123,
    dimensionName: 'A4 Portrait',
    description: 'Technical workshop poster with schedule breakdown, prerequisite checklist, and speaker spotlight.',
    tags: ['Workshop', 'Robotics', 'Hands-on', 'Certificate'],
    isFeatured: false,
    isActive: true,
    createdAt: '2026-10-24',
    designJson: buildTemplateJson({
      width: 794,
      height: 1123,
      bgColor: '#0f172a',
      elements: [
        {
          type: 'textbox',
          left: 80,
          top: 90,
          width: 634,
          text: 'DEPARTMENT OF COMPUTER ENGINEERING',
          fontSize: 14,
          fontFamily: 'Outfit',
          fontWeight: 'bold',
          fill: '#38bdf8',
          textAlign: 'center',
          charSpacing: 150
        },
        {
          type: 'textbox',
          left: 80,
          top: 150,
          width: 634,
          text: 'BUILDING AUTONOMOUS\nAI ROBOT AGENTS',
          fontSize: 48,
          fontFamily: 'Montserrat',
          fontWeight: '800',
          fill: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.15
        },
        {
          type: 'textbox',
          left: 100,
          top: 290,
          width: 594,
          text: '3-Day Intensive BootCamp with ROS2 & Vision-Language Models',
          fontSize: 18,
          fontFamily: 'Outfit',
          fill: '#94a3b8',
          textAlign: 'center'
        },
        {
          type: 'rect',
          left: 90,
          top: 360,
          width: 614,
          height: 280,
          fill: '#1e293b',
          rx: 12,
          ry: 12
        },
        {
          type: 'textbox',
          left: 120,
          top: 390,
          width: 554,
          text: 'WHAT YOU WILL LEARN & BUILD:',
          fontSize: 18,
          fontFamily: 'Montserrat',
          fontWeight: 'bold',
          fill: '#38bdf8'
        },
        {
          type: 'textbox',
          left: 120,
          top: 440,
          width: 554,
          text: '✓ Day 1: ROS2 Architecture & Sensor Integration\n✓ Day 2: Training Reinforcement Learning Navigation Policies\n✓ Day 3: Connecting LLMs to Physical Actuators & Grippers',
          fontSize: 16,
          fontFamily: 'Outfit',
          fill: '#f1f5f9',
          lineHeight: 1.9
        },
        {
          type: 'textbox',
          left: 120,
          top: 570,
          width: 554,
          text: '★ Certificate of Completion Awarded by VSpark & IEEE',
          fontSize: 15,
          fontFamily: 'Outfit',
          fontWeight: '600',
          fill: '#facc15'
        },
        {
          type: 'rect',
          left: 90,
          top: 700,
          width: 614,
          height: 180,
          fill: '#0284c7',
          rx: 12,
          ry: 12
        },
        {
          type: 'textbox',
          left: 120,
          top: 730,
          width: 554,
          text: 'DATES: NOVEMBER 12 - 14, 2026',
          fontSize: 22,
          fontFamily: 'Montserrat',
          fontWeight: 'bold',
          fill: '#ffffff',
          textAlign: 'center'
        },
        {
          type: 'textbox',
          left: 120,
          top: 780,
          width: 554,
          text: 'Robotics Lab 304 · Limited to 40 Students\nLaptops Required with Ubuntu/WSL2',
          fontSize: 16,
          fontFamily: 'Outfit',
          fill: '#e0f2fe',
          textAlign: 'center'
        }
      ]
    })
  },
  {
    id: 'tpl-minimal-art',
    name: 'Minimalist Bauhaus Exhibition',
    category: 'Creative & Minimal',
    thumbnailUrl: IMAGE_ASSETS.minimalThumb,
    canvasWidth: 794,
    canvasHeight: 1123,
    dimensionName: 'A4 Portrait',
    description: 'Timeless Swiss / Bauhaus modernist poster with asymmetric balance and striking geometric typography.',
    tags: ['Minimal', 'Bauhaus', 'Design', 'Art'],
    isFeatured: false,
    isActive: true,
    createdAt: '2026-10-25',
    designJson: buildTemplateJson({
      width: 794,
      height: 1123,
      bgColor: '#f4efe6',
      elements: [
        {
          type: 'circle',
          left: 100,
          top: 120,
          radius: 140,
          fill: '#e11d48'
        },
        {
          type: 'rect',
          left: 450,
          top: 200,
          width: 220,
          height: 400,
          fill: '#1e3a8a'
        },
        {
          type: 'triangle',
          left: 200,
          top: 450,
          width: 260,
          height: 260,
          fill: '#eab308'
        },
        {
          type: 'textbox',
          left: 80,
          top: 800,
          width: 634,
          text: 'FORM FOLLOWS FUNCTION',
          fontSize: 42,
          fontFamily: 'Montserrat',
          fontWeight: '900',
          fill: '#0f172a'
        },
        {
          type: 'textbox',
          left: 80,
          top: 860,
          width: 634,
          text: 'VSpark Annual School of Architecture & Fine Arts Exhibition\nGalleries Open Daily 10 AM - 6 PM · Free Public Access',
          fontSize: 16,
          fontFamily: 'Plus Jakarta Sans',
          fill: '#334155',
          lineHeight: 1.6
        }
      ]
    })
  },
  {
    id: 'tpl-sports',
    name: 'Campus Basketball Championship',
    category: 'Sports',
    thumbnailUrl: IMAGE_ASSETS.sportsThumb,
    canvasWidth: 794,
    canvasHeight: 1123,
    dimensionName: 'A4 Portrait',
    description: 'High-energy sports game night poster featuring dynamic contrast, typography, and game schedule.',
    tags: ['Sports', 'Basketball', 'Game Night', 'Athletics'],
    isFeatured: false,
    isActive: true,
    createdAt: '2026-10-26',
    designJson: buildTemplateJson({
      width: 794,
      height: 1123,
      bgColor: '#0c0a09',
      elements: [
        {
          type: 'rect',
          left: 50,
          top: 50,
          width: 694,
          height: 1023,
          fill: 'transparent',
          stroke: '#ea580c',
          strokeWidth: 4
        },
        {
          type: 'textbox',
          left: 80,
          top: 100,
          width: 634,
          text: 'METRO VARSITY LEAGUE FINALS',
          fontSize: 16,
          fontFamily: 'Montserrat',
          fontWeight: '900',
          fill: '#ea580c',
          textAlign: 'center',
          charSpacing: 200
        },
        {
          type: 'textbox',
          left: 80,
          top: 160,
          width: 634,
          text: 'CHAMPIONSHIP\nSHOWDOWN',
          fontSize: 66,
          fontFamily: 'Anton',
          fill: '#ffffff',
          textAlign: 'center',
          lineHeight: 0.95
        },
        {
          type: 'textbox',
          left: 80,
          top: 330,
          width: 634,
          text: 'TITANS vs. FALCONS',
          fontSize: 32,
          fontFamily: 'Montserrat',
          fontWeight: '900',
          fill: '#fbbf24',
          textAlign: 'center'
        },
        {
          type: 'rect',
          left: 100,
          top: 420,
          width: 594,
          height: 140,
          fill: '#1c1917',
          stroke: '#44403c',
          strokeWidth: 1.5,
          rx: 12,
          ry: 12
        },
        {
          type: 'textbox',
          left: 120,
          top: 450,
          width: 554,
          text: 'FRIDAY · NOVEMBER 21 · 7:30 PM',
          fontSize: 24,
          fontFamily: 'Montserrat',
          fontWeight: 'bold',
          fill: '#ffffff',
          textAlign: 'center'
        },
        {
          type: 'textbox',
          left: 120,
          top: 500,
          width: 554,
          text: 'Main Sports Arena · Free Popcorn for first 300 Attendees',
          fontSize: 16,
          fontFamily: 'Outfit',
          fill: '#a8a29e',
          textAlign: 'center'
        }
      ]
    })
  },
  {
    id: 'tpl-social-square',
    name: 'Modern Tech Webinar Square Post',
    category: 'Social Media',
    thumbnailUrl: IMAGE_ASSETS.socialThumb,
    canvasWidth: 1080,
    canvasHeight: 1080,
    dimensionName: 'Instagram Square',
    description: 'Optimized 1:1 square format for Instagram and LinkedIn event announcements.',
    tags: ['Social', 'Webinar', 'Square', 'Promo'],
    isFeatured: false,
    isActive: true,
    createdAt: '2026-10-27',
    designJson: buildTemplateJson({
      width: 1080,
      height: 1080,
      bgColor: '#0f172a',
      elements: [
        {
          type: 'rect',
          left: 80,
          top: 80,
          width: 920,
          height: 920,
          fill: '#1e293b',
          rx: 24,
          ry: 24
        },
        {
          type: 'textbox',
          left: 140,
          top: 150,
          width: 800,
          text: 'LIVE VIRTUAL WEBINAR',
          fontSize: 22,
          fontFamily: 'Montserrat',
          fontWeight: 'bold',
          fill: '#38bdf8',
          charSpacing: 150
        },
        {
          type: 'textbox',
          left: 140,
          top: 220,
          width: 800,
          text: 'MASTERING FULL-STACK\nAI INTEGRATIONS',
          fontSize: 58,
          fontFamily: 'Montserrat',
          fontWeight: '900',
          fill: '#ffffff',
          lineHeight: 1.1
        },
        {
          type: 'textbox',
          left: 140,
          top: 400,
          width: 800,
          text: 'Build production-ready LLM agents, vector search, and real-time streaming interfaces.',
          fontSize: 24,
          fontFamily: 'Outfit',
          fill: '#94a3b8',
          lineHeight: 1.5
        },
        {
          type: 'rect',
          left: 140,
          top: 540,
          width: 800,
          height: 220,
          fill: '#0f172a',
          rx: 16,
          ry: 16
        },
        {
          type: 'textbox',
          left: 180,
          top: 580,
          width: 720,
          text: '📅 THURSDAY, NOV 19 · 6:00 PM EST',
          fontSize: 28,
          fontFamily: 'Montserrat',
          fontWeight: 'bold',
          fill: '#facc15'
        },
        {
          type: 'textbox',
          left: 180,
          top: 640,
          width: 720,
          text: 'Live Q&A · Free Replay Recording · Source Code Starter Pack',
          fontSize: 20,
          fontFamily: 'Outfit',
          fill: '#cbd5e1'
        },
        {
          type: 'textbox',
          left: 140,
          top: 840,
          width: 800,
          text: 'Link in Bio to Register · Limited Spots Available',
          fontSize: 22,
          fontFamily: 'Outfit',
          fontWeight: '600',
          fill: '#38bdf8'
        }
      ]
    })
  }
];
