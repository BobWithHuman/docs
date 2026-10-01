import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const group = (label, directory) => ({ label, items: [{ autogenerate: { directory } }] });

export default defineConfig({
  site: 'https://bobwithhuman.github.io',
  base: '/docs',
  integrations: [
    starlight({
      title: 'WithHuman Docs',
      logo: { src: './src/assets/withhuman_logo.png' },
      customCss: ['./src/styles/theme.css'],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/BobWithHuman/docs' }],
      components: { SocialIcons: './src/components/HeaderNav.astro', PageTitle: './src/components/PageTitle.astro', Head: './src/components/Head.astro' },
      sidebar: [
        { label: 'Introduction', items: [{ label: 'Overview', link: '/' }, { autogenerate: { directory: 'introduction' } }] },
        group('Getting Started', 'getting-started'),
        group('Concepts', 'concepts'),
        group('Architecture', 'architecture'),
        group('Integrations', 'integrations'),
        group('Security', 'security'),
      ],
    }),
  ],
});
