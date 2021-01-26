import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

import { arePushEventsInLast24Hours, Status } from '../services/github-users';
import { env } from '../config/config';

export const activeUsersController = async (req: Request, res: Response, next: NextFunction) => {
    const username = req.params.userName;

    if (!username) {
        return res.status(400).json({
            message: 'UserName parameter is empty'
        });
    }
    try {
        let page = 1;
        let status = Status.LOAD_MORE;

        while (status === Status.LOAD_MORE && page < env.githubpaginationlimit) {
            const resp = await axios.get(`${env.github}/users/${username}/events/public?page=${page}`);
            status = arePushEventsInLast24Hours(resp.data);
            page++;
        }

        return res.status(200).json({
            active: status === Status.TRUE
        });
    } catch (err) {
        const errorMessage = `Failed to load events for user = ${username}`;
        return res.status(404).json({
            message: errorMessage
        });
    }
};
