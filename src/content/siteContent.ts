// ─────────────────────────────────────────────────────────────────────────────
// SITE CONTENT — Edit everything here. No need to touch page/component files.
// ─────────────────────────────────────────────────────────────────────────────

// Shared types (hoisted so they can be used in home.featuredMedia below)
export type MediaItem = {
  id:        string
  title:     string
  category:  'Photography' | 'Video' | 'Events' | 'Travel' | 'Concerts' | 'Graduation' | 'Personal'
  year:      string
  src?:      string   // image path (e.g. '/images/photo.jpg') or YouTube URL
  href?:     string
  featured?: boolean
}

export type Project = {
  id:          string
  title:       string
  category:    'Web Programming' | 'Data Analytics' | 'Software Engineering' | 'Product' | 'Media'
  tags:        string[]
  description: string
  year:        string
  outcomes?:   string[]
  href?:       string
}

export type VaultItem = {
  id:          string
  title:       string
  description: string
  category:    'Tools' | 'Reading' | 'Notes' | 'Templates' | 'Courses' | 'Content'
  tags:        string[]
  href:        string
  free:        boolean
  thumbnail?:  string   // optional override; YouTube thumbs are auto-extracted from href
}

export type EducationItem = {
  id:       string
  school:   string
  logo:     string   // path in /public/logos/ — leave '' for letter monogram fallback
  degree:   string
  dates:    string
  location: string
}

export type Experience = {
  id:        string
  company:   string
  logo:      string            // path in /public/logos/ or absolute URL; leave '' for letter monogram
  location:  string
  jobTitle:  string
  startDate: string            // e.g. 'Jan 2022'
  endDate:   string            // e.g. 'Present' or 'Dec 2023'
  bullets:   [string, string, string]
}

export const site = {
  // ── IDENTITY ────────────────────────────────────────────────────────────────
  name: 'Bhavin Mistry',        // Full display name
  shortName: 'Bhavin Mistry',             // Initials / logo text
  role: 'Technology Consultant & Creative Director',
  location: 'New Jersey / New York',
  email: 'bhavinmistry198@gmail.com',
  url: 'https://yoursite.com', // No trailing slash

  // ── SOCIAL LINKS ─────────────────────────────────────────────────────────────
  social: {
    twitter:   'https://x.com/bhavin_m28',
    linkedin:  'https://www.linkedin.com/in/bhavinmistry-/',
    github:    'https://github.com/bhavinmistry7',
    instagram: 'https://www.instagram.com/bhavinmistryy/',
  },

  // ── SEO DEFAULTS ─────────────────────────────────────────────────────────────
  seo: {
    description:
      'Cybersecurity consultant and creative director. I help organizations build resilient digital infrastructure and craft compelling visual narratives.',
    ogImage: '/public/about.jpg',
  },
} as const

// ─────────────────────────────────────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────────────────────────────────────

