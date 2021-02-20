module.exports = {
  title: 'Chris Perks',
  tagline: 'Building software',
  url: 'https://chrisperks.github.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'chrisperks', // Usually your GitHub org/user name.
  projectName: 'chrisperks.github.io', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Chris Perks',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      items: [
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'My Links',
          items: [
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/in/christofr/',
            },
            {
              label: 'Github',
              href: 'https://github.com/christofur',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Chris Perks`,
    },
    prism: {
      additionalLanguages: ['csharp', 'powershell'],
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          path: 'docs',
          routeBasePath: '/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
