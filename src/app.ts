import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import { errorHandler, notFoundHandler } from './shared/middlewares/error-handler';
import { success } from './shared/types/api-response';
import { authRouter } from './modules/auth/auth.routes';
import { configRouter } from './modules/config/config.routes';
import { staffRouter } from './modules/staff/staff.routes';
import { clientsRouter } from './modules/clients/clients.routes';
import { warehouseRouter } from './modules/warehouse/warehouse.routes';
import { projectsRouter } from './modules/projects/projects.routes';
import { usersRouter } from './modules/users/users.routes';

export const createApp = (): Application => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json(
      success({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      }),
    );
  });

  app.use('/api/auth', authRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/config', configRouter);
  app.use('/api/staff', staffRouter);
  app.use('/api/clients', clientsRouter);
  app.use('/api/warehouse', warehouseRouter);
  app.use('/api/projects', projectsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
