import { areMoreAdditonsThenDeletions } from './github-downwards';

describe('Checking repository additions and deletions', () => {
    test('Empty list', () => {
        const result = areMoreAdditonsThenDeletions([]);

        expect(result).toEqual(false);
    });

    test('More additions', () => {
        const result = areMoreAdditonsThenDeletions([
            {
                additions: '1',
                deletions: '0'
            },
            {
                additions: '14',
                deletions: '5'
            }
        ]);

        expect(result).toEqual(true);
    });

    test('More deletions', () => {
        const result = areMoreAdditonsThenDeletions([
            {
                additions: '1',
                deletions: '45'
            },
            {
                additions: '14',
                deletions: '5'
            }
        ]);

        expect(result).toEqual(false);
    });
    test('No additions - No deletions', () => {
        const result = areMoreAdditonsThenDeletions([
            {
                additions: '0',
                deletions: '0'
            },
            {
                additions: '0',
                deletions: '0'
            }
        ]);

        expect(result).toEqual(false);
    });

    test('Additions equals deletions', () => {
        const result = areMoreAdditonsThenDeletions([
            {
                additions: '12',
                deletions: '0'
            },
            {
                additions: '0',
                deletions: '12'
            }
        ]);

        expect(result).toEqual(false);
    });

    test('Missing properties', () => {
        const result = areMoreAdditonsThenDeletions([
            {
                deletions: '0'
            },
            {
                additions: '0'
            }
        ]);

        expect(result).toEqual(false);
    });
});
