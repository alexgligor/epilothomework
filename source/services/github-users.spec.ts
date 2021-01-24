import { arePushEventsInLast24Hours, Status } from './github-users';

describe('Finding push activity for github user', () => {
    test('Empty list', () => {
        const result = arePushEventsInLast24Hours([]);

        expect(result).toEqual(Status.NONE);
    });
});
