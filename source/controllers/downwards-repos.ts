import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';

import axios from 'axios';
import { arePushEventsInLast24Hours, Status } from '../services/github-users';
import { env } from '../config/config';

const axiosApi = axios.create({ baseURL: env.github });

const NAMESPACE = 'Downwards Controller';

const downwardsRepos = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Downwords route called.');
    const repoName = req.params.repoName;
    try {
        var resp = await axiosApi.get(`/search/repositories?q=${repoName}&type=repositories`);

        if (resp.data.items.length > 0) {
            const repoEventsUrl = resp.data.items[0].events_url;
            findDeletionAndAdditionEvents(repoEventsUrl);
        }

        return res.status(500).json({
            message: `Unable to find repository with name:${repoName}`
        });
    } catch (err) {
        logging.error(NAMESPACE, 'Failed to load events for user', err);
        return res.status(500);
    }
};

const findDeletionAndAdditionEvents = async (repoUrl: string) => {
    var resp = await axiosApi.get(repoUrl.split(env.github)[1]);
    console.log(repoUrl.split(env.github)[1]);
    console.log(repoUrl);
};

export default {
    downwardsRepos
};
