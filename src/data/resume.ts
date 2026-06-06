export const resumePdfUrl = '/content/files/2026/06/jewei-resume-2026.pdf';

export const resumeMeta = {
  title: 'Résumé',
  description:
    'Senior Laravel/PHP backend engineer with 15+ years of experience building scalable products, APIs, integrations, and engineering delivery systems.',
  headline: 'Senior Engineer',
  summary: [
    'Experienced Software Engineer specializing in Laravel/PHP backend systems, API architecture, payment integrations, legacy modernization, and engineering delivery practices. Experienced across SaaS, edtech, e-commerce, healthcare content platforms, and commercial PHP products.',
    'Senior IC with a track record of turning ambiguous requirements into pragmatic architecture, reliable APIs, production-ready systems, and improved engineering delivery workflows.',
  ],
};

export const coreStrengths = [
  'Laravel/PHP architecture, API design, and database-backed web applications',
  'Payment integrations, SaaS workflows, admin tooling, and internal platforms',
  'Developer experience, code quality, documentation, automated testing, and static analysis',
  'CI/CD, deployment workflows, observability, and production operations',
  'Cloud and platform work across Cloudflare, AWS, OpenShift, Docker, and Linux servers',
  'Technical mentoring, code review, engineering standards, and delivery planning',
  'AI-assisted engineering for analysis, documentation, workflow efficiency, and problem-solving',
];

export const education = [
  {
    period: '2001 — 2005',
    degree: 'Electronics Engineering',
    institution: 'TARC, Malaysia',
  },
];

export const techStack = [
  'Laravel',
  'PHP',
  'Filament',
  'Livewire',
  'Inertia.js',
  'Vue.js',
  'React',
  'Tailwind CSS',
  'PostgreSQL',
  'MySQL',
  'Redis',
  'Pest',
  'PHPStan',
  'Docker',
  'AWS',
  'Cloudflare',
  'OpenShift',
  'RabbitMQ',
  'Elasticsearch',
];

export interface ResumeRole {
  title: string;
  company: string;
  companyUrl: string;
  period: string;
  highlights: string[];
  stack?: string;
  tools?: string;
}

export const experience: ResumeRole[] = [
  {
    title: 'Senior Software Engineer',
    company: 'Oneverse',
    companyUrl: 'https://oneone.com/?ref=jewei.net',
    period: '2024 — Present',
    highlights: [
      'Build and maintain the core app with Laravel, Filament, Tailwind CSS, Pest, and PostgreSQL.',
      'Integrated 10+ payment providers and 70+ payment channels across Asia, expanding checkout coverage for regional users.',
      "Serve as the team's Laravel subject-matter expert, guiding backend design, implementation choices, and code quality.",
      'Co-architected microservices-based systems to improve scalability, modularity, and long-term maintainability.',
    ],
    stack: 'Laravel, Filament, Inertia.js, Vue.js, Livewire, Tailwind CSS, Pest',
  },
  {
    title: 'Senior Backend Software Engineer',
    company: 'femmily',
    companyUrl: 'https://femmily.com/?ref=jewei.net',
    period: '2023 — 2024',
    highlights: [
      'Refactored and migrated two legacy Laravel applications into a more maintainable foundation.',
      'Introduced CI/CD and error tracking to improve release confidence, production visibility, and incident response.',
      'Established coding standards and streamlined Git workflows, including the repository migration from Bitbucket to GitHub.',
      'Architected and set up the AWS production environment for the soft-launch phase.',
      'Supported a delayed project through its soft-launch deadline by sharpening delivery focus, mentoring team members, and aligning stakeholder priorities.',
    ],
    stack: 'Laravel, MySQL, Livewire, Filament, PHPStan, Pest',
    tools: 'GitHub, Forge, AWS',
  },
  {
    title: 'Senior Software Engineer',
    company: 'FrogAsia',
    companyUrl: 'https://frogasia.com/?ref=jewei.net',
    period: '2018 — 2023',
    highlights: [
      'Maintained backend APIs for a national learning platform serving 10,000+ Malaysian schools across web and mobile clients.',
      'Built and supported an online training platform used by 25+ large corporates, including YTL Construction and YTL Hotels.',
      'Delivered features across Lesson Planner, Curriculum Designer, Boost, Certificate, Courses, Workspaces, and analytics dashboard products.',
      'Partnered with architects and product owners to convert requirements into end-to-end architecture, technical tasks, and delivery estimates.',
      'Improved delivery quality by mentoring peer engineers, removing blockers, reviewing merge requests, and strengthening operational visibility through logging, metrics, health monitoring, Elasticsearch, and data lake pipelines.',
    ],
    stack: 'PHP, Laravel, React, MySQL, Firebase, RabbitMQ, Red Hat OpenShift Linux',
    tools: 'GitLab, CI/CD pipelines, OpenShift, Docker, Figma, Vault, NiFi',
  },
  {
    title: 'Principal Software Engineer',
    company: 'ModeFair',
    companyUrl: 'https://modefair.com/?ref=jewei.net',
    period: '2016 — 2018',
    highlights: [
      'Led backend architecture and API design for an e-commerce application covering campaign management, merchant onboarding, product listings, business reporting, and audit logs.',
      'Implemented zero-downtime deployment and rollback workflows to reduce release risk.',
      'Managed deployments across staging, production servers, and supporting cloud services.',
      'Built supporting microservices for image compression, PDF report generation, and social media data mining across Instagram and Facebook.',
      'Promoted coding standards, design patterns, engineering guidelines, and backend best practices across the team.',
    ],
    stack: 'Ubuntu, Nginx, PHP 7, AWS EC2, S3, RDS, Cloudflare, Laravel, Redis',
    tools: 'Deployer, Composer, Git, SSH, Slack, Let\'s Encrypt',
  },
  {
    title: 'Application Developer',
    company: 'P\\S\\L Group',
    companyUrl: 'https://www.pslgroup.com/?ref=jewei.net',
    period: '2013 — 2016',
    highlights: [
      'Developed dynamic filtered newsfeed systems from aggregated data for pharmaceutical industry clients.',
      'Built an automated newsletter builder and email tracking system for targeted healthcare content delivery.',
      'Deployed micro-social sites with live newsfeeds and newsletter workflows.',
      'Received the Level 1 Real-Time Recognition Award.',
    ],
    stack: 'CentOS, Apache, PHP 5, MySQL, Drupal',
    tools: 'Drush, G Suite, SVN, PHP_CodeSniffer, PHPUnit',
  },
  {
    title: 'Software Developer',
    company: 'Stackideas',
    companyUrl: 'https://stackideas.com/?ref=jewei.net',
    period: '2011 — 2013',
    highlights: [
      'Built product features for EasyBlog, EasyDiscuss, and Komento Joomla CMS extensions.',
      'Supported customers through forum and ticket workflows, translating product issues into fixes and improvements.',
    ],
    stack: 'Apache, PHP, Joomla, JavaScript, CSS',
  },
  {
    title: 'Software Engineer',
    company: 'Slashes and Dots',
    companyUrl: '',
    period: '2009 — 2011',
    highlights: [
      'Built core product features for the JomSocial Joomla CMS extension.',
      'Implemented video uploads and a custom video player with Amazon S3 integration.',
    ],
    stack: 'Apache, PHP, Joomla',
  },
];
