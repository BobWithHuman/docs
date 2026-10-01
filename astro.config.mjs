import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const group = (label, directory) => ({ label, items: [{ autogenerate: { directory } }] });

export default defineConfig({
  site: 'https://bobwithhuman.github.io',
  base: '/docs',
  integrations: [
    starlight({
      title: 'WithHuman Docs',
      tableOfContents: false,
      logo: { src: './src/assets/logo.png' },
      customCss: ['./src/styles/theme.css'],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/BobWithHuman/docs' }],
      components: { SocialIcons: './src/components/HeaderNav.astro', PageTitle: './src/components/PageTitle.astro', Head: './src/components/Head.astro' },
      sidebar: [
        group('Introduction', 'introduction'),
        group('Getting Started', 'getting-started'),
        group('Concepts', 'concepts'),
        group('Architecture', 'architecture'),
        {
          label: 'Integrations',
          items: [
            group('Agent', 'integrations/agent'),
            group('AI Gateway', 'integrations/ai-gateway'),
          ],
        },
        group('Security', 'security'),
        group('Guides', 'guides'),
        group('Reference', 'reference'),
        group('Development', 'development'),
      ],
    }),
  ],
});
