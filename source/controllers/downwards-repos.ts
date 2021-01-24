import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';

import axios from 'axios';
import { arePushEventsInLast24Hours, Status } from '../services/github-users';
import { env } from '../config/config';

const axiosApi = axios.create({ baseURL: env.github });

const NAMESPACE = 'Downwards Controller';

const activeUsers = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Active users route called.');
    const repoName = req.params.repoName;
    try {
        // const resp = await axiosApi.get(`/users/${username}/events/public`);
        return res.status(200).json({
            active: false
        });
    } catch (err) {
        logging.error(NAMESPACE, 'Failed to load events for user', err);
        return res.status(500);
    }
};

const userInfo = (username: string) => {};

const downwardsRepo = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Downwards repo route called.');

    return res.status(200).json({
        active: true,
        repository: req.params.repositoryName
    });
};

export default {
    activeUsers,
    downwardsRepo
};
