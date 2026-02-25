// ─────────────────────────────────────────────────────────────────────────────
// SITE CONTENT — Edit everything here. No need to touch page/component files.
// ─────────────────────────────────────────────────────────────────────────────

// Shared types (hoisted so they can be used in home.featuredMedia below)
export type MediaItem = {
  id:        string
  title:     string
  category:  'Photography' | 'Video' | 'Events' | 'Travel'
  year:      string
  href?:     string
  featured?: boolean
}

export type Project = {
  id:          string
  title:       string
  client:      string
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
  category:    'Tools' | 'Reading' | 'Notes' | 'Templates' | 'Courses'
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
  shortName: 'BM',             // Initials / logo text
  role: 'Cybersecurity Consultant & Creative Director',
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
    ogImage: '/public/IMG_9405.JPG',
  },
} as const

// ─────────────────────────────────────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────────────────────────────────────

export const home = {
  hero: {
    availability: 'Available for select projects',
    heading:   site.name,
    roles: ['Technology Consultant', 'Content Creator'],
    tagline:
      'Hi - welcome to my page. I am currently a technology consultant at Crowee LLP, owner of my own media business, and also love creating content!',
    cta: {
      primary:   { text: 'View Work',  href: '/work' },
      secondary: { text: 'View Media', href: '/media' },
    },
  },

  about: {
    label: 'About',
    heading: 'Two disciplines.\nOne perspective.',
    body: [
      'I operate at the intersection of security and creativity. By day I help enterprises navigate complex threat landscapes — zero trust, incident response, and security architecture for organizations that cannot afford to be wrong.',
      'Outside the terminal, I document the world through a lens. Photography, videography, and content creation. The same precision that makes a good security engineer makes a good visual storyteller.',
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
      dates:    '20226 – 2028',
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
        'Analyzed 50,000+ political survey responses using Python to perform data cleaning, aggregation, and statistical analysis, uncovering demographic trends and voter preferences that informed targeted campaign strategies and outreach initiatives',
        'Developed a predictive voter behavior model using Scikit-learn to analyze correlations between demographic factors and political views, enabling data-driven predictions of voting patterns and contributing to a 25% increase in voter turnout',
        'Engineered an automated data pipeline using Python to extract and transform raw VAN campaign data into geospatial voter maps, and created dashboards in Google Data Studio and Tableau to visualize political insights for strategic decision-making',
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
    subheading: 'Security consulting, risk assessment, and digital resilience for organizations that cannot afford to be wrong.',
  },
  filterTags: ['All', 'Cybersecurity', 'Architecture', 'Red Team', 'Compliance', 'Strategy'],
  projects: [
    {
      id:          'p-1',
      title:       'Zero Trust Architecture',
      client:      'Financial Services',
      tags:        ['Cybersecurity', 'Architecture', 'Zero Trust'],
      description: 'Designed and implemented a zero-trust security model for a mid-market financial firm, reducing attack surface by 60% and achieving SOC 2 Type II compliance.',
      year:        '2024',
      outcomes:    ['60% attack surface reduction', 'SOC 2 Type II certified', 'Zero breaches post-deployment'],
    },
    {
      id:          'p-2',
      title:       'Incident Response Program',
      client:      'Healthcare Network',
      tags:        ['Compliance', 'IR', 'HIPAA'],
      description: 'Built an incident response program from the ground up for a regional healthcare network, cutting mean time to detect from weeks to hours.',
      year:        '2024',
      outcomes:    ['MTTR reduced by 80%', 'HIPAA compliant', 'Playbooks for 12 incident types'],
    },
    {
      id:          'p-3',
      title:       'Red Team Assessment',
      client:      'SaaS Platform',
      tags:        ['Red Team', 'Penetration Testing', 'AppSec'],
      description: 'Led a comprehensive red team engagement uncovering critical vulnerabilities across a high-growth SaaS platform before their Series B.',
      year:        '2023',
      outcomes:    ['14 critical CVEs discovered', 'Full remediation roadmap', 'Series B security posture certified'],
    },
    {
      id:          'p-4',
      title:       'Cloud Security Migration',
      client:      'E-commerce Retailer',
      tags:        ['Cybersecurity', 'Architecture', 'Strategy'],
      description: 'Guided a major e-commerce retailer through a full cloud security migration, designing IAM policies, network segmentation, and secrets management.',
      year:        '2023',
      outcomes:    ['PCI DSS compliant', 'Zero-downtime migration', '40% infra cost reduction'],
    },
    {
      id:          'p-5',
      title:       'Security Awareness Program',
      client:      'Professional Services Firm',
      tags:        ['Strategy', 'Compliance'],
      description: 'Designed and delivered a company-wide security awareness program including phishing simulations, training modules, and a CISO reporting framework.',
      year:        '2023',
      outcomes:    ['90% training completion', 'Phishing click rate reduced by 70%', 'Board-level reporting implemented'],
    },
    {
      id:          'p-6',
      title:       'Threat Intelligence Platform',
      client:      'Technology Company',
      tags:        ['Cybersecurity', 'Strategy', 'Architecture'],
      description: 'Architected a custom threat intelligence aggregation platform integrating open-source and commercial feeds into a unified SIEM workflow.',
      year:        '2022',
      outcomes:    ['Real-time threat feeds from 15 sources', '3x faster incident triage', 'Fully automated IOC enrichment'],
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
    subheading: 'Visual work spanning architecture, portraiture, events, and travel. Shot on digital and 35mm film.',
  },
  filterTags: ['All', 'Photography', 'Video', 'Events', 'Travel'],
  items: [
    { id: 'm-1',  title: 'NAV @ Noto, Philadelphia',          category: 'Photography', year: '2026', featured: true },
    { id: 'm-2',  title: 'NAV @ Noto, Philadelphia',             category: 'Photography', year: '2026', featured: true },
    { id: 'm-3',  title: 'NAV @ Noto, Philadelphia',         category: 'Video',       year: '2026', featured: true },
    { id: 'm-4',  title: 'Portolan',                 category: 'Photography', year: '2025' },
    { id: 'm-5',  title: 'Minimalist Series Vol. 2', category: 'Photography', year: '2025' },
    { id: 'm-6',  title: 'Year-End Event Reel',      category: 'Events',      year: '2025' },
    { id: 'm-7',  title: 'Marrakech Dispatch',       category: 'Travel',      year: '2023' },
    { id: 'm-8',  title: 'Abstract Geometries',      category: 'Photography', year: '2023' },
    { id: 'm-9',  title: 'Conference Keynote Film',  category: 'Video',       year: '2023' },
    { id: 'm-10', title: 'Tokyo Fragments',          category: 'Travel',      year: '2022' },
    { id: 'm-11', title: 'Corporate Event: Summit',  category: 'Events',      year: '2022' },
    { id: 'm-12', title: 'Grain Study',              category: 'Photography', year: '2022' },
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
      href:        '#',
      free:        true,
    },
    {
      id:          'v-2',
      title:       'Incident Response Playbook',
      description: 'A battle-tested IR playbook covering 12 common incident scenarios, escalation paths, and communication templates.',
      category:    'Templates',
      tags:        ['IR', 'Compliance', 'Templates'],
      href:        '#',
      free:        false,
    },
    {
      id:          'v-3',
      title:       'Essential Cybersecurity Reading List',
      description: 'Books, papers, and blogs that shaped my approach to security. Regularly updated with new additions.',
      category:    'Reading',
      tags:        ['Security', 'Learning', 'Books'],
      href:        '#',
      free:        true,
    },
    {
      id:          'v-4',
      title:       'Photography Workflow in Lightroom',
      description: 'My end-to-end culling and editing workflow in Lightroom Classic, including preset packs and export settings.',
      category:    'Notes',
      tags:        ['Photography', 'Lightroom', 'Workflow'],
      href:        '#',
      free:        true,
    },
    {
      id:          'v-5',
      title:       'SIEM & Detection Engineering Resources',
      description: 'Curated list of detection rules, sigma queries, and SIEM tuning guides I reference in client engagements.',
      category:    'Tools',
      tags:        ['SIEM', 'Detection', 'Blue Team'],
      href:        '#',
      free:        true,
    },
    {
      id:          'v-6',
      title:       'Creative Brief Template',
      description: 'My standard creative brief for video and photo projects — keeps clients aligned and shoots on schedule.',
      category:    'Templates',
      tags:        ['Creative', 'Production', 'Templates'],
      href:        '#',
      free:        false,
    },
    {
      id:          'v-7',
      title:       'Threat Modeling with STRIDE',
      description: 'A practical guide to threat modeling using the STRIDE framework, with worked examples for web and API applications.',
      category:    'Notes',
      tags:        ['Threat Modeling', 'Security', 'STRIDE'],
      href:        '#',
      free:        true,
    },
    {
      id:          'v-8',
      title:       'Open Source Security Tools Stack',
      description: 'My personally vetted list of open-source security tools for recon, scanning, monitoring, and analysis.',
      category:    'Tools',
      tags:        ['Open Source', 'Tools', 'Security'],
      href:        '#',
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
  intro: 'I\'m available for security consulting engagements, creative projects, speaking, and advisory roles. Fill out the form or reach out directly.',
  subjects: [
    'Security Consulting',
    'Penetration Testing / Red Team',
    'Creative Direction',
    'Photography / Video',
    'Speaking / Advisory',
    'Other',
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
