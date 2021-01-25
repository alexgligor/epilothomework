import { arePushEventsInLast24Hours, Status } from './github-users';

describe('Finding push activity for github user', () => {
    test('Empty list', () => {
        const result = arePushEventsInLast24Hours([]);

        expect(result).toEqual(Status.NONE);
    });

    test('User Activity', () => {
        const result = arePushEventsInLast24Hours([
            {
                type: 'PushEvent',
                created_at: new Date().toISOString()
            },
            {
                type: 'Other',
                created_at: new Date().toISOString()
            }
        ]);

        expect(result).toEqual(Status.TRUE);
    });

    test('Old PushEvent', () => {
        const result = arePushEventsInLast24Hours([
            {
                type: 'PushEvent',
                created_at: '2020-01-25T11:29:43.284Z'
            },
            {
                type: '2020-01-25T11:29:43.284Z',
                created_at: new Date().toISOString()
            }
        ]);

        expect(result).toEqual(Status.NONE);
    });

    test('Load Next Page', () => {
        const result = arePushEventsInLast24Hours([
            {
                type: 'Other',
                created_at: new Date().toISOString()
            },
            {
                type: 'Other',
                created_at: new Date().toISOString()
            }
        ]);

        expect(result).toEqual(Status.LOAD_MORE);
    });
});
