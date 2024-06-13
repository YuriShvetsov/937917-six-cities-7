import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData, Location } from '../../types/index.js';
import {
  generateRandomValue,
  getRandomItem,
  getRandomDate,
  getRandomItemsSet,
  generateRandomBoolean
} from '../../helpers/index.js';

import {
  IMAGES_COUNT,
  MIN_RATING,
  MAX_RATING,
  MIN_ROOM_COUNT,
  MAX_ROOM_COUNT,
  MIN_GUEST_COUNT,
  MAX_GUEST_COUNT,
  MIN_PRICE,
  MAX_PRICE,
  MIN_PUBLISHED_AT,
  MAX_PUBLISHED_AT,
  MIN_FACILITIES_COUNT,
  MAX_FACILITIES_COUNT
} from './utils.js';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const facilitiesCount = generateRandomValue(MIN_FACILITIES_COUNT, MAX_FACILITIES_COUNT);
    const city = getRandomItem(this.mockData.cities);
    const user = getRandomItem(this.mockData.users);

    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const publishedAt = getRandomDate(MIN_PUBLISHED_AT, MAX_PUBLISHED_AT);
    const cityName = city.name;
    const cityLocation = `${city.location.latitude};${city.location.longitude}`;
    const previewImage = getRandomItem(this.mockData.previewImages);
    const images = getRandomItemsSet(this.mockData.images, IMAGES_COUNT).join(';');
    const isPremium = generateRandomBoolean();
    const isFavorite = generateRandomBoolean();
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1);
    const housingType = getRandomItem(this.mockData.housingTypes);
    const roomCount = generateRandomValue(MIN_ROOM_COUNT, MAX_ROOM_COUNT);
    const guestCount = generateRandomValue(MIN_GUEST_COUNT, MAX_GUEST_COUNT);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const facilities = getRandomItemsSet(this.mockData.facilities, facilitiesCount).join(';');
    const userName = user.name;
    const userEmail = user.email;
    const userRole = user.role;
    const userPassword = user.password;
    const userAvatar = user.avatar;
    const location = this.generateRandomLocation(city.location);

    return [
      title,
      description,
      publishedAt,
      cityName,
      cityLocation,
      previewImage,
      images,
      isPremium,
      isFavorite,
      rating,
      housingType,
      roomCount,
      guestCount,
      price,
      facilities,
      userName,
      userEmail,
      userRole,
      userPassword,
      userAvatar,
      location
    ].join('\t');
  }

  private generateRandomLocation(sourceLocation: Location): string {
    const { latitude, longitude } = sourceLocation;
    const newLatitude = generateRandomValue(Math.floor(+latitude), Math.floor(+latitude) + 1, 6);
    const newLongitude = generateRandomValue(Math.floor(+longitude), Math.floor(+longitude) + 1, 6);

    return `${newLatitude};${newLongitude}`;
  }
}
