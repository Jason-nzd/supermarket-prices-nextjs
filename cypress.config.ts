import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },

  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      on('task', {
        log(message: string) {
          // prints to the Node process stdout (visible in npx cypress run)
          // eslint-disable-next-line no-console
          console.log(message);
          return null;
        },
      });

      return config;
    },
    video: false,
    defaultCommandTimeout: 20000,
  },
});
