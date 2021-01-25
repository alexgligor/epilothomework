import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { areMoreAdditonsThenDeletions } from '../services/github-downwards';
import { env } from '../config/config';

const axiosApi = axios.create({ baseURL: env.github });
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export const downwardsRepos = async (req: Request, res: Response, next: NextFunction) => {
    const repoName = req.params.repoName;
    const userName = req.params.userName;
    var ownerAndRepoName = '';
    const timeFromLastSevenDays = Date.now() - SEVEN_DAYS;
    const secondsFromLastSevenDays = timeFromLastSevenDays.toString().substr(0, 10);

    var value = false;

    if (!userName) {
        ownerAndRepoName = await fetchOwnerAndRepositoryName(repoName);
        if (ownerAndRepoName === '')
            return res.status(500).json({
                message: `No repository with name \'${repoName}\' was found!`
            });
    } else {
        ownerAndRepoName = `${userName}/${repoName}`;
    }

    const extensionUrl = `/repos/${ownerAndRepoName}/compare/master@{${secondsFromLastSevenDays}}...master`;
    try {
        console.log(extensionUrl);
        const resp = await axiosApi.get(extensionUrl);
        value = areMoreAdditonsThenDeletions(resp.data.files);
    } catch (err) {
        return res.status(500).json({
            message: `No repository found at path ${ownerAndRepoName}`
        });
    }

    return res.status(200).json({
        result: value
    });
};

const fetchOwnerAndRepositoryName = async (repositoriName: string): Promise<string> => {
    const resp = await axiosApi.get(`/search/repositories?q=${repositoriName}&type=repositories`);
    if (resp.data && resp.data.items.length > 0) return resp.data.items[0].full_name;

    return '';
};

export default {
    downwardsRepos
};
