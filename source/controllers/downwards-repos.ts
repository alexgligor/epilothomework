import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';

import axios from 'axios';
import { areMoreAdditonsThenDeletions } from '../services/github-downwards';
import { env } from '../config/config';

const axiosApi = axios.create({ baseURL: env.github });

const NAMESPACE = 'Downwards Controller';
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

const downwardsRepos = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Downwords route called.');
    const repoName = req.params.repoName;
    try {
        var resp = await axiosApi.get(`/search/repositories?q=${repoName}&type=repositories`);

        if (resp.data.items.length > 0) {
            const fullName = resp.data.items[0].full_name;
            const timeFromLastSevenDays = Date.now() - SEVEN_DAYS;
            const timestamp = timeFromLastSevenDays.toString().substr(0, 10);
            const extensionUrl = `/repos/${fullName}/compare/master@{${timestamp}}...master`;

            var resps = await axiosApi.get(extensionUrl); //fetch data from last week

            const value = areMoreAdditonsThenDeletions(resps.data.files);

            return res.status(200).json({
                result: value
            });
        }

        return res.status(500).json({
            message: `Unable to find repository with name:${repoName}`
        });
    } catch (err) {
        logging.error(NAMESPACE, 'Failed to load events for user');
        return res.status(500).json({
            message: `Unable to find repository with name:${repoName}`
        });
    }
};

export default {
    downwardsRepos
};
