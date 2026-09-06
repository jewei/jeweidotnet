export const resumePdfUrl = '/content/files/2026/09/jewei-mak-resume-2026.pdf';

export const resumeMeta = {
  title: 'Résumé',
  headline:
    'Senior backend engineer. Laravel specialist. Scale-tested.',
  summary: [
    'Senior Laravel/PHP engineer with 15+ years building and scaling backend systems, APIs, and payment integrations for products serving 1,000,000+ users across SaaS, edtech, and e-commerce.',
  ],
};

export const coreStrengths = [
  'Laravel/PHP architecture, API design, and database-backed web applications',
  'Payment integrations, SaaS workflows, admin tooling, and internal platforms',
  'Developer experience, code quality, documentation, automated testing, and static analysis',
  'CI/CD, deployment workflows, observability, and production operations',
  'Cloud and platform work across Cloudflare, AWS, OpenShift, Docker, and Linux servers',
  'Technical mentoring, code review, engineering standards, and delivery planning',
  'Agentic AI-assisted engineering workflows with harness agents',
];

export const education = [
  {
    period: '2005',
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
  'Alpine.js',
  'React',
  'Tailwind CSS',
  'PostgreSQL',
  'MySQL',
  'SQLite',
  'Redis',
  'PHPUnit',
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
    period: '2024 – Present',
    highlights: [
      'Engineered and maintained a Laravel/PostgreSQL platform serving 1,000,000+ users and processing 50,000+ monthly transactions',
      'Integrated 10+ payment providers and 70+ payment channels across Asia, expanding regional checkout coverage',
      'Elevated backend engineering standards by defining Laravel architecture patterns, code-quality practices, and implementation guidance as the team Laravel SME',
      'Co-architected 5 microservices, enabling 10x scalability while improving modularity, reliability, and maintainability',
      'Applied agentic AI coding workflows to accelerate development, testing, debugging, and refactoring',
      'Built fraud prevention systems mitigating bot registrations and promotional campaign abuse using behavioral signals, rate limits, anomaly detection, and risk scoring',
    ],
    stack: 'Laravel, Filament, Livewire, PostgreSQL, Claude Code, Codex',
  },
  {
    title: 'Senior Backend Software Engineer',
    company: 'femmily',
    companyUrl: '',
    period: '2023 – 2024',
    highlights: [
      'Refactored and migrated 2 legacy Laravel applications into a more maintainable foundation',
      'Introduced CI/CD and error tracking, increasing deploy frequency from weekly to daily while improving production visibility and incident response',
      'Established coding standards and streamlined Git workflows, including the repository migration from Bitbucket to GitHub',
      'Drove a 3-month-delayed project to an on-time soft launch by standing up the AWS production environment, sharpening delivery focus, and mentoring the team',
    ],
    stack: 'Laravel, MySQL, Livewire, Filament, PHPStan, Pest',
    tools: 'GitHub, Forge, Flare, Bagisto, AWS',
  },
  {
    title: 'Senior Software Engineer',
    company: 'FrogAsia',
    companyUrl: 'https://frogasia.com/?ref=jewei.net',
    period: '2018 – 2023',
    highlights: [
      'Maintained backend APIs for a national learning platform serving 10,000+ Malaysian schools across web and mobile clients',
      'Built and supported an online training platform used by 25+ large corporates, including YTL Construction and YTL Hotels',
      'Delivered features across 7 learning products including Lesson Planner, Curriculum Designer, and an analytics dashboard',
      'Partnered with architects and product owners to convert requirements into end-to-end architecture, technical tasks, and delivery estimates',
      'Improved delivery quality by mentoring peer engineers, removing blockers, reviewing merge requests, and strengthening operational visibility through logging, metrics, health monitoring, Elasticsearch, and data lake pipelines',
    ],
    stack: 'PHP, Laravel, React, MySQL, Firebase, RabbitMQ, Red Hat OpenShift Linux',
    tools: 'GitLab, CI/CD pipelines, OpenShift, Docker, Figma, Vault, NiFi',
  },
  {
    title: 'Principal Software Engineer',
    company: 'ModeFair',
    companyUrl: 'https://modefair.com/?ref=jewei.net',
    period: '2016 – 2018',
    highlights: [
      'Led backend architecture and API design for an e-commerce application covering campaign management, merchant onboarding, product listings, business reporting, and audit logs',
      'Implemented zero-downtime deployment and rollback workflows, eliminating release-related downtime',
      'Managed deployments across staging, production servers, and supporting cloud services',
      'Built supporting microservices for image compression, PDF report generation, and social media data mining, cutting processing time by 80%',
      'Established coding standards, design patterns, and backend guidelines across the team',
    ],
    stack: 'Ubuntu, Nginx, PHP 7, AWS EC2, S3, RDS, Cloudflare, Laravel, Redis',
    tools: 'Deployer, Composer, Git, SSH, Slack, Let\'s Encrypt',
  },
  {
    title: 'Application Developer',
    company: 'P\\S\\L Group',
    companyUrl: 'https://www.pslgroup.com/?ref=jewei.net',
    period: '2013 – 2016',
    highlights: [
      'Developed dynamic filtered newsfeed systems from aggregated data for pharmaceutical industry clients',
      'Built an automated newsletter builder and email tracking system for targeted healthcare content delivery',
      'Deployed micro-social sites with live newsfeeds and newsletter workflows',
    ],
    stack: 'CentOS, Apache, PHP 5, MySQL, Drupal',
    tools: 'Drush, G Suite, SVN, PHP_CodeSniffer, PHPUnit',
  },
  {
    title: 'Software Developer',
    company: 'Stackideas',
    companyUrl: 'https://stackideas.com/?ref=jewei.net',
    period: '2011 – 2013',
    highlights: [
      'Built product features for EasyBlog, EasyDiscuss, and Komento Joomla CMS extensions',
      'Supported customers through forum and ticket workflows, translating product issues into fixes and improvements',
    ],
    stack: 'Apache, PHP, Joomla, JavaScript, CSS',
  },
  {
    title: 'Software Engineer',
    company: 'Slashes and Dots',
    companyUrl: '',
    period: '2009 – 2011',
    highlights: [
      'Built core product features for the JomSocial Joomla CMS extension',
      'Implemented video uploads and a custom video player with Amazon S3 integration',
    ],
    stack: 'Apache, PHP, Joomla',
  },
];
