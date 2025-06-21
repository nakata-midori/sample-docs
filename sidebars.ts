import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '主要機能',
      link: { type: 'doc', id: 'features' },
      items: [
        'feature-attendance',
        'feature-application',
        'feature-dashboard',
        'feature-report',
        'feature-mobile',
        'feature-ai',
        'feature-chatbot',
        'feature-health',
      ],
    },
    'account',
    {
      type: 'category',
      label: '管理者機能',
      link: { type: 'doc', id: 'admin-overview' },
      items: [
        'admin-account',
        'admin-roles',
        'admin-worklocation',
        'admin-ai',
      ],
    },
    'faq',
    'support',
  ],
};

export default sidebars;
