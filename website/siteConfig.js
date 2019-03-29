const siteConfig = {
  title: 'PipeHub',
  tagline: 'A programmable proxy',
  url: 'https://pipehub.io',
  baseUrl: '/',
  projectName: 'pipehub.github.io',
  organizationName: 'pipehub',
  cname: 'pipehub.io',
  headerLinks: [
    { doc: 'introduction', label: 'Documentation' },
    { href: "https://github.com/pipehub/pipehub", label: "Source code" },
    { page: 'credit', label: 'Credit' },
  ],
  headerIcon: 'img/pipe.svg',
  footerIcon: 'img/pipe.svg',
  favicon: 'img/favicon.png',
  colors: {
    primaryColor: '#48a9dc',
    secondaryColor: '#F9A45E',
  },
  copyright: `Copyright © ${new Date().getFullYear()} PipeHub`,
  highlight: {
    theme: 'default',
  },
  scripts: ['https://buttons.github.io/buttons.js'],
  onPageNav: 'separate',
  cleanUrl: true,
  ogImage: 'img/pipe.png',
  twitterImage: 'img/pipe.png',
};

module.exports = siteConfig;
