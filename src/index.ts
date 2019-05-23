import {API} from './api';

export * from './definition';
export * from './api';
export * from './device';
export * from './entry';
export * from './event';
export * from './event-listener';
export * from './execution';
export * from './gateway';
export * from './location';
export * from './place';
export * from './setup';

const api: API = new API({
    host: 'ha110-1.overkiz.com', // Cozyyouch host
    user: 'XXX',
    password: 'XXX',
    polling: {
        always: false,
        interval: 1000
    }
});
api.getSetup()