export const home = {
  hero: {
    heading:   site.name,
    roles: ['Technology Consultant', 'Content Creator'],
    tagline:
      'Hi - welcome to my page. Scroll to explore!',
    cta: {
      primary:   { text: 'View Work',  href: '/work' },
      secondary: { text: 'View Media', href: '/media' },
    },
  },

  about: {
    label: 'About',
    heading: 'The art of multiple passions',
    body: [
      'My whole life, I have been told to pick a niche and stick with it. As I enter my mid 20s, I\'ve decided to respectfully decline that advice. All my interests, passions, and projects exist on this page.',
      'From playing with new technologies, creating content, using my camera to tell my favorite stories, my deep passion for sports, and the world of fitness, this site encompasses every aspect of me, and offers resources for anyone looking to pursue the same interests.',
    ],
    cta: { text: 'Get in touch', href: '/contact' },
  },

  featuredWork: [
    {
      id:          'fw-1',
      title:       'Zero Trust Architecture',
      client:      'Financial Services',
      tags:        ['Cybersecurity', 'Architecture', 'Zero Trust'],
      description: 'Designed and implemented a zero-trust security model for a mid-market financial firm, reducing attack surface by 60% and achieving SOC 2 Type II compliance.',
      year:        '2024',
      href:        '/work',
    },
    {
      id:          'fw-2',
      title:       'Incident Response Program',
      client:      'Healthcare Network',
      tags:        ['IR', 'Compliance', 'HIPAA'],
      description: 'Built an incident response program from the ground up for a regional healthcare network, cutting mean time to detect from weeks to hours.',
      year:        '2024',
      href:        '/work',
    },
    {
      id:          'fw-3',
      title:       'Red Team Assessment',
      client:      'SaaS Platform',
      tags:        ['Red Team', 'Penetration Testing', 'AppSec'],
      description: 'Led a comprehensive red team engagement uncovering critical vulnerabilities across a high-growth SaaS platform before their Series B.',
      year:        '2023',
      href:        '/work',
    },
  ],

  featuredMedia: [
    {
      id:       'fm-1',
      title:    'Urban Nocturne',
      category: 'Photography',
      year:     '2024',
      href:     '/media',
    },
    {
      id:       'fm-2',
      title:    'Desert Light',
      category: 'Photography',
      year:     '2024',
      href:     '/media',
    },
    {
      id:       'fm-3',
      title:    'Tech Summit 2024',
      category: 'Video',
      year:     '2024',
      href:     '/media',
    },
  ] satisfies MediaItem[],
}

// ─────────────────────────────────────────────────────────────────────────────
// EDUCATION
// ─────────────────────────────────────────────────────────────────────────────

