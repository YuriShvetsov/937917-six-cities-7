import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';

import { FavoriteOfferService } from './favorite-offer-service.interface.js';
import { FavoriteOfferEntity } from './favorite-offer.entity.js';
import { CreateFavoriteOfferDto } from './dto/create-favorite-offer.dto.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';

@injectable()
export class DefaultFavoriteOfferService implements FavoriteOfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.FavoriteOfferModel) private readonly favoriteOfferModel: types.ModelType<FavoriteOfferEntity>
  ) {}

  public async create(dto: CreateFavoriteOfferDto): Promise<DocumentType<FavoriteOfferEntity>> {
    const result = await this.favoriteOfferModel.findOneAndUpdate(
      { ...dto },
      {},
      { upsert: true, new: true }
    );

    this.logger.info(`New favorite offer created: ${result}`);

    return result;
  }

  public async findOrCreate(dto: CreateFavoriteOfferDto): Promise<DocumentType<FavoriteOfferEntity>> {
    const foundFavoriteOffer = await this.findByUserId(dto.userId);
    return foundFavoriteOffer ?? this.create(dto);
  }

  public async findByUserId(userId: string): Promise<DocumentType<FavoriteOfferEntity> | null> {
    return this.favoriteOfferModel.findOne({ userId });
  }

  public async deleteByUserId(userId: string): Promise<DocumentType<FavoriteOfferEntity> | null> {
    return this.favoriteOfferModel.findByIdAndDelete({ userId });
  }

  public async addItem(userId: string, offerId: string): Promise<DocumentType<FavoriteOfferEntity> | null> {
    return this.favoriteOfferModel.findOneAndUpdate({ userId }, { $push: { items: offerId } });
  }
}
