import express from 'express';
import controller from './controllers/active-users';

export const routes = express.Router();

routes.get('/active/:userName', controller.activeUsers);
routes.get('/downwards/:repoName', controller.downwardsRepo);
