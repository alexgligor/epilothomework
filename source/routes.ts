import express from 'express';
import active from './controllers/active-users';
import downword from './controllers/downwards-repos';

export const routes = express.Router();

routes.get('/active/:userName', active.activeUsers);
routes.get('/downwards/:repoName', downword.downwardsRepos);
