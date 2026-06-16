import { createApp } from './app';
import { env } from './shared/config/env';

const app = createApp();

app.listen(env.port, () => {
  console.info(`🚀 melamina-saas-backend running on http://localhost:${env.port}`);
  console.info(`   Environment: ${env.nodeEnv}`);
  console.info(`   Health check: http://localhost:${env.port}/health`);
});
