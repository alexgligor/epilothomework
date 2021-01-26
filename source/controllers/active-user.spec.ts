import { httpServer } from '../server';
import supertest from 'supertest';

const request = supertest.agent(httpServer);
describe('Checking user activity', () => {
    it('Positive feedback', async (done) => {
        const res = await request
            .get(`/v1/active/user_test`)
            .expect(200)
            .then((response) => {
                expect(response.body).toHaveProperty('active', true);
            });
        done();
    });
});