export const education = {
  label:   'Education',
  heading: 'Academic\nBackground',
  items: [
    {
      id:       'edu-1',
      school:   'Rutgers University',
      logo:     '/Rutgers_Athletics_Logo.png',
      degree:   'Bachelor of Arts, Information Technology',
      dates:    '2020 – 2024',
      location: 'New Brunswick, NJ',
    },
    {
      id:       'edu-2',
      school:   'New Jersey Institute of Technology',
      logo:     '/njit-new-jersey-institute-of-technology-logo-png_seeklogo-452334.png',   // TODO: drop logo at /public/logos/edu-2.png and set path here
      degree:   'Masters of Science, Computer Science',
      dates:    '2026 – 2028',
      location: 'Newark, NJ',
    },
  ] satisfies EducationItem[],
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPERIENCE
// ─────────────────────────────────────────────────────────────────────────────

export const experience = {
  label:   'Experience',
  heading: 'Where I\'ve\nWorked',
  items: [
    {
      id:        'exp-1',
      company:   'Crowe LLP',
      logo:      '/Crowe_Logo.png',            // add /logos/accenture.png when ready
      location:  'New York, NY',
      jobTitle:  'Technology Consultant',
      startDate: 'August 2024',
      endDate:   'Present',
      bullets: [
        'Conducted 50+ user research and discovery sessions with CIOs, CTOs, and Risk Managers across 10+ financial services clients, synthesizing stakeholder requirements to define product improvements for authentication and identity platforms',
        'Led product walkthroughs, status reviews, and debrief meetings with technical & non-technical stakeholders across wealth management and banking clients, delivering 10+ reports that reduced platform friction and strengthened security posture',
        'Translated complex security findings into actionable roadmaps for zero trust architecture and access governanceimprovements, partnering with client engineering and compliance teams to ship features across 10+ engagements',
      ] as [string, string, string],
    },
    {
      id:        'exp-2',
      company:   'Bluebonnet Data',
      logo:      '/bluebonnet_data_logo.jpeg',            // add /logos/deloitte.png when ready
      location:  'Remote',
      jobTitle:  'Data Science Fellow',
      startDate: 'July 2022',
      endDate:   'November 2022',
      bullets: [
        'Analyzed 50,000+ political survey responses using Python to perform data cleaning, statistical analysis, and demographic segmentation, surfacing voter preference trends that informed targeted campaign strategy and outreach decisions',
        'Built a predictive voter behavior model using Scikit-learn to identify correlations between demographic factors and political views, enabling data-driven campaign targeting that contributed to a 25% increase in voter turnout across key districts',
        'Engineered an automated Python data pipeline to extract and transform raw VAN campaign data into geospatial voter maps, delivering Tableau and Google Data Studio dashboards that visualized political insights for cross-functional strategy teams',
      ] as [string, string, string],
    },
    {
      id:        'exp-3',
      company:   'Bhavin Mistry Media',
      logo:      '/mistry png.png',
      location:  'Freehold, NJ',
      jobTitle:  'Owner',
      startDate: 'Jan 2021',
      endDate:   'Jul 2022',
      bullets: [
        'Build and scale media business to $10,000+ annual revenue (2025) across 10+ clients by defining service offerings, pricing strategy, and iterating based on client feedback to expand capabilities from photography to multi-camera live streaming productions',
        'Manage client relationships and project scope for 50+ deliverables, including private events and commercial projects, gathering requirements during discovery calls and coordinating production workflows with vendors to meet deadlines',
        'Design and operate streaming infrastructure for 5+ collegiate competitions reaching 5,000+ viewers, managing real-time video switching and audio mixing to deliver a seamless viewing experience with zero technical downtime during live events',
      ] as [string, string, string],
    },
  ] satisfies Experience[],
}

// ─────────────────────────────────────────────────────────────────────────────
// WORK PAGE
// ─────────────────────────────────────────────────────────────────────────────

export const work = {
  hero: {
    label:      'Selected Work',
    heading:    'Personal Projects',
    subheading: 'Projects I\'ve built, shipped, or contributed to, spanning application development, data, and creative work.',
  },
  filterTags: ['All', 'Web Programming', 'Data Analytics', 'Software Engineering', 'Product', 'Media'],
  projects: [
    {
      id:          'p-1',
      title:       'Personal Website / Portfolio',
      category:    'Web Programming',
      tags:        ['Web Development', 'AI Agent'],
      description: 'Designed and built my own website from scratch using Next.js, TypeScript, and Tailwind CSS, no templates. The goal was to build a single place that reflects both sides of what I do: security consulting and creative work. It has a project portfolio, media gallery, resource vault, and contact form, all deployed live on Vercel',
      year:        'February 2026',
      outcomes:    ['Demonstrated full-stack product development skills, owning the entire lifecycle from requirements and design to deployment'],
      href:        'https://github.com/bhavinmistry7/personal-website',   // TODO: replace with actual project URL
    },
    {
      id:          'p-2',
      title:       'Soccer Shot Analysis and Visualization',
      category:    'Data Analytics',
      tags:        ['Data Analytics', 'Sports'],
      description: 'Built a football analytics tool that lets you ask questions about player performance in plain English and get back real visualizations, shot maps, pass maps, heat maps. Feed it a question like "how does Haaland shoot from inside the box?" and it returns an actual chart, not just a number. Powered by Python and trained on 1,200+ shot records from real match data.',
      year:        'September 2024',
      outcomes:    ['Demonstrated end-to-end product thinking, from data pipeline design to user-facing interaction — applying Python, data visualization, and AI to turn raw football data into something actually useful and fun to use'],
      href:        'https://github.com/bhavinmistry7/Footy',  
    },
    
  ] satisfies Project[],
}

// ─────────────────────────────────────────────────────────────────────────────
// MEDIA PAGE
// ─────────────────────────────────────────────────────────────────────────────

export const media = {
  hero: {
    label:      'Media',
    heading:    'Photography\n& Film',
    subheading: 'Full media portfolio, which encompasses concerts, private events, dance teams, graduation shoots, and more',
  },
  filterTags: ['All', 'Concerts', 'Graduation', 'Personal', 'Travel'],
  items: [
    { id: 'm-1',  title: 'NAV @ Noto, Philadelphia', category: 'Concerts', year: '2026', src: '/DSC01206-Enhanced-NR.jpg', featured: true },
    { id: 'm-2',  title: 'NAV @ Noto, Philadelphia', category: 'Concerts', year: '2026', src: '/DSC01253-Enhanced-NR.jpg', featured: true },
    { id: 'm-3',  title: 'NAV @ Noto, Philadelphia', category: 'Concerts', year: '2026', src: '/DSC01423-Enhanced-NR.jpg', featured: true },
    { id: 'm-4',  title: 'NAV @ Noto, Philadelphia', category: 'Concerts', year: '2026', src: '/DSC01699-Enhanced-NR.jpg' },
    { id: 'm-5',  title: 'NAV @ Noto, Philadelphia', category: 'Concerts', year: '2026', src: '/DSC01901-Enhanced-NR.jpg' },
    { id: 'm-6',  title: 'NAV @ Noto, Philadelphia', category: 'Concerts', year: '2026', src: '/DSC01939-Enhanced-NR.jpg' },
    { id: 'm-7',  title: 'NAV @ Noto, Philadelphia', category: 'Concerts', year: '2026', src: '/DSC02039-Enhanced-NR.jpg' },
    { id: 'm-8',  title: 'NAV @ Noto, Philadelphia', category: 'Concerts', year: '2026', src: '/DSC02142-2-Enhanced-NR.jpg' },
    { id: 'm-9',  title: 'NAV @ Noto, Philadelphia',  category: 'Concerts',    year: '2026', src: '/DSC02160-Enhanced-NR.jpg' },
    // ── Graduation Shoots 2025 ─────────────────────────────────────────────
    { id: 'm-13', title: 'Graduation Shoots 2025', category: 'Graduation', year: '2025', src: '/DSC02713-Enhanced-NR.jpg' },
    { id: 'm-14', title: 'Graduation Shoots 2025', category: 'Graduation', year: '2025', src: '/DSC02743-Enhanced-NR.jpg', featured: true },
    { id: 'm-15', title: 'Graduation Shoots 2025', category: 'Graduation', year: '2025', src: '/DSC02753-Enhanced-NR.jpg', featured: true },
    { id: 'm-16', title: 'Graduation Shoots 2025', category: 'Graduation', year: '2025', src: '/DSC02764-Enhanced-NR.jpg' },
    { id: 'm-17', title: 'Graduation Shoots 2025', category: 'Graduation', year: '2025', src: '/DSC02781-Enhanced-NR.jpg' },
    { id: 'm-18', title: 'Graduation Shoots 2025', category: 'Graduation', year: '2025', src: '/DSC02792-Enhanced-NR.jpg' },
    { id: 'm-19', title: 'Graduation Shoots 2025', category: 'Graduation', year: '2025', src: '/DSC02801-Enhanced-NR.jpg' },
    { id: 'm-20', title: 'Graduation Shoots 2025', category: 'Graduation', year: '2025', src: '/DSC02839-Enhanced-NR.jpg' },
    { id: 'm-21', title: 'Graduation Shoots 2025', category: 'Graduation', year: '2025', src: '/DSC02855-Enhanced-NR.jpg' },
    { id: 'm-22', title: 'Graduation Shoots 2025', category: 'Graduation', year: '2025', src: '/DSC02893-Enhanced-NR.jpg' },
    { id: 'm-23', title: 'Graduation Shoots 2025', category: 'Graduation', year: '2025', src: '/DSC02918-Enhanced-NR.jpg' },
    { id: 'm-24', title: 'Graduation Shoots 2025', category: 'Graduation', year: '2025', src: '/DSC02924-Enhanced-NR.jpg' },
    { id: 'm-25', title: 'Graduation Shoots 2025', category: 'Graduation', year: '2025', src: '/DSC02934-Enhanced-NR.jpg' },
    { id: 'm-26', title: 'Graduation Shoots 2025', category: 'Graduation', year: '2025', src: '/DSC02949-Enhanced-NR.jpg' },
    { id: 'm-27', title: 'Graduation Shoots 2025', category: 'Graduation', year: '2025', src: '/DSC02955-Enhanced-NR.jpg' },
    { id: 'm-28', title: 'Graduation Shoots 2025', category: 'Graduation', year: '2025', src: '/DSC02986-Enhanced-NR.jpg' },
    { id: 'm-29', title: 'Graduation Shoots 2025', category: 'Graduation', year: '2025', src: '/DSC09052-Enhanced-NR.jpg' },
    { id: 'm-30', title: 'Graduation Shoots 2025', category: 'Graduation', year: '2025', src: '/DSC09061-Enhanced-NR.jpg' },
    { id: 'm-31', title: 'Graduation Shoots 2025', category: 'Graduation', year: '2025', src: '/DSC09071-Enhanced-NR.jpg' },
    { id: 'm-32', title: 'Graduation Shoots 2025', category: 'Graduation', year: '2025', src: '/DSC09072-Enhanced-NR.jpg' },
    { id: 'm-33', title: 'Graduation Shoots 2025', category: 'Graduation', year: '2025', src: '/DSC09073-Enhanced-NR.jpg' },
    { id: 'm-34', title: 'Graduation Shoots 2025', category: 'Graduation', year: '2025', src: '/DSC09172-Enhanced-NR.jpg' },
    // ── Koad @ Rutgers University 2024 ────────────────────────────────────
    { id: 'm-35', title: 'Koad @ Rutgers University', category: 'Concerts', year: '2024', src: '/DSC09675-Enhanced-NR.jpg', featured: true },
    { id: 'm-36', title: 'Koad @ Rutgers University', category: 'Concerts', year: '2024', src: '/DSC09753.jpg' },
    { id: 'm-37', title: 'Koad @ Rutgers University', category: 'Concerts', year: '2024', src: '/DSC09756.jpg' },
    { id: 'm-38', title: 'Koad @ Rutgers University', category: 'Concerts', year: '2024', src: '/DSC09783-2.jpg' },
    { id: 'm-39', title: 'Koad @ Rutgers University', category: 'Concerts', year: '2024', src: '/DSC09788.jpg' },
    { id: 'm-40', title: 'Koad @ Rutgers University', category: 'Concerts', year: '2024', src: '/DSC09841.jpg' },
    { id: 'm-41', title: 'Koad @ Rutgers University', category: 'Concerts', year: '2024', src: '/DSC09878.jpg' },
    { id: 'm-42', title: 'Koad @ Rutgers University', category: 'Concerts', year: '2024', src: '/DSC09915-Enhanced-NR.jpg' },
    { id: 'm-43', title: 'Koad @ Rutgers University', category: 'Concerts', year: '2024', src: '/DSC09985.jpg' },
    { id: 'm-44', title: 'Koad @ Rutgers University', category: 'Concerts', year: '2024', src: '/DSC09996.jpg' },
    // ── San Francisco, CA 2024 ────────────────────────────────────────────
    { id: 'm-45', title: 'San Francisco, CA', category: 'Travel', year: '2024', src: '/DSC09035-Enhanced-NR.jpg' },
    { id: 'm-46', title: 'San Francisco, CA', category: 'Travel', year: '2024', src: '/DSC09038-Enhanced-NR.jpg' },
    { id: 'm-47', title: 'San Francisco, CA', category: 'Travel', year: '2024', src: '/DSC09047-Enhanced-NR.jpg' },
    { id: 'm-48', title: 'San Francisco, CA', category: 'Travel', year: '2024', src: '/DSC09050-Enhanced-NR.jpg' },
    { id: 'm-49', title: 'San Francisco, CA', category: 'Travel', year: '2024', src: '/DSC09100-Enhanced-NR.jpg' },
    { id: 'm-50', title: 'San Francisco, CA', category: 'Travel', year: '2024', src: '/DSC09180-Enhanced-NR.jpg' },
    { id: 'm-51', title: 'San Francisco, CA', category: 'Travel', year: '2024', src: '/DSC09339-Enhanced-NR.jpg' },
    { id: 'm-52', title: 'San Francisco, CA', category: 'Travel', year: '2024', src: '/DSC09348-Enhanced-NR.jpg' },
    { id: 'm-53', title: 'San Francisco, CA', category: 'Travel', year: '2024', src: '/DSC09349-Enhanced-NR.jpg' },
    { id: 'm-54', title: 'San Francisco, CA', category: 'Travel', year: '2024', src: '/DSC09356-Enhanced-NR.jpg' },
    { id: 'm-55', title: 'San Francisco, CA', category: 'Travel', year: '2024', src: '/DSC09369-Enhanced-NR.jpg' },
    { id: 'm-56', title: 'San Francisco, CA', category: 'Travel', year: '2024', src: '/DSC09375-Enhanced-NR.jpg' },
    { id: 'm-57', title: 'San Francisco, CA', category: 'Travel', year: '2024', src: '/DSC09381-Enhanced-NR.jpg' },
    { id: 'm-58', title: 'San Francisco, CA', category: 'Travel', year: '2024', src: '/DSC09385-Enhanced-NR.jpg' },
    { id: 'm-59', title: 'San Francisco, CA', category: 'Travel', year: '2024', src: '/DSC09503-Enhanced-NR.jpg' },
    { id: 'm-60', title: 'San Francisco, CA', category: 'Travel', year: '2024', src: '/DSC09628-Enhanced-NR.jpg' },
    { id: 'm-61', title: 'San Francisco, CA', category: 'Travel', year: '2024', src: '/DSC09728-Enhanced-NR.jpg' },
    { id: 'm-62', title: 'San Francisco, CA', category: 'Travel', year: '2024', src: '/DSC09748-Enhanced-NR.jpg' },
  
  ] satisfies MediaItem[],
}

// ─────────────────────────────────────────────────────────────────────────────
// VAULT PAGE
// ─────────────────────────────────────────────────────────────────────────────

export const vault = {
  hero: {
    label:      'The Vault',
    heading:    'Resources &\nReferences',
    subheading: 'Some of my favorite reads, resources, and current interests. Current fixations: using AI agents like Claude code to turn my imagination into reality and watching Real Madrid \npainfully every week.',
  },
  filterTags: ['All', 'Tools', 'Reading', 'Notes', 'Content', 'Courses'],
  items: [
    {
      id:          'v-1',
      title:       'If you have multiple interests, do not waste the next 2-3 years',
      description: 'An article by Dan Koe explaining the steps to maximize having interests in multiple fields. It teaches you multiple interests are a superpower - not a deficiency.',
      category:    'Reading',
      tags:        ['Self-Development', 'Content Creation'],
      href:        'https://x.com/thedankoe/status/2010042119121957316',
      free:        true,
    },
    {
      id:          'v-2',
      title:       'A Motorcycle for the Mind: Naval Ravikant\'s AI Episode',
      description: 'A battle-tested IR playbook covering 12 common incident scenarios, escalation paths, and communication templates.',
      category:    'Content',
      tags:        ['Technology', 'Self-Help', 'Podcasts'],
      href:        'https://x.com/naval/status/2024700227111047581?s=20',
      free:        true,
    },
   
  ] satisfies VaultItem[],
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT PAGE
// ────────────────────────────────────────────────────────────────��────────────

export const contact = {
  hero: {
    label:   'Contact',
    heading: 'Let\'s Work\nTogether',
  },
  intro: 'Feel free to email me to chat!',
  subjects: [
    'Coffee Chat',
    'Creative Direction',
    'Photography / Video',
    'Speaking / Advisory',
    'Brand Partnerships',
    'Other'
  ],
  email: site.email,
  social: site.social,
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────────────────────────

export const nav = {
  links: [
    { label: 'Work',    href: '/work' },
    { label: 'Media',   href: '/media' },
    { label: 'Vault',   href: '/vault' },
    { label: 'Contact', href: '/contact' },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────

export const footer = {
  tagline:   'Built at the intersection of security and story.',
  copyright: `© ${new Date().getFullYear()} ${site.name}. All rights reserved.`,
}
