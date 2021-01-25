import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

import logging from '../config/logging';
import { areMoreAdditonsThenDeletions } from '../services/github-downwards';
import { env } from '../config/config';

const axiosApi = axios.create({ baseURL: env.github });

const NAMESPACE = 'Downwards Controller';
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

const downwardsRepos = async (req: Request, res: Response, next: NextFunction) => {
    const repoName = req.params.repoName;
    var value = false;
    try {
        const resp = await axiosApi.get(`/search/repositories?q=${repoName}&type=repositories`);

        if (resp.data && resp.data.items.length > 0) {
            const ownerAndRepoName = resp.data.items[0].full_name;
            const timeFromLastSevenDays = Date.now() - SEVEN_DAYS;
            const secondsFromLastSevenDays = timeFromLastSevenDays.toString().substr(0, 10);
            const extensionUrl = `/repos/${ownerAndRepoName}/compare/master@{${secondsFromLastSevenDays}}...master`;
            const resps = await axiosApi.get(extensionUrl);

            value = areMoreAdditonsThenDeletions(resps.data.files);
        } else
            return res.status(500).json({
                message: `No repository with name \'${repoName}\' was found!`
            });
    } catch (err) {
        const message = `Error during processing`;
        logging.error(NAMESPACE, message);
        return res.status(500).json({
            message: message
        });
    }

    return res.status(200).json({
        result: value
    });
};

export default {
    downwardsRepos
};
