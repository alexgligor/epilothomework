import { activeUsersController } from './active-users';
import request from 'supertest';
import { app } from '../app';
import { httpServer } from '../server';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Checking repository additions and deletions', () => {
    test('Empty list', async () => {
        mockedAxios.post.mockResolvedValueOnce({
            status: 200,
            data: [
                {
                    type: 'PushEvent',
                    created_at: new Date().toISOString()
                },
                {
                    type: 'Other',
                    created_at: new Date().toISOString()
                }
            ]
        });
        const resp = await request(app).get(`/v1/active/userTest`).send();
        expect(resp.status).toBe(200);
    });
});
