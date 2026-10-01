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
      components: { Header: './src/components/Header.astro', SocialIcons: './src/components/HeaderNav.astro', PageTitle: './src/components/PageTitle.astro', Head: './src/components/Head.astro', ThemeSelect: './src/components/ThemeSelect.astro' },
      sidebar: [
        'spec/overview',
        group('Common Model', 'spec/common-model'),
        'spec/engine-daemon',
        group('Shared', 'spec/shared'),
        'spec/segment-analyzer',
        group('Causal Structure Layer', 'spec/causal-layer'),
        'spec/decision-module',
        'spec/pep',
        'spec/open-questions',
        {
          label: 'Integrations',
          items: [
            group('Agent', 'integrations/agent'),
            group('AI Gateway', 'integrations/ai-gateway'),
          ],
        },
      ],
    }),
  ],
});
