const HOURS_24 = 24 * 60 * 60 * 1000;

export enum Status {
    TRUE,
    NONE,
    LOAD_MORE
}

export const arePushEventsInLast24Hours = (events: any[]): Status => {
    if (!events || events.length < 1) {
        return Status.NONE;
    }

    const pushEvent = events.find((event) => event.type === 'PushEvent');
    if (pushEvent) {
        const createdAt = new Date(pushEvent.created_at as string);
        if (isNewerThen24Hours(createdAt)) {
            return Status.TRUE;
        }
    }

    const lastEvent = events[events.length - 1];
    if (isNewerThen24Hours(lastEvent)) {
        return Status.LOAD_MORE;
    }

    return Status.NONE;
};

const isNewerThen24Hours = (dateToCheck: Date): boolean => {
    const now = new Date();
    const diff = Math.abs(dateToCheck.getDate() - now.getDate());
    return diff < HOURS_24;
};
