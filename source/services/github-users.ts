const HOURS_24 = 24 * 60 * 60 * 1000;
const PUSH_EVENT_TYPE = 'PushEvent';

export enum Status {
    TRUE,
    NONE,
    LOAD_MORE
}

export const arePushEventsInLast24Hours = (events: any[]): Status => {
    if (!events || events.length < 1) {
        return Status.NONE;
    }

    const firstPushEvent = events.find((event) => event.type === PUSH_EVENT_TYPE);
    if (firstPushEvent) {
        const createdAt = new Date(firstPushEvent.created_at as string);

        return isNewerThen24Hours(createdAt) ? Status.TRUE : Status.NONE;
    }

    const lastPushEvent = events[events.length - 1];
    const createdAt_LastEvent = new Date(lastPushEvent.created_at as string);

    if (isNewerThen24Hours(createdAt_LastEvent)) {
        return Status.LOAD_MORE;
    }

    return Status.NONE;
};

const isNewerThen24Hours = (dateToCheck: Date): boolean => {
    const diff = Math.abs(Date.now() - dateToCheck.getTime());

    return HOURS_24 > diff;
};
