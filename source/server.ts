import http from 'http';
import logging from './config/logging';
import { config } from './config/config';
import { app } from './app';

export const httpServer = http.createServer(app);
httpServer.listen(config.server.port, () => logging.info('APP', `Server running on ${config.server.hostname}:${config.server.port}`));
