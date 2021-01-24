import dotenv from 'dotenv';
dotenv.config();

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 1342;
const GITHUB_URL = process.env.GITHUB_URL || 'https://api.github.com';
const GITHUB_PAGINATION_LIMIT = process.env.GITHUB_PAGINATION_LIMIT || 10;

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
};

export const config = {
    server: SERVER,
    github: {
        url: GITHUB_URL
    }
};

export const env = {
    github: GITHUB_URL,
    githubpaginationlimit: GITHUB_PAGINATION_LIMIT
};
