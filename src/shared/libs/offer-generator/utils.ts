import dayjs from 'dayjs';

export const IMAGES_COUNT = 6;

export const MIN_RATING = 1;
export const MAX_RATING = 5;

export const MIN_ROOM_COUNT = 1;
export const MAX_ROOM_COUNT = 8;

export const MIN_GUEST_COUNT = 1;
export const MAX_GUEST_COUNT = 10;

export const MIN_PRICE = 100;
export const MAX_PRICE = 100000;

export const MIN_PUBLISHED_AT = dayjs().toISOString();
export const MAX_PUBLISHED_AT = dayjs().add(7, 'day').toISOString();

export const MIN_FACILITIES_COUNT = 0;
export const MAX_FACILITIES_COUNT = 7;
