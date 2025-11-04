module.exports = async () => {
  const { defineConfig } = await import('vitepress')
  return defineConfig({
    title: 'Vibekit',
    description: 'A framework for building web applications with a unique architecture.',
    themeConfig: {
      nav: [
        { text: 'Home', link: '/' },
        { text: 'Guide', link: '/guide/introduction' }
      ],
      sidebar: {
        '/guide/': [
          {
            text: 'Introduction',
            items: [
              { text: 'What is Vibekit?', link: '/guide/introduction' },
              { text: 'Getting Started', link: '/guide/getting-started' }
            ]
          },
          {
            text: 'Core Concepts',
            items: [
              { text: 'Core Concepts', link: '/guide/core-concepts' },
              { text: 'Theming', link: '/guide/theming' },
              { text: 'Plugin API', link: '/guide/plugin-api' },
              { text: 'Plugin Example: SQLite', link: '/guide/plugin-example-sqlite' }
            ]
          },
          {
            text: 'Guides',
            items: [
              { text: 'CLI', link: '/guide/cli' },
              { text: 'Runtime', link: '/guide/runtime' },
              { text: 'Deployment', link: '/guide/deployment' }
            ]
          }
        ]
      }
    }
  })
}