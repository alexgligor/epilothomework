import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

import logging from '../config/logging';
import { arePushEventsInLast24Hours, Status } from '../services/github-users';
import { env } from '../config/config';

const axiosApi = axios.create({ baseURL: env.github });
const NAMESPACE = 'Sample Controller';

const activeUsers = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Active users route called.');
    const username = req.params.userName;
    try {
        var page = 1;
        var status = Status.LOAD_MORE;

        while (status === Status.LOAD_MORE) {
            const resp = await axiosApi.get(`/users/${username}/events/public?page=${page}`);
            status = arePushEventsInLast24Hours(resp.data);
            page++;

            if (page > env.githubpaginationlimit) {
                status = Status.NONE;
                break;
            }
        }

        return res.status(200).json({
            active: status === Status.TRUE
        });
    } catch (err) {
        const errorMessage = `Failed to load events for user = ${username}, user is unknowen`;
        logging.error(NAMESPACE, errorMessage);

        return res.status(500).json({
            message: errorMessage
        });
    }
};

export default {
    activeUsers
};
