import { City } from './city.type.js';
import { HousingType } from './housing-type.enum.js';
import { User } from './user.type.js';

export type MockServerData = {
  titles: string[];
  descriptions: string[];
  publishedAt: string[];
  cities: City[];
  previewImages: string[];
  images: string[];
  housingTypes: HousingType[];
  facilities: string[];
  users: User[];
}
