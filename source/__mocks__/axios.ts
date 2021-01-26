export default {
    get: jest.fn(() =>
        Promise.resolve({
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
        })
    )
};
