import { httpServer } from '../server';
//import mockAxios from '../__mocks__/axios';
import supertest, { SuperAgentTest } from 'supertest';
import axios from 'axios';

jest.mock('axios');
let request: SuperAgentTest;
const mockAxios = axios as jest.Mocked<typeof axios>;

describe('Checking user activity', () => {
    beforeAll(() => {
        request = supertest.agent(httpServer);
    });
    afterAll(() => {
        httpServer.close();
    });

    it('Positive feedback', async (done) => {
        mockAxios.get.mockResolvedValueOnce({
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
        await request
            .get(`/v1/active/user_test`)
            .expect(200)
            .then((response) => {
                expect(response.body).toHaveProperty('active', true);
            });
        done();
    });

    it('No push events from user ', async (done) => {
        mockAxios.get.mockResolvedValueOnce(() =>
            Promise.resolve({
                data: [
                    {
                        type: 'Other',
                        created_at: new Date().toISOString()
                    },
                    {
                        type: 'Other',
                        created_at: new Date().toISOString()
                    }
                ]
            })
        );

        await request
            .get(`/v1/active/user_test`)
            .expect(200)
            .then((response) => {
                expect(response.body).toHaveProperty('active', false);
            });
        done();
    });

    it('Old activity ', async (done) => {
        mockAxios.get.mockResolvedValueOnce({
            data: [
                {
                    type: 'PushEvent',
                    created_at: '2020-01-25T11:29:43.284Z'
                },
                {
                    type: 'PushEvent',
                    created_at: '2020-01-25T11:29:43.284Z'
                }
            ]
        });
        await request
            .get(`/v1/active/user_test`)
            .expect(200)
            .then((response) => {
                expect(response.body).toHaveProperty('active', false);
            });
        done();
    });

    it('Bad request', async (done) => {
        mockAxios.get.mockResolvedValueOnce({
            data: [
                {
                    type: 'PushEvent',
                    created_at: '2020-01-25T11:29:43.284Z'
                },
                {
                    type: 'PushEvent',
                    created_at: '2020-01-25T11:29:43.284Z'
                }
            ]
        });
        await request
            .get(`/v1/active/user_test/badrequest`)
            .expect(404)
            .then((response) => {
                expect(response.body).toHaveProperty('message', 'Service not found');
            });
        done();
    });
});
