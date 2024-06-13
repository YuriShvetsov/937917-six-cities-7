import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { getErrorMessage, getMongoURI } from '../../shared/helpers/index.js';
import { Offer, UserRole } from '../../shared/types/index.js';

import { DefaultUserService, UserModel, UserService } from '../../shared/modules/user/index.js';
import { DefaultOfferService, OfferModel, OfferService } from '../../shared/modules/offer/index.js';
import { DefaultFavoriteOfferService, FavoriteOfferModel, FavoriteOfferService } from '../../shared/modules/favorite-offer/index.js';
import { DefaultCityService, CityModel, CityService } from '../../shared/modules/city/index.js';

import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';

import { Logger } from '../../shared/libs/logger/index.js';
import { ConsoleLogger } from '../../shared/libs/logger/console.logger.js';
import { DEFAULT_DB_PORT } from './command.constant.js';

export class ImportCommand implements Command {
  private salt: string;

  private logger: Logger;
  private databaseClient: DatabaseClient;

  private userService: UserService;
  private offerService: OfferService;
  private favoriteOfferService: FavoriteOfferService;
  private cityService: CityService;

  constructor() {
    this.onImportedOffer = this.onImportedOffer.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.databaseClient = new MongoDatabaseClient(this.logger);

    this.userService = new DefaultUserService(this.logger, UserModel);
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
    this.favoriteOfferService = new DefaultFavoriteOfferService(this.logger, FavoriteOfferModel);
    this.cityService = new DefaultCityService(this.logger, CityModel);
  }

  public getName(): string {
    return '--import';
  }

  private async onImportedOffer(offer: Offer, resolve: () => void) {
    await this.saveOffer(offer);
    resolve();
  }

  private async saveOffer(data: Offer) {
    const user = await this.userService.findOrCreate({
      name: data.user.name,
      email: data.user.email,
      password: data.user.password,
      avatar: data.user.avatar,
      role: UserRole[data.user.role]
    }, this.salt);

    const [city] = await Promise.all([
      this.cityService.create(data.city),
      this.favoriteOfferService.findOrCreate({
        userId: user?.id,
        items: []
      })
    ]);

    const offer = await this.offerService.create({
      title: data.title,
      description: data.description,
      publishedAt: data.publishedAt,
      cityId: city?.id,
      previewImage: data.previewImage,
      images: data.images,
      isPremium: data.isPremium,
      rating: data.rating,
      housingType: data.housingType,
      roomCount: data.roomCount,
      guestCount: data.guestCount,
      price: data.price,
      facilities: data.facilities,
      userId: user?.id,
      location: data.location
    });

    if (data.isFavorite) {
      await this.favoriteOfferService.addItem(user?.id, offer?.id);
    }
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
    this.databaseClient.disconnect();
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    const uri = getMongoURI({
      username: login,
      password,
      host,
      port: DEFAULT_DB_PORT,
      databaseName: dbname
    });

    this.salt = salt;

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedOffer);
    fileReader.on('end', this.onCompleteImport);

    try {
      fileReader.read();
    } catch (error) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));
    }
  }
}
