import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';

import { FileReader } from './file-reader.interface.js';
import { City, HousingType, Location, Offer, User } from '../../types/index.js';

import { convertStrToBoolean } from '../../helpers/index.js';

export class TSVFileReader extends EventEmitter implements FileReader {
  private CHUNK_SIZE = 16384; // 16KB

  constructor(
    private readonly filename: string
  ) {
    super();
  }

  private parseLineToOffer(line: string): Offer {
    const [
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
    ] = line.split('\t').map((item) => item.trim());

    return {
      title,
      description,
      publishedAt: new Date(publishedAt),
      city: this.parseCity(cityName, cityLocation),
      previewImage,
      images: this.parseStrArray(images),
      isPremium: convertStrToBoolean(isPremium),
      isFavorite: convertStrToBoolean(isFavorite),
      rating: +rating,
      housingType: housingType as HousingType,
      roomCount: +roomCount,
      guestCount: +guestCount,
      price: +price,
      facilities: this.parseStrArray(facilities),
      user: {
        name: userName,
        email: userEmail,
        avatar: userAvatar,
        password: userPassword,
        role: userRole
      } as User,
      location: this.parseLocation(location)
    };
  }

  private parseCity(name: string, location: string): City {
    const parsedLocation = this.parseLocation(location);

    return { name, location: parsedLocation };
  }

  private parseLocation(location: string): Location {
    const [latitude, longitude] = this.parseStrArray(location).map((prop) => prop);
    return { latitude, longitude };
  }

  private parseStrArray(str: string): string[] {
    return str.split(';');
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: this.CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();
      nextLinePosition = remainingData.indexOf('\n');

      while (nextLinePosition >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);

        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        const parsedOffer = this.parseLineToOffer(completeRow);

        await new Promise((resolve) => {
          this.emit('line', parsedOffer, resolve);
        });

        nextLinePosition = remainingData.indexOf('\n');
      }
    }

    this.emit('end', importedRowCount);
  }
}
