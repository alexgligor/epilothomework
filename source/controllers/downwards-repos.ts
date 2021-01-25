import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { areMoreAdditonsThenDeletions } from '../services/github-downwards';
import { env } from '../config/config';

const axiosApi = axios.create({ baseURL: env.github });
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export const downwardsController = async (req: Request, res: Response, next: NextFunction) => {
    const repoName = req.params.repoName;
    const userName = req.query.userName;
    const timeFromLastSevenDays = Date.now() - SEVEN_DAYS;
    const secondsFromLastSevenDays = timeFromLastSevenDays.toString().substr(0, 10);

    let ownerAndRepoName = '';
    if (userName) {
        ownerAndRepoName = `${userName}/${repoName}`;
    } else {
        ownerAndRepoName = await fetchOwnerAndRepositoryName(repoName);
    }

    if (!ownerAndRepoName)
        return res.status(404).json({
            message: `No repository with name \'${repoName}\' was found!`
        });

    const findRepoUrl = `/repos/${ownerAndRepoName}/compare/master@{${secondsFromLastSevenDays}}...master`;

    try {
        const resp = await axiosApi.get(findRepoUrl);
        const areMoreAdditions = areMoreAdditonsThenDeletions(resp.data.files);

        return res.status(200).json({
            result: areMoreAdditions
        });
    } catch (err) {
        return res.status(404).json({
            message: `No repository found at path ${ownerAndRepoName}`
        });
    }
};

const fetchOwnerAndRepositoryName = async (repositoriName: string): Promise<string> => {
    const resp = await axiosApi.get(`/search/repositories?q=${repositoriName}&type=repositories`);
    if (resp.data && resp.data.items.length > 0) return resp.data.items[0].full_name;

    return '';
};